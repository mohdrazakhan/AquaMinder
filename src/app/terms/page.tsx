import React from "react";
import SEO from "@/lib/seo";

export default function TermsPage() {
  return (
    <>
      <SEO title="Terms of Service" desc="Aqua Minder terms of service." />
      <section className="py-16">
        <div className="container max-w-3xl">
          <h1 className="text-3xl font-extrabold">Terms of Service</h1>
          <p className="mt-4 text-slate-600">These Terms govern use of our services and devices. Please read carefully.</p>

          <div className="mt-6 space-y-4 text-slate-600">
            <h3 className="font-semibold">Use of Service</h3>
            <p>By using our services you agree to the terms described here, accept any fees, and comply with applicable laws.</p>

            <h3 className="font-semibold">Limitations</h3>
            <p>We provide our service “as is.” We are not liable for indirect or consequential damages.</p>

            <h3 className="font-semibold">Governing Law</h3>
            <p>These terms are governed by local laws of your jurisdiction unless otherwise agreed.</p>
          </div>
        </div>
      </section>
    </>
  );
}
