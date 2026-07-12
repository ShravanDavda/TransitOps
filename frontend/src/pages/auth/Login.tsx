import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/common/Toast';
import { Eye, EyeOff, Lock, Mail, Compass, Route } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Login: React.FC = () => {
  const { login, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, skip to dashboard
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleAutofill = () => {
    setEmail('admin@transitops.com');
    setPassword('admin123');
    toast('Demo credentials loaded!', 'success');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      toast('Welcome back to TransitOps!', 'success');
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
      toast('Login failed. Check your credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex bg-slate-50 overflow-hidden font-sans">
      
      {/* Left Panel: Immersive Cinematic Logistics Canvas (50% Split) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 flex-col justify-between p-12 relative overflow-hidden select-none select-none">
        
        {/* Subtle grid mesh overlay */}
        <div className="absolute inset-0 cinematic-grid-dark opacity-35 pointer-events-none" />
        
        {/* Animated Radial ambient glows */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding Header */}
        <div className="flex items-center gap-3.5 z-10 animate-fade-in">
          <div className="p-2.5 bg-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/20">
            <Compass className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide font-display">
              TransitOps
            </h2>
            <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest leading-none mt-0.5">
              Smart Fleet Operations
            </p>
          </div>
        </div>

        {/* Center: Live-Rendered Interactive SVG Logistics Grid Route network (Wow design detail!) */}
        <div className="flex-1 flex flex-col items-center justify-center z-10 w-full">
          <div className="w-full max-w-md aspect-video relative rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-2xl backdrop-blur-xs flex items-center justify-center">
            
            {/* SVG Interactive Map */}
            <svg className="w-full h-full text-slate-700" viewBox="0 0 400 240">
              {/* Route Lines */}
              <path d="M 50,50 L 150,110" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="2" strokeLinecap="round" />
              <path d="M 150,110 L 250,80" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="2" strokeLinecap="round" />
              <path d="M 250,80 L 350,180" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="2" strokeLinecap="round" />
              <path d="M 150,110 L 350,180" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="2" strokeLinecap="round" />
              <path d="M 50,180 L 150,110" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="2" strokeLinecap="round" />

              {/* Animated pulses representing trucks moving along routes (Section 36) */}
              <path d="M 50,50 L 150,110" stroke="rgba(99, 102, 241, 0.85)" strokeWidth="2.5" strokeLinecap="round" className="trip-line-animate" />
              <path d="M 150,110 L 350,180" stroke="rgba(99, 102, 241, 0.85)" strokeWidth="2.5" strokeLinecap="round" className="trip-line-animate" />

              {/* Route Nodes */}
              <circle cx="50" cy="50" r="6" fill="#4f46e5" className="animate-pulse" />
              <circle cx="150" cy="110" r="6" fill="#4f46e5" />
              <circle cx="250" cy="80" r="6" fill="#4f46e5" />
              <circle cx="350" cy="180" r="6" fill="#10b981" className="animate-pulse" />
              <circle cx="50" cy="180" r="6" fill="#4f46e5" />

              {/* Node Labels */}
              <text x="50" y="38" fontSize="8.5" fill="#94a3b8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">RAJ-01</text>
              <text x="135" y="125" fontSize="8.5" fill="#94a3b8" fontFamily="monospace" fontWeight="bold">ADI-02</text>
              <text x="250" y="68" fontSize="8.5" fill="#94a3b8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">VAD-03</text>
              <text x="350" y="198" fontSize="8.5" fill="#10b981" fontFamily="monospace" textAnchor="middle" fontWeight="bold">MUM-04 (HQ)</text>
              <text x="50" y="198" fontSize="8.5" fill="#94a3b8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SUR-05</text>
            </svg>

            {/* Static Telemetry Label */}
            <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>DISPATCH ENGINE FEED: ACTIVE</span>
              <span>GPS SYNC 100%</span>
            </div>
          </div>

          <div className="mt-8 text-center max-w-sm">
            <h3 className="text-xl font-bold text-white tracking-tight font-display">
              Enterprise Command Center
            </h3>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Real-time route optimization, instant dispatch validations, maintenance synchronization, and fuel management for Indian fleet logistics.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] font-semibold text-slate-600 tracking-wider font-mono z-10 uppercase">
          TransitOps Systems • v1.1.0 • Stable Control
        </div>
      </div>

      {/* Right Panel: Clean, High-Contrast Professional Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white relative">
        
        {/* Subtle grid mesh overlay on white for visual texture */}
        <div className="absolute inset-0 cinematic-grid opacity-15 pointer-events-none" />

        <div className="w-full max-w-md flex flex-col z-10">
          
          {/* Logo reveal for mobile screen sizes */}
          <div className="lg:hidden flex items-center gap-3.5 mb-8">
            <div className="p-2 bg-brand-600 text-white rounded-lg shadow-md">
              <Compass className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-wide font-display">
                TransitOps
              </h2>
              <p className="text-[8px] font-bold text-brand-500 uppercase tracking-widest leading-none mt-0.5">
                Fleet Management
              </p>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight font-display">
              Log in to Terminal
            </h1>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Authenticate credentials to access vehicle dispatching and logistics controls.
            </p>
          </div>

          {/* Error Feed */}
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-lg leading-relaxed animate-fade-in flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Standard Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <Input
              label="Operator Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@transitops.com"
              required
              disabled={isLoading}
              icon={<Mail className="w-4 h-4 text-slate-400" />}
            />

            <Input
              label="Security Access Key"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              icon={<Lock className="w-4 h-4 text-slate-400" />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer focus:outline-hidden flex items-center justify-center mr-1"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              }
            />

            {/* Utility line: Remember me and Forgot Key */}
            <div className="flex items-center justify-between pt-1 select-none">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded-sm border-slate-300 text-brand-600 focus:ring-brand-500 h-3.5 w-3.5 cursor-pointer"
                  disabled={isLoading}
                />
                <span>Stay authenticated</span>
              </label>

              <button
                type="button"
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline cursor-pointer focus:outline-hidden bg-transparent border-0"
                onClick={() => toast('Security Key restoration requires contacting the HQ Operations Administrator.', 'info')}
                disabled={isLoading}
              >
                Forgot Key?
              </button>
            </div>

            {/* CTA action */}
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 mt-3"
              loading={isLoading}
              isMagnetic={true}
            >
              Access Command Center
            </Button>
          </form>

          {/* Subtle Demo Credentials Drawer */}
     
          
        </div>
      </div>
    </div>
  );
};

export default Login;
