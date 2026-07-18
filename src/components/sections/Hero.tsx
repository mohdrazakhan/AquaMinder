"use client";

import React from "react";
import HeroClient from "@/components/hero/HeroClient";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white text-slate-900 min-h-screen lg:min-h-[90vh] flex items-center">
      {/* Subtle Light Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-sky-100 blur-[120px] opacity-40"></div>
        <div className="absolute top-40 -left-20 w-[500px] h-[500px] rounded-full bg-blue-50 blur-[100px] opacity-30"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 z-10 w-full"
      >
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
          
          {/* Text Content */}
          <div className="text-center lg:text-left z-10 flex flex-col items-center lg:items-start w-full order-2 lg:order-1">
            
            {/* 1. Badge on Top */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-100 border border-blue-300 mb-4 sm:mb-6 lg:mb-8 shadow-sm">
              <span className="flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
              </span>
              <span className="text-xs sm:text-sm font-medium text-sky-700">Smart Water Management System</span>
            </motion.div>

            {/* 3. Tagline and Info */}
            <motion.h1 variants={itemVariants} className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Automatic Water
              <span className="block text-sky-600">Tank Control</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="mt-3 sm:mt-4 lg:mt-6 text-base sm:text-lg lg:text-xl text-slate-600 max-w-xl leading-relaxed">
              Stop worrying about overflowing tanks and wasted electricity. AquaMinder monitors your water level 24/7 and automatically controls your motor.
            </motion.p>

            {/* Key Benefits */}
            <motion.div variants={itemVariants} className="mt-6 sm:mt-8 space-y-3 w-full">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm sm:text-base text-slate-700">No more tank overflows or dry motor running</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm sm:text-base text-slate-700">Remote control from your smartphone</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm sm:text-base text-slate-700">Save up to 50% on water and electricity</span>
              </div>
            </motion.div>

            {/* 4. Buttons (Stacked on mobile) */}
            <motion.div variants={itemVariants} className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Link href="/buy" className="flex justify-center items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl active:translate-y-0 group">
                Pre-order now
                <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <Link href="/demo" className="flex justify-center items-center rounded-xl border-2 border-sky-600 bg-white hover:bg-sky-50 text-sky-600 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold shadow-sm transition-all hover:-translate-y-1">
                See live demo
              </Link>
            </motion.div>

            {/* Feature Cards - Mobile optimized */}
            <motion.div variants={itemVariants} className="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm w-full">
              <div className="bg-white rounded-lg p-3 sm:p-4 border border-slate-200 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-col items-center text-center">
                <div className="font-bold text-slate-900 text-base sm:text-lg mb-1">24/7</div>
                <div className="text-slate-600 text-xs sm:text-sm leading-tight">Monitoring</div>
              </div>

              <div className="bg-white rounded-lg p-3 sm:p-4 border border-slate-200 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-col items-center text-center">
                <div className="font-bold text-slate-900 text-base sm:text-lg mb-1">Automatic</div>
                <div className="text-slate-600 text-xs sm:text-sm leading-tight">Control</div>
              </div>

              <div className="bg-white rounded-lg p-3 sm:p-4 border border-slate-200 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-col items-center text-center">
                <div className="font-bold text-slate-900 text-base sm:text-lg mb-1">50% Save</div>
                <div className="text-slate-600 text-xs sm:text-sm leading-tight">Water & Power</div>
              </div>
            </motion.div>
          </div>

          {/* Mobile Image (shown on all screens) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full flex justify-center order-1 lg:order-2 lg:justify-end"
          >
            <div className="w-full max-w-xs sm:max-w-sm lg:max-w-lg relative drop-shadow-2xl">
              <HeroClient imageSrc="/images/device.png" alt="Aqua Minder device" />
            </div>
          </motion.div>
          
        </div>
      </motion.div>
    </section>
  );
}
