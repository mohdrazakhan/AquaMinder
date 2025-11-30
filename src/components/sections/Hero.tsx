// src/components/sections/Hero.tsx
import React from "react";
import HeroClient from "@/components/hero/HeroClient";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-20">
          <div className="lg:col-span-7">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
              Save water. Save money. <br />
              Monitor with <span className="text-sky-600">Aqua Minder</span>.
            </h1>

            <p className="mt-6 text-lg text-slate-600 max-w-2xl">
              Intelligent IoT water monitoring with leak alerts, consumption insights and remote shutoff — made for homes and small businesses. Real-time data, local fallback and smart automations.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/buy" className="inline-flex items-center rounded-lg bg-sky-500 hover:bg-sky-600 text-white px-5 py-3 font-semibold shadow">
                Pre-order device
              </Link>

              <Link href="/demo" className="inline-flex items-center rounded-lg border px-5 py-3 text-slate-700 bg-white hover:bg-slate-50">
                See demo
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="font-semibold text-slate-900">Real-time</div>
                <div className="text-slate-600 mt-1">Live consumption & leak alerts</div>
              </div>
              <div>
                <div className="font-semibold text-slate-900">Easy install</div>
                <div className="text-slate-600 mt-1">1–2 hour DIY or pro install</div>
              </div>
              <div>
                <div className="font-semibold text-slate-900">Secure</div>
                <div className="text-slate-600 mt-1">Encrypted cloud & device fallback</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            {/* Client animated hero image */}
            <HeroClient imageSrc="/images/device.png" alt="Aqua Minder device" />
          </div>
        </div>
      </div>
    </section>
  );
}
