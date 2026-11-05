import { z } from 'zod';

export const applicationSchema = z.object({
  // PART I. PERSONAL INFORMATION
  studentId: z
    .string()
    .trim()
    .min(3, "Student ID must be at least 3 characters")
    .max(25, "Student ID cannot exceed 25 characters")
    .regex(/^[A-Za-z0-9\-_/]+$/, "Student ID can only contain letters, numbers, hyphens, or slashes"),
  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters"),
  givenName: z
    .string()
    .trim()
    .min(2, "Given name must be at least 2 characters")
    .max(50, "Given name cannot exceed 50 characters"),
  middleName: z
    .string()
    .trim()
    .max(50, "Middle name cannot exceed 50 characters")
    .optional(),
  noMiddleName: z.boolean().optional(),
  extension: z.string().trim().max(10).optional(),
  college: z.string().trim().min(1, "College is required"),
  course: z.string().trim().min(1, "Course is required"),
  major: z.string().trim().max(100).optional(),
  yearLevel: z.string().trim().min(1, "Year level is required"),
  sex: z.enum(["Male", "Female"]),
  age: z
    .string()
    .trim()
    .regex(/^(1[5-9]|[2-9][0-9])$/, "Age must be between 15 and 99"),
  birthdate: z.string().trim().min(1, "Birthdate is required"),
  civilStatus: z.enum(["Single", "Married", "Widowed", "Separated"]),
  placeOfBirth: z
    .string()
    .trim()
    .min(2, "Place of birth must be at least 2 characters")
    .max(100, "Place of birth cannot exceed 100 characters"),
  religion: z.string().trim().min(1, "Religion is required"),
  religionOthers: z.string().trim().max(50).optional(),
  mobileNumber: z
    .string()
    .trim()
    .regex(/^9\d{9}$/, "Must be exactly 10 digits starting with 9 (e.g. 9171234567)"),
  emailAddress: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(100, "Email cannot exceed 100 characters"),
  
  // Current Address
  currentHouseBlock: z.string().trim().max(100).optional(),
  currentStreet: z.string().trim().max(100).optional(),
  currentBarangay: z.string().trim().min(1, "Barangay is required"),
  currentMunicipality: z.string().trim().min(1, "Municipality is required"),
  currentProvince: z.string().trim().min(1, "Province is required"),
  currentRegion: z.string().trim().min(1, "Region is required"),
  currentZipCode: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "ZIP Code must be exactly 4 digits (e.g. 7000)"),

  // Permanent Address
  sameAsCurrentAddress: z.boolean().optional(),
  permanentHouseBlock: z.string().trim().max(100).optional(),
  permanentStreet: z.string().trim().max(100).optional(),
  permanentBarangay: z.string().trim().max(100).optional(),
  permanentMunicipality: z.string().trim().max(100).optional(),
  permanentProvince: z.string().trim().max(100).optional(),
  permanentRegion: z.string().trim().max(100).optional(),
  permanentZipCode: z.string().trim().max(10).optional(),

  // Enrollment Info
  studentClassification: z.enum(["Regular", "Irregular", "Transferee", "Returnee", "Continuing Student"]),

  // PART II. HOUSEHOLD INFORMATION
  headFullName: z
    .string()
    .trim()
    .min(2, "Household head name must be at least 2 characters")
    .max(100, "Cannot exceed 100 characters"),
  headRelationship: z.string().trim().min(1, "Relationship is required"),
  headRelationshipOthers: z.string().trim().max(50).optional(),
  totalMembers: z
    .string()
    .trim()
    .regex(/^[1-9]\d?$/, "Total members must be a number between 1 and 99"),
  monthlyIncome: z.string().trim().min(1, "Monthly income bracket is required"),
  mainSourceOfIncome: z.string().trim().min(1, "Source of income is required"),
  mainSourceOfIncomeOthers: z.string().trim().max(50).optional(),
  govAssistance: z.string().trim().min(1, "Government assistance status is required"),
  govAssistanceOthers: z.string().trim().max(50).optional(),

  // PART III. PARENT/GUARDIAN
  // Father
  fatherFamilyName: z.string().trim().min(2, "Father's family name must be at least 2 characters").max(50),
  fatherGivenName: z.string().trim().min(2, "Father's given name must be at least 2 characters").max(50),
  fatherMiddleName: z.string().trim().max(50).optional(),
  fatherNoMiddleName: z.boolean().optional(),
  fatherExtension: z.string().trim().max(10).optional(),
  fatherLivingStatus: z.string().trim().min(1, "Living status is required"),
  fatherEducation: z.string().trim().min(1, "Education is required"),
  fatherEmploymentStatus: z.string().trim().min(1, "Employment status is required"),
  fatherOccupationCategory: z.string().trim().min(1, "Occupation category is required"),
  fatherOccupationOthers: z.string().trim().max(50).optional(),
  fatherSpecificOccupation: z.string().trim().max(100).optional(),
  fatherEmployer: z.string().trim().max(100).optional(),
  fatherMonthlyIncome: z.string().trim().min(1, "Monthly income bracket is required"),

  // Mother
  motherFamilyName: z.string().trim().min(2, "Mother's family name must be at least 2 characters").max(50),
  motherGivenName: z.string().trim().min(2, "Mother's given name must be at least 2 characters").max(50),
  motherMiddleName: z.string().trim().max(50).optional(),
  motherNoMiddleName: z.boolean().optional(),
  motherLivingStatus: z.string().trim().min(1, "Living status is required"),
  motherEducation: z.string().trim().min(1, "Education is required"),
  motherEmploymentStatus: z.string().trim().min(1, "Employment status is required"),
  motherOccupationCategory: z.string().trim().min(1, "Occupation category is required"),
  motherOccupationOthers: z.string().trim().max(50).optional(),
  motherEmployer: z.string().trim().max(100).optional(),
  motherMonthlyIncome: z.string().trim().min(1, "Monthly income bracket is required"),

  // Guardian
  guardianFullName: z.string().trim().max(100).optional(),
  guardianRelationship: z.string().trim().max(50).optional(),
  guardianRelationshipOthers: z.string().trim().max(50).optional(),
  guardianContact: z.string().trim().refine(val => !val || /^9\d{9}$/.test(val), "Must be exactly 10 digits starting with 9").optional(),

  // PART IV. HOUSEHOLD COMPOSITION
  householdMembers: z.array(
    z.object({
      name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
      relationship: z.string().trim().min(1, "Relationship is required"),
      relationshipOthers: z.string().trim().max(50).optional(),
      sex: z.enum(["Male", "Female"]),
      age: z.string().trim().regex(/^[0-9]{1,3}$/, "Must be a valid age"),
      civilStatus: z.string().trim().min(1, "Civil Status is required"),
      civilStatusOthers: z.string().trim().max(50).optional(),
      education: z.string().trim().min(1, "Education is required"),
      educationOthers: z.string().trim().max(50).optional(),
      occupation: z.string().trim().max(100).optional(),
      employmentStatus: z.string().trim().min(1, "Status is required"),
      employmentStatusOthers: z.string().trim().max(50).optional(),
      monthlyIncome: z.string().trim().optional(),
      currentlyStudying: z.enum(["Yes", "No"]),
    })
  ).min(1, "At least one member is required"),

  // PART V. ACADEMIC INFORMATION
  previousGwa: z
    .string()
    .trim()
    .regex(/^(\d{1,3})(\.\d{1,2})?$/, "GWA must be a valid number (e.g. 90.50 or 1.75)")
    .refine(val => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 1.0 && num <= 100.0;
    }, "GWA must be between 1.00 and 100.00"),
  academicHonors: z.string().trim().optional(),
  uploadGrades: z.any().optional(),
  uploadRecommendation: z.any().optional(),
  uploadGwaProof: z.any().optional(),

  // PART VI. SPECIAL CIRCUMSTANCES (PWD)
  isPwd: z.enum(["Yes", "No"]),
  pwdType: z.string().trim().optional(),
  pwdTypeOthers: z.string().trim().max(100).optional(),
  pwdIdNumber: z.string().trim().max(50).optional(),
  pwdLgu: z.string().trim().max(100).optional(),
  pwdDateIssued: z.string().trim().optional(),
  pwdExpiration: z.string().trim().optional(),
  uploadPwdId: z.any().optional(),
  uploadMedicalCert: z.any().optional(),

  // PART VII. SOLO PARENT
  isSoloParent: z.enum(["Yes", "No"]),
  soloParentIdNumber: z.string().trim().max(50).optional(),
  soloParentLgu: z.string().trim().max(100).optional(),
  soloParentDateIssued: z.string().trim().optional(),
  soloParentExpiration: z.string().trim().optional(),
  uploadSoloParentId: z.any().optional(),

  // PART VIII. INDIGENOUS PEOPLES (IP)
  isIp: z.enum(["Yes", "No"]),
  ipTribe: z.string().trim().optional(),
  ipTribeOthers: z.string().trim().max(100).optional(),
  ipNcipNumber: z.string().trim().max(50).optional(),
  ipDomain: z.string().trim().max(100).optional(),
  uploadNcipCct: z.any().optional(),
  uploadNcipConfirmation: z.any().optional(),
  uploadTribalChieftainCert: z.any().optional(),

  // PART IX. SPORTS, DANCE AND MUSICAL
  isAthleteArtist: z.enum(["Yes", "No"]),
  athleteType: z.string().trim().max(100).optional(),
  athleteEvent: z.string().trim().max(100).optional(),
  athleteYears: z.string().trim().max(10).optional(),
  athleteHighestCompetition: z.string().trim().optional(),
  athleteAwards: z.string().trim().max(200).optional(),
  uploadAthleteCert: z.any().optional(),
  uploadAthleteAwards: z.any().optional(),

  // PART X. INDIGENT
  isIndigent: z.enum(["Yes", "No"]),
  indigentVerificationType: z.string().trim().optional(),
  uploadIndigentCert: z.any().optional(),
  uploadSocialCaseStudy: z.any().optional(),
  uploadCertOfIndigency: z.any().optional(),

  // PART XI. CERTIFICATION & CONSENT
  certifyTrue: z.boolean().refine(val => val === true, "You must certify the information is true."),
  certifyAuthentic: z.boolean().refine(val => val === true, "You must certify the documents are authentic."),
  dataPrivacyConsent: z.boolean().refine(val => val === true, "You must accept the Data Privacy Consent."),
  uploadDigitalSignature: z.any().optional(),
}).superRefine((data, ctx) => {
  const isFileValid = (val: any) => {
    if (val && typeof val === 'object' && 'length' in val) return val.length > 0;
    if (typeof val === 'string' && val.trim().length > 0) return true;
    return false;
  };

  // PART I. MIDDLE NAME VALIDATION
  if (!data.noMiddleName) {
    if (!data.middleName || data.middleName.trim() === '') {
      ctx.addIssue({ path: ["middleName"], message: "Middle name is required (or check 'no middle name')", code: z.ZodIssueCode.custom });
    }
  }

  // PART I. ADDRESS VALIDATION
  if (!data.sameAsCurrentAddress) {
    if (!data.permanentBarangay || data.permanentBarangay.trim() === '') {
      ctx.addIssue({ path: ["permanentBarangay"], message: "Permanent barangay is required", code: z.ZodIssueCode.custom });
    }
    if (!data.permanentMunicipality || data.permanentMunicipality.trim() === '') {
      ctx.addIssue({ path: ["permanentMunicipality"], message: "Permanent municipality is required", code: z.ZodIssueCode.custom });
    }
    if (!data.permanentProvince || data.permanentProvince.trim() === '') {
      ctx.addIssue({ path: ["permanentProvince"], message: "Permanent province is required", code: z.ZodIssueCode.custom });
    }
    if (!data.permanentRegion || data.permanentRegion.trim() === '') {
      ctx.addIssue({ path: ["permanentRegion"], message: "Permanent region is required", code: z.ZodIssueCode.custom });
    }
    if (!data.permanentZipCode || !/^\d{4}$/.test(data.permanentZipCode.trim())) {
      ctx.addIssue({ path: ["permanentZipCode"], message: "Permanent ZIP Code must be 4 digits", code: z.ZodIssueCode.custom });
    }
  }

  // PART V. ACADEMIC INFORMATION
  if (!isFileValid(data.uploadGrades)) {
    ctx.addIssue({ path: ["uploadGrades"], message: "Grades attachment is required", code: z.ZodIssueCode.custom });
  }
  if (!isFileValid(data.uploadRecommendation)) {
    ctx.addIssue({ path: ["uploadRecommendation"], message: "Recommendation letter is required", code: z.ZodIssueCode.custom });
  }
  if (!isFileValid(data.uploadGwaProof)) {
    ctx.addIssue({ path: ["uploadGwaProof"], message: "GWA proof is required", code: z.ZodIssueCode.custom });
  }

  // PART VI. PWD
  if (data.isPwd === "Yes") {
    if (!data.pwdType || data.pwdType.trim() === '') {
      ctx.addIssue({ path: ["pwdType"], message: "Type of disability is required", code: z.ZodIssueCode.custom });
    }
    if (!isFileValid(data.uploadPwdId)) {
      ctx.addIssue({ path: ["uploadPwdId"], message: "PWD ID attachment is required", code: z.ZodIssueCode.custom });
    }
  }

  // PART VII. SOLO PARENT
  if (data.isSoloParent === "Yes") {
    if (!isFileValid(data.uploadSoloParentId)) {
      ctx.addIssue({ path: ["uploadSoloParentId"], message: "Solo Parent ID attachment is required", code: z.ZodIssueCode.custom });
    }
  }

  // PART VIII. IP
  if (data.isIp === "Yes") {
    if (!data.ipTribe || data.ipTribe.trim() === '') {
      ctx.addIssue({ path: ["ipTribe"], message: "Tribe is required", code: z.ZodIssueCode.custom });
    }
    if (!isFileValid(data.uploadNcipCct)) {
      ctx.addIssue({ path: ["uploadNcipCct"], message: "NCIP CCT attachment is required", code: z.ZodIssueCode.custom });
    }
  }

  // PART IX. ATHLETE/ARTIST
  if (data.isAthleteArtist === "Yes") {
    if (!isFileValid(data.uploadAthleteCert)) {
      ctx.addIssue({ path: ["uploadAthleteCert"], message: "Athlete/Artist Certificate is required", code: z.ZodIssueCode.custom });
    }
  }

  // PART X. INDIGENT
  if (data.isIndigent === "Yes") {
    const hasIndigent = isFileValid(data.uploadIndigentCert);
    const hasCaseStudy = isFileValid(data.uploadSocialCaseStudy);
    const hasCert = isFileValid(data.uploadCertOfIndigency);
    if (!hasIndigent && !hasCaseStudy && !hasCert) {
      ctx.addIssue({ path: ["uploadIndigentCert"], message: "Please provide at least one indigent document", code: z.ZodIssueCode.custom });
    }
  }

  // PART XI. DIGITAL SIGNATURE
  if (!isFileValid(data.uploadDigitalSignature)) {
    ctx.addIssue({ path: ["uploadDigitalSignature"], message: "Digital Signature is required", code: z.ZodIssueCode.custom });
  }
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;
