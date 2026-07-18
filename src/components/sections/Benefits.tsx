'use client';

import { motion } from 'framer-motion';
import { Droplet, Zap, Shield, AlertCircle, TrendingDown, Clock } from 'lucide-react';

const benefits = [
  {
    icon: Droplet,
    title: 'Save Water',
    description: 'Prevent overflow and reduce waste. Automatic control ensures optimal tank usage.',
    stat: '50%',
    statLabel: 'water saved'
  },
  {
    icon: Zap,
    title: 'Save Electricity',
    description: 'No more unnecessary motor running. Smart scheduling reduces energy consumption.',
    stat: '60%',
    statLabel: 'power saved'
  },
  {
    icon: Shield,
    title: 'Protect Motor',
    description: 'Dry-run protection prevents motor damage. No more costly repairs and replacements.',
    stat: '10x',
    statLabel: 'motor lifespan'
  },
  {
    icon: AlertCircle,
    title: 'Peace of Mind',
    description: '24/7 monitoring with instant alerts. Know your water tank status anytime, anywhere.',
    stat: '24/7',
    statLabel: 'monitoring'
  },
  {
    icon: TrendingDown,
    title: 'Lower Bills',
    description: 'Automated control reduces your monthly water and electricity expenses significantly.',
    stat: '40%',
    statLabel: 'bill reduction'
  },
  {
    icon: Clock,
    title: 'No Manual Work',
    description: 'Set it and forget it. Forget about manually switching pumps on and off.',
    stat: '100%',
    statLabel: 'automatic'
  },
];

export default function Benefits() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className="w-full py-12 md:py-20 px-4 sm:px-6 bg-gradient-to-b from-slate-50 to-white"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div variants={itemVariants} className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
            Real Savings, Real Benefits
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Join thousands of users already saving money and water
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative p-5 sm:p-6 bg-white rounded-xl sm:rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

                <div className="mb-4 inline-flex p-2.5 sm:p-3 bg-sky-100 group-hover:bg-sky-200 rounded-lg transition-colors duration-300">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600" />
                </div>

                <div className="mb-3 sm:mb-4">
                  <div className="text-2xl sm:text-3xl font-bold text-sky-600 mb-1">
                    {benefit.stat}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 font-medium">
                    {benefit.statLabel}
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
