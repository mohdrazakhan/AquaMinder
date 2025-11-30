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
        whileHover={{ scale: 1.04, y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full max-w-[520px] md:max-w-[640px] cursor-pointer"
      >
        {/* Image displayed without the white background box; larger and with hover animation */}
        <img
          src={imageSrc}
          alt={alt}
          className="block w-full h-auto object-contain bg-transparent p-0 filter drop-shadow-2xl"
        />
      </motion.div>
    </div>
  );
}

