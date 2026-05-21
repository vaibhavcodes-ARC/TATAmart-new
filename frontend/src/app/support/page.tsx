'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LifeBuoy, Book, MessageSquare, Ticket, ChevronDown, Send } from 'lucide-react';

export default function SupportPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // categories list intentionally inlined below where used

  const faqs = [
    {
      q: "How do I upgrade my buyer account to Enterprise tier?",
      a: "Enterprise tier upgrades require a manual verification of your corporate financial statements and procurement volume. Please submit a ticket with your DUNS number and our compliance team will initiate the upgrade protocol within 24 hours."
    },
    {
      q: "What is the standard SLA for vendor responses on RFQs?",
      a: "Our certified suppliers are mandated to respond to targeted RFQs within 4 hours during standard business days. Global open RFQs may take up to 48 hours for comprehensive multi-vendor bid aggregation."
    },
    {
      q: "How does the TATAmart Escrow system protect my capital?",
      a: "Funds are held in a secure, neutral corporate bank node until you physically receive the inventory and digitally sign the Quality Assurance (QA) release form on your dashboard. If a dispute arises, the funds remain frozen until arbitration concludes."
    },
    {
      q: "Can I integrate TATAmart via API into my existing ERP?",
      a: "Yes. Enterprise tier users gain access to our GraphQL and REST APIs. You can generate API keys from your dashboard settings to sync inventory, RFQs, and order statuses directly into SAP, Oracle, or custom ERP solutions."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#09090b] pt-32 pb-24 text-zinc-900 dark:text-zinc-50">
      
      {/* Search Header */}
      <div className="bg-brand-primary dark:bg-zinc-900 absolute top-0 left-0 right-0 h-[450px] z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fafafc] dark:from-[#09090b] to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center pt-10 pb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight"
          >
            How can we help your enterprise?
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto relative shadow-2xl rounded-full"
          >
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 w-6 h-6" />
            <input 
              type="text" 
              placeholder="Search documentation, RFQ guides, or error codes..." 
              className="w-full bg-white dark:bg-zinc-800 border-0 rounded-full py-5 pl-16 pr-6 text-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/30 text-zinc-900 dark:text-white"
            />
          </motion.div>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            { title: "Documentation", icon: <Book />, desc: "Integration & API guides" },
            { title: "Support Tickets", icon: <Ticket />, desc: "Track open resolutions" },
            { title: "Live Chat", icon: <MessageSquare />, desc: "Talk to an engineer" },
            { title: "System Status", icon: <LifeBuoy />, desc: "All systems operational" }
          ].map((cat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (i * 0.1) }}
              key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-brand-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{cat.title}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{cat.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* FAQs */}
          <div className="lg:col-span-7">
            <h2 className="text-3xl font-black mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between font-bold text-lg focus:outline-none hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeFaq === idx && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6 text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-4"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 border border-zinc-200 dark:border-zinc-800 shadow-lg">
              <h3 className="text-2xl font-black mb-2">Submit a Ticket</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-sm">Need direct assistance? Our enterprise support team will respond within 2 hours.</p>
              
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-bold mb-2">Issue Category</label>
                  <select className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary">
                    <option>Technical Issue</option>
                    <option>Billing & Payments</option>
                    <option>Vendor Dispute</option>
                    <option>Account Upgrade</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Subject</label>
                  <input type="text" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" placeholder="Brief description..." />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Detailed Description</label>
                  <textarea rows={4} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none" placeholder="Include error codes or RFQ IDs..."></textarea>
                </div>
                <button className="w-full bg-brand-primary hover:bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-primary/20 transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  <span>Send Request</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// helper SVGs removed; inlined icons used where needed
