import React from "react";
import SEO from "@/lib/seo";
import Link from "next/link";

export default function CareersPage() {
  return (
    <>
      <SEO title="Careers" desc="Join the Aqua Minder team" />
      <section className="py-16">
        <div className="container max-w-3xl">
          <h1 className="text-3xl font-extrabold">Careers</h1>
          <p className="mt-3 text-slate-600">We’re a small team. If you’re curious about hardware, firmware or cloud services, let’s talk.</p>

          <div className="mt-8">
            <h3 className="font-semibold">Open roles</h3>
            <ul className="mt-3 list-disc ml-5 text-slate-600">
              <li>Embedded firmware engineer</li>
              <li>Backend/cloud engineer</li>
              <li>Hardware test & validation</li>
            </ul>

            <p className="mt-6 text-slate-600">
              Interested? Email careers@aquaminder.example with your CV and a short note.
            </p>

            <p className="mt-4"><Link href="/contact" className="text-brand-500">Contact us →</Link></p>
          </div>
        </div>
      </section>
    </>
  );
}
