'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../utils/api';
import { useTheme } from 'next-themes';
import PillNav, { PillNavItem } from './animations/PillNav';
import { Sun, Moon } from 'lucide-react';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = React.useCallback(async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    try {
      await api.post('/auth/logout');
    } catch {
      // local flow handles failures silently
    } finally {
      logout();
    }
  }, [logout]);

  const navItems = React.useMemo<PillNavItem[]>(() => {
    const items: PillNavItem[] = [
      { label: 'Home', href: '/' },
      { label: 'Categories', href: '/categories' },
      { label: 'Products', href: '/products' },
    ];

    if (mounted && isAuthenticated && user) {
      if (user.role === 'SELLER') items.push({ label: 'Seller Portal', href: '/dashboard/seller' });
      else if (user.role === 'ADMIN') items.push({ label: 'Admin Space', href: '/dashboard/admin' });
      else {
        items.push({ label: 'Buyer Dashboard', href: '/dashboard/buyer' });
        items.push({ label: 'Cart', href: '/cart' });
      }
      items.push({ label: 'Sign Out', href: '#logout', onClick: handleLogout });
    } else if (mounted) {
      items.push({ label: 'Login', href: '/auth/login' });
      items.push({ label: 'Register Free', href: '/auth/register' });
    }
    return items;
  }, [mounted, isAuthenticated, user, handleLogout]);

  const isDark = mounted && (resolvedTheme === 'dark');
  const baseColor = isDark ? '#09090b' : '#fafafc';
  const pillColor = isDark ? '#27272a' : '#ffffff';
  const hoveredPillTextColor = isDark ? '#09090b' : '#ffffff';
  const pillTextColor = isDark ? '#ffffff' : '#09090b';
  const hoverBgColor = isDark ? '#ffffff' : '#09090b';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 pt-6 pb-2 ${
        scrolled ? 'backdrop-blur-md bg-white/30 dark:bg-zinc-950/30 shadow-sm' : 'bg-transparent'
      }`}
      style={{ pointerEvents: 'none' }} // Let clicks pass through background
    >
      <div 
        className="mx-auto flex max-w-[95%] xl:max-w-7xl items-center justify-center relative" 
        style={{ pointerEvents: 'auto' }}
      >
        <PillNav
          logo="/favicon.ico"
          logoAlt="TATAmart Enterprise"
          items={navItems}
          baseColor={baseColor}
          pillColor={pillColor}
          hoveredPillTextColor={hoveredPillTextColor}
          pillTextColor={pillTextColor}
          hoverBgColor={hoverBgColor}
        />
        
        {/* Theme Toggle - Positioned completely right on desktop */}
        <div className="absolute right-0 hidden md:flex items-center">
          <button
            onClick={() => mounted && setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition-all duration-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            aria-label="Toggle theme"
          >
            <div className="relative h-4 w-4 flex items-center justify-center">
              <Sun className={`absolute transition-all duration-500 ease-out ${mounted && resolvedTheme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'scale-50 -rotate-90 opacity-0'}`} />
              <Moon className={`absolute transition-all duration-500 ease-out ${!mounted || resolvedTheme !== 'dark' ? 'scale-100 rotate-0 opacity-100' : 'scale-50 rotate-90 opacity-0'}`} />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
