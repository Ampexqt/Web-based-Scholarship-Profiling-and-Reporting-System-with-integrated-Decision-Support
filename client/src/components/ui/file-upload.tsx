import { useFormContext } from 'react-hook-form';
import { Camera, CheckCircle2, FileUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  name: string;
  accept?: string;
  helperText?: string;
}

export function FileUpload({ name, accept = "image/*,application/pdf", helperText = "JPG, PNG, or PDF" }: FileUploadProps) {
  const { register, watch } = useFormContext();
  const fileList = watch(name);
  const file = fileList && fileList.length > 0 ? fileList[0] : null;

  return (
    <div className="w-full">
      <input 
        type="file" 
        id={name}
        accept={accept} 
        className="sr-only" 
        {...register(name)} 
      />
      
      {!file ? (
        <label 
          htmlFor={name}
          className={cn(
            "group relative flex flex-col items-center justify-center w-full min-h-[110px] p-4",
            "border-2 border-dashed border-primary/20 rounded-2xl bg-primary/[0.02]",
            "hover:bg-primary/[0.04] hover:border-primary/40 cursor-pointer transition-all duration-300",
            "active:scale-[0.98] focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
          )}
        >
          {/* Visual Anchor to draw the eye */}
          <div className="bg-primary/10 p-3 rounded-full mb-3 group-hover:scale-110 group-hover:bg-primary/20 transition-transform duration-300">
            <Camera className="w-6 h-6 text-primary" />
          </div>
          
          {/* Clear, commanding CTA */}
          <p className="text-sm font-semibold text-foreground mb-1">
            Tap to Capture or Upload
          </p>
          
          {/* Reducing cognitive load by explaining constraints upfront */}
          <p className="text-xs text-muted-foreground">
            {helperText}
          </p>
        </label>
      ) : (
        /* 
          Success State (Positive Reinforcement)
          Releases dopamine and reduces anxiety by providing immediate, 
          clear visual confirmation that the task succeeded.
        */
        <div className="relative flex items-center w-full p-4 border border-green-500/20 bg-green-50/50 dark:bg-green-500/10 rounded-2xl shadow-sm transition-all duration-300 animate-in fade-in zoom-in-95">
          <div className="flex-shrink-0 bg-green-100 dark:bg-green-500/20 p-2.5 rounded-full mr-4">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          
          <div className="flex-1 min-w-0 mr-4">
            <p className="text-sm font-medium text-foreground truncate">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center">
              <span className="text-green-600 dark:text-green-400 font-medium">Successfully attached</span>
              {file.size && (
                <>
                  <span className="mx-2 opacity-30">•</span>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </>
              )}
            </p>
          </div>
          
          {/* Providing Autonomy/Control (Error Recovery) */}
          <label 
            htmlFor={name}
            className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-full cursor-pointer transition-colors active:scale-95"
          >
            Change
          </label>
        </div>
      )}
    </div>
  );
}
