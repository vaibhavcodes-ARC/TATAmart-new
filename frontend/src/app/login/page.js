'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Navbar from '@/components/layout/Navbar';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const user = await login(data.email, data.password);
      toast.success("Welcome back to TataMart!");
      
      // Route based on privilege
      if (user.role === 'seller') router.push('/seller');
      else router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-background bg-grid-pattern relative pt-20 overflow-hidden">
        {/* Visual decorative ambient orb */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-tata-red/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-tata-blue/10 rounded-full blur-[120px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md px-6 py-8 glass rounded-2xl relative z-10"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-display text-white mb-2">Sign In</h1>
            <p className="text-muted-foreground">Access your TataMart dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-tata-red focus:ring-1 focus:ring-tata-red transition-all"
                placeholder="admin@tatamart.com"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <Link href="/forgot-password" className="text-xs text-tata-red hover:underline">Forgot?</Link>
              </div>
              <input
                type="password"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-tata-red focus:ring-1 focus:ring-tata-red transition-all"
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full py-3"
              disabled={submitting}
            >
              {submitting ? "Authenticating..." : "Sign In Now"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="text-white font-medium hover:text-tata-red transition-colors">
              Create Account
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
