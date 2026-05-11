'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { Menu, X, Search, ShoppingBag, User, Bell } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/60 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-tata-red rounded-lg flex items-center justify-center font-bold text-xl group-hover:shadow-glow transition-all">T</div>
            <span className="text-xl font-display font-bold tracking-tight">
              Tata<span className="text-tata-red">Mart</span>
            </span>
          </Link>

          {/* Desktop Center Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-sm text-muted-foreground hover:text-white transition-colors">Products</Link>
            <Link href="/categories" className="text-sm text-muted-foreground hover:text-white transition-colors">Categories</Link>
            <Link href="/suppliers" className="text-sm text-muted-foreground hover:text-white transition-colors">Suppliers</Link>
          </div>

          {/* Desktop Action Icons/Buttons */}
          <div className="hidden md:flex items-center gap-5">
            <button className="text-muted-foreground hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors">
              <Search size={20} />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href={user.role === 'seller' ? '/seller' : '/dashboard'} className="flex items-center gap-2 text-sm font-medium hover:text-tata-red transition-colors">
                  <User size={18} />
                  <span>Dashboard</span>
                </Link>
                <Button onClick={logout} variant="ghost" size="sm">Logout</Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium hover:text-white transition-colors">Sign In</Link>
                <Button variant="primary" size="sm" onClick={() => window.location.href='/register'}>Join Free</Button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-lg border-b border-white/10 px-6 py-6 flex flex-col gap-5"
        >
          <Link href="/products" className="text-lg font-medium">Products</Link>
          <Link href="/categories" className="text-lg font-medium">Categories</Link>
          <Link href="/suppliers" className="text-lg font-medium">Suppliers</Link>
          <hr className="border-white/10" />
          {!isAuthenticated ? (
             <div className="flex flex-col gap-3">
               <Button variant="outline" onClick={() => window.location.href='/login'}>Sign In</Button>
               <Button onClick={() => window.location.href='/register'}>Register Now</Button>
             </div>
          ) : (
             <Button onClick={logout} variant="outline">Logout</Button>
          )}
        </motion.div>
      )}
    </nav>
  );
}
