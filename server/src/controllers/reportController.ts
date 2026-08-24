import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import XlsxPopulate from 'xlsx-populate';
import { createAuditLog } from './auditController';
import path from 'path';

const prisma = new PrismaClient();

const ANNEX_1_COURSES = [
  "BACHELOR IN PHYSICAL EDUCATION",
  "BACHELOR OF ELEMENTARY EDUCATION",
  "BACHELOR OF FINE ARTS MAJOR IN INDUSTRIAL DESIGN",
  "BACHELOR OF INDUSTRIAL TECHNOLOGY MAJOR IN AUTOMOTIVE TECHNOLOGY",
  "BACHELOR OF SCIENCE IN COMPUTER TECHNOLOGY",
  "BACHELOR OF SCIENCE IN DEVELOPMENT COMMUNICATION",
  "BACHELOR OF INDUSTRIAL TECHNOLOGY MAJOR IN ELECTRICAL TECHNOLOGY",
  "BACHELOR OF INDUSTRIAL TECHNOLOGY MAJOR IN ELECTRONICS TECHNOLOGY",
  "BACHELOR OF SCIENCE IN ENTREPRENEURSHIP",
  "BACHELOR OF SCIENCE IN HOTEL AND RESTAURANT MANAGEMENT",
  "BACHELOR OF INDUSTRIAL TECHNOLOGY MAJOR IN ARCHITECTURAL DRAFTING TECHNOLOGY",
  "BACHELOR OF INDUSTRIAL TECHNOLOGY MAJOR IN CONSTRUCTION TECHNOLOGY",
  "BACHELOR OF INDUSTRIAL TECHNOLOGY MAJOR IN CULINARY TECHNOLOGY",
  "BACHELOR OF INDUSTRIAL TECHNOLOGY MAJOR IN APPAREL AND FASHION TECHNOLOGY",
  "BACHELOR OF INDUSTRIAL TECHNOLOGY MAJOR IN MECHANICAL TECHNOLOGY",
  "BACHELOR OF INDUSTRIAL TECHNOLOGY MAJOR IN POWER PLANT TECHNOLOGY",
  "BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY",
  "BACHELOR OF SCIENCE IN MECHANICAL TECHNOLOGY",
  "BACHELOR OF SCIENCE IN REFRIGERATION AND AIR CONDITIONING TECHNOLOGY",
  "BACHELOR OF SECONDARY EDUCATION MAJOR IN MATHEMATICS",
  "BACHELOR OF SECONDARY EDUCATION MAJOR IN MUSIC, ARTS, PHYSICAL EDUCATION AND HEALTH",
  "BACHELOR OF SECONDARY EDUCATION MAJOR IN TECHNOLOGY AND LIVELIHOOD EDUCATION",
  "BACHELOR OF TECHNICAL VOCATIONAL TEACHER EDUCATION MAJOR IN AUTOMOTIVE TECHNOLOGY",
  "BACHELOR OF TECHNICAL VOCATIONAL TEACHER EDUCATION MAJOR IN CIVIL TECHNOLOGY",
  "BACHELOR OF TECHNICAL VOCATIONAL TEACHER EDUCATION MAJOR IN DRAFTING TECHNOLOGY",
  "BACHELOR OF TECHNICAL VOCATIONAL TEACHER EDUCATION MAJOR IN ELECTRICAL TECHNOLOGY",
  "BACHELOR OF TECHNICAL VOCATIONAL TEACHER EDUCATION MAJOR IN ELECTRONICS TECHNOLOGY",
  "BACHELOR OF TECHNICAL VOCATIONAL TEACHER EDUCATION MAJOR IN FOOD SERVICES MANAGEMENT",
  "BACHELOR OF TECHNICAL VOCATIONAL TEACHER EDUCATION MAJOR IN GARMENTS AND FASHION DESIGN TECHNOLOGY",
  "BACHELOR OF TECHNICAL VOCATIONAL TEACHER EDUCATION MAJOR IN HEATING, VENTILATING, AIR CONDITIONING AND REFRIGERATION TECHNOLOGY",
  "BACHELOR OF TECHNICAL VOCATIONAL TEACHER EDUCATION MAJOR IN MECHANICAL TECHNOLOGY",
  "BACHELOR OF TECHNICAL VOCATIONAL TEACHER EDUCATION MAJOR IN WELDING AND FABRICATION TECHNOLOGY",
  "BACHELOR OF SCIENCE IN CIVIL ENGINEERING",
  "BACHELOR OF SCIENCE IN MARINE ENGINEERING",
  "BRIDGING PROGRAM- BACHELOR OF SCIENCE IN ELECTRICAL ENGINEERING TO BACHELOR OF SCIENCE IN MARINE ENGINEERING",
  "BRIDGING PROGRAM- BACHELOR OF SCIENCE IN ELECTRONICS COMMUNICATION ENGINEERING TO BACHELOR OF SCIENCE IN MARINE ENGINEERING",
  "BRIDGING PROGRAM- BACHELOR OF SCIENCE IN MECHANICAL ENGINEERING TO BACHELOR OF SCIENCE IN MARINE ENGINEERING",
  "BACHELOR OF TECHNICAL TEACHER EDUCATION MAJOR IN AUTOMOTIVE TECHNOLOGY",
  "BACHELOR OF TECHNICAL TEACHER EDUCATION MAJOR IN CIVIL TECHNOLOGY",
  "BACHELOR OF TECHNICAL TEACHER EDUCATION MAJOR IN DRAFTING TECHNOLOGY",
  "BACHELOR OF TECHNICAL TEACHER EDUCATION MAJOR IN ELECTRICAL TECHNOLOGY",
  "BACHELOR OF TECHNICAL TEACHER EDUCATION MAJOR IN ELECTRONICS TECHNOLOGY",
  "BACHELOR OF TECHNICAL TEACHER EDUCATION MAJOR IN FOOD AND SERVICE MANAGEMENT",
  "BACHELOR OF TECHNICAL TEACHER EDUCATION MAJOR IN GARMENTS, FASHION AND DESIGN TECHNOLOGY",
  "BACHELOR OF TECHNICAL TEACHER EDUCATION MAJOR IN HEATING, VENTILATING, AIR CONDITIONING, REFRIGIRATION TECHNOLOGY",
  "BACHELOR OF TECHNICAL TEACHER EDUCATION MAJOR IN WELDING AND FABRICATION TECHNOLOGY",
  "BACHELOR OF TECHNICAL TEACHER EDUCATION MAJOR IN MECHANICAL TECHNOLOGY",
  "BACHELOR OF TECHNICAL LIVELIHOOD EDUCATION MAJOR IN INDUSTRIAL ARTS",
  "BACHELOR OF TECHNICAL LIVELIHOOD EDUCATION MAJOR IN HOME ECONOMICS",
  "BACHELOR OF TECHNICAL LIVELIHOOD EDUCATION MAJOR IN INFORMATION AND COMMUNICATION TECHNOLOGY",
  "BACHELOR OF SCIENCE IN HOSPITALITY MANAGEMENT",
  "BATSILYER NG SINING SA FILIPINO",
  "BACHELOR OF SECONDARY EDUCATION MAJOR IN ENGLISH",
  "BACHELOR OF SCIENCE IN INFORMATION SYSTEMS",
  "BACHELOR OF SCIENCE  IN EXERCISE & SPORTS SCIENCE (FITNESS & SPORTS COACHING)",
  "BACHELOR OF SCIENCE IN EXERCISE & SPORTS SCIENCE (FITNESS & SPORTS MANAGEMENT)",
  "BACHELOR OF SCIENCE IN INDUSTRIAL TECHNOLOGY MAJOR IN CIVIL TECHNOLOGY",
  "BACHELOR OF SCIENCE IN INDUSTRIAL TECHNOLOGY MAJOR IN ARCHITECTURAL DRAFTING TECHNOLOGY",
  "BACHELOR OF SCIENCE IN INDUSTRIAL TECHNOLOGY MAJOR IN FOOD TECHNOLOGY",
  "BACHELOR OF SCIENCE IN INDUSTRIAL TECHNOLOGY MAJOR IN GARMENTS & TEXTILE TECHNOLOGY",
  "BACHELOR OF SCIENCE IN INDUSTRIAL TECHNOLOGY MAJOR IN POWER PLANT ENGINEERING TECHNOLOGY",
  "BACHELOR OF SCIENCE IN INDUSTRIAL TECHNOLOGY MAJOR IN MECHATRONICS TECHNOLOGY",
  "BACHELOR OF SCIENCE IN AUTOMOTIVE TECHNOLOGY",
  "BACHELOR OF SCIENCE IN ELECTRICAL TECHNOLOGY",
  "BACHELOR OF SCIENCE IN ELECTRONICS TECHNOLOGY",
  "BACHELOR OF INDUSTRIAL TECHNOLOGY MAJOR IN COMPUTER TECHNOLOGY",
  "BACHELOR OF INDUSTRIAL TECHNOLOGY MAJOR IN HEATING, VENTILATING AND AIR CONDITIONING TECHNOLOGY",
  "BACHELOR OF INDUSTRIAL TECHNOLOGY MAJOR IN MECHATRONICS TECHNOLOGY",
  "BACHELOR OF TECHNOLOGY AND LIVELIHOOD EDUCATION MAJOR IN INFORMATION COMMUNICATION TECHNOLOGY",
  "BACHELOR OF TECHNOLOGY AND LIVELIHOOD EDUCATION MAJOR IN HOME ECONOMICS",
  "BACHELOR OF TECHNOLOGY AND LIVELIHOOD EDUCATION MAJOR IN INDUSTRIAL ARTS"
];

