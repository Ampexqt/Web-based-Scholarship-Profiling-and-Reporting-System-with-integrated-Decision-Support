import { useState, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applicationSchema, type ApplicationFormValues } from './schema';

import Part1PersonalInfoStep from './steps/Part1PersonalInfoStep';
import Part2HouseholdInfoStep from './steps/Part2HouseholdInfoStep';
import Part3ParentGuardianStep from './steps/Part3ParentGuardianStep';
import Part4HouseholdCompositionStep from './steps/Part4HouseholdCompositionStep';
import Part5AcademicInfoStep from './steps/Part5AcademicInfoStep';
import Part6PWDStep from './steps/Part6PWDStep';
import Part7SoloParentStep from './steps/Part7SoloParentStep';
import Part8IPStep from './steps/Part8IPStep';
import Part9SportsDanceMusicStep from './steps/Part9SportsDanceMusicStep';
import Part10IndigentStep from './steps/Part10IndigentStep';
import Part11CertificationStep from './steps/Part11CertificationStep';
import { CheckCircle2, Download } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { toast } from 'sonner';

const STEPS = [
  { id: 'part1', title: 'I. Personal Info' },
  { id: 'part2', title: 'II. Household Head' },
  { id: 'part3', title: 'III. Parent/Guardian' },
  { id: 'part4', title: 'IV. Household Comp.' },
  { id: 'part5', title: 'V. Academic Info' },
  { id: 'part6', title: 'VI. PWD' },
  { id: 'part7', title: 'VII. Solo Parent' },
  { id: 'part8', title: 'VIII. Indigenous Peoples' },
  { id: 'part9', title: 'IX. Sports/Arts' },
  { id: 'part10', title: 'X. Indigent' },
  { id: 'part11', title: 'XI. Certification' },
];

