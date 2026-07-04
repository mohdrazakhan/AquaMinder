// src/components/hero/HeroClient.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

type Props = {
  imageSrc?: string;
  alt?: string;
};

export default function HeroClient({ imageSrc = "/images/device.png", alt = "Aqua Minder device" }: Props) {
  return (
    <div className="flex justify-center lg:justify-end">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ scale: 1.03 }}
        className="w-full max-w-[520px] md:max-w-[640px] cursor-pointer relative"
      >
        {/* Subtle glow effect behind the device */}
        <div className="absolute inset-0 bg-sky-400 blur-[80px] opacity-20 rounded-full z-0 pointer-events-none" />
        
        {/* Floating animation */}
        <motion.img
          src={imageSrc}
          alt={alt}
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="relative z-10 block w-full h-auto object-contain bg-transparent p-0 filter drop-shadow-[0_20px_50px_rgba(8,112,184,0.25)]"
        />
      </motion.div>
    </div>
  );
}
