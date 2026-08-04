import { useFormContext } from 'react-hook-form';
import type { ApplicationFormValues } from '../schema';
import { FileUpload } from '@/components/ui/file-upload';

export default function Part8IPStep() {
  const { register, watch } = useFormContext<ApplicationFormValues>();
  const isIp = watch("isIp");
  const ipTribe = watch("ipTribe");

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-serif font-bold mb-1">Part VIII. Indigenous Peoples (IP)</h2>
        <p className="text-sm text-muted-foreground">Information for Indigenous Cultural Community/Indigenous Peoples (ICC/IP).</p>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-foreground">Are you a member of an ICC/IP? <span className="text-destructive">*</span></label>
          <div className="flex space-x-4">
            {["Yes", "No"].map((option) => (
              <label 
                key={option} 
                className={`relative flex items-center justify-center p-3 w-24 border rounded-lg cursor-pointer transition-all ${
                  isIp === option 
                    ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                    : 'border-border hover:border-primary/30 hover:bg-accent/50'
                }`}
              >
                <input type="radio" value={option} {...register("isIp")} className="sr-only" />
                <span className={`text-sm font-medium ${isIp === option ? 'text-primary' : 'text-foreground'}`}>
                  {option}
                </span>
              </label>
            ))}
          </div>
      </div>

      {isIp === "Yes" && (
        <div className="space-y-8 animate-fade-in-up pt-4 border-t border-border">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tribe/Ethnolinguistic Group <span className="text-destructive">*</span></label>
            <select {...register("ipTribe")} className="flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring">
              <option value="">Select Tribe</option>
              {["Teduray", "Subanen", "Sama", "Yakan", "Tausug", "Maranao", "Maguindanaoan", "Higaonon", "Manobo", "B'laan", "T'boli", "Tagabo", "Mandaya", "Mansaka", "Ata", "Banwaon", "Talaandig", "Mamanwa", "Others"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {ipTribe === "Others" && (
              <input {...register("ipTribeOthers")} placeholder="Please specify your tribe" className="flex h-10 w-full max-w-md mt-2 rounded-md border border-input bg-background px-3 py-2 text-sm animate-fade-in-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2"><label className="text-xs font-medium">NCIP Certificate Number</label><input placeholder="e.g. 12-3456" {...register("ipNcipNumber")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
            <div className="space-y-2"><label className="text-xs font-medium">Ancestral Domain/Community</label><input placeholder="e.g. Subanen" {...register("ipDomain")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold uppercase tracking-wider">Required Attachments (File Uploads)</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">NCIP Certificate of Tribal Membership (CCT) <span className="text-destructive">*</span></label>
                <FileUpload name="uploadNcipCct" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">NCIP Certificate of Confirmation <span className="text-destructive">*</span></label>
                <FileUpload name="uploadNcipConfirmation" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Certification from Tribal Chieftain (if applicable)</label>
                <FileUpload name="uploadTribalChieftainCert" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
