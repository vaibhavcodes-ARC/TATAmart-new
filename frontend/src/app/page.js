'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { ArrowRight, ShieldCheck, Globe, Zap, ChevronRight } from 'lucide-react';
import api from '@/services/api';
import Link from 'next/link';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Prefetch data concurrently
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products?limit=4'),
          api.get('/categories/featured')
        ]);
        setFeatured(prodRes.data.data.data?.slice(0, 4) || []);
        setCategories(catRes.data.data || []);
      } catch (e) {
        console.log("Data prefetch skipped.");
      }
    };
    fetchData();
  }, []);

  return (
    <main className="flex-1 overflow-hidden">
      <Navbar />

      {/* === HERO SECTION === */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 px-4 overflow-hidden bg-background">
        {/* Back Lights */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-tata-red/20 rounded-full blur-[120px] pointer-events-none animate-pulse duration-10000"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-tata-blue/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-tata-red mb-6">
              <Zap size={12} /> <span>NEXT GENERATION B2B NETWORK</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight mb-6">
              Powering the <br />
              <span className="bg-gradient-to-r from-white via-white to-tata-red bg-clip-text text-transparent text-glow">Future of Trade</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Discover, source, and manage industrial manufacturing chains through TataMart's automated enterprise ecosystem.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="group gap-2" onClick={() => window.location.href='/products'}>
                Explore Products <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
              <Button size="lg" variant="secondary" onClick={() => window.location.href='/register'}>
                Become a Seller
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              <div>
                <h4 className="text-2xl font-bold font-display">500K+</h4>
                <p className="text-sm text-muted-foreground">Global Buyers</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold font-display">10K+</h4>
                <p className="text-sm text-muted-foreground">Verified Sellers</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold font-display">$2B+</h4>
                <p className="text-sm text-muted-foreground">Annual Gross</p>
              </div>
            </div>
          </motion.div>

          {/* Decorative Hero Image/Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
             <div className="relative w-full aspect-square max-w-lg mx-auto rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop" 
                  alt="Industrial Future" 
                  className="object-cover w-full h-full opacity-60 grayscale hover:grayscale-0 transition-all duration-700 scale-110"
                />
                {/* Floating Card UI snippet */}
                <div className="absolute bottom-8 -left-8 glass p-4 rounded-xl border border-white/10 animate-bounce duration-[3000ms]">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500/20 p-2 rounded-lg text-green-400"><ShieldCheck /></div>
                    <div>
                      <p className="text-xs text-gray-400">Buyer Verified</p>
                      <p className="text-sm font-bold">Transaction Secured</p>
                    </div>
                  </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* === POPULAR CATEGORIES === */}
      <section className="py-24 bg-[#0d0d0d] border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-2">Browse Departments</h2>
              <p className="text-muted-foreground">Source directly from top certified manufacturers</p>
            </div>
            <Link href="/categories" className="hidden sm:flex items-center gap-1 text-tata-red font-medium hover:underline">
              View All <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
             {(categories.length > 0 ? categories : [1,2,3,4,5,6]).map((cat, idx) => (
               <motion.div
                 key={idx}
                 whileHover={{ y: -5 }}
                 className="glass-card rounded-xl p-6 text-center cursor-pointer group flex flex-col items-center gap-4"
               >
                 <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-tata-red/10 transition-colors text-tata-red">
                   <Globe size={24} />
                 </div>
                 <h4 className="font-medium text-sm">{typeof cat === 'object' ? cat.name : `Category ${cat}`}</h4>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* === CTA SECTION === */}
      <section className="py-32 relative overflow-hidden bg-background">
        <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
           >
             <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">Ready to Scale Production?</h2>
             <p className="text-xl text-muted-foreground mb-10">Join thousands of enterprise vendors and dynamic procurement teams instantly on TataMart.</p>
             <Button variant="primary" size="lg" className="px-12" onClick={() => window.location.href='/register'}>
               Get Started Now
             </Button>
           </motion.div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-tata-red/10 via-transparent to-transparent opacity-30"></div>
      </section>
    </main>
  );
}
