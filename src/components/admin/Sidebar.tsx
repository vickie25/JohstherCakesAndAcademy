import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Bell, 
  Package, 
  Cake, 
  Users, 
  MessageSquare,
  Star,
  RotateCcw,
  GraduationCap,
  CalendarDays,
  ClipboardList,
  ShieldCheck, 
  Settings, 
  LogOut
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const navSections = [
  {
    items: [
      { id: 'Overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'Analytics', label: 'Store Analytics', icon: TrendingUp },
      { id: 'Notifications', label: 'Notifications', icon: Bell, badge: 2 },
    ]
  },
  {
    label: 'MANAGEMENT',
    items: [
      { id: 'Orders', label: 'Orders', icon: Package },
      { id: 'Cakes', label: 'Cakes', icon: Cake },
      { id: 'Customers', label: 'Customers / Users', icon: Users },
      { id: 'Inquiries', label: 'Inquiries', icon: MessageSquare },
      { id: 'Testimonials', label: 'Testimonials', icon: Star },
      { id: 'Refunds', label: 'Refunds', icon: RotateCcw },
    ]
  },
  {
    label: 'ACADEMY',
    items: [
      { id: 'Courses', label: 'Courses', icon: GraduationCap },
      { id: 'Batches', label: 'Batches', icon: CalendarDays },
      { id: 'Registrations', label: 'Registrations', icon: ClipboardList },
    ]
  },
  {
    label: 'CONFIG',
    items: [
      { id: 'Roles', label: 'Page Roles', icon: ShieldCheck },
      { id: 'Settings', label: 'Settings', icon: Settings },
    ]
  }
];

export default function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  return (
    <aside className="w-[240px] bg-[var(--color-bg-deep)] text-[var(--color-text-inverse)] flex flex-col h-screen shrink-0 relative z-40">
      {/* Logo */}
      <div className="h-[64px] px-6 flex items-center gap-3">
        <Cake className="text-[var(--color-accent-primary)] shrink-0" size={24} strokeWidth={2} />
        <span className="text-[20px] font-bold text-[var(--color-accent-primary)] font-display tracking-wide">Johsther</span>
      </div>

      {/* Nav Items */}
      <div className="flex-1 py-4 overflow-y-auto custom-scrollbar">
        {navSections.map((section, idx) => (
          <div key={idx} className="mb-6">
            {section.label && (
              <div className="px-6 mb-2 text-[11px] font-bold text-[var(--color-text-secondary)] tracking-widest uppercase">
                {section.label}
              </div>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <li key={item.id} className="px-2">
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-[10px] rounded-[10px] text-[14px] font-medium transition-all group relative",
                        isActive 
                          ? "bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]" 
                          : "text-[#D8C8B8] hover:bg-[#3D2616] hover:text-[#F9F4EE]"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[var(--color-accent-primary)] rounded-r-full" />
                      )}
                      <Icon 
                        size={20} 
                        className={cn(
                          "shrink-0 transition-colors",
                          isActive ? "text-[var(--color-accent-primary)]" : "text-[#B5A090] group-hover:text-[#E8DDD0]"
                        )} 
                      />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-[var(--color-danger)] text-xs font-bold text-white">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-[#3D2616]">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-[10px] rounded-[10px] text-sm font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-all group"
        >
          <LogOut size={20} className="shrink-0 group-hover:-translate-x-1 transition-transform" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
