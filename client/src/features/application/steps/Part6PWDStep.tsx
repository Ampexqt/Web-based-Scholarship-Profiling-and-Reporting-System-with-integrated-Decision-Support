import { useFormContext } from 'react-hook-form';
import type { ApplicationFormValues } from '../schema';
import { FileUpload } from '@/components/ui/file-upload';

export default function Part6PWDStep() {
  const { register, watch } = useFormContext<ApplicationFormValues>();
  const isPwd = watch("isPwd");
  const pwdType = watch("pwdType");

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-serif font-bold mb-1">Part VI. Special Circumstances</h2>
        <p className="text-sm text-muted-foreground">Person with Disability (PWD) / Person with Special Needs.</p>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-foreground">Are you a PWD? <span className="text-destructive">*</span></label>
        <div className="flex space-x-4">
          {["Yes", "No"].map((option) => (
            <label 
              key={option} 
              className={`relative flex items-center justify-center p-3 w-24 border rounded-lg cursor-pointer transition-all ${
                isPwd === option 
                  ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                  : 'border-border hover:border-primary/30 hover:bg-accent/50'
              }`}
            >
              <input type="radio" value={option} {...register("isPwd")} className="sr-only" />
              <span className={`text-sm font-medium ${isPwd === option ? 'text-primary' : 'text-foreground'}`}>
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>

      {isPwd === "Yes" && (
        <div className="space-y-8 animate-fade-in-up pt-4 border-t border-border">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Type of Disability <span className="text-destructive">*</span></label>
            <select {...register("pwdType")} className="flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring">
              <option value="">Select Disability Type</option>
              {["Psychosocial Disability", "Chronic Illness", "Learning Disability", "Mental Disability", "Visual Disability", "Orthopedic (Physical) Disability", "Communication Disability", "Intellectual Disability", "Hearing Disability", "Rare Disease", "Cancer", "Others"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {pwdType === "Others" && (
              <input {...register("pwdTypeOthers")} placeholder="Please specify your disability" className="flex h-10 w-full max-w-md mt-2 rounded-md border border-input bg-background px-3 py-2 text-sm animate-fade-in-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2"><label className="text-xs font-medium">PWD ID Number</label><input placeholder="e.g. 12-3456" {...register("pwdIdNumber")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
            <div className="space-y-2"><label className="text-xs font-medium">Issuing LGU</label><input placeholder="e.g. Zamboanga City" {...register("pwdLgu")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
            <div className="space-y-2"><label className="text-xs font-medium">Date Issued</label><input type="date" {...register("pwdDateIssued")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
            <div className="space-y-2"><label className="text-xs font-medium">Expiration Date</label><input type="date" {...register("pwdExpiration")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold uppercase tracking-wider">Required Attachments (File Uploads)</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">PWD ID (Front and Back) <span className="text-destructive">*</span></label>
                <FileUpload name="uploadPwdId" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Medical Certificate (if applicable)</label>
                <FileUpload name="uploadMedicalCert" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
