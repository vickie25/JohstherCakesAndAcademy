import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';


/* ─── Types ─── */
interface LoginFormData {
  email: string;
  password: string;
}

interface SignupFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

/* ─── Cake SVG Icon ─── */
const CakeIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C10.5 2 9.5 3 9 4C7.5 3.5 6 4.5 6 6H18C18 4.5 16.5 3.5 15 4C14.5 3 13.5 2 12 2Z" fill="#F59E0B"/>
    <rect x="4" y="8" width="16" height="3" rx="1.5" fill="#92400E"/>
    <path d="M4 11h16v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7z" fill="#FFFBEB" stroke="#92400E" strokeWidth="0.5"/>
    <path d="M8 14h8" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 17h4" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

/* ─── Decorative sprinkle dots ─── */
const Sprinkles = () => (
  <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: 'inherit' }}>
    {[
      { top: '8%',  left: '6%',  size: 7,  color: '#F59E0B', rotate: 30 },
      { top: '15%', left: '88%', size: 5,  color: '#92400E', rotate: 70 },
      { top: '82%', left: '9%',  size: 6,  color: '#B45309', rotate: 15 },
      { top: '75%', left: '85%', size: 8,  color: '#F59E0B', rotate: 55 },
      { top: '45%', left: '3%',  size: 4,  color: '#FBBF24', rotate: 90 },
      { top: '50%', left: '92%', size: 5,  color: '#92400E', rotate: 10 },
      { top: '28%', left: '80%', size: 4,  color: '#F59E0B', rotate: 45 },
      { top: '60%', left: '94%', size: 3,  color: '#B45309', rotate: 20 },
    ].map((s, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          top: s.top,
          left: s.left,
          width: s.size,
          height: s.size * 2.2,
          backgroundColor: s.color,
          borderRadius: '50px',
          transform: `rotate(${s.rotate}deg)`,
          opacity: 0.55,
        }}
      />
    ))}
  </div>
);

/* ─── Input field wrapper ─── */
const FieldWrapper = ({ label, id, type, placeholder, registration, error }: {
  label: string; id: string; type: string; placeholder: string;
  registration: object; error?: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label
        htmlFor={id}
        style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 600, fontSize: '0.85rem', color: '#78350F' }}
      >
        {label}
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          {...registration}
          style={{
            width: '100%',
            padding: '10px 14px',
            paddingRight: isPasswordField ? '40px' : '14px',
            border: error ? '1.5px solid #DC2626' : '1.5px solid #F59E0B55',
            borderRadius: 10,
            background: '#FFFBEB',
            fontFamily: "'Comic Neue', cursive",
            fontSize: '0.9rem',
            color: '#78350F',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxSizing: 'border-box'
          }}
          onFocus={e => {
            e.target.style.borderColor = '#F59E0B';
            e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.18)';
          }}
          onBlur={e => {
            e.target.style.borderColor = error ? '#DC2626' : '#F59E0B55';
            e.target.style.boxShadow = 'none';
          }}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: 12,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#92400E',
              opacity: 0.6,
              padding: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p style={{ fontFamily: "'Comic Neue', cursive", fontSize: '0.78rem', color: '#DC2626', margin: 0 }}>{error}</p>}
    </div>
  );
};

