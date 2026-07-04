// src/components/sections/Features.tsx
import React from "react";
import FeaturesClient from "@/components/sections/FeaturesClient";

export default function Features() {
  return (
    <section id="features" className="bg-white py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <FeaturesClient />
      </div>
    </section>
  );
}
