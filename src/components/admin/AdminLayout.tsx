import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  admin: any;
  onLogout: () => void;
}

export default function AdminLayout({ children, activeTab, setActiveTab, admin, onLogout }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-[var(--color-bg-base)] overflow-hidden admin-theme selection:bg-[var(--color-accent-primary)] selection:text-white">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout} 
      />

      {/* Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <Header 
          adminName={admin?.name} 
          adminRole={admin?.role} 
          activeTab={activeTab} 
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="mx-auto max-w-[1440px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
