import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { createAuditLog } from './auditController';

const prisma = new PrismaClient();

export const submitApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawData = req.body;
    const data: any = {};
    
    // Parse FormData strings back to proper types (booleans, numbers, arrays)
    for (const key in rawData) {
      try {
        data[key] = JSON.parse(rawData[key]);
      } catch (e) {
        data[key] = rawData[key]; // Keep as string if it's not JSON parseable
      }
    }

    // Generate a reference number
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = `APP-${year}-${randomNum}`;
    
    // Create folder for applicant
    const applicantUploadDir = path.join(process.cwd(), 'uploads', referenceNumber);
    if (!fs.existsSync(applicantUploadDir)) {
      fs.mkdirSync(applicantUploadDir, { recursive: true });
    }

    const files = req.files as Express.Multer.File[] | undefined;
    const filePaths: Record<string, string> = {};
    if (files) {
      files.forEach(f => {
        // Move file from temporary uploads/ to uploads/APP-.../
        const newFileName = `${referenceNumber}_${f.fieldname}${path.extname(f.originalname)}`;
        const newFilePath = path.join(applicantUploadDir, newFileName);
        fs.renameSync(f.path, newFilePath);
        
        filePaths[f.fieldname] = path.relative(process.cwd(), newFilePath);
      });
    }
    
    if (data.uploadDigitalSignature && data.uploadDigitalSignature.startsWith('data:image')) {
      // Extract base64 and save as image file
      const matches = data.uploadDigitalSignature.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1].split('/')[1] === 'jpeg' ? '.jpg' : '.png';
        const signatureFileName = `${referenceNumber}_digitalSignature${ext}`;
        const signatureFilePath = path.join(applicantUploadDir, signatureFileName);
        
        fs.writeFileSync(signatureFilePath, Buffer.from(matches[2], 'base64'));
        
        // Update data to point to the file path instead of base64
        data.uploadDigitalSignature = path.relative(process.cwd(), signatureFilePath);
      }
    }
    
    const application = await prisma.application.create({
      data: {
        referenceNumber,
        studentId: data.studentId,
        lastName: data.lastName,
        givenName: data.givenName,
        middleName: data.middleName || null,
        college: data.college,
        course: data.course,
        status: 'Pending',
        
        // Grouping the rest into JSON fields
        personalInfo: {
          noMiddleName: data.noMiddleName,
          extension: data.extension,
          major: data.major,
          yearLevel: data.yearLevel,
          sex: data.sex,
          age: data.age,
          birthdate: data.birthdate,
          civilStatus: data.civilStatus,
          placeOfBirth: data.placeOfBirth,
          religion: data.religion,
          religionOthers: data.religionOthers,
          mobileNumber: data.mobileNumber,
          emailAddress: data.emailAddress,
          studentClassification: data.studentClassification
        },
        addressInfo: {
          current: {
            houseBlock: data.currentHouseBlock,
            street: data.currentStreet,
            barangay: data.currentBarangay,
            municipality: data.currentMunicipality,
            province: data.currentProvince,
            region: data.currentRegion,
            zipCode: data.currentZipCode
          },
          permanent: {
            sameAsCurrent: data.sameAsCurrentAddress,
            houseBlock: data.permanentHouseBlock,
            street: data.permanentStreet,
            barangay: data.permanentBarangay,
            municipality: data.permanentMunicipality,
            province: data.permanentProvince,
            region: data.permanentRegion,
            zipCode: data.permanentZipCode
          }
        },
        householdInfo: {
          headFullName: data.headFullName,
          headRelationship: data.headRelationship,
          headRelationshipOthers: data.headRelationshipOthers,
          totalMembers: data.totalMembers,
          monthlyIncome: data.monthlyIncome,
          mainSourceOfIncome: data.mainSourceOfIncome,
          mainSourceOfIncomeOthers: data.mainSourceOfIncomeOthers,
          govAssistance: data.govAssistance,
          govAssistanceOthers: data.govAssistanceOthers
        },
        parentGuardianInfo: {
          father: {
            familyName: data.fatherFamilyName,
            givenName: data.fatherGivenName,
            middleName: data.fatherMiddleName,
            noMiddleName: data.fatherNoMiddleName,
            extension: data.fatherExtension,
            livingStatus: data.fatherLivingStatus,
            education: data.fatherEducation,
            employmentStatus: data.fatherEmploymentStatus,
            occupationCategory: data.fatherOccupationCategory,
            occupationOthers: data.fatherOccupationOthers,
            specificOccupation: data.fatherSpecificOccupation,
            employer: data.fatherEmployer,
            monthlyIncome: data.fatherMonthlyIncome
          },
          mother: {
            familyName: data.motherFamilyName,
            givenName: data.motherGivenName,
            middleName: data.motherMiddleName,
            noMiddleName: data.motherNoMiddleName,
            livingStatus: data.motherLivingStatus,
            education: data.motherEducation,
            employmentStatus: data.motherEmploymentStatus,
            occupationCategory: data.motherOccupationCategory,
            occupationOthers: data.motherOccupationOthers,
            employer: data.motherEmployer,
            monthlyIncome: data.motherMonthlyIncome
          },
          guardian: {
            fullName: data.guardianFullName,
            relationship: data.guardianRelationship,
            relationshipOthers: data.guardianRelationshipOthers,
            contact: data.guardianContact
          }
        },
        householdMembers: data.householdMembers || [],
        academicInfo: {
          previousGwa: data.previousGwa,
          academicHonors: data.academicHonors,
          uploadGrades: filePaths['uploadGrades'] || null,
          uploadRecommendation: filePaths['uploadRecommendation'] || null,
          uploadGwaProof: filePaths['uploadGwaProof'] || null
        },
        specialCircumstances: {
          isPwd: data.isPwd,
          pwdType: data.pwdType,
          pwdTypeOthers: data.pwdTypeOthers,
          pwdIdNumber: data.pwdIdNumber,
          pwdLgu: data.pwdLgu,
          pwdDateIssued: data.pwdDateIssued,
          pwdExpiration: data.pwdExpiration,
          uploadPwdId: filePaths['uploadPwdId'] || null,
          uploadMedicalCert: filePaths['uploadMedicalCert'] || null,
          
          isSoloParent: data.isSoloParent,
          soloParentIdNumber: data.soloParentIdNumber,
          soloParentLgu: data.soloParentLgu,
          soloParentDateIssued: data.soloParentDateIssued,
          soloParentExpiration: data.soloParentExpiration,
          uploadSoloParentId: filePaths['uploadSoloParentId'] || null,
          
          isIp: data.isIp,
          ipTribe: data.ipTribe,
          ipTribeOthers: data.ipTribeOthers,
          ipNcipNumber: data.ipNcipNumber,
          ipDomain: data.ipDomain,
          uploadNcipCct: filePaths['uploadNcipCct'] || null,
          uploadNcipConfirmation: filePaths['uploadNcipConfirmation'] || null,
          uploadTribalChieftainCert: filePaths['uploadTribalChieftainCert'] || null,
          
          isAthleteArtist: data.isAthleteArtist,
          athleteType: data.athleteType,
          athleteEvent: data.athleteEvent,
          athleteYears: data.athleteYears,
          athleteHighestCompetition: data.athleteHighestCompetition,
          athleteAwards: data.athleteAwards,
          uploadAthleteCert: filePaths['uploadAthleteCert'] || null,
          uploadAthleteAwards: filePaths['uploadAthleteAwards'] || null,
          
          isIndigent: data.isIndigent,
          indigentVerificationType: data.indigentVerificationType,
          uploadIndigentCert: filePaths['uploadIndigentCert'] || null,
          uploadSocialCaseStudy: filePaths['uploadSocialCaseStudy'] || null,
          uploadCertOfIndigency: filePaths['uploadCertOfIndigency'] || null
        },
        // We will store the digital signature directly in personalInfo or as a root JSON
        // Actually it's part of the certification step, we can store it in personalInfo or just a new column, but let's stick it in personalInfo for now to avoid schema changes
      }
    });

    // Update digital signature (since we didn't define a specific JSON group for certification, let's append it to personalInfo or specialCircumstances. Let's add it to personalInfo)
    if (data.uploadDigitalSignature) {
      await prisma.application.update({
        where: { id: application.id },
        data: {
          personalInfo: {
            ...(application.personalInfo as any),
            uploadDigitalSignature: data.uploadDigitalSignature
          }
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      referenceNumber: application.referenceNumber,
      applicationId: application.id
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application. Please try again.',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
};

export const getApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Map to a cleaner format for frontend
    const formattedApps = applications.map((app: any) => {
      const name = `${app.lastName}, ${app.givenName} ${app.middleName ? app.middleName[0] + '.' : ''}`.trim();
      
      // Determine if priority from special circumstances
      let isPriority = false;
      const priorityGroups: string[] = [];
      
      if (app.specialCircumstances) {
        const sc = typeof app.specialCircumstances === 'string' ? JSON.parse(app.specialCircumstances) : app.specialCircumstances;
        
        if (sc.isPwd === 'Yes' || sc.isPwd === true || sc.isPwd === 'true') priorityGroups.push('pwd');
        if (sc.isSoloParent === 'Yes' || sc.isSoloParent === true || sc.isSoloParent === 'true') priorityGroups.push('solo-parent');
        if (sc.isIp === 'Yes' || sc.isIp === true || sc.isIp === 'true') priorityGroups.push('ip');
        if (sc.isAthleteArtist === 'Yes' || sc.isAthleteArtist === true || sc.isAthleteArtist === 'true') priorityGroups.push('sports-arts');
        if (sc.isIndigent === 'Yes' || sc.isIndigent === true || sc.isIndigent === 'true') priorityGroups.push('indigent');
        
        isPriority = priorityGroups.length > 0;
      }

      return {
        id: app.referenceNumber,
        name,
        college: app.college,
        course: app.course,
        status: app.status,
        date: app.createdAt,
        isPriority,
        priorityGroups
      };
    });

    res.status(200).json({ success: true, applications: formattedApps });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch applications' });
  }
};

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const total = await prisma.application.count();
    const pending = await prisma.application.count({ where: { status: 'Pending' } });
    const accepted = await prisma.application.count({ where: { status: 'Accepted' } });
    const rejected = await prisma.application.count({ where: { status: 'Rejected' } });

    // For priority groups, we need to inspect the JSON column. 
    // This is simpler to do in memory for a small-to-medium dataset or with raw SQL.
    // For simplicity, we'll fetch just what we need or do a full table scan if it's small.
    // Given Prisma's limitations with JSON querying across all dialects, let's fetch all and count.
    const allApps = await prisma.application.findMany({
      select: { specialCircumstances: true }
    });

    let pwd = 0, soloParent = 0, ip = 0, athlete = 0, indigent = 0;

    allApps.forEach(app => {
      if (app.specialCircumstances) {
        const sc: any = typeof app.specialCircumstances === 'string' ? JSON.parse(app.specialCircumstances) : app.specialCircumstances;
        if (sc.isPwd === 'Yes' || sc.isPwd === 'true' || sc.isPwd === true) pwd++;
        if (sc.isSoloParent === 'Yes' || sc.isSoloParent === 'true' || sc.isSoloParent === true) soloParent++;
        if (sc.isIp === 'Yes' || sc.isIp === 'true' || sc.isIp === true) ip++;
        if (sc.isAthleteArtist === 'Yes' || sc.isAthleteArtist === 'true' || sc.isAthleteArtist === true) athlete++;
        if (sc.isIndigent === 'Yes' || sc.isIndigent === 'true' || sc.isIndigent === true) indigent++;
      }
    });

    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        accepted,
        rejected
      },
      priorityGroups: {
        pwd,
        soloParent,
        ip,
        athlete,
        indigent
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};

