// src/components/product/ProductHero.tsx
import React from "react";
import Link from "next/link";
import type { Model } from "@/data/models";

export default function ProductHero({ model, allModels }: { model: Model; allModels: Model[] }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2">
          <div className="inline-flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-slate-900">{model.title}</h1>
            <span className="text-sm text-slate-500">{model.subtitle}</span>
          </div>
          <p className="mt-3 text-slate-600">{model.short}</p>

          <div className="mt-6 flex gap-3">
            <a href="/buy" className="inline-flex items-center rounded-lg bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 font-semibold shadow">
              Buy
            </a>
            <Link href="/pricing" className="inline-flex items-center rounded-lg border px-4 py-2 text-slate-700 bg-white hover:bg-slate-50">
              Pricing & Plans
            </Link>
            <Link href="/support" className="inline-flex items-center rounded-lg px-4 py-2 text-slate-600 bg-white hover:bg-slate-50 border">
              Support
            </Link>
          </div>
        </div>

        <div className="md:col-span-1 flex justify-center md:justify-end">
          {/* simple responsive image preview (use gallery[0] if present) */}
          <div className="w-full max-w-[220px] rounded-2xl overflow-hidden bg-slate-50 border p-4">
            <img src={model.gallery?.[0] ?? "/device-hero.png"} alt={model.title} className="w-full h-auto object-contain" />
          </div>
        </div>
      </div>

      {/* quick model links */}
      <div className="mt-4 flex gap-3 flex-wrap">
        {allModels.map((m) => (
          <Link key={m.id} href={`/product/${m.id}`} className={`px-3 py-1 rounded-full text-sm ${m.id === model.id ? "bg-sky-600 text-white" : "bg-white text-slate-700 border"}`}>
            {m.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
