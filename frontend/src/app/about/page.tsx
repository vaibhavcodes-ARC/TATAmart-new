'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Shield, TrendingUp, Users, Zap, Target } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const metrics = [
    { label: "Gross Merchandise Value", value: "$12B+", prefix: "" },
    { label: "Active Enterprise Nodes", value: "10,000+", prefix: "" },
    { label: "Global Facilities", value: "150+", prefix: "" },
    { label: "RFQ Match Rate", value: "98.5%", prefix: "" }
  ];

  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 sm:px-8 max-w-7xl mx-auto overflow-hidden text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/10 dark:bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-100 dark:bg-zinc-900 px-4 py-1.5 text-sm font-bold text-zinc-600 dark:text-zinc-400 mb-8 border border-zinc-200 dark:border-zinc-800">
            <Globe className="h-4 w-4" />
            <span>The Global Supply Ecosystem</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
            Architecting the future of <span className="bg-gradient-to-r from-brand-primary to-violet-600 bg-clip-text text-transparent">enterprise trade.</span>
          </h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl mx-auto">
            TATAmart is more than a marketplace. We are the digital infrastructure connecting the world's most demanding manufacturers with elite-tier component fabricators.
          </p>
        </motion.div>
      </section>

      {/* Metrics Strip */}
      <section className="border-y border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center divide-x divide-zinc-200/50 dark:divide-zinc-800/50">
            {metrics.map((m, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                key={i} className="flex flex-col items-center"
              >
                <div className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white mb-2">{m.value}</div>
                <div className="text-sm font-bold text-zinc-400 uppercase tracking-wider">{m.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision (RMSCloud-inspired spacious layout) */}
      <section className="py-32 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 mb-8">
              <Target className="h-7 w-7" />
            </div>
            <h2 className="text-4xl font-black mb-6">Our Mission</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              To eliminate the friction of industrial procurement by establishing a unified, transparent, and hyper-efficient digital marketplace. We transform month-long contract negotiations into instantaneous, algorithm-driven RFQ matches.
            </p>
          </motion.div>
          <div className="relative aspect-square sm:aspect-[4/3] rounded-[3rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center p-8">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/10 to-transparent"></div>
            <img src="/hero.png" alt="Mission Mockup" className="w-full h-full object-cover rounded-3xl shadow-2xl opacity-90" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center flex-col-reverse lg:flex-row-reverse">
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="h-14 w-14 rounded-2xl bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center text-violet-600 mb-8">
              <Zap className="h-7 w-7" />
            </div>
            <h2 className="text-4xl font-black mb-6">Our Vision</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We envision a borderless supply chain where geographical limitations dissolve. By leveraging intelligent matchmaking and secure escrow systems, TATAmart empowers enterprises to scale their manufacturing capabilities boundlessly.
            </p>
          </motion.div>
          <div className="relative aspect-square sm:aspect-[4/3] rounded-[3rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center p-8">
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 to-transparent"></div>
            <img src="/comparison.png" alt="Vision Mockup" className="w-full h-full object-cover rounded-3xl shadow-2xl opacity-90" />
          </div>
        </div>
      </section>

      {/* Trust & Ecosystem */}
      <section className="py-24 bg-white dark:bg-zinc-900/20 border-y border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-16">The Ecosystem of Trust</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              { icon: <Shield />, title: "Zero-Trust Security", desc: "Military-grade encryption protects your proprietary IP and CAD files during the RFQ process." },
              { icon: <Users />, title: "Verified Nodes", desc: "Every facility on our platform undergoes a rigorous 5-step manual audit before being allowed to bid." },
              { icon: <TrendingUp />, title: "Scalable Operations", desc: "From prototyping runs of 100 units to mass production of 1,000,000 components, our ecosystem adapts." }
            ].map((item, i) => (
              <div key={i} className="p-10 rounded-[2rem] border border-zinc-200/60 dark:border-zinc-800/60 bg-[#fafafc] dark:bg-zinc-900 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 sm:px-8 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-black mb-6">Ready to join the revolution?</h2>
        <p className="text-xl text-zinc-500 dark:text-zinc-400 mb-10">Sign up your enterprise today and experience procurement as it should be.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register" className="bg-brand-primary hover:bg-indigo-600 text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-brand-primary/20 transition-all hover:-translate-y-1">
            Create Free Workspace
          </Link>
          <Link href="/support" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 font-bold py-4 px-10 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
            Contact Sales
          </Link>
        </div>
      </section>

    </div>
  );
}
