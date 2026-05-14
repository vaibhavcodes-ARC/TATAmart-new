'use client';

import React from 'react';
import Header from '../../components/Header';
import { motion } from 'framer-motion';
import { Laptop, Cpu, Package, ShoppingBag, Truck, Home, Shirt, ArrowRight, Globe } from 'lucide-react';
import Link from 'next/link';

export default function CategoriesPage() {
  const categoriesList = [
    {
      id: 'computers',
      name: 'Computer and IT',
      description: 'Enterprise rackmount servers, network routing hardware, bulk storage, and high-performance workstations.',
      icon: Laptop,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400',
      subcategories: ['Enterprise Servers', 'Network Switch & Routers', 'Storage Units', 'Workstations']
    },
    {
      id: 'electronics',
      name: 'Electronics & Electrical',
      description: 'High precision active and passive electronics components, semiconductors, prototype PCBs, and STM32 microcontrollers.',
      icon: Cpu,
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400',
      subcategories: ['Semiconductors', 'PCBs & Prototyping', 'Sensors & Modules', 'Active Components']
    },
    {
      id: 'logistics',
      name: 'Logistics & Packaging',
      description: 'Industrial wooden shipping pallets, durable stretch wrap film rolls, and heavy-duty global cargo packing materials.',
      icon: Package,
      color: 'bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400',
      subcategories: ['Wooden Pallets', 'Stretch Wrap Film', 'Cargo Packings', 'Storage Boxes']
    },
    {
      id: 'daily_needs',
      name: 'Consumer Needs',
      description: 'Premium eco-friendly biodegradable bulk hand soap, nitrile protective examination gloves, and hygiene essentials.',
      icon: ShoppingBag,
      color: 'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-950/30 dark:text-fuchsia-400',
      subcategories: ['Bulk Soap', 'Nitrile Gloves', 'Sanitary Essentials', 'Cleaning Agents']
    },
    {
      id: 'transport',
      name: 'Industrial Transport',
      description: 'Heavy-payload electric cargo tricycles, hydraulic manual lift pallet jacks, and industrial utility transit vehicles.',
      icon: Truck,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400',
      subcategories: ['Cargo Tricycles', 'Pallet Jacks', 'Electric Vehicles', 'Utility Trolleys']
    },
    {
      id: 'decor_furniture',
      name: 'Commercial Decor',
      description: 'Orthopedic mesh office chairs, modular conference room tables, and commercial office interior furnishings.',
      icon: Home,
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',
      subcategories: ['Office Chairs', 'Conference Tables', 'Modular Desks', 'Lighting Systems']
    },
    {
      id: 'apparel',
      name: 'Bulk Apparel',
      description: 'Combed cotton unisex blank t-shirts for branding, industrial high-visibility reflective safety vests, and custom uniforms.',
      icon: Shirt,
      color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400',
      subcategories: ['Blank T-Shirts', 'Reflective Vests', 'Factory Uniforms', 'Custom Hoodies']
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 pt-24 selection:bg-brand-primary selection:text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        {/* Premium atmospheric header layout */}
        <div className="text-center mb-16 relative overflow-hidden py-16 px-6 rounded-[40px] bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60 shadow-2xl shadow-indigo-600/[0.02] backdrop-blur-xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-brand-primary bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full mb-5">
              <Globe className="h-3 w-3" />
              <span>Taxonomies</span>
            </span>
            <h1 className="font-hero text-3xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white mb-4">
              Production Niches
            </h1>
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto font-medium leading-relaxed">
              Discover globally synchronized category buckets engineered for high-throughput corporate inventory procurement and volume sourcing.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoriesList.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.05, type: 'spring', bounce: 0.2 }}
              className="group flex flex-col justify-between rounded-[36px] bg-white p-7 sm:p-8 border border-zinc-200/60 shadow-sm shadow-indigo-600/[0.01] dark:bg-zinc-900 dark:border-zinc-800/60 hover:shadow-2xl hover:-translate-y-1 duration-300 transition-all"
            >
              <div>
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${cat.color} shadow-sm mb-6`}>
                  <cat.icon className="h-6 w-6" />
                </div>
                <h3 className="font-hero text-xl font-bold text-zinc-950 dark:text-white group-hover:text-brand-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3 leading-relaxed font-medium flex-1">
                  {cat.description}
                </p>

                <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-4">Pre-Vetted Subnodes</h4>
                  <div className="flex flex-wrap gap-2">
                    {cat.subcategories.map((sub) => (
                      <span key={sub} className="text-[11px] bg-zinc-50 dark:bg-zinc-800/40 py-1.5 px-3 rounded-xl text-zinc-600 dark:text-zinc-300 font-semibold border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-750 transition-colors duration-200 cursor-default">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Link
                  href={`/products?niche=${cat.id}`}
                  className="flex w-full items-center justify-center space-x-2 rounded-2xl bg-brand-primary hover:bg-indigo-600 py-3.5 text-sm font-black text-white shadow-lg shadow-indigo-600/10 transition-all active:scale-[0.98]"
                >
                  <span>Explore Inventory</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}

