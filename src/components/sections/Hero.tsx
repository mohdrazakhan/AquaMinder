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
    <section className="relative overflow-hidden bg-white text-slate-900 lg:min-h-[80vh] flex items-center">
      {/* Subtle Light Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-slate-50 blur-[120px]"></div>
        <div className="absolute top-40 -left-20 w-[500px] h-[500px] rounded-full bg-slate-50 blur-[100px]"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 sm:pb-24 lg:pb-32 lg:pt-8 z-10"
      >
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Text Content */}
          <div className="text-center lg:text-left z-10 flex flex-col items-center lg:items-start w-full">
            
            {/* 1. Badge on Top */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 mb-6 lg:mb-8 shadow-sm">
              <span className="flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
              </span>
              <span className="text-sm font-medium text-slate-600">Aqua Minder v1.8 is live</span>
            </motion.div>

            {/* 2. Mobile Image (between badge and title) */}
            <motion.div 
              variants={itemVariants}
              className="flex lg:hidden z-10 justify-center w-full mb-8"
            >
              <div className="w-48 h-48 relative drop-shadow-xl transform hover:scale-105 transition-transform">
                <HeroClient imageSrc="/images/device.png" alt="Aqua Minder device" />
              </div>
            </motion.div>

            {/* 3. Tagline and Info */}
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Smarter water. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
                Automated supply.
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="mt-4 sm:mt-6 text-base sm:text-xl text-slate-600 max-w-xl leading-relaxed">
              Intelligent IoT water automation with live tank level monitoring, smart motor scheduling, and dry run protection to automate your supply and protect your pump.
            </motion.p>

            {/* 4. Buttons (Side-by-side on mobile) */}
            <motion.div variants={itemVariants} className="mt-8 sm:mt-10 flex flex-row gap-3 sm:gap-5 w-full lg:w-auto">
              <Link href="/buy" className="flex-1 lg:flex-none flex justify-center items-center gap-1 sm:gap-2 rounded-xl bg-slate-900 text-white px-3 sm:px-8 py-3 sm:py-4 text-[13px] sm:text-base font-bold shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl active:translate-y-0 group">
                Pre-order now
                <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <Link href="/demo" className="flex-1 lg:flex-none flex justify-center items-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 sm:px-8 py-3 sm:py-4 text-[13px] sm:text-base font-semibold shadow-sm transition-all hover:-translate-y-1">
                See live demo
              </Link>
            </motion.div>

            {/* Feature Cards */}
            <motion.div variants={itemVariants} className="mt-12 sm:mt-16 grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm w-full">
              <div className="bg-white rounded-2xl p-3 sm:p-5 border border-slate-200 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="font-bold text-slate-900 flex items-center justify-center lg:justify-start gap-2 text-sm sm:text-base">
                  <svg className="w-5 h-5 text-sky-500 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Real-time
                </div>
                <div className="text-slate-500 mt-1 sm:mt-2 text-[10px] sm:text-sm leading-tight">Live sync & alerts</div>
              </div>

              <div className="bg-white rounded-2xl p-3 sm:p-5 border border-slate-200 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="font-bold text-slate-900 flex items-center justify-center lg:justify-start gap-2 text-sm sm:text-base">
                  <svg className="w-5 h-5 text-sky-500 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Easy install
                </div>
                <div className="text-slate-500 mt-1 sm:mt-2 text-[10px] sm:text-sm leading-tight">1-hour DIY setup</div>
              </div>

              <div className="bg-white rounded-2xl p-3 sm:p-5 border border-slate-200 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="font-bold text-slate-900 flex items-center justify-center lg:justify-start gap-2 text-sm sm:text-base">
                  <svg className="w-5 h-5 text-sky-500 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure
                </div>
                <div className="text-slate-500 mt-1 sm:mt-2 text-[10px] sm:text-sm leading-tight">Local + Cloud</div>
              </div>
            </motion.div>
          </div>

          {/* 5. Desktop Image (Hidden on mobile) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="hidden lg:flex z-10 justify-end relative group"
          >
            <div className="relative transform transition-transform duration-700 hover:scale-105 hover:-rotate-1 drop-shadow-2xl">
              <HeroClient imageSrc="/images/device.png" alt="Aqua Minder device" />
            </div>
          </motion.div>
          
        </div>
      </motion.div>
    </section>
  );
}
