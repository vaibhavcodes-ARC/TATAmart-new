'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { useAuthStore } from '../../../store/useAuthStore';
import { useRouter } from 'next/navigation';
import {
  Tag,
  Plus,
  Trash2,
  Send,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Activity,
  Terminal,
  FileText,
  BarChart3,
  PackageOpen,
  X,
  AlertCircle,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface AnalyticsData {
  totalLeads: number;
  responseRate: number;
  statusCounts: {
    PENDING: number;
    REPLIED: number;
    CLOSED: number;
  };
  topProducts: Array<{
    id: string;
    title: string;
    inquiries_count: number;
  }>;
  monthlyLeads: Array<{
    month: string;
    count: number;
  }>;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  moq: number;
  stock: number;
  categoryId: string;
  sellerId?: string;
}

interface BackendProduct {
  id: string | number;
  name?: string;
  title?: string;
  short_description?: string;
  description?: string;
  price_min?: string | number;
  price?: string | number;
  min_order_quantity?: string | number;
  moq?: string | number;
  category?: { name?: string };
  category_id?: string | number;
  seller_id?: string | number;
  sellerId?: string | number;
}

interface RfqLeads {
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
  buyer: {
    name: string;
    email: string;
  };
  responses: Array<{
    id: string;
    sellerId: string;
    priceQuote: number;
    status: string;
  }>;
}

export default function SellerDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'analytics' | 'catalog' | 'leads' | 'orders'>('analytics');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [rfqLeads, setRfqLeads] = useState<RfqLeads[]>([]);
  const [orders, setOrders] = useState<Array<{ id: string; shippingAdd: string; total: number; status: string; createdAt: string }>>([]);
  const [loading, setLoading] = useState(true);

  // Add Product Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [prodTitle, setProdTitle] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodMoq, setProdMoq] = useState('');
  const [prodStock, setProdStock] = useState('100');
  const [prodCategory, setProdCategory] = useState('');

  // Bid Form States
  const [biddingRfq, setBiddingRfq] = useState<RfqLeads | null>(null);
  const [bidPrice, setBidPrice] = useState('');
  const [bidLeadTime, setBidLeadTime] = useState('5');
  const [bidNotes, setBidNotes] = useState('');
  const [biddingSubmitting, setBiddingSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [analyticsRes, productsRes, rfqLeadsRes, ordersRes] = await Promise.all([
        api.get('/analytics/seller'),
        api.get('/products'),
        api.get('/rfqs/leads'),
        api.get('/orders')
      ]);

      setAnalytics(analyticsRes.data.data);
      setRfqLeads(rfqLeadsRes.data.data || rfqLeadsRes.data);
      setOrders(ordersRes.data.data || ordersRes.data);

      const productsData = productsRes.data?.data?.data || productsRes.data?.data || productsRes.data || [];
      const mappedProducts = productsData.map((p: BackendProduct) => ({
        id: String(p.id),
        title: p.name || p.title || 'Untitled product',
        description: p.short_description || p.description || '',
        price: Number(p.price_min || p.price || 0),
        moq: Number(p.min_order_quantity || p.moq || 1),
        stock: 100,
        categoryId: String(p.category?.name || p.category_id || ''),
        sellerId: String(p.seller_id || p.sellerId || ''),
      }));

      // Filter products only owned by this seller
      if (user) {
        setProducts(mappedProducts.filter((p: Product) => p.sellerId === String(user.id)));
      } else {
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Error fetching seller command center data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (user && user.role !== 'SELLER' && user.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchData();
  }, [isAuthenticated, user]);

  const handleOpenAddModal = () => {
    if (user && !user.email_verified_at) {
      alert('Operational Blockade: Please verify your corporate email before cataloging new B2B products.');
      router.push('/auth/verify-email');
      return;
    }
    setShowAddModal(true);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && !user.email_verified_at) {
      alert('Operational Blockade: Please verify your corporate email before cataloging new B2B products.');
      router.push('/auth/verify-email');
      return;
    }
    try {
      const categoriesRes = await api.get('/categories');
      const categoriesData = categoriesRes.data?.data || categoriesRes.data || [];
      const activeCategory = prodCategory || categoriesData[0]?.id;

      const newProd = {
        name: prodTitle,
        short_description: prodDesc,
        price_min: Number(prodPrice),
        min_order_quantity: Number(prodMoq),
        category_id: activeCategory,
        images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop'],
      };

      await api.post('/products', newProd);
      setShowAddModal(false);
      setProdTitle('');
      setProdDesc('');
      setProdPrice('');
      setProdMoq('');
      setProdStock('100');
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      fetchData();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleUpdateStock = async (prodId: string, newStock: number) => {
    try {
      // Optimistic update
      setProducts((prev) =>
        prev.map((p) => (p.id === prodId ? { ...p, stock: newStock } : p))
      );
      await api.put(`/products/${prodId}`, { stock: newStock });
    } catch (error) {
      console.error('Failed to update stock:', error);
      fetchData();
    }
  };

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && !user.email_verified_at) {
      alert('Operational Blockade: Please verify your corporate email before placing B2B bids.');
      router.push('/auth/verify-email');
      return;
    }
    if (!biddingRfq) return;

    try {
      setBiddingSubmitting(true);
      await api.post('/rfqs/respond', {
        rfqId: biddingRfq.id,
        priceQuote: parseFloat(bidPrice),
        leadTimeDays: parseInt(bidLeadTime, 10),
        notes: bidNotes,
      });

      // Clear states
      setBiddingRfq(null);
      setBidPrice('');
      setBidLeadTime('5');
      setBidNotes('');

      // Refresh
      fetchData();
    } catch (err) {
      console.error('Error submitting bid:', err);
    } finally {
      setBiddingSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#111111] flex flex-col text-ink-black dark:text-zinc-50">
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 border-2 border-ink-black border-t-transparent dark:border-white rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

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
                <h4 className="font-monoenterprise text-xs font-black uppercase tracking-widest text-ink-black dark:text-white">Unverified Supply Node</h4>
                <p className="font-sans text-xs text-zinc-550 dark:text-zinc-450 mt-1 leading-normal">
                  Your enterprise supply-chain workspace is currently locked in read-only sandbox mode. Please verify your corporate email to catalog assets, submit wholesale bidding responses, or fulfill orders.
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

        {/* Dashboard Title Header */}
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between pb-8 mb-12 border-b border-[#E5E5E5] dark:border-zinc-800 gap-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[9px] font-monoenterprise uppercase tracking-widest text-[#043F1C] dark:text-[#346941] bg-[#F0EBE5] dark:bg-zinc-900 px-3 py-1 border border-zinc-200 mb-3">
              <Terminal className="h-3 w-3" />
              <span>Seller Control Board</span>
            </span>
            <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-ink-black dark:text-white font-heading mt-1 flex flex-wrap items-center gap-3">
              <span>Seller <span className="italic">Dashboard</span></span>
              {user?.role === 'SELLER' && (
                <span className="inline-flex items-center space-x-1 px-3 py-0.5 text-[9px] font-monoenterprise uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-250/20 shadow-sm shrink-0">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Enterprise Verified</span>
                </span>
              )}
            </h1>
            <p className="text-[13px] font-sans text-zinc-500 dark:text-zinc-400 mt-2">Manage products catalogue, respond to buyer RFQs, and oversee orders.</p>
          </div>

          {/* Tab Selector Links */}
          <div className="flex border-b border-[#E5E5E5] dark:border-zinc-850 space-x-8 xl:space-x-12 overflow-x-auto scrollbar-none pb-0.5">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-4 text-xs font-monoenterprise uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'border-ink-black dark:border-white text-ink-black dark:text-white font-bold'
                  : 'border-transparent text-zinc-450 hover:text-ink-black dark:hover:text-white'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`pb-4 text-xs font-monoenterprise uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'catalog'
                  ? 'border-ink-black dark:border-white text-ink-black dark:text-white font-bold'
                  : 'border-transparent text-zinc-450 hover:text-ink-black dark:hover:text-white'
              }`}
            >
              Inventory ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`pb-4 text-xs font-monoenterprise uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'leads'
                  ? 'border-ink-black dark:border-white text-ink-black dark:text-white font-bold'
                  : 'border-transparent text-zinc-450 hover:text-ink-black dark:hover:text-white'
              }`}
            >
              RFQ Leads ({rfqLeads.filter(r => r.status === 'PENDING').length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-4 text-xs font-monoenterprise uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-ink-black dark:border-white text-ink-black dark:text-white font-bold'
                  : 'border-transparent text-zinc-450 hover:text-ink-black dark:hover:text-white'
              }`}
            >
              Orders Log ({orders.length})
            </button>
          </div>
        </div>

        {/* Tab Content 1: Analytics Console */}
        {activeTab === 'analytics' && analytics && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
            {/* Metric Strip */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-[#E5E5E5] dark:border-zinc-800 divide-y sm:divide-y-0 lg:divide-x lg:divide-y-0 divide-[#E5E5E5] dark:divide-zinc-800 bg-white dark:bg-zinc-950">
              <div className="p-8">
                <p className="font-monoenterprise text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-4">Total RFQs</p>
                <h3 className="font-heading text-4xl font-medium text-ink-black dark:text-white">{analytics.totalLeads}</h3>
              </div>
              <div className="p-8">
                <p className="font-monoenterprise text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-4">Conversion Rate</p>
                <h3 className="font-heading text-4xl font-medium text-ink-black dark:text-white">{analytics.responseRate}%</h3>
              </div>
              <div className="p-8">
                <p className="font-monoenterprise text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-4">Pending Cycles</p>
                <h3 className="font-heading text-4xl font-medium text-[#043F1C] dark:text-[#346941]">{analytics.statusCounts.PENDING}</h3>
              </div>
              <div className="p-8">
                <p className="font-monoenterprise text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-4">Catalog Count</p>
                <h3 className="font-heading text-4xl font-medium text-ink-black dark:text-white">{products.length}</h3>
              </div>
            </section>

            {/* sought after assemblies and trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Sought-After Assemblies */}
              <div className="border border-[#E5E5E5] dark:border-zinc-800 p-8 bg-white dark:bg-zinc-950">
                <div className="flex items-center gap-2 mb-8 pb-4 border-b border-[#E5E5E5] dark:border-zinc-800">
                  <BarChart3 className="h-4 w-4 text-[#043F1C]" />
                  <h3 className="font-heading text-[17px] font-medium text-ink-black dark:text-white uppercase tracking-wider">Demand Assemblies Signals</h3>
                </div>
                
                {analytics.topProducts.length === 0 ? (
                  <p className="text-xs text-zinc-400 py-10 text-center font-sans">No active market inquiries recorded.</p>
                ) : (
                  <div className="space-y-4">
                    {analytics.topProducts.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-[#F9F9F9] dark:bg-zinc-900 border border-[#E5E5E5] dark:border-zinc-800">
                        <span className="text-[13px] font-medium text-ink-black dark:text-white truncate pr-4">{p.title}</span>
                        <span className="text-[9px] font-monoenterprise uppercase bg-[#F0EBE5] text-ink-black dark:bg-zinc-800 dark:text-white px-3 py-1 border border-zinc-300/40">
                          {p.inquiries_count} Signals
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Order Frequency */}
              <div className="border border-[#E5E5E5] dark:border-zinc-800 p-8 bg-white dark:bg-zinc-950">
                <div className="flex items-center gap-2 mb-8 pb-4 border-b border-[#E5E5E5] dark:border-zinc-800">
                  <Activity className="h-4 w-4 text-[#346941]" />
                  <h3 className="font-heading text-[17px] font-medium text-ink-black dark:text-white uppercase tracking-wider">Logistical Order Trends</h3>
                </div>

                {analytics.monthlyLeads.length === 0 ? (
                  <p className="text-xs text-zinc-400 py-10 text-center font-sans">Awaiting operational ledger cycles.</p>
                ) : (
                  <div className="space-y-6">
                    {analytics.monthlyLeads.map((m, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-monoenterprise uppercase tracking-wider">
                          <span className="text-zinc-550">{m.month}</span>
                          <span className="text-ink-black dark:text-white font-bold">{m.count} Leads</span>
                        </div>
                        <div className="h-4 bg-[#F9F9F9] dark:bg-zinc-900 border border-[#E5E5E5] dark:border-zinc-800 overflow-hidden relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(m.count / Math.max(...analytics.monthlyLeads.map(l => l.count))) * 100}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className="h-full bg-ink-black dark:bg-white"
                          ></motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab Content 2: Catalog Inventory Control */}
        {activeTab === 'catalog' && (
          <motion.div initial={{ opacity: 0 }} className="space-y-6 mb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5] dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <PackageOpen className="h-4 w-4 text-[#043F1C]" />
                <h3 className="font-heading text-2xl font-medium text-ink-black dark:text-white">Master Inventory Log</h3>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="bg-ink-black hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-ink-black py-3 px-6 text-xs font-monoenterprise uppercase tracking-widest transition-all rounded-none"
              >
                <Plus className="h-4 w-4 inline-block mr-2 -mt-0.5" />
                <span>Catalog New Assembly</span>
              </button>
            </div>

            <div className="border border-[#E5E5E5] dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F0EBE5] dark:bg-zinc-900 text-[9px] font-monoenterprise uppercase tracking-widest text-zinc-400 border-b border-[#E5E5E5] dark:border-zinc-800">
                      <th className="p-5">SKU Assembly Details</th>
                      <th className="p-5">Industrial Class</th>
                      <th className="p-5">Base Quote Rate</th>
                      <th className="p-5">Warehouse Allocation</th>
                      <th className="p-5">MOQ Level</th>
                      <th className="p-5 text-right">Operational Matrix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5] dark:divide-zinc-850 text-xs font-medium text-zinc-550 dark:text-zinc-400">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-xs text-zinc-400 font-medium">
                          No physical stock found. Initiate high-volume assemblies using the Catalog button.
                        </td>
                      </tr>
                    ) : (
                      products.map((p) => (
                        <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                          <td className="p-5">
                            <span className="font-heading text-[15px] font-medium text-ink-black dark:text-white block mb-1">{p.title}</span>
                            <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">#{p.id.slice(0, 8).toUpperCase()}</span>
                          </td>
                          <td className="p-5">
                            <span className="text-[9px] font-monoenterprise uppercase tracking-wider text-ink-black dark:text-zinc-300 bg-[#F0EBE5] dark:bg-zinc-800 px-2.5 py-1 border border-zinc-300/40">
                              {p.categoryId}
                            </span>
                          </td>
                          <td className="p-5 font-mono font-bold text-ink-black dark:text-white" suppressHydrationWarning>
                            ₹{p.price.toLocaleString()}
                          </td>
                          <td className="p-5">
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                value={p.stock}
                                onChange={(e) => handleUpdateStock(p.id, parseInt(e.target.value) || 0)}
                                className="w-20 rounded-none border border-zinc-250 bg-white dark:bg-zinc-900 dark:border-zinc-800 py-1.5 px-3 text-center font-mono font-bold text-ink-black dark:text-white outline-none focus:border-ink-black focus:ring-0"
                              />
                              <span className="text-[9px] font-monoenterprise uppercase text-zinc-450">Units</span>
                            </div>
                          </td>
                          <td className="p-5 font-mono font-bold text-ink-black dark:text-white">{p.moq} Units</td>
                          <td className="p-5 text-right">
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="h-8 w-8 border border-[#E5E5E5] text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:border-zinc-800 dark:text-zinc-500 dark:hover:text-red-400 dark:hover:bg-red-950/20 inline-flex items-center justify-center transition-all"
                              title="Deallocate Asset"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab Content 3: Leads Board & Bidding */}
        {activeTab === 'leads' && (
          <motion.div initial={{ opacity: 0 }} className="space-y-6 mb-20">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E5E5E5] dark:border-zinc-800 pb-4">
              <Activity className="h-4 w-4 text-[#043F1C]" />
              <h3 className="font-heading text-2xl font-medium text-ink-black dark:text-white">Enterprise Demand Matrix</h3>
            </div>

            {rfqLeads.length === 0 ? (
              <div className="border border-[#E5E5E5] dark:border-zinc-800 bg-white dark:bg-zinc-950 p-16 text-center">
                <Terminal className="h-10 w-10 text-zinc-300 mx-auto mb-4" />
                <h4 className="font-heading text-lg font-medium text-ink-black dark:text-white mb-2">Leads feed is vacant</h4>
                <p className="text-xs font-sans text-zinc-400">No global buyer requests detected in synchronous cycles.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {rfqLeads.map((rfq) => {
                  const hasResponded = rfq.responses && rfq.responses.length > 0;
                  const myBid = hasResponded ? rfq.responses[0] : null;

                  return (
                    <div
                      key={rfq.id}
                      className="border border-[#E5E5E5] dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 flex flex-col justify-between group relative transition-colors duration-350"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-6 border-b border-zinc-150 dark:border-zinc-850 pb-4">
                          <div>
                            <span className="font-mono text-[9px] font-bold text-zinc-400 block tracking-widest uppercase">
                              LEAD IDENTIFIER: #{rfq.id.slice(0, 8).toUpperCase()}
                            </span>
                            <h4 className="font-heading text-xl font-medium text-ink-black dark:text-white mt-2 group-hover:text-[#043F1C] dark:group-hover:text-[#346941] transition-colors">{rfq.title}</h4>
                          </div>
                          <span className={`inline-flex items-center text-[9px] font-monoenterprise uppercase tracking-wider py-1 px-3 border ${
                            rfq.status === 'PENDING'
                              ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/20'
                              : rfq.status === 'RESPONDED'
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/20'
                              : 'bg-emerald-50 border-emerald-250 text-emerald-600 dark:bg-emerald-950/20'
                          }`}>
                            {rfq.status}
                          </span>
                        </div>

                        <div className="space-y-3 text-xs">
                          <div className="flex justify-between items-center border-b border-zinc-50 dark:border-zinc-900 pb-2">
                            <span className="font-monoenterprise text-[10px] text-zinc-400 uppercase tracking-wider">Demand Mass</span>
                            <span className="text-ink-black dark:text-white font-mono font-bold" suppressHydrationWarning>{rfq.quantity.toLocaleString()} Units</span>
                          </div>
                          {rfq.targetPrice && (
                            <div className="flex justify-between items-center border-b border-zinc-50 dark:border-zinc-900 pb-2">
                              <span className="font-monoenterprise text-[10px] text-zinc-400 uppercase tracking-wider">Target Unit Cap</span>
                              <span className="text-[#043F1C] dark:text-[#346941] font-mono font-bold" suppressHydrationWarning>₹{rfq.targetPrice.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center pb-2">
                            <span className="font-monoenterprise text-[10px] text-zinc-400 uppercase tracking-wider">Taxonomy Sector</span>
                            <span className="uppercase text-[9px] font-monoenterprise tracking-widest text-ink-black bg-[#F0EBE5] dark:bg-zinc-800 dark:text-white border border-zinc-350/30 px-2 py-0.5">
                              {rfq.category.name}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-zinc-550 dark:text-zinc-450 bg-[#F9F9F9] dark:bg-zinc-900/60 p-4 border border-[#E5E5E5] dark:border-zinc-850 mt-6 leading-relaxed italic font-serif">
                          &ldquo;{rfq.description}&rdquo;
                        </p>
                      </div>

                      <div className="mt-8 pt-5 border-t border-dashed border-[#E5E5E5] dark:border-zinc-800 flex items-center justify-between gap-3">
                        {hasResponded ? (
                          <div className="flex justify-between items-center w-full">
                            <span className="text-xs font-mono font-bold flex items-center gap-1.5 text-emerald-600">
                              <CheckCircle2 className="h-4 w-4" />
                              <span suppressHydrationWarning>Quoted: ₹{myBid?.priceQuote.toLocaleString()}</span>
                            </span>
                            <span className="text-[9px] font-monoenterprise uppercase text-zinc-400 bg-[#F0EBE5] dark:bg-zinc-900 px-2.5 py-1">
                              {myBid?.status}
                            </span>
                          </div>
                        ) : rfq.status !== 'CLOSED' ? (
                          <>
                            <span className="text-[9px] font-monoenterprise uppercase text-zinc-400 tracking-wider">Open Procurement Channel</span>
                            <button
                              onClick={() => setBiddingRfq(rfq)}
                              className="inline-flex items-center space-x-1.5 py-2.5 px-5 bg-ink-black hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-ink-black text-xs font-monoenterprise uppercase tracking-widest transition-all rounded-none"
                            >
                              <Send className="h-3.5 w-3.5" />
                              <span>Dispatch Quote</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-xs font-mono font-bold text-zinc-400 w-full text-center py-2 bg-[#F9F9F9] dark:bg-zinc-900 border border-[#E5E5E5] dark:border-zinc-800">Bidding Closed</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Tab Content 4: Procured Orders Log */}
        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} className="space-y-6 mb-20">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E5E5E5] dark:border-zinc-800 pb-4">
              <FileText className="h-4 w-4 text-[#043F1C]" />
              <h3 className="font-heading text-2xl font-medium text-ink-black dark:text-white">Dispatched Invoice Manifests</h3>
            </div>

            {orders.length === 0 ? (
              <div className="border border-[#E5E5E5] dark:border-zinc-800 bg-white dark:bg-zinc-950 p-16 text-center">
                <Truck className="h-10 w-10 text-zinc-300 mx-auto mb-4" />
                <h4 className="font-heading text-lg font-medium text-ink-black dark:text-white mb-2">Log file is unpopulated</h4>
                <p className="text-xs font-sans text-zinc-450">No order dispatches generated for your assemblies yet.</p>
              </div>
            ) : (
              <div className="border border-[#E5E5E5] dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F0EBE5] dark:bg-zinc-900 text-[9px] font-monoenterprise uppercase tracking-widest text-zinc-400 border-b border-[#E5E5E5] dark:border-zinc-800">
                        <th className="p-5">Order Ledger ID</th>
                        <th className="p-5">Freight Destination Address</th>
                        <th className="p-5">Consolidated Valuation</th>
                        <th className="p-5">Delivery Node Status</th>
                        <th className="p-5">Fulfillment Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5] dark:divide-zinc-850 text-xs font-medium text-zinc-550 dark:text-zinc-400">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                          <td className="p-5">
                            <span className="font-mono font-bold text-[#043F1C] dark:text-[#346941] tracking-wider text-xs">#{ord.id.slice(0, 8).toUpperCase()}</span>
                          </td>
                          <td className="p-5 max-w-xs truncate">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-zinc-300 shrink-0" />
                              <span className="font-bold text-ink-black dark:text-white truncate">{ord.shippingAdd}</span>
                            </div>
                          </td>
                          <td className="p-5 font-mono font-bold text-ink-black dark:text-white" suppressHydrationWarning>₹{ord.total.toLocaleString()}</td>
                          <td className="p-5">
                            <span className="inline-flex items-center gap-1 text-[9px] font-monoenterprise uppercase tracking-wider bg-[#F0EBE5] text-ink-black dark:bg-zinc-800 dark:text-white px-3 py-1 border border-zinc-300/40">
                              <Truck className="h-3.5 w-3.5" />
                              <span>{ord.status}</span>
                            </span>
                          </td>
                          <td className="p-5 text-zinc-400 font-mono" suppressHydrationWarning>{new Date(ord.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* Dispatch Quote Action Modal */}
      <AnimatePresence>
        {biddingRfq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBiddingRfq(null)}
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
                  <Send className="h-5 w-5 text-ink-black dark:text-white" />
                  <h3 className="font-heading text-2xl font-medium text-ink-black dark:text-white">Execute Competitive Quotation</h3>
                </div>
                <button onClick={() => setBiddingRfq(null)} className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center justify-center text-zinc-400 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs font-sans text-zinc-550 mb-6">Supply strategic pricing parameters to secure the contract payload for Lead ID #{biddingRfq.id.slice(0, 8).toUpperCase()}.</p>

              <form onSubmit={handlePlaceBid} className="space-y-6 text-xs">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block font-monoenterprise text-[10px] uppercase tracking-widest text-zinc-400 mb-2 ml-1">OEM Unit Quote (INR)</label>
                    <input
                      type="number"
                      required
                      value={bidPrice}
                      onChange={(e) => setBidPrice(e.target.value)}
                      placeholder={biddingRfq.targetPrice?.toString() || 'e.g. 1800'}
                      className="w-full rounded-none border border-zinc-250 bg-white dark:bg-zinc-900 dark:border-zinc-800 py-3.5 px-4 text-[13px] font-mono font-bold text-ink-black dark:text-white outline-none focus:border-ink-black focus:ring-0"
                    />
                  </div>
                  <div>
                    <label className="block font-monoenterprise text-[10px] uppercase tracking-widest text-zinc-400 mb-2 ml-1">Commitment SLA (Days)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={bidLeadTime}
                      onChange={(e) => setBidLeadTime(e.target.value)}
                      placeholder="e.g. 7"
                      className="w-full rounded-none border border-zinc-250 bg-white dark:bg-zinc-900 dark:border-zinc-800 py-3.5 px-4 text-[13px] font-mono font-bold text-ink-black dark:text-white outline-none focus:border-ink-black focus:ring-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-monoenterprise text-[10px] uppercase tracking-widest text-zinc-400 mb-2 ml-1">Compliance Annotations</label>
                  <textarea
                    rows={4}
                    value={bidNotes}
                    onChange={(e) => setBidNotes(e.target.value)}
                    placeholder="Specify QC warranties, RoHS compliance certifications, shipping layout dimensions..."
                    className="w-full rounded-none border border-zinc-250 bg-white dark:bg-zinc-900 dark:border-zinc-800 py-3.5 px-4 text-[13px] font-medium text-ink-black dark:text-zinc-300 outline-none focus:border-ink-black focus:ring-0 resize-none"
                  />
                </div>

                <div className="flex justify-end items-center space-x-4 pt-6 border-t border-[#E5E5E5] dark:border-zinc-850 mt-6">
                  <button
                    type="button"
                    onClick={() => setBiddingRfq(null)}
                    className="py-3 px-6 text-xs font-monoenterprise uppercase tracking-widest text-zinc-400 hover:text-ink-black dark:hover:text-white transition-all"
                  >
                    Decline
                  </button>
                  <button
                    type="submit"
                    disabled={biddingSubmitting}
                    className="bg-ink-black hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-ink-black py-3.5 px-8 text-xs font-monoenterprise uppercase tracking-widest transition-all rounded-none"
                  >
                    {biddingSubmitting ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent dark:border-ink-black rounded-full animate-spin"></div>
                    ) : (
                      <span>Lock In Quote</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Catalog Assemblies Action Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="relative w-full max-w-xl bg-white dark:bg-zinc-950 border border-ink-black dark:border-zinc-800 p-8 z-10"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E5E5] dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-ink-black dark:text-white" />
                  <h3 className="font-heading text-2xl font-medium text-ink-black dark:text-white">Inventory Provision Node</h3>
                </div>
                <button onClick={() => setShowAddModal(false)} className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center justify-center text-zinc-400 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-6 text-xs">
                <div>
                  <label className="block font-monoenterprise text-[10px] uppercase tracking-widest text-zinc-400 mb-2 ml-1">Asset Descriptor / Name</label>
                  <input
                    type="text"
                    required
                    value={prodTitle}
                    onChange={(e) => setProdTitle(e.target.value)}
                    placeholder="e.g. High-Precision Linear Actuator 12V-24V"
                    className="w-full rounded-none border border-zinc-250 bg-white dark:bg-zinc-900 dark:border-zinc-800 py-3.5 px-4 text-[13px] font-medium text-ink-black dark:text-zinc-200 outline-none focus:border-ink-black focus:ring-0"
                  />
                </div>

                <div>
                  <label className="block font-monoenterprise text-[10px] uppercase tracking-widest text-zinc-400 mb-2 ml-1">Operational Datasheet Specs</label>
                  <textarea
                    required
                    rows={3}
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    placeholder="Enter technical parameters: load limits, frequency response, duty cycle factors..."
                    className="w-full rounded-none border border-zinc-250 bg-white dark:bg-zinc-900 dark:border-zinc-800 py-3.5 px-4 text-[13px] font-medium text-ink-black dark:text-zinc-300 outline-none focus:border-ink-black focus:ring-0 resize-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-5">
                  <div>
                    <label className="block font-monoenterprise text-[10px] uppercase tracking-widest text-zinc-400 mb-2 ml-1">Base Price (INR)</label>
                    <input
                      type="number"
                      required
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      placeholder="e.g. 12000"
                      className="w-full rounded-none border border-zinc-250 bg-white dark:bg-zinc-900 dark:border-zinc-800 py-3.5 px-4 text-[13px] font-mono font-bold text-ink-black dark:text-white outline-none focus:border-ink-black focus:ring-0"
                    />
                  </div>
                  <div>
                    <label className="block font-monoenterprise text-[10px] uppercase tracking-widest text-zinc-400 mb-2 ml-1">Unit MOQ</label>
                    <input
                      type="number"
                      required
                      value={prodMoq}
                      onChange={(e) => setProdMoq(e.target.value)}
                      placeholder="e.g. 10"
                      className="w-full rounded-none border border-zinc-250 bg-white dark:bg-zinc-900 dark:border-zinc-800 py-3.5 px-4 text-[13px] font-mono font-bold text-ink-black dark:text-white outline-none focus:border-ink-black focus:ring-0"
                    />
                  </div>
                  <div>
                    <label className="block font-monoenterprise text-[10px] uppercase tracking-widest text-zinc-400 mb-2 ml-1">Starting Stock</label>
                    <input
                      type="number"
                      required
                      value={prodStock}
                      onChange={(e) => setProdStock(e.target.value)}
                      placeholder="e.g. 250"
                      className="w-full rounded-none border border-zinc-250 bg-white dark:bg-zinc-900 dark:border-zinc-800 py-3.5 px-4 text-[13px] font-mono font-bold text-ink-black dark:text-white outline-none focus:border-ink-black focus:ring-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-monoenterprise text-[10px] uppercase tracking-widest text-zinc-400 mb-2 ml-1">Product Taxonomy Niche</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full rounded-none border border-zinc-250 bg-white dark:bg-zinc-900 dark:border-zinc-800 py-3.5 px-4 text-[13px] font-black text-ink-black dark:text-zinc-200 outline-none focus:border-ink-black focus:ring-0 cursor-pointer"
                  >
                    <option value="">Synchronize Category</option>
                    <option value="electronics">Electronics & Electrical</option>
                    <option value="computers">Computer and IT</option>
                    <option value="transport">Industrial Transport</option>
                    <option value="logistics">Logistics & Packaging</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-ink-black hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-ink-black py-4 text-xs font-monoenterprise uppercase tracking-widest transition-all rounded-none flex items-center justify-center mt-6"
                >
                  <span>Transmit to Live Registry</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
