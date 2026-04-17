import React from 'react';
import { ShieldCheck, Plus, Shield, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function RolesManager() {
  const roles = [
    { name: 'Super Admin', members: 1, permissions: 'Full System Control & Billing', tint: 'bg-[#E6F0FA] text-[#2A5A8A]', iconColor: 'text-[#2A5A8A]' },
    { name: 'Course Manager', members: 2, permissions: 'Academy Content, Students, Testimonials', tint: 'bg-[#FFF3E0] text-[var(--color-accent-primary)]', iconColor: 'text-[var(--color-accent-primary)]' },
    { name: 'Order Admin', members: 3, permissions: 'Cake Boutique, Inquiries, Basic Analytics', tint: 'bg-[#E8F5E8] text-[#3A7A3A]', iconColor: 'text-[#3A7A3A]' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-[DM Sans]">
       {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[34px] font-bold text-[var(--color-text-primary)]">Roles & Permissions</h1>
          <p className="text-[14px] text-[var(--color-text-secondary)]">Control who can access and edit specific dashboard modules.</p>
        </div>
        <Button className="bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-dark)] text-white font-semibold text-[13px] px-6 h-[44px] shadow-[var(--shadow-btn)]">
          <Plus size={18} className="mr-2" />
          Create New Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role, i) => (
          <div key={i} className="bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] p-6 border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]/30 transition-all group">
            <div className="flex items-center justify-between mb-6">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", role.tint)}>
                <Shield size={24} />
              </div>
              <div className="flex items-center gap-2 bg-[var(--color-bg-muted)] px-3 py-1 rounded-full text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                <Users size={12} />
                {role.members} Members
              </div>
            </div>
            
            <h3 className="font-display text-[20px] font-bold text-[var(--color-text-primary)] mb-2">{role.name}</h3>
            <p className="text-[13px] text-[var(--color-text-secondary)] mb-6 leading-relaxed line-clamp-2 h-10">{role.permissions}</p>
            
            <Button variant="outline" className="w-full text-[13px] font-bold border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/5 rounded-[var(--radius-sm)]">
              Modify Permissions
            </Button>
          </div>
        ))}
      </div>

      <div className="bg-[var(--color-bg-muted)]/50 rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-border)] p-12 text-center">
         <div className="max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-6 text-[var(--color-accent-primary)]/30">
              <ShieldCheck size={32} />
            </div>
            <h4 className="font-display text-[18px] font-bold text-[var(--color-text-primary)] mb-2">Hierarchical Access Control</h4>
            <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
              Assignments are handled with artisanal care. Safeguard your boutique's sensitive data by assigning granular roles to your team members.
            </p>
         </div>
      </div>
    </div>
  );
}
