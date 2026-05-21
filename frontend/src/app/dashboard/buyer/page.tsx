'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../../utils/api';
import { useAuthStore } from '../../../store/useAuthStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Send,
  CheckCircle2,
  Clock,
  
  PlusCircle,
  TrendingUp,
  Truck,
  ShieldCheck,
  Check,
  ShoppingBag,
  ArrowRight,
  
  X,
  AlertCircle,
  Layers,
  LayoutDashboard,
  Activity,
  DollarSign,
  Download,
  RefreshCw
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

interface Order {
  id: string;
  shippingAdd?: string;
  createdAt?: string;
  total?: number;
  status?: string;
}

export default function BuyerDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
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

  // Orders and Transaction History
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchRfqsAndCategories = async () => {
    try {
      setLoading(true);
      const [rfqRes, catRes, ordersRes] = await Promise.all([
        api.get('/rfqs/buyer'),
        api.get('/categories'),
        api.get('/orders')
      ]);
      setRfqs(rfqRes.data.data || rfqRes.data);
      setOrders(ordersRes.data.data || ordersRes.data || []);
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

  const getStatusBadge = (status: string, offersCount?: number) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 text-[9px] font-monoenterprise uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 border border-amber-200/30">
            <Clock className="h-2.5 w-2.5" />
            <span>Awaiting Bids</span>
          </span>
        );
      case 'RESPONDED':
        return (
          <span className="inline-flex items-center gap-1.5 text-[9px] font-monoenterprise uppercase tracking-wider text-[#043F1C] bg-[#F0EBE5] dark:bg-zinc-800 px-2 py-0.5 border border-zinc-350/30">
            <Send className="h-2.5 w-2.5" />
            <span>Offers Received{offersCount ? ` (${offersCount})` : ''}</span>
          </span>
        );
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1.5 text-[9px] font-monoenterprise uppercase tracking-wider text-[#043F1C] bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 border border-emerald-250/30">
            <CheckCircle2 className="h-2.5 w-2.5" />
            <span>Finalized</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-[9px] font-monoenterprise uppercase tracking-wider text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 border border-zinc-200">
            <span>{status}</span>
          </span>
        );
    }
  };

  const handleOpenRfqForm = () => {
    if (user && !user.email_verified_at) {
      alert('Operational Blockade: Please verify your corporate email before dispatching RFQs.');
      router.push('/auth/verify-email');
      return;
    }
    setShowRfqForm(true);
  };

  // Helper inside loop

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#111111] text-ink-black dark:text-zinc-50 pt-20 selection:bg-[#043F1C] selection:text-white transition-colors duration-300">

      <main className="mx-auto max-w-7xl px-6 py-12 md:px-16">
        {user && !user.email_verified_at && (
          <div className="mb-12 border border-amber-300 bg-[#F0EBE5] p-8 dark:border-amber-900/50 dark:bg-amber-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-monoenterprise text-xs font-black uppercase tracking-widest text-ink-black dark:text-white">Unverified Corporate Node</h4>
                <p className="font-sans text-xs text-zinc-550 dark:text-zinc-450 mt-1 leading-normal">
                  Your enterprise supply-chain workspace is currently locked in read-only sandbox mode. Please verify your corporate email to dispatch RFQs, purchase products, or establish B2B contracts.
                </p>
              </div>
            </div>
            <Link 
              href="/auth/verify-email" 
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-650 text-white font-monoenterprise text-[10px] uppercase tracking-widest py-3.5 px-6 transition-all shrink-0"
            >
              <span>Verify Corporate Node</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {/* Dashboard Title & Action */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between pb-8 mb-12 border-b border-[#E5E5E5] dark:border-zinc-800 gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[9px] font-monoenterprise uppercase tracking-widest text-[#043F1C] dark:text-[#346941] bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 border border-emerald-250/20 mb-3">
              <LayoutDashboard className="h-3 w-3" />
              <span>Buyer Procurement Console</span>
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-medium tracking-tight text-ink-black dark:text-white mt-1">
              Procurement <span className="italic">Workspace</span>
            </h1>
            <p className="text-[13px] font-sans text-zinc-500 dark:text-zinc-400 mt-2">Manage requests, verify active factory bids, and execute order pipelines.</p>
          </div>
          <button
            id="btn-post-rfq"
            onClick={handleOpenRfqForm}
            className="inline-flex items-center justify-center space-x-2 bg-ink-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-ink-black py-4 px-8 text-xs font-monoenterprise uppercase tracking-widest transition-all active:scale-[0.98] border border-transparent dark:border-zinc-800"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Dispatch Global RFQ</span>
          </button>
        </div>

        {/* Two-Column Workspace Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Tonal Sidebar / Shortcuts */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-[#F0EBE5] dark:bg-[#1a1816] p-8 border border-[#E5E5E5] dark:border-zinc-800">
              <span className="font-monoenterprise text-[9px] uppercase tracking-[0.2em] text-zinc-400 block mb-1">
                OPERATIONAL NODE
              </span>
              <p className="font-heading text-2xl font-medium text-ink-black dark:text-white truncate">
                {user?.name}
              </p>
              <div className="mt-6 pt-6 border-t border-zinc-300 dark:border-zinc-800 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 dark:text-zinc-450">Authority Status:</span>
                  <span className="font-bold text-[#043F1C] dark:text-[#346941] text-[10px] uppercase font-monoenterprise">ACTIVE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 dark:text-zinc-450">Clearance Node:</span>
                  <span className="font-monoenterprise text-[10px] tracking-wide text-zinc-800 dark:text-zinc-200">
                    {user?.email_verified_at ? 'VERIFIED' : 'PENDING'}
                  </span>
                </div>
              </div>
            </div>

            <div className="border border-[#E5E5E5] dark:border-zinc-800 p-8 space-y-6 bg-white dark:bg-zinc-950">
              <p className="font-monoenterprise text-[10px] uppercase tracking-[0.2em] text-zinc-450">
                WORKSPACE INDICES
              </p>
              <ul className="space-y-4 text-xs font-monoenterprise uppercase tracking-wider">
                <li>
                  <a href="#active-rfqs" className="hover:text-[#043F1C] dark:hover:text-[#346941] transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-ink-black dark:bg-white rounded-full group-hover:scale-125 transition-transform"></span>
                    <span>Active RFQ Manifests</span>
                  </a>
                </li>
                <li>
                  <a href="#transaction-ledger" className="hover:text-[#043F1C] dark:hover:text-[#346941] transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-transparent border border-zinc-400 rounded-full group-hover:bg-ink-black dark:group-hover:bg-white transition-colors"></span>
                    <span>Transaction Ledger</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Main Data Workspace */}
          <div className="lg:col-span-9 space-y-16">
            {/* Statistical Capsules */}
            <section className="grid grid-cols-1 md:grid-cols-3 border border-[#E5E5E5] dark:border-zinc-800 divide-y md:divide-y-0 md:divide-x divide-[#E5E5E5] dark:divide-zinc-800 bg-white dark:bg-zinc-950">
              <div className="p-8 group hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                <div className="flex justify-between items-start mb-6">
                  <p className="font-monoenterprise text-[10px] uppercase tracking-[0.2em] text-zinc-400">Active Manifests</p>
                  <FileText className="h-4 w-4 text-zinc-300" />
                </div>
                <h3 className="font-heading text-4xl font-medium text-ink-black dark:text-white leading-none">{rfqs.length}</h3>
              </div>

              <div className="p-8 group hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                <div className="flex justify-between items-start mb-6">
                  <p className="font-monoenterprise text-[10px] uppercase tracking-[0.2em] text-zinc-400">Bidding Cycles</p>
                  <Clock className="h-4 w-4 text-zinc-300" />
                </div>
                <h3 className="font-heading text-4xl font-medium text-ink-black dark:text-white leading-none">
                  {rfqs.filter((i) => i.status === 'PENDING').length}
                </h3>
              </div>

              <div className="p-8 group hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                <div className="flex justify-between items-start mb-6">
                  <p className="font-monoenterprise text-[10px] uppercase tracking-[0.2em] text-zinc-400">Secured Nodes</p>
                  <CheckCircle2 className="h-4 w-4 text-[#346941]" />
                </div>
                <h3 className="font-heading text-4xl font-medium text-[#043F1C] dark:text-[#346941] leading-none">
                  {rfqs.filter((i) => i.status === 'CLOSED').length}
                </h3>
              </div>
            </section>

            {/* Active RFQs Dashboard Panel */}
            <section id="active-rfqs" className="border-t border-ink-black dark:border-zinc-700 pt-8">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E5E5E5] dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#043F1C] dark:text-[#346941]" />
                  <h3 className="font-heading text-2xl font-medium text-ink-black dark:text-white">Active Procurement RFQs</h3>
                </div>
                <span className="font-monoenterprise text-[9px] text-[#043F1C] bg-[#F0EBE5] dark:bg-zinc-900 px-3 py-1 uppercase tracking-widest border border-zinc-200">Live Synchronized</span>
              </div>

              {loading ? (
                <div className="py-24 flex items-center justify-center">
                  <div className="h-8 w-8 border-2 border-ink-black border-t-transparent dark:border-white rounded-full animate-spin"></div>
                </div>
              ) : rfqs.length === 0 ? (
                <div className="py-20 text-center border border-[#E5E5E5] dark:border-zinc-800 bg-white dark:bg-zinc-950">
                  <Layers className="h-8 w-8 text-zinc-300 mx-auto mb-4" />
                  <p className="font-heading text-lg font-medium text-ink-black dark:text-white">No active RFQs</p>
                  <p className="text-xs mt-2 text-zinc-400 max-w-xs mx-auto font-sans leading-relaxed">Create a new request-for-quote to receive competitive bids from global suppliers.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#E5E5E5] dark:divide-zinc-800">
                  {rfqs.map((rfq) => {
                    return (
                      <motion.div
                        key={rfq.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-8 first:pt-0"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                              <h4 className="font-heading text-xl font-medium text-ink-black dark:text-white leading-tight">{rfq.title}</h4>
                              {getStatusBadge(rfq.status, rfq.responses?.length)}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-[10px] font-monoenterprise uppercase tracking-wider text-zinc-400">
                              <span className="text-[#043F1C] dark:text-[#346941] font-bold">{rfq.category.name}</span>
                              <span>•</span>
                              <span suppressHydrationWarning>{rfq.quantity.toLocaleString()} units</span>
                              {rfq.targetPrice && (
                                <>
                                  <span>•</span>
                                  <span suppressHydrationWarning>Target: ₹{rfq.targetPrice.toLocaleString()}</span>
                                </>
                              )}
                              <span>•</span>
                              <span>Logged: {new Date(rfq.createdAt).toLocaleDateString()}</span>
                              <span>•</span>
                              <span className="font-mono text-zinc-500">#{rfq.id.slice(0, 8).toUpperCase()}</span>
                            </div>
                            <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-4 leading-relaxed bg-[#F0EBE5]/30 dark:bg-zinc-950/20 border border-[#E5E5E5] dark:border-zinc-800/40 p-4 font-serif italic">
                              {rfq.description}
                            </p>
                          </div>
                        </div>

                        {/* Suppliers Bids Grid/Table */}
                        {rfq.responses && rfq.responses.length > 0 && (
                          <div className="mt-6 border-t border-dashed border-[#E5E5E5] dark:border-zinc-800 pt-6">
                            <div className="flex items-center gap-2 mb-4">
                              <TrendingUp className="h-3.5 w-3.5 text-[#043F1C]" />
                              <h5 className="font-monoenterprise text-[10px] uppercase tracking-widest text-zinc-400">
                                Bidding Proposals ({rfq.responses.length})
                              </h5>
                            </div>
                            
                            <div className="overflow-x-auto">
                              <table className="w-full text-left font-sans text-xs border border-[#E5E5E5] dark:border-zinc-800 bg-[#F9F9F9] dark:bg-zinc-950">
                                <thead>
                                  <tr className="bg-[#F0EBE5] dark:bg-zinc-900 border-b border-[#E5E5E5] dark:border-zinc-800 text-[9px] font-monoenterprise uppercase tracking-wider text-zinc-400">
                                    <th className="p-4">Supplier OEM</th>
                                    <th className="p-4">Quotation Rate</th>
                                    <th className="p-4">Delivery SLA</th>
                                    <th className="p-4">Annotations</th>
                                    <th className="p-4 text-right">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E5E5E5] dark:divide-zinc-800">
                                  {rfq.responses.map((quote) => (
                                    <tr key={quote.id} className={`hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors ${
                                      quote.status === 'ACCEPTED' ? 'bg-emerald-50/20 dark:bg-emerald-950/10' : ''
                                    }`}>
                                      <td className="p-4 font-semibold text-ink-black dark:text-white">
                                        <div className="flex items-center gap-2">
                                          <span>{quote.seller.profile?.companyName || quote.seller.name}</span>
                                          {quote.seller.profile?.isVerified && (
                                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 inline-block" />
                                          )}
                                        </div>
                                      </td>
                                      <td className="p-4 font-mono font-bold text-ink-black dark:text-zinc-200" suppressHydrationWarning>
                                        ₹{quote.priceQuote.toLocaleString()}/unit
                                      </td>
                                      <td className="p-4 text-zinc-400 font-mono">
                                        {quote.leadTimeDays} days
                                      </td>
                                      <td className="p-4 text-zinc-500 italic max-w-xs truncate">
                                        &ldquo;{quote.notes || '—'}&rdquo;
                                      </td>
                                      <td className="p-4 text-right">
                                        {rfq.status !== 'CLOSED' ? (
                                          <button
                                            onClick={() => handleSelectQuote(quote, rfq)}
                                            className="text-[9px] font-monoenterprise uppercase tracking-wider bg-ink-black hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-ink-black py-1.5 px-3 rounded-none transition-all"
                                          >
                                            Secure Bid
                                          </button>
                                        ) : quote.status === 'ACCEPTED' ? (
                                          <span className="inline-flex items-center gap-1 text-[9px] font-monoenterprise uppercase tracking-wider text-emerald-600 font-bold">
                                            <Check className="h-3 w-3" />
                                            <span>Accepted</span>
                                          </span>
                                        ) : (
                                          <span className="text-[9px] font-monoenterprise uppercase tracking-wider text-zinc-300 dark:text-zinc-700">Dormant</span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Order & Payment Ledger */}
            <section id="transaction-ledger" className="border-t border-ink-black dark:border-zinc-700 pt-8">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E5E5E5] dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-[#043F1C] dark:text-[#346941]" />
                  <h3 className="font-heading text-2xl font-medium text-ink-black dark:text-white">Transaction Log Ledger</h3>
                </div>
                <span className="font-monoenterprise text-[9px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1 uppercase tracking-widest border border-emerald-200">Completed Logs</span>
              </div>

              {loading ? (
                <div className="py-24 flex items-center justify-center">
                  <div className="h-8 w-8 border-2 border-ink-black border-t-transparent dark:border-white rounded-full animate-spin"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-20 text-center border border-[#E5E5E5] dark:border-zinc-800 bg-white dark:bg-zinc-950">
                  <ShoppingBag className="h-8 w-8 text-zinc-300 mx-auto mb-4" />
                  <p className="font-heading text-lg font-medium text-ink-black dark:text-white">No payment logs found</p>
                  <p className="text-xs mt-2 text-zinc-400 max-w-xs mx-auto leading-relaxed">No logs have been written to the transaction ledger.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-[#E5E5E5] dark:border-zinc-800 bg-white dark:bg-zinc-950">
                  <table className="w-full text-left font-sans text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#F0EBE5] dark:bg-zinc-900 border-b border-[#E5E5E5] dark:border-zinc-800 text-[9px] font-monoenterprise uppercase tracking-wider text-zinc-400">
                        <th className="p-5">Reference ID</th>
                        <th className="p-5">Fulfillment Destination</th>
                        <th className="p-5">Log Timestamp</th>
                        <th className="p-5">Valuation</th>
                        <th className="p-5">Fulfillment Status</th>
                        <th className="p-5 text-right">Invoices</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5] dark:divide-zinc-800">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                          <td className="p-5 font-mono font-bold text-ink-black dark:text-zinc-200">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </td>
                          <td className="p-5 text-zinc-500 max-w-xs truncate">
                            {order.shippingAdd}
                          </td>
                          <td className="p-5 text-zinc-450 font-mono" suppressHydrationWarning>
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                          </td>
                          <td className="p-5 font-heading text-sm font-semibold text-ink-black dark:text-white" suppressHydrationWarning>
                            ₹{Number(order.total ?? 0).toLocaleString()}
                          </td>
                          <td className="p-5">
                            <span className={`inline-flex px-2 py-0.5 text-[9px] font-monoenterprise uppercase border ${
                              order.status === 'PAID' || order.status === 'PROCESSING'
                                ? 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20'
                                : order.status === 'FAILED'
                                ? 'text-red-500 bg-red-550/10 border-red-200'
                                : 'text-amber-500 bg-amber-50 border-amber-200'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                            {(order.status === 'PAID' || order.status === 'PROCESSING') && (
                              <a
                                href={`${api.defaults.baseURL}/orders/${order.id}/invoice/download`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-[9px] font-monoenterprise uppercase tracking-wider text-[#043F1C] bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-250/30 px-3 py-1.5 transition-all"
                              >
                                <Download className="h-3.5 w-3.5" />
                                <span>Invoice</span>
                              </a>
                            )}

                            {(order.status === 'FAILED' || order.status === 'PENDING') && (
                              <Link
                                href="/checkout"
                                className="inline-flex items-center gap-1.5 text-[9px] font-monoenterprise uppercase tracking-wider text-white bg-ink-black hover:bg-zinc-800 px-3 py-1.5 transition-all"
                              >
                                <RefreshCw className="h-3 w-3" />
                                <span>Retry</span>
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* RFQ Broadcast Slide Overlay */}
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
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="relative w-full max-w-xl bg-white p-8 dark:bg-zinc-950 border border-ink-black dark:border-zinc-800 z-10"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E5E5] dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-[#043F1C]" />
                  <h3 className="font-heading text-2xl font-medium text-ink-black dark:text-white">Dispatch RFQ Manifest</h3>
                </div>
                <button onClick={() => setShowRfqForm(false)} className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center justify-center text-zinc-400 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateRfq} className="space-y-6 text-xs">
                <div>
                  <label className="block font-monoenterprise text-[10px] uppercase tracking-widest text-zinc-400 mb-2 ml-1">Product / SKU Identifier</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. 500x 2.5in SATA Enterprise Solid State Drives"
                    className="w-full border border-zinc-250 bg-white py-3.5 px-4 text-[13px] font-medium text-ink-black dark:text-zinc-250 dark:bg-zinc-900 dark:border-zinc-800 outline-none focus:border-ink-black dark:focus:border-white focus:ring-0 rounded-none transition-all"
                  />
                </div>

                <div>
                  <label className="block font-monoenterprise text-[10px] uppercase tracking-widest text-zinc-400 mb-2 ml-1">Operational Taxonomy Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full border border-zinc-250 bg-white py-3.5 px-4 text-[13px] font-bold text-ink-black dark:text-zinc-250 dark:bg-zinc-900 dark:border-zinc-800 outline-none focus:border-ink-black focus:ring-0 cursor-pointer rounded-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block font-monoenterprise text-[10px] uppercase tracking-widest text-zinc-400 mb-2 ml-1">Bulk Volume Mass (Units)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formQty}
                      onChange={(e) => setFormQty(parseInt(e.target.value))}
                      className="w-full border border-zinc-250 bg-white py-3.5 px-4 text-[13px] font-medium text-ink-black dark:text-zinc-250 dark:bg-zinc-900 dark:border-zinc-800 outline-none focus:border-ink-black focus:ring-0 rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block font-monoenterprise text-[10px] uppercase tracking-widest text-zinc-400 mb-2 ml-1">Target Unit Cap Rate (INR)</label>
                    <input
                      type="number"
                      placeholder="e.g. 4500"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="w-full border border-zinc-250 bg-white py-3.5 px-4 text-[13px] font-medium text-ink-black dark:text-zinc-250 dark:bg-zinc-900 dark:border-zinc-800 outline-none focus:border-ink-black focus:ring-0 rounded-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-monoenterprise text-[10px] uppercase tracking-widest text-zinc-400 mb-2 ml-1">Detailed Spec Payload</label>
                  <textarea
                    required
                    rows={4}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Provide industrial data sheets, OEM certification mandates, compliance profiles..."
                    className="w-full border border-zinc-250 bg-white py-3.5 px-4 text-[13px] font-medium text-ink-black dark:text-zinc-250 dark:bg-zinc-900 dark:border-zinc-800 outline-none focus:border-ink-black focus:ring-0 resize-none rounded-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full bg-ink-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-ink-black py-4 text-xs font-monoenterprise uppercase tracking-widest transition-all rounded-none flex items-center justify-center mt-2"
                >
                  {formSubmitting ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent dark:border-ink-black rounded-full animate-spin"></div>
                  ) : (
                    <span>Broadcast RFQ Manifest</span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Accept & Checkout Pipeline Overlay */}
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
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="relative w-full max-w-lg bg-white p-8 dark:bg-zinc-950 border border-ink-black dark:border-zinc-800 z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#043F1C]" />
                  <h3 className="font-heading text-2xl font-medium text-ink-black dark:text-white">Secure Ledger Order</h3>
                </div>
                <button
                  onClick={() => {
                    setCheckoutRfq(null);
                    setCheckoutResponse(null);
                  }}
                  className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center justify-center text-zinc-400 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="bg-[#F0EBE5] dark:bg-zinc-900 border border-[#E5E5E5] dark:border-zinc-800 p-6 rounded-none mb-6">
                <div className="flex justify-between items-center mb-4 border-b border-zinc-300 dark:border-zinc-800 pb-2">
                  <span className="font-monoenterprise text-[9px] text-zinc-400 uppercase tracking-wider">Secured Order Object</span>
                  <span className="font-mono text-xs text-ink-black dark:text-white">#{checkoutRfq.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <h4 className="font-heading text-lg font-medium text-ink-black dark:text-white mb-4">{checkoutRfq.title}</h4>
                
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
                  <div>
                    <span className="block font-monoenterprise text-[9px] text-zinc-400 uppercase tracking-widest mb-0.5">CONTRACT SUPPLIER</span>
                    <span className="font-bold text-ink-black dark:text-white truncate block">{checkoutResponse.seller.name}</span>
                  </div>
                  <div>
                    <span className="block font-monoenterprise text-[9px] text-zinc-400 uppercase tracking-widest mb-0.5">CONTRACT UNIT RATE</span>
                    <span className="font-bold text-ink-black dark:text-white font-mono" suppressHydrationWarning>₹{checkoutResponse.priceQuote.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block font-monoenterprise text-[9px] text-zinc-400 uppercase tracking-widest mb-0.5">ALLOCATION MASS</span>
                    <span className="font-bold text-ink-black dark:text-white font-mono">{checkoutRfq.quantity} Units</span>
                  </div>
                  <div>
                    <span className="block font-monoenterprise text-[9px] text-zinc-400 uppercase tracking-widest mb-0.5">AGGREGATE VALUATION</span>
                    <span className="font-bold text-[#043F1C] dark:text-[#346941] font-mono text-sm" suppressHydrationWarning>₹{(checkoutResponse.priceQuote * checkoutRfq.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-6 text-xs">
                <div>
                  <label className="block font-monoenterprise text-[10px] uppercase tracking-widest text-zinc-400 mb-2 ml-1 flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Freight Logistics Gateway Shipping Address</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={checkoutShipping}
                    onChange={(e) => setCheckoutShipping(e.target.value)}
                    placeholder="e.g. Terminal B, Warehouse 4, TATAmart Node, Pune, IN"
                    className="w-full border border-zinc-250 bg-white py-3.5 px-4 text-[13px] font-medium text-ink-black dark:text-zinc-250 dark:bg-zinc-900 dark:border-zinc-800 outline-none focus:border-ink-black focus:ring-0 rounded-none"
                  />
                </div>

                <div className="flex items-start gap-2.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-200/50 p-4">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span className="font-sans leading-normal">Confirming quotation will lock pricing parameters and close active RFQ bidding sequences.</span>
                </div>

                <button
                  type="submit"
                  disabled={checkoutSubmitting}
                  className="w-full bg-ink-black hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-ink-black py-4 text-xs font-monoenterprise uppercase tracking-widest transition-all rounded-none flex items-center justify-center mt-2"
                >
                  {checkoutSubmitting ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent dark:border-ink-black rounded-full animate-spin"></div>
                  ) : (
                    <span>Authenticate B2B Allocation</span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ledger Success Overlay */}
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
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="relative w-full max-w-md bg-white p-10 dark:bg-zinc-950 border border-ink-black dark:border-zinc-800 text-center z-10"
            >
              <div className="mx-auto h-16 w-16 bg-[#F0EBE5] dark:bg-zinc-900 text-[#043F1C] dark:text-[#346941] flex items-center justify-center mb-6 border border-[#E5E5E5] dark:border-zinc-800">
                <ShoppingBag className="h-8 w-8" />
              </div>

              <h3 className="font-heading text-2xl font-medium text-ink-black dark:text-white mb-3">Allocation Dispatched</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed max-w-xs mx-auto">
                Your multi-party transaction has successfully passed authentication nodes. High-volume manufacturer logs are active.
              </p>

              <div className="bg-[#F0EBE5] border border-[#E5E5E5] dark:bg-zinc-900 dark:border-zinc-800 p-3.5 text-[9px] font-monoenterprise uppercase tracking-widest text-[#043F1C] dark:text-[#346941] mt-8 flex items-center justify-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Dynamic Ledger Authenticated</span>
              </div>

              <button
                onClick={() => setSuccessModal(false)}
                className="w-full bg-ink-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-ink-black py-4 text-xs font-monoenterprise uppercase tracking-widest transition-all mt-8 rounded-none"
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
