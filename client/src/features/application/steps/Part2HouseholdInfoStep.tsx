import { useFormContext } from 'react-hook-form';
import type { ApplicationFormValues } from '../schema';

export default function Part2HouseholdInfoStep() {
  const { register, watch } = useFormContext<ApplicationFormValues>();
  
  const mainSourceOfIncome = watch("mainSourceOfIncome");
  const govAssistance = watch("govAssistance");
  const headRelationship = watch("headRelationship");

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-serif font-bold mb-1">Part II. Household Information</h2>
        <p className="text-sm text-muted-foreground">Details about your household head and income.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Household Head Full Name <span className="text-destructive">*</span></label>
          <input {...register("headFullName")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Relationship to Applicant <span className="text-destructive">*</span></label>
          <select {...register("headRelationship")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Select Relationship</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Guardian">Guardian</option>
            <option value="Sibling">Sibling</option>
            <option value="Grandparent">Grandparent</option>
            <option value="Spouse">Spouse</option>
            <option value="Others">Others</option>
          </select>
          {headRelationship === "Others" && (
            <div className="mt-2 animate-fade-in-up">
              <input 
                {...register("headRelationshipOthers")} 
                placeholder="Please specify relationship" 
                className="flex h-10 w-full rounded-md border border-primary/50 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm" 
                autoFocus
              />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Total Number of Household Members <span className="text-destructive">*</span></label>
          <input type="number" {...register("totalMembers")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Total Estimated Monthly Household Income <span className="text-destructive">*</span></label>
          <select {...register("monthlyIncome")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Select Income Bracket</option>
            <option value="No Income">No Income</option>
            <option value="Less than P11,000">Less than P11,000</option>
            <option value="P11,000 - P21,999">P11,000 - P21,999</option>
            <option value="P22,000 - P43,999">P22,000 - P43,999</option>
            <option value="P44,000 - P76,999">P44,000 - P76,999</option>
            <option value="P77,000 - P131,999">P77,000 - P131,999</option>
            <option value="P132,000 - P219,999">P132,000 - P219,999</option>
            <option value="P220,000 and Above">P220,000 and Above</option>
          </select>
        </div>
      </div>

      <div className="border-t border-border pt-8">
        <div className="mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-1">Main Source of Household Income</h3>
          <p className="text-xs text-muted-foreground">Tap or click an option below to select it.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {["Government Employment", "Private Employment", "Self-Employment", "Farming", "Fishing", "Small Business", "Daily Wage", "OFW Remittance", "Pension", "Others"].map((src) => (
            <label 
              key={src} 
              className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                mainSourceOfIncome === src 
                  ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                  : 'border-border hover:border-primary/30 hover:bg-accent/50'
              }`}
            >
              <input type="radio" value={src} {...register("mainSourceOfIncome")} className="sr-only" />
              <span className={`text-sm font-medium ${mainSourceOfIncome === src ? 'text-primary' : 'text-foreground'}`}>
                {src}
              </span>
            </label>
          ))}
        </div>
        {mainSourceOfIncome === "Others" && (
          <div className="mt-3 animate-fade-in-up">
            <input 
              {...register("mainSourceOfIncomeOthers")} 
              placeholder="Please specify your source of income" 
              className="flex h-10 w-full max-w-sm rounded-md border border-primary/50 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm" 
              autoFocus
            />
          </div>
        )}
      </div>

      <div className="border-t border-border pt-8">
        <div className="mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-1">Government Assistance Beneficiary?</h3>
          <p className="text-xs text-muted-foreground">Tap or click an option below to select it.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {["4Ps", "Sustainable Livelihood Program", "AKAP", "Social Pension", "None", "Others"].map((gov) => (
            <label 
              key={gov} 
              className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                govAssistance === gov 
                  ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                  : 'border-border hover:border-primary/30 hover:bg-accent/50'
              }`}
            >
              <input type="radio" value={gov} {...register("govAssistance")} className="sr-only" />
              <span className={`text-sm font-medium ${govAssistance === gov ? 'text-primary' : 'text-foreground'}`}>
                {gov}
              </span>
            </label>
          ))}
        </div>
        {govAssistance === "Others" && (
          <div className="mt-3 animate-fade-in-up">
            <input 
              {...register("govAssistanceOthers")} 
              placeholder="Please specify government assistance" 
              className="flex h-10 w-full max-w-sm rounded-md border border-primary/50 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm" 
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
}
