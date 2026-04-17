import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback 
} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  adminName?: string;
  adminRole?: string;
  activeTab: string;
}

export default function Header({ adminName, adminRole, activeTab }: HeaderProps) {
  return (
    <header className="h-[64px] bg-[var(--color-bg-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[14px]">
        <span className="text-[var(--color-text-secondary)] font-medium">Home</span>
        <span className="text-[var(--color-text-secondary)] mx-1">→</span>
        <span className="font-bold text-[var(--color-text-primary)]">{activeTab}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative w-96 max-md:hidden">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={16} />
          <Input 
            type="text" 
            placeholder="Search cakes, orders, students…" 
            className="w-full h-[40px] pl-10 pr-4 bg-[var(--color-bg-muted)] border-transparent rounded-[9999px] text-[14px] outline-none hover:bg-white focus:bg-white focus:border-[var(--color-border)] focus:ring-[var(--color-accent-primary)]/15 transition-all shadow-none placeholder-[var(--color-text-placeholder)]"
          />
        </div>

        <div className="flex items-center gap-5">
          <div className="relative cursor-pointer group">
            <Bell size={20} className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--color-danger)] text-white text-[10px] font-bold flex items-center justify-center">2</span>
          </div>

          <div className="w-[1px] h-6 bg-[var(--color-border-strong)] mx-1"></div>

          {/* Profile */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <Avatar className="w-10 h-10 border-2 border-white shadow-sm shrink-0">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${adminName || 'Admin'}`} />
              <AvatarFallback>{adminName?.[0] || 'A'}</AvatarFallback>
            </Avatar>
            <div className="text-left max-md:hidden">
              <p className="text-[14px] font-bold text-[var(--color-text-primary)] leading-none mb-1">{adminName || 'Admin User'}</p>
              <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#FFF0E0] text-[11px] font-semibold text-[var(--color-accent-dark)] tracking-wide">
                {adminRole || 'Super Admin'}
              </div>
            </div>
            <ChevronDown size={16} className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
}
