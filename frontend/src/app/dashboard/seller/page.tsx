'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { api } from '../../../utils/api';
import { useAuthStore } from '../../../store/useAuthStore';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  Clock,
  ShoppingCart,
  Percent,
  Tag,
  Plus,
  Trash2,
  Send,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Box,
  Activity,
  Terminal,
  FileText,
  DollarSign,
  BarChart3,
  PackageOpen,
  X,
  AlertCircle,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <div className="min-h-screen bg-[#fafafc] dark:bg-[#09090b] flex flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 pt-24 selection:bg-indigo-600 selection:text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        {/* Premium layout topbar header */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between mb-12 pb-8 border-b border-zinc-200/60 dark:border-zinc-800/60 gap-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full mb-3">
              <Terminal className="h-3 w-3" />
              <span>Vendor Command Matrix</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white mt-1 flex flex-wrap items-center gap-3">
              <span>OEM Control Tower</span>
              {user?.role === 'SELLER' && (
                <span className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 border border-emerald-100 dark:border-emerald-900/30 shadow-sm shrink-0">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Enterprise Verified</span>
                </span>
              )}
            </h1>
            <p className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400 mt-1.5">Control high-volume manufacturing pipelines, secure active buyer demand nodes, and oversee shipping logs.</p>
          </div>

          {/* Dynamic glass tabbed control navigation */}
          <div className="flex flex-wrap items-center gap-2 bg-white border border-zinc-200/60 p-1.5 rounded-[24px] dark:bg-zinc-900 dark:border-zinc-800/60 shadow-sm">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2.5 px-5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                  : 'text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`py-2.5 px-5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 ${
                activeTab === 'catalog'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                  : 'text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              Warehouse Inventory
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`py-2.5 px-5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 ${
                activeTab === 'leads'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                  : 'text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              Bid Mesh ({rfqLeads.filter(r => r.status === 'PENDING').length} New)
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2.5 px-5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 ${
                activeTab === 'orders'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                  : 'text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              Contracts Log ({orders.length})
            </button>
          </div>
        </div>

        {/* Tab Content 1: Analytics Console */}
        {activeTab === 'analytics' && analytics && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Luxury analytics pods */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="rounded-[28px] bg-white border border-zinc-200/60 p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800/60 group hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Procurement Payload</span>
                  <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                </div>
                <span className="text-3xl font-black text-zinc-950 dark:text-white">{analytics.totalLeads}</span>
                <div className="text-[10px] text-zinc-400 mt-2 font-semibold">Total incoming direct volume requests</div>
              </div>

              <div className="rounded-[28px] bg-white border border-zinc-200/60 p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800/60 group hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Bid Conversion Rate</span>
                  <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Percent className="h-4 w-4" />
                  </div>
                </div>
                <span className="text-3xl font-black text-zinc-950 dark:text-white">{analytics.responseRate}%</span>
                <div className="text-[10px] text-zinc-400 mt-2 font-semibold">Manufacturer quotation response factor</div>
              </div>

              <div className="rounded-[28px] bg-white border border-zinc-200/60 p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800/60 group hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Dormant Cycles</span>
                  <div className="h-9 w-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
                <span className="text-3xl font-black text-zinc-950 dark:text-white">{analytics.statusCounts.PENDING}</span>
                <div className="text-[10px] text-zinc-400 mt-2 font-semibold">Live demand nodes awaiting bids</div>
              </div>

              <div className="rounded-[28px] bg-white border border-zinc-200/60 p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800/60 group hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Active Manifests</span>
                  <div className="h-9 w-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
                    <Box className="h-4 w-4" />
                  </div>
                </div>
                <span className="text-3xl font-black text-zinc-950 dark:text-white">{products.length}</span>
                <div className="text-[10px] text-zinc-400 mt-2 font-semibold">Synchronized industrial catalog items</div>
              </div>
            </div>

            {/* Charts and breakups */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
              {/* Top Products */}
              <div className="rounded-[36px] bg-white border border-zinc-200/60 p-8 shadow-xl shadow-indigo-600/[0.01] dark:bg-zinc-900 dark:border-zinc-800/60">
                <div className="flex items-center gap-2 mb-8 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                  <BarChart3 className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-[15px] font-bold text-zinc-950 dark:text-white uppercase tracking-wider">Sought-After Assemblies</h3>
                </div>
                
                {analytics.topProducts.length === 0 ? (
                  <p className="text-xs text-zinc-400 py-10 text-center">No active market inquiries recorded.</p>
                ) : (
                  <div className="space-y-4">
                    {analytics.topProducts.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-zinc-50/60 dark:bg-zinc-850/40 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl hover:border-indigo-100 dark:hover:border-indigo-950 transition-colors duration-300">
                        <span className="text-[13px] font-bold text-zinc-950 dark:text-white truncate pr-4">{p.title}</span>
                        <span className="text-[10px] font-black uppercase bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 px-3 py-1 rounded-full shrink-0">
                          {p.inquiries_count} Signals
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Monthly Trend graph */}
              <div className="rounded-[36px] bg-white border border-zinc-200/60 p-8 shadow-xl shadow-indigo-600/[0.01] dark:bg-zinc-900 dark:border-zinc-800/60">
                <div className="flex items-center gap-2 mb-8 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                  <Activity className="h-5 w-5 text-emerald-500" />
                  <h3 className="text-[15px] font-bold text-zinc-950 dark:text-white uppercase tracking-wider">Procurement Velocity</h3>
                </div>

                {analytics.monthlyLeads.length === 0 ? (
                  <p className="text-xs text-zinc-400 py-10 text-center">Awaiting operational ledger cycles.</p>
                ) : (
                  <div className="space-y-6">
                    {analytics.monthlyLeads.map((m, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-zinc-500 uppercase">{m.month}</span>
                          <span className="text-zinc-950 dark:text-white font-black">{m.count} leads</span>
                        </div>
                        <div className="h-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/40 dark:border-zinc-750 rounded-full overflow-hidden relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(m.count / Math.max(...analytics.monthlyLeads.map(l => l.count))) * 100}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className="h-full bg-indigo-600 rounded-full"
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div className="flex items-center gap-2">
                <PackageOpen className="h-5 w-5 text-indigo-600" />
                <h3 className="text-[15px] font-bold text-zinc-950 dark:text-white uppercase tracking-wider">Master Material Log ({products.length})</h3>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center justify-center space-x-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 py-3 px-6 text-xs font-black text-white shadow-lg shadow-indigo-600/10 transition-all active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                <span>Catalog New Assembly</span>
              </button>
            </div>

            <div className="rounded-[36px] bg-white shadow-xl shadow-indigo-600/[0.01] border border-zinc-200/60 dark:bg-zinc-900 dark:border-zinc-800/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50/50 dark:bg-zinc-950 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                      <th className="p-6">SKU Assembly Details</th>
                      <th className="p-6">Industrial Class</th>
                      <th className="p-6">Base Quote Rate</th>
                      <th className="p-6">Warehouse Allocation</th>
                      <th className="p-6">MOQ Level</th>
                      <th className="p-6 text-right">Operational Matrix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-xs text-zinc-400 font-medium">
                          No physical stock found. Initiate high-volume assemblies using the Catalog button.
                        </td>
                      </tr>
                    ) : (
                      products.map((p) => (
                        <tr key={p.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-850/20 transition-all">
                          <td className="p-6">
                            <span className="font-bold text-zinc-950 dark:text-white block mb-0.5">{p.title}</span>
                            <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">#{p.id.slice(0, 8)}</span>
                          </td>
                          <td className="p-6">
                            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-md">
                              {p.categoryId}
                            </span>
                          </td>
                          <td className="p-6 font-bold text-zinc-950 dark:text-white" suppressHydrationWarning>
                            ₹{p.price.toLocaleString()}
                          </td>
                          <td className="p-6">
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                value={p.stock}
                                onChange={(e) => handleUpdateStock(p.id, parseInt(e.target.value) || 0)}
                                className="w-20 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-1.5 px-3 text-center font-black text-zinc-950 dark:text-white outline-none focus:border-indigo-600 shadow-sm"
                              />
                              <span className="text-[10px] font-black uppercase text-zinc-400">Units</span>
                            </div>
                          </td>
                          <td className="p-6 font-black text-zinc-950 dark:text-white">{p.moq} Units</td>
                          <td className="p-6 text-right">
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="h-9 w-9 rounded-xl border border-zinc-200 text-zinc-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 dark:border-zinc-800 dark:text-zinc-500 dark:hover:text-red-400 dark:hover:bg-red-950/30 inline-flex items-center justify-center transition-all"
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mb-20">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-600" />
              <h3 className="text-[15px] font-bold text-zinc-950 dark:text-white uppercase tracking-wider">Enterprise Demand Matrix</h3>
            </div>

            {rfqLeads.length === 0 ? (
              <div className="rounded-[36px] bg-white border border-zinc-200/60 p-20 text-center text-zinc-400 shadow-xl shadow-indigo-600/[0.01] dark:bg-zinc-900 dark:border-zinc-800/60">
                <Terminal className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-zinc-950 dark:text-white mb-2">Leads feed is vacant</h4>
                <p className="text-xs font-medium text-zinc-400">No global buyer requests detected in synchronous cycles. Check back shortly.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {rfqLeads.map((rfq) => {
                  const hasResponded = rfq.responses && rfq.responses.length > 0;
                  const myBid = hasResponded ? rfq.responses[0] : null;

                  return (
                    <div
                      key={rfq.id}
                      className="rounded-[32px] border border-zinc-200/60 bg-white p-7 shadow-xl shadow-indigo-600/[0.01] dark:bg-zinc-900 dark:border-zinc-800/60 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 group"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-5 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                          <div>
                            <span className="font-mono text-[9px] font-black text-indigo-600 tracking-widest uppercase bg-indigo-50 dark:bg-indigo-950/30 px-2.5 py-0.5 rounded-md">
                              NODE ID: #{rfq.id.slice(0, 8)}
                            </span>
                            <h4 className="font-bold text-base text-zinc-950 dark:text-white mt-2 group-hover:text-indigo-600 transition-colors">{rfq.title}</h4>
                          </div>
                          <span className={`inline-flex items-center text-[10px] font-black uppercase tracking-wider py-1 px-3 rounded-full ${
                            rfq.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/30'
                              : rfq.status === 'RESPONDED'
                              ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30'
                              : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30'
                          }`}>
                            {rfq.status}
                          </span>
                        </div>

                        <div className="space-y-2.5 text-xs font-bold text-zinc-400">
                          <div className="flex justify-between items-center">
                            <span>Order Volume Request</span>
                            <span className="text-zinc-950 dark:text-white font-black" suppressHydrationWarning>{rfq.quantity.toLocaleString()} Units</span>
                          </div>
                          {rfq.targetPrice && (
                            <div className="flex justify-between items-center">
                              <span>Target Cap Rate</span>
                              <span className="text-indigo-600 font-black" suppressHydrationWarning>₹{rfq.targetPrice.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <span>Niche Sector</span>
                            <span className="uppercase text-[10px] font-black tracking-widest text-zinc-500 bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-750 px-2.5 py-1 rounded-lg">
                              {rfq.category.name}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-950/20 p-4 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/30 mt-5 leading-relaxed italic">
                          &ldquo;{rfq.description}&rdquo;
                        </p>
                      </div>

                      <div className="mt-8 pt-5 border-t border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3">
                        {hasResponded ? (
                          <div className="flex justify-between items-center w-full">
                            <span className="text-xs font-bold flex items-center gap-1.5 text-emerald-600">
                              <CheckCircle2 className="h-4 w-4" />
                              <span suppressHydrationWarning>Bid Active: ₹{myBid?.priceQuote.toLocaleString()}</span>
                            </span>
                            <span className="text-[10px] uppercase font-black text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-lg">
                              STATE: {myBid?.status}
                            </span>
                          </div>
                        ) : rfq.status !== 'CLOSED' ? (
                          <>
                            <span className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">Active Demand Cycle</span>
                            <button
                              onClick={() => setBiddingRfq(rfq)}
                              className="inline-flex items-center space-x-1.5 py-2.5 px-5 rounded-2xl text-xs font-black uppercase bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/10 active:scale-95"
                            >
                              <Send className="h-3.5 w-3.5" />
                              <span>Dispatch Quotation</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-xs font-bold text-zinc-400 w-full text-center py-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">Bid Closed</span>
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mb-20">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              <h3 className="text-[15px] font-bold text-zinc-950 dark:text-white uppercase tracking-wider">B2B Dispatched Invoice Manifest</h3>
            </div>

            {orders.length === 0 ? (
              <div className="rounded-[36px] bg-white border border-zinc-200/60 p-20 text-center text-zinc-400 shadow-xl shadow-indigo-600/[0.01] dark:bg-zinc-900 dark:border-zinc-800/60">
                <Truck className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-zinc-950 dark:text-white mb-2">Log file is unpopulated</h4>
                <p className="text-xs font-medium text-zinc-400">No order dispatches generated for your assemblies yet.</p>
              </div>
            ) : (
              <div className="rounded-[36px] bg-white shadow-xl shadow-indigo-600/[0.01] border border-zinc-200/60 dark:bg-zinc-900 dark:border-zinc-800/60 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50/50 dark:bg-zinc-950 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                        <th className="p-6">Order Ledger ID</th>
                        <th className="p-6">Freight Destination</th>
                        <th className="p-6">Consolidated Value</th>
                        <th className="p-6">Delivery Node Status</th>
                        <th className="p-6">Operational Clock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-850/20 transition-all">
                          <td className="p-6">
                            <span className="font-mono font-black text-indigo-600 tracking-wider text-xs uppercase">#{ord.id.slice(0, 8)}</span>
                          </td>
                          <td className="p-6 max-w-xs truncate">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-700 shrink-0" />
                              <span className="font-bold text-zinc-950 dark:text-white truncate">{ord.shippingAdd}</span>
                            </div>
                          </td>
                          <td className="p-6 font-black text-zinc-950 dark:text-white" suppressHydrationWarning>₹{ord.total.toLocaleString()}</td>
                          <td className="p-6">
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-900/30 px-3 py-1 rounded-full border border-emerald-100 shadow-sm">
                              <Truck className="h-3.5 w-3.5 animate-pulse" />
                              <span>{ord.status}</span>
                            </span>
                          </td>
                          <td className="p-6 text-zinc-400 font-bold">{new Date(ord.createdAt).toLocaleDateString()}</td>
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
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl rounded-[36px] bg-white p-8 shadow-2xl border border-zinc-200/60 dark:bg-zinc-900 dark:border-zinc-800/60 overflow-hidden z-10"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wider">Execute Competitive Quotation</h3>
                </div>
                <button onClick={() => setBiddingRfq(null)} className="h-8 w-8 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-400 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs font-medium text-zinc-500 mb-6">Supply strategic pricing to secure the contract payload for Lead ID #{biddingRfq.id.slice(0, 8).toUpperCase()}.</p>

              <form onSubmit={handlePlaceBid} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">OEM Unit Quote (INR)</label>
                    <input
                      type="number"
                      required
                      value={bidPrice}
                      onChange={(e) => setBidPrice(e.target.value)}
                      placeholder={biddingRfq.targetPrice?.toString() || 'e.g. 1800'}
                      className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 px-4 text-[13px] font-medium text-zinc-950 outline-none focus:border-indigo-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">Commitment SLA (Days)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={bidLeadTime}
                      onChange={(e) => setBidLeadTime(e.target.value)}
                      placeholder="e.g. 7"
                      className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 px-4 text-[13px] font-medium text-zinc-950 outline-none focus:border-indigo-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">Compliance Annotations & Terms</label>
                  <textarea
                    rows={3}
                    value={bidNotes}
                    onChange={(e) => setBidNotes(e.target.value)}
                    placeholder="Specify QC warranties, RoHS certifications, custom packaging layouts..."
                    className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 px-4 text-[13px] font-medium text-zinc-950 outline-none focus:border-indigo-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white resize-none shadow-sm"
                  />
                </div>

                <div className="flex justify-end items-center space-x-3 pt-6 border-t border-zinc-100 dark:border-zinc-800 mt-6">
                  <button
                    type="button"
                    onClick={() => setBiddingRfq(null)}
                    className="py-3 px-6 rounded-2xl text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                  >
                    Decline
                  </button>
                  <button
                    type="submit"
                    disabled={biddingSubmitting}
                    className="rounded-2xl bg-indigo-600 hover:bg-indigo-500 py-3.5 px-8 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-600/15 transition-all flex items-center justify-center active:scale-[0.98]"
                  >
                    {biddingSubmitting ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl bg-white rounded-[36px] border border-zinc-200/60 dark:bg-zinc-900 dark:border-zinc-800/60 p-8 shadow-2xl overflow-hidden relative z-10"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wider">Inventory Provision Node</h3>
                </div>
                <button onClick={() => setShowAddModal(false)} className="h-8 w-8 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-400 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">Asset Descriptor / Name</label>
                  <input
                    type="text"
                    required
                    value={prodTitle}
                    onChange={(e) => setProdTitle(e.target.value)}
                    placeholder="e.g. High-Precision Linear Actuator 12V-24V"
                    className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 px-4 text-[13px] font-medium text-zinc-950 outline-none focus:border-indigo-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">Operational Parameters & Datasheet</label>
                  <textarea
                    required
                    rows={3}
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    placeholder="Enter load capacity, stroke length, duty cycle factors..."
                    className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 px-4 text-[13px] font-medium text-zinc-950 outline-none focus:border-indigo-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white resize-none shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-3 gap-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">Base Price (INR)</label>
                    <input
                      type="number"
                      required
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      placeholder="e.g. 12000"
                      className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 px-4 text-[13px] font-medium text-zinc-950 outline-none focus:border-indigo-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">Unit MOQ</label>
                    <input
                      type="number"
                      required
                      value={prodMoq}
                      onChange={(e) => setProdMoq(e.target.value)}
                      placeholder="e.g. 10"
                      className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 px-4 text-[13px] font-medium text-zinc-950 outline-none focus:border-indigo-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">Starting Stock</label>
                    <input
                      type="number"
                      required
                      value={prodStock}
                      onChange={(e) => setProdStock(e.target.value)}
                      placeholder="e.g. 250"
                      className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 px-4 text-[13px] font-medium text-zinc-950 outline-none focus:border-indigo-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">Product taxonomy Niche</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 px-4 text-[13px] font-black text-zinc-950 outline-none focus:border-indigo-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white shadow-sm cursor-pointer"
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
                  className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 py-4 text-[14px] font-black text-white transition-all shadow-lg shadow-indigo-600/15 flex items-center justify-center mt-6 active:scale-[0.99]"
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