/* ─── LOGIN FORM ─── */
function LoginForm({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<LoginFormData>({
    defaultValues: { email: '', password: '' },
  });

  const { register, handleSubmit, formState: { errors } } = form;
  const { login } = useAuth();

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to sign in. Please check your credentials.');
      }

      setLoading(false);
      setSuccess(true);
      login(result.data?.user?.email || data.email, result.data?.user?.name);
      setTimeout(() => { setSuccess(false); onClose(); }, 1500);
    } catch (error: any) {
      setLoading(false);
      form.setError('root', { message: error.message });
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#92400E,#F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.1rem', color: '#78350F' }}>Welcome back!</p>
        <p style={{ fontFamily: "'Comic Neue', cursive", fontSize: '0.9rem', color: '#A16207' }}>You're now logged in to Johsther Cakes</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {errors.root && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '10px', borderRadius: '10px', fontSize: '0.85rem', fontFamily: "'Comic Neue', cursive", textAlign: 'center' }}>
          {errors.root.message}
        </div>
      )}
      <FieldWrapper
        label="Email Address"
        id="login-email"
        type="email"
        placeholder="you@example.com"
        registration={register('email', {
          required: 'Email is required',
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
        })}
        error={errors.email?.message}
      />
      <FieldWrapper
        label="Password"
        id="login-password"
        type="password"
        placeholder="••••••••"
        registration={register('password', {
          required: 'Password is required',
          minLength: { value: 6, message: 'Minimum 6 characters' },
        })}
        error={errors.password?.message}
      />

      <div style={{ textAlign: 'right', marginTop: -8 }}>
        <a href="#" style={{ fontFamily: "'Comic Neue', cursive", fontSize: '0.82rem', color: '#B45309', textDecoration: 'underline', cursor: 'pointer' }}>
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          background: loading ? '#A16207' : 'linear-gradient(135deg, #92400E 0%, #B45309 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 12,
          fontFamily: "'Baloo 2', cursive",
          fontWeight: 700,
          fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 14px rgba(146,64,14,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
        onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(146,64,14,0.45)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(146,64,14,0.3)'; }}
      >
        {loading ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.3"/>
              <path d="M12 2a10 10 0 0 1 10 10" style={{ animation: 'spin 0.8s linear infinite' }}/>
            </svg>
            Signing in…
          </>
        ) : 'Sign In to My Account'}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0' }}>
        <div style={{ flex: 1, height: 1, background: '#F59E0B44' }} />
        <span style={{ fontFamily: "'Comic Neue', cursive", fontSize: '0.8rem', color: '#A16207' }}>or continue with</span>
        <div style={{ flex: 1, height: 1, background: '#F59E0B44' }} />
      </div>

      {/* Google Sign-in */}
      <button
        type="button"
        style={{
          width: '100%',
          padding: '10px',
          background: '#FFFBEB',
          color: '#78350F',
          border: '1.5px solid #F59E0B55',
          borderRadius: 12,
          fontFamily: "'Baloo 2', cursive",
          fontWeight: 600,
          fontSize: '0.9rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = '#F59E0B';
          (e.currentTarget as HTMLButtonElement).style.background = '#FEF3C7';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = '#F59E0B55';
          (e.currentTarget as HTMLButtonElement).style.background = '#FFFBEB';
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}

/* ─── SIGNUP FORM ─── */
function SignupForm({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<SignupFormData>({
    defaultValues: { fullName: '', email: '', phone: '', password: '', confirmPassword: '' },
  });

  const { register, handleSubmit, watch, formState: { errors } } = form;
  const password = watch('password');
  const { login } = useAuth();

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: data.fullName,
          email: data.email, 
          password: data.password 
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to create account.');
      }

      setLoading(false);
      setSuccess(true);
      login(result.data?.user?.email || data.email, result.data?.user?.name || data.fullName);
      setTimeout(() => { setSuccess(false); onClose(); }, 2000);
    } catch (error: any) {
      setLoading(false);
      form.setError('root', { message: error.message });
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#92400E,#F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.1rem', color: '#78350F' }}>You're in the family!</p>
        <p style={{ fontFamily: "'Comic Neue', cursive", fontSize: '0.9rem', color: '#A16207' }}>Welcome to Johsther Cakes & Academy. Redirecting…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {errors.root && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '10px', borderRadius: '10px', fontSize: '0.85rem', fontFamily: "'Comic Neue', cursive", textAlign: 'center' }}>
          {errors.root.message}
        </div>
      )}
      <FieldWrapper
        label="Full Name"
        id="signup-name"
        type="text"
        placeholder="e.g. Amara Okafor"
        registration={register('fullName', {
          required: 'Full name is required',
          minLength: { value: 3, message: 'Enter your full name' },
        })}
        error={errors.fullName?.message}
      />
      <FieldWrapper
        label="Email Address"
        id="signup-email"
        type="email"
        placeholder="you@example.com"
        registration={register('email', {
          required: 'Email is required',
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
        })}
        error={errors.email?.message}
      />
      <FieldWrapper
        label="Phone Number"
        id="signup-phone"
        type="tel"
        placeholder="+234 800 000 0000"
        registration={register('phone', {
          required: 'Phone number is required',
          pattern: { value: /^[+\d\s\-()]{7,20}$/, message: 'Enter a valid phone number' },
        })}
        error={errors.phone?.message}
      />
      <FieldWrapper
        label="Password"
        id="signup-password"
        type="password"
        placeholder="••••••••"
        registration={register('password', {
          required: 'Password is required',
          minLength: { value: 8, message: 'Minimum 8 characters' },
          pattern: { value: /(?=.*[A-Z])(?=.*[0-9])/, message: 'Include at least one uppercase & one number' },
        })}
        error={errors.password?.message}
      />
      <FieldWrapper
        label="Confirm Password"
        id="signup-confirm"
        type="password"
        placeholder="••••••••"
        registration={register('confirmPassword', {
          required: 'Please confirm your password',
          validate: val => val === password || 'Passwords do not match',
        })}
        error={errors.confirmPassword?.message}
      />

      {/* T&C */}
      <p style={{ fontFamily: "'Comic Neue', cursive", fontSize: '0.78rem', color: '#A16207', textAlign: 'center', lineHeight: 1.5 }}>
        By signing up you agree to our{' '}
        <a href="#" style={{ color: '#B45309', textDecorationLine: 'underline' }}>Terms</a>{' '}and{' '}
        <a href="#" style={{ color: '#B45309', textDecorationLine: 'underline' }}>Privacy Policy</a>
      </p>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          background: loading ? '#A16207' : 'linear-gradient(135deg, #92400E 0%, #F59E0B 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 12,
          fontFamily: "'Baloo 2', cursive",
          fontWeight: 700,
          fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 14px rgba(146,64,14,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
        onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(146,64,14,0.45)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(146,64,14,0.3)'; }}
      >
        {loading ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.3"/>
              <path d="M12 2a10 10 0 0 1 10 10" style={{ animation: 'spin 0.8s linear infinite' }}/>
            </svg>
            Creating account…
          </>
        ) : 'Create My Account'}
      </button>
    </form>
  );
}

