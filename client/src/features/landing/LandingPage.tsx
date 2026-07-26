import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import CheckStatusModal from './CheckStatusModal';

export default function LandingPage() {
  const [isStatusModalOpen, setStatusModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <CheckStatusModal 
        isOpen={isStatusModalOpen} 
        onClose={() => setStatusModalOpen(false)} 
      />
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="ZPPSU Logo" className="h-10 w-10 object-contain" />
            <span className="font-serif font-semibold text-lg tracking-tight">ZPPSU Scholarship Portal</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link to="/apply" className="inline-flex items-center justify-center rounded-sm text-sm font-medium transition-transform hover:scale-[0.98] active:scale-[0.96] bg-primary text-primary-foreground h-9 px-4 py-2">
              Apply Now
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 overflow-hidden">
          {/* Subtle background element */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/40 via-background to-background" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            <div className="inline-flex items-center rounded-full border border-border bg-secondary/30 px-3 py-1 text-xs font-medium text-secondary-foreground mb-8 animate-stagger-1 tracking-wider uppercase">
              Academic Year 2026-2027
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold text-foreground mb-6 leading-[1.1] animate-stagger-2">
              Empowering <span className="text-primary italic pr-2">ZPPSU</span> Scholars
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-stagger-3">
              Web-based Scholarship Profiling and Reporting System with Integrated Decision Support. Streamlining applications, verification, and monitoring.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-stagger-3" style={{ animationDelay: '0.4s' }}>
              <Link to="/apply" className="w-full sm:w-auto inline-flex items-center justify-center rounded-sm text-sm font-medium transition-transform hover:scale-[0.98] active:scale-[0.96] bg-primary text-primary-foreground h-11 px-8">
                Start Application
              </Link>
              <button 
                onClick={() => setStatusModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-sm text-sm font-medium transition-colors border border-border bg-background hover:bg-secondary/50 text-foreground h-11 px-8"
              >
                Check Status
              </button>
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section id="features" className="py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-4">Intelligent System Architecture</h2>
              <p className="text-muted-foreground max-w-xl">Designed for efficiency, transparency, and accuracy in scholarship administration.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Large Span */}
              <div className="md:col-span-2 border border-border rounded-lg p-8 sm:p-10 bg-card transition-shadow hover:shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                <div className="relative z-10">
                  <div className="h-10 w-10 bg-accent/20 rounded-md flex items-center justify-center mb-6">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold font-serif mb-2">Digital Profiling</h3>
                  <p className="text-muted-foreground max-w-md">
                    Seamless online application process. Submit your personal, academic, and family information along with necessary documents securely.
                  </p>
                </div>
                {/* Decorative element */}
                <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
                  <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  </svg>
                </div>
              </div>

              {/* Card 2 */}
              <div className="border border-border rounded-lg p-8 sm:p-10 bg-card transition-shadow hover:shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col">
                <div className="h-10 w-10 bg-secondary/50 rounded-md flex items-center justify-center mb-6">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold font-serif mb-2">Decision Support</h3>
                <p className="text-muted-foreground">
                  Automated cross-referencing with official TES and CHED beneficiary lists to flag potential duplicate applications.
                </p>
              </div>

              {/* Card 3 */}
              <div className="border border-border rounded-lg p-8 sm:p-10 bg-card transition-shadow hover:shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col">
                <div className="h-10 w-10 bg-secondary/50 rounded-md flex items-center justify-center mb-6">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold font-serif mb-2">Real-time Reporting</h3>
                <p className="text-muted-foreground">
                  Generate comprehensive operational and administrative reports instantly.
                </p>
              </div>

              {/* Card 4: Span 2 */}
              <div className="md:col-span-2 border border-border rounded-lg p-8 sm:p-10 bg-card transition-shadow hover:shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                <div>
                  <h3 className="text-xl font-bold font-serif mb-2">Monitor Application Status</h3>
                  <p className="text-muted-foreground max-w-md">
                    Track your application progress from submission to approval. Real-time updates directly on your dashboard.
                  </p>
                </div>
                <button 
                  onClick={() => setStatusModalOpen(true)}
                  className="inline-flex items-center justify-center rounded-sm text-sm font-medium transition-colors border border-border bg-background hover:bg-secondary/50 text-foreground h-9 px-6 whitespace-nowrap"
                >
                  Check Status &rarr;
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 opacity-80">
            <img src={logo} alt="ZPPSU Logo" className="h-8 w-8 object-contain grayscale" />
            <span className="font-serif font-medium text-sm">ZPPSU Scholarship Portal</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Zamboanga Peninsula Polytechnic State University. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
