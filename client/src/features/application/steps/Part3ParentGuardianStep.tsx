import { useFormContext } from 'react-hook-form';
import type { ApplicationFormValues } from '../schema';

export default function Part3ParentGuardianStep() {
  const { register, watch } = useFormContext<ApplicationFormValues>();

  const fatherOccupationCategory = watch("fatherOccupationCategory");
  const motherOccupationCategory = watch("motherOccupationCategory");
  const guardianRelationship = watch("guardianRelationship");

  const employmentStatuses = ["Employed", "Self-employed", "Unemployed", "Retired", "Seasonal Worker", "OFW", "Pensioner", "Unable to Work", "Deceased"];
  const occupations = ["Government Employee", "Private Employee", "Farmer", "Fisherfolk", "Driver", "Skilled Worker", "Laborer", "Factory Worker", "Vendor", "Business Owner", "Professional", "Housekeeper", "OFW", "Others"];
  const incomes = ["No Income", "Less than P11,000", "P11,000 – P21,999", "P22,000 – P43,999", "P44,000 – P76,999", "P77,000 – P131,999", "P132,000 – P219,999", "P220,000 and Above"];
  const educations = ["No Formal Education", "Elementary Level", "Elementary Graduate", "Junior High School Level", "Junior High School Graduate", "Senior High School Level", "Senior High School Graduate", "Vocational/Technical", "College Level", "College Graduate", "Master's Degree", "Doctorate Degree"];

  return (
    <div className="space-y-12 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-serif font-bold mb-1">Part III. Parent / Guardian Information</h2>
        <p className="text-sm text-muted-foreground">Provide details about your parents or guardian.</p>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-serif font-bold border-b border-border pb-2 text-primary">FATHER'S INFORMATION</h3>
        <p className="text-xs text-muted-foreground">Tap or click an option to select.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2"><label className="text-xs font-medium">Family Name</label><input placeholder="e.g. Dela Cruz" {...register("fatherFamilyName")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
          <div className="space-y-2"><label className="text-xs font-medium">Given Name</label><input placeholder="e.g. Juan" {...register("fatherGivenName")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Middle Name</label>
              <label className="flex items-center space-x-1 text-[10px] cursor-pointer">
                <input type="checkbox" {...register("fatherNoMiddleName")} className="rounded border-border text-primary focus:ring-primary h-3 w-3" />
                <span className="text-muted-foreground">None</span>
              </label>
            </div>
            <input placeholder="e.g. Reyes" {...register("fatherMiddleName")} disabled={watch("fatherNoMiddleName")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm disabled:opacity-50 disabled:bg-muted" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium">Extension</label>
            <select {...register("fatherExtension")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm">
              <option value="">None</option>
              <option value="Jr.">Jr.</option>
              <option value="Sr.">Sr.</option>
              <option value="II">II</option>
              <option value="III">III</option>
              <option value="IV">IV</option>
              <option value="V">V</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2"><label className="text-xs font-medium">Living Status</label><select {...register("fatherLivingStatus")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"><option value="">Select Status</option><option value="Living">Living</option><option value="Deceased">Deceased</option></select></div>
          <div className="space-y-2"><label className="text-xs font-medium">Highest Education</label><select {...register("fatherEducation")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"><option value="">Select Education</option>{educations.map(e => <option key={e} value={e}>{e}</option>)}</select></div>
          <div className="space-y-2"><label className="text-xs font-medium">Employment Status</label><select {...register("fatherEmploymentStatus")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"><option value="">Select Status</option>{employmentStatuses.map(e => <option key={e} value={e}>{e}</option>)}</select></div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium">Occupation Category</label>
            <select {...register("fatherOccupationCategory")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"><option value="">Select Occupation</option>{occupations.map(e => <option key={e} value={e}>{e}</option>)}</select>
            {fatherOccupationCategory === "Others" && (
              <input {...register("fatherOccupationOthers")} placeholder="Please specify occupation" className="flex h-9 w-full mt-2 rounded-md border border-input bg-background px-3 py-1 text-sm animate-fade-in-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            )}
          </div>
          
          <div className="space-y-2"><label className="text-xs font-medium">Specific Occupation (Optional)</label><input placeholder="e.g. Carpenter, Vendor" {...register("fatherSpecificOccupation")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
          <div className="space-y-2"><label className="text-xs font-medium">Employer / Business</label><input placeholder="e.g. ABC Construction" {...register("fatherEmployer")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
          <div className="space-y-2 md:col-span-3"><label className="text-xs font-medium">Monthly Income</label><select {...register("fatherMonthlyIncome")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"><option value="">Select Income Bracket</option>{incomes.map(e => <option key={e} value={e}>{e}</option>)}</select></div>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-border">
        <h3 className="text-lg font-serif font-bold border-b border-border pb-2 text-primary">MOTHER'S MAIDEN NAME</h3>
        <p className="text-xs text-muted-foreground">Tap or click an option to select.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2"><label className="text-xs font-medium">Family Name</label><input placeholder="e.g. Dela Cruz" {...register("motherFamilyName")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
          <div className="space-y-2"><label className="text-xs font-medium">Given Name</label><input placeholder="e.g. Maria" {...register("motherGivenName")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Middle Name</label>
              <label className="flex items-center space-x-1 text-[10px] cursor-pointer">
                <input type="checkbox" {...register("motherNoMiddleName")} className="rounded border-border text-primary focus:ring-primary h-3 w-3" />
                <span className="text-muted-foreground">None</span>
              </label>
            </div>
            <input placeholder="e.g. Santos" {...register("motherMiddleName")} disabled={watch("motherNoMiddleName")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm disabled:opacity-50 disabled:bg-muted" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2"><label className="text-xs font-medium">Living Status</label><select {...register("motherLivingStatus")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"><option value="">Select Status</option><option value="Living">Living</option><option value="Deceased">Deceased</option></select></div>
          <div className="space-y-2"><label className="text-xs font-medium">Highest Education</label><select {...register("motherEducation")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"><option value="">Select Education</option>{educations.map(e => <option key={e} value={e}>{e}</option>)}</select></div>
          <div className="space-y-2"><label className="text-xs font-medium">Employment Status</label><select {...register("motherEmploymentStatus")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"><option value="">Select Status</option>{employmentStatuses.map(e => <option key={e} value={e}>{e}</option>)}</select></div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium">Occupation Category</label>
            <select {...register("motherOccupationCategory")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"><option value="">Select Occupation</option>{occupations.map(e => <option key={e} value={e}>{e}</option>)}</select>
            {motherOccupationCategory === "Others" && (
              <input {...register("motherOccupationOthers")} placeholder="Please specify occupation" className="flex h-9 w-full mt-2 rounded-md border border-input bg-background px-3 py-1 text-sm animate-fade-in-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            )}
          </div>
          
          <div className="space-y-2"><label className="text-xs font-medium">Employer / Business (Optional)</label><input placeholder="e.g. Department of Education" {...register("motherEmployer")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
          <div className="space-y-2"><label className="text-xs font-medium">Monthly Income</label><select {...register("motherMonthlyIncome")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"><option value="">Select Income Bracket</option>{incomes.map(e => <option key={e} value={e}>{e}</option>)}</select></div>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-border">
        <h3 className="text-lg font-serif font-bold border-b border-border pb-2 text-primary">GUARDIAN (If Applicable)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2"><label className="text-xs font-medium">Full Name</label><input placeholder="e.g. Juan Dela Cruz" {...register("guardianFullName")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
          <div className="space-y-2">
            <label className="text-xs font-medium">Relationship to Applicant</label>
            <select {...register("guardianRelationship")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm">
              <option value="">Select Relationship</option>
              {["Grandparent", "Aunt/Uncle", "Sibling", "Step-parent", "Legal Guardian", "Spouse", "Other"].map(rel => (
                <option key={rel} value={rel}>{rel}</option>
              ))}
            </select>
            {guardianRelationship === "Other" && (
              <div className="mt-2 animate-fade-in-up">
                <input 
                  {...register("guardianRelationshipOthers")} 
                  placeholder="Please specify relationship" 
                  className="flex h-9 w-full rounded-md border border-primary/50 bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-sm" 
                  autoFocus
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium">Contact Number</label>
            <div className="flex">
              <span className="inline-flex items-center px-2 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-xs font-medium">+63</span>
              <input {...register("guardianContact")} placeholder="9XXXXXXXXX" maxLength={10} className="flex-1 h-9 rounded-none rounded-r-md border border-input bg-background px-3 py-1 text-sm" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
