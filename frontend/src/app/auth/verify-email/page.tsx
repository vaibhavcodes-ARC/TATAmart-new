'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, RefreshCw, Loader2, ShieldAlert } from 'lucide-react';
import dynamic from 'next/dynamic';
const Antigravity = dynamic(() => import('../../../components/animations/Antigravity'), { ssr: false });
import { useAuthStore } from '../../../store/useAuthStore';
import { api, getApiErrorMessage } from '../../../utils/api';

export default function VerifyEmail() {
  const router = useRouter();
  const { user, updateUser, isAuthenticated } = useAuthStore();

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);

  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Secure auth check - redirect to login if unauthenticated
  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthenticated && !localStorage.getItem('tatamart_token')) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  // Handle countdown resend timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Focus first input box on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Handle value change for OTP inputs
  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^0-9]/g, '');
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input box
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);

      // Auto-focus previous input box
      if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  // Submit OTP code for verification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits of your verification code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/email/verify', { code });
      
      // Update local auth store state to include email_verified_at
      updateUser({
        ...user,
        email_verified_at: new Date().toISOString()
      });

      setSuccess(true);
      
      // Route buyer/seller to their dashboards
      setTimeout(() => {
        const route = user?.role === 'SELLER' ? '/dashboard/seller' : '/dashboard/buyer';
        router.push(route);
      }, 2000);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Verification failed. Incorrect or expired OTP.'));
    } finally {
      setLoading(false);
    }
  };

  // Resend code request
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setResending(true);
    setError('');
    try {
      await api.post('/auth/email/resend');
      setResendTimer(60);
      alert('A fresh 6-digit OTP code has been dispatched to your email.');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to resend code. Please try again later.'));
    } finally {
      setResending(false);
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

        <div className="border border-border-subtle bg-white dark:bg-[#151515] dark:border-zinc-800 p-8 sm:p-10 rounded-none shadow-sm">
          {!success ? (
            <>
              <div className="text-center mb-8">
                <div className="h-12 w-12 border border-secondary text-secondary rounded-none flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <h2 className="font-heading text-3xl font-light tracking-tight text-ink-black dark:text-white mb-2">
                  Verify <span className="italic">Node.</span>
                </h2>
                <p className="text-xs font-sans text-zinc-400 dark:text-zinc-550 leading-relaxed">
                  We emailed a 6-digit verification code to <strong className="text-ink-black dark:text-zinc-350">{user?.email || 'your registered corporate email'}</strong>.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="border border-red-205 bg-red-50/50 p-4 text-xs font-monoenterprise text-red-650 dark:border-red-950/20 dark:text-red-400">
                    {error}
                  </div>
                )}

                <div className="flex justify-between gap-3">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      ref={(el) => { inputRefs.current[index] = el as HTMLInputElement; }}
                      value={data}
                      onChange={(e) => handleChange(e.target, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-12 h-14 text-center text-lg font-monoenterprise border border-border-subtle bg-white outline-none transition-colors focus:border-ink-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-none bg-ink-black hover:bg-zinc-855 py-4 text-xs font-monoenterprise uppercase tracking-widest text-white transition-all disabled:opacity-50 mt-6 active:scale-[0.99] dark:bg-white dark:hover:bg-zinc-200 dark:text-ink-black"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Verification Code</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center border-t border-border-subtle dark:border-zinc-800 pt-6">
                <button
                  onClick={handleResend}
                  disabled={resendTimer > 0 || resending}
                  className="inline-flex items-center gap-2 text-xs font-monoenterprise uppercase tracking-widest text-secondary hover:underline disabled:opacity-40 disabled:pointer-events-none"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${resending ? 'animate-spin' : ''}`} />
                  <span>
                    {resendTimer > 0
                      ? `Resend in ${resendTimer}s`
                      : 'Resend OTP Code'}
                  </span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="h-12 w-12 border border-secondary text-secondary rounded-none flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="h-6 w-6 animate-pulse" />
              </div>
              <h3 className="font-heading text-3xl font-light text-ink-black dark:text-white mb-3">Verification Successful</h3>
              <p className="text-xs font-sans text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                Your enterprise profile has been fully validated.<br />Redirecting to your TATAmart Workspace...
              </p>
              <div className="inline-flex h-1 w-24 overflow-hidden bg-zinc-100 dark:bg-zinc-850 mx-auto rounded-none">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.8, ease: 'easeInOut' }}
                  className="h-full bg-secondary rounded-none"
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
