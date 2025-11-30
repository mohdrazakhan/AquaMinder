// src/components/ui/CTA.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function PrimaryCTA({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-3 font-semibold shadow-md transition",
        "bg-sky-500 text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-300",
        className
      )}
    >
      {children}
    </button>
  );
}

export function GhostCTA({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-block px-4 py-2 rounded-lg border",
        "bg-white text-slate-700 hover:bg-slate-50",
        className
      )}
    >
      {children}
    </button>
  );
}
