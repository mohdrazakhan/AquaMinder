// src/components/product/RelatedModels.tsx
import React from "react";
import Link from "next/link";
import { MODELS } from "@/data/models";

export default function RelatedModels({ currentId }: { currentId: string }) {
  const others = MODELS.filter((m) => m.id !== currentId);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {others.map((m) => (
        <article key={m.id} className="border rounded-2xl p-4 flex items-start gap-4 hover:shadow-md transition">
          <div className="w-20 h-20 rounded-lg bg-slate-50 border flex items-center justify-center overflow-hidden">
            <img src={m.gallery?.[0] ?? "/device-hero.png"} alt={m.title} className="max-h-full object-contain" />
          </div>

          <div className="flex-1">
            <h4 className="text-lg font-semibold text-slate-900">{m.title}</h4>
            <div className="text-sm text-slate-600 mt-1">{m.short}</div>

            <div className="mt-3 flex gap-2">
              <Link href={`/product/${m.id}`} className="px-3 py-2 rounded bg-white border text-sm text-slate-700">
                Learn more
              </Link>
              <a href="/buy" className="px-3 py-2 rounded bg-sky-500 text-white text-sm">
                Buy
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
