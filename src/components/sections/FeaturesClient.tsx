// src/components/sections/FeaturesClient.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * Inline SVG illustrations (simple, crisp vector illustrations).
 * You can replace these with different SVGs later — they are small and optimized.
 */

function SvgLeakAlert() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0" stopColor="#06b6d4" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="18" fill="#f8fafc" />
      <g transform="translate(20,20)">
        <path d="M40 5c-6 8-18 18-18 30 0 12 10 22 18 28 8-6 18-16 18-28 0-12-12-22-18-30z" fill="url(#g1)"/>
        <circle cx="36" cy="52" r="4" fill="#fff" fillOpacity="0.8"/>
      </g>
    </svg>
  );
}

function SvgInsights() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
      <rect width="120" height="120" rx="18" fill="#f8fafc" />
      <g transform="translate(18,18)">
        <rect x="0" y="44" width="14" height="28" rx="2" fill="#60a5fa" />
        <rect x="20" y="28" width="14" height="44" rx="2" fill="#34d399" />
        <rect x="40" y="12" width="14" height="60" rx="2" fill="#f472b6" />
        <rect x="60" y="36" width="14" height="36" rx="2" fill="#f59e0b" />
        <rect x="80" y="52" width="14" height="20" rx="2" fill="#06b6d4" />
      </g>
    </svg>
  );
}

function SvgShutoff() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
      <rect width="120" height="120" rx="18" fill="#f8fafc" />
      <g transform="translate(20,20)">
        <circle cx="40" cy="30" r="20" fill="#fb7185" />
        <rect x="30" y="46" width="20" height="24" rx="3" fill="#ef4444" />
        <path d="M28 35 L52 35" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

function SvgSchedule() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
      <rect width="120" height="120" rx="18" fill="#f8fafc" />
      <g transform="translate(20,20)">
        <rect x="0" y="6" width="72" height="50" rx="6" fill="#fff" stroke="#e6eefc"/>
        <circle cx="36" cy="32" r="10" fill="#06b6d4" />
        <path d="M36 28 v8 h6" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

function SvgFallback() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
      <rect width="120" height="120" rx="18" fill="#f8fafc" />
      <g transform="translate(22,22)">
        <rect x="0" y="6" width="54" height="32" rx="6" fill="#fff" stroke="#eef2ff"/>
        <path d="M5 42 h44" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
        <circle cx="10" cy="18" r="4" fill="#34d399" />
        <circle cx="24" cy="18" r="4" fill="#f59e0b" />
        <circle cx="38" cy="18" r="4" fill="#fb7185" />
      </g>
    </svg>
  );
}

function SvgMulti() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
      <rect width="120" height="120" rx="18" fill="#f8fafc" />
      <g transform="translate(12,20)">
        <rect x="0" y="14" width="36" height="28" rx="4" fill="#60a5fa" />
        <rect x="44" y="6" width="36" height="36" rx="4" fill="#34d399" />
      </g>
    </svg>
  );
}

/* --- Feature data --- */
const FEATURES = [
  {
    id: "leak",
    title: "Dry Run Protection",
    subtitle: "Protect your pump",
    desc: "Automatically detects when your motor is running without water and instantly shuts it off, preventing motor burnout and costly repairs.",
    Illustration: SvgLeakAlert,
  },
  {
    id: "insights",
    title: "Live Level & Temp Monitoring",
    subtitle: "Real-time tank sensing",
    desc: "Monitor your exact water tank levels via precise probe sensors, alongside real-time water temperature, right from your dashboard.",
    Illustration: SvgInsights,
  },
  {
    id: "shutoff",
    title: "Remote Motor Control",
    subtitle: "Control from anywhere",
    desc: "Manually turn your single-phase AC water pump ON or OFF from anywhere in the world using the Aqua Minder mobile or web app.",
    Illustration: SvgShutoff,
  },
  {
    id: "schedule",
    title: "Smart Scheduling",
    subtitle: "Supply-aware automation",
    desc: "Automatically run the motor when water supply is available or based on tank level. Templates make setup one-click easy.",
    Illustration: SvgSchedule,
  },
  {
    id: "fallback",
    title: "Local + Cloud Fallback",
    subtitle: "Works offline, reliably",
    desc: "Important automation runs on-device even if internet is down. Cloud adds history and remote control — the best of both worlds.",
    Illustration: SvgFallback,
  },
  {
    id: "multi",
    title: "Multi-location Dashboard",
    subtitle: "Manage multiple properties",
    desc: "A single dashboard to track and control devices across homes, offices or rental properties. Role-based access for teams and tenants.",
    Illustration: SvgMulti,
  },
];

/* --- Animation variants --- */
const containerVariant = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55 } },
};

const illustrationVariant = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6 } },
};

export default function FeaturesClient() {
  return (
    <div>
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Smart features that actually help
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          Aqua Minder combines powerful hardware with intelligent software to protect your home and save water.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10">
        {FEATURES.map((f, idx) => {
          const Illustration = f.Illustration;
          const isEven = idx % 2 === 1; // alternate layout for visual variety
          return (
            <div
              key={f.id}
              className="relative bg-white rounded-3xl border border-slate-200 overflow-hidden"
            >

              <div className={`relative z-10 p-8 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center ${isEven ? "md:flex-row-reverse" : ""}`}>
                {/* Illustration column */}
                <div className={`md:col-span-5 flex justify-center items-center ${isEven ? "md:order-last" : ""}`}>
                  <div className="w-full max-w-[260px] md:max-w-[300px] mx-auto md:mx-0">
                    <Illustration />
                  </div>
                </div>

                {/* Text column */}
                <div className="md:col-span-7">
                  <div className="inline-block px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-xs font-bold uppercase tracking-wider mb-4 border border-sky-100">
                    {f.subtitle}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                    {f.title}
                  </h3>
                  <p className="mt-4 text-slate-600 leading-relaxed text-lg">
                    {f.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
