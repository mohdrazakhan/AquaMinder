// src/components/product/Specs.tsx
import React from "react";

export default function Specs({ specs, gallery }: { specs: { k: string; v: string }[]; gallery?: string[] }) {
  return (
    <section className="mt-6">
      <h3 className="text-lg font-medium text-slate-900">Technical specifications</h3>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <dl className="grid grid-cols-1 gap-y-3">
            {specs.map((s) => (
              <div key={s.k} className="flex justify-between">
                <dt className="text-sm text-slate-600">{s.k}</dt>
                <dd className="text-sm text-slate-900 font-medium">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <div className="flex flex-col gap-3">
            {gallery && gallery.length ? (
              gallery.map((g, i) => (
                <div key={g} className="rounded overflow-hidden">
                  <img src={g} alt={`gallery-${i}`} className="w-full h-auto object-contain" />
                </div>
              ))
            ) : (
              <div className="text-slate-500">No gallery available</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
