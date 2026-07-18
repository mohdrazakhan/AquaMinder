'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CTA() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className="w-full py-12 md:py-20 px-4 sm:px-6 bg-gradient-to-r from-sky-600 to-blue-600"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
          Ready to automate your water management?
        </motion.h2>

        <motion.p variants={itemVariants} className="text-base sm:text-lg text-sky-50 mb-6 sm:mb-8 max-w-2xl mx-auto">
          Join thousands of homes and businesses saving money and water with AquaMinder.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            href="/buy"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-sky-600 font-bold rounded-lg hover:bg-sky-50 transition-colors duration-200 shadow-lg"
          >
            Get AquaMinder Now
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
          >
            See Live Demo
          </Link>
        </motion.div>

        <motion.p variants={itemVariants} className="mt-6 sm:mt-8 text-sm text-sky-100">
          💧 Limited early bird pricing available — Pre-order today and save 30%
        </motion.p>
      </div>
    </motion.section>
  );
}
