

"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="py-24 flex justify-center w-full">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center mx-auto px-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-center md:text-left">Save water. Save money. Monitor with Aqua Minder.</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-xl mx-auto md:mx-0 text-center md:text-left">Intelligent IoT water monitoring with leak alerts, consumption insights and remote shutoff integration — made for homes and small businesses.</p>
          <div className="mt-6 flex gap-3 justify-center md:justify-start">
            <Button>Pre-order device</Button>
            <Button>See demo</Button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-sm text-slate-600 text-center md:text-left">
            <div><div className="font-semibold">Real-time</div><div>Live consumption & leak alerts</div></div>
            <div><div className="font-semibold">Easy install</div><div>1-2 hour DIY or pro install</div></div>
            <div><div className="font-semibold">Secure</div><div>Encrypted cloud & local fallback</div></div>
          </div>
        </div>

        <div className="flex items-center justify-center md:justify-end h-full">
          <div className="relative w-full h-80 md:h-[540px] md:w-[540px] flex items-center justify-center">
            <Image
              src="/images/device.png"
              alt="Aqua Minder Device"
              fill
              className="object-contain animate-float"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
