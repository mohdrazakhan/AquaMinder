"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

/* Animation variants */
const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export default function FounderStory() {
  return (
    <section className="relative py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-0">
        
        {/* Animated content */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="prose prose-slate max-w-none text-slate-800"
        >
          <motion.h1
            variants={item}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6"
          >
            Founder’s Story — How Aqua Minder Was Born
          </motion.h1>

          <motion.p variants={item} className="text-lg leading-relaxed">
            I didn’t come up with Aqua Minder in a meeting room or a startup workshop.
            It started in a small shared flat in Greater Noida — four engineering
            students, one water motor, and a daily chaos none of us could escape.
          </motion.p>

          <motion.p variants={item}>
            Life in that flat was full of jokes, late-night coding sessions, Maggi
            at 2 AM, and dreams that felt too big for the walls we lived in.
          </motion.p>

          <motion.h3 variants={item} className="font-semibold text-2xl mt-10">
            The water supply timing
          </motion.h3>

          <motion.p variants={item}>
            In our area, water came only twice a day:
            <strong> 6:30 AM – 8:30 AM</strong> and
            <strong> 7:30 PM – 9:30 PM.</strong>
            Missing the timing meant your entire day was affected.
          </motion.p>

          <motion.div
            variants={item}
            className="bg-slate-50 border border-slate-200 p-4 rounded-lg italic text-slate-700 shadow-sm"
          >
            Every morning, before even brushing our teeth, someone asked:
            <div className="mt-2 font-semibold">
              “Bhai, motor chalayi kya?” — “Bro, did you turn on the motor?”
            </div>
          </motion.div>

          <motion.p variants={item} className="mt-4">
            Most days the answer was either:
          </motion.p>

          <motion.ul variants={item} className="list-disc pl-6 text-slate-700">
            <li>“Oh no… I overslept.”</li>
            <li>“I thought you were doing it today.”</li>
            <li>“Wait, is the motor still running!?”</li>
          </motion.ul>

          <motion.p variants={item}>
            Sometimes the tank stayed empty. Sometimes it overflowed.
            Sometimes it led to arguments that could’ve been avoided.
            What started as a small inconvenience slowly became a daily stress.
          </motion.p>

          <motion.h3 variants={item} className="font-semibold text-2xl mt-10">
            A single spark
          </motion.h3>

          <motion.p variants={item} className="italic">
            One night, after another debate about “Who forgot the motor?”, I lay
            awake thinking:
            <br />
            <strong>“Why are four engineering students still fighting over a water motor?”</strong>
          </motion.p>

          <motion.h3 variants={item} className="font-semibold text-2xl mt-10">
            From frustration to a prototype
          </motion.h3>

          <motion.p variants={item}>
            Curiosity became a project. The project became an obsession.
            Between classes, late nights, and weekends, I worked on a prototype —
            failing, learning, trying again.
          </motion.p>

          <motion.div
            variants={item}
            className="bg-gradient-to-r from-sky-50 to-white p-5 rounded-xl shadow-sm mt-4"
          >
            <h4 className="font-semibold">The first version could:</h4>
            <ul className="list-disc pl-5 mt-2 text-slate-700">
              <li>Automatically turn the motor ON/OFF</li>
              <li>Allow manual override any time</li>
              <li>Prevent shortage & overflow</li>
              <li>Work reliably without supervision</li>
            </ul>
          </motion.div>

          <motion.p variants={item} className="mt-4">
            We installed it in our flat. For the first time in months — no stress,
            no fights, no missed timings. It just worked.
          </motion.p>

          <motion.h3 variants={item} className="font-semibold text-2xl mt-10">
            A mission, not just a project
          </motion.h3>

          <motion.p variants={item}>
            When I realised how many households face this daily struggle,
            Aqua Minder stopped being a college project and became a purpose —
            a way to simplify everyday life and prevent water wastage.
          </motion.p>

          <motion.p variants={item} className="font-semibold mt-4">
            — Mohd. Raza Khan, Founder of Aqua Minder
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
