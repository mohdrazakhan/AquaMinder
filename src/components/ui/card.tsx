// src/components/ui/Card.tsx
import React from "react";

export default function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
