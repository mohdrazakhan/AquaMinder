import React from "react";
import SEO from "@/lib/seo";

export default function ShippingPage() {
  return (
    <>
      <SEO title="Shipping Policy" desc="Aqua Minder shipping policy." />
      <section className="py-16">
        <div className="container max-w-3xl">
          <h1 className="text-3xl font-extrabold">Shipping Policy</h1>
          <p className="mt-4 text-slate-600">
            We aim to process and ship orders within 1-3 business days. Shipping times vary by destination and the
            selected shipping method.
          </p>

          <div className="mt-6 space-y-4 text-slate-600">
            <h3 className="font-semibold">Processing Time</h3>
            <p>
              Orders are typically processed within 1–3 business days. You'll receive a confirmation email with tracking
              information once your order ships.
            </p>

            <h3 className="font-semibold">Domestic & International Shipping</h3>
            <p>
              We ship domestically and to selected international regions. International orders may be subject to customs
              fees, duties, or taxes which are the responsibility of the recipient.
            </p>

            <h3 className="font-semibold">Lost or Damaged Packages</h3>
            <p>
              If your package is lost or arrives damaged, contact support with your order number and photos of any
              damage. We'll help coordinate a replacement or refund per the Refund Policy.
            </p>

            <h3 className="font-semibold">Contact</h3>
            <p>Questions about shipping? Use the Contact page or email support@aquaminder.example (replace with your email).</p>
          </div>
        </div>
      </section>
    </>
  );
}
