'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, getApiErrorMessage } from '../../../utils/api';
import { useAuthStore } from '../../../store/useAuthStore';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, User, ShoppingBag, UserCheck } from 'lucide-react';
import dynamic from 'next/dynamic';
const Antigravity = dynamic(() => import('../../../components/animations/Antigravity'), { ssr: false });

export default function Register() {
  const router = useRouter();
  const loginStore = useAuthStore((state) => state.login);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+91');
  const [role, setRole] = useState<'BUYER' | 'SELLER'>('BUYER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/register', { 
        name, 
        email, 
        password, 
        role,
        phone_number: phoneNumber,
        phone_country_code: phoneCountryCode
      });
      const { token, user } = response.data.data;
      loginStore(token, user);
      router.push('/auth/verify-email');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Registration failed. Try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#F9F9F9] dark:bg-[#111111] px-6 py-12 transition-colors duration-300">
      {/* Background Telemetry Ambient */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <Antigravity count={80} color="#346941" particleShape="box" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand Header */}
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

        {/* Premium Account Card */}
        <div className="border border-border-subtle bg-white dark:bg-[#151515] dark:border-zinc-800 p-8 sm:p-10 rounded-none shadow-sm">
          <div className="text-center mb-6">
            <h2 className="font-heading text-3xl font-light tracking-tight text-ink-black dark:text-white mb-2">
              Create <span className="italic">workspace.</span>
            </h2>
            <p className="text-xs font-sans text-zinc-450 dark:text-zinc-550">
              Connect directly into the global procurement registry.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-5 border border-red-200 bg-red-50/50 p-4 text-xs font-monoenterprise text-red-650 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400 flex items-center gap-2.5"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0"></div>
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Account Role Selector Block */}
            <div>
              <label className="block text-[9px] font-monoenterprise uppercase tracking-[0.2em] text-zinc-450 dark:text-zinc-550 mb-2 ml-0.5">
                Corporate Role Definition
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('BUYER')}
                  className={`flex items-center justify-center space-x-2 rounded-none py-3 px-2 text-xs font-monoenterprise uppercase tracking-widest transition-all border ${
                    role === 'BUYER'
                      ? 'bg-ink-black border-ink-black text-white dark:bg-white dark:border-white dark:text-ink-black'
                      : 'border-border-subtle bg-transparent text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
                  }`}
                  id="btn-role-buyer"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Procure</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('SELLER')}
                  className={`flex items-center justify-center space-x-2 rounded-none py-3 px-2 text-xs font-monoenterprise uppercase tracking-widest transition-all border ${
                    role === 'SELLER'
                      ? 'bg-ink-black border-ink-black text-white dark:bg-white dark:border-white dark:text-ink-black'
                      : 'border-border-subtle bg-transparent text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
                  }`}
                  id="btn-role-seller"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>Supply</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-monoenterprise uppercase tracking-[0.2em] text-zinc-450 dark:text-zinc-550 mb-1.5 ml-0.5">
                Authorized Representative
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-4 h-4 w-4 text-zinc-450" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Legal Name"
                  className="w-full rounded-none border border-border-subtle bg-white py-3 pl-11 pr-4 text-xs font-sans text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-ink-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-650"
                  id="input-register-name"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-monoenterprise uppercase tracking-[0.2em] text-zinc-450 dark:text-zinc-550 mb-1.5 ml-0.5">
                Corporate Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 h-4 w-4 text-zinc-455" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-none border border-border-subtle bg-white py-3 pl-11 pr-4 text-xs font-sans text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-ink-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-650"
                  id="input-register-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-monoenterprise uppercase tracking-[0.2em] text-zinc-450 dark:text-zinc-550 mb-1.5 ml-0.5">
                Corporate Phone Number
              </label>
              <div className="flex gap-2">
                <select
                  value={phoneCountryCode}
                  onChange={(e) => setPhoneCountryCode(e.target.value)}
                  className="rounded-none border border-border-subtle bg-white px-3 py-3 text-xs font-monoenterprise text-zinc-900 outline-none focus:border-ink-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white cursor-pointer"
                  id="select-register-country-code"
                >
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+65">🇸🇬 +65</option>
                  <option value="+81">🇯🇵 +81</option>
                </select>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="9876543210"
                  className="w-full rounded-none border border-border-subtle bg-white py-3 px-4 text-xs font-monoenterprise text-zinc-900 placeholder-zinc-450 outline-none focus:border-ink-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-650"
                  id="input-register-phone"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-monoenterprise uppercase tracking-[0.2em] text-zinc-450 dark:text-zinc-550 mb-1.5 ml-0.5">
                Node Secure Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 h-4 w-4 text-zinc-450" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-none border border-border-subtle bg-white py-3 pl-11 pr-4 text-xs font-sans text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-ink-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-650"
                  id="input-register-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-none bg-ink-black hover:bg-zinc-850 py-4 text-xs font-monoenterprise uppercase tracking-widest text-white transition-all disabled:opacity-50 mt-6 active:scale-[0.99] dark:bg-white dark:hover:bg-zinc-200 dark:text-ink-black"
              id="btn-register-submit"
            >
              {loading ? (
                <div className="h-4 w-4 border border-white border-t-transparent dark:border-ink-black animate-spin"></div>
              ) : (
                <>
                  <span>Initialize Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-[9px] font-monoenterprise uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            <ShieldCheck className="h-4 w-4 text-secondary" />
            <span>Vetted Supply-Chain Node</span>
          </div>

          <div className="mt-6 text-center text-xs font-sans border-t border-border-subtle dark:border-zinc-800 pt-4">
            <span className="text-zinc-400">Already joined? </span>
            <Link href="/auth/login" className="text-secondary dark:text-emerald-400 hover:underline font-semibold transition-colors" id="link-login">
              Access Workspace
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