/* ─── MAIN AUTH MODAL ─── */
export default function AuthModal({ open, onClose, defaultTab = 'login' }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent
        showCloseButton={false}
        className=""
        style={{
          padding: 0,
          border: 'none',
          borderRadius: 24,
          maxWidth: 480,
          width: 'calc(100% - 32px)',
          background: 'transparent',
          boxShadow: 'none',
          overflow: 'visible',
        }}
      >
        {/* Hidden a11y title */}
        <DialogTitle className="sr-only">
          {activeTab === 'login' ? 'Sign in to your account' : 'Create a new account'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {activeTab === 'login'
            ? 'Enter your email and password to access your Johsther Cakes account.'
            : 'Fill in your details to join the Johsther Cakes & Academy community.'}
        </DialogDescription>

        {/* Card */}
        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(145deg, #FFFBEB 0%, #FFF8ED 60%, #FEF3C7 100%)',
            borderRadius: 24,
            border: '2px solid #F59E0B44',
            boxShadow: '0 24px 60px rgba(146,64,14,0.22), 0 8px 24px rgba(245,158,11,0.12)',
            overflow: 'hidden',
          }}
        >
          <Sprinkles />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              zIndex: 10,
              background: '#F59E0B22',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s',
              color: '#92400E',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#F59E0B44')}
            onMouseLeave={e => (e.currentTarget.style.background = '#F59E0B22')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* Header */}
          <div
            className="auth-modal-header"
            style={{
              background: 'linear-gradient(135deg, #92400E 0%, #B45309 50%, #F59E0B 100%)',
              padding: '28px 28px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              position: 'relative',
            }}
          >
            {/* Wave bottom shape */}
            <div style={{
              position: 'absolute', bottom: -1, left: 0, right: 0,
              height: 20,
              background: 'linear-gradient(145deg, #FFFBEB 0%, #FFF8ED 100%)',
              borderTopLeftRadius: '50% 100%',
              borderTopRightRadius: '50% 100%',
            }} />

            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(255,255,255,0.3)',
              }}
            >
              <CakeIcon />
            </div>
            <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.4rem', color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>
              Johsther <span style={{ color: '#FEF3C7' }}>Cakes</span>
            </h2>
            <p style={{ fontFamily: "'Comic Neue', cursive", color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', margin: 0 }}>
              {activeTab === 'login' ? 'Welcome back, sweet friend!' : 'Join our baking community!'}
            </p>
          </div>

          {/* Body */}
          <div className="auth-modal-body" style={{ padding: '24px 28px 28px' }}>
            {/* Tab switcher */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                background: '#FEF3C7',
                border: '1.5px solid #F59E0B44',
                borderRadius: 12,
                padding: 4,
                marginBottom: 20,
              }}
            >
              {(['login', 'signup'] as const).map(tab => (
                <button
                  key={tab}
                  id={`auth-tab-${tab}`}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '9px 0',
                    border: 'none',
                    borderRadius: 9,
                    fontFamily: "'Baloo 2', cursive",
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: activeTab === tab
                      ? 'linear-gradient(135deg, #92400E, #B45309)'
                      : 'transparent',
                    color: activeTab === tab ? '#fff' : '#92400E',
                    boxShadow: activeTab === tab ? '0 3px 10px rgba(146,64,14,0.28)' : 'none',
                  }}
                >
                  {tab === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {/* Scrollable form area */}
            <div className="auth-modal-scroll" style={{ maxHeight: '55vh', overflowY: 'auto', paddingRight: 2 }}>
              {activeTab === 'login'
                ? <LoginForm onClose={onClose} />
                : <SignupForm onClose={onClose} />}
            </div>

            {/* Switch link */}
            <p style={{ textAlign: 'center', fontFamily: "'Comic Neue', cursive", fontSize: '0.85rem', color: '#A16207', marginTop: 18 }}>
              {activeTab === 'login' ? (
                <>Don't have an account?{' '}
                  <button
                    onClick={() => setActiveTab('signup')}
                    style={{ background: 'none', border: 'none', color: '#B45309', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', textDecoration: 'underline' }}
                  >
                    Sign up free
                  </button>
                </>
              ) : (
                <>Already have an account?{' '}
                  <button
                    onClick={() => setActiveTab('login')}
                    style={{ background: 'none', border: 'none', color: '#B45309', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', textDecoration: 'underline' }}
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
