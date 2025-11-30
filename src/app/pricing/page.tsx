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
    modelTitle: "AquaMinder Lite",
    modelSubtitle: "Basic",
    plans: [
      {
        id: "lite-free",
        title: "Free",
        priceLabel: "Free",
        monthly: 0,
        short: "Essential controls & scheduling",
        features: [
          "Manual Motor Control (App + Web)",
          "Time Scheduling (multiple schedules)",
          "Real-time motor state & action history",
          "Push notifications for actions",
        ],
      },
      {
        id: "lite-plus",
        title: "Lite Plus",
        priceLabel: "₹99 / month",
        monthly: 99,
        short: "Cloud history & reminders",
        features: [
          "7-day cloud action history",
          "Smart reminders (missed ON/OFF)",
          "WhatsApp alert support",
          "Family sharing (2 users)",
        ],
        ribbon: "Popular",
      },
      {
        id: "lite-pro",
        title: "Lite Pro",
        priceLabel: "₹199 / month",
        monthly: 199,
        short: "30-day history & analytics",
        features: [
          "30-day cloud history",
          "Smart analytics (daily usage)",
          "Auto-backup schedules",
          "Web dashboard",
        ],
      },
    ],
  },
  {
    modelId: "pro",
    modelTitle: "AquaMinder Pro",
    modelSubtitle: "Recommended",
    plans: [
      {
        id: "pro-free",
        title: "Free",
        priceLabel: "Free",
        monthly: 0,
        short: "Level sensing & safety",
        features: [
          "All Lite features",
          "Real-time water level",
          "Auto ON/OFF on tank levels",
          "Safety alerts",
        ],
      },
      {
        id: "pro-plus",
        title: "Pro Plus",
        priceLabel: "₹199 / month",
        monthly: 199,
        short: "Analytics and smart alerts",
        features: [
          "30-day cloud history",
          "Smart leak alerts",
          "Consumption analytics",
          "Schedule + water-level logic",
        ],
        ribbon: "Popular",
      },
      {
        id: "pro-premium",
        title: "Pro Premium",
        priceLabel: "₹399 / month",
        monthly: 399,
        short: "Multi-device & reports",
        features: [
          "Multi-device dashboard",
          "Downloadable reports",
          "WhatsApp premium alerts",
          "API access",
        ],
      },
    ],
  },
  {
    modelId: "pro-plus",
    modelTitle: "AquaMinder Pro+",
    modelSubtitle: "Premium",
    plans: [
      {
        id: "proplus-free",
        title: "Free",
        priceLabel: "Free",
        monthly: 0,
        short: "Flow monitoring & protection",
        features: [
          "All Pro features",
          "Flow monitoring (real-time)",
          "Dry run protection (auto-off on no flow)",
          "Motor health logs",
        ],
      },
      {
        id: "proplus-smart",
        title: "Pro+ Smart",
        priceLabel: "₹299 / month",
        monthly: 299,
        short: "Flow analytics & automations",
        features: [
          "Real-time flow analytics",
          "Smart automations (sensor fusion)",
          "30-day cloud history",
          "Fault prediction alerts",
        ],
        ribbon: "Popular",
      },
      {
        id: "proplus-enterprise",
        title: "Pro+ Enterprise",
        priceLabel: "₹499 / month",
        monthly: 499,
        short: "Enterprise-grade features",
        features: [
          "Multi-location dashboard",
          "Export reports (PDF/CSV)",
          "SLA priority support",
          "Advanced automation builder",
        ],
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
