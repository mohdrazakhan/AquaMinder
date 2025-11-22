import React from "react";
import SEO from "@/lib/seo";

const faqs = [
  { q: "How do I install Aqua Minder?", a: "Follow the quick start guide in the documentation or request a pro install." },
  { q: "Does it require Wi-Fi?", a: "Yes — our cloud features require Wi-Fi; local fallback works if connectivity is lost." },
  { q: "Can I share access with family?", a: "Yes — the dashboard supports multiple users per household." },
];

export default function FAQPage() {
  return (
    <>
      <SEO title="FAQ" desc="Frequently asked questions about Aqua Minder" />
      <section className="py-16">
        <div className="container max-w-3xl">
          <h1 className="text-3xl font-extrabold">FAQ</h1>
          <div className="mt-8 space-y-6">
            {faqs.map((f, i) => (
              <div key={i}>
                <h3 className="font-semibold">{f.q}</h3>
                <p className="text-slate-600 mt-2">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
