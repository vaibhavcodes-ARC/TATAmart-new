'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import {
  Search,
  Cpu,
  Laptop,
  Settings,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Clock,
  BarChart3,
  Globe,
  CheckCircle2,
  Box
} from 'lucide-react';
import Link from 'next/link';
import MagicBento from '../components/animations/MagicBento';
import InfiniteMarquee from '../components/animations/InfiniteMarquee';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [niche, setNiche] = useState('ALL');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?q=${encodeURIComponent(searchQuery)}&niche=${niche}`;
    }
  };

  const brandLogos = [
    { name: "Tata Motors", domain: "tatamotors.com" },
    { name: "Intel Corp", domain: "intel.com" },
    { name: "Tesla", domain: "tesla.com" },
    { name: "Tata Steel", domain: "tatasteel.com" },
    { name: "Reliance Ind", domain: "ril.com" },
    { name: "Samsung", domain: "samsung.com" },
    { name: "Boeing", domain: "boeing.com" },
    { name: "Siemens", domain: "siemens.com" },
    { name: "Bosch", domain: "bosch.com" }
  ];

  const featuredProducts = [
    {
      id: 'fp-1',
      title: '5-Axis Automated Milling CNC Machine',
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
      title: 'Hot-Rolled Structural Carbon Steel Coil',
      category: 'Steel & Raw Materials',
      price: 65000,
      moq: '5 Tons',
      img: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'fp-5',
      title: 'Vetted OPC Grade 53 Bulk Cement',
      category: 'Construction & Infra',
      price: 420,
      moq: '500 bags',
      img: 'https://images.unsplash.com/photo-1589939705384-518cd1bf5074?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'fp-6',
      title: '2U Enterprise Dual Xeon Rack Server',
      category: 'IT & Hardware',
      price: 450000,
      moq: '1 unit',
      img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'fp-7',
      title: 'IP69K Proximity Lasers & Sensors',
      category: 'Electrical & Electronics',
      price: 3400,
      moq: '50 units',
      img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'fp-8',
      title: 'Double Row Spherical Roller Bearing',
      category: 'Automotive Components',
      price: 2500,
      moq: '100 units',
      img: 'https://images.unsplash.com/photo-1530047625168-4b29bf81140a?auto=format&fit=crop&q=80&w=400'
    }
  ];

  const features = [
    {
      id: 'electronics',
      title: 'Electronics & Components',
      desc: 'Semiconductors, active and passive components, customized PCBs, microprocessors, and high-fidelity sensors.',
      icon: Cpu,
      accent: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40',
      path: '/products?niche=electronics'
    },
    {
      id: 'computers',
      title: 'Computers & IT Hardware',
      desc: 'Enterprise-grade rack servers, networking backbone components, storage modules, and developer machines.',
      icon: Laptop,
      accent: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40',
      path: '/products?niche=computers'
    },
    {
      id: 'mechanical',
      title: 'Precision Mechanical Parts',
      desc: 'Aerospace-grade CNC machined parts, bearings, custom gears, pneumatic control units, and heavy industrial fasteners.',
      icon: Settings,
      accent: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-950/40',
      path: '/products?niche=mechanical'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafc] text-zinc-900 dark:bg-[#09090b] dark:text-zinc-50 overflow-x-hidden selection:bg-indigo-600 selection:text-white">
      {/* Premium SaaS Hero */}
      <section className="relative pt-36 pb-24 px-6 sm:px-8 lg:pt-44 lg:pb-32 max-w-7xl mx-auto overflow-hidden">
        {/* Decorative Background Glows */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-violet-400/5 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          {/* Hero Content */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-bold text-brand-primary dark:bg-indigo-950/40 dark:text-indigo-300 mb-6 border border-indigo-100 dark:border-indigo-900/30"
            >
              <Zap className="h-3 w-3 fill-current" />
              <span>B2B Procurement Redefined</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-4xl sm:text-6xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.08] sm:leading-[1.05] mb-6"
            >
              Enterprise procurement,<br />
              <span className="bg-gradient-to-r from-brand-primary via-indigo-600 to-violet-600 bg-clip-text text-transparent">upgraded.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-lg mb-10"
            >
              TATAmart is the enterprise-native supply platform trusted by global manufacturing networks. Procure high-volume parts and automate relational trade seamlessly.
            </motion.p>

            {/* Hero Action Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full max-w-xl mb-8"
            >
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 p-2 bg-white rounded-3xl shadow-xl border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800/80 shadow-indigo-600/[0.03]">
                <div className="flex items-center flex-1 px-3 py-1.5 sm:py-0">
                  <Search className="h-5 w-5 text-zinc-400 mr-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search industrial SKU or parts..."
                    className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder-zinc-400 dark:text-white font-medium"
                    id="input-search-hero"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-1.5 rounded-2xl bg-brand-primary hover:bg-indigo-600 text-white font-bold text-sm py-3 px-6 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all"
                  id="btn-search-hero"
                >
                  <span>Source Catalog</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-6"
            >
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700 border-2 border-[#fafafc] dark:border-zinc-950 flex items-center justify-center text-[10px] font-bold">A1</div>
                <div className="h-8 w-8 rounded-full bg-zinc-300 dark:bg-zinc-600 border-2 border-[#fafafc] dark:border-zinc-950 flex items-center justify-center text-[10px] font-bold">S3</div>
                <div className="h-8 w-8 rounded-full bg-brand-primary text-white border-2 border-[#fafafc] dark:border-zinc-950 flex items-center justify-center text-[10px] font-bold">+</div>
              </div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Joined by 10k+ supply hubs</span>
            </motion.div>
          </div>

          {/* Floating Mockup */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring', bounce: 0.2 }}
              className="relative w-full max-w-xl aspect-[4/3] rounded-3xl shadow-2xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-2.5 backdrop-blur-md"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/10 to-indigo-500/5 z-0 pointer-events-none"></div>
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
                alt="Real-time Enterprise Supply Chain Analytics Dashboard"
                className="h-full w-full object-cover rounded-[20px] shadow-inner relative z-10 hover:scale-[1.01] transition-transform duration-500"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Infinity Brand Marquee */}
      <section className="border-y border-zinc-200/50 bg-white dark:bg-zinc-900/20 dark:border-zinc-800/50 py-8">
        <InfiniteMarquee
          speed={40}
          items={brandLogos.map((logo, i) => (
            <div key={i} className="text-zinc-400 dark:text-zinc-600 font-black uppercase tracking-[0.2em] text-sm select-none mr-8">
              {logo.name}
            </div>
          ))}
        />
      </section>

      {/* Centered Core Value Pitch */}
      <section className="py-28 px-6 max-w-7xl mx-auto sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-heading text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-6">
            Effortless operations. More volume. Better trades.
          </h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">
            Procurement is hard work. TATAmart makes it easy. We connect suppliers and purchasers directly with relational data hooks.
          </p>
        </div>

        <div className="relative z-10 w-full mt-10">
          <MagicBento
            glowColor="79, 70, 229"
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            clickEffect={true}
            enableMagnetism={true}
            cardData={[
              {
                title: 'Electronics & Components',
                description: 'Semiconductors, active and passive components, customized PCBs, microprocessors, and high-fidelity sensors.',
                label: 'Hardware',
                color: 'var(--background-dark)',
                href: '/products?niche=electronics'
              },
              {
                title: 'Computers & IT Hardware',
                description: 'Enterprise-grade rack servers, networking backbone components, storage modules, and developer machines.',
                label: 'Infrastructure',
                color: 'var(--background-dark)',
                href: '/products?niche=computers'
              },
              {
                title: 'Precision Mechanical Parts',
                description: 'Aerospace-grade CNC machined parts, bearings, custom gears, pneumatic control units, and heavy industrial fasteners.',
                label: 'Manufacturing',
                color: 'var(--background-dark)',
                href: '/products?niche=mechanical'
              }
            ]}
          />
        </div>
      </section>

      {/* Alternating Feature Section 1 */}
      <section className="py-24 bg-white dark:bg-zinc-900/20 border-y border-zinc-200/50 dark:border-zinc-800/50 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mb-6">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white mb-6">
              Bid, negotiate and secure contracts in record time.
            </h3>
            <p className="text-base text-zinc-500 dark:text-zinc-400 font-medium mb-8 leading-relaxed">
              Our real-time B2B Request for Quotation (RFQ) pipelines drop average trade callback latency to under 4 hours. Instantly receive multiple competitive bids side-by-side from global manufacturing giants.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-brand-primary" />
                <span>Direct 1-click quote acceptance</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-brand-primary" />
                <span>Dynamic bulk allocation scaling</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-brand-primary" />
                <span>Automated legal contract generation</span>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-6">
            <motion.div
              whileHover={{ scale: 1.005 }}
              className="relative w-full aspect-video rounded-3xl border border-zinc-200/60 dark:border-zinc-800 bg-[#fafafc] dark:bg-zinc-900 shadow-lg overflow-hidden p-2"
            >
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=1000"
                alt="Industrial procurement operations meeting and real-time RFP bids evaluation"
                className="w-full h-full object-cover rounded-2xl shadow-inner opacity-90 dark:opacity-80"
              />
            </motion.div>
          </div>
        </div>
      </section>
 
      {/* High-Fidelity Premium Featured Products Grid Section */}
      <section className="py-28 bg-[#fafafc] dark:bg-[#09090b] px-6 sm:px-8 border-b border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-brand-primary bg-indigo-50 dark:bg-indigo-950/40 px-3.5 py-1 rounded-full mb-4">
                <Box className="h-3 w-3" />
                <span>Premium Node Assets</span>
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
                Procure Enterprise Assets
              </h2>
            </div>
            <p className="text-base text-zinc-500 dark:text-zinc-400 font-medium max-w-md leading-relaxed">
              Browse a snapshot of live inventory allocation options sourced directly from fully verified industrial OEM providers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 mb-16">
            {featuredProducts.map((prod, i) => (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="group flex flex-col bg-white rounded-[32px] border border-zinc-200/60 p-5 shadow-sm shadow-indigo-600/[0.01] dark:bg-zinc-900 dark:border-zinc-800/60 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="aspect-[4/3] rounded-[24px] bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center mb-5 overflow-hidden border border-zinc-100 dark:border-zinc-800 relative">
                  <img 
                    src={prod.img} 
                    alt={prod.title} 
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" 
                  />
                  <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-white/90 dark:bg-zinc-900/90 px-2.5 py-1 text-[8px] font-black tracking-widest uppercase text-emerald-600 shadow-sm backdrop-blur-md">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    <span>Vetted</span>
                  </span>
                </div>
                <div className="flex-1 flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">
                    {prod.category}
                  </span>
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white mb-4 group-hover:text-brand-primary transition-colors line-clamp-1">
                    {prod.title}
                  </h3>
                  <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-end justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-zinc-400 block mb-0.5">Base Unit Price</span>
                      <span className="text-base font-black text-zinc-950 dark:text-white" suppressHydrationWarning>
                        ₹{prod.price.toLocaleString()}
                      </span>
                      <span className="text-[8px] font-semibold block text-zinc-400 mt-0.5">MOQ: {prod.moq}</span>
                    </div>
                    <Link 
                      href={`/products?q=${encodeURIComponent(prod.title)}`}
                      className="h-8 px-3 flex items-center justify-center rounded-xl bg-brand-primary hover:bg-indigo-600 text-white text-[10px] font-black tracking-wider uppercase shadow-md shadow-indigo-600/10 transition-all active:scale-95"
                    >
                      RFQ
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center">
            <Link 
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-850 py-4 px-8 font-black text-sm text-zinc-900 dark:text-white tracking-wide shadow-md shadow-zinc-200/5 dark:shadow-none transition-all active:scale-[0.98]"
            >
              <span>Explore Full Trading Catalogue</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Numeric Statistics Section */}
      <section className="py-24 bg-[#fafafc] dark:bg-[#09090b] border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 mb-6">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="text-5xl font-black text-zinc-950 dark:text-white mb-2 tracking-tighter">100%</h4>
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Vendor Authenticity</p>
            </div>
            <p className="text-xs font-medium text-zinc-500 mt-6 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-4">
              Every listed enterprise supplier undergoes manual physical facility and state tax verification audit procedures.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 mb-6">
                <Users className="h-5 w-5" />
              </div>
              <h4 className="text-5xl font-black text-zinc-950 dark:text-white mb-2 tracking-tighter">10K+</h4>
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Enterprise Nodes</p>
            </div>
            <p className="text-xs font-medium text-zinc-500 mt-6 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-4">
              Connecting multinational manufacturing plants directly with vetted custom tier-1 parts fabricators globally.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 mb-6">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h4 className="text-5xl font-black text-zinc-950 dark:text-white mb-2 tracking-tighter">4.0x</h4>
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Speed Multiplier</p>
            </div>
            <p className="text-xs font-medium text-zinc-500 mt-6 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-4">
              Procurement officers report significant reduction in relational contract cycle times compared to direct legacy mail inquiries.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom conversion section */}
      <section className="py-28 px-6 sm:px-8">
        <div className="max-w-5xl mx-auto rounded-[48px] overflow-hidden relative bg-zinc-900 dark:bg-zinc-900 p-10 sm:p-20 text-center border border-zinc-800 shadow-2xl">
          {/* Glow backdrops */}
          <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/40 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute top-full left-1/3 w-[300px] h-[300px] bg-violet-600/40 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto">
            <div className="h-12 w-12 rounded-2xl bg-zinc-800 flex items-center justify-center border border-zinc-700 mb-8 shadow-inner text-zinc-300">
              <Box className="h-6 w-6 animate-pulse" />
            </div>
            <h2 className="font-hero text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-6">
              Ready to source at enterprise scale?
            </h2>
            <p className="text-base text-zinc-400 font-medium mb-10">
              Join the fast-scaling ecosystem of wholesale supply, manufacturing audits, and instantaneous RFQ automation pipelines.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Link
                href="/auth/register"
                className="bg-white text-zinc-950 font-black py-3.5 px-8 rounded-full shadow-lg hover:bg-zinc-100 transition-all text-sm"
              >
                Create Free Workspace
              </Link>
              <Link
                href="/products"
                className="border border-zinc-700 hover:bg-zinc-800 text-white font-bold py-3.5 px-8 rounded-full transition-all text-sm"
              >
                View Trade Catalogue
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

