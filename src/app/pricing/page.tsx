import React from "react";
import SEO from "@/lib/seo";
import Card from "@/components/ui/card";
import { PrimaryCTA } from "@/components/ui/CTA";

export default function PricingPage() {
  const plans = [
    {
      title: "Basic",
      price: "Free",
      desc: "Track real-time usage & local alerts",
      features: ["Real-time monitoring", "Local alerts only", "Basic dashboard"],
    },
    {
      title: "Plus",
      price: "₹199 / month",
      desc: "Cloud history, insights & smart alerts",
      features: [
        "All Basic features",
        "30-day cloud history",
        "Smart leak alerts",
        "Consumption insights",
      ],
    },
    {
      title: "Pro",
      price: "₹499 / month",
      desc: "For businesses & advanced users",
      features: [
        "All Plus features",
        "Multi-location dashboard",
        "Export reports",
        "Priority support",
      ],
    },
  ];

  return (
    <>
      <SEO title="Pricing" desc="Choose the right Aqua Minder plan" />

      <section className="py-20">
        <div className="container">
          <h1 className="text-4xl font-extrabold text-center">Pricing</h1>
          <p className="mt-3 text-slate-600 text-center">
            Simple, transparent plans for homes & businesses.
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {plans.map((p) => (
              <Card key={p.title} className="text-center p-8 bg-white shadow-lg rounded-2xl">
                <h3 className="text-xl font-semibold">{p.title}</h3>

                <div className="mt-2 text-3xl font-bold text-brand-500">{p.price}</div>

                <p className="mt-2 text-sm text-slate-600">{p.desc}</p>

                <ul className="mt-4 text-left text-slate-600 text-sm space-y-2">
                  {p.features.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>

                <div className="mt-6">
                  <PrimaryCTA className="w-full">Choose Plan</PrimaryCTA>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
