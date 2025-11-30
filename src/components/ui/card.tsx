// src/components/ui/Card.tsx
import React from "react";
import clsx from "clsx";

export default function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx("bg-white rounded-2xl", className)}>
      {children}
    </div>
  );
}
// src/components/ui/Card.tsx
