import { useRef, useEffect, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useFormContext } from 'react-hook-form';

import { Eraser, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignaturePadProps {
  name: string;
  watermark?: string;
}

export function SignaturePad({ name, watermark }: SignaturePadProps) {
  const { setValue, watch, formState: { errors } } = useFormContext();
  const signatureRef = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  
  // Initialize with existing value if any
  const currentValue = watch(name);

  // We only want to handle the initialization once
  useEffect(() => {
    if (currentValue && typeof currentValue === 'string' && currentValue.startsWith('data:image')) {
      // If we have a saved signature, we can't easily load it back into the canvas
      // But we know it's not empty. We'll let the user see their saved signature if possible,
      // or just trust it. For react-signature-canvas, you can do fromDataURL:
      if (signatureRef.current && signatureRef.current.isEmpty()) {
        signatureRef.current.fromDataURL(currentValue);
        setIsEmpty(false);
      }
    }
  }, [currentValue]);

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setIsEmpty(true);
      setValue(name, null, { shouldValidate: true, shouldDirty: true });
    }
  };

  const handleEnd = () => {
    if (signatureRef.current) {
      if (signatureRef.current.isEmpty()) {
        setIsEmpty(true);
        setValue(name, null, { shouldValidate: true, shouldDirty: true });
      } else {
        setIsEmpty(false);
        const dataUrl = signatureRef.current.toDataURL('image/png');
        setValue(name, dataUrl, { shouldValidate: true, shouldDirty: true });
      }
    }
  };

  const hasError = !!errors[name];

  return (
    <div className="w-full space-y-2">
      <div 
        className={cn(
          "relative w-full border-2 rounded-xl overflow-hidden bg-white dark:bg-card transition-colors touch-none",
          hasError ? "border-destructive" : "border-input",
          !isEmpty ? "border-primary/50 ring-2 ring-primary/20" : ""
        )}
      >
        <SignatureCanvas
          ref={signatureRef}
          onEnd={handleEnd}
          penColor="black"
          canvasProps={{
            className: "w-full h-48 sm:h-64 cursor-crosshair"
          }}
          clearOnResize={false}
        />
        
        {/* Watermark Name and Signature Line */}
        {watermark && (
          <div className="absolute bottom-4 left-0 right-0 pointer-events-none flex flex-col items-center justify-center select-none text-foreground/60">
            <div className="w-3/4 border-b border-foreground/40 mb-1"></div>
            <span className="text-xl sm:text-2xl font-serif font-medium tracking-wide">
              {watermark}
            </span>
          </div>
        )}

        {/* Placeholder / Hint overlay */}
        {isEmpty && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-muted-foreground/50">
            <div className="flex flex-col items-center space-y-2">
              <PenTool className="w-8 h-8 opacity-20" />
              <span className="text-sm font-medium">Draw your signature here</span>
            </div>
          </div>
        )}

        {/* Clear Button */}
        {!isEmpty && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-full transition-colors"
            title="Clear Signature"
          >
            <Eraser className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {hasError && (
        <p className="text-xs text-destructive">
          {(errors[name]?.message as string) || 'Signature is required'}
        </p>
      )}
    </div>
  );
}
