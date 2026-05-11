'use client';

import { useState, useEffect, use } from 'react';
import Navbar from '@/components/layout/Navbar';
import api from '@/services/api';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { ShieldCheck, Truck, Clock, UserCheck, Phone, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ProductDetail({ params }) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data.data);
      } catch (err) {
        // Mock fallback for visual testing
        setProduct({
          name: "Precision Industrial CNC Lathe Machine MK-III",
          short_description: "Industrial-grade CNC turning center optimized for heavy duty automotive part manufacturing with auto-cooling technology.",
          long_description: "This next-generation CNC machine features rigid flat-bed structure, precision ball screws, robust servo drive and 8-station tool turret. Suitable for processing medium size shaft, disk and complex components.",
          price_min: 250000,
          price_max: 320000,
          min_order_quantity: 1,
          unit: "Unit",
          category: { name: "Industrial Machinery" },
          seller: { 
            name: "Tata Advanced Systems Ltd",
            seller_profile: { company_name: "Tata Advanced Systems Ltd", is_verified: true, city: "Bangalore" } 
          }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [slug]);

  const handleContact = () => {
    toast.info("Routing to Inquiry manager...", { autoClose: 2000 });
  };

  if (loading) return <div className="min-h-screen bg-background animate-pulse flex items-center justify-center"><span className="text-xl font-display tracking-widest text-muted-foreground">LOADING ASSETS</span></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Visual Gallery Left Column */}
          <div className="lg:col-span-7 space-y-6">
             <motion.div 
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               className="aspect-[4/3] w-full glass rounded-3xl border border-white/5 overflow-hidden bg-black flex items-center justify-center relative"
             >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                {product.images?.length > 0 ? (
                   <img src={product.images[0].image_path} alt={product.name} className="object-cover w-full h-full" />
                ) : (
                   <div className="text-center p-12">
                     <div className="w-24 h-24 bg-white/5 rounded-full mx-auto mb-6 flex items-center justify-center text-tata-red">
                       <Truck size={40} />
                     </div>
                     <span className="text-muted-foreground text-sm uppercase tracking-widest">Proprietary Model Visualization Unavailable</span>
                   </div>
                )}
             </motion.div>
             
             <div className="glass p-6 rounded-2xl border border-white/5">
                <h3 className="text-xl font-bold font-display mb-4 border-b border-white/10 pb-3">Technical Specifications</h3>
                <p className="text-muted-foreground leading-relaxed">{product.long_description || product.short_description}</p>
             </div>
          </div>

          {/* Ordering and Details Right Column */}
          <div className="lg:col-span-5">
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="sticky top-28 space-y-6"
             >
                <div className="glass-card p-8 rounded-3xl border-white/10">
                  <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-tata-red uppercase mb-3">
                    <span>{product.category?.name}</span>
                  </div>
                  
                  <h1 className="text-3xl font-bold font-display leading-tight mb-4">{product.name}</h1>
                  
                  <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/5">
                     <p className="text-xs text-muted-foreground uppercase font-medium">Bulk Quotation Range</p>
                     <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-bold font-display text-white">₹{Number(product.price_min).toLocaleString()}</span>
                        <span className="text-lg text-gray-500">-</span>
                        <span className="text-3xl font-bold font-display text-white">₹{Number(product.price_max).toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground ml-2">/ {product.unit || 'pc'}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-8 border-y border-white/5 py-4">
                     <div className="flex items-center gap-2"><Clock size={16} className="text-tata-red"/> Est. Lead: 14 Days</div>
                     <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-tata-red"/> Trade Assurance</div>
                     <div className="flex items-center gap-2"><UserCheck size={16} className="text-tata-red"/> Verified Seller</div>
                     <div className="flex items-center gap-2"><Truck size={16} className="text-tata-red"/> Global Shipping</div>
                  </div>

                  <div className="flex flex-col gap-4">
                     <Button size="lg" className="w-full gap-2 py-4 text-lg" onClick={handleContact}>
                       <MessageSquare size={20} /> Contact Supplier
                     </Button>
                     <Button variant="secondary" className="w-full gap-2 py-4" onClick={handleContact}>
                       Get Best Quote
                     </Button>
                  </div>
                </div>

                {/* Seller Miniature Profile */}
                <div className="glass p-6 rounded-2xl border border-white/5 flex items-start gap-4">
                   <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-xl font-bold">
                      {product.seller?.name?.charAt(0)}
                   </div>
                   <div className="flex-1">
                      <h4 className="font-bold font-display text-white">{product.seller?.seller_profile?.company_name || product.seller?.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{product.seller?.seller_profile?.city || 'Industrial Hub'}, India</p>
                      <div className="flex gap-2 mt-3">
                         <button className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1 rounded transition-colors border border-white/5">View Store</button>
                         <button className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1 rounded transition-colors border border-white/5">Contact</button>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>

        </div>

      </div>
    </div>
  );
}
