'use client';

import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { api } from '../../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Send,
  CheckCircle2,
  Clock,
  HelpCircle,
  Package,
  PlusCircle,
  TrendingUp,
  Truck,
  ShieldCheck,
  Check,
  ShoppingBag,
  ArrowRight,
  User,
  X,
  AlertCircle,
  Layers,
  LayoutDashboard,
  Activity,
  DollarSign
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface RfqResponse {
  id: string;
  priceQuote: number;
  leadTimeDays: number;
  notes: string;
  status: string;
  createdAt: string;
  seller: {
    id: string;
    name: string;
    profile?: {
      companyName?: string;
      isVerified?: boolean;
    };
  };
}

interface Rfq {
  id: string;
  title: string;
  description: string;
  quantity: number;
  targetPrice: number | null;
  status: string;
  createdAt: string;
  category: {
    name: string;
  };
  product?: {
    id: string;
    title: string;
    images: string[];
    price: number;
  } | null;
  responses: RfqResponse[];
}

export default function BuyerDashboard() {
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRfqForm, setShowRfqForm] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  // RFQ Form States
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formQty, setFormQty] = useState(10);
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Cart/Checkout States
  const [checkoutRfq, setCheckoutRfq] = useState<Rfq | null>(null);
  const [checkoutResponse, setCheckoutResponse] = useState<RfqResponse | null>(null);
  const [checkoutShipping, setCheckoutShipping] = useState('');
  const [checkoutSubmitting, setCheckoutSubmitting] = useState(false);

  const fetchRfqsAndCategories = async () => {
    try {
      setLoading(true);
      const [rfqRes, catRes] = await Promise.all([
        api.get('/rfqs/buyer'),
        api.get('/categories')
      ]);
      setRfqs(rfqRes.data.data || rfqRes.data);
      const categoriesData = catRes.data?.data || catRes.data || [];
      setCategories(categoriesData);
      if (categoriesData.length > 0) {
        setFormCategory(String(categoriesData[0].id));
      }
    } catch (err) {
      console.error('Failed to load procurement details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRfqsAndCategories();
  }, []);

  const handleCreateRfq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormSubmitting(true);
      await api.post('/rfqs', {
        title: formTitle,
        description: formDesc,
        quantity: formQty,
        targetPrice: formPrice ? parseFloat(formPrice) : null,
        categoryId: formCategory,
      });

      // Reset form
      setFormTitle('');
      setFormDesc('');
      setFormQty(10);
      setFormPrice('');
      setShowRfqForm(false);
      
      // Refresh
      fetchRfqsAndCategories();
    } catch (err) {
      console.error('Error submitting RFQ:', err);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleSelectQuote = async (quote: RfqResponse, rfq: Rfq) => {
    try {
      // 1. Accept quotation in backend
      await api.post(`/rfqs/responses/${quote.id}/select`);
      
      // 2. Clear previous cart, and insert this quote product/seller dynamically
      setCheckoutRfq(rfq);
      setCheckoutResponse(quote);
    } catch (err) {
      console.error('Error accepting quote:', err);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutResponse || !checkoutRfq) return;

    try {
      setCheckoutSubmitting(true);
      
      await api.post('/cart', {
        productId: checkoutRfq.product?.id || 'seeded-product-id',
        quantity: checkoutRfq.quantity,
      });

      await api.post('/orders', {
        shippingAdd: checkoutShipping || 'Enterprise Headquarters, Block C, Sector 62, Noida, UP - 201301',
        rfqResponseId: checkoutResponse.id,
      });

      setCheckoutRfq(null);
      setCheckoutResponse(null);
      setCheckoutShipping('');
      setSuccessModal(true);

      fetchRfqsAndCategories();
    } catch (err) {
      console.error('Failed to place B2B order:', err);
    } finally {
      setCheckoutSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-500 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-0.5 rounded-full">
            <Clock className="h-2.5 w-2.5" />
            <span>Awaiting Bids</span>
          </span>
        );
      case 'RESPONDED':
        const offersCount = rfqs.find(r => r.status === 'RESPONDED')?.responses.length || 1;
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-brand-primary bg-indigo-50 dark:bg-indigo-950/30 px-2.5 py-0.5 rounded-full">
            <Send className="h-2.5 w-2.5" />
            <span>{offersCount} Offers Received</span>
          </span>
        );
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="h-2.5 w-2.5" />
            <span>Finalized</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 px-2.5 py-0.5 rounded-full">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 pt-24 selection:bg-brand-primary selection:text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        {/* High-level modern command deck topbar */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-brand-primary bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full mb-3">
              <LayoutDashboard className="h-3 w-3" />
              <span>Procurement Command</span>
            </span>
            <h1 className="font-hero text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white">RFQ Workstation</h1>
            <p className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400 mt-1">Oversee enterprise Request-For-Quotes, conduct competitive matrix analyses, and activate manufacturer contracts.</p>
          </div>
          <button
            id="btn-post-rfq"
            onClick={() => setShowRfqForm(true)}
            className="inline-flex items-center justify-center space-x-2 rounded-2xl bg-brand-primary hover:bg-indigo-600 py-3.5 px-7 text-sm font-black text-white shadow-lg shadow-indigo-600/15 transition-all active:scale-[0.98]"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Dispatch Global RFQ</span>
          </button>
        </div>

        {/* Statistical capsule strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="rounded-[28px] bg-white border border-zinc-200/60 p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800/60 flex items-center space-x-5 group hover:shadow-md transition-all duration-300">
            <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-brand-primary dark:bg-indigo-950/40 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Active Manifests</span>
              <h3 className="font-hero text-3xl font-black text-zinc-950 dark:text-white mt-0.5">{rfqs.length}</h3>
            </div>
          </div>

          <div className="rounded-[28px] bg-white border border-zinc-200/60 p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800/60 flex items-center space-x-5 group hover:shadow-md transition-all duration-300">
            <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Bidding Cycles</span>
              <h3 className="font-hero text-3xl font-black text-zinc-950 dark:text-white mt-0.5">
                {rfqs.filter((i) => i.status === 'PENDING').length}
              </h3>
            </div>
          </div>

          <div className="rounded-[28px] bg-white border border-zinc-200/60 p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800/60 flex items-center space-x-5 group hover:shadow-md transition-all duration-300">
            <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Secured Nodes</span>
              <h3 className="font-hero text-3xl font-black text-zinc-950 dark:text-white mt-0.5">
                {rfqs.filter((i) => i.status === 'CLOSED').length}
              </h3>
            </div>
          </div>
        </div>

        {/* Advanced multi-stage procurement console container */}
        <div className="rounded-[36px] bg-white border border-zinc-200/60 shadow-xl shadow-indigo-600/[0.01] dark:bg-zinc-900 dark:border-zinc-800/60 overflow-hidden mb-24">
          <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/30 dark:bg-zinc-850/10">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-brand-primary" />
              <h3 className="font-hero text-[15px] font-bold text-zinc-950 dark:text-white uppercase tracking-wider">Operational Log</h3>
            </div>
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full uppercase tracking-widest">Synchronized</span>
          </div>

          {loading ? (
            <div className="py-32 flex items-center justify-center">
              <div className="h-10 w-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : rfqs.length === 0 ? (
            <div className="py-24 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-6 text-zinc-300 dark:text-zinc-700 border border-zinc-100 dark:border-zinc-800">
                <Layers className="h-7 w-7" />
              </div>
              <p className="font-hero text-lg font-black text-zinc-950 dark:text-white">Sourcing matrix is vacant</p>
              <p className="text-xs mt-2 text-zinc-500 max-w-xs font-medium leading-relaxed">No procurement payloads discovered. Dispatch an RFQ to activate international factory bid networks.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {rfqs.map((rfq, idx) => (
                <motion.div
                  key={rfq.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="p-8 hover:bg-zinc-50/40 dark:hover:bg-zinc-850/10 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex items-start space-x-5 flex-1 min-w-0">
                      <div className="h-14 w-14 rounded-2xl bg-zinc-50 border border-zinc-100 dark:bg-zinc-950 dark:border-zinc-850 flex items-center justify-center shrink-0">
                        <Package className="h-6 w-6 text-zinc-400 dark:text-zinc-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="font-hero text-lg font-bold text-zinc-950 dark:text-white line-clamp-1 leading-none">{rfq.title}</h4>
                          {getStatusBadge(rfq.status)}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
                          <span className="text-brand-primary font-black">{rfq.category.name}</span>
                          <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                          <span suppressHydrationWarning>{rfq.quantity.toLocaleString()} units</span>
                          {rfq.targetPrice && (
                            <>
                              <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                              <span suppressHydrationWarning>Tgt: ₹{rfq.targetPrice.toLocaleString()}</span>
                            </>
                          )}
                          <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                          <span>Logged: {new Date(rfq.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4 font-medium leading-relaxed bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/30 dark:border-zinc-800/30 p-4 rounded-2xl max-w-4xl">
                          {rfq.description}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex lg:flex-col items-end justify-center">
                      <span className="font-mono text-[10px] text-zinc-400 tracking-widest bg-zinc-50 border border-zinc-100 dark:bg-zinc-800 dark:border-zinc-750 px-2.5 py-1 rounded-lg font-black">
                        #{rfq.id.slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Matrix list of incoming responses for this node */}
                  {rfq.responses && rfq.responses.length > 0 && (
                    <div className="mt-8 pt-7 border-t border-dashed border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center gap-2 mb-5">
                        <TrendingUp className="h-4 w-4 text-brand-primary" />
                        <h5 className="font-hero text-[11px] font-black uppercase tracking-widest text-zinc-400">
                          Supplier Bidding Proposals ({rfq.responses.length})
                        </h5>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {rfq.responses.map((quote) => (
                          <div
                            key={quote.id}
                            className={`group rounded-3xl border p-5 transition-all flex flex-col justify-between relative overflow-hidden ${
                              quote.status === 'ACCEPTED'
                                ? 'bg-emerald-50/40 border-emerald-200/60 dark:bg-emerald-950/10 dark:border-emerald-900/40 shadow-lg shadow-emerald-600/[0.02]'
                                : 'bg-white border-zinc-200/60 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-600/[0.01] dark:bg-zinc-900 dark:border-zinc-800/60'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-3 mb-3">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <div className="h-6 w-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-400 group-hover:bg-indigo-50 group-hover:text-brand-primary transition-colors">
                                    <User className="h-3 w-3" />
                                  </div>
                                  <span className="font-hero text-[13px] font-bold text-zinc-950 dark:text-white truncate">
                                    {quote.seller.profile?.companyName || quote.seller.name}
                                  </span>
                                  {quote.seller.profile?.isVerified && (
                                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                  )}
                                </div>
                                <span className="font-black text-sm text-brand-primary dark:text-indigo-400 shrink-0" suppressHydrationWarning>
                                  ₹{quote.priceQuote.toLocaleString()}/unit
                                </span>
                              </div>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium italic mb-5 line-clamp-2">
                                &ldquo;{quote.notes || 'No additional annotations.'}&rdquo;
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
                              <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400">
                                <Truck className="h-3.5 w-3.5" />
                                <span>{quote.leadTimeDays} days SLA</span>
                              </div>
                              {rfq.status !== 'CLOSED' ? (
                                <button
                                  onClick={() => handleSelectQuote(quote, rfq)}
                                  className="text-[11px] font-black uppercase tracking-wider bg-brand-primary hover:bg-indigo-600 text-white py-2 px-4 rounded-xl shadow-md shadow-indigo-600/10 transition-all flex items-center gap-1.5 active:scale-95"
                                >
                                  <span>Secure Bid</span>
                                  <ArrowRight className="h-3 w-3" />
                                </button>
                              ) : quote.status === 'ACCEPTED' ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-600">
                                  <Check className="h-3.5 w-3.5" />
                                  <span>Accepted Node</span>
                                </span>
                              ) : (
                                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300 dark:text-zinc-700">Dormant</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Multi-step Post New RFQ Slide Overlay */}
      <AnimatePresence>
        {showRfqForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRfqForm(false)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl rounded-[36px] bg-white p-8 shadow-2xl border border-zinc-200/60 dark:bg-zinc-900 dark:border-zinc-800/60 overflow-hidden z-10"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-brand-primary" />
                  <h3 className="font-hero text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wider">Dispatch RFQ Manifest</h3>
                </div>
                <button onClick={() => setShowRfqForm(false)} className="h-8 w-8 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-400 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateRfq} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">Contract / SKU Identifier</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. 500x 2.5in SATA Enterprise Solid State Drives"
                    className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 px-4 text-[13px] font-medium text-zinc-950 outline-none transition-all focus:border-brand-primary dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">Procurement Category Channel</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 px-4 text-[13px] font-bold text-zinc-950 outline-none focus:border-brand-primary dark:border-zinc-700 dark:bg-zinc-800 dark:text-white cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">Bulk Allocation Volume</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formQty}
                      onChange={(e) => setFormQty(parseInt(e.target.value))}
                      className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 px-4 text-[13px] font-medium text-zinc-950 outline-none focus:border-brand-primary dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">Target Unit Quote (INR)</label>
                    <input
                      type="number"
                      placeholder="e.g. 4500"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 px-4 text-[13px] font-medium text-zinc-950 outline-none focus:border-brand-primary dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">Detailed Payload Specifications</label>
                  <textarea
                    required
                    rows={3}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Enter industrial technical data sheets, OEM certifications, and special packaging demands..."
                    className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 px-4 text-[13px] font-medium text-zinc-950 outline-none transition-all focus:border-brand-primary dark:border-zinc-700 dark:bg-zinc-800 dark:text-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full rounded-2xl bg-brand-primary hover:bg-indigo-600 py-4 text-[14px] font-black text-white transition-all shadow-lg shadow-indigo-600/15 flex items-center justify-center mt-2 active:scale-[0.99]"
                >
                  {formSubmitting ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>Broadcast to Global Factory Mesh</span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Confirmation Overlay */}
      <AnimatePresence>
        {checkoutResponse && checkoutRfq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setCheckoutRfq(null);
                setCheckoutResponse(null);
              }}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg rounded-[36px] bg-white p-8 shadow-2xl border border-zinc-200/60 dark:bg-zinc-900 dark:border-zinc-800/60 overflow-hidden z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-brand-primary" />
                  <h3 className="font-hero text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wider">Execute Contract Node</h3>
                </div>
                <button
                  onClick={() => {
                    setCheckoutRfq(null);
                    setCheckoutResponse(null);
                  }}
                  className="h-8 w-8 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-400 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="bg-zinc-50 border border-zinc-200/60 dark:bg-zinc-950/40 dark:border-zinc-800/50 p-5 rounded-2xl mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] text-zinc-400 font-black uppercase tracking-widest">Secured Transaction Object</span>
                  <span className="font-mono text-[10px] font-black text-brand-primary uppercase">#{checkoutRfq.id.slice(0, 8)}</span>
                </div>
                <h4 className="font-hero text-sm font-bold text-zinc-950 dark:text-white mb-4 border-b border-zinc-200/40 pb-2">{checkoutRfq.title}</h4>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <span className="block text-[9px] text-zinc-400 font-black uppercase tracking-widest mb-0.5">Assigned OEM</span>
                    <span className="font-bold text-xs text-zinc-950 dark:text-white line-clamp-1">{checkoutResponse.seller.name}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 font-black uppercase tracking-widest mb-0.5">Contract Unit Rate</span>
                    <span className="font-bold text-xs text-zinc-950 dark:text-white" suppressHydrationWarning>₹{checkoutResponse.priceQuote.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 font-black uppercase tracking-widest mb-0.5">Contract Mass</span>
                    <span className="font-bold text-xs text-zinc-950 dark:text-white">{checkoutRfq.quantity} Units</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 font-black uppercase tracking-widest mb-0.5">Aggregate Cost</span>
                    <span className="font-black text-xs text-brand-primary" suppressHydrationWarning>₹{(checkoutResponse.priceQuote * checkoutRfq.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1 flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 text-brand-primary" />
                    <span>Enterprise Gateway Shipping Address</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={checkoutShipping}
                    onChange={(e) => setCheckoutShipping(e.target.value)}
                    placeholder="e.g. Terminal B, Warehouse 4, TATAmart Node, Pune, IN"
                    className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 px-4 text-[13px] font-medium text-zinc-950 outline-none focus:border-brand-primary dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>

                <div className="flex items-start gap-2.5 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50/40 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-200/20">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span className="font-medium leading-normal">Signing this allocation pipeline executes a contract binding agreement, locking unit rates and closing standard bidding cycles for other vendors.</span>
                </div>

                <button
                  type="submit"
                  disabled={checkoutSubmitting}
                  className="w-full rounded-2xl bg-brand-primary hover:bg-indigo-600 py-4 text-[14px] font-black text-white transition-all shadow-lg shadow-indigo-600/15 flex items-center justify-center mt-2 active:scale-[0.99]"
                >
                  {checkoutSubmitting ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>Cryptographically Secure & Order</span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Large Premium Confirmation Success Overlay */}
      <AnimatePresence>
        {successModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSuccessModal(false)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md rounded-[40px] bg-white p-10 shadow-2xl border border-zinc-200/60 dark:bg-zinc-900 dark:border-zinc-800/60 text-center overflow-hidden z-10"
            >
              <div className="mx-auto h-20 w-20 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mb-6 border border-emerald-100 dark:border-emerald-900/30 relative">
                <div className="absolute inset-0 bg-emerald-500/10 animate-ping rounded-full pointer-events-none"></div>
                <motion.div
                  initial={{ scale: 0.5, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
                >
                  <ShoppingBag className="h-9 w-9 relative z-10" />
                </motion.div>
              </div>

              <h3 className="font-hero text-2xl font-black text-zinc-950 dark:text-white mb-3">Allocation Dispatched</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-xs mx-auto">
                Your multi-party transaction has successfully passed authentication nodes. High-volume manufacturer logs are active.
              </p>

              <div className="bg-zinc-50 border border-zinc-200/40 dark:bg-zinc-950/30 dark:border-zinc-800/50 p-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-7 flex items-center justify-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Dynamic Ledger Authenticated</span>
              </div>

              <button
                onClick={() => setSuccessModal(false)}
                className="w-full rounded-2xl bg-brand-primary hover:bg-indigo-600 py-4 text-[13px] font-black text-white shadow-lg shadow-indigo-600/15 transition-all mt-8 active:scale-[0.99]"
              >
                Return to Workstation Console
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

