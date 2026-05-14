'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileSignature, AlertCircle, RefreshCw, Handshake, Scale, CreditCard } from 'lucide-react';

export default function TermsPage() {
  const lastUpdated = "May 14, 2026";

  const terms = [
    {
      title: "Marketplace Usage Terms",
      icon: <Scale className="w-5 h-5 text-indigo-600" />,
      content: "TATAmart provides a B2B platform connecting verified enterprise buyers with certified manufacturing facilities. Usage of this platform is restricted to registered corporate entities undergoing our strict KYC/KYB vetting process."
    },
    {
      title: "Buyer Policies",
      icon: <Handshake className="w-5 h-5 text-indigo-600" />,
      content: "Buyers are legally bound to honor RFQ contracts once digitally signed and accepted by a supplier. Canceling an accepted order after production has commenced may result in platform penalties and legal arbitration."
    },
    {
      title: "Seller & RFQ Policies",
      icon: <RefreshCw className="w-5 h-5 text-indigo-600" />,
      content: "Sellers must maintain an SLA of 98% accuracy on inventory states and lead times. Any deviation from the quoted specifications or delivery schedules in an RFQ must be communicated and resolved through the TATAmart dispute center."
    },
    {
      title: "Payment & Escrow Terms",
      icon: <CreditCard className="w-5 h-5 text-indigo-600" />,
      content: "All high-volume transactions are processed through our secure B2B escrow system. Funds are released to the supplier only upon the buyer's digital confirmation of receipt and quality inspection, or after the standard 14-day clearance window."
    },
    {
      title: "Legal Disclaimers",
      icon: <AlertCircle className="w-5 h-5 text-indigo-600" />,
      content: "TATAmart acts solely as an intermediary matching engine. We do not assume liability for product quality defects, supply chain delays, or intellectual property disputes between transacting parties. All arbitration must follow the ICC guidelines."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#09090b] pt-32 pb-24 text-zinc-900 dark:text-zinc-50">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <div className="mb-16 text-center sm:text-left border-b border-zinc-200 dark:border-zinc-800 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-zinc-100 dark:bg-zinc-900 px-4 py-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-6 border border-zinc-200 dark:border-zinc-800"
          >
            <FileSignature className="h-4 w-4" />
            <span>Legal Documentation</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight mb-6"
          >
            Terms of Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl"
          >
            These terms govern your use of the TATAmart enterprise procurement platform. By accessing our services, you agree to these corporate guidelines.
          </motion.p>
          <p className="mt-4 text-sm text-zinc-400">Effective Date: {lastUpdated}</p>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-10"
        >
          {terms.map((term, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
              <div className="flex-shrink-0 p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
                {term.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">{term.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[17px]">
                  {term.content}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Agreement Footer */}
        <div className="mt-20 pt-10 border-t border-zinc-200 dark:border-zinc-800 text-center">
          <p className="text-zinc-500 dark:text-zinc-400">
            For specific enterprise SLA agreements or custom contract negotiations, please consult your assigned account manager.
          </p>
        </div>
      </div>
    </div>
  );
}
