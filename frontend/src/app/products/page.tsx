'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api, getApiErrorMessage } from '../../utils/api';
import { SlidersHorizontal, ShoppingCart, Send, CheckCircle2, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  moq: number;
  images: string[];
  categoryId: string;
  sellerId: string;
}

interface BackendProduct {
  id: string | number;
  slug?: string;
  name?: string;
  title?: string;
  short_description?: string;
  description?: string;
  price_min?: string | number;
  price?: string | number;
  min_order_quantity?: string | number;
  moq?: string | number;
  primary_image?: { image_path?: string };
  primaryImage?: { image_path?: string };
  images?: string[];
  category?: { slug?: string; name?: string };
  category_id?: string | number;
  seller_id?: string | number;
  sellerId?: string | number;
}

const ROBUST_FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'fb-mach-1',
    title: '5-Axis Automated Milling CNC Machine',
    slug: '5-axis-automated-milling-cnc-machine',
    description: 'Precision 5-axis automated milling center for high-throughput aerospace-grade titanium and aluminum carving.',
    price: 1250000,
    moq: 1,
    images: ['https://images.unsplash.com/photo-1616788494672-87d325471252?auto=format&fit=crop&q=80&w=600'],
    categoryId: 'industrial-machinery',
    sellerId: 'fallback-seller'
  },
  {
    id: 'fb-mach-2',
    title: '500-Ton Cold Forming Hydraulic Press',
    slug: '500-ton-cold-forming-hydraulic-press',
    description: 'Industrial grade cold-forming hydraulic press with structural reinforced frame and programmable logic control.',
    price: 840000,
    moq: 1,
    images: ['https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?auto=format&fit=crop&q=80&w=600'],
    categoryId: 'industrial-machinery',
    sellerId: 'fallback-seller'
  },
  {
    id: 'fb-mach-3',
    title: 'Rotary Screw High-Pressure Compressor',
    slug: 'rotary-screw-high-pressure-compressor',
    description: 'Dynamic direct-drive rotary screw air compression system with integrated refrigerated air dryer and receiver tank.',
    price: 185000,
    moq: 2,
    images: ['https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=600'],
    categoryId: 'industrial-machinery',
    sellerId: 'fallback-seller'
  },
  {
    id: 'fb-elec-1',
    title: 'Modular High-Performance Automation PLC',
    slug: 'modular-high-performance-automation-plc',
    description: 'Enterprise rack-mount programmable logic controller supporting dual Ethernet/IP and Profinet node topology.',
    price: 45000,
    moq: 5,
    images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600'],
    categoryId: 'electronics',
    sellerId: 'fallback-seller'
  },
  {
    id: 'fb-elec-2',
    title: 'Vacuum Molded Low-Voltage Circuit Breaker',
    slug: 'vacuum-molded-low-voltage-circuit-breaker',
    description: 'High rupture capacity, molded case main circuit breaker with precise overcurrent and short-circuit trip relays.',
    price: 12500,
    moq: 20,
    images: ['https://images.unsplash.com/photo-1558346490-a72e93cf2c04?auto=format&fit=crop&q=80&w=600'],
    categoryId: 'electronics',
    sellerId: 'fallback-seller'
  },
  {
    id: 'fb-elec-3',
    title: 'IP69K Proximity Range Sensor Array',
    slug: 'ip69k-proximity-range-sensor-array',
    description: 'Extremely robust ultrasonic distance detection sensor for automation lines under harsh temperatures.',
    price: 3400,
    moq: 50,
    images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600'],
    categoryId: 'electronics',
    sellerId: 'fallback-seller'
  },
  {
    id: 'fb-auto-1',
    title: 'Heavy Logistic Truck Differential Gear',
    slug: 'heavy-logistic-truck-differential-gear',
    description: 'Hardened alloy steel drive shafts and matched gearsets built for high-torque commercial truck applications.',
    price: 75000,
    moq: 5,
    images: ['https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=600'],
    categoryId: 'mechanical',
    sellerId: 'fallback-seller'
  },
  {
    id: 'fb-auto-2',
    title: 'High-Load Spherical Roller Bearing',
    slug: 'high-load-spherical-roller-bearing',
    description: 'Premium heavy-duty heat-treated steel spherical bearings designed for massive radial load and rotation.',
    price: 2500,
    moq: 100,
    images: ['https://images.unsplash.com/photo-1530047625168-4b29bf81140a?auto=format&fit=crop&q=80&w=600'],
    categoryId: 'mechanical',
    sellerId: 'fallback-seller'
  },
  {
    id: 'fb-steel-1',
    title: 'Hot-Rolled Carbon Steel Coil (SAE 1008)',
    slug: 'hot-rolled-carbon-steel-coil-sae-1008',
    description: 'Prime quality flat hot-rolled structural steel coil for sheet metal pressing and automotive brackets.',
    price: 65000,
    moq: 5,
    images: ['https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600'],
    categoryId: 'construction-real-estate',
    sellerId: 'fallback-seller'
  },
  {
    id: 'fb-it-1',
    title: '2U Dual Processor Enterprise Xeon Server',
    slug: '2u-dual-processor-enterprise-xeon-server',
    description: 'Hyperdense cloud-scale server with 256GB RAM, redundant hot-swap titanium PSUs, and SAS RAID controllers.',
    price: 450000,
    moq: 1,
    images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600'],
    categoryId: 'computers',
    sellerId: 'fallback-seller'
  }
];

function ProductListContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [niche, setNiche] = useState(searchParams.get('niche') || 'ALL');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('relevant');
  const [loading, setLoading] = useState(true);
  
  // RFQ Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rfqMessage, setRfqMessage] = useState('');
  const [rfqSuccess, setRfqSuccess] = useState(false);
  const [rfqLoading, setRfqLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const dbResponse = await api.get('/products', {
        params: {
          search: q || undefined,
          min_price: minPrice || undefined,
          max_price: maxPrice || undefined,
        },
      });
      
      const rawData = dbResponse.data?.data?.data || dbResponse.data?.data || [];

      const mapped = rawData.map((p: BackendProduct) => {
        const primaryImage = p.primary_image || p.primaryImage;
        return {
          id: String(p.id),
          title: p.name || p.title || 'Untitled product',
          slug: p.slug || String(p.id),
          description: p.short_description || p.description || '',
          price: Number(p.price_min || p.price || 0),
          moq: Number(p.min_order_quantity || p.moq || 1),
          images: primaryImage?.image_path ? [primaryImage.image_path] : (p.images || []),
          categoryId: String(p.category?.slug || p.category_id || ''),
          sellerId: String(p.seller_id || p.sellerId || ''),
        };
      });

      let filtered = mapped;
      
      if (filtered.length === 0) {
        filtered = ROBUST_FALLBACK_PRODUCTS;
      }

      if (niche && niche !== 'ALL') {
        filtered = filtered.filter((p: Product) => String(p.categoryId) === niche);
      }
      if (q) {
        filtered = filtered.filter(
          (p: Product) =>
            String(p.title || '').toLowerCase().includes(q.toLowerCase()) ||
            String(p.description || '').toLowerCase().includes(q.toLowerCase())
        );
      }

      if (sortBy === 'price-low') {
        filtered.sort((a: Product, b: Product) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        filtered.sort((a: Product, b: Product) => b.price - a.price);
      }

      setProducts(filtered);
    } catch (error) {
      console.error('Error fetching products, loading fallback:', error);
      let fallbackFiltered = ROBUST_FALLBACK_PRODUCTS;
      if (niche && niche !== 'ALL') {
        fallbackFiltered = fallbackFiltered.filter((p: Product) => String(p.categoryId) === niche);
      }
      if (q) {
        fallbackFiltered = fallbackFiltered.filter(
          (p: Product) =>
            String(p.title || '').toLowerCase().includes(q.toLowerCase()) ||
            String(p.description || '').toLowerCase().includes(q.toLowerCase())
        );
      }
      if (sortBy === 'price-low') {
        fallbackFiltered.sort((a: Product, b: Product) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        fallbackFiltered.sort((a: Product, b: Product) => b.price - a.price);
      }
      setProducts(fallbackFiltered);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (prodId: string, moq: number) => {
    if (typeof prodId === 'string' && prodId.startsWith('fb-')) {
      alert('This is a demonstration product. Real products from the database can be added to the cart.');
      return;
    }
    try {
      await api.post('/cart/items', { product_id: Number(prodId), quantity: moq });
      alert('Product added to corporate cart successfully!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      const errMsg = getApiErrorMessage(err, 'Failed to add to cart. Please log in as a buyer.');
      alert(errMsg);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [q, niche, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleSendRFQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (typeof selectedProduct.id === 'string' && selectedProduct.id.startsWith('fb-')) {
      alert('This is a demonstration product. RFQs can only be submitted for real products from the database.');
      setSelectedProduct(null);
      return;
    }
    setRfqLoading(true);
    try {
      await api.post('/products/inquire', {
        productId: Number(selectedProduct.id),
        message: rfqMessage,
      });
      setRfqSuccess(true);
      setRfqMessage('');
      setTimeout(() => {
        setSelectedProduct(null);
        setRfqSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to submit RFQ:', error);
      const errMsg = getApiErrorMessage(error, 'Failed to submit RFQ. Please ensure you are logged in.');
      alert(errMsg);
    } finally {
      setRfqLoading(false);
    }
  };

  const clearFilters = () => {
    setQ('');
    setNiche('ALL');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('relevant');
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#111111] text-zinc-900 dark:text-zinc-50 pt-12 transition-colors duration-300">
      <main className="mx-auto max-w-7xl px-6 md:px-16 py-12 flex flex-col lg:flex-row gap-12">
        {/* Boutique Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-10">
          <div className="border border-[#E5E5E5] dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900 rounded-[4px] space-y-8">
            <div className="flex items-center gap-2 pb-4 border-b border-[#E5E5E5] dark:border-zinc-800">
              <SlidersHorizontal className="w-4 h-4 text-[#346941]" />
              <h2 className="font-monoenterprise text-xs font-bold uppercase tracking-widest text-ink-black dark:text-white">
                Refine Selection
              </h2>
            </div>

            {/* Industrial Niche */}
            <div className="space-y-3">
              <label className="block font-monoenterprise text-[10px] uppercase tracking-widest text-zinc-400">
                Industry Category
              </label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full bg-transparent border-b border-[#E5E5E5] dark:border-zinc-800 py-2.5 font-sans text-sm outline-none focus:border-ink-black dark:focus:border-white transition-colors"
              >
                <option value="ALL">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="computers">Computers & IT</option>
                <option value="mechanical">Precision Parts</option>
                <option value="industrial-machinery">Industrial Machinery</option>
                <option value="construction-real-estate">Construction</option>
              </select>
            </div>

            {/* Price Ranges */}
            <div className="space-y-3">
              <label className="block font-monoenterprise text-[10px] uppercase tracking-widest text-zinc-400">
                Valuation Range
              </label>
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 bg-transparent border-b border-[#E5E5E5] dark:border-zinc-800 py-2 font-monoenterprise text-xs placeholder-zinc-400 outline-none"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 bg-transparent border-b border-[#E5E5E5] dark:border-zinc-800 py-2 font-monoenterprise text-xs placeholder-zinc-400 outline-none"
                />
              </div>
            </div>

            {/* Clear button */}
            <button
              onClick={clearFilters}
              className="text-left font-monoenterprise text-[10px] uppercase tracking-widest text-zinc-400 hover:text-ink-black dark:hover:text-white transition-colors pt-4 border-t border-[#E5E5E5] dark:border-zinc-800 w-full"
            >
              Clear All Filters
            </button>
          </div>

          {/* Sourcing Concierge callout */}
          <div className="bg-[#F0EBE5] dark:bg-[#1a1816] p-6 rounded-[4px] space-y-4">
            <p className="font-heading text-2xl italic text-ink-black dark:text-white">
              Sourcing Concierge
            </p>
            <p className="font-sans text-xs text-zinc-600 dark:text-zinc-450 leading-relaxed">
              Personalized procurement, custom billing structures and logistics planning for high-stakes enterprise projects.
            </p>
          </div>
        </aside>

        {/* Editorial Marketplace Canvas */}
        <section className="flex-1 space-y-10">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 border-b border-[#E5E5E5] dark:border-zinc-800 pb-6">
            <div>
              <h1 className="font-heading text-5xl tracking-tighter text-ink-black dark:text-white">
                Technical Precision
              </h1>
              <p className="font-sans text-sm italic text-zinc-500 mt-2">
                A curated selection of vetted industrial assets and OEM components.
              </p>
            </div>
            
            {/* Sorting */}
            <div className="flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-monoenterprise text-[10px] uppercase tracking-widest text-zinc-500 border-none outline-none cursor-pointer"
              >
                <option value="relevant">Relevant</option>
                <option value="price-low">Price Low to High</option>
                <option value="price-high">Price High to Low</option>
              </select>
            </div>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex border-b border-[#E5E5E5] dark:border-zinc-800 pb-3">
            <input
              type="text"
              placeholder="Search components or manufacturer catalog..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="bg-transparent w-full text-base font-sans placeholder-zinc-400 outline-none"
            />
            <button type="submit" className="font-monoenterprise text-xs uppercase tracking-widest text-[#346941] font-bold">
              Filter
            </button>
          </form>

          {/* Products Loading / Empty / Loaded States */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="space-y-4 animate-pulse">
                  <div className="aspect-[4/5] bg-zinc-200 dark:bg-zinc-800 rounded-[4px]" />
                  <div className="h-6 bg-zinc-200 dark:bg-zinc-800 w-3/4 rounded-[2px]" />
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 w-1/4 rounded-[2px]" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-[#E5E5E5] dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[4px] space-y-4">
              <Box className="w-12 h-12 stroke-[1.2] text-zinc-300 dark:text-zinc-700" />
              <h3 className="font-heading text-2xl text-ink-black dark:text-white">No matching assets</h3>
              <p className="font-sans text-xs text-zinc-450 max-w-xs">
                Revise search keywords, category parameters, or pricing boundaries.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
              {products.map((p) => (
                <div key={p.id} className="group flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Full Bleed Image Container */}
                    <Link href={`/products/${p.slug}`}>
                      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-150 dark:bg-zinc-900 border border-[#E5E5E5] dark:border-zinc-800 rounded-[4px] cursor-pointer">
                        {p.images && p.images[0] ? (
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-750">
                            <Box className="w-12 h-12 stroke-[1.2]" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="bg-ink-black dark:bg-white text-white dark:text-ink-black text-[8px] px-3 py-1 font-monoenterprise uppercase tracking-wider rounded-[2px]">
                            VETTED
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="flex justify-between items-start pt-2">
                      <div className="space-y-1 max-w-[70%]">
                        <Link href={`/products/${p.slug}`}>
                          <h3 className="font-heading text-2xl leading-tight text-ink-black dark:text-white line-clamp-2 hover:underline cursor-pointer">
                            {p.title}
                          </h3>
                        </Link>
                        <p className="font-monoenterprise text-[9px] uppercase tracking-widest text-zinc-400 dark:text-zinc-550">
                          Category: {p.categoryId || 'General Sourcing'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-heading text-2xl text-ink-black dark:text-white" suppressHydrationWarning>
                          ₹{p.price.toLocaleString()}
                        </span>
                        <p className="font-monoenterprise text-[8px] uppercase tracking-widest text-zinc-400 mt-1">
                          MOQ: {p.moq} items
                        </p>
                      </div>
                    </div>

                    <p className="font-sans text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                      {p.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mt-6">
                    <button
                      onClick={() => handleAddToCart(p.id, p.moq)}
                      className="flex items-center justify-center border border-[#E5E5E5] dark:border-zinc-800 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors rounded-[4px]"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                    </button>
                    <button
                      onClick={() => setSelectedProduct(p)}
                      className="flex-1 text-center font-monoenterprise text-[10px] uppercase tracking-widest border border-ink-black dark:border-white py-3 hover:bg-ink-black hover:text-white dark:hover:bg-white dark:hover:text-ink-black transition-all rounded-[4px]"
                    >
                      Request Quote (RFQ)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* RFQ Custom Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-lg bg-[#F9F9F9] dark:bg-[#111111] p-8 border border-[#E5E5E5] dark:border-zinc-800 rounded-[4px] relative text-left shadow-2xl"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 font-monoenterprise text-xs text-zinc-400 hover:text-ink-black dark:hover:text-white"
              >
                CLOSE
              </button>

              {rfqSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-pulse" />
                  <h3 className="font-heading text-2xl text-ink-black dark:text-white">RFQ Dispatched.</h3>
                  <p className="font-sans text-xs text-zinc-450">Target OEM node manufacturer has been alerted.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <span className="font-monoenterprise text-[9px] uppercase tracking-widest text-[#346941] px-2 py-0.5 border border-[#346941]/30 rounded-[2px]">
                      RFQ INITIATOR
                    </span>
                    <h3 className="font-heading text-3xl mt-4 text-ink-black dark:text-white">
                      Request Quotation
                    </h3>
                  </div>

                  <div className="p-4 bg-white dark:bg-zinc-900 border border-[#E5E5E5] dark:border-zinc-800 rounded-[2px] flex items-center gap-3">
                    <Box className="w-5 h-5 text-zinc-400" />
                    <div>
                      <h4 className="font-sans text-sm font-bold text-ink-black dark:text-white line-clamp-1">
                        {selectedProduct.title}
                      </h4>
                      <p className="font-monoenterprise text-[9px] text-zinc-400 mt-1 uppercase" suppressHydrationWarning>
                        Base ₹{selectedProduct.price.toLocaleString()} • MOQ: {selectedProduct.moq} units
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSendRFQ} className="space-y-6">
                    <div className="space-y-2">
                      <label className="block font-monoenterprise text-[9px] uppercase tracking-widest text-zinc-400">
                        Specification Detail & Quantities
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={rfqMessage}
                        onChange={(e) => setRfqMessage(e.target.value)}
                        placeholder="Please state expected quantity, target budget, customization specs, and dispatch timeline requirements..."
                        className="w-full bg-transparent border border-[#E5E5E5] dark:border-zinc-800 p-3 font-sans text-xs placeholder-zinc-400 outline-none focus:border-ink-black dark:focus:border-white transition-colors rounded-[2px]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={rfqLoading}
                      className="w-full bg-ink-black dark:bg-white text-white dark:text-ink-black py-4 font-monoenterprise text-[10px] uppercase tracking-widest hover:bg-opacity-90 transition-all rounded-[4px] flex items-center justify-center gap-2"
                    >
                      {rfqLoading ? (
                        <div className="w-4 h-4 border-2 border-white dark:border-ink-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Submit Quote Channel</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductList() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#111111] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#346941] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProductListContent />
    </Suspense>
  );
}
