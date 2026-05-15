'use client';

import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { api } from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ClipboardList, CheckCircle2, MapPin, FileText, ShieldCheck, Building } from 'lucide-react';
import Link from 'next/link';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    moq: number;
    images: string[];
  };
}

interface BackendCartItem {
  id: string | number;
  productId?: string | number;
  product_id?: string | number;
  quantity: number;
  product: {
    id: string | number;
    title?: string;
    name?: string;
    price?: number | string;
    price_min?: number | string;
    moq?: number | string;
    min_order_quantity?: number | string;
    images?: string[];
    primary_image?: { image_path?: string };
    primaryImage?: { image_path?: string };
  };
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [shippingAdd, setShippingAdd] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      const cartItems = response.data.data.cart?.items || [];
      setItems(cartItems.map((item: BackendCartItem) => ({
        id: String(item.id),
        productId: String(item.productId || item.product_id || item.product.id),
        quantity: item.quantity,
        product: {
          id: String(item.product.id),
          title: item.product.title || item.product.name || 'Untitled product',
          price: Number(item.product.price || item.product.price_min || 0),
          moq: Number(item.product.moq || item.product.min_order_quantity || 1),
          images: item.product.images || (item.product.primary_image?.image_path ? [item.product.primary_image.image_path] : []),
        },
      })));
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (itemId: string, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;

    try {
      // Optimistic update
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
      );
      await api.put(`/cart/${itemId}`, { quantity: newQty });
    } catch (error) {
      console.error('Failed to update quantity:', error);
      fetchCart(); // Revert on failure
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      await api.delete(`/cart/${itemId}`);
    } catch (error) {
      console.error('Failed to remove item:', error);
      fetchCart();
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAdd.trim()) return;

