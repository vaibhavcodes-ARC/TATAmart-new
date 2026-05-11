'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function ProductListing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (query = "") => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products?search=${query}`);
      setProducts(data.data.data || []);
    } catch (err) {
      console.error(err);
      // Set mockup fallback for demo
      setProducts([
        { id: 1, name: "Industrial Grade Steel Coil", slug: "steel-coil", price_min: 1500, price_max: 2000, category: {name: "Construction"}, seller: {name: "JSW Ltd"}, primary_image: {image_path: "https://via.placeholder.com/300"} },
        { id: 2, name: "Solar Power Inverter 50kW", slug: "solar-inv", price_min: 50000, price_max: 75000, category: {name: "Electronics"}, seller: {name: "Tata Power"}, primary_image: null },
        { id: 3, name: "CNC Lathe Heavy Duty", slug: "cnc-lathe", price_min: 120000, price_max: 150000, category: {name: "Machinery"}, seller: {name: "MachineTools Corp"}, primary_image: null },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(searchTerm);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filters Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold font-display text-white">Global Marketplace</h1>
            <p className="text-muted-foreground text-sm mt-1">Browse high-quality industrial goods & wholesale supplies</p>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-tata-red transition-colors"
              />
            </div>
            <Button type="submit" variant="secondary" size="sm" className="h-[42px]">
              Search
            </Button>
          </form>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar Filters mock */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="glass p-5 rounded-xl sticky top-28 border border-white/5">
              <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3">
                <SlidersHorizontal size={18} />
                <h3 className="font-semibold font-display">Filter Results</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-3 text-gray-300">Condition</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"><input type="checkbox" className="accent-tata-red" /> New Items</label>
                    <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"><input type="checkbox" className="accent-tata-red" /> Refurbished</label>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3 text-gray-300">Supplier Status</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"><input type="checkbox" className="accent-tata-red" /> Verified Only</label>
                    <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"><input type="checkbox" className="accent-tata-red" /> In-Stock</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-80 bg-white/5 rounded-2xl animate-pulse border border-white/5"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 glass rounded-xl border border-white/5">
                <h3 className="text-xl font-medium mb-2">No products found.</h3>
                <p className="text-muted-foreground mb-6">Try refining your search keywords.</p>
                <Button onClick={() => fetchProducts("")} variant="outline">Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {products.map((prod) => (
                    <motion.div
                      layout
                      key={prod.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -4 }}
                      className="glass-card rounded-2xl overflow-hidden group cursor-pointer flex flex-col"
                    >
                      <Link href={`/products/${prod.slug}`} className="flex-1 flex flex-col">
                        <div className="aspect-[4/3] w-full bg-black/40 relative overflow-hidden flex items-center justify-center text-muted-foreground border-b border-white/5">
                          {prod.primary_image ? (
                             <img src={prod.primary_image.image_path} alt={prod.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                             <span className="text-xs opacity-40 uppercase font-semibold">NO IMAGE</span>
                          )}
                          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur px-2 py-1 rounded text-[10px] border border-white/10 text-tata-red font-bold uppercase tracking-wide">
                             {prod.category?.name || 'UNCATEGORIZED'}
                          </div>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-bold text-lg line-clamp-1 text-white group-hover:text-tata-red transition-colors mb-1">{prod.name}</h3>
                          <p className="text-xs text-muted-foreground mb-4">By {prod.seller?.name || prod.seller?.seller_profile?.company_name || "Verified Seller"}</p>
                          
                          <div className="mt-auto flex items-end justify-between pt-4 border-t border-white/5">
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase">Target Price</p>
                              <p className="font-display font-bold text-lg text-white">
                                ₹{prod.price_min?.toLocaleString()} - ₹{prod.price_max?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