export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const app = await prisma.application.findUnique({
      where: { referenceNumber: id }
    });

    if (!app) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    res.status(200).json({ success: true, application: app });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch application' });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    
    const app = await prisma.application.update({
      where: { referenceNumber: id },
      data: { 
        status,
        remarks: remarks || null
      }
    });

    const user = (req as any).user;
    if (user) {
      let action = 'APP_STATUS_UPDATE';
      if (status === 'Approved') action = 'APP_APPROVE';
      else if (status === 'Rejected') action = 'APP_REJECT';
      else if (status === 'Flagged') action = 'APP_FLAG';

      await createAuditLog(user.userId, user.role, action, id, null, req, undefined, remarks || '');
    }

    res.status(200).json({ success: true, application: app });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ success: false, message: 'Failed to update application status' });
  }
};

export const verifyDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { documentUrl, isVerified } = req.body;
    
    const app = await prisma.application.findUnique({
      where: { referenceNumber: id }
    });

    if (!app) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    let verifiedDocs: string[] = [];
    if (app.verifiedDocuments) {
      verifiedDocs = typeof app.verifiedDocuments === 'string' ? JSON.parse(app.verifiedDocuments) : app.verifiedDocuments;
    }

    if (isVerified && !verifiedDocs.includes(documentUrl)) {
      verifiedDocs.push(documentUrl);
    } else if (!isVerified) {
      verifiedDocs = verifiedDocs.filter(doc => doc !== documentUrl);
    }
    
    const updatedApp = await prisma.application.update({
      where: { referenceNumber: id },
      data: { 
        verifiedDocuments: verifiedDocs as any
      }
    });

    const user = (req as any).user;
    if (user) {
      const action = isVerified ? 'DOC_VERIFY' : 'DOC_UNVERIFY';
      await createAuditLog(user.userId, user.role, action, id, documentUrl, req);
    }

    res.status(200).json({ success: true, verifiedDocuments: verifiedDocs });
  } catch (error) {
    console.error('Error updating document verification:', error);
    res.status(500).json({ success: false, message: 'Failed to verify document' });
  }
};
