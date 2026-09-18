import { Request, Response } from 'express';
import prisma from '../config/db';
import exceljs from 'exceljs';
import fs from 'fs';
import { PDFParse } from 'pdf-parse';

export const uploadOfficialRecords = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const scholarshipProgram = req.body.scholarshipProgram || 'Official List';

    const filePath = file.path;
    const recordsToInsert: any[] = [];
    
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      // PDF Parsing Logic
      const dataBuffer = fs.readFileSync(filePath);
      const parser = new PDFParse({ data: dataBuffer });
      const data = await parser.getText();
      const text = data.text;
      
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      let i = 0;
      let recordsFound = 0;

      while (i < lines.length) {
        if (lines[i] === 'TES-') {
          // TES Masterlist standard multi-line structure
          // Award No is split over i to i+3
          const awardNo = lines.slice(i, i + 4).join('');
          // App ID is split over i+4 to i+6
          const appId = lines.slice(i + 4, i + 7).join('');
          
          // The names and sex are on the following lines. We gather them until we hit MALE or FEMALE.
          let nameTokens: string[] = [];
          let sexIndex = -1;
          for (let j = i + 7; j < i + 20 && j < lines.length; j++) {
            const lineParts = lines[j].split(' ');
            nameTokens.push(...lineParts);
            if (lines[j].endsWith('MALE') || lines[j].endsWith('FEMALE')) {
              sexIndex = j;
              break;
            }
          }
          
          if (sexIndex !== -1) {
            // nameTokens = ["1", "DELA", "CRUZ", "JOHN", "MALE"]
            const batch = nameTokens.shift() || '';
            const sex = nameTokens.pop() || '';
            
            // We can't reliably split multi-word last names (like DELA CRUZ), 
            // so we put the first token in lastName and the rest in firstName,
            // and we will combine them during cross-referencing.
            const lastName = nameTokens.length > 0 ? nameTokens[0] : '';
            const firstName = nameTokens.slice(1).join(' ');
            
            recordsToInsert.push({
              firstName,
              lastName,
              middleName: '', // Not reliably extractable, part of firstName now
              scholarshipProgram: scholarshipProgram !== 'Official List' ? scholarshipProgram : 'TES',
              listReference: awardNo,
              studentId: appId,
              rawData: { batch, sex, rawName: nameTokens.join(' ') }
            });
            recordsFound++;
            i = sexIndex; // Skip ahead
          }
        }
        i++;
      }

      if (recordsFound === 0) {
         // If our specific heuristics didn't match, PDF parsing is too risky for a generic table.
         fs.unlinkSync(filePath);
         res.status(400).json({ 
           error: 'Could not automatically extract tabular data from this PDF format. Please upload the Excel (.xlsx) or CSV version of this masterlist for accurate processing.' 
         });
         return;
      }
    } else {
      // Excel / CSV Parsing
      const workbook = new exceljs.Workbook();
      
      if (file.mimetype === 'text/csv' || file.originalname.toLowerCase().endsWith('.csv')) {
        await workbook.csv.readFile(filePath);
      } else {
        await workbook.xlsx.readFile(filePath);
      }

      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        throw new Error('No worksheet found in the file.');
      }

      let isFirstRow = true;
      let headerMap: { [key: string]: number } = {};
      let headers: string[] = [];

      worksheet.eachRow((row, rowNumber) => {
        const rowValues = row.values as any[];
        if (isFirstRow) {
          rowValues.forEach((val, index) => {
            if (val) {
              const headerStr = val.toString().trim();
              headerMap[headerStr.toLowerCase()] = index;
              headers[index] = headerStr;
            }
          });
          isFirstRow = false;
        } else {
          const findVal = (possibleHeaders: string[]) => {
            for (const header of possibleHeaders) {
              for (const key of Object.keys(headerMap)) {
                if (key.includes(header)) {
                  return rowValues[headerMap[key]]?.toString().trim();
                }
              }
            }
            return null;
          };

          const firstName = findVal(['first', 'given']);
          const lastName = findVal(['last', 'surname']);
          const middleName = findVal(['middle']);
          const listReference = findVal(['award', 'seq', 'id', 'ref']); 
          const studentId = findVal(['student id', 'app id']);

          // Capture all columns dynamically into rawData for flexibility
          const rawData: Record<string, any> = {};
          rowValues.forEach((val, index) => {
             const headerName = headers[index] || `Column${index}`;
             if (val !== undefined && val !== null) {
                rawData[headerName] = val;
             }
          });

          if (firstName && lastName) {
            recordsToInsert.push({
              firstName,
              lastName,
              middleName,
              scholarshipProgram,
              listReference,
              studentId,
              rawData
            });
          }
        }
      });
    }

    if (recordsToInsert.length === 0) {
      res.status(400).json({ error: 'No valid records found in the uploaded file.' });
      return;
    }

    const uploadResult = await prisma.$transaction(async (tx) => {
      const upload = await tx.officialRecordUpload.create({
        data: {
          fileName: file.originalname,
          recordCount: recordsToInsert.length,
        }
      });

      const recordsWithUploadId = recordsToInsert.map(r => ({
        ...r,
        uploadId: upload.id
      }));

      await tx.officialScholarRecord.createMany({
        data: recordsWithUploadId
      });

      return upload;
    });

    await crossReferenceRecords(uploadResult.id);

    fs.unlinkSync(filePath);

    // Create Audit Log
    if (req.user) {
      // Basic device/OS parsing from user-agent
      const ua = req.get('user-agent') || '';
      let os = 'Unknown OS';
      if (ua.includes('Windows')) os = 'Windows';
      else if (ua.includes('Mac')) os = 'macOS';
      else if (ua.includes('Linux')) os = 'Linux';
      else if (ua.includes('Android')) os = 'Android';
      else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
      
      let deviceType = 'desktop';
      if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) deviceType = 'smartphone';
      else if (ua.includes('iPad') || ua.includes('Tablet')) deviceType = 'tablet';

      await prisma.auditLog.create({
        data: {
          userId: req.user.userId,
          userRole: req.user.role,
          action: 'Upload Official Records',
          targetAppId: scholarshipProgram,
          targetDoc: file.originalname,
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: ua,
          os,
          deviceType,
          notes: `Uploaded ${recordsToInsert.length} official records from ${scholarshipProgram} list.`
        }
      });
    }

    res.status(200).json({ 
      message: 'File processed and cross-referenced successfully',
      upload: uploadResult
    });

  } catch (error) {
    console.error('Error in uploadOfficialRecords:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path); 
    }
    res.status(500).json({ error: 'Failed to process file' });
  }
};

