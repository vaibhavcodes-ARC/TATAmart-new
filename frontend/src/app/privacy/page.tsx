'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, FileText, Globe, Server, CheckCircle2 } from 'lucide-react';

export default function PrivacyPage() {
  const lastUpdated = "May 14, 2026";

  const sections = [
    {
      title: "Data Collection & Usage",
      icon: <Server className="w-6 h-6 text-brand-primary" />,
      content: "As an enterprise B2B platform, TATAmart collects procurement behavioral data, corporate identification metrics, and transactional history to optimize your supply chain matching. We do not sell your proprietary manufacturing data to third parties."
    },
    {
      title: "Security & Encryption",
      icon: <Lock className="w-6 h-6 text-brand-primary" />,
      content: "All RFQ transmissions, contract documents, and payment gateways are secured using military-grade AES-256 encryption. We adhere to stringent zero-trust architecture protocols to ensure your intellectual property remains confidential."
    },
    {
      title: "GDPR & Global Compliance",
      icon: <Globe className="w-6 h-6 text-brand-primary" />,
      content: "Our infrastructure is fully compliant with GDPR, CCPA, and global enterprise data protection regulations. You have the right to request data portability, complete erasure, or audit trails of your organization's activity at any time."
    },
    {
      title: "Cookie Policy",
      icon: <FileText className="w-6 h-6 text-brand-primary" />,
      content: "We use essential cookies to maintain secure sessions and performance cookies to analyze platform latency. You can manage your preferences through your enterprise dashboard settings."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#09090b] pt-32 pb-24 text-zinc-900 dark:text-zinc-50">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <div className="mb-16 text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary mb-6 border border-brand-primary/20"
          >
            <Shield className="h-3 w-3" />
            <span>Enterprise Trust Center</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight mb-4"
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-500 dark:text-zinc-400 font-medium"
          >
            Last updated: {lastUpdated}
          </motion.p>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-12"
        >
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-900/50 p-8 sm:p-10 rounded-[2rem] border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold">{section.title}</h2>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
                {section.content}
              </p>
            </div>
          ))}

          {/* Contact Section */}
          <div className="mt-16 p-8 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
            <h3 className="text-xl font-bold mb-4">Privacy Concerns or Data Requests?</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-lg mx-auto">
              Our Data Protection Officer (DPO) is available to assist you with any enterprise compliance inquiries.
            </p>
            <a href="mailto:privacy@tatamart.com" className="inline-flex items-center justify-center bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold py-3 px-8 rounded-full transition-transform hover:scale-105">
              Contact Privacy Team
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
