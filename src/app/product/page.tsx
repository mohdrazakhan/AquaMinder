import React from "react";
import SEO from "@/lib/seo";
import Card from "@/components/ui/card";
import { PrimaryCTA, GhostCTA } from "@/components/ui/CTA";

export default function ProductPage() {
  return (
    <>
      <SEO title="Product" desc="Aqua Minder device specifications and features" />

      <section className="py-20">
        <div className="container grid md:grid-cols-2 gap-14 items-start">

          {/* LEFT CONTENT */}
          <div>
            <h1 className="text-4xl font-extrabold">Aqua Minder Device</h1>

            <p className="mt-4 text-lg text-slate-600">
              A compact, intelligent smart water monitoring device designed for homes, apartments,
              commercial spaces, and small businesses.
            </p>

            <div className="mt-6 flex gap-3">
              <PrimaryCTA>Buy now</PrimaryCTA>
              <GhostCTA>Download manual</GhostCTA>
            </div>

            <div className="mt-10 grid gap-4">
              <Card>
                <h3 className="font-semibold">Flow Monitoring</h3>
                <p className="mt-1 text-slate-600 text-sm">
                  High-accuracy flow sensor that tracks real-time water usage.
                </p>
              </Card>

              <Card>
                <h3 className="font-semibold">Leak Detection</h3>
                <p className="mt-1 text-slate-600 text-sm">
                  Instant push alerts when abnormal flow or pressure drop is detected.
                </p>
              </Card>

              <Card>
                <h3 className="font-semibold">Smart Analytics</h3>
                <p className="mt-1 text-slate-600 text-sm">
                  Daily, weekly & monthly consumption reports with savings recommendations.
                </p>
              </Card>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center">
            <img
              src="/images/hero-device.png"
              alt="Aqua Minder device"
              className="w-80 h-auto shadow-xl rounded-2xl"
            />
          </div>
        </div>
      </section>
    </>
  );
}
