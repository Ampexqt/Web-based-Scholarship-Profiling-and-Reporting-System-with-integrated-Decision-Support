import { z } from 'zod';

export const applicationSchema = z.object({
  // PART I. PERSONAL INFORMATION
  studentId: z.string().min(1, "Student ID is required"),
  lastName: z.string().min(1, "Last name is required"),
  givenName: z.string().min(1, "Given name is required"),
  middleName: z.string().optional(),
  noMiddleName: z.boolean().optional(),
  extension: z.string().optional(),
  course: z.string().min(1, "Course is required"),
  yearLevel: z.string().min(1, "Year level is required"),
  sex: z.enum(["Male", "Female"]),
  age: z.string().min(1, "Age is required"),
  birthdate: z.string().min(1, "Birthdate is required"),
  civilStatus: z.enum(["Single", "Married", "Widowed", "Separated"]),
  placeOfBirth: z.string().min(1, "Place of birth is required"),
  religion: z.string().min(1, "Religion is required"),
  mobileNumber: z.string().regex(/^9\d{9}$/, "Must be exactly 10 digits starting with 9"),
  emailAddress: z.string().email("Invalid email address"),
  
  // Current Address
  currentHouseBlock: z.string().min(1, "House number is required"),
  currentStreet: z.string().min(1, "Street is required"),
  currentBarangay: z.string().min(1, "Barangay is required"),
  currentMunicipality: z.string().min(1, "Municipality is required"),
  currentProvince: z.string().min(1, "Province is required"),
  currentRegion: z.string().min(1, "Region is required"),
  currentZipCode: z.string().min(4, "ZIP Code is required"),

  // Permanent Address
  sameAsCurrentAddress: z.boolean().optional(),
  permanentHouseBlock: z.string().optional(),
  permanentStreet: z.string().optional(),
  permanentBarangay: z.string().optional(),
  permanentMunicipality: z.string().optional(),
  permanentProvince: z.string().optional(),
  permanentRegion: z.string().optional(),
  permanentZipCode: z.string().optional(),

  // Enrollment Info
  studentClassification: z.enum(["Regular", "Irregular", "Transferee", "Returnee", "Continuing Student"]),


  // PART II. HOUSEHOLD INFORMATION
  headFullName: z.string().min(1, "Household head name is required"),
  headRelationship: z.string().min(1, "Relationship is required"),
  totalMembers: z.string().min(1, "Total members is required"),
  monthlyIncome: z.string().min(1, "Monthly income is required"),
  mainSourceOfIncome: z.string().min(1, "Source of income is required"),
  mainSourceOfIncomeOthers: z.string().optional(),
  govAssistance: z.string().min(1, "Government assistance status is required"),
  govAssistanceOthers: z.string().optional(),


  // PART III. PARENT/GUARDIAN
  // Father
  fatherFamilyName: z.string().min(1, "Father's family name is required"),
  fatherGivenName: z.string().min(1, "Father's given name is required"),
  fatherMiddleName: z.string().optional(),
  fatherNoMiddleName: z.boolean().optional(),
  fatherExtension: z.string().optional(),
  fatherLivingStatus: z.string().min(1, "Living status is required"),
  fatherEducation: z.string().min(1, "Education is required"),
  fatherEmploymentStatus: z.string().min(1, "Employment status is required"),
  fatherOccupationCategory: z.string().min(1, "Occupation category is required"),
  fatherOccupationOthers: z.string().optional(),
  fatherSpecificOccupation: z.string().optional(),
  fatherEmployer: z.string().optional(),
  fatherMonthlyIncome: z.string().min(1, "Monthly income bracket is required"),

  // Mother
  motherFamilyName: z.string().min(1, "Mother's family name is required"),
  motherGivenName: z.string().min(1, "Mother's given name is required"),
  motherMiddleName: z.string().optional(),
  motherNoMiddleName: z.boolean().optional(),
  motherLivingStatus: z.string().min(1, "Living status is required"),
  motherEducation: z.string().min(1, "Education is required"),
  motherEmploymentStatus: z.string().min(1, "Employment status is required"),
  motherOccupationCategory: z.string().min(1, "Occupation category is required"),
  motherOccupationOthers: z.string().optional(),
  motherEmployer: z.string().optional(),
  motherMonthlyIncome: z.string().min(1, "Monthly income bracket is required"),

  // Guardian
  guardianFullName: z.string().optional(),
  guardianRelationship: z.string().optional(),
  guardianRelationshipOthers: z.string().optional(),
  guardianContact: z.string().refine(val => !val || /^9\d{9}$/.test(val), "Must be exactly 10 digits starting with 9").optional(),


  // PART IV. HOUSEHOLD COMPOSITION
  householdMembers: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      relationship: z.string().min(1, "Relationship is required"),
      relationshipOthers: z.string().optional(),
      sex: z.enum(["Male", "Female"]),
      age: z.string().min(1, "Age is required"),
      civilStatus: z.string().min(1, "Civil Status is required"),
      civilStatusOthers: z.string().optional(),
      education: z.string().min(1, "Education is required"),
      educationOthers: z.string().optional(),
      occupation: z.string().optional(),
      employmentStatus: z.string().min(1, "Status is required"),
      employmentStatusOthers: z.string().optional(),
      monthlyIncome: z.string().optional(),
      currentlyStudying: z.enum(["Yes", "No"]),
    })
  ).min(1, "At least one member is required"),


  // PART V. ACADEMIC INFORMATION
  previousGwa: z.string().min(1, "GWA is required"),
  academicHonors: z.string().optional(),
  uploadGrades: z.any().optional(), // File upload
  uploadRecommendation: z.any().optional(), // File upload
  uploadGwaProof: z.any().optional(), // File upload


  // PART VI. SPECIAL CIRCUMSTANCES (PWD)
  isPwd: z.enum(["Yes", "No"]),
  pwdType: z.string().optional(),
  pwdTypeOthers: z.string().optional(),
  pwdIdNumber: z.string().optional(),
  pwdLgu: z.string().optional(),
  pwdDateIssued: z.string().optional(),
  pwdExpiration: z.string().optional(),
  uploadPwdId: z.any().optional(), // File upload
  uploadMedicalCert: z.any().optional(), // File upload


  // PART VII. SOLO PARENT
  isSoloParent: z.enum(["Yes", "No"]),
  soloParentIdNumber: z.string().optional(),
  soloParentLgu: z.string().optional(),
  soloParentDateIssued: z.string().optional(),
  soloParentExpiration: z.string().optional(),
  uploadSoloParentId: z.any().optional(), // File upload


  // PART VIII. INDIGENOUS PEOPLES (IP)
  isIp: z.enum(["Yes", "No"]),
  ipTribe: z.string().optional(),
  ipTribeOthers: z.string().optional(),
  ipNcipNumber: z.string().optional(),
  ipDomain: z.string().optional(),
  uploadNcipCct: z.any().optional(), // File upload
  uploadNcipConfirmation: z.any().optional(), // File upload
  uploadTribalChieftainCert: z.any().optional(), // File upload


  // PART IX. SPORTS, DANCE AND MUSICAL
  isAthleteArtist: z.enum(["Yes", "No"]),
  athleteType: z.string().optional(),
  athleteEvent: z.string().optional(),
  athleteYears: z.string().optional(),
  athleteHighestCompetition: z.string().optional(),
  athleteAwards: z.string().optional(),
  uploadAthleteCert: z.any().optional(), // File upload
  uploadAthleteAwards: z.any().optional(), // File upload


  // PART X. INDIGENT
  isIndigent: z.enum(["Yes", "No"]),
  indigentVerificationType: z.string().optional(),
  uploadIndigentCert: z.any().optional(), // File upload
  uploadSocialCaseStudy: z.any().optional(), // File upload
  uploadCertOfIndigency: z.any().optional(), // File upload


  // PART XI. CERTIFICATION & CONSENT
  certifyTrue: z.boolean().refine(val => val === true, "You must certify the information is true."),
  certifyAuthentic: z.boolean().refine(val => val === true, "You must certify the documents are authentic."),
  dataPrivacyConsent: z.boolean().refine(val => val === true, "You must accept the Data Privacy Consent."),
  uploadDigitalSignature: z.any().optional(), // File upload
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;
