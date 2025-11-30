// src/components/pricing/PricingClient.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/ui/card";
import { PrimaryCTA, GhostCTA } from "@/components/ui/CTA";
import type { ModelPlans, PlanDef } from "@/app/pricing/page";

type Props = {
  models: ModelPlans[];
};

const YEARLY_DISCOUNT = 0.15; // 15% off yearly

function formatCurrencyINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

/**
 * Expand features so each higher-tier plan contains all features from lower tiers.
 * This makes the comparison table show inherited features as ticks.
 */
function expandPlansWithInheritedFeatures(plans: PlanDef[]) {
  const expanded: PlanDef[] = [];
  const seen = new Set<string>();

  for (const plan of plans) {
    // copy own features
    const own = Array.from(plan.features || []);

    // inherit features from previous plans (preserve ordering)
    const inherited = Array.from(seen);

    // merge: inherited first then own (dedupe)
    const merged = [...inherited, ...own].filter((v, i, arr) => arr.indexOf(v) === i);

    // mark seen with merged so next plans inherit everything
    merged.forEach((f) => seen.add(f));

    expanded.push({
      ...plan,
      features: merged,
    });
  }

  return expanded;
}

export default function PricingClient({ models }: Props) {
  const [selectedModel, setSelectedModel] = useState<string>(models[0].modelId);
  const [billingAnnual, setBillingAnnual] = useState(false); // false = monthly
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // Build a models map with expanded/inherited features
  const modelsExpanded = useMemo(() => {
    return models.map((m) => {
      const expandedPlans = expandPlansWithInheritedFeatures(m.plans);
      return { ...m, plans: expandedPlans };
    });
  }, [models]);

  const model = useMemo(() => modelsExpanded.find((m) => m.modelId === selectedModel)!, [modelsExpanded, selectedModel]);

  useEffect(() => {
    setSelectedPlanId(null);
  }, [selectedModel, billingAnnual]);

  function calcPrice(plan: PlanDef) {
    if (!plan.monthly || plan.monthly <= 0) {
      return {
        isFree: true,
        monthly: 0,
        yearlyTotal: 0,
        yearlyLabel: "Free",
        monthlyLabel: "Free",
        monthlyEquivalentForYearly: "Free",
      };
    }
    const monthly = plan.monthly;
    const yearlyBeforeDiscount = monthly * 12;
    const yearlyTotal = Math.round(yearlyBeforeDiscount * (1 - YEARLY_DISCOUNT));
    // monthly equivalent when billed yearly (rounded)
    const monthlyEquivalent = Math.round(yearlyTotal / 12);
    return {
      isFree: false,
      monthly,
      yearlyTotal,
      yearlyLabel: `${formatCurrencyINR(yearlyTotal)} / year`,
      monthlyLabel: `${formatCurrencyINR(monthly)} / month`,
      monthlyEquivalentForYearly: `${formatCurrencyINR(monthlyEquivalent)} / month`,
      savingsPercent: Math.round(YEARLY_DISCOUNT * 100),
    };
  }

  function onChoose(plan: PlanDef) {
    const price = calcPrice(plan);
    if (plan.monthly && plan.monthly > 0) {
      if (billingAnnual) {
        // Use yearlyTotal for checkout (apply 12-month billing)
        alert(`Checkout: ${plan.title} — ${price.monthlyEquivalentForYearly} (billed yearly: ${price.yearlyLabel}) for ${model.modelTitle}`);
        // pass plan.id, model.modelId, billingAnnual true -> backend create yearly session with price.yearlyTotal
      } else {
        alert(`Checkout: ${plan.title} — ${price.monthlyLabel} per month for ${model.modelTitle}`);
        // pass plan.id, model.modelId, billingAnnual false -> monthly checkout
      }
    } else {
      alert(`Selected Free plan: ${plan.title} for ${model.modelTitle}`);
    }
    setSelectedPlanId(plan.id);
  }

  // Build a feature union for the comparison table (after expansion)
  const comparisonFeatures = useMemo(() => {
    const set = new Set<string>();
    model.plans.forEach((p) => p.features.forEach((f) => set.add(f)));
    return Array.from(set);
  }, [model]);

  return (
    <div>
      {/* top row: model selector + billing toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3 overflow-auto">
          {modelsExpanded.map((m) => {
            const active = m.modelId === selectedModel;
            return (
              <button
                key={m.modelId}
                onClick={() => setSelectedModel(m.modelId)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${active ? "bg-sky-600 text-white shadow" : "bg-white text-slate-700 border"}`}
                aria-pressed={active}
              >
                {m.modelTitle}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600 hidden sm:block">
            <span className="font-medium">{model.modelTitle}</span>{" "}
            <span className="text-slate-500">— {model.modelSubtitle}</span>
          </div>

          {/* billing toggle */}
          <div className="flex items-center gap-3">
            <div className={`text-sm ${!billingAnnual ? "text-slate-900 font-semibold" : "text-slate-600"}`}>Monthly</div>

            <button
              onClick={() => setBillingAnnual((s) => !s)}
              aria-pressed={billingAnnual}
              className={`relative inline-flex items-center h-6 w-12 rounded-full transition ${billingAnnual ? "bg-sky-600" : "bg-slate-200"}`}
              title="Toggle billing"
            >
              <span
                className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transform transition ${billingAnnual ? "translate-x-6" : "translate-x-0"}`}
              />
            </button>

            <div className={`text-sm ${billingAnnual ? "text-slate-900 font-semibold" : "text-slate-600"}`}>Yearly</div>

            {billingAnnual && (
              <div className="text-xs text-sky-600 px-2 py-1 rounded-md bg-sky-50">Save {Math.round(YEARLY_DISCOUNT * 100)}%</div>
            )}
          </div>
        </div>
      </div>

      {/* plans grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {model.plans.map((plan, idx) => {
          const isSelected = selectedPlanId === plan.id;
          const price = calcPrice(plan);

          return (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}>
              <Card className={`p-6 rounded-2xl border relative ${isSelected ? "ring-2 ring-sky-200" : ""}`}>
                {plan.ribbon && (
                  <div className="absolute -top-3 right-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sky-600 text-white shadow">
                      {plan.ribbon}
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{plan.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">{plan.short}</p>
                  </div>

                  <div className="text-right">
                    {price.isFree ? (
                      <div className="text-2xl font-extrabold text-sky-600">Free</div>
                    ) : billingAnnual ? (
                      // show monthly equivalent when billed yearly, but reflect billed yearly in small text
                      <>
                        <div className="text-2xl font-extrabold text-sky-600">{price.monthlyEquivalentForYearly}</div>
                        <div className="text-xs text-slate-500">billed yearly ({price.yearlyLabel})</div>
                      </>
                    ) : (
                      <>
                        <div className="text-2xl font-extrabold text-sky-600">{price.monthlyLabel}</div>
                        <div className="text-xs text-slate-500">per device / month</div>
                      </>
                    )}
                  </div>
                </div>

                <ul className="mt-5 space-y-3 text-sm text-slate-700">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="mt-1 h-4 w-4 text-sky-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                        <path fillRule="evenodd" clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 011.414-1.414L8.414 12.172l6.88-6.879a1 1 0 011.413 0z" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center gap-3">
                  <PrimaryCTA onClick={() => onChoose(plan)} className="px-4 py-2">
                    {price.isFree ? `Select Free` : `Buy ${plan.title}`}
                  </PrimaryCTA>

                  <GhostCTA onClick={() => alert(`${plan.title}: ${plan.features.length} features`)}>
                    Learn more
                  </GhostCTA>
                </div>

                <div className="mt-3 text-xs text-slate-500">{isSelected ? "Selected" : " "}</div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Comparison table for selected model */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-slate-900">Compare plans — {model.modelTitle}</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2 w-64"></th>
                {model.plans.map((p) => {
                  const price = calcPrice(p);
                  return (
                    <th key={p.id} className="px-4 py-2">
                      <div className="font-medium">{p.title}</div>
                      <div className="text-sm text-slate-500">
                        {billingAnnual
                          ? price.isFree
                            ? "Free"
                            : `${price.monthlyEquivalentForYearly} (billed yearly)`
                          : price.isFree
                          ? "Free"
                          : price.monthlyLabel}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {comparisonFeatures.map((feat, i) => (
                <tr key={i} className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                  <td className="px-4 py-3 text-sm text-slate-700 font-medium">{feat}</td>
                  {model.plans.map((p) => {
                    const has = p.features.includes(feat);
                    return (
                      <td key={p.id} className="px-4 py-3 text-sm text-slate-700">
                        {has ? (
                          <svg className="inline-block h-4 w-4 text-sky-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                            <path fillRule="evenodd" clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 011.414-1.414L8.414 12.172l6.88-6.879a1 1 0 011.413 0z" />
                          </svg>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* extras: users/accounts row */}
              <tr className="bg-white">
                <td className="px-4 py-3 text-sm font-medium">Users / Accounts</td>
                {model.plans.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-sm">
                    {p.title.toLowerCase().includes("enterprise") ? "10" : p.title.toLowerCase().includes("premium") || p.title.toLowerCase().includes("pro") ? "5" : p.title.toLowerCase().includes("plus") ? "2" : "1"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 text-sm text-slate-600 max-w-3xl">
        <p>When yearly billing is selected the UI shows the monthly equivalent but checkout will charge the yearly total (12 months minus discount).</p>
      </div>
    </div>
  );
}
