import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

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

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference) return;
    
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      if (reference.toUpperCase().startsWith('APP-')) {
        setMockStatus({
          ref: reference.toUpperCase(),
          status: 'Under Review',
          dateSubmitted: 'Oct 24, 2026',
          step: 'Document Verification'
        });
        setStatus('found');
      } else {
        setStatus('not-found');
      }
    }, 800);
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

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-lg bg-background border border-border">
                  <div className="mt-0.5 text-amber-500">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{mockStatus.status}</h4>
                    <p className="text-sm text-muted-foreground">Currently in: {mockStatus.step}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-3 opacity-60">
                  <div className="mt-0.5 text-primary">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Application Submitted</h4>
                    <p className="text-sm text-muted-foreground">Received on {mockStatus.dateSubmitted}</p>
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
