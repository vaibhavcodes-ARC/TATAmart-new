'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Shield, TrendingUp, Users, Zap, Target } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const metrics = [
    { label: "Gross Merchandise Value", value: "$12B+" },
    { label: "Active Enterprise Nodes", value: "10,000+" },
    { label: "Global Facilities", value: "150+" },
    { label: "RFQ Match Rate", value: "98.5%" }
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#111111] text-zinc-900 dark:text-zinc-50 overflow-x-hidden transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative pt-36 pb-24 px-6 sm:px-8 max-w-7xl mx-auto overflow-hidden text-center">
        {/* Subtle Ambient Telemetry Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/[0.03] rounded-full blur-[100px] pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center justify-center gap-2 rounded-none bg-white dark:bg-zinc-900 px-4 py-1.5 text-[9px] font-monoenterprise uppercase tracking-[0.2em] text-secondary mb-8 border border-border-subtle dark:border-zinc-800">
            <Globe className="h-3.5 w-3.5" />
            <span>The Global Supply Ecosystem</span>
          </div>
          <h1 className="font-heading text-5xl sm:text-7xl font-light tracking-tight text-ink-black dark:text-white mb-8 leading-[1.05]">
            Architecting the future of <br />
            <span className="italic font-normal">enterprise trade.</span>
          </h1>
          <p className="text-sm font-sans text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            TATAmart is more than a marketplace. We are the digital infrastructure connecting the world&apos;s most demanding manufacturers with elite-tier component fabricators.
          </p>
        </motion.div>
      </section>

      {/* Metrics Strip */}
      <section className="border-y border-border-subtle dark:border-zinc-800 bg-white dark:bg-[#151515] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-border-subtle dark:divide-zinc-800">
            {metrics.map((m, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="flex flex-col items-center justify-center py-4 md:py-0"
              >
                <div className="font-heading text-4xl sm:text-5xl font-light text-ink-black dark:text-white mb-1.5">{m.value}</div>
                <div className="text-[9px] font-monoenterprise uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">{m.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-28 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center mb-28">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-10 w-10 rounded-none bg-white dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 flex items-center justify-center text-secondary mb-8">
              <Target className="h-4.5 w-4.5" />
            </div>
            <h2 className="font-heading text-4xl font-light text-ink-black dark:text-white mb-6">Our Mission</h2>
            <p className="font-sans text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed">
              To eliminate the friction of industrial procurement by establishing a unified, transparent, and hyper-efficient digital marketplace. We transform month-long contract negotiations into instantaneous, algorithm-driven RFQ matches.
            </p>
          </motion.div>
          <div className="relative aspect-square sm:aspect-[4/3] rounded-none border border-border-subtle dark:border-zinc-800 bg-white dark:bg-[#151515] p-2">
            <div className="w-full h-full border border-border-subtle dark:border-zinc-800 overflow-hidden relative">
              <img src="/hero.png" alt="Mission Mockup" className="w-full h-full object-cover grayscale opacity-90 transition-transform duration-500 hover:scale-[1.02]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center flex-col-reverse lg:flex-row-reverse">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-start-2"
          >
            <div className="h-10 w-10 rounded-none bg-white dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 flex items-center justify-center text-secondary mb-8">
              <Zap className="h-4.5 w-4.5" />
            </div>
            <h2 className="font-heading text-4xl font-light text-ink-black dark:text-white mb-6">Our Vision</h2>
            <p className="font-sans text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed">
              We envision a borderless supply chain where geographical limitations dissolve. By leveraging intelligent matchmaking and secure escrow systems, TATAmart empowers enterprises to scale their manufacturing capabilities boundlessly.
            </p>
          </motion.div>
          <div className="relative aspect-square sm:aspect-[4/3] rounded-none border border-border-subtle dark:border-zinc-800 bg-white dark:bg-[#151515] p-2 lg:col-start-1 lg:row-start-1">
            <div className="w-full h-full border border-border-subtle dark:border-zinc-800 overflow-hidden relative">
              <img src="/comparison.png" alt="Vision Mockup" className="w-full h-full object-cover grayscale opacity-90 transition-transform duration-500 hover:scale-[1.02]" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Ecosystem */}
      <section className="py-24 bg-white dark:bg-[#151515] border-y border-border-subtle dark:border-zinc-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-light text-ink-black dark:text-white mb-16">The Ecosystem of Trust</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              { icon: <Shield />, title: "Zero-Trust Security", desc: "Military-grade encryption protects your proprietary IP and CAD files during the RFQ process." },
              { icon: <Users />, title: "Verified Nodes", desc: "Every facility on our platform undergoes a rigorous 5-step manual audit before being allowed to bid." },
              { icon: <TrendingUp />, title: "Scalable Operations", desc: "From prototyping runs of 100 units to mass production of 1,000,000 components, our ecosystem adapts." }
            ].map((item, i) => (
              <div key={i} className="p-8 md:p-10 rounded-none border border-border-subtle dark:border-zinc-800 bg-[#F9F9F9] dark:bg-[#111111] transition-all duration-305 hover:border-zinc-400 dark:hover:border-zinc-650">
                <div className="h-10 w-10 rounded-none bg-white dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 text-secondary flex items-center justify-center mb-6">
                  {React.cloneElement(item.icon, { className: "h-4.5 w-4.5" })}
                </div>
                <h3 className="font-heading text-xl font-light text-ink-black dark:text-white mb-4">{item.title}</h3>
                <p className="font-sans text-xs text-zinc-500 dark:text-zinc-405 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 sm:px-8 max-w-4xl mx-auto text-center">
        <h2 className="font-heading text-4xl sm:text-5xl font-light text-ink-black dark:text-white mb-6">Ready to join the revolution?</h2>
        <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400 mb-10 max-w-xl mx-auto">Sign up your enterprise today and experience procurement as it should be.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register" className="rounded-none bg-ink-black hover:bg-zinc-850 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-ink-black py-4 px-10 font-monoenterprise text-xs uppercase tracking-widest transition-all">
            Create Free Workspace
          </Link>
          <Link href="/support" className="rounded-none bg-transparent text-ink-black dark:text-white border border-border-subtle dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 py-4 px-10 font-monoenterprise text-xs uppercase tracking-widest transition-all">
            Contact Sales
          </Link>
        </div>
      </section>

    </div>
  );
}
