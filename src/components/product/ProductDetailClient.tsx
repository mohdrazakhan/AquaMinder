// src/components/product/ProductDetailClient.tsx
"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MODELS, getModelById, type Model } from "@/data/models";
import RelatedModels from "@/components/product/RelatedModels";

/**
 * Polished product detail client component
 * - reads route slug via useParams()
 * - renders a rich product page with FAQ, install guide & related models
 */

export default function ProductDetailClient() {
  const params = useParams() as Record<string, string | undefined> | undefined;
  const modelId = params?.model ?? params?.slug ?? params?.id ?? "";

  const model: Model | undefined = useMemo(() => {
    if (!modelId) return undefined;
    return getModelById(modelId);
  }, [modelId]);

  if (!model) {
    return (
      <div className="bg-white rounded-2xl p-8 border shadow-sm text-center">
        <h1 className="text-2xl font-semibold mb-3">Product not found</h1>
        <p className="text-slate-600 mb-4">
          We couldn't find a product with id <strong>{modelId || "<empty>"}</strong>.
        </p>

        <div className="mb-4">
          <div className="text-sm text-slate-700">Available product slugs:</div>
          <div className="mt-3 flex gap-2 justify-center flex-wrap">
            {MODELS.map((m) => (
              <Link key={m.id} href={`/product/${m.id}`} className="px-3 py-2 rounded bg-white border text-sm text-slate-700">
                {m.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Link href="/product" className="px-4 py-2 rounded border bg-white text-slate-700">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HERO */}
      <header className="bg-white p-6 md:p-8 rounded-2xl border shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
          <div className="md:col-span-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-slate-900">
                {model.title}
              </h1>
              <span className="inline-block text-sm text-slate-500 border px-2 py-1 rounded">{model.subtitle}</span>
            </div>

            <p className="mt-3 text-slate-600 max-w-2xl">{model.short}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/buy"
                className="inline-flex items-center rounded-lg bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 font-semibold shadow"
              >
                Buy
              </a>

              <a
                href="/pricing"
                className="inline-flex items-center rounded-lg border px-4 py-2 text-slate-700 bg-white hover:bg-slate-50"
              >
                Pricing & Plans
              </a>

              <a
                href={`/docs/spec-${model.id}.pdf`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-lg px-4 py-2 border bg-white text-slate-700 hover:bg-slate-50"
              >
                Download spec sheet
              </a>
            </div>
          </div>

          <div className="md:col-span-1 flex justify-end">
            <div className="w-36 h-36 rounded-2xl overflow-hidden bg-slate-50 border p-3 flex items-center justify-center">
              <img
                src={model.gallery?.[0] ?? "/device-hero.png"}
                alt={model.title}
                className="max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left / main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview / long description */}
          <section className="bg-white rounded-2xl p-6 border shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">{model.title}</h2>
            <p className="text-slate-600">{model.long}</p>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-slate-900">Key features</h3>
              <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {model.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="mt-1 h-5 w-5 text-sky-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path fillRule="evenodd" clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 011.414-1.414L8.414 12.172l6.88-6.879a1 1 0 011.413 0z" />
                    </svg>
                    <span className="text-slate-700">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Specs */}
          <section className="bg-white rounded-2xl p-6 border shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-900">Technical specifications</h3>
              <span className="text-sm text-slate-500">Model SKU: <strong>{model.id.toUpperCase()}</strong></span>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dl className="grid grid-cols-1 gap-y-3">
                  {model.specs.map((s) => (
                    <div key={s.k} className="flex justify-between">
                      <dt className="text-sm text-slate-600">{s.k}</dt>
                      <dd className="text-sm text-slate-900 font-medium">{s.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-3">
                  {model.gallery && model.gallery.length ? (
                    model.gallery.map((g, i) => (
                      <div key={g} className="rounded overflow-hidden bg-slate-50 border p-2">
                        <img src={g} alt={`${model.title} ${i + 1}`} className="w-full h-28 object-contain" />
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500">No gallery available</div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Installation guide */}
          <section className="bg-white rounded-2xl p-6 border shadow-sm">
            <h3 className="text-lg font-medium text-slate-900">Quick install & wiring</h3>
            <p className="mt-2 text-slate-600">
              Basic install takes 30–60 minutes if you're comfortable with wiring. We include a step-by-step quickstart guide in the packaging.
            </p>

            <ol className="mt-4 list-decimal list-inside space-y-2 text-slate-700">
              <li>Power off the main supply and mount the device near the pump motor.</li>
              <li>Connect the level sensor to the sensor terminal and route the cable to the tank.</li>
              <li>Wire the relay to the motor starter as shown in the guide — connect N/L/pump terminals correctly.</li>
              <li>Power on the device, pair with the app and run the setup wizard to configure schedules and alerts.</li>
            </ol>

            <div className="mt-4 flex gap-3">
              <a href={`/docs/install-${model.id}.pdf`} target="_blank" rel="noreferrer" className="px-4 py-2 rounded border bg-white text-slate-700">
                Download full installation guide
              </a>
              <a href="/support" className="px-4 py-2 rounded bg-sky-500 text-white">
                Get help from support
              </a>
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-white rounded-2xl p-6 border shadow-sm">
            <h3 className="text-lg font-medium text-slate-900">FAQ</h3>

            <div className="mt-4 space-y-3">
              <details className="bg-slate-50 p-4 rounded">
                <summary className="cursor-pointer font-medium">Does this model support multiple motors?</summary>
                <div className="mt-2 text-slate-700 text-sm">
                  Pro+ supports multi-motor setups and three-phase with the appropriate relay add-on. Pro supports single motor by default.
                </div>
              </details>

              <details className="bg-slate-50 p-4 rounded">
                <summary className="cursor-pointer font-medium">Is there a warranty?</summary>
                <div className="mt-2 text-slate-700 text-sm">
                  Yes — Lite & Pro come with 1 year warranty. Pro+ includes 2 years by default (hardware).
                </div>
              </details>

              <details className="bg-slate-50 p-4 rounded">
                <summary className="cursor-pointer font-medium">Can I use my existing sensors?</summary>
                <div className="mt-2 text-slate-700 text-sm">
                  In many cases yes — contact support with the sensor model and we will confirm compatibility.
                </div>
              </details>
            </div>
          </section>

          {/* See more models (related) */}
          <section className="bg-white rounded-2xl p-6 border shadow-sm">
            <h3 className="text-lg font-medium text-slate-900 mb-4">See more models</h3>

            <RelatedModels currentId={model.id} />
          </section>
        </div>

        {/* Right / aside */}
        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="text-sm text-slate-500">Suggested retail price</div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">{model.priceSuggested}</div>

            <div className="mt-3 text-slate-600 text-sm">Includes sensor & basic installation kit</div>

            <div className="mt-6">
              <a href="/buy" className="w-full inline-flex items-center justify-center rounded-lg bg-sky-500 hover:bg-sky-600 text-white px-4 py-3 font-semibold shadow">
                Buy now
              </a>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border shadow-sm">
            <h4 className="text-sm font-semibold text-slate-900">Compare models</h4>
            <div className="mt-3 text-sm text-slate-600">
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-slate-500">
                  <tr>
                    <th className="py-2">Feature</th>
                    {MODELS.map((m) => (
                      <th key={m.id} className="py-2">{m.title.split(" ")[1]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 text-slate-600">Key feature</td>
                    {MODELS.map((m) => <td key={m.id} className="py-2 text-slate-700">{m.features[0]}</td>)}
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-600">Suggested price</td>
                    {MODELS.map((m) => <td key={m.id} className="py-2">{m.priceSuggested}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <Link href="/pricing" className="inline-flex items-center px-3 py-2 rounded bg-white border text-slate-700 hover:bg-slate-50 text-sm">
                See full pricing
              </Link>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border shadow-sm">
            <h4 className="text-sm font-semibold text-slate-900">Need help?</h4>
            <p className="mt-2 text-sm text-slate-600">Talk to sales for volume pricing or installation support.</p>
            <div className="mt-3">
              <Link href="/contact" className="inline-flex items-center px-3 py-2 rounded bg-sky-500 text-white">
                Contact sales
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
