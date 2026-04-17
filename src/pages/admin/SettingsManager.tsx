import React from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Globe, 
  Lock,
  ChevronRight,
  Save,
  Trash2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function SettingsManager() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto text-[DM Sans]">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[34px] font-bold text-[var(--color-text-primary)]">Settings</h1>
          <p className="text-[14px] text-[var(--color-text-secondary)]">Configure your admin account and dashboard preferences.</p>
        </div>
        <Button className="bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-dark)] text-white font-semibold text-[13px] px-8 h-[44px] shadow-[var(--shadow-btn)]">
          <Save size={18} className="mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-1 bg-[var(--color-bg-surface)] p-2 rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] border border-[var(--color-border)]">
          {[
            { label: 'Profile Settings', icon: User, active: true },
            { label: 'Security & Privacy', icon: Shield },
            { label: 'Notifications', icon: Bell },
            { label: 'System Logs', icon: Database },
            { label: 'Site Configuration', icon: Globe },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <button 
                key={i}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-md text-[14px] font-semibold transition-all group",
                  item.active 
                    ? "bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]" 
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-base)] hover:text-[var(--color-text-primary)]"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={cn(item.active ? "text-[var(--color-accent-primary)]" : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]")} />
                  {item.label}
                </div>
                {item.active && <ChevronRight size={14} />}
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] border border-[var(--color-border)] overflow-hidden">
            <div className="p-6 border-b border-[var(--color-border)]">
              <h3 className="font-display text-[20px] font-bold text-[var(--color-text-primary)]">Admin Profile</h3>
              <p className="text-[13px] text-[var(--color-text-secondary)] mt-1">Update your personal information and login credentials.</p>
            </div>
            <div className="p-8 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-[var(--color-text-primary)]">Full Name</label>
                    <Input className="bg-[var(--color-bg-base)] border-[var(--color-border)] rounded-[var(--radius-sm)] font-medium h-11 focus:border-[var(--color-accent-primary)]" defaultValue="Super Administrator" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-[var(--color-text-primary)]">Account Title</label>
                    <Input className="bg-[var(--color-bg-base)] border-[var(--color-border)] rounded-[var(--radius-sm)] font-medium h-11 focus:border-[var(--color-accent-primary)]" defaultValue="Master Pâtissier" />
                  </div>
               </div>
               <div className="space-y-1.5 max-w-md">
                  <label className="text-[13px] font-bold text-[var(--color-text-primary)]">Email Address</label>
                  <Input className="bg-[var(--color-bg-base)] border-[var(--color-border)] rounded-[var(--radius-sm)] font-medium h-11 focus:border-[var(--color-accent-primary)]" defaultValue="admin@josthercakes.com" />
               </div>
               
               <div className="w-full h-[1px] bg-[var(--color-border)]" />
               
               <div className="space-y-6">
                  <h4 className="font-display text-[18px] font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                    <Lock size={18} className="text-[var(--color-accent-primary)]" />
                    Security Credentials
                  </h4>
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Current Password</label>
                      <Input type="password" placeholder="••••••••" className="bg-[var(--color-bg-base)] border-[var(--color-border)] rounded-[var(--radius-sm)] h-11" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">New Password</label>
                        <Input type="password" placeholder="New" className="bg-[var(--color-bg-base)] border-[var(--color-border)] rounded-[var(--radius-sm)] h-11" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Confirm</label>
                        <Input type="password" placeholder="Confirm" className="bg-[var(--color-bg-base)] border-[var(--color-border)] rounded-[var(--radius-sm)] h-11" />
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-[var(--color-danger)]/[0.03] rounded-[var(--radius-lg)] border border-[var(--color-danger)]/20 p-6">
             <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-[var(--color-danger)]/10 text-[var(--color-danger)] flex items-center justify-center shrink-0">
                  <Trash2 size={20} />
               </div>
               <div className="flex-1">
                 <h3 className="font-display text-[18px] font-bold text-[var(--color-danger)]">Danger Zone</h3>
                 <p className="text-[14px] text-[var(--color-danger)]/70 mt-1 mb-4">Are you sure you want to perform destructive actions? These will permanently affect your store data.</p>
                 <Button variant="ghost" className="text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 font-bold border border-[var(--color-danger)]/20 rounded-[var(--radius-sm)] px-6">
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
