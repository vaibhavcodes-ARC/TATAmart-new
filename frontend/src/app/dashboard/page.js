'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';
import { ClipboardList, History, Heart, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function BuyerDashboard() {
  const [stats, setStats] = useState({ total_rfqs: 0, inquiries_sent: 0 });

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/buyer/dashboard');
        setStats(data.data);
      } catch (e) {
        setStats({ total_rfqs: 3, inquiries_sent: 8 });
      }
    };
    fetch();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">Buyer Workspace</h1>
          <p className="text-muted-foreground mt-1">Manage quotes and procurement inquiries</p>
        </div>
        <Button className="gap-2" onClick={() => window.location.href='/dashboard/rfqs/new'}>
          <Plus size={18} /> Post New RFQ
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass p-6 rounded-2xl border-white/5 flex items-center gap-4">
           <div className="bg-tata-red/10 text-tata-red p-3 rounded-xl"><ClipboardList size={24}/></div>
           <div>
              <p className="text-xs text-muted-foreground font-medium uppercase">Total RFQs</p>
              <h3 className="text-2xl font-bold font-display mt-0.5">{stats.total_rfqs}</h3>
           </div>
        </div>
        <div className="glass p-6 rounded-2xl border-white/5 flex items-center gap-4">
           <div className="bg-blue-500/10 text-blue-400 p-3 rounded-xl"><History size={24}/></div>
           <div>
              <p className="text-xs text-muted-foreground font-medium uppercase">Active Inquiries</p>
              <h3 className="text-2xl font-bold font-display mt-0.5">{stats.inquiries_sent}</h3>
           </div>
        </div>
        <div className="glass p-6 rounded-2xl border-white/5 flex items-center gap-4">
           <div className="bg-purple-500/10 text-purple-400 p-3 rounded-xl"><Heart size={24}/></div>
           <div>
              <p className="text-xs text-muted-foreground font-medium uppercase">Wishlist Size</p>
              <h3 className="text-2xl font-bold font-display mt-0.5">14 Items</h3>
           </div>
        </div>
      </div>

      <div className="border border-white/5 glass rounded-2xl p-6">
        <h3 className="font-bold font-display text-lg mb-6 border-b border-white/5 pb-4">Recent Quote Activity</h3>
        <div className="space-y-4 text-center py-16">
           <div className="w-16 h-16 bg-white/5 rounded-full mx-auto flex items-center justify-center text-muted-foreground opacity-30 mb-4"><ClipboardList size={28}/></div>
           <h4 className="text-lg text-gray-300 font-medium">No active quotations.</h4>
           <p className="text-sm text-muted-foreground mb-4">Create your first Request for Quote and sellers will compete for your order.</p>
        </div>
      </div>
    </motion.div>
  );
}
