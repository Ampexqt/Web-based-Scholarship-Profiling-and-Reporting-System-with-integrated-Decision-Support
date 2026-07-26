import { useFormContext } from 'react-hook-form';
import type { ApplicationFormValues } from '../schema';
import { FileUpload } from '@/components/ui/file-upload';

export default function Part7SoloParentStep() {
  const { register, watch } = useFormContext<ApplicationFormValues>();
  const isSoloParent = watch("isSoloParent");

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-serif font-bold mb-1">Part VII. Solo Parent</h2>
        <p className="text-sm text-muted-foreground">Information for Solo Parents.</p>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-foreground">Are you a Solo Parent? <span className="text-destructive">*</span></label>
          <div className="flex space-x-4">
            {["Yes", "No"].map((option) => (
              <label 
                key={option} 
                className={`relative flex items-center justify-center p-3 w-24 border rounded-lg cursor-pointer transition-all ${
                  isSoloParent === option 
                    ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                    : 'border-border hover:border-primary/30 hover:bg-accent/50'
                }`}
              >
                <input type="radio" value={option} {...register("isSoloParent")} className="sr-only" />
                <span className={`text-sm font-medium ${isSoloParent === option ? 'text-primary' : 'text-foreground'}`}>
                  {option}
                </span>
              </label>
            ))}
          </div>
      </div>

      {isSoloParent === "Yes" && (
        <div className="space-y-8 animate-fade-in-up pt-4 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2"><label className="text-xs font-medium">Solo Parent ID Number</label><input {...register("soloParentIdNumber")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
            <div className="space-y-2"><label className="text-xs font-medium">Issuing LGU</label><input {...register("soloParentLgu")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
            <div className="space-y-2"><label className="text-xs font-medium">Date Issued</label><input type="date" {...register("soloParentDateIssued")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
            <div className="space-y-2"><label className="text-xs font-medium">Expiration Date</label><input type="date" {...register("soloParentExpiration")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold uppercase tracking-wider">Required Attachment (File Upload)</h3>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Valid Solo Parent ID (Front and Back) <span className="text-destructive">*</span></label>
              <FileUpload name="uploadSoloParentId" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
