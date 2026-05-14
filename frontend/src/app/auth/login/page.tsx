'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, getApiErrorMessage } from '../../../utils/api';
import { useAuthStore } from '../../../store/useAuthStore';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import Antigravity from '../../../components/animations/Antigravity';

export default function Login() {
  const router = useRouter();
  const loginStore = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data.data;
      loginStore(token, user);
      router.push('/');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Invalid email or password'));
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
        {/* Core Identity Brand Header */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 shadow-md p-2 group-hover:scale-105 transition-transform duration-300">
              <img src="/favicon.ico" alt="TATAmart Logo" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-950 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
                TATAmart
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-brand-primary mt-0.5">
                Enterprise Trading
              </span>
            </div>
          </Link>
        </div>

        {/* Enterprise Login Card Wrapper */}
        <div className="rounded-[40px] border border-zinc-200/60 bg-white/80 p-8 sm:p-10 shadow-2xl shadow-indigo-600/[0.03] backdrop-blur-2xl dark:border-zinc-800/80 dark:bg-zinc-900/80">
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-white mb-2">
              Welcome back.
            </h2>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Sign in to your corporate procurement dashboard
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-2xl border border-red-200/60 bg-red-50/50 p-4 text-xs font-bold text-red-600 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400 flex items-center gap-2"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0"></div>
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 ml-1">
                Corporate Email
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 h-4.5 w-4.5 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 pl-12 pr-4 text-[15px] font-medium text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-brand-primary focus:ring-4 focus:ring-indigo-600/5 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-500"
                  id="input-login-email"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Secret Password
                </label>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 h-4.5 w-4.5 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 pl-12 pr-4 text-[15px] font-medium text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-brand-primary focus:ring-4 focus:ring-indigo-600/5 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-500"
                  id="input-login-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary hover:bg-indigo-600 py-4 text-[15px] font-black text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:shadow-indigo-600/30 disabled:opacity-50 mt-8 active:scale-[0.99]"
              id="btn-login-submit"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Secured enterprise-grade node</span>
          </div>

          <div className="mt-6 text-center text-sm font-semibold text-zinc-400">
            <Link href="/auth/forgot-password" className="text-zinc-500 hover:text-brand-primary transition-colors">
              Forgot your password?
            </Link>
          </div>

          <div className="mt-8 text-center text-sm font-semibold text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-6">
            <span>Don&apos;t have a profile? </span>
            <Link href="/auth/register" className="text-brand-primary hover:text-indigo-600 font-black transition-colors" id="link-register">
              Join Free
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

