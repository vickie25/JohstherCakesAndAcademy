import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  Globe, 
  Lock,
  ChevronRight,
  Save,
  Trash2,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { apiRequest } from '@/lib/api';
import { Switch } from "@/components/ui/switch";

export default function SettingsManager() {
  const [activeTab, setActiveTab] = useState('Profile Settings');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Data State
  const [settings, setSettings] = useState<any>({
    site_config: { name: '', email: '', phone: '', address: '' },
    notifications: { email_on_order: false, email_on_registration: false, email_on_inquiry: false },
    academy_config: { registration_fee: 0, currency: 'KES' }
  });
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await apiRequest<any>('/settings');
      if (data) {
        setSettings(data);
      }
      
      // Also fetch profile for current login context
      // Assuming identity or we just use defaults for now if profile API doesn't exist yet for GET
      // But let's assume we can fetch it.
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (activeTab === 'Profile Settings') {
        if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
           alert('Passwords do not match');
           return;
        }
        await apiRequest('/settings/profile', {
          method: 'POST',
          body: profile
        });
        alert('Profile updated successfully!');
        setProfile({ ...profile, currentPassword: '', newPassword: '', confirmPassword: '' });
      } else if (activeTab === 'Site Configuration') {
        await apiRequest('/settings', { method: 'POST', body: { site_config: settings.site_config } });
        alert('Site configuration saved!');
      } else if (activeTab === 'Notifications') {
        await apiRequest('/settings', { method: 'POST', body: { notifications: settings.notifications } });
        alert('Notification settings updated!');
      } else if (activeTab === 'Academy Rules') {
        await apiRequest('/settings', { method: 'POST', body: { academy_config: settings.academy_config } });
        alert('Academy rules updated!');
      }
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const navItems = [
    { label: 'Profile Settings', icon: User },
    { label: 'Security & Privacy', icon: Shield },
    { label: 'Notifications', icon: Bell },
    { label: 'Academy Rules', icon: Database },
    { label: 'Site Configuration', icon: Globe },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw size={32} className="animate-spin text-[var(--color-accent-primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto text-[DM Sans]">
      {/* Header Area - Restored Brand Aesthetic */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[34px] font-bold text-[var(--color-text-primary)]">Settings</h1>
          <p className="text-[14px] text-[var(--color-text-secondary)]">Configure your admin account and dashboard preferences.</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-dark)] text-white font-semibold text-[13px] px-8 h-[44px] shadow-[var(--shadow-btn)] transition-all active:scale-95"
        >
          {saving ? <RefreshCw size={18} className="mr-2 animate-spin" /> : <Save size={18} className="mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Navigation Sidebar - Restored */}
        <div className="lg:col-span-1 space-y-1 bg-[var(--color-bg-surface)] p-2 rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] border border-[var(--color-border)]">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const active = activeTab === item.label;
            return (
              <button 
                key={i}
                onClick={() => setActiveTab(item.label)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-md text-[14px] font-semibold transition-all group",
                  active 
                    ? "bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]" 
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-base)] hover:text-[var(--color-text-primary)]"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={cn(active ? "text-[var(--color-accent-primary)]" : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]")} />
                  {item.label}
                </div>
                {active && <ChevronRight size={14} />}
              </button>
            );
          })}
        </div>

        {/* Content Panel - Merged Aesthetic with API Logic */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] border border-[var(--color-border)] overflow-hidden">
            <div className="p-6 border-b border-[var(--color-border)]">
              <h3 className="font-display text-[22px] font-bold text-[var(--color-text-primary)]">{activeTab}</h3>
              <p className="text-[13px] text-[var(--color-text-secondary)] mt-1">
                {activeTab === 'Profile Settings' && 'Update your personal information and login credentials.'}
                {activeTab === 'Security & Privacy' && 'Manage your account safety and privacy settings.'}
                {activeTab === 'Notifications' && 'Control which events trigger automated communications.'}
                {activeTab === 'Academy Rules' && 'Configure global parameters for course enrollments.'}
                {activeTab === 'Site Configuration' && 'Details used across the brand\'s public presence.'}
              </p>
            </div>
            
            <div className="p-8">
              {/* Profile View */}
              {activeTab === 'Profile Settings' && (
                <div className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-[var(--color-text-primary)]">Full Name</label>
                        <Input 
                          className="bg-[var(--color-bg-base)] border-[var(--color-border)] rounded-[var(--radius-sm)] font-medium h-11 focus:border-[var(--color-accent-primary)]" 
                          value={profile.name}
                          placeholder="Super Administrator"
                          onChange={e => setProfile({...profile, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-[var(--color-text-primary)]">Email Address</label>
                        <Input 
                          className="bg-[var(--color-bg-base)] border-[var(--color-border)] rounded-[var(--radius-sm)] font-medium h-11 focus:border-[var(--color-accent-primary)]" 
                          value={profile.email}
                          placeholder="admin@johstercakesacadamy.co.ke"
                          onChange={e => setProfile({...profile, email: e.target.value})}
                        />
                      </div>
                   </div>
                   
                   <div className="w-full h-[1px] bg-[var(--color-border)]" />
                   
                   <div className="space-y-6">
                      <h4 className="font-display text-[18px] font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                        <Lock size={18} className="text-[var(--color-accent-primary)]" />
                        Update Password
                      </h4>
                      <div className="space-y-4 max-w-md">
                        <div className="space-y-1.5">
                          <label className="text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Current Password</label>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="bg-[var(--color-bg-base)] border-[var(--color-border)] rounded-[var(--radius-sm)] h-11" 
                            value={profile.currentPassword}
                            onChange={e => setProfile({...profile, currentPassword: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">New Password</label>
                            <Input 
                              type="password" 
                              placeholder="New" 
                              className="bg-[var(--color-bg-base)] border-[var(--color-border)] rounded-[var(--radius-sm)] h-11" 
                              value={profile.newPassword}
                              onChange={e => setProfile({...profile, newPassword: e.target.value})}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Confirm</label>
                            <Input 
                              type="password" 
                              placeholder="Confirm" 
                              className="bg-[var(--color-bg-base)] border-[var(--color-border)] rounded-[var(--radius-sm)] h-11" 
                              value={profile.confirmPassword}
                              onChange={e => setProfile({...profile, confirmPassword: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                   </div>
                </div>
              )}

              {/* Site Configuration View */}
              {activeTab === 'Site Configuration' && (
                <div className="space-y-8">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-[var(--color-text-primary)]">Business Display Name</label>
                    <Input 
                      className="bg-[var(--color-bg-base)] border-[var(--color-border)] rounded-[var(--radius-sm)] font-medium h-11 focus:border-[var(--color-accent-primary)]" 
                      value={settings.site_config.name}
                      onChange={e => setSettings({...settings, site_config: {...settings.site_config, name: e.target.value}})}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-bold text-[var(--color-text-primary)] flex items-center gap-2"><Mail size={14} /> Support Email</label>
                      <Input 
                        className="bg-[var(--color-bg-base)] border-[var(--color-border)] rounded-[var(--radius-sm)] font-medium h-11 focus:border-[var(--color-accent-primary)]" 
                        value={settings.site_config.email}
                        onChange={e => setSettings({...settings, site_config: {...settings.site_config, email: e.target.value}})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-bold text-[var(--color-text-primary)] flex items-center gap-2"><Phone size={14} /> Hot Line</label>
                      <Input 
                        className="bg-[var(--color-bg-base)] border-[var(--color-border)] rounded-[var(--radius-sm)] font-medium h-11 focus:border-[var(--color-accent-primary)]" 
                        value={settings.site_config.phone}
                        onChange={e => setSettings({...settings, site_config: {...settings.site_config, phone: e.target.value}})}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-[var(--color-text-primary)] flex items-center gap-2"><MapPin size={14} /> Physical Address</label>
                    <Input 
                      className="bg-[var(--color-bg-base)] border-[var(--color-border)] rounded-[var(--radius-sm)] font-medium h-11 focus:border-[var(--color-accent-primary)]" 
                      value={settings.site_config.address}
                      onChange={e => setSettings({...settings, site_config: {...settings.site_config, address: e.target.value}})}
                    />
                  </div>
                </div>
              )}

              {/* Notifications View */}
              {activeTab === 'Notifications' && (
                <div className="space-y-6">
                  {[
                    { key: 'email_on_order', label: 'Order Confirmations', desc: 'Receive email for every new cake purchase.' },
                    { key: 'email_on_registration', label: 'Academy Registrations', desc: 'Alert when a new student applies for a intake.' },
                    { key: 'email_on_inquiry', label: 'New Inquiries', desc: 'Instant email for contact form submissions.' }
                  ].map((item, idx) => (
                    <div key={item.key} className={cn("flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-bg-base)]/50 transition-all", idx !== 0 && "pt-6")}>
                      <div>
                        <p className="font-bold text-[var(--color-text-primary)]">{item.label}</p>
                        <p className="text-[13px] text-[var(--color-text-secondary)]">{item.desc}</p>
                      </div>
                      <Switch 
                        checked={settings.notifications[item.key]}
                        onCheckedChange={(checked) => setSettings({...settings, notifications: {...settings.notifications, [item.key]: checked}})}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Academy Rules View */}
              {activeTab === 'Academy Rules' && (
                <div className="space-y-6 max-w-md">
                   <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-[var(--color-text-primary)]">Default Registration Fee (KES)</label>
                    <Input 
                      type="number"
                      className="bg-[var(--color-bg-base)] border-[var(--color-border)] rounded-[var(--radius-sm)] font-medium h-11 focus:border-[var(--color-accent-primary)]" 
                      value={settings.academy_config.registration_fee}
                      onChange={e => setSettings({...settings, academy_config: {...settings.academy_config, registration_fee: Number(e.target.value)}})}
                    />
                    <p className="text-[12px] text-[var(--color-text-secondary)]">This fee is automatically applied to all new physical academy intake batches.</p>
                  </div>
                </div>
              )}

              {/* Placeholder for Security/Logs */}
              {activeTab === 'Security & Privacy' && (
                <div className="p-12 text-center bg-[var(--color-bg-base)]/50 rounded-2xl border-2 border-dashed border-[var(--color-border)]">
                   <Shield size={48} className="mx-auto text-[var(--color-border-strong)] mb-4" />
                   <p className="font-bold text-[var(--color-text-secondary)]">Security configurations are managed via auth tokens.</p>
                   <p className="text-xs text-[var(--color-text-secondary)]/70 mt-1">Visit your profile to reset passwords or enable two-factor protocols.</p>
                </div>
              )}
            </div>
          </div>

          {/* Danger Zone - Restored Aesthetic */}
          <div className="bg-[var(--color-danger)]/[0.03] rounded-[var(--radius-lg)] border border-[var(--color-danger)]/20 p-6">
             <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-[var(--color-danger)]/10 text-[var(--color-danger)] flex items-center justify-center shrink-0">
                  <Trash2 size={20} />
               </div>
               <div className="flex-1">
                 <h3 className="font-display text-[18px] font-bold text-[var(--color-danger)]">Danger Zone</h3>
                 <p className="text-[14px] text-[var(--color-danger)]/70 mt-1 mb-4">Are you sure you want to perform destructive actions? These will permanently affect your store data.</p>
                 <Button variant="ghost" className="text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 font-bold border border-[var(--color-danger)]/20 rounded-[var(--radius-sm)] px-6 active:scale-95 transition-all">
                    Purge System Logs
                 </Button>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
