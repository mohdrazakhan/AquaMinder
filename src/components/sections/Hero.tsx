// src/components/sections/Hero.tsx
import React from "react";
import HeroClient from "@/components/hero/HeroClient";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white text-slate-900 min-h-[90vh] flex items-center">
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          <div className="text-center lg:text-left z-10 flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 mb-8">
              <span className="flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
              </span>
              <span className="text-sm font-medium text-slate-600">Aqua Minder v1.6 is live</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Smarter water. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">Simpler living.</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-xl leading-relaxed">
              Intelligent IoT water monitoring with real-time leak alerts, smart scheduling, and auto shut-off to save water and protect your home.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/buy" className="group inline-flex justify-center items-center gap-2 rounded-xl bg-slate-900 text-white px-8 py-4 font-bold transition-all hover:-translate-y-1 active:translate-y-0">
                Pre-order now
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <Link href="/demo" className="inline-flex justify-center items-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 font-semibold transition-all hover:-translate-y-1">
                See live demo
              </Link>
            </div>

            <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm w-full">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 transition-all hover:-translate-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-center lg:justify-start gap-2 text-base">
                  <span className="text-sky-500">⚡</span> Real-time
                </div>
                <div className="text-slate-500 mt-2 text-center lg:text-left">Live sync & instant alerts</div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-200 transition-all hover:-translate-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-center lg:justify-start gap-2 text-base">
                  <span className="text-sky-500">🛠️</span> Easy install
                </div>
                <div className="text-slate-500 mt-2 text-center lg:text-left">Quick 1-hour DIY setup</div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-200 transition-all hover:-translate-y-1 col-span-2 sm:col-span-1">
                <div className="font-bold text-slate-900 flex items-center justify-center lg:justify-start gap-2 text-base">
                  <span className="text-sky-500">🛡️</span> Secure
                </div>
                <div className="text-slate-500 mt-2 text-center lg:text-left">Local memory + Cloud</div>
              </div>
            </div>
          </div>

          <div className="z-10 flex justify-center lg:justify-end relative group">
            <div className="relative transform transition-transform duration-700 hover:scale-105 hover:-rotate-1">
              <HeroClient imageSrc="/images/device.png" alt="Aqua Minder device" />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