const crossReferenceRecords = async (uploadId: number) => {
  const newRecords = await prisma.officialScholarRecord.findMany({
    where: { uploadId }
  });

  const applications = await prisma.application.findMany({
    where: { status: 'Pending' }
  });

  const flagsToInsert = [];

  for (const record of newRecords) {
    for (const app of applications) {
      const recordFullName = (record.lastName + ' ' + record.firstName + ' ' + (record.middleName || '')).toLowerCase().trim();
      const appFullName = (app.lastName + ' ' + app.givenName + ' ' + (app.middleName || '')).toLowerCase().trim();

      // We check if the application's full name is found within the record's full name,
      // or vice-versa, since middle names or suffixes might be ordered differently.
      // E.g., "dela cruz berlie jane pacure" includes "dela cruz berlie jane"
      
      const appLast = app.lastName.toLowerCase();
      const appFirst = app.givenName.toLowerCase();

      if (recordFullName.includes(appLast) && recordFullName.includes(appFirst)) {
        flagsToInsert.push({
          applicationId: app.id,
          officialRecordId: record.id,
          matchReason: `Exact Name Match in ${record.scholarshipProgram}`
        });
      }
    }
  }

  if (flagsToInsert.length > 0) {
    await prisma.flaggedApplication.createMany({
      data: flagsToInsert
    });
  }
};

export const getUploadHistory = async (req: Request, res: Response) => {
  try {
    const uploads = await prisma.officialRecordUpload.findMany({
      orderBy: { uploadDate: 'desc' },
      take: 10
    });
    res.json(uploads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve uploads' });
  }
};

export const getFlaggedApplications = async (req: Request, res: Response) => {
  try {
    const flags = await prisma.flaggedApplication.findMany({
      include: {
        application: true,
        officialRecord: true
      },
      orderBy: { dateFlagged: 'desc' }
    });
    res.json(flags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve flags' });
  }
};
