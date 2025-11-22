import React from "react";
import { cn } from "@/lib/utils";

export function PrimaryCTA({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={cn(
      "inline-block px-5 py-2.5 rounded-lg font-semibold shadow-sm",
      "bg-sky-500 text-white hover:bg-sky-600",
      className
    )}>
      {children}
    </button>
  );
}

export function GhostCTA({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={cn("inline-block px-4 py-2 rounded-lg border", "bg-white text-slate-800", className)}>
      {children}
    </button>
  );
}
