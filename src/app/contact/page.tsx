
"use client";
import React, { useState } from "react";
import SEO from "@/lib/seo";

export default function ContactPage() {
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const body = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    setStatus("sending");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <>
      <SEO title="Contact" desc="Get in touch with the Aqua Minder team" />

      <section className="py-20">
        <div className="container max-w-xl">
          <h1 className="text-4xl font-extrabold">Contact Us</h1>
          <p className="mt-3 text-slate-600">
            Have questions? Need a demo? Want to become a partner?  
            Send us a message — we usually reply within 24 hours.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 grid gap-4">
            <input
              name="name"
              required
              placeholder="Full name"
              className="p-3 rounded-lg border"
            />

            <input
              name="email"
              type="email"
              required
              placeholder="Email address"
              className="p-3 rounded-lg border"
            />

            <textarea
              name="message"
              required
              rows={5}
              placeholder="Your message"
              className="p-3 rounded-lg border"
            />

            <button
              type="submit"
              className="bg-brand-500 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Send message
            </button>

            {status === "sending" && (
              <p className="text-blue-500 text-sm">Sending…</p>
            )}
            {status === "sent" && (
              <p className="text-green-600 text-sm">
                Thanks! We will get back to you shortly.
              </p>
            )}
            {status === "error" && (
              <p className="text-red-600 text-sm">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
