import { useFormContext } from 'react-hook-form';
import type { ApplicationFormValues } from '../schema';
import { SignaturePad } from '@/components/ui/signature-pad';

export default function Part11CertificationStep() {
  const { register, watch, formState: { errors } } = useFormContext<ApplicationFormValues>();
  
  const givenName = watch("givenName") || "";
  const lastName = watch("lastName") || "";
  const fullName = [givenName, lastName].filter(Boolean).join(" ");

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-serif font-bold mb-1">Part XI. Applicant's Certification and Data Privacy Consent</h2>
        <p className="text-sm text-muted-foreground">Final declaration and signature.</p>
      </div>

      <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg space-y-4">
        <p className="text-sm leading-relaxed text-foreground/80">
          I hereby certify that all information provided in this application form is true, correct, and complete. I understand that any false statement, misrepresentation, concealment of material information, or submission of fraudulent documents shall be grounds for disqualification, termination of scholarship benefits, and possible legal or administrative action.
        </p>
        <p className="text-sm leading-relaxed text-foreground/80">
          I authorize the institution to verify all information and documents submitted with relevant government agencies, educational institutions, local government units, and other concerned offices. I further consent to the collection, processing, storage, and sharing of my personal information for scholarship evaluation, validation, monitoring, auditing, reporting, and other lawful purposes in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173).
        </p>
      </div>

      <div className="space-y-4">
        <label className="flex items-start space-x-3 cursor-pointer">
          <div className="flex items-center h-5">
            <input type="checkbox" {...register("certifyTrue")} className="w-4 h-4 rounded border-input bg-background focus:ring-2 focus:ring-ring text-primary" />
          </div>
          <div className="text-sm font-medium leading-none">I certify that all information provided is true and correct. <span className="text-destructive">*</span></div>
        </label>
        {errors.certifyTrue && <p className="text-xs text-destructive ml-7">{errors.certifyTrue.message}</p>}

        <label className="flex items-start space-x-3 cursor-pointer">
          <div className="flex items-center h-5">
            <input type="checkbox" {...register("certifyAuthentic")} className="w-4 h-4 rounded border-input bg-background focus:ring-2 focus:ring-ring text-primary" />
          </div>
          <div className="text-sm font-medium leading-none">I certify that all uploaded documents are authentic and valid. <span className="text-destructive">*</span></div>
        </label>
        {errors.certifyAuthentic && <p className="text-xs text-destructive ml-7">{errors.certifyAuthentic.message}</p>}

        <label className="flex items-start space-x-3 cursor-pointer">
          <div className="flex items-center h-5">
            <input type="checkbox" {...register("dataPrivacyConsent")} className="w-4 h-4 rounded border-input bg-background focus:ring-2 focus:ring-ring text-primary" />
          </div>
          <div className="text-sm font-medium leading-none">I have read and understood the Data Privacy Consent and Declaration. <span className="text-destructive">*</span></div>
        </label>
        {errors.dataPrivacyConsent && <p className="text-xs text-destructive ml-7">{errors.dataPrivacyConsent.message}</p>}
      </div>

      <div className="border-t border-border pt-8 space-y-6">
        <h3 className="text-lg font-serif font-bold">Applicant's Signature</h3>
        <div className="space-y-2 max-w-lg">
          <label className="text-sm font-medium text-foreground">Draw Digital Signature / E-Signature <span className="text-destructive">*</span></label>
          <SignaturePad name="uploadDigitalSignature" watermark={fullName || undefined} />
        </div>
      </div>
    </div>
  );
}
