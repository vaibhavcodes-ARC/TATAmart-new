'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [niche] = useState('ALL');

  // previously tracked `mounted` state removed; no-op

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?q=${encodeURIComponent(searchQuery)}&niche=${niche}`;
    }
  };

  const brandLogos = [
    "Tata Motors", "Intel Corp", "Tesla", "Tata Steel", 
    "Reliance Ind", "Samsung", "Boeing", "Siemens", "Bosch"
  ];

  const niches = [
    {
      id: 'electronics',
      title: 'Electronics & Components',
      desc: 'Semiconductors, active and passive components, customized PCBs, microprocessors, and high-fidelity sensors.',
      path: '/products?niche=electronics'
    },
    {
      id: 'computers',
      title: 'Computers & IT Hardware',
      desc: 'Enterprise-grade rack servers, networking backbone components, storage modules, and developer machines.',
      path: '/products?niche=computers'
    },
    {
      id: 'mechanical',
      title: 'Precision Mechanical Parts',
      desc: 'Aerospace-grade CNC machined parts, bearings, custom gears, pneumatic control units, and heavy industrial fasteners.',
      path: '/products?niche=mechanical'
    }
  ];

  const verifiedPartners = [
    {
      name: 'TechCore Solutions',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600',
      description: 'Precision aerospace components and semiconductor assembly specialists.',
      location: 'SAKCHI, JAMSHEDPUR, INDIA'
    },
    {
      name: 'EcoPower Systems',
      image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600',
      description: 'Next-generation industrial storage batteries and smart grid controllers.',
      location: 'AGRICO , JAMSHEDPUR, INDIA'
    },
    {
      name: 'OmniLink Logistics',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600',
      description: 'Global freight coordination, cold chain monitoring, and smart customs clearance.',
      location: 'DORANDA, RANCHI, INDIA'
    }
  ];

  const featuredProducts = [
    {
      id: 'fp-1',
      title: '5-Axis Automated CNC Machine',
      category: 'Industrial Machinery',
      price: 1250000,
      moq: '1 unit',
      img: 'https://images.unsplash.com/photo-1616788494672-87d325471252?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'fp-2',
      title: 'High-Performance PLC Automation Node',
      category: 'Electrical & Electronics',
      price: 45000,
      moq: '5 units',
      img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'fp-3',
      title: 'Heavy Logistic Differential Gear Unit',
      category: 'Automotive Components',
      price: 75000,
      moq: '5 units',
      img: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'fp-4',
      title: 'Hot-Rolled Carbon Steel Coil',
      category: 'Steel & Raw Materials',
      price: 65000,
      moq: '5 Tons',
      img: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=400'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#111111] text-zinc-900 dark:text-zinc-50 overflow-x-hidden transition-colors duration-300">
      {/* Magazine Style Hero */}
      <section className="relative min-h-[90vh] flex flex-col justify-between pt-24 overflow-hidden bg-ink-black text-white">
        <div className="absolute inset-0 opacity-40">
          <img
            className="w-full h-full object-cover hero-zoom select-none"
            alt="Sophisticated 3D abstract render representing global industrial logistics."
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1600"
          />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-16 max-w-7xl mx-auto w-full py-16">
          <div className="max-w-5xl space-y-12">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="font-heading text-[52px] sm:text-[90px] md:text-[110px] leading-[0.95] tracking-tight"
            >
              The Global Engine<br />
              <span className="italic font-normal">for Enterprise</span>
            </motion.h1>

            <div className="flex flex-col md:flex-row items-start md:items-end gap-12 pt-4">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                className="font-sans text-lg max-w-lg opacity-85 leading-relaxed"
              >
                A unified B2B marketplace designed for enterprise logistics and high-volume procurement, connecting vetted suppliers with absolute precision.
              </motion.p>
              
              {/* Sourcing Search Input */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                className="flex-1 w-full md:max-w-md"
              >
                <form onSubmit={handleSearch} className="border-b border-white/30 flex items-center py-3 group focus-within:border-white transition-colors">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search industrial SKU or parts..."
                    className="bg-transparent border-none outline-none focus:ring-0 w-full text-base font-sans placeholder:text-white/40 text-white"
                  />
                  <button type="submit" className="ml-4 hover:translate-x-1 transition-transform" aria-label="Search">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Bar indicators */}
        <div className="relative z-10 px-6 md:px-16 pb-12 flex justify-between items-end max-w-7xl mx-auto w-full">
          <div className="flex gap-4 font-monoenterprise text-[10px] tracking-widest uppercase opacity-60">
            <span>Scroll to explore</span>
          </div>
          <div className="hidden md:flex gap-12 font-monoenterprise text-[10px] tracking-widest uppercase">
            <span className="opacity-60">Semiconductors</span>
            <span className="opacity-60">Automotive</span>
            <span className="opacity-60">Industrial Machinery</span>
          </div>
        </div>
      </section>

      {/* Infinite Marquee of Enterprise Clients */}
      <section className="border-y border-[#E5E5E5] dark:border-zinc-800 bg-white dark:bg-zinc-900/10 py-10 overflow-hidden">
        <div className="flex w-max animate-infinite-marquee">
          {brandLogos.concat(brandLogos).map((logo, idx) => (
            <div key={idx} className="font-monoenterprise text-xs font-bold uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-650 mx-16 select-none">
              {logo}
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Counters Section */}
      <section className="py-32 border-b border-[#E5E5E5] dark:border-zinc-800 bg-[#F9F9F9] dark:bg-[#111111]">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
            <div className="space-y-6">
              <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-full" />
              <span className="block font-heading text-6xl md:text-7xl text-ink-black dark:text-white leading-none">12.5k</span>
              <h3 className="font-monoenterprise text-xs font-bold uppercase tracking-[0.15em] text-[#346941]">Verified Vendors</h3>
              <p className="font-sans text-sm text-zinc-600 dark:text-zinc-450 leading-relaxed max-w-xs">Rigorous vetting protocols ensuring Tier 1 compliance across active industrial zones.</p>
            </div>

            <div className="space-y-6">
              <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-full" />
              <span className="block font-heading text-6xl md:text-7xl text-ink-black dark:text-white leading-none">$42.8B</span>
              <h3 className="font-monoenterprise text-xs font-bold uppercase tracking-[0.15em] text-[#346941]">Annual Trade Volume</h3>
              <p className="font-sans text-sm text-zinc-600 dark:text-zinc-450 leading-relaxed max-w-xs">Optimizing supply chain cycles and scaling wholesale trades with digital contract flows.</p>
            </div>

            <div className="space-y-6">
              <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-full" />
              <span className="block font-heading text-6xl md:text-7xl text-ink-black dark:text-white leading-none">1,200+</span>
              <h3 className="font-monoenterprise text-xs font-bold uppercase tracking-[0.15em] text-[#346941]">Enterprise Partners</h3>
              <p className="font-sans text-sm text-zinc-600 dark:text-zinc-450 leading-relaxed max-w-xs">Global buyers trust TataMart procurement engines to safeguard custom manufacturing lines.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Partners: Gallery Showcase */}
      <section className="py-32 bg-white dark:bg-[#121212]">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
              <span className="font-monoenterprise text-xs uppercase tracking-widest text-[#346941]">Curated Network</span>
              <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-ink-black dark:text-white mt-4">Verified Partners</h2>
              <p className="font-sans text-base text-zinc-500 dark:text-zinc-450 mt-4 leading-relaxed max-w-lg">The absolute standard in aerospace, computing, and industrial engineering.</p>
            </div>
            <Link
              href="/products"
              className="border border-ink-black dark:border-white px-8 py-3.5 font-monoenterprise text-[10px] uppercase tracking-widest hover:bg-ink-black hover:text-white dark:hover:bg-white dark:hover:text-ink-black transition-all rounded-sm"
            >
              Browse All Partners
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {verifiedPartners.map((partner) => (
              <div key={partner.name} className="flex flex-col gap-6 group cursor-pointer">
                <div className="aspect-4/5 overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-[#E5E5E5] dark:border-zinc-800 rounded-sm">
                  <img
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000 grayscale hover:grayscale-0"
                    alt={partner.name}
                    src={partner.image}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-heading text-2xl text-ink-black dark:text-white">{partner.name}</h3>
                    <span className="font-monoenterprise text-[9px] tracking-widest px-2.5 py-0.5 border border-ink-black dark:border-white/50 text-ink-black dark:text-white">
                      VERIFIED
                    </span>
                  </div>
                  <p className="font-sans text-sm text-zinc-550 dark:text-zinc-450 leading-relaxed">{partner.description}</p>
                  <p className="font-monoenterprise text-[9px] tracking-widest text-zinc-400 dark:text-zinc-650">{partner.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products: Clean Boutique Cards Grid */}
      <section className="py-32 bg-[#F9F9F9] dark:bg-[#111111] border-y border-[#E5E5E5] dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div>
              <span className="font-monoenterprise text-xs uppercase tracking-widest text-[#346941]">Live Offerings</span>
              <h2 className="font-heading text-4xl sm:text-5xl text-ink-black dark:text-white mt-4">Featured Inventories</h2>
            </div>
            <p className="font-sans text-sm text-zinc-550 dark:text-zinc-450 max-w-md leading-relaxed">
              Vetted components sourced directly from tier-1 manufacturers. Place dynamic Request For Quotes (RFQ) instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {featuredProducts.map((prod) => (
              <div
                key={prod.id}
                className="group flex flex-col bg-white dark:bg-zinc-900 border border-[#E5E5E5] dark:border-zinc-800 p-4 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.03)] rounded-sm"
              >
                <div className="aspect-4/3 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center mb-4 overflow-hidden border border-[#E5E5E5]/50 dark:border-zinc-800/50 rounded-xs relative">
                  <img
                    src={prod.img}
                    alt={prod.title}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 bg-white/95 dark:bg-zinc-900/95 px-2 py-0.5 text-[8px] font-bold tracking-widest uppercase text-emerald-700 border border-emerald-600/10">
                    VETTED
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-monoenterprise uppercase tracking-widest text-zinc-400 dark:text-zinc-550 mb-1 block">
                      {prod.category}
                    </span>
                    <h3 className="font-sans text-sm font-bold text-ink-black dark:text-white group-hover:text-[#346941] transition-colors line-clamp-2 min-h-10">
                      {prod.title}
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-[#E5E5E5] dark:border-zinc-800 flex items-end justify-between mt-4">
                    <div>
                      <span className="text-[9px] font-monoenterprise text-zinc-400 block">Unit Price</span>
                      <span className="text-base font-bold text-ink-black dark:text-white" suppressHydrationWarning>
                        ₹{prod.price.toLocaleString()}
                      </span>
                      <span className="text-[8px] font-monoenterprise block text-zinc-400 mt-0.5">MOQ: {prod.moq}</span>
                    </div>
                    <Link
                      href={`/products?q=${encodeURIComponent(prod.title)}`}
                      className="bg-ink-black dark:bg-white text-white dark:text-ink-black px-4 py-2 font-monoenterprise text-[9px] uppercase tracking-widest hover:bg-[#043F1C] dark:hover:bg-[#346941] hover:text-white transition-all rounded-xs"
                    >
                      RFQ
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-ink-black dark:border-white bg-transparent hover:bg-ink-black hover:text-white dark:hover:bg-white dark:hover:text-ink-black py-4 px-8 font-monoenterprise text-xs uppercase tracking-widest transition-all"
            >
              <span>Explore Full Sourcing Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bento Niches Section */}
      <section className="py-32 bg-white dark:bg-[#121212]">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="font-monoenterprise text-xs uppercase tracking-widest text-[#346941]">Specializations</span>
            <h2 className="font-heading text-4xl sm:text-5xl text-ink-black dark:text-white mt-4">
              Effortless operations. Structured niches.
            </h2>
            <p className="font-sans text-base text-zinc-500 mt-4 max-w-lg mx-auto">
              Our B2B marketplace aggregates specialized production pipelines to save lead times and audit efforts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {niches.map((n) => (
              <Link
                key={n.id}
                href={n.path}
                className="p-8 border border-[#E5E5E5] dark:border-zinc-800 hover:border-ink-black dark:hover:border-white transition-all rounded-sm flex flex-col justify-between min-h-65 group bg-[#F9F9F9]/50 dark:bg-[#111111]/50"
              >
                <div className="space-y-4">
                  <h3 className="font-heading text-2xl text-ink-black dark:text-white group-hover:translate-x-1 transition-transform duration-300">
                    {n.title}
                  </h3>
                  <p className="font-sans text-sm text-zinc-550 dark:text-zinc-450 leading-relaxed">
                    {n.desc}
                  </p>
                </div>
                <div className="flex items-center gap-2 font-monoenterprise text-[10px] tracking-widest uppercase text-[#346941] pt-6">
                  <span>View Products</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* High Fashion CTA Section */}
      <section className="py-40 bg-ink-black text-white relative overflow-hidden border-t border-zinc-900">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="font-heading text-[18vw] whitespace-nowrap leading-none tracking-tighter select-none font-bold">
            TATAMART TATAMART TATAMART
          </div>
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10 px-6">
          <span className="font-monoenterprise text-xs uppercase tracking-widest text-[#346941]">Accelerate Procurement</span>
          <h2 className="font-heading text-4xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight">
            Ready to scale your enterprise commerce?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4 max-w-md mx-auto">
            <Link
              href="/auth/register"
              className="bg-white text-ink-black px-10 py-4 font-monoenterprise text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-all rounded-sm text-center"
            >
              Request Workspace
            </Link>
            <Link
              href="/products"
              className="border border-white/30 px-10 py-4 font-monoenterprise text-[10px] uppercase tracking-widest hover:bg-white hover:text-ink-black transition-all rounded-sm text-center"
            >
              Enter Directory
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
