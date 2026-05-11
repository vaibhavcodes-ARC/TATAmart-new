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
import { ShoppingBag, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [role, setRole] = useState('buyer');
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = { ...data, role };
      const user = await registerUser(payload);
      toast.success("Account registered successfully!");
      
      if (user.role === 'seller') router.push('/seller');
      else router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-background bg-grid-pattern relative py-24">
        <div className="absolute top-10 right-10 w-72 h-72 bg-tata-red/10 rounded-full blur-[80px]"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl px-6 md:px-8 py-8 glass rounded-2xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-display text-white mb-2">Join TataMart</h1>
            <p className="text-muted-foreground">Select your account type below</p>
          </div>

          {/* Custom Role Selection Tabs */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button 
              type="button"
              onClick={() => setRole('buyer')}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300",
                role === 'buyer' ? "border-tata-red bg-tata-red/5 ring-1 ring-tata-red" : "border-white/10 bg-white/5 opacity-60 hover:opacity-100"
              )}
            >
              <ShoppingBag size={28} className={role === 'buyer' ? "text-tata-red" : "text-white"} />
              <span className="font-medium">I'm a Buyer</span>
            </button>
            <button 
              type="button"
              onClick={() => setRole('seller')}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300",
                role === 'seller' ? "border-tata-red bg-tata-red/5 ring-1 ring-tata-red" : "border-white/10 bg-white/5 opacity-60 hover:opacity-100"
              )}
            >
              <Truck size={28} className={role === 'seller' ? "text-tata-red" : "text-white"} />
              <span className="font-medium">I'm a Seller</span>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-tata-red"
                  placeholder="Ratan Tata"
                  {...register("name", { required: "Required" })}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                <input
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-tata-red"
                  placeholder="Tata Sons Pvt Ltd"
                  {...register("company_name", { required: "Required" })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Business Email</label>
              <input
                type="email"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-tata-red"
                placeholder="business@tata.com"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-tata-red"
                placeholder="Minimum 6 characters"
                {...register("password", { required: "Required", minLength: { value: 6, message: "Min 6 chars" } })}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full py-3.5 mt-4"
              disabled={submitting}
            >
              {submitting ? "Creating Account..." : `Create ${role === 'seller' ? 'Seller' : 'Buyer'} Account`}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-white font-medium hover:text-tata-red underline">
              Login here
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
