import { useFormContext } from 'react-hook-form';
import type { ApplicationFormValues } from '../schema';
import { FileUpload } from '@/components/ui/file-upload';

export default function Part10IndigentStep() {
  const { register, watch } = useFormContext<ApplicationFormValues>();
  const isIndigent = watch("isIndigent");

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-serif font-bold mb-1">Part X. Indigent</h2>
        <p className="text-sm text-muted-foreground">Information for Indigent applicants.</p>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-foreground">Has your family been officially identified as indigent? <span className="text-destructive">*</span></label>
          <div className="flex space-x-4">
            {["Yes", "No"].map((option) => (
              <label 
                key={option} 
                className={`relative flex items-center justify-center p-3 w-24 border rounded-lg cursor-pointer transition-all ${
                  isIndigent === option 
                    ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                    : 'border-border hover:border-primary/30 hover:bg-accent/50'
                }`}
              >
                <input type="radio" value={option} {...register("isIndigent")} className="sr-only" />
                <span className={`text-sm font-medium ${isIndigent === option ? 'text-primary' : 'text-foreground'}`}>
                  {option}
                </span>
              </label>
            ))}
          </div>
      </div>

      {isIndigent === "Yes" && (
        <div className="space-y-8 animate-fade-in-up pt-4 border-t border-border">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Type of Verification <span className="text-destructive">*</span></label>
            <select {...register("indigentVerificationType")} className="flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring">
              <option value="">Select Verification Type</option>
              <option value="Barangay Certificate">Barangay Certificate</option>
              <option value="DSWD-Assessed">DSWD-Assessed</option>
              <option value="Social Welfare Assessment">Social Welfare Assessment</option>
            </select>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold uppercase tracking-wider">Required Attachments (File Uploads)</h3>
            <p className="text-xs text-muted-foreground">Provide ONE of the following (or more if applicable):</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Barangay Certification OR Certification from Director/Coach</label>
                <FileUpload name="uploadIndigentCert" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Social Case Study Report</label>
                <FileUpload name="uploadSocialCaseStudy" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Certificate of Indigency</label>
                <FileUpload name="uploadCertOfIndigency" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
