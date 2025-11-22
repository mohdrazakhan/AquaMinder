import React from "react";
import SEO from "@/lib/seo";

export default function RefundPage() {
  return (
    <>
      <SEO title="Refund Policy" desc="Aqua Minder refund policy" />
      <section className="py-16">
        <div className="container max-w-3xl">
          <h1 className="text-3xl font-extrabold">Refund Policy</h1>
          <p className="mt-4 text-slate-600">We want you to be happy with your purchase. This page describes refund conditions.</p>

          <div className="mt-6 space-y-4 text-slate-600">
            <h3 className="font-semibold">Hardware Returns</h3>
            <p>30-day return window from delivery. Items must be in original condition and packaging. Shipping costs may apply.</p>

            <h3 className="font-semibold">Subscriptions</h3>
            <p>Monthly subscriptions can be cancelled at any time. No refunds for partial months unless required by law.</p>

            <h3 className="font-semibold">Contact</h3>
            <p>To request a refund, contact support@aquaminder.example with your order details.</p>
          </div>
        </div>
      </section>
    </>
  );
}
