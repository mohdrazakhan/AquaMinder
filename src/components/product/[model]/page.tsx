// src/app/product/[model]/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import SEO from "@/lib/seo";
import { MODELS, getModelById, type Model } from "@/data/models";
import ProductHero from "@/components/product/ProductHero";
import Specs from "@/components/product/Specs";
import Comparison from "@/components/product/Comparison";

type Props = {
  params: { model: string };
};

export default function ModelPage({ params }: Props) {
  const modelId = params.model;
  const model = getModelById(modelId);

  if (!model) return notFound();

  return (
    <>
      <SEO title={`${model.title} — Aqua Minder`} desc={model.short} />
      <main className="py-12">
        <div className="container mx-auto px-6">
          <ProductHero model={model} allModels={MODELS} />
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <section className="bg-white rounded-2xl p-6 shadow-sm border">
                <h2 className="text-2xl font-semibold text-slate-900">{model.title}</h2>
                <p className="mt-3 text-slate-600">{model.long}</p>

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-slate-900">Key features</h3>
                  <ul className="mt-3 space-y-2 text-slate-700">
                    {model.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg className="mt-1 h-4 w-4 text-sky-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                          <path fillRule="evenodd" clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 011.414-1.414L8.414 12.172l6.88-6.879a1 1 0 011.413 0z" />
                        </svg>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 flex gap-4">
                  <a href="/buy" className="inline-flex items-center rounded-lg bg-sky-500 hover:bg-sky-600 text-white px-5 py-3 font-semibold shadow">
                    Buy {model.title}
                  </a>
                  <a href="/contact" className="inline-flex items-center rounded-lg border px-5 py-3 text-slate-700 bg-white hover:bg-slate-50">
                    Talk to sales
                  </a>
                </div>
              </section>

              <div className="mt-6">
                <Specs specs={model.specs} gallery={model.gallery} />
              </div>
            </div>

            <aside className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <div className="text-sm text-slate-500">Suggested retail price</div>
                <div className="mt-2 text-3xl font-extrabold text-slate-900">{model.priceSuggested}</div>

                <div className="mt-4 text-slate-600 text-sm">Includes sensor & basic installation kit</div>

                <div className="mt-6">
                  <a href="/buy" className="w-full inline-flex items-center justify-center rounded-lg bg-sky-500 hover:bg-sky-600 text-white px-4 py-3 font-semibold shadow">
                    Buy now
                  </a>
                </div>
              </div>

              <div className="mt-6">
                <Comparison currentModel={model.id} />
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
