'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, getApiErrorMessage } from '../../../utils/api';
import { useAuthStore } from '../../../store/useAuthStore';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import dynamic from 'next/dynamic';
const Antigravity = dynamic(() => import('../../../components/animations/Antigravity'), { ssr: false });

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
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#F9F9F9] dark:bg-[#111111] px-6 py-12 transition-colors duration-300">
      {/* Background Micro-particle Telemetry Ambient */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <Antigravity count={80} color="#346941" particleShape="box" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Core Identity Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-none bg-white dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 p-1.5 transition-transform duration-300">
              <img src="/favicon.ico" alt="TATAmart Logo" className="h-full w-full object-contain grayscale" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xl font-heading font-light tracking-tight text-ink-black dark:text-white">
                TATAmart
              </span>
              <span className="text-[8px] font-monoenterprise uppercase tracking-[0.25em] text-secondary mt-0.5">
                Enterprise Sourcing
              </span>
            </div>
          </Link>
        </div>

        {/* Enterprise Login Card Wrapper - Minimal Notion Style */}
        <div className="border border-border-subtle bg-white dark:bg-[#151515] dark:border-zinc-800 p-8 sm:p-10 rounded-none shadow-sm">
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-light tracking-tight text-ink-black dark:text-white mb-2">
              Welcome <span className="italic">back.</span>
            </h2>
            <p className="text-xs font-sans text-zinc-400 dark:text-zinc-550">
              Sign in to your global enterprise portal.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 border border-red-200 bg-red-50/50 p-4 text-xs font-monoenterprise text-red-650 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400 flex items-center gap-2.5"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0"></div>
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[9px] font-monoenterprise uppercase tracking-[0.2em] text-zinc-450 dark:text-zinc-550 mb-2 ml-0.5">
                Corporate Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 h-4 w-4 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full rounded-none border border-border-subtle bg-white py-3.5 pl-12 pr-4 text-xs font-sans text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-ink-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-650"
                  id="input-login-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-monoenterprise uppercase tracking-[0.2em] text-zinc-450 dark:text-zinc-550 mb-2 ml-0.5">
                Account Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 h-4 w-4 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-none border border-border-subtle bg-white py-3.5 pl-12 pr-4 text-xs font-sans text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-ink-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-650"
                  id="input-login-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-none bg-ink-black hover:bg-zinc-850 py-4 text-xs font-monoenterprise uppercase tracking-widest text-white transition-all disabled:opacity-50 mt-8 active:scale-[0.99] dark:bg-white dark:hover:bg-zinc-200 dark:text-ink-black"
              id="btn-login-submit"
            >
              {loading ? (
                <div className="h-4 w-4 border border-white border-t-transparent dark:border-ink-black animate-spin"></div>
              ) : (
                <>
                  <span>Log In</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-[9px] font-monoenterprise uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            <ShieldCheck className="h-4 w-4 text-secondary" />
            <span>Secured SSL Handshake</span>
          </div>

          <div className="mt-6 text-center text-xs font-sans">
            <Link href="/auth/forgot-password" className="text-zinc-400 hover:text-ink-black dark:hover:text-white transition-colors">
              Forgot your password?
            </Link>
          </div>

          <div className="mt-8 text-center text-xs font-sans border-t border-border-subtle dark:border-zinc-800 pt-6">
            <span className="text-zinc-400">Don&apos;t have an account? </span>
            <Link href="/auth/register" className="text-secondary dark:text-emerald-400 hover:underline font-semibold transition-colors" id="link-register">
              Join Free
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
