import type { LucideIcon } from 'lucide-react';

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
  LogOut,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { cn } from "@/lib/utils";

type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
};

type NavSection = {
  label?: string;
  items: NavItem[];
};

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const navSections: NavSection[] = [
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

export default function Sidebar({ activeTab, setActiveTab, onLogout, isCollapsed, setIsCollapsed }: SidebarProps) {
  return (
    <aside className={cn(
      "bg-[var(--color-bg-deep)] text-[var(--color-text-inverse)] flex flex-col h-screen shrink-0 relative z-40 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-[80px]" : "w-[240px]"
    )}>
      {/* Logo Area */}
      <div className="h-[64px] px-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <Cake className="text-[var(--color-accent-primary)] shrink-0" size={24} strokeWidth={2} />
          {!isCollapsed && (
            <span className="text-[20px] font-bold text-[var(--color-accent-primary)] font-display tracking-wide whitespace-nowrap animate-in fade-in duration-500">
              Johsther
            </span>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-white/10 text-[#B5A090] hover:text-[var(--color-accent-primary)] transition-colors"
        >
          {isCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      {/* Nav Items */}
      <div className="flex-1 py-4 overflow-y-auto custom-scrollbar overflow-x-hidden">
        {navSections.map((section, idx) => (
          <div key={idx} className="mb-6">
            {section.label && !isCollapsed && (
              <div className="px-6 mb-2 text-[11px] font-bold text-[var(--color-text-secondary)] tracking-widest uppercase whitespace-nowrap animate-in fade-in duration-500">
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
                      title={isCollapsed ? item.label : ""}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-[10px] rounded-[10px] text-[14px] font-medium transition-all group relative",
                        isActive
                          ? "bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]"
                          : "text-[#D8C8B8] hover:bg-[#3D2616] hover:text-[#F9F4EE]",
                        isCollapsed && "justify-center px-2"
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
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-[var(--color-danger)] text-xs font-bold text-white">
                              {item.badge}
                            </span>
                          )}
                        </>
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
          title={isCollapsed ? "Log out" : ""}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-[10px] rounded-[10px] text-sm font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-all group",
            isCollapsed && "justify-center px-2"
          )}
        >
          <LogOut size={20} className="shrink-0 group-hover:-translate-x-1 transition-transform" />
          {!isCollapsed && <span className="animate-in fade-in duration-500">Log out</span>}
        </button>
      </div>
    </aside>
  );
}