function normalizeCourseName(course: string): string {
  if (!course) return "";
  const upper = course.toUpperCase().trim();
  const match = ANNEX_1_COURSES.find(c => c === upper);
  if (match) return match;
  
  return upper;
}

export const exportTesAnnex1 = async (req: Request, res: Response) => {
  try {
    const { dateRange, fromDate, toDate } = req.query;
    let whereClause: any = {
      status: 'Approved' // Only export Approved applications for CHED Annex 1
    };

    const now = new Date();
    
    if (dateRange === 'today') {
      now.setHours(0, 0, 0, 0);
      whereClause.createdAt = { gte: now };
    } else if (dateRange === '7days') {
      now.setDate(now.getDate() - 7);
      now.setHours(0, 0, 0, 0);
      whereClause.createdAt = { gte: now };
    } else if (dateRange === '30days') {
      now.setDate(now.getDate() - 30);
      now.setHours(0, 0, 0, 0);
      whereClause.createdAt = { gte: now };
    } else if (dateRange === 'custom' && fromDate && toDate) {
      const from = new Date(fromDate as string);
      const to = new Date(toDate as string);
      to.setHours(23, 59, 59, 999);
      whereClause.createdAt = { gte: from, lte: to };
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
      orderBy: { id: 'asc' }
    });

    const templatePath = path.join(__dirname, '../../templates/annex1_zamboanga_peninsula_polytechnic_state_university - Copy.xlsm');
    
    // Use xlsx-populate to safely read and write xlsm files without hanging or destroying macros
    const workbook = await XlsxPopulate.fromFileAsync(templatePath);
    
    const sheet = workbook.sheet('Annex 1');
    if (!sheet) {
      return res.status(500).json({ error: 'Template missing Annex 1 sheet' });
    }

    let currentRow = 9; // Data entry starts at row 9 according to documentation

    // Clear any previous test data that might be stuck in the template from row 9 down to 50
    for (let r = 9; r <= 50; r++) {
      for (let c = 1; c <= 22; c++) {
        sheet.row(r).cell(c).value(undefined);
      }
    }

    applications.forEach((app, index) => {
      const personalInfo = app.personalInfo as any || {};
      const familyInfo = app.parentGuardianInfo as any || {};
      const father = familyInfo.father || {};
      const mother = familyInfo.mother || {};
      const addressInfo = app.addressInfo as any || {};
      const currentAddress = addressInfo.current || {};
      const rawPermanentAddress = addressInfo.permanent || {};
      const permanentAddress = rawPermanentAddress.sameAsCurrent ? currentAddress : rawPermanentAddress;

      let sexValue = "";
      if (personalInfo.sex) {
        const s = personalInfo.sex.toLowerCase();
        if (s === "male" || s === "m") sexValue = "0";
        else if (s === "female" || s === "f") sexValue = "1";
      }
      
      let birthdateValue = personalInfo.birthdate || personalInfo.birthDate || personalInfo.dateOfBirth || "";
      if (birthdateValue && birthdateValue.length > 10) {
        birthdateValue = birthdateValue.substring(0, 10);
      }

      const row = sheet.row(currentRow);
      
      row.cell(1).value(index + 1); // SEQ
      row.cell(2).value(app.studentId || undefined);
      row.cell(3).value(app.lastName ? app.lastName.toUpperCase() : undefined);
      row.cell(4).value(app.givenName ? app.givenName.toUpperCase() : undefined);
      row.cell(5).value((personalInfo.extensionName || personalInfo.extension) ? (personalInfo.extensionName || personalInfo.extension).toUpperCase() : undefined);
      row.cell(6).value(app.middleName ? app.middleName.toUpperCase() : undefined);
      row.cell(7).value(sexValue || undefined);
      row.cell(8).value(birthdateValue || undefined);
      row.cell(9).value(app.course ? normalizeCourseName(app.course) : undefined);
      row.cell(10).value(personalInfo.yearLevel || personalInfo.year || undefined);
      
      row.cell(11).value((father.familyName || father.lastName) ? (father.familyName || father.lastName).toUpperCase() : undefined);
      row.cell(12).value(father.givenName ? father.givenName.toUpperCase() : undefined);
      row.cell(13).value(father.middleName ? father.middleName.toUpperCase() : undefined);
      
      row.cell(14).value((mother.familyName || mother.lastName) ? (mother.familyName || mother.lastName).toUpperCase() : undefined);
      row.cell(15).value(mother.givenName ? mother.givenName.toUpperCase() : undefined);
      row.cell(16).value(mother.middleName ? mother.middleName.toUpperCase() : undefined);
      
      const streetBarangay = [permanentAddress.street, permanentAddress.barangay].filter(Boolean).join(" ");
      row.cell(17).value(streetBarangay ? streetBarangay.toUpperCase() : undefined);
      row.cell(18).value(permanentAddress.zipCode || currentAddress.zipCode || 0); // Put 0 if not available
      
      const specialCircs = app.specialCircumstances as any || {};
      let disability = personalInfo.disability || specialCircs.pwdType || "";
      if (disability.toLowerCase() === "others") {
        disability = specialCircs.pwdTypeOthers || disability;
      }
      if (specialCircs.isPwd === "Yes" && !disability) {
         disability = "Yes";
      }

      row.cell(19).value(disability ? disability.toUpperCase() : undefined);
      
      let contactNumberRaw = personalInfo.contactNumber || personalInfo.mobileNumber || "";
      let contactNumber = String(contactNumberRaw);
      // Format 10 digits starting with 9 (strip 09...)
      if (contactNumber.startsWith('09') && contactNumber.length === 11) {
        contactNumber = contactNumber.substring(1);
      }
      row.cell(20).value(contactNumber || undefined);
      row.cell(21).value(personalInfo.emailAddress || personalInfo.email || undefined);
      
      let ip = "NO";
      if (specialCircs.isIp === "Yes" || specialCircs.ipTribe || personalInfo.indigenousGroup || personalInfo.ipGroup) {
         ip = (specialCircs.ipTribe || personalInfo.indigenousGroup || personalInfo.ipGroup || "YES").toUpperCase();
      }
      row.cell(22).value(ip);

      // Apply styling to all 22 columns for the current row
      for (let c = 1; c <= 22; c++) {
        row.cell(c).style({
          horizontalAlignment: 'center',
          verticalAlignment: 'center',
          wrapText: true
        });
      }

      currentRow++;
    });

    const buffer = await workbook.outputAsync();

    res.setHeader('Content-Type', 'application/vnd.ms-excel.sheet.macroEnabled.12');
    res.setHeader('Content-Disposition', 'attachment; filename="TES_Annex_1.xlsm"');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Add audit log for report download
    const adminUser = (req as any).user;
    if (adminUser) {
      await createAuditLog(
        adminUser.userId,
        adminUser.role,
        'DOWNLOAD_REPORT',
        null,
        'TES_Annex_1',
        req,
        undefined,
        `Downloaded CHED/UniFast Annex 1 Report`
      );
    }

    res.end(buffer);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to generate export' });
  }
};

