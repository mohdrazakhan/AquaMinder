import React from "react";
import SEO from "@/lib/seo";

export default function CancellationPage() {
  return (
    <>
      <SEO title="Cancellation Policy" desc="Aqua Minder cancellation policy." />
      <section className="py-16">
        <div className="container max-w-3xl">
          <h1 className="text-3xl font-extrabold">Cancellation Policy</h1>
          <p className="mt-4 text-slate-600">
            You can cancel an order for an Aqua Minder device within 24 hours of placing it without charge. To request
            a cancellation, please contact our support team via the Contact page with your order number and email address.
          </p>

          <div className="mt-6 space-y-4 text-slate-600">
            <h3 className="font-semibold">How to Cancel</h3>
            <p>
              Send us a cancellation request through the Contact page or via the email provided. Include your order
              number and the email used for purchase. We'll confirm the cancellation by email.
            </p>

            <h3 className="font-semibold">Refunds After Cancellation</h3>
            <p>
              If a payment was already processed, refunds will be handled according to our Refund Policy and may take up
              to 10 business days to appear on your statement depending on your payment provider.
            </p>

            <h3 className="font-semibold">Shipping & Returns</h3>
            <p>
              If the item has already shipped, please follow our return instructions on the Refund page for return
              shipping and inspection procedures.
            </p>

            <h3 className="font-semibold">Contact</h3>
            <p>Questions? Use the Contact page or email support@aquaminder.example (replace with your email).</p>
          </div>
        </div>
      </section>
    </>
  );
}
