// src/app/product/page.tsx
import React from "react";
import Link from "next/link";
import SEO from "@/lib/seo";
import { MODELS } from "@/data/models";

export default function ProductIndexPage() {
  return (
    <>
      <SEO title="Products — Aqua Minder" desc="Explore AquaMinder device models: Lite, Pro and Pro+." />
      <main className="py-12">
        <div className="container mx-auto px-6">
          <header className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">AquaMinder devices</h1>
            <p className="mt-3 text-slate-600">
              Choose the device that fits your home or business — click Learn more for full specs and purchasing options.
            </p>
          </header>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {MODELS.map((m) => (
              <article key={m.id} className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{m.title}</h2>
                    <div className="text-sm text-slate-500 mt-1">{m.subtitle}</div>
                  </div>

                  <div className="w-28 h-28 rounded-2xl bg-slate-50 flex items-center justify-center border">
                    <img
                      src={m.gallery?.[0] ?? "/device-hero.png"}
                      alt={m.title}
                      className="max-h-20 object-contain"
                    />
                  </div>
                </div>

                <p className="mt-4 text-slate-600 flex-1">{m.short}</p>

                <ul className="mt-4 space-y-2 text-slate-700">
                  {m.features.slice(0, 4).map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="mt-1 h-4 w-4 text-sky-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                        <path fillRule="evenodd" clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 011.414-1.414L8.414 12.172l6.88-6.879a1 1 0 011.413 0z" />
                      </svg>
                      <span className="text-sm">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center gap-3">
                  <a
                    href="/buy"
                    className="inline-flex items-center rounded-lg bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 font-semibold shadow"
                    aria-label={`Buy ${m.title}`}
                  >
                    Buy
                  </a>

                  <Link
                    href={`/product/${m.id}`}
                    className="inline-flex items-center rounded-lg border px-4 py-2 text-slate-700 bg-white hover:bg-slate-50"
                    aria-label={`Learn more about ${m.title}`}
                  >
                    Learn more
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
