'use client';

import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { api } from '../../../utils/api';
import Antigravity from '../../../components/animations/Antigravity';
import {
  Users,
  ShoppingBag,
  FileText,
  CheckCircle2,
  ShieldAlert,
  Trash2,
  ShieldCheck,
  Database,
  Server,
  Activity,
  Cpu,
  Building2,
  Mail,
  XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  profile: {
    companyName: string;
    gstNumber: string;
    city: string;
    isVerified: boolean;
  } | null;
}

interface Product {
  id: string;
  title: string;
  price: number;
  categoryId: string;
  seller: {
    name: string;
    email: string;
  };
}

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalInquiries: number;
  totalOrders: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'users' | 'products'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [usersRes, productsRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/products'),
        api.get('/admin/stats'),
      ]);
      setUsers(usersRes.data.data || usersRes.data);
      setProducts(productsRes.data.data || productsRes.data);
      setStats(statsRes.data.data || statsRes.data);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleVerification = async (userId: string, currentStatus: boolean) => {
    try {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, profile: u.profile ? { ...u.profile, isVerified: !currentStatus } : null }
            : u
        )
      );
      await api.put(`/admin/users/${userId}/verify`, { isVerified: !currentStatus });
    } catch (error) {
      console.error('Failed to toggle verification:', error);
      fetchData();
    }
  };

  const handleDeleteProduct = async (prodId: string) => {
    try {
      setProducts((prev) => prev.filter((p) => p.id !== prodId));
      if (stats) setStats({ ...stats, totalProducts: stats.totalProducts - 1 });
      await api.delete(`/products/${prodId}`);
    } catch (error) {
      console.error('Failed to moderate product:', error);
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 pt-24 selection:bg-brand-primary selection:text-white">
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <Antigravity count={200} color="#8b5cf6" particleShape="box" />
      </div>
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8 relative z-10">
        {/* Command Bar Top Section */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between mb-12 pb-8 border-b border-zinc-200/60 dark:border-zinc-800/60 gap-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-brand-primary bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full mb-3">
              <Cpu className="h-3 w-3" />
              <span>Platform Operations Node</span>
            </span>
            <h1 className="font-hero text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white mt-1 flex flex-wrap items-center gap-3">
              <Database className="h-8 w-8 text-brand-primary" />
              <span>Hyper-V Control Panel</span>
            </h1>
            <p className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400 mt-1.5">Oversee secure ledger activity, coordinate verified node clearances, and moderate physical assets.</p>
          </div>

          {/* Telemetry Widget */}
          <div className="flex items-center space-x-3 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 px-5 py-3 rounded-[24px] text-[11px] font-black uppercase tracking-wider shadow-sm">
            <div className="flex h-2.5 w-2.5 relative items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </div>
            <Server className="h-4 w-4 text-zinc-400" />
            <span className="text-zinc-600 dark:text-zinc-300">Platform Mesh: <span className="text-emerald-600 font-black">HEALTHY</span></span>
          </div>
        </div>

        {loading ? (
          <div className="py-32 flex items-center justify-center">
            <div className="h-10 w-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Enterprise metrics log */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="rounded-[28px] bg-white border border-zinc-200/60 p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800/60 group hover:shadow-md transition-all duration-300 flex items-center space-x-5">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-brand-primary dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Total Subscriptions</span>
                    <h3 className="font-hero text-2xl font-black text-zinc-950 dark:text-white leading-none mt-1">{stats.totalUsers}</h3>
                  </div>
                </div>

                <div className="rounded-[28px] bg-white border border-zinc-200/60 p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800/60 group hover:shadow-md transition-all duration-300 flex items-center space-x-5">
                  <div className="h-12 w-12 rounded-2xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Catalog Entities</span>
                    <h3 className="font-hero text-2xl font-black text-zinc-950 dark:text-white leading-none mt-1">{stats.totalProducts}</h3>
                  </div>
                </div>

                <div className="rounded-[28px] bg-white border border-zinc-200/60 p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800/60 group hover:shadow-md transition-all duration-300 flex items-center space-x-5">
                  <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Active Rfqs</span>
                    <h3 className="font-hero text-2xl font-black text-zinc-950 dark:text-white leading-none mt-1">{stats.totalInquiries}</h3>
                  </div>
                </div>

                <div className="rounded-[28px] bg-white border border-zinc-200/60 p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800/60 group hover:shadow-md transition-all duration-300 flex items-center space-x-5">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Executed Invoices</span>
                    <h3 className="font-hero text-2xl font-black text-zinc-950 dark:text-white leading-none mt-1">{stats.totalOrders}</h3>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation sliding switchers */}
            <div className="flex items-center mb-8 pb-2">
              <div className="flex items-center gap-2 bg-white border border-zinc-200/60 p-1.5 rounded-[24px] dark:bg-zinc-900 dark:border-zinc-800/60 shadow-sm">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-2.5 px-5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 ${
                    activeTab === 'users'
                      ? 'bg-brand-primary text-white shadow-lg shadow-indigo-600/15'
                      : 'text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  Enterprise Accounts
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`py-2.5 px-5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 ${
                    activeTab === 'products'
                      ? 'bg-brand-primary text-white shadow-lg shadow-indigo-600/15'
                      : 'text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  Catalog Moderation
                </button>
              </div>
            </div>

            {/* Premium Table UI Blocks */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[36px] bg-white shadow-xl shadow-indigo-600/[0.01] border border-zinc-200/60 dark:bg-zinc-900 dark:border-zinc-800/60 overflow-hidden mb-20"
            >
              {activeTab === 'users' ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50/50 dark:bg-zinc-950 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                        <th className="p-6">Enterprise Operator</th>
                        <th className="p-6">Email Protocol</th>
                        <th className="p-6">Role Class</th>
                        <th className="p-6">Company & Corporate Identification</th>
                        <th className="p-6 text-right">Clearance Pipeline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-12 text-center text-xs text-zinc-400">No active directories detected.</td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-850/20 transition-all">
                            <td className="p-6 font-bold text-zinc-950 dark:text-white">{u.name}</td>
                            <td className="p-6 max-w-xs truncate">
                              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-xs">
                                <Mail className="h-3.5 w-3.5 text-zinc-300" />
                                <span>{u.email}</span>
                              </div>
                            </td>
                            <td className="p-6">
                              <span className={`inline-flex py-1 px-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                u.role === 'SELLER'
                                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-brand-primary dark:text-indigo-400'
                                  : u.role === 'ADMIN'
                                  ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="p-6">
                              {u.profile ? (
                                <div className="flex flex-col">
                                  <span className="font-bold text-zinc-950 dark:text-white flex items-center gap-1.5">
                                    <Building2 className="h-3.5 w-3.5 text-zinc-300" />
                                    {u.profile.companyName}
                                  </span>
                                  <span className="text-[10px] text-zinc-400 mt-1 font-bold bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-500 px-2 py-0.5 rounded inline-flex w-fit">GST: {u.profile.gstNumber || 'N/A'}</span>
                                </div>
                              ) : (
                                <span className="text-[11px] italic font-bold text-zinc-400">Incomplete Ledger Profile</span>
                              )}
                            </td>
                            <td className="p-6 text-right">
                              {u.role === 'SELLER' && u.profile ? (
                                <button
                                  onClick={() => handleToggleVerification(u.id, u.profile!.isVerified)}
                                  className={`inline-flex items-center space-x-1.5 py-2 px-4 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 border ${
                                    u.profile.isVerified
                                      ? 'bg-emerald-50 border-emerald-100 text-emerald-600 shadow-md shadow-emerald-500/5 dark:bg-emerald-950/30 dark:border-emerald-900/30 dark:text-emerald-400'
                                      : 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-950/30 dark:border-amber-900/30 dark:text-amber-400 animate-pulse'
                                  }`}
                                >
                                  {u.profile.isVerified ? (
                                    <>
                                      <ShieldCheck className="h-3.5 w-3.5" />
                                      <span>Verified Node</span>
                                    </>
                                  ) : (
                                    <>
                                      <ShieldAlert className="h-3.5 w-3.5" />
                                      <span>Clearance Req</span>
                                    </>
                                  )}
                                </button>
                              ) : (
                                <span className="text-[11px] font-bold text-zinc-300 dark:text-zinc-700">—</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50/50 dark:bg-zinc-950 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                        <th className="p-6">Assembly Specifications</th>
                        <th className="p-6">Niche Taxonomy</th>
                        <th className="p-6">Base Invoice Rate</th>
                        <th className="p-6">Affiliated OEM Node</th>
                        <th className="p-6 text-right">Moderation Pipeline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-12 text-center text-xs text-zinc-400">Active catalog is empty.</td>
                        </tr>
                      ) : (
                        products.map((p) => (
                          <tr key={p.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-850/20 transition-all">
                            <td className="p-6 font-bold text-zinc-950 dark:text-white max-w-md truncate">{p.title}</td>
                            <td className="p-6">
                              <span className="text-[10px] font-black uppercase tracking-wider text-brand-primary bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-md">
                                {p.categoryId}
                              </span>
                            </td>
                            <td className="p-6 font-bold text-zinc-950 dark:text-white">₹{p.price.toLocaleString()}</td>
                            <td className="p-6">
                              <div className="flex flex-col">
                                <span className="font-bold text-zinc-950 dark:text-white">{p.seller?.name || 'Unknown Operator'}</span>
                                <span className="text-[10px] text-zinc-400 mt-0.5 font-mono truncate max-w-[160px]">{p.seller?.email || ''}</span>
                              </div>
                            </td>
                            <td className="p-6 text-right">
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="h-9 w-9 rounded-xl border border-zinc-200 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200 dark:border-zinc-800 dark:text-zinc-500 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 inline-flex items-center justify-center transition-all"
                                title="Revoke Asset From Mesh"
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
              )}
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}

