// /components/TeamCard.tsx
"use client";
import React from "react";
import Image from "next/image";

export default function TeamCard({ name, subtitle, role, img }: { name: string; subtitle?: string; role?: string; img?: string }) {
  return (
    <div className="w-56 text-center">
      <div className="mx-auto w-36 h-36 rounded-full overflow-hidden shadow-md">
        {/* if using public images in /public/images */}
        <Image src={`/images/${img}`} alt={name} width={144} height={144} className="object-cover" />
      </div>

      <div className="mt-4">
        <div className="font-semibold text-lg">{name}</div>
        {subtitle && <div className="text-sm text-slate-500">{subtitle}</div>}
        {role && <div className="text-xs text-slate-400 mt-1">{role}</div>}
      </div>
    </div>
  );
}