    setPlacingOrder(true);
    try {
      await api.post('/orders', { shippingAdd });
      setItems([]);
      setOrderSuccess(true);
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setPlacingOrder(false);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#fafafc] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 pt-24">
        <Header />
        <main className="mx-auto max-w-xl px-6 py-24 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <div className="w-96 h-96 bg-emerald-500/5 blur-[100px] rounded-full"></div>
          </div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative rounded-[40px] bg-white/80 p-10 shadow-2xl border border-zinc-200/60 backdrop-blur-xl dark:bg-zinc-900/80 dark:border-zinc-800/60"
          >
            <div className="mx-auto h-16 w-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="font-hero text-2xl font-black tracking-tight text-zinc-950 dark:text-white mb-3">Allocation Activated</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed mb-8">
              The operational pipeline has processed your volume order node. Target manufacturers have been assigned to dispatch freight shipping manifests and secure tax invoicing profiles.
            </p>
            <div className="flex flex-col gap-3.5">
              <Link
                href="/products"
                className="flex items-center justify-center space-x-2 rounded-2xl bg-brand-primary hover:bg-indigo-600 text-white font-black py-4 text-[13px] shadow-lg shadow-indigo-600/15 transition-all active:scale-[0.99]"
              >
                <span>Allocate More Assets</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/buyer"
                className="flex items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 dark:bg-zinc-800 dark:border-zinc-750 text-zinc-700 dark:text-zinc-300 font-black py-3.5 text-[13px] transition-all"
              >
                View Master Dashboard
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 pt-24 selection:bg-brand-primary selection:text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="mb-12">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-brand-primary bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full mb-4">
            <Building className="h-3 w-3" />
            <span>Procurement Queue</span>
          </span>
          <h1 className="font-hero text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white mt-1">Corporate Cart</h1>
        </div>

        {loading ? (
          <div className="py-28 flex items-center justify-center">
            <div className="h-10 w-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-[40px] bg-white border border-zinc-200/60 p-16 text-center shadow-xl shadow-indigo-600/[0.01] dark:bg-zinc-900 dark:border-zinc-800/60 max-w-2xl mx-auto">
            <div className="h-16 w-16 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mx-auto mb-6">
              <ShoppingCart className="h-6 w-6 text-zinc-400 dark:text-zinc-600" />
            </div>
            <h3 className="font-hero text-xl font-black text-zinc-950 dark:text-white mb-2">Global queue is unallocated</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto font-medium leading-relaxed">Browse our premium global component catalog and reserve OEM inventories to build custom bill-of-materials.</p>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center space-x-2 rounded-2xl bg-brand-primary hover:bg-indigo-600 py-3.5 px-8 text-sm font-black text-white shadow-lg shadow-indigo-600/15 transition-all"
            >
              <span>Sourcing Directory</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {/* List of queued products */}
            <div className="lg:col-span-2 space-y-5">
              <div className="rounded-[32px] bg-white shadow-xl shadow-indigo-600/[0.01] border border-zinc-200/60 overflow-hidden dark:bg-zinc-900 dark:border-zinc-800/60">
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 hover:bg-zinc-50/40 dark:hover:bg-zinc-850/20 transition-all"
                      >
                        <div className="flex items-center space-x-5 flex-1">
                          <div className="h-20 w-20 rounded-[20px] bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center overflow-hidden border border-zinc-100 dark:border-zinc-900 text-zinc-300 shrink-0">
                            {item.product.images && item.product.images[0] ? (
                              <img src={item.product.images[0]} alt={item.product.title} className="object-cover w-full h-full transition-transform duration-500" />
                            ) : (
                              <ShoppingCart className="h-6 w-6 text-zinc-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-hero font-bold text-base text-zinc-950 dark:text-white line-clamp-1 leading-snug">{item.product.title}</h4>
                            <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
                              <span className="text-xs font-semibold text-zinc-400" suppressHydrationWarning>Base ₹{item.product.price.toLocaleString()}</span>
                              <div className="h-1 w-1 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                              <span className="text-[9px] uppercase font-black text-brand-primary tracking-wider">Min: {item.product.moq}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-8 shrink-0">
                          {/* Luxury Increment Control */}
                          <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden bg-white dark:bg-zinc-800 p-0.5 shadow-sm">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                              className="p-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 text-[13px] font-black text-zinc-900 dark:text-white w-9 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                              className="p-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="text-right w-28">
                            <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider block mb-0.5">Batch Total</span>
                            <span className="text-base font-black text-zinc-950 dark:text-white" suppressHydrationWarning>
                              ₹{(item.product.price * item.quantity).toLocaleString()}
                            </span>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="h-9 w-9 rounded-xl border border-zinc-200 text-zinc-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 dark:border-zinc-800 dark:text-zinc-500 dark:hover:text-red-400 dark:hover:bg-red-950/30 flex items-center justify-center transition-all"
                            title="Deallocate Row"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Sticky Checkout Summary Component */}
            <div className="space-y-6">
              <div className="sticky top-24 rounded-[32px] bg-white border border-zinc-200/60 p-7 shadow-xl shadow-indigo-600/[0.01] dark:bg-zinc-900 dark:border-zinc-800/60">
                <div className="flex items-center space-x-2 font-black uppercase tracking-widest text-[10px] text-zinc-500 dark:text-zinc-400 mb-6 pb-5 border-b border-zinc-100 dark:border-zinc-800">
                  <ClipboardList className="h-4 w-4 text-brand-primary" />
                  <span>Procurement Invoice Ledger</span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold text-zinc-400">
                    <span>Subtotal Ledger</span>
                    <span className="text-zinc-950 dark:text-white font-black" suppressHydrationWarning>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-zinc-400">
                    <span>GST Liability (18%)</span>
                    <span className="text-zinc-950 dark:text-white font-black" suppressHydrationWarning>₹{(subtotal * 0.18).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-zinc-400">
                    <span>Operational Freight</span>
                    <span className="text-emerald-500 font-black uppercase tracking-wide">ALLOCATED</span>
                  </div>
                  <div className="pt-5 mt-1 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-end">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Aggregate Total</span>
                    <span className="text-2xl font-black text-brand-primary dark:text-indigo-400 flex items-baseline leading-none" suppressHydrationWarning>
                      <span className="text-sm font-black mr-0.5">₹</span>
                      {(subtotal * 1.18).toLocaleString()}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleCheckout} className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2.5 ml-1 flex items-center space-x-1.5">
                      <MapPin className="h-3.5 w-3.5 text-brand-primary" />
                      <span>Corporate Destination Address</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={shippingAdd}
                      onChange={(e) => setShippingAdd(e.target.value)}
                      placeholder="e.g. Dock 4, Hub B, Tata Sourcing Hub, Navi Mumbai, Maharashtra, 400708"
                      className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 px-4 text-[13px] font-medium text-zinc-950 placeholder-zinc-400 outline-none transition-all focus:border-brand-primary focus:ring-4 focus:ring-indigo-500/5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>

                  <div className="rounded-xl bg-indigo-50/50 border border-indigo-100/40 dark:bg-indigo-950/20 dark:border-indigo-900/30 p-3 flex items-start gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold leading-normal">Secure B2B transaction node. Order status will be visible on authorized seller networks.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={placingOrder}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-brand-primary hover:bg-indigo-600 py-4 text-[15px] font-black text-white shadow-lg shadow-indigo-600/15 transition-all hover:shadow-indigo-600/25 disabled:opacity-50 active:scale-[0.99]"
                  >
                    {placingOrder ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Execute Order Pipeline</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

