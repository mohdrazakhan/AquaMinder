'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How does AquaMinder work?',
    answer: 'AquaMinder uses sensors to monitor your water tank level and automatically controls your motor. When water level is low, it turns the motor ON. When the tank is full, it turns OFF. All data is sent to the cloud for real-time monitoring.',
  },
  {
    question: 'Is installation complicated?',
    answer: 'No! Installation is a simple 1-hour DIY process. Just mount the sensor near your tank and connect the relay to your motor. Detailed instructions and video guides are provided.',
  },
  {
    question: 'Does it work without internet?',
    answer: 'Yes! AquaMinder works fully automatically even when offline. The device stores sensor data locally and syncs to the cloud when internet is available. You just won\'t have remote monitoring until internet is restored.',
  },
  {
    question: 'What if I need manual control?',
    answer: 'You have full control! Manual buttons on the device work anytime, plus you can control your motor remotely through the web dashboard or app from anywhere in the world.',
  },
  {
    question: 'How much can I save?',
    answer: 'Most users save 50% on water usage and 60% on electricity by preventing overflow and unnecessary motor running. Savings depend on your usage patterns, but ROI typically happens within 6-12 months.',
  },
  {
    question: 'Is it secure?',
    answer: 'Yes, completely secure. All communication uses encryption, and your device can operate locally without cloud connectivity. You have full control over what data is shared.',
  },
  {
    question: 'Can I control multiple devices?',
    answer: 'Yes! Manage all your properties from one dashboard. Perfect for homeowners, landlords, or businesses with multiple water tanks.',
  },
  {
    question: 'What\'s the warranty?',
    answer: 'AquaMinder comes with a 2-year warranty covering all hardware components and 24/7 customer support via email and phone.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
      className="w-full py-12 md:py-20 px-4 sm:px-6 bg-white"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div variants={itemVariants} className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Everything you need to know about AquaMinder
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="space-y-3 sm:space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-slate-50 rounded-lg sm:rounded-xl border border-slate-200 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-sky-50 transition-colors duration-200 group"
              >
                <span className="text-left font-semibold text-slate-900 text-sm sm:text-base">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-sky-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 sm:px-6 pb-4 sm:pb-5 border-t border-slate-200 bg-white"
                >
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