export default function ApplicationWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successRefNumber, setSuccessRefNumber] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const methods = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      householdMembers: [
        { name: "", relationship: "Self", sex: "Male", age: "", civilStatus: "Single", education: "", employmentStatus: "Unemployed", currentlyStudying: "Yes" }
      ],
      isPwd: "No",
      isSoloParent: "No",
      isIp: "No",
      isAthleteArtist: "No",
      isIndigent: "No",
    },
    mode: "onTouched",
  });

  const { handleSubmit, trigger } = methods;

  const STEP_FIELDS: (keyof ApplicationFormValues)[][] = [
    // Step 1
    ['studentId', 'lastName', 'givenName', 'middleName', 'noMiddleName', 'extension', 'college', 'course', 'major', 'yearLevel', 'sex', 'age', 'birthdate', 'civilStatus', 'placeOfBirth', 'religion', 'religionOthers', 'mobileNumber', 'emailAddress', 'currentHouseBlock', 'currentStreet', 'currentBarangay', 'currentMunicipality', 'currentProvince', 'currentRegion', 'currentZipCode', 'sameAsCurrentAddress', 'permanentHouseBlock', 'permanentStreet', 'permanentBarangay', 'permanentMunicipality', 'permanentProvince', 'permanentRegion', 'permanentZipCode', 'studentClassification'],
    // Step 2
    ['headFullName', 'headRelationship', 'headRelationshipOthers', 'totalMembers', 'monthlyIncome', 'mainSourceOfIncome', 'mainSourceOfIncomeOthers', 'govAssistance', 'govAssistanceOthers'],
    // Step 3
    ['fatherFamilyName', 'fatherGivenName', 'fatherMiddleName', 'fatherNoMiddleName', 'fatherExtension', 'fatherLivingStatus', 'fatherEducation', 'fatherEmploymentStatus', 'fatherOccupationCategory', 'fatherOccupationOthers', 'fatherSpecificOccupation', 'fatherEmployer', 'fatherMonthlyIncome', 'motherFamilyName', 'motherGivenName', 'motherMiddleName', 'motherNoMiddleName', 'motherLivingStatus', 'motherEducation', 'motherEmploymentStatus', 'motherOccupationCategory', 'motherOccupationOthers', 'motherEmployer', 'motherMonthlyIncome', 'guardianFullName', 'guardianRelationship', 'guardianRelationshipOthers', 'guardianContact'],
    // Step 4
    ['householdMembers'],
    // Step 5
    ['previousGwa', 'academicHonors', 'uploadGrades', 'uploadRecommendation', 'uploadGwaProof'],
    // Step 6
    ['isPwd', 'pwdType', 'pwdTypeOthers', 'pwdIdNumber', 'pwdLgu', 'pwdDateIssued', 'pwdExpiration', 'uploadPwdId', 'uploadMedicalCert'],
    // Step 7
    ['isSoloParent', 'soloParentIdNumber', 'soloParentLgu', 'soloParentDateIssued', 'soloParentExpiration', 'uploadSoloParentId'],
    // Step 8
    ['isIp', 'ipTribe', 'ipTribeOthers', 'ipNcipNumber', 'ipDomain', 'uploadNcipCct', 'uploadNcipConfirmation', 'uploadTribalChieftainCert'],
    // Step 9
    ['isAthleteArtist', 'athleteType', 'athleteEvent', 'athleteYears', 'athleteHighestCompetition', 'athleteAwards', 'uploadAthleteCert', 'uploadAthleteAwards'],
    // Step 10
    ['isIndigent', 'indigentVerificationType', 'uploadIndigentCert', 'uploadSocialCaseStudy', 'uploadCertOfIndigency'],
    // Step 11
    ['certifyTrue', 'certifyAuthentic', 'dataPrivacyConsent', 'uploadDigitalSignature']
  ];

  const nextStep = async () => {
    const fieldsToValidate = STEP_FIELDS[currentStep];
    let isStepValid = await trigger(fieldsToValidate);
    
    // Manual check for file uploads due to zodResolver partial trigger limitations
    const data = methods.getValues();
    const isFileValid = (val: any) => {
      if (val && typeof val === 'object' && 'length' in val) return val.length > 0;
      if (typeof val === 'string' && val.length > 0) return true;
      return false;
    };

    const addManualError = (field: keyof ApplicationFormValues, msg: string) => {
      methods.setError(field, { type: "manual", message: msg });
      isStepValid = false;
    };

    if (currentStep === 4) { // Step 5: Academic Info
      if (!isFileValid(data.uploadGrades)) addManualError('uploadGrades', 'Grades attachment is required');
      if (!isFileValid(data.uploadRecommendation)) addManualError('uploadRecommendation', 'Recommendation letter is required');
      if (!isFileValid(data.uploadGwaProof)) addManualError('uploadGwaProof', 'GWA proof is required');
    } else if (currentStep === 5 && data.isPwd === 'Yes') { // Step 6: PWD
      if (!isFileValid(data.uploadPwdId)) addManualError('uploadPwdId', 'PWD ID is required');
    } else if (currentStep === 6 && data.isSoloParent === 'Yes') { // Step 7: Solo Parent
      if (!isFileValid(data.uploadSoloParentId)) addManualError('uploadSoloParentId', 'Solo Parent ID is required');
    } else if (currentStep === 7 && data.isIp === 'Yes') { // Step 8: IP
      if (!isFileValid(data.uploadNcipCct)) addManualError('uploadNcipCct', 'NCIP CCT is required');
      if (!isFileValid(data.uploadNcipConfirmation)) addManualError('uploadNcipConfirmation', 'NCIP Confirmation is required');
    } else if (currentStep === 8 && data.isAthleteArtist === 'Yes') { // Step 9: Athlete
      if (!isFileValid(data.uploadAthleteCert)) addManualError('uploadAthleteCert', 'Athlete/Artist Certificate is required');
      if (!isFileValid(data.uploadAthleteAwards)) addManualError('uploadAthleteAwards', 'Awards proof is required');
    } else if (currentStep === 9 && data.isIndigent === 'Yes') { // Step 10: Indigent
      const hasIndigent = isFileValid(data.uploadIndigentCert);
      const hasCaseStudy = isFileValid(data.uploadSocialCaseStudy);
      const hasCert = isFileValid(data.uploadCertOfIndigency);
      if (!hasIndigent && !hasCaseStudy && !hasCert) {
        addManualError('uploadIndigentCert', 'Please provide at least one indigent document');
      }
    } else if (currentStep === 10) { // Step 11: Certification
      if (!isFileValid(data.uploadDigitalSignature)) addManualError('uploadDigitalSignature', 'Digital Signature is required');
    }

    if (isStepValid) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    } else {
      // Extract specific error messages or nicely formatted field names for the current step
      const stepErrors = fieldsToValidate
        .filter(field => methods.formState.errors[field as keyof ApplicationFormValues])
        .map(field => {
          const errorMsg = methods.formState.errors[field as keyof ApplicationFormValues]?.message as string;
          // If Zod throws a generic type error or it's missing, format the field name
          if (!errorMsg || errorMsg.includes('Invalid input') || errorMsg === 'Required') {
            // Convert camelCase to Title Case (e.g. mainSourceOfIncome -> Main Source Of Income)
            return field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          }
          // Otherwise, use our custom message but strip " is required" to keep the list clean
          return errorMsg.replace(/ is required/i, '');
        });

      if (stepErrors.length === 1) {
        toast.error('Missing Required Field', {
          description: `Please provide: ${stepErrors[0]}`,
        });
      } else if (stepErrors.length > 1) {
        const missingList = stepErrors.join(', ');
        toast.error(`Missing ${stepErrors.length} Required Fields`, {
          description: `Please provide: ${missingList}`,
        });
      } else {
        toast.error('Missing Required Fields', {
          description: 'Please fill out all the required fields before proceeding to the next step.',
        });
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onFormError = (errors: any) => {
    console.log("Validation Errors preventing submission:", errors);
    toast.error('Missing Required Fields', {
      description: 'Please review the form and fill out all required fields before submitting.',
    });
  };

  const onSubmit = async (data: ApplicationFormValues) => {
    setIsSubmitting(true);
    console.log('Final Form Data Submitted:', data);
    
    try {
      const formData = new FormData();
      
      // Convert nested objects/arrays to strings, and append Files directly
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof FileList) {
          if (value.length > 0) {
            formData.append(key, value[0]); // Take the first file
          }
        } else if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== undefined && value !== null) {
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await fetch(`/api/applications`, {
        method: 'POST',
        // Do not set Content-Type header when sending FormData, the browser handles the boundary
        body: formData
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit application');
      }
      
      setSuccessRefNumber(result.referenceNumber);
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto min-h-screen pb-32 sm:py-10 sm:px-6 lg:px-8">
      {/* Sticky Progress Bar / Stepper Header */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b border-border/50 px-4 py-4 sm:py-6 mb-6 sm:mb-10 shadow-sm sm:rounded-b-2xl transition-all">
        <h1 className="text-xl sm:text-3xl font-serif font-bold text-center mb-4 sm:mb-8 text-foreground">Scholarship Application</h1>
        
        {/* Simplified Stepper for 11 steps */}
        <div className="flex flex-col items-center">
          <div className="w-full bg-muted h-2 rounded-full mb-4 overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-500 ease-in-out" 
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
          <div className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider text-center mt-2">
            Step {currentStep + 1} of {STEPS.length}: <span className="text-primary font-bold">{STEPS[currentStep].title}</span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-card sm:border sm:border-border sm:shadow-sm sm:rounded-3xl p-4 sm:p-10 mb-8">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onFormError)}>
            
            {currentStep === 0 && <Part1PersonalInfoStep />}
            {currentStep === 1 && <Part2HouseholdInfoStep />}
            {currentStep === 2 && <Part3ParentGuardianStep />}
            {currentStep === 3 && <Part4HouseholdCompositionStep />}
            {currentStep === 4 && <Part5AcademicInfoStep />}
            {currentStep === 5 && <Part6PWDStep />}
            {currentStep === 6 && <Part7SoloParentStep />}
            {currentStep === 7 && <Part8IPStep />}
            {currentStep === 8 && <Part9SportsDanceMusicStep />}
            {currentStep === 9 && <Part10IndigentStep />}
            {currentStep === 10 && <Part11CertificationStep />}

            {/* Sticky Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-t border-border/50 p-4 pb-safe shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
              <div className="max-w-4xl mx-auto flex justify-between items-center gap-3 sm:px-6 lg:px-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="w-1/3 sm:w-auto px-4 sm:px-6 py-3.5 sm:py-2.5 border-2 border-input/50 bg-background/50 hover:bg-accent hover:text-accent-foreground text-sm font-bold rounded-2xl sm:rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {currentStep < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 sm:flex-none sm:w-auto px-6 py-3.5 sm:py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold rounded-2xl sm:rounded-xl shadow-lg shadow-primary/25 transition-transform active:scale-[0.98]"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none sm:w-auto px-8 py-3.5 sm:py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold rounded-2xl sm:rounded-xl shadow-lg shadow-primary/30 transition-transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </div>

      {/* Success Modal */}
      {successRefNumber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
            
            {/* The exact area that gets captured as an image */}
            <div ref={modalRef} className="p-8 pb-6 text-center bg-card">
              <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Application Submitted!</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Your scholarship application has been successfully received. Please save your reference number for tracking.
              </p>
              
              <div className="bg-muted p-4 rounded-xl border border-border/50">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Reference Number</p>
                <p className="text-2xl font-bold text-primary tracking-widest">{successRefNumber}</p>
              </div>
            </div>

            {/* Buttons area (Not captured) */}
            <div className="px-8 pb-8 pt-2">
              <div className="flex flex-col gap-3">
                <button 
                  type="button"
                  onClick={async () => {
                    if (!modalRef.current) return;
                    try {
                      // Add a small temporary style to make the saved image look like a complete card
                      const originalBorderRadius = modalRef.current.style.borderRadius;
                      modalRef.current.style.borderRadius = '24px';
                      
                      const dataUrl = await htmlToImage.toPng(modalRef.current, {
                        backgroundColor: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#020817' : '#ffffff',
                        pixelRatio: 3, // Higher quality
                      });
                      
                      // Restore original style
                      modalRef.current.style.borderRadius = originalBorderRadius;
                      
                      const link = document.createElement('a');
                      link.download = `Application_${successRefNumber}.png`;
                      link.href = dataUrl;
                      link.click();
                    } catch (err) {
                      console.error("Failed to generate image:", err);
                      alert("Failed to save image. Please take a screenshot manually.");
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold rounded-xl transition-all"
                >
                  <Download className="w-4 h-4" /> Save to Gallery
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setSuccessRefNumber(null);
                    setCurrentStep(0);
                    methods.reset();
                  }}
                  className="w-full px-4 py-3 mt-1 text-muted-foreground hover:text-foreground text-sm font-semibold transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
