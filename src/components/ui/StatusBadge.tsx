import React from "react"
import { cn } from "@/lib/utils"

export type StatusType = 
  | 'active' | 'confirmed' | 'paid' | 'delivered'
  | 'pending' | 'unpaid'
  | 'cancelled' | 'inactive' | 'danger'
  | 'in-progress' | 'info'
  | 'admin'
  | 'beginner' | 'intermediate' | 'advanced';

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusType;
  label?: string;
  showDot?: boolean;
}

export function StatusBadge({ status, label, showDot, className, ...props }: StatusBadgeProps) {
  let bgClass = "";
  let textClass = "";
  let dotColor = "";

  switch (status) {
    case 'active':
    case 'confirmed':
    case 'paid':
    case 'delivered':
      bgClass = "bg-[#E8F5E8]";
      textClass = "text-[#3A7A3A]";
      dotColor = "bg-[#3A7A3A]";
      break;
    case 'pending':
    case 'unpaid':
      bgClass = "bg-[#FFF3E0]";
      textClass = "text-[#A05A00]";
      dotColor = "bg-[#A05A00]";
      break;
    case 'cancelled':
    case 'inactive':
    case 'danger':
      bgClass = "bg-[#FDECEC]";
      textClass = "text-[#A03030]";
      dotColor = "bg-[#A03030]";
      break;
    case 'in-progress':
    case 'info':
      bgClass = "bg-[#E6F0FA]";
      textClass = "text-[#2A5A8A]";
      dotColor = "bg-[#2A5A8A]";
      break;
    case 'admin':
      bgClass = "bg-[#FFF0E0]";
      textClass = "text-[#8B4513]";
      dotColor = "bg-[#8B4513]";
      break;
    case 'beginner':
      bgClass = "bg-teal-100";
      textClass = "text-teal-800";
      dotColor = "bg-teal-800";
      break;
    case 'intermediate':
      bgClass = "bg-amber-100";
      textClass = "text-amber-800";
      dotColor = "bg-amber-800";
      break;
    case 'advanced':
      bgClass = "bg-rose-100";
      textClass = "text-rose-800";
      dotColor = "bg-rose-800";
      break;
  }

  const displayText = label || status.replace('-', ' ').toUpperCase();

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap",
        bgClass,
        textClass,
        className
      )}
      {...props}
    >
      {showDot && (
        <span className={cn("mr-1.5 h-2 w-2 rounded-full", dotColor)} />
      )}
      {displayText}
    </span>
  )
}
