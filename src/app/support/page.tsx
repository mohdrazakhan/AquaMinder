import React from "react";
import SEO from "@/lib/seo";
import Link from "next/link";

export default function SupportPage() {
  return (
    <>
      <SEO title="Support" desc="Get help and support for Aqua Minder" />
      <section className="py-12">
        <div className="container grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl font-extrabold">Support</h1>
            <p className="mt-3 text-slate-600">Need help with setup, installation, or your device? We’re here to help.</p>

            <div className="mt-6 space-y-3">
              <div>
                <h4 className="font-semibold">Email support</h4>
                <p className="text-slate-600">support@aquaminder.example</p>
              </div>

              <div>
                <h4 className="font-semibold">Documentation</h4>
                <p className="text-slate-600"><Link href="/docs">Open docs →</Link></p>
              </div>

              <div>
                <h4 className="font-semibold">FAQ</h4>
                <p className="text-slate-600"><Link href="/faq">Frequently asked questions →</Link></p>
              </div>
            </div>
          </div>

          <div>
            <img src="/images/support-hero.png" alt="Support" className="w-full rounded-2xl shadow-lg object-cover" />
          </div>
        </div>
      </section>
    </>
  );
}
