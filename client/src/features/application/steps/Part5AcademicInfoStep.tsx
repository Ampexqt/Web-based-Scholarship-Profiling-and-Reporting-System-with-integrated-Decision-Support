import { useFormContext } from 'react-hook-form';
import type { ApplicationFormValues } from '../schema';
import { FileUpload } from '@/components/ui/file-upload';

export default function Part5AcademicInfoStep() {
  const { register } = useFormContext<ApplicationFormValues>();

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-serif font-bold mb-1">Part V. Academic Information</h2>
        <p className="text-sm text-muted-foreground">Provide your academic records and upload required attachments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Previous Semester GWA <span className="text-destructive">*</span></label>
          <input {...register("previousGwa")} type="number" step="0.01" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Academic Honors</label>
          <select {...register("academicHonors")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="None">None</option>
            <option value="Dean's Lister">Dean's Lister</option>
            <option value="President's Lister">President's Lister</option>
            <option value="With Academic Honors">With Academic Honors</option>
          </select>
        </div>
      </div>

      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-serif font-bold mb-4">Required Attachments (File Uploads)</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Certified Copy of Grades <span className="text-destructive">*</span></label>
            <FileUpload name="uploadGrades" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Recommendation Letter by the Dean <span className="text-destructive">*</span></label>
            <FileUpload name="uploadRecommendation" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">General Weighted Average (GWA) Proof <span className="text-destructive">*</span></label>
            <FileUpload name="uploadGwaProof" />
          </div>
        </div>
      </div>
    </div>
  );
}
