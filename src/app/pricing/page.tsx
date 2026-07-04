// src/app/pricing/page.tsx
import React from "react";
import SEO from "@/lib/seo";
import PricingClient from "@/components/pricing/PricingClient";

export type PlanDef = {
  id: string;
  title: string;
  priceLabel: string;
  monthly: number | null; // null for Free
  short: string;
  features: string[];
  ribbon?: string | null;
};

export type ModelPlans = {
  modelId: string;
  modelTitle: string;
  modelSubtitle?: string;
  plans: PlanDef[];
};

const DATA: ModelPlans[] = [
  {
    modelId: "lite",
    modelTitle: "Aqua Minder",
    modelSubtitle: "Basic",
    plans: [
      {
        id: "lite-free",
        title: "Free",
        priceLabel: "Free",
        monthly: 0,
        short: "Essential local control for daily use.",
        features: [
          "Manual pump control (Local Wi-Fi)",
          "Basic time schedules",
          "Real-time motor state",
        ],
      },
      {
        id: "lite-paid",
        title: "Premium",
        priceLabel: "₹29 / month",
        monthly: 29,
        short: "Cloud sync & smart insights.",
        features: [
          "Everything in Free",
          "Remote control via Cloud",
          "Push notifications & alerts",
          "30-day action history",
          "Multi-device management",
        ],
        ribbon: "Popular",
      },
    ],
  },
  {
    modelId: "pro",
    modelTitle: "Aqua Minder +",
    modelSubtitle: "Recommended",
    plans: [
      {
        id: "pro-free",
        title: "Free",
        priceLabel: "Free",
        monthly: 0,
        short: "Essential local protection and control.",
        features: [
          "Local Dry Run Protection",
          "Live water temperature",
          "Basic level monitoring",
        ],
      },
      {
        id: "pro-paid",
        title: "Premium",
        priceLabel: "₹49 / month",
        monthly: 49,
        short: "Full automated protection and cloud history.",
        features: [
          "Everything in Free",
          "Cloud Dry Run Alerts",
          "Smart Auto ON/OFF limits",
          "30-day sensor history",
          "Priority SMS alerts",
        ],
        ribbon: "Popular",
      },
    ],
  },
];

export default function PricingPage() {
  return (
    <>
      <SEO title="Pricing — Aqua Minder" desc="Choose device and subscription plan for AquaMinder." />
      <main className="py-16">
        <div className="container mx-auto px-6">
          <header className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900">
              Pricing & Plans
            </h1>
            <p className="mt-3 text-slate-600">
              Select your device model, choose monthly or yearly billing and pick a subscription. Yearly billing gives you a discount.
            </p>
          </header>

          <section className="mt-10">
            <PricingClient models={DATA} />
          </section>
        </div>
      </main>
    </>
  );
}
