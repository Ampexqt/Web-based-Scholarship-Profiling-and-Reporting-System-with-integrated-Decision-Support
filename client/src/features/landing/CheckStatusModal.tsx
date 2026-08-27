import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, AlertCircle, XCircle, Flag } from 'lucide-react';
import { apiClient } from '@/lib/axios';

interface CheckStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckStatusModal({ isOpen, onClose }: CheckStatusModalProps) {
  const [reference, setReference] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'not-found'>('idle');

  // Simulated status response
  const [mockStatus, setMockStatus] = useState<any>(null);

  if (!isOpen) return null;

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference) return;
    
    // Dismiss mobile keyboard so user can see the result
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    
    setStatus('loading');
    
    try {
      const cleanReference = reference.trim().toUpperCase();
      const res: any = await apiClient.get(`/applications/${cleanReference}?includeHistory=false`);
      if (res.success && res.application) {
        setMockStatus({
          ref: res.application.referenceNumber,
          status: res.application.status,
          dateSubmitted: new Date(res.application.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          step: res.application.status === 'Pending' ? 'Document Verification' : res.application.status,
          remarks: res.application.remarks
        });
        setStatus('found');
      } else {
        setStatus('not-found');
      }
    } catch (error) {
      setStatus('not-found');
    }
  };

  const handleClose = () => {
    setStatus('idle');
    setReference('');
    setMockStatus(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-xl shadow-lg border border-border relative flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-serif text-xl font-bold">Track Application</h2>
          <button 
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-secondary/50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {status === 'idle' || status === 'loading' ? (
            <form onSubmit={handleCheck} className="space-y-4">
              <p className="text-sm text-muted-foreground mb-2">
                Enter your application reference number to check the current status of your scholarship application.
              </p>
              <div className="space-y-2">
                <label className="text-sm font-medium">Reference Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="e.g., APP-2026-3948"
                    className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring uppercase"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full inline-flex items-center justify-center rounded-sm text-sm font-medium transition-colors bg-primary text-primary-foreground h-11 px-8 disabled:opacity-50 mt-2"
              >
                {status === 'loading' ? 'Searching...' : (
                  <>
                    <Search size={16} className="mr-2" />
                    Check Status
                  </>
                )}
              </button>
            </form>
          ) : status === 'found' && mockStatus ? (
            <div className="space-y-6">
              <div className="bg-secondary/30 p-4 rounded-lg border border-border text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Reference Number</p>
                <p className="font-mono text-xl font-bold text-foreground">{mockStatus.ref}</p>
              </div>

              <div className="relative pl-2">
                {/* Timeline vertical line */}
                <div className="absolute left-[19px] top-6 bottom-10 w-[2px] bg-border/40"></div>

                {/* Current Status Node */}
                <div className="relative z-10 flex items-start gap-4 pb-8">
                  <div className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background ring-4 ring-background ${
                    mockStatus.status === 'Rejected' ? 'text-rose-500' :
                    mockStatus.status === 'Approved' ? 'text-foreground' :
                    'text-blue-500'
                  }`}>
                    {mockStatus.status === 'Rejected' ? <XCircle size={20} className="fill-rose-50 text-rose-500" /> :
                     mockStatus.status === 'Approved' ? <CheckCircle2 size={20} className="fill-muted text-foreground" /> :
                     <Clock size={20} className="fill-blue-50 text-blue-500" />}
                  </div>
                  
                  <div className="flex-1 pt-1">
                    <h4 className="font-medium text-foreground text-base tracking-tight">
                      {mockStatus.status === 'Pending' || mockStatus.status === 'Pending Review' || mockStatus.status === 'Flagged' 
                        ? 'Under Review' 
                        : mockStatus.status}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {mockStatus.status === 'Pending' || mockStatus.status === 'Pending Review' || mockStatus.status === 'Flagged' 
                        ? 'Your application is currently being evaluated by our team.' : 
                       mockStatus.status === 'Approved' 
                        ? 'Congratulations! Your application has been approved.' :
                       'Unfortunately, your application was not approved. Please see the reason below.'}
                    </p>
                    
                    {/* Only ever show remarks to the applicant if they are explicitly Rejected */}
                    {mockStatus.remarks && mockStatus.status === 'Rejected' && (
                      <div className="mt-3 p-3.5 bg-rose-50/50 dark:bg-rose-950/20 rounded-lg border border-rose-100 dark:border-rose-900/50 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">Reason for Rejection</p>
                        <p className="text-sm text-foreground/90 leading-relaxed">{mockStatus.remarks}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Submitted Node */}
                <div className="relative z-10 flex items-start gap-4">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background ring-4 ring-background text-foreground/70">
                    <CheckCircle2 size={20} className="text-foreground/70" />
                  </div>
                  <div className="flex-1 pt-1">
                    <h4 className="font-medium text-foreground text-base tracking-tight opacity-70">Application Submitted</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">Received on {mockStatus.dateSubmitted}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStatus('idle')}
                className="w-full inline-flex items-center justify-center rounded-sm text-sm font-medium transition-colors border border-border bg-background hover:bg-secondary/50 text-foreground h-11 px-8"
              >
                Check Another
              </button>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-2">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="font-medium text-lg text-foreground">Record Not Found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  We couldn't find an application with reference number <span className="font-mono font-medium text-foreground">{reference.toUpperCase()}</span>. Please check and try again.
                </p>
              </div>
              <button
                onClick={() => setStatus('idle')}
                className="w-full inline-flex items-center justify-center rounded-sm text-sm font-medium transition-colors border border-border bg-background hover:bg-secondary/50 text-foreground h-11 px-8 mt-4"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
