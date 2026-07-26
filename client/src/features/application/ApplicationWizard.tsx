import { useState } from 'react';
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

  const { handleSubmit } = methods;

  const nextStep = async () => {
    // We could validate the specific fields of the current step here if we wanted
    // For now, we'll let them navigate freely or trigger full validation at the end.
    // const isStepValid = await trigger();
    // if (isStepValid) {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onFormError = (errors: any) => {
    console.log("Validation Errors preventing submission:", errors);
    alert("Notice: There are validation errors on previous steps (check console). Bypassing validation to show the Success Modal mockup!");
    onSubmit({} as any); // Force submit for mockup purposes
  };

  const onSubmit = async (data: ApplicationFormValues) => {
    setIsSubmitting(true);
    console.log('Final Form Data Submitted:', data);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock reference number
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setSuccessRefNumber(`APP-${year}-${randomNum}`);
    setIsSubmitting(false);
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
          <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl border border-border p-8 text-center animate-in zoom-in-95 duration-300">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Application Submitted!</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Your scholarship application has been successfully received. Please save your reference number for tracking.
            </p>
            
            <div className="bg-muted p-4 rounded-xl mb-8 border border-border/50">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Reference Number</p>
              <p className="text-2xl font-bold text-primary tracking-widest">{successRefNumber}</p>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                type="button"
                onClick={() => alert("Saving image to gallery... (Mockup)")}
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
                className="w-full px-4 py-3 mt-2 text-muted-foreground hover:text-foreground text-sm font-semibold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
