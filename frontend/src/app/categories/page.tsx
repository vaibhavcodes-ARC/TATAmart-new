'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Laptop, Cpu, Package, ShoppingBag, Truck, Home, Shirt, ArrowRight, Globe, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

export default function CategoriesPage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const categoriesList = [
    {
      id: 'computers',
      name: 'Computer and IT',
      description: 'Enterprise rackmount servers, network routing hardware, bulk storage, and high-performance workstations.',
      icon: Laptop,
      accent: '#3B5BDB',
      lightBg: 'bg-blue-50 dark:bg-blue-950/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      subcategories: ['Enterprise Servers', 'Network Switch & Routers', 'Storage Units', 'Workstations']
    },
    {
      id: 'electronics',
      name: 'Electronics & Electrical',
      description: 'High precision active and passive electronics components, semiconductors, prototype PCBs, and STM32 microcontrollers.',
      icon: Cpu,
      accent: '#7048E8',
      lightBg: 'bg-violet-50 dark:bg-violet-950/20',
      iconColor: 'text-violet-600 dark:text-violet-400',
      subcategories: ['Semiconductors', 'PCBs & Prototyping', 'Sensors & Modules', 'Active Components']
    },
    {
      id: 'logistics',
      name: 'Logistics & Packaging',
      description: 'Industrial wooden shipping pallets, durable stretch wrap film rolls, and heavy-duty global cargo packing materials.',
      icon: Package,
      accent: '#5C7CFA',
      lightBg: 'bg-indigo-50 dark:bg-indigo-950/20',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      subcategories: ['Wooden Pallets', 'Stretch Wrap Film', 'Cargo Packings', 'Storage Boxes']
    },
    {
      id: 'daily_needs',
      name: 'Consumer Needs',
      description: 'Premium eco-friendly biodegradable bulk hand soap, nitrile protective examination gloves, and hygiene essentials.',
      icon: ShoppingBag,
      accent: '#D6336C',
      lightBg: 'bg-rose-50 dark:bg-rose-950/20',
      iconColor: 'text-rose-600 dark:text-rose-400',
      subcategories: ['Bulk Soap', 'Nitrile Gloves', 'Sanitary Essentials', 'Cleaning Agents']
    },
    {
      id: 'transport',
      name: 'Industrial Transport',
      description: 'Heavy-payload electric cargo tricycles, hydraulic manual lift pallet jacks, and industrial utility transit vehicles.',
      icon: Truck,
      accent: '#346941',
      lightBg: 'bg-emerald-50 dark:bg-emerald-950/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      subcategories: ['Cargo Tricycles', 'Pallet Jacks', 'Electric Vehicles', 'Utility Trolleys']
    },
    {
      id: 'decor_furniture',
      name: 'Commercial Decor',
      description: 'Orthopedic mesh office chairs, modular conference room tables, and commercial office interior furnishings.',
      icon: Home,
      accent: '#E67700',
      lightBg: 'bg-amber-50 dark:bg-amber-950/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
      subcategories: ['Office Chairs', 'Conference Tables', 'Modular Desks', 'Lighting Systems']
    },
    {
      id: 'apparel',
      name: 'Bulk Apparel',
      description: 'Combed cotton unisex blank t-shirts for branding, industrial high-visibility reflective safety vests, and custom uniforms.',
      icon: Shirt,
      accent: '#0C8599',
      lightBg: 'bg-cyan-50 dark:bg-cyan-950/20',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      subcategories: ['Blank T-Shirts', 'Reflective Vests', 'Factory Uniforms', 'Custom Hoodies']
    }
  ];

  const filteredCategories = activeFilter
    ? categoriesList.filter(c => c.id === activeFilter)
    : categoriesList;

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#111111] text-zinc-900 dark:text-zinc-50">

      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8">

        {/* ── Hero Header ──────────────────────────────────────── */}
        <div className="mb-16 pt-12 pb-16 border-b border-[#E5E5E5] dark:border-zinc-800">
          <span className="font-monoenterprise text-[10px] tracking-[0.25em] text-zinc-400 dark:text-zinc-500 uppercase flex items-center gap-2 mb-4">
            <Globe className="h-3.5 w-3.5 text-secondary" />
            <span>Production Taxonomies</span>
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-ink-black dark:text-white">
                Product <span className="italic">Categories</span>
              </h1>
              <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400 mt-4 max-w-lg leading-relaxed">
                Discover globally synchronized category buckets engineered for high-throughput corporate inventory procurement and volume sourcing.
              </p>
            </div>

            {/* View All Products CTA */}
            <Link
              href="/products"
              className="inline-flex items-center gap-3 bg-ink-black dark:bg-white text-white dark:text-ink-black px-7 py-4 font-monoenterprise text-[11px] uppercase tracking-widest hover:bg-[#043F1C] dark:hover:bg-zinc-100 transition-all duration-200 active:scale-[0.99] shrink-0 self-start lg:self-auto"
            >
              <LayoutGrid className="h-4 w-4" />
              <span>View All Products</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* ── Category Filter Pills ─────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveFilter(null)}
            className={`font-monoenterprise text-[10px] uppercase tracking-widest px-4 py-2 border transition-all duration-150 ${
              activeFilter === null
                ? 'bg-ink-black dark:bg-white text-white dark:text-ink-black border-ink-black dark:border-white'
                : 'bg-transparent text-zinc-500 dark:text-zinc-400 border-[#E5E5E5] dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-ink-black dark:hover:text-white'
            }`}
          >
            All Categories
          </button>
          {categoriesList.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(activeFilter === cat.id ? null : cat.id)}
                className={`flex items-center gap-1.5 font-monoenterprise text-[10px] uppercase tracking-widest px-4 py-2 border transition-all duration-150 ${
                  activeFilter === cat.id
                    ? 'bg-ink-black dark:bg-white text-white dark:text-ink-black border-ink-black dark:border-white'
                    : 'bg-transparent text-zinc-500 dark:text-zinc-400 border-[#E5E5E5] dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-ink-black dark:hover:text-white'
                }`}
              >
                <Icon className="h-3 w-3" />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* ── Category Cards Grid ───────────────────────────────── */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCategories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
              className="group flex flex-col justify-between bg-white dark:bg-[#181818] border border-[#E5E5E5] dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-lg transition-all duration-300"
            >
              {/* Card Body */}
              <div className="p-7 sm:p-8">
                {/* Icon */}
                <div className={`inline-flex h-12 w-12 items-center justify-center ${cat.lightBg} ${cat.iconColor} mb-6`}>
                  <cat.icon className="h-5 w-5" />
                </div>

                <h3 className="font-heading text-xl font-light text-ink-black dark:text-white group-hover:text-secondary transition-colors tracking-tight">
                  {cat.name}
                </h3>
                <p className="font-sans text-xs text-zinc-500 dark:text-zinc-400 mt-3 leading-relaxed">
                  {cat.description}
                </p>

                {/* Subcategories */}
                <div className="mt-8 pt-6 border-t border-[#E5E5E5] dark:border-zinc-800">
                  <h4 className="font-monoenterprise text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 mb-3">
                    Sub-Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub}
                        href={`/products?niche=${cat.id}&q=${encodeURIComponent(sub)}`}
                        className="font-monoenterprise text-[10px] bg-[#F9F9F9] dark:bg-zinc-900 py-1 px-2.5 text-zinc-600 dark:text-zinc-300 border border-[#E5E5E5] dark:border-zinc-800 hover:bg-ink-black hover:text-white dark:hover:bg-white dark:hover:text-ink-black hover:border-ink-black dark:hover:border-white transition-all duration-150"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer — CTA */}
              <div className="border-t border-[#E5E5E5] dark:border-zinc-800">
                <Link
                  href={`/products?niche=${cat.id}`}
                  className="flex w-full items-center justify-between px-7 sm:px-8 py-4 bg-transparent hover:bg-ink-black dark:hover:bg-white group/btn transition-all duration-200"
                >
                  <span className="font-monoenterprise text-[10px] uppercase tracking-widest text-ink-black dark:text-white group-hover/btn:text-white dark:group-hover/btn:text-ink-black transition-colors">
                    Explore Inventory
                  </span>
                  <ArrowRight className="h-4 w-4 text-zinc-400 group-hover/btn:text-white dark:group-hover/btn:text-ink-black group-hover/btn:translate-x-1 transition-all duration-200" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Bottom View All CTA ───────────────────────────────── */}
        <div className="mt-16 pt-12 border-t border-[#E5E5E5] dark:border-zinc-800 text-center">
          <p className="font-monoenterprise text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6">
            Browse the full enterprise procurement catalog
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-3 border border-ink-black dark:border-white text-ink-black dark:text-white px-8 py-4 font-monoenterprise text-[11px] uppercase tracking-widest hover:bg-ink-black hover:text-white dark:hover:bg-white dark:hover:text-ink-black transition-all duration-200"
          >
            <span>View All Products</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
