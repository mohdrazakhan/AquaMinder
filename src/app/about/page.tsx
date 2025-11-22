import React from "react";
import SEO from "@/lib/seo";

export default function AboutPage() {
  return (
    <>
      <SEO title="About" desc="Learn about Aqua Minder — our mission, story, and team." />

      <section className="py-20">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-extrabold">About Aqua Minder</h1>

          <p className="mt-4 text-lg text-slate-600">
            Aqua Minder started with a simple idea: give people insight and control over
            their water usage so they can avoid damage, reduce waste, and save money.
            We build small, reliable hardware and easy software that homeowners and small businesses can trust.
          </p>

          <div className="mt-10 grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h3 className="text-xl font-semibold">Our mission</h3>
              <p className="mt-2 text-slate-600">
                To reduce water waste by making monitoring accessible and actionable — from simple leak alerts
                to long-term analytics that help you change habits.
              </p>

              <h3 className="mt-6 text-xl font-semibold">What we value</h3>
              <ul className="mt-2 text-slate-600 list-disc ml-5 space-y-2">
                <li>Reliability — hardware that lasts.</li>
                <li>Privacy — user data belongs to the user.</li>
                <li>Simplicity — easy install and clear insights.</li>
                <li>Affordability — useful tech at sensible prices.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Founder's story</h3>
              <p className="mt-2 text-slate-600">
                Built by engineers who experienced a major plumbing leak, we realised most homes lack simple,
                affordable tools to detect and prevent water damage early. Aqua Minder was born from that problem.
              </p>

              <h3 className="mt-6 text-xl font-semibold">Timeline</h3>
              <ol className="mt-2 text-slate-600 list-decimal ml-5 space-y-2">
                <li><strong>2024</strong> — Prototype and early testing.</li>
                <li><strong>2025</strong> — Pilot installs & feedback cycle.</li>
                <li><strong>2026</strong> — Public launch & first production run.</li>
              </ol>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-semibold">Team</h3>
            <p className="mt-2 text-slate-600 max-w-2xl">
              A small team of firmware, hardware, and cloud engineers. We work remotely and collaborate
              with local installers for hands-on deployment.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
