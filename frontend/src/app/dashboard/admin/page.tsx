'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../../utils/api';
import dynamic from 'next/dynamic';
const Antigravity = dynamic(() => import('../../../components/animations/Antigravity'), { ssr: false });
import {
  Users,
  ShoppingBag,
  FileText,
  CheckCircle2,
  ShieldAlert,
  Trash2,
  ShieldCheck,
  Server,
  Cpu,
  Building2,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#111111] text-ink-black dark:text-zinc-50 pt-24 selection:bg-[#043F1C] selection:text-white transition-colors duration-300">
      {/* Background Micro-particle Telemetry Ambient */}
      <div className="fixed inset-0 z-0 opacity-5 pointer-events-none">
        <Antigravity count={100} color="#346941" particleShape="box" />
      </div>

      <main className="mx-auto max-w-7xl px-6 py-12 md:px-16 relative z-10">
        {/* Command Bar Top Section / Editorial Header */}
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between mb-16 pb-10 border-b border-border-subtle dark:border-zinc-800 gap-8">
          <div>
            <span className="font-monoenterprise text-[10px] tracking-[0.25em] text-zinc-400 dark:text-zinc-500 uppercase flex items-center gap-2 mb-3">
              <Cpu className="h-3 w-3 text-secondary" />
              <span>Platform Operations Node</span>
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-light tracking-tight text-ink-black dark:text-white">
              Hyper-V <span className="italic">Control Panel</span>
            </h1>
            <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400 mt-3 max-w-2xl leading-relaxed">
              Oversee secure ledger activity, coordinate verified enterprise clearances, and moderate physical assets across the network workspace.
            </p>
          </div>

          {/* Telemetry Status Widget */}
          <div className="flex items-center space-x-3 bg-white dark:bg-[#181818] border border-border-subtle dark:border-zinc-800 px-4 py-2 text-[10px] font-monoenterprise uppercase tracking-widest">
            <div className="flex h-2 w-2 relative items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </div>
            <Server className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-zinc-600 dark:text-zinc-300">
              Platform Mesh: <span className="text-emerald-600 dark:text-emerald-400 font-bold">ACTIVE</span>
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-32 flex items-center justify-center">
            <div className="h-8 w-8 border border-ink-black border-t-transparent dark:border-white animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Enterprise metrics log - Flat Bento Architecture */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-b border-border-subtle dark:border-zinc-800 divide-y sm:divide-y-0 sm:divide-x divide-border-subtle dark:divide-zinc-800 mb-16 bg-white dark:bg-[#151515]">
                {/* Metric 1 */}
                <div className="p-8 group hover:bg-[#F9F9F9] dark:hover:bg-[#1c1c1c] transition-colors duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <p className="font-monoenterprise text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Total Accounts</p>
                    <Users className="h-4 w-4 text-zinc-400" />
                  </div>
                  <h3 className="font-heading text-4xl font-normal text-ink-black dark:text-white leading-none mb-4">{stats.totalUsers}</h3>
                  <div className="h-6 overflow-hidden opacity-30 group-hover:opacity-60 transition-opacity duration-300">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                      <path d="M0 35 L20 25 L40 30 L60 10 L80 15 L100 5" fill="none" stroke="currentColor" strokeWidth="1"></path>
                    </svg>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="p-8 group hover:bg-[#F9F9F9] dark:hover:bg-[#1c1c1c] transition-colors duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <p className="font-monoenterprise text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Catalog Entities</p>
                    <ShoppingBag className="h-4 w-4 text-zinc-400" />
                  </div>
                  <h3 className="font-heading text-4xl font-normal text-ink-black dark:text-white leading-none mb-4">{stats.totalProducts}</h3>
                  <div className="h-6 overflow-hidden opacity-30 group-hover:opacity-60 transition-opacity duration-300">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                      <path d="M0 20 Q25 40 50 20 T100 30" fill="none" stroke="currentColor" strokeWidth="1"></path>
                    </svg>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="p-8 group hover:bg-[#F9F9F9] dark:hover:bg-[#1c1c1c] transition-colors duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <p className="font-monoenterprise text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Active RFQs</p>
                    <FileText className="h-4 w-4 text-zinc-400" />
                  </div>
                  <h3 className="font-heading text-4xl font-normal text-ink-black dark:text-white leading-none mb-4">{stats.totalInquiries}</h3>
                  <div className="flex gap-1 h-1.5 items-center opacity-40 group-hover:opacity-80 transition-opacity duration-300">
                    <div className="h-px bg-zinc-400 w-full"></div>
                    <div className="h-1 w-1 bg-zinc-450 rounded-full"></div>
                    <div className="h-px bg-zinc-400 w-12"></div>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="p-8 group hover:bg-[#F9F9F9] dark:hover:bg-[#1c1c1c] transition-colors duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <p className="font-monoenterprise text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Executed Invoices</p>
                    <CheckCircle2 className="h-4 w-4 text-zinc-400" />
                  </div>
                  <h3 className="font-heading text-4xl font-normal text-ink-black dark:text-white leading-none mb-4">{stats.totalOrders}</h3>
                  <div className="h-6 overflow-hidden opacity-30 group-hover:opacity-60 transition-opacity duration-300">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                      <path d="M0 30 L30 10 L60 25 L100 5" fill="none" stroke="currentColor" strokeWidth="1"></path>
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Switcher tabs */}
            <div className="flex items-center mb-10 border-b border-border-subtle dark:border-zinc-800">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`pb-4 text-[11px] font-monoenterprise uppercase tracking-[0.2em] transition-all relative ${
                    activeTab === 'users'
                      ? 'text-ink-black dark:text-white font-semibold'
                      : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                  }`}
                >
                  Enterprise Accounts
                  {activeTab === 'users' && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`pb-4 text-[11px] font-monoenterprise uppercase tracking-[0.2em] transition-all relative ${
                    activeTab === 'products'
                      ? 'text-ink-black dark:text-white font-semibold'
                      : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                  }`}
                >
                  Catalog Moderation
                  {activeTab === 'products' && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"
                    />
                  )}
                </button>
              </div>
            </div>

            {/* High contrast structured open table wrapper */}
            <div className="border border-border-subtle dark:border-zinc-800 bg-white dark:bg-[#151515] overflow-hidden mb-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'users' ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-zinc-50 dark:bg-zinc-900/50 text-[10px] font-monoenterprise uppercase tracking-widest text-zinc-400 dark:text-zinc-500 border-b border-border-subtle dark:border-zinc-800">
                            <th className="py-5 px-6 font-semibold">User Name</th>
                            <th className="py-5 px-6 font-semibold">Email Address</th>
                            <th className="py-5 px-6 font-semibold">Role</th>
                            <th className="py-5 px-6 font-semibold">Company Profile</th>
                            <th className="py-5 px-6 font-semibold text-right">Clearance Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle dark:divide-zinc-800 text-[13px] text-zinc-650 dark:text-zinc-400">
                          {users.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-12 px-6 text-center text-xs text-zinc-400">No active accounts detected.</td>
                            </tr>
                          ) : (
                            users.map((u) => (
                              <tr key={u.id} className="hover:bg-[#FDFDFD] dark:hover:bg-[#181818]/60 transition-colors duration-200">
                                <td className="py-6 px-6 font-semibold text-ink-black dark:text-zinc-200">{u.name}</td>
                                <td className="py-6 px-6 max-w-xs truncate">
                                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 font-monoenterprise text-xs">
                                    <Mail className="h-3.5 w-3.5 text-zinc-450 dark:text-zinc-550" />
                                    <span>{u.email}</span>
                                  </div>
                                </td>
                                <td className="py-6 px-6">
                                  <span className={`inline-flex py-0.5 px-2 text-[9px] font-monoenterprise uppercase tracking-wider border ${
                                    u.role === 'SELLER'
                                      ? 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-secondary dark:text-secondary-container'
                                      : u.role === 'ADMIN'
                                      ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/20 text-rose-600 dark:text-rose-400'
                                      : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-150 dark:border-zinc-800/80 text-zinc-500 dark:text-zinc-400'
                                  }`}>
                                    {u.role}
                                  </span>
                                </td>
                                <td className="py-6 px-6">
                                  {u.profile ? (
                                    <div className="flex flex-col">
                                      <span className="font-semibold text-ink-black dark:text-zinc-200 flex items-center gap-2">
                                        <Building2 className="h-3.5 w-3.5 text-zinc-400" />
                                        {u.profile.companyName}
                                      </span>
                                      <span className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-1 font-monoenterprise bg-[#F0EBE5] dark:bg-zinc-800 px-2 py-0.5 w-fit">
                                        GST: {u.profile.gstNumber || 'N/A'}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-[11px] italic text-zinc-400 dark:text-zinc-500">No Corporate Details Linked</span>
                                  )}
                                </td>
                                <td className="py-6 px-6 text-right">
                                  {u.role === 'SELLER' && u.profile ? (
                                    <button
                                      onClick={() => handleToggleVerification(u.id, u.profile!.isVerified)}
                                      className={`inline-flex items-center space-x-1.5 py-1.5 px-3 border text-[9px] font-monoenterprise uppercase tracking-wider transition-all duration-200 ${
                                        u.profile.isVerified
                                          ? 'border-secondary text-secondary hover:bg-secondary/5'
                                          : 'border-amber-600 text-amber-600 hover:bg-amber-600/5'
                                      }`}
                                    >
                                      {u.profile.isVerified ? (
                                        <>
                                          <ShieldCheck className="h-3.5 w-3.5" />
                                          <span>Verified</span>
                                        </>
                                      ) : (
                                        <>
                                          <ShieldAlert className="h-3.5 w-3.5" />
                                          <span>Verify Node</span>
                                        </>
                                      )}
                                    </button>
                                  ) : (
                                    <span className="text-[11px] text-zinc-300 dark:text-zinc-700 font-monoenterprise">—</span>
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
                          <tr className="bg-zinc-50 dark:bg-zinc-900/50 text-[10px] font-monoenterprise uppercase tracking-widest text-zinc-400 dark:text-zinc-500 border-b border-border-subtle dark:border-zinc-800">
                            <th className="py-5 px-6 font-semibold">Entity Name</th>
                            <th className="py-5 px-6 font-semibold">Category</th>
                            <th className="py-5 px-6 font-semibold">Price Tier</th>
                            <th className="py-5 px-6 font-semibold">OEM Operator</th>
                            <th className="py-5 px-6 font-semibold text-right">Moderation Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle dark:divide-zinc-800 text-[13px] text-zinc-650 dark:text-zinc-400">
                          {products.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-12 px-6 text-center text-xs text-zinc-400">Active catalog is empty.</td>
                            </tr>
                          ) : (
                            products.map((p) => (
                              <tr key={p.id} className="hover:bg-[#FDFDFD] dark:hover:bg-[#181818]/60 transition-colors duration-200">
                                <td className="py-6 px-6 font-semibold text-ink-black dark:text-zinc-200 max-w-md truncate">{p.title}</td>
                                <td className="py-6 px-6">
                                  <span className="text-[10px] font-monoenterprise uppercase tracking-wider text-secondary bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5">
                                    {p.categoryId}
                                  </span>
                                </td>
                                <td className="py-6 px-6 font-heading text-[15px] text-ink-black dark:text-zinc-200" suppressHydrationWarning>
                                  ₹{p.price.toLocaleString()}
                                </td>
                                <td className="py-6 px-6">
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-ink-black dark:text-zinc-200">{p.seller?.name || 'Unknown Operator'}</span>
                                    <span className="text-[10px] text-zinc-450 dark:text-zinc-550 font-monoenterprise truncate max-w-[180px]">
                                      {p.seller?.email || ''}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-6 px-6 text-right">
                                  <button
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="h-8 w-8 border border-border-subtle dark:border-zinc-800 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-950 inline-flex items-center justify-center transition-all duration-200"
                                    title="Revoke Asset"
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
              </AnimatePresence>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
