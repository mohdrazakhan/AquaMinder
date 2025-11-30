import React from "react";
import SEO from "@/lib/seo";
import { PrimaryCTA, GhostCTA } from "@/components/ui/CTA";

function TierCard({ name, price, bullets, highlight }: any) {
  return (
    <div className="border rounded-xl p-6 shadow-sm bg-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">{name}</h3>
          {price && <div className="text-sm text-slate-500 mt-1">{price}</div>}
        </div>
        {highlight && <div className="text-xs bg-sky-100 text-sky-800 px-2 py-1 rounded">Most popular</div>}
      </div>

      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        {bullets.map((b: string, i: number) => (
          <li key={i} className="flex gap-3 items-start">
            <span className="text-sky-600 mt-1">✔</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex gap-3">
        <PrimaryCTA>Buy {name.split(" ")[1] || name}</PrimaryCTA>
        <GhostCTA>Learn more</GhostCTA>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const liteBullets = [
    "Manual Motor Control (App + Web)",
    "Time Scheduling (multiple schedules)",
    "Real-time motor state & action history",
    "Push notifications for actions",
  ];

  const proBullets = [
    "All Lite features",
    "Live Water Level Monitoring (Full/High/Medium/Low/Empty)",
    "Smart Auto ON/OFF based on tank level",
    "Smart schedule + sensor logic",
    "Automatic safety alerts",
  ];

  const proPlusBullets = [
    "All Pro features",
    "Water Flow Monitoring (real-time)",
    "Dry Run Protection (auto-off on no flow)",
    "Advanced automations and premium hardware",
  ];

  return (
    <>
      <SEO title="Product" desc="AquaMinder device specifications and features" />

      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl font-extrabold">AquaMinder Device Family</h1>
              <p className="mt-4 text-lg text-slate-600">
                Choose the right model — from Lite (basic smart motor controller) to Pro and Pro+
                with advanced automation, flow monitoring and dry-run protection.
              </p>

              <div className="mt-6 flex gap-3">
                <PrimaryCTA>Buy now</PrimaryCTA>
                <GhostCTA>Download manual</GhostCTA>
              </div>
            </div>

            <div className="flex justify-center">
              <img src="/images/hero-device.png" alt="Aqua Minder" className="w-72 rounded-2xl shadow-lg" />
            </div>
          </div>

          {/* Tier cards */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <TierCard name="AquaMinder Lite" price="Basic" bullets={liteBullets} />
            <TierCard name="AquaMinder Pro" price="Recommended" bullets={proBullets} highlight />
            <TierCard name="AquaMinder Pro+" price="Premium" bullets={proPlusBullets} />
          </div>

          {/* Details */}
          <div className="mt-16 grid gap-10">
            <section>
              <h2 className="text-2xl font-bold">AquaMinder Lite — Basic Smart Motor Controller</h2>
              <p className="mt-3 text-slate-600">Ideal for: Homes, small apartments, simple overhead/borewell motor control</p>
              <ul className="mt-4 list-inside list-disc space-y-2 text-slate-700">
                <li><strong>Manual Motor Control:</strong> Turn motor ON/OFF from App & Web with instant, secure cloud control.</li>
                <li><strong>Time Scheduling:</strong> Daily / custom schedules and multiple schedule slots.</li>
                <li><strong>Cloud Dashboard:</strong> Real-time motor state and action history; add family members with permissions.</li>
                <li><strong>Push Notifications:</strong> Motor ON/OFF, Schedule executed, Manual override alerts.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold">AquaMinder Pro — Advanced Motor Controller</h2>
              <p className="mt-3 text-slate-600">Ideal for: Homes with overhead tanks; automatic tank filling and level sensing.</p>
              <ul className="mt-4 list-inside list-disc space-y-2 text-slate-700">
                <li><strong>Live Water Level Monitoring:</strong> Full / High / Medium / Low / Empty levels on App & Web.</li>
                <li><strong>Smart Auto ON/OFF:</strong> Motor runs automatically based on tank level and schedule logic.</li>
                <li><strong>Smart Schedule + Sensor Logic:</strong> Schedule checks tank before starting; avoids unnecessary runs.</li>
                <li><strong>Automatic Safety Alerts:</strong> Tank Empty/Full/Completed notifications.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold">AquaMinder Pro+ — Premium Model</h2>
              <p className="mt-3 text-slate-600">Ideal for: Borewell motors, high-rise plumbing, users needing advanced protections.</p>
              <ul className="mt-4 list-inside list-disc space-y-2 text-slate-700">
                <li><strong>Flow Monitoring:</strong> Real-time flow speed and daily/weekly pump reports.</li>
                <li><strong>Dry Run Protection:</strong> Detects no-flow and turns the motor off to protect pumps.</li>
                <li><strong>Advanced Automations:</strong> Combined level+flow logic to avoid unnecessary or dangerous runs.</li>
                <li><strong>Premium Hardware:</strong> Industrial relays, high-accuracy sensors, designed for up to 5 HP motors.</li>
              </ul>
            </section>
          </div>

          {/* Comparison table */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-4">Compare Models</h3>
            <div className="overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-sm text-slate-600">
                    <th className="p-3">Feature</th>
                    <th className="p-3">Lite</th>
                    <th className="p-3">Pro</th>
                    <th className="p-3">Pro+</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700">
                  <tr className="border-t">
                    <td className="p-3">App/Web Motor ON/OFF</td>
                    <td className="p-3">✔</td>
                    <td className="p-3">✔</td>
                    <td className="p-3">✔</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Time Scheduling</td>
                    <td className="p-3">✔</td>
                    <td className="p-3">✔</td>
                    <td className="p-3">✔</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Push Notifications</td>
                    <td className="p-3">✔</td>
                    <td className="p-3">✔</td>
                    <td className="p-3">✔</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Live Water Level</td>
                    <td className="p-3">✕</td>
                    <td className="p-3">✔</td>
                    <td className="p-3">✔</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Auto Tank Fill (level-based)</td>
                    <td className="p-3">✕</td>
                    <td className="p-3">✔</td>
                    <td className="p-3">✔</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Flow Monitoring</td>
                    <td className="p-3">✕</td>
                    <td className="p-3">✕</td>
                    <td className="p-3">✔</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Dry Run Protection</td>
                    <td className="p-3">✕</td>
                    <td className="p-3">✕</td>
                    <td className="p-3">✔</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
