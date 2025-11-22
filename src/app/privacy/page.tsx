import React from "react";
import SEO from "@/lib/seo";

export default function PrivacyPage() {
  return (
    <>
      <SEO title="Privacy Policy" desc="Aqua Minder privacy policy." />
      <section className="py-16">
        <div className="container max-w-3xl">
          <h1 className="text-3xl font-extrabold">Privacy Policy</h1>
          <p className="mt-4 text-slate-600">
            We respect your privacy. This policy explains what data we collect, why we collect it, and how we use it.
          </p>

          <div className="mt-6 space-y-4 text-slate-600">
            <h3 className="font-semibold">Data We Collect</h3>
            <p>We collect contact details you provide, device telemetry (when you opt-in), and aggregated usage data.</p>

            <h3 className="font-semibold">How We Use Data</h3>
            <p>To deliver services, send alerts, improve product features, and for analytics.</p>

            <h3 className="font-semibold">Security</h3>
            <p>We use industry-standard security practices. For full details contact support.</p>

            <h3 className="font-semibold">Contact</h3>
            <p>Questions? Use the Contact page or email support@aquaminder.example (replace with your email).</p>
          </div>
        </div>
      </section>
    </>
  );
}
