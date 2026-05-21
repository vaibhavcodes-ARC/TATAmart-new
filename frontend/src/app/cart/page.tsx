'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ClipboardList, CheckCircle2, ShieldCheck, Building } from 'lucide-react';
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
  const [orderSuccess] = useState(false);

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
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
      );
      await api.put(`/cart/${itemId}`, { quantity: newQty });
    } catch (error) {
      console.error('Failed to update quantity:', error);
      fetchCart();
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

  // Checkout flow removed from cart page — enterprise checkout handled in /checkout

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#111111] text-ink-black dark:text-zinc-50 pt-24 transition-colors duration-300">
        <main className="mx-auto max-w-xl px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border border-border-subtle dark:border-zinc-800 bg-white dark:bg-[#151515] p-10 rounded-none shadow-sm"
          >
            <div className="mx-auto h-12 w-12 border border-secondary text-secondary rounded-none flex items-center justify-center mb-6">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h1 className="font-heading text-3xl font-light tracking-tight text-ink-black dark:text-white mb-4">
              Order <span className="italic">Created</span>
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed mb-8">
              Your B2B order has been successfully created. We are assigning suppliers to verify shipping and tax invoice details.
            </p>
            <div className="flex flex-col gap-4">
              <Link
                href="/products"
                className="w-full flex items-center justify-center gap-2 rounded-none bg-ink-black hover:bg-zinc-800 text-white font-monoenterprise uppercase tracking-widest py-4 text-xs transition-all active:scale-[0.99] dark:bg-white dark:hover:bg-zinc-200 dark:text-ink-black"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/buyer"
                className="w-full flex items-center justify-center rounded-none border border-border-subtle hover:bg-zinc-50 text-ink-black dark:text-white dark:border-zinc-800 dark:hover:bg-zinc-900 font-monoenterprise uppercase tracking-widest py-3.5 text-xs transition-all"
              >
                Go to Dashboard
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#111111] text-ink-black dark:text-zinc-50 pt-24 selection:bg-[#043F1C] selection:text-white transition-colors duration-300">

      <main className="mx-auto max-w-7xl px-6 py-12 md:px-16">
        <div className="mb-12 border-b border-border-subtle dark:border-zinc-800 pb-8">
          <span className="font-monoenterprise text-[10px] tracking-[0.25em] text-zinc-400 dark:text-zinc-500 uppercase flex items-center gap-2 mb-3">
            <Building className="h-3.5 w-3.5 text-secondary" />
            <span>Shopping Cart</span>
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-light tracking-tight text-ink-black dark:text-white">
            Procurement <span className="italic">Manifest</span>
          </h1>
        </div>

        {loading ? (
          <div className="py-28 flex items-center justify-center">
            <div className="h-8 w-8 border border-ink-black border-t-transparent dark:border-white animate-spin"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="border border-border-subtle dark:border-zinc-800 bg-white dark:bg-[#151515] p-16 text-center max-w-2xl mx-auto rounded-none">
            <div className="h-12 w-12 border border-border-subtle dark:border-zinc-800 flex items-center justify-center text-zinc-400 mx-auto mb-6">
              <ShoppingCart className="h-5 w-5 text-zinc-500" />
            </div>
            <h3 className="font-heading text-2xl font-light text-ink-black dark:text-white mb-3">Global Queue is Empty</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto font-sans leading-relaxed mb-8">
              Browse our premium global components catalog and reserve OEM inventories to build your custom bill-of-materials.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center space-x-2 rounded-none bg-ink-black hover:bg-zinc-800 py-4 px-8 text-xs font-monoenterprise uppercase tracking-widest text-white transition-all dark:bg-white dark:hover:bg-zinc-200 dark:text-ink-black"
            >
              <span>Sourcing Directory</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
            {/* List of queued products */}
            <div className="lg:col-span-2 space-y-6">
              <div className="border border-border-subtle dark:border-zinc-800 bg-white dark:bg-[#151515] rounded-none overflow-hidden">
                <div className="divide-y divide-border-subtle dark:divide-zinc-800">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-5 flex-1">
                          <div className="h-20 w-20 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center overflow-hidden border border-border-subtle dark:border-zinc-800 text-zinc-300 shrink-0 rounded-none">
                            {item.product.images && item.product.images[0] ? (
                              <img src={item.product.images[0]} alt={item.product.title} className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-300" />
                            ) : (
                              <ShoppingCart className="h-5 w-5 text-zinc-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-sans font-semibold text-base text-zinc-950 dark:text-white line-clamp-1 leading-snug">
                              {item.product.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                              <span className="text-xs font-monoenterprise text-zinc-400 dark:text-zinc-500" suppressHydrationWarning>
                                Base ₹{item.product.price.toLocaleString()}
                              </span>
                              <div className="h-1.5 w-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                              <span className="text-[9px] uppercase font-monoenterprise text-secondary tracking-widest">
                                MOQ: {item.product.moq}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-8 shrink-0">
                          {/* Increment Control */}
                          <div className="flex items-center border border-border-subtle dark:border-zinc-800 bg-white dark:bg-zinc-900 p-0.5 rounded-none">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                              className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-none text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 text-xs font-monoenterprise text-zinc-900 dark:text-white w-9 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                              className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-none text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="text-right w-28 font-monoenterprise">
                            <span className="text-[9px] uppercase text-zinc-400 dark:text-zinc-500 tracking-widest block mb-0.5">Subtotal</span>
                            <span className="text-[14px] font-semibold text-ink-black dark:text-white" suppressHydrationWarning>
                              ₹{(item.product.price * item.quantity).toLocaleString()}
                            </span>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="h-8 w-8 border border-border-subtle dark:border-zinc-800 text-zinc-400 hover:text-red-650 hover:border-red-200 dark:hover:text-red-400 dark:hover:border-red-950 flex items-center justify-center transition-all duration-200"
                            title="Remove Item"
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

            {/* Checkout Summary Component */}
            <div className="space-y-6">
              <div className="sticky top-24 border border-border-subtle dark:border-zinc-800 bg-white dark:bg-[#151515] p-7 rounded-none">
                <div className="flex items-center space-x-2 font-monoenterprise uppercase tracking-[0.2em] text-[10px] text-zinc-450 dark:text-zinc-550 mb-6 pb-5 border-b border-border-subtle dark:border-zinc-800">
                  <ClipboardList className="h-4 w-4 text-secondary" />
                  <span>Order Valuation</span>
                </div>

                <div className="space-y-4 font-monoenterprise">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Assembly Total</span>
                    <span className="text-ink-black dark:text-white font-semibold" suppressHydrationWarning>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>GST (18%)</span>
                    <span className="text-ink-black dark:text-white font-semibold" suppressHydrationWarning>₹{(subtotal * 0.18).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Freight Logistics</span>
                    <span className="text-secondary font-semibold uppercase tracking-widest text-[10px]">FREE</span>
                  </div>
                  <div className="pt-5 mt-1 border-t border-border-subtle dark:border-zinc-800 flex justify-between items-end">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-550">Grand Total</span>
                    <span className="text-xl font-semibold text-secondary dark:text-emerald-400 flex items-baseline leading-none" suppressHydrationWarning>
                      <span className="text-xs mr-0.5">₹</span>
                      {(subtotal * 1.18).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border-subtle dark:border-zinc-800 space-y-5">
                  <div className="border border-secondary/20 bg-secondary/5 dark:bg-emerald-950/10 dark:border-emerald-900/20 p-4">
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                      <p className="text-[10px] text-secondary dark:text-emerald-400 font-sans leading-normal">
                        Secure transactional pipeline. Corporate verification and GSTIN details will be collected on the next page.
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-2 rounded-none bg-ink-black hover:bg-zinc-800 py-4 text-xs font-monoenterprise uppercase tracking-widest text-white transition-all active:scale-[0.99] dark:bg-white dark:hover:bg-zinc-200 dark:text-ink-black"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
