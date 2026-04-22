import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { AlertCircle, Loader2, Cake, Eye, EyeOff } from 'lucide-react';
import { apiRequest } from '../lib/api';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { goToAdminDashboard, goToHome } = useNavigation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { data, error } = await apiRequest<{ token: string; user: any }>('/auth/admin-login', {
      method: 'POST',
      useAuth: false,
      body: JSON.stringify({ username, password }),
    });

    if (data) {
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      goToAdminDashboard();
    } else {
      setError(error || 'Invalid credentials');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-base)] admin-theme">
      
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex w-[45%] bg-[var(--color-bg-deep)] relative flex-col justify-between p-12 overflow-hidden">
        {/* Decorative subtle pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"2\" cy=\"2\" r=\"2\" fill=\"%23FFFFFF\"/></svg>')", backgroundSize: "20px 20px" }}></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Cake size={32} className="text-[var(--color-accent-primary)]" strokeWidth={1.5} />
            <span className="font-display text-4xl text-[var(--color-bg-base)]">Johsther</span>
          </div>
          <p className="text-[var(--color-text-secondary)] text-[14px]">Cakes & Academy Management</p>
        </div>

        <div className="mx-auto my-auto relative z-10 w-full max-w-[300px] aspect-square flex items-center justify-center opacity-80">
          <div className="absolute inset-0 border border-[var(--color-accent-primary)] rounded-full animate-[spin_60s_linear_infinite]" />
          <div className="absolute inset-4 border border-[var(--color-text-secondary)] rounded-full border-dashed animate-[spin_40s_linear_infinite_reverse]" />
          <Cake size={100} className="text-[var(--color-accent-primary)] mix-blend-screen" strokeWidth={1} />
        </div>

        <div className="relative z-10 text-[12px] text-[var(--color-text-secondary)] w-full text-center">
          Warm Luxury Patisserie · Established 2024
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 relative">
        <button 
          onClick={goToHome}
          className="absolute top-8 right-8 text-[13px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          Return to Site
        </button>

        <div className="w-full max-w-[420px]">
          <div className="mb-10">
            <h1 className="font-display text-[34px] font-bold text-[var(--color-text-primary)] mb-2">Welcome back 👋</h1>
            <p className="text-[14px] text-[var(--color-text-secondary)]">Admin portal — Johsther Cakes & Academy</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[13px] font-semibold text-[var(--color-text-primary)] block">Email</label>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@cresdynamics.com"
                className="w-full h-[48px] px-4 bg-white border border-[var(--color-border)] rounded-[6px] outline-none focus:border-[var(--color-accent-primary)] focus:ring-[3px] focus:ring-[var(--color-accent-primary)]/15 transition-all text-[14px]"
                required
              />
            </div>

            <div className="space-y-1 relative">
              <label className="text-[13px] font-semibold text-[var(--color-text-primary)] flex justify-between">
                <span>Password</span>
                <span className="text-[var(--color-accent-primary)] cursor-pointer hover:underline text-[12px]">Forgot password?</span>
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-[48px] px-4 pr-12 bg-white border border-[var(--color-border)] rounded-[6px] outline-none focus:border-[var(--color-accent-primary)] focus:ring-[3px] focus:ring-[var(--color-accent-primary)]/15 transition-all text-[14px]"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 rounded-[6px] flex items-center gap-2 text-[var(--color-danger)]">
                <AlertCircle size={16} className="shrink-0" />
                <p className="text-[13px] font-medium">{error}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full h-[44px] mt-2 bg-[var(--color-accent-primary)] text-white rounded-[6px] font-medium text-[15px] flex items-center justify-center gap-2 hover:bg-[var(--color-accent-dark)] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ boxShadow: 'var(--shadow-btn)' }}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
