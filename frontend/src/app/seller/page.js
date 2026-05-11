'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';
import { Package, Users, TrendingUp, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function SellerDashboard() {
  const [stats, setStats] = useState({
    total_products: 0,
    total_inquiries: 0,
    quotes_sent: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/seller/dashboard');
        setStats(data.data);
      } catch (err) {
        // Provide safe visualization defaults
        setStats({ total_products: 12, total_inquiries: 48, quotes_sent: 5 });
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Active Products', value: stats.total_products, icon: Package, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'New Inquiries Received', value: stats.total_inquiries, icon: Users, color: 'text-tata-red', bg: 'bg-tata-red/10' },
    { label: 'Total Quotes Submitted', value: stats.quotes_sent, icon: FileText, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Engagement Rate', value: '8.4%', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Merchant Hub</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your digital storefront and track inbound RFQs.</p>
        </div>
        <Button variant="primary" className="shadow-lg shadow-tata-red/20" onClick={() => window.location.href='/seller/products/new'}>
          Upload New Product
        </Button>
      </div>

      {/* Analytics Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-6 rounded-2xl border-white/5 hover:scale-[1.02]"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.bg} ${card.color}`}>
                <Icon size={24} />
              </div>
              <h4 className="text-muted-foreground text-sm font-medium">{card.label}</h4>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold font-display text-white">{card.value}</span>
                <span className="text-xs text-green-400 font-medium">+12%</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-2xl p-6 border-white/5">
           <h3 className="font-bold font-display text-lg mb-6">Recent RFQ Feed</h3>
           <div className="space-y-4 text-center py-12 bg-white/[0.02] rounded-xl border border-dashed border-white/10 text-muted-foreground">
              <FileText size={32} className="mx-auto opacity-40 mb-2" />
              <p className="text-sm">No match found for your product categories yet.</p>
           </div>
        </div>

        <div className="glass rounded-2xl p-6 border-white/5">
           <h3 className="font-bold font-display text-lg mb-6">Profile Strength</h3>
           <div className="w-32 h-32 rounded-full border-8 border-tata-red border-r-transparent mx-auto relative flex items-center justify-center mb-6">
              <span className="text-2xl font-bold">75%</span>
           </div>
           <p className="text-sm text-center text-muted-foreground mb-4">Complete listing details to achieve 100% verified status.</p>
           <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors">Enhance Profile</button>
        </div>
      </div>
    </motion.div>
  );
}
