import React from 'react';
import { RotateCcw, Search, Filter, Loader2, AlertCircle, Download, ShoppingBag, Receipt } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency } from '@/lib/api';

export default function RefundsManager() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-[DM Sans]">
       {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[34px] font-bold text-[var(--color-text-primary)]">Refund Requests</h1>
          <p className="text-[14px] text-[var(--color-text-secondary)]">Manage student cancellations and payment reversals.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-[var(--color-border)] text-[var(--color-text-primary)] font-semibold text-[13px]">
            <Download size={16} className="mr-2" />
            Download Refund Log
          </Button>
        </div>
      </div>

      {/* Stat Cards (Simplified) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--color-bg-surface)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-card)]">
          <div className="w-10 h-10 rounded-full bg-[#FDECEC] text-[#A03030] flex items-center justify-center mb-4">
            <RotateCcw size={20} />
          </div>
          <p className="text-[var(--color-text-secondary)] text-[13px] font-medium mb-1">Open Requests</p>
          <p className="font-display text-[26px] font-bold text-[var(--color-text-primary)]">0</p>
        </div>
        <div className="bg-[var(--color-bg-surface)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-card)]">
          <div className="w-10 h-10 rounded-full bg-[#E8F5E8] text-[#3A7A3A] flex items-center justify-center mb-4">
            <ShoppingBag size={20} />
          </div>
          <p className="text-[var(--color-text-secondary)] text-[13px] font-medium mb-1">Processed Today</p>
          <p className="font-display text-[26px] font-bold text-[var(--color-text-primary)]">{formatCurrency(0)}</p>
        </div>
        <div className="bg-[var(--color-bg-surface)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-card)]">
          <div className="w-10 h-10 rounded-full bg-[#E6F0FA] text-[#2A5A8A] flex items-center justify-center mb-4">
            <Receipt size={20} />
          </div>
          <p className="text-[var(--color-text-secondary)] text-[13px] font-medium mb-1">Total Reversed</p>
          <p className="font-display text-[26px] font-bold text-[var(--color-text-primary)]">{formatCurrency(1200000)}</p>
        </div>
      </div>

      <div className="bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] h-[450px] flex items-center justify-center border border-[var(--color-border)] relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(var(--color-accent-primary) 0.5px, transparent 0.5px)", backgroundSize: "20px 20px" }} />
        
        <div className="flex flex-col items-center justify-center text-center max-w-sm relative z-10 p-8">
           <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center text-[var(--color-accent-primary)] mb-8 border border-[var(--color-border)] animate-bounce-subtle">
              <RotateCcw size={36} strokeWidth={1.5} />
           </div>
           <h3 className="font-display text-[24px] font-bold text-[var(--color-text-primary)] mb-3">All clear!</h3>
           <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed mb-8">
             There are currently no active refund requests. All student cancellations have been processed or resolved with artisanal precision.
           </p>
           <Button className="bg-[var(--color-bg-deep)] hover:bg-[#2C1A0E] text-white rounded-full px-8 h-11 font-semibold shadow-lg">
             Review Refund Policy
           </Button>
        </div>
      </div>

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
