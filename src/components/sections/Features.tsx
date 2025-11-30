// src/components/sections/Features.tsx
import React from "react";
import FeaturesClient from "@/components/sections/FeaturesClient";

export default function Features() {
  return (
    <section id="features" className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <FeaturesClient />
      </div>
    </section>
  );
}
