'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, getApiErrorMessage } from '../../../utils/api';
import { useAuthStore } from '../../../store/useAuthStore';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Lock, Building, ArrowRight, ShieldCheck, User, ShoppingBag, UserCheck } from 'lucide-react';
import Antigravity from '../../../components/animations/Antigravity';

export default function Register() {
  const router = useRouter();
  const loginStore = useAuthStore((state) => state.login);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'BUYER' | 'SELLER'>('BUYER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      const { token, user } = response.data.data;
      loginStore(token, user);
      router.push('/');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Registration failed. Try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#fafafc] dark:bg-[#09090b] px-6 py-12">
      <div className="absolute inset-0 z-0 opacity-60 mix-blend-screen pointer-events-none">
        <Antigravity count={250} color="#4f46e5" particleShape="sphere" autoAnimate />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 shadow-md p-2 group-hover:scale-105 transition-transform duration-300">
              <img src="/favicon.ico" alt="TATAmart Logo" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-950 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
                TATAmart
              </span>
              <span className="text-[8px] font-bold uppercase tracking-widest text-brand-primary mt-0.5">
                Enterprise Trading
              </span>
            </div>
          </Link>
        </div>

        {/* Premium Account Card */}
        <div className="rounded-[40px] border border-zinc-200/60 bg-white/80 p-8 shadow-2xl shadow-indigo-600/[0.03] backdrop-blur-2xl dark:border-zinc-800/80 dark:bg-zinc-900/80">
          <div className="text-center mb-6">
            <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-white mb-1.5">
              Create workspace.
            </h2>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Connect directly into the relational supply chain
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 rounded-2xl border border-red-200/60 bg-red-50/50 p-3.5 text-xs font-bold text-red-600 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400 flex items-center gap-2"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0"></div>
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Role Selector Block */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">
                Corporate Role Definition
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRole('BUYER')}
                  className={`flex items-center justify-center space-x-1.5 rounded-2xl py-3 px-2 text-xs font-black transition-all border ${
                    role === 'BUYER'
                      ? 'bg-zinc-950 border-zinc-950 text-white shadow-md dark:bg-white dark:border-white dark:text-zinc-950'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800'
                  }`}
                  id="btn-role-buyer"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Procure (Buyer)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('SELLER')}
                  className={`flex items-center justify-center space-x-1.5 rounded-2xl py-3 px-2 text-xs font-black transition-all border ${
                    role === 'SELLER'
                      ? 'bg-zinc-950 border-zinc-950 text-white shadow-md dark:bg-white dark:border-white dark:text-zinc-950'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800'
                  }`}
                  id="btn-role-seller"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>Supply (Seller)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 ml-1">
                Authorized Representative
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-4 h-4.5 w-4.5 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Legal Name"
                  className="w-full rounded-2xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-brand-primary focus:ring-4 focus:ring-indigo-600/5 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  id="input-register-name"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 ml-1">
                Corporate Address Email
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 h-4.5 w-4.5 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-2xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-brand-primary focus:ring-4 focus:ring-indigo-600/5 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  id="input-register-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 ml-1">
                Node Secure Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 h-4.5 w-4.5 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-2xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-brand-primary focus:ring-4 focus:ring-indigo-600/5 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  id="input-register-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary hover:bg-indigo-600 py-3.5 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:shadow-indigo-600/30 disabled:opacity-50 mt-6 active:scale-[0.99]"
              id="btn-register-submit"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Initialize Workspace</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>GST-Vetted Node Authentication</span>
          </div>

          <div className="mt-6 text-center text-xs font-bold text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-4">
            <span>Already joined? </span>
            <Link href="/auth/login" className="text-brand-primary hover:text-indigo-600 transition-colors" id="link-login">
              Access Workspace
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

