import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

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

    const files = req.files as Express.Multer.File[] | undefined;
    const filePaths: Record<string, string> = {};
    if (files) {
      files.forEach(f => {
        filePaths[f.fieldname] = f.path; // Save the path to the uploaded file
      });
    }
    
    // Generate a reference number
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = `APP-${year}-${randomNum}`;
    
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
    if (filePaths['uploadDigitalSignature']) {
      await prisma.application.update({
        where: { id: application.id },
        data: {
          personalInfo: {
            ...(application.personalInfo as any),
            uploadDigitalSignature: filePaths['uploadDigitalSignature']
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
      message: 'Failed to submit application. Please try again.'
    });
  }
};
