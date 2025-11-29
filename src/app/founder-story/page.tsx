"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Small typewriter hook used for the storytelling intro
function useTypewriter(text: string, speed: number = 40) {
  const [out, setOut] = useState("");
  useEffect(() => {
    let i = 0;
    setOut("");
    const t = setInterval(() => {
      setOut((s) => s + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return out;
}

export default function FounderStoryPage() {
  const lines = [
    "In a shared flat in Greater Noida, two engineering friends wrestled with a daily problem:",
    "water that arrives on a schedule — and the stress that comes when the pump is forgotten.",
  ];

  const [step, setStep] = useState(0);
  const typed = useTypewriter(lines[Math.min(step, lines.length - 1)], 28);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, lines.length)), 3200);
    return () => clearInterval(id);
  }, []);

  const reveal = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white py-20">
      <div className="container mx-auto px-6 lg:px-8">
        {/* HERO */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <motion.h1
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold leading-tight"
            >
              How AquaMinder started — a short & human story
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-6 text-lg text-slate-600 max-w-2xl"
            >
              {typed}
              <span className="inline-block w-1 h-6 align-middle bg-slate-700 ml-2 animate-pulse" />
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 flex gap-4"
            >
              <a href="/contact" className="px-4 py-2 bg-sky-600 text-white rounded-md">Request a pilot</a>
              <a href="/team" className="px-4 py-2 border rounded-md text-slate-700">Meet the team</a>
            </motion.div>
          </div>

          <div className="lg:col-span-5">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 90, damping: 14 }}
              className="w-full max-w-md mx-auto"
            >
              <div className="p-6 bg-white rounded-2xl shadow-lg flex items-center gap-4">
               
                <div>
                  <div className="text-sm text-slate-500">Founder</div>
                  <div className="mt-1 font-semibold">Mohd. Raza Khan</div>
                  <div className="text-xs text-slate-400 mt-1">Computer Science Engineer</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* STORY TIMELINE */}
        <div className="mt-16 max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ show: { transition: { staggerChildren: 0.18 } } }}
            className="space-y-8"
          >
            <motion.div variants={reveal} className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">1</div>
                </div>
                <div>
                  <h4 className="font-semibold">The everyday problem</h4>
                  <p className="mt-2 text-slate-600">Shared flat. Scheduled water. A forgotten pump meant a whole day without water. Small friction — big frustration.</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={reveal} className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">2</div>
                </div>
                <div>
                  <h4 className="font-semibold">A small idea becomes a prototype</h4>
                  <p className="mt-2 text-slate-600">They built a tiny controller that could reliably start/stop the motor and report status to the cloud — so forgetting the pump stopped being a disaster.</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={reveal} className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">3</div>
                </div>
                <div>
                  <h4 className="font-semibold">From friends to founders</h4>
                  <p className="mt-2 text-slate-600">Pilot installs, feedback loops, and one clear ambition: make dependable water control accessible and private. AquaMinder was born.</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={reveal} className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">4</div>
                </div>
                <div>
                  <h4 className="font-semibold">What matters most</h4>
                  <ul className="mt-2 text-slate-600 list-disc pl-5 space-y-1">
                    <li>Reliability that works in real homes.</li>
                    <li>Privacy — telemetry belongs to the user.</li>
                    <li>Simple installs and straightforward pricing.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* VISUAL INTERLUDE - animated droplet + stats */}
        <div className="mt-16">
          <div className="bg-sky-50 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="flex items-center gap-6">
              <div className="w-28 h-28 flex items-center justify-center">
              </div>

              <div>
                <div className="text-sm text-slate-500">Since the pilot</div>
                <div className="mt-1 text-3xl font-extrabold">20+ devices</div>
                <div className="text-sm text-slate-600">installed with certified local partners</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold">20+</div>
                <div className="text-sm text-slate-500">Devices</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">1k</div>
                <div className="text-sm text-slate-500">Daily alerts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">India</div>
                <div className="text-sm text-slate-500">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">2</div>
                <div className="text-sm text-slate-500">Founders</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-lg shadow-sm"
          >
            <h3 className="text-xl font-semibold">Want to bring AquaMinder to your home?</h3>
            <p className="mt-2 text-slate-600">Apply for a pilot or request a demo — our team runs installs with certified partners.</p>
            <div className="mt-4 flex justify-center gap-4">
              <a href="/contact" className="px-5 py-2 bg-sky-600 text-white rounded-md">Request a demo</a>
              <a href="/pilot" className="px-5 py-2 border rounded-md">Apply for pilot</a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Small decorative styles for subtle motion - you can move these to your global css */}
      <style>{`
        .animate-fade-up { animation: fadeUp .8s ease both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px);} to { opacity:1; transform: translateY(0);} }
      `}</style>
    </div>
  );
}
