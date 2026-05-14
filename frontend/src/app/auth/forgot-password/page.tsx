'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import Antigravity from '../../../components/animations/Antigravity';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#fafafc] dark:bg-[#09090b] px-6 py-12">
      <div className="absolute inset-0 z-0 opacity-60 mix-blend-screen pointer-events-none">
        <Antigravity count={250} color="#8b5cf6" particleShape="sphere" autoAnimate />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
        className="w-full max-w-md relative z-10"
      >
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

        <div className="rounded-[40px] border border-zinc-200/60 bg-white/80 p-8 sm:p-10 shadow-2xl shadow-indigo-600/[0.03] backdrop-blur-2xl dark:border-zinc-800/80 dark:bg-zinc-900/80">
          {!submitted ? (
            <>
              <div className="text-center mb-8">
                <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-white mb-2">
                  Reset Password.
                </h2>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Enter your corporate email to receive instructions.
                </p>
              </div>

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
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary hover:bg-indigo-600 py-4 text-[15px] font-black text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:shadow-indigo-600/30 mt-8 active:scale-[0.99]"
                >
                  <span>Send Reset Link</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="font-hero text-2xl font-black text-zinc-900 dark:text-white mb-3">Check Your Inbox</h3>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
                We sent a secure recovery link to <strong>{email}</strong>. It will expire in 15 minutes.
              </p>
              <Link href="/auth/login" className="text-brand-primary font-bold hover:text-indigo-600">
                Return to Login
              </Link>
            </div>
          )}

          <div className="mt-8 text-center text-sm font-semibold text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-6">
            <span>Remembered your password? </span>
            <Link href="/auth/login" className="text-brand-primary hover:text-indigo-600 font-black transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
