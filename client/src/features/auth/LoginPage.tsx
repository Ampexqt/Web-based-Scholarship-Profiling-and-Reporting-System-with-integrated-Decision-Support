import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient, API_URL } from '@/lib/axios';
import logo from '../../assets/logo.png';
import scholarshipSeal from '../../assets/ZPPSU Scholarship Office Seal.png';
import gymHeroBg from '../../assets/School Community Gymnasium Portrait.png';

/**
 * TransparentSeal removes the outer white background and spaces between gear teeth
 * via an automated edge flood-fill so the seal floats seamlessly on any background.
 */
const TransparentSeal: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      if (!w || !h) return;

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, w, h);
      const pixels = imgData.data;

      // Only background white has green > 215 and blue > 215 (red gear and gold letters have blue < 90)
      const isBgWhite = (idx: number) => {
        const g = pixels[idx * 4 + 1];
        const b = pixels[idx * 4 + 2];
        return g > 215 && b > 215;
      };

      const total = w * h;
      const visited = new Uint8Array(total);
      const queue = new Int32Array(total);
      let head = 0;
      let tail = 0;

      // Seed all outer border pixels
      for (let x = 0; x < w; x++) {
        const top = x;
        if (!visited[top] && isBgWhite(top)) {
          visited[top] = 1;
          queue[tail++] = top;
        }
        const bottom = (h - 1) * w + x;
        if (!visited[bottom] && isBgWhite(bottom)) {
          visited[bottom] = 1;
          queue[tail++] = bottom;
        }
      }
      for (let y = 0; y < h; y++) {
        const left = y * w;
        if (!visited[left] && isBgWhite(left)) {
          visited[left] = 1;
          queue[tail++] = left;
        }
        const right = y * w + (w - 1);
        if (!visited[right] && isBgWhite(right)) {
          visited[right] = 1;
          queue[tail++] = right;
        }
      }

      // BFS flood fill to clear background white
      while (head < tail) {
        const curr = queue[head++];
        pixels[curr * 4 + 3] = 0; // Transparent

        const cx = curr % w;
        const cy = Math.floor(curr / w);

        if (cy > 0) {
          const up = (cy - 1) * w + cx;
          if (!visited[up] && isBgWhite(up)) {
            visited[up] = 1;
            queue[tail++] = up;
          }
        }
        if (cy < h - 1) {
          const down = (cy + 1) * w + cx;
          if (!visited[down] && isBgWhite(down)) {
            visited[down] = 1;
            queue[tail++] = down;
          }
        }
        if (cx > 0) {
          const l = cy * w + (cx - 1);
          if (!visited[l] && isBgWhite(l)) {
            visited[l] = 1;
            queue[tail++] = l;
          }
        }
        if (cx < w - 1) {
          const r = cy * w + (cx + 1);
          if (!visited[r] && isBgWhite(r)) {
            visited[r] = 1;
            queue[tail++] = r;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setDataUrl(canvas.toDataURL('image/png'));
    };
  }, [src]);

  return (
    <img
      src={dataUrl || src}
      alt={alt}
      className={`${className || ''} ${dataUrl ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
    />
  );
};

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
    
    setIsLoading(true);

    try {
      const response: any = await apiClient.post(
        '/auth/login',
        { email: email.trim().toLowerCase(), password }
      );

      if (response && response.success) {
        localStorage.setItem('isLoggedIn', 'true');
        if (response.user) {
          localStorage.setItem('userRole', response.user.role);
          localStorage.setItem('userName', response.user.name || '');
          localStorage.setItem('user', JSON.stringify(response.user));
        }
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
        {/* Logo positioned top left */}
        <Link 
          to="/" 
          className="flex items-center gap-3 absolute top-8 left-8 lg:top-12 lg:left-12 transition-opacity hover:opacity-90"
        >
          <img src={logo} alt="ZPPSU Logo" className="h-10 w-10 object-contain" />
          <span className="font-serif font-semibold text-lg tracking-tight text-foreground">
            ZPPSU Scholarship Portal
          </span>
        </Link>

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

      {/* Right Side - ZPPSU Scholarship Office Seal Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        {/* Background Gymnasium Photo with Rich Maroon Atmosphere (consistent with Hero section) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          <img 
            src={gymHeroBg} 
            alt="ZPPSU Scholarship Community" 
            className="w-full h-full object-cover object-[center_35%]"
          />
          {/* Dominant university maroon tone wash & gradient */}
          <div className="absolute inset-0 bg-primary/35 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#4A0410]/92 via-[#33020A]/88 to-[#1A0105]/92" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-sm mx-auto">
          {/* Transparent Gear Seal with Natural Drop Shadow */}
          <div className="w-60 h-60 sm:w-72 sm:h-72 flex items-center justify-center transition-transform hover:scale-[1.02] duration-300">
            <TransparentSeal
              src={scholarshipSeal}
              alt="ZPPSU Scholarship Office Seal"
              className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.65)]"
            />
          </div>

          <div className="mt-8 space-y-2">
            <h2 className="font-serif text-2xl xl:text-3xl font-bold text-white tracking-tight">
              ZPPSU Scholarship Office
            </h2>
            <p className="text-sm text-stone-200/90 leading-relaxed">
              Web-based Scholarship Profiling and Reporting System with Integrated Decision Support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
