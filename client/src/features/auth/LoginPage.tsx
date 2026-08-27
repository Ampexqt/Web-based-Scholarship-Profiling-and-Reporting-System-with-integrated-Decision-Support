import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient, API_URL } from '@/lib/axios';
import logo from '../../assets/logo.png';
import loginProps from '../../assets/login-props.avif';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    // Determine the base URL dynamically so it works in production and localhost
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Client hasn't paid yet, block staff login with a maintenance message
    // but allow the main admin account to access the system
    if (email.toLowerCase() !== 'admin@zppsu.edu.ph') {
      toast.info('System Maintenance in Progress', {
        description: 'The staff portal is currently undergoing scheduled maintenance. Please try again later or contact the administrator.'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response: any = await apiClient.post(
        '/auth/login',
        { email, password }
      );

      if (response && response.success) {
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/admin');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        err.message ||
        'Unable to connect to the server. Please ensure the backend is running.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background font-sans">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col relative z-10">
        {/* Logo positioned absolutely at the top left for better vertical balance of the form */}
        <div className="flex items-center gap-3 absolute top-8 left-8 lg:top-12 lg:left-12">
          <img src={logo} alt="ZPPSU Logo" className="h-10 w-10 object-contain" />
          <span className="font-sans font-semibold text-xl tracking-tight text-foreground">ZPPSU Scholarship Portal</span>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full px-8 pt-24 lg:pt-0">
          <div className="mb-10 text-center">
            <h1 className="font-sans text-3xl font-semibold tracking-tight mb-2 text-foreground">Login to your account</h1>
            <p className="font-sans text-sm text-muted-foreground">
              Enter your email below to login to your <span className="font-semibold text-foreground">ZPPSU Scholarship</span> account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex h-12 w-full rounded-md border border-input bg-transparent px-4 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="m@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex h-12 w-full rounded-md border border-input bg-transparent px-4 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-full text-base font-medium transition-transform hover:scale-[0.99] active:scale-[0.97] disabled:opacity-70 disabled:hover:scale-100 bg-primary text-primary-foreground h-12 px-8 w-full group shadow-md mt-4"
            >
              {isLoading ? 'Logging in...' : 'Login'}
              {!isLoading && <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />}
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-primary/20 to-primary/5">
        <img
          src={loginProps}
          alt="Login illustration"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
          onError={(e) => {
            // Fallback to a gradient pattern if the image fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* Decorative overlay */}
        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply pointer-events-none" />
      </div>
    </div>
  );
};

export default LoginPage;
