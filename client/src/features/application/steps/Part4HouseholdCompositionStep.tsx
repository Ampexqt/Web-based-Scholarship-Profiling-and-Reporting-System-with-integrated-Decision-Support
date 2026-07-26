import { useFormContext, useFieldArray } from 'react-hook-form';
import type { ApplicationFormValues } from '../schema';

export default function Part4HouseholdCompositionStep() {
  const { register, control, watch } = useFormContext<ApplicationFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "householdMembers"
  });

  const watchedMembers = watch("householdMembers") || [];

  return (
    <div className="space-y-10 animate-fade-in-up">
        <div>
          <h2 className="text-2xl font-serif font-bold mb-1">Part IV. Household Composition</h2>
          <p className="text-sm text-muted-foreground">List all members of your household, excluding yourself.</p>
        </div>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="p-5 border border-border rounded-lg bg-card shadow-sm relative group">
            {index > 0 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
                title="Remove Member"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            )}
            
            <h4 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Member {index + 1}</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="space-y-2"><label className="text-xs font-medium">Full Name</label><input {...register(`householdMembers.${index}.name`)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" placeholder="Name" /></div>
              
              <div className="space-y-2">
                <label className="text-xs font-medium">Relationship</label>
                <select {...register(`householdMembers.${index}.relationship`)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm">
                  <option value="">Select</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Grandparent">Grandparent</option>
                  <option value="Aunt/Uncle">Aunt/Uncle</option>
                  <option value="Others">Others</option>
                </select>
                {watchedMembers[index]?.relationship === "Others" && (
                  <input {...register(`householdMembers.${index}.relationshipOthers`)} placeholder="Specify relationship" className="flex h-9 w-full rounded-md border border-primary/50 bg-background px-3 py-1 text-sm mt-1 animate-fade-in-up" />
                )}
              </div>

              <div className="space-y-2"><label className="text-xs font-medium">Sex</label><select {...register(`householdMembers.${index}.sex`)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"><option value="Male">Male</option><option value="Female">Female</option></select></div>
              <div className="space-y-2"><label className="text-xs font-medium">Age</label><input type="number" {...register(`householdMembers.${index}.age`)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
              
              <div className="space-y-2">
                <label className="text-xs font-medium">Civil Status</label>
                <select {...register(`householdMembers.${index}.civilStatus`)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm">
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                  <option value="Others">Others</option>
                </select>
                {watchedMembers[index]?.civilStatus === "Others" && (
                  <input {...register(`householdMembers.${index}.civilStatusOthers`)} placeholder="Specify status" className="flex h-9 w-full rounded-md border border-primary/50 bg-background px-3 py-1 text-sm mt-1 animate-fade-in-up" />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium">Educational Attainment</label>
                <select {...register(`householdMembers.${index}.education`)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm">
                  <option value="">Select</option>
                  <option value="Elementary Undergraduate">Elementary Undergraduate</option>
                  <option value="Elementary Graduate">Elementary Graduate</option>
                  <option value="High School Undergraduate">High School Undergraduate</option>
                  <option value="High School Graduate">High School Graduate</option>
                  <option value="College Undergraduate">College Undergraduate</option>
                  <option value="College Graduate">College Graduate</option>
                  <option value="Vocational">Vocational</option>
                  <option value="No Formal Education">No Formal Education</option>
                  <option value="Others">Others</option>
                </select>
                {watchedMembers[index]?.education === "Others" && (
                  <input {...register(`householdMembers.${index}.educationOthers`)} placeholder="Specify education" className="flex h-9 w-full rounded-md border border-primary/50 bg-background px-3 py-1 text-sm mt-1 animate-fade-in-up" />
                )}
              </div>

              <div className="space-y-2"><label className="text-xs font-medium">Occupation</label><input {...register(`householdMembers.${index}.occupation`)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
              
              <div className="space-y-2">
                <label className="text-xs font-medium">Employment Status</label>
                <select {...register(`householdMembers.${index}.employmentStatus`)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm">
                  <option value="">Select</option>
                  <option value="Employed">Employed</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Retired">Retired</option>
                  <option value="Student">Student</option>
                  <option value="Others">Others</option>
                </select>
                {watchedMembers[index]?.employmentStatus === "Others" && (
                  <input {...register(`householdMembers.${index}.employmentStatusOthers`)} placeholder="Specify status" className="flex h-9 w-full rounded-md border border-primary/50 bg-background px-3 py-1 text-sm mt-1 animate-fade-in-up" />
                )}
              </div>

              <div className="space-y-2"><label className="text-xs font-medium">Monthly Income (if any)</label><input {...register(`householdMembers.${index}.monthlyIncome`)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
              <div className="space-y-2"><label className="text-xs font-medium">Currently Studying?</label><select {...register(`householdMembers.${index}.currentlyStudying`)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"><option value="Yes">Yes</option><option value="No">No</option></select></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button
          type="button"
          onClick={() => append({ name: "", relationship: "", sex: "Male", age: "", civilStatus: "", education: "", employmentStatus: "", currentlyStudying: "No" })}
          className="px-6 py-2.5 bg-primary/10 text-primary font-medium rounded-md text-sm hover:bg-primary/20 transition-colors w-full sm:w-auto"
        >
          + Add Another Member
        </button>
      </div>
    </div>
  );
}
