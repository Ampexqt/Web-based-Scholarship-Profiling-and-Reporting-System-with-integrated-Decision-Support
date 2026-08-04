import { useFormContext } from 'react-hook-form';
import type { ApplicationFormValues } from '../schema';
import { FileUpload } from '@/components/ui/file-upload';

export default function Part9SportsDanceMusicStep() {
  const { register, watch } = useFormContext<ApplicationFormValues>();
  const isAthleteArtist = watch("isAthleteArtist");

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-serif font-bold mb-1">Part IX. Sports, Dance and Musical</h2>
        <p className="text-sm text-muted-foreground">Information for University Athletes, Dance Troupe, and Musical members.</p>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-foreground">Are you part of the University Sports Athlete, Dance Troupe and Musical? <span className="text-destructive">*</span></label>
        <div className="flex space-x-4">
          {["Yes", "No"].map((option) => (
            <label 
              key={option} 
              className={`relative flex items-center justify-center p-3 w-24 border rounded-lg cursor-pointer transition-all ${
                isAthleteArtist === option 
                  ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                  : 'border-border hover:border-primary/30 hover:bg-accent/50'
              }`}
            >
              <input type="radio" value={option} {...register("isAthleteArtist")} className="sr-only" />
              <span className={`text-sm font-medium ${isAthleteArtist === option ? 'text-primary' : 'text-foreground'}`}>
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>

      {isAthleteArtist === "Yes" && (
        <div className="space-y-8 animate-fade-in-up pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"><label className="text-xs font-medium">What Sports, Dance, and Musical?</label><input placeholder="e.g. Basketball, Chess, Choir" {...register("athleteType")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
            <div className="space-y-2"><label className="text-xs font-medium">Event/Position</label><input placeholder="e.g. Point Guard, Singer" {...register("athleteEvent")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
            <div className="space-y-2"><label className="text-xs font-medium">Number of Years Participating</label><input placeholder="e.g. 3" type="number" {...register("athleteYears")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
            <div className="space-y-2">
              <label className="text-xs font-medium">Highest Competition Participated</label>
              <select {...register("athleteHighestCompetition")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm">
                <option value="">Select Competition Level</option>
                <option value="Municipal">Municipal</option>
                <option value="Provincial">Provincial</option>
                <option value="Regional">Regional</option>
                <option value="National">National</option>
                <option value="International">International</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2"><label className="text-xs font-medium">Awards and Achievements</label><input placeholder="e.g. MVP, Gold Medalist" {...register("athleteAwards")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" /></div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold uppercase tracking-wider">Required Attachments (File Uploads)</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Sports / Performing Arts Certificate or Proof of Membership <span className="text-destructive">*</span></label>
                <FileUpload name="uploadAthleteCert" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Proof of Awards / Certificates of Achievement</label>
                <FileUpload name="uploadAthleteAwards" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
