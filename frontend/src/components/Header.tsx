'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../utils/api';
import { useTheme } from 'next-themes';
import { Sun, Moon, Menu, X, ShoppingCart, LogOut } from 'lucide-react';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = React.useCallback(async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    try {
      await api.post('/auth/logout');
    } catch {
      // local flow handles failures silently
    } finally {
      logout();
      setIsMobileMenuOpen(false);
    }
  }, [logout]);

  const navLinks = React.useMemo(() => {
    const items = [
      { label: 'Marketplace', href: '/products' },
      { label: 'Categories', href: '/categories' },
      { label: 'About Us', href: '/about' },
    ];

    if (mounted && isAuthenticated && user) {
      if (user.role === 'SELLER') {
        items.push({ label: 'Seller Portal', href: '/dashboard/seller' });
      } else if (user.role === 'ADMIN') {
        items.push({ label: 'Admin Space', href: '/dashboard/admin' });
      } else {
        items.push({ label: 'Dashboard', href: '/dashboard/buyer' });
      }
    }
    return items;
  }, [mounted, isAuthenticated, user]);

  const isDark = mounted && (resolvedTheme === 'dark');

  return (
    <header className="sticky top-0 w-full z-50 bg-[#F9F9F9]/80 dark:bg-[#111111]/80 backdrop-blur-md border-b border-[#E5E5E5] dark:border-zinc-800 transition-colors duration-300">
      <div className="flex justify-between items-center px-6 md:px-16 h-20 max-w-7xl mx-auto">
        {/* Brand Name / Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-heading text-3xl tracking-tighter text-ink-black dark:text-white">
            Tata<span className="italic font-normal">Mart</span>
          </span>
          <span className="font-monoenterprise text-[9px] font-bold tracking-widest text-[#346941] uppercase px-1.5 py-0.5 border border-[#346941]/30 rounded-xs mt-0.5">
            B2B
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-monoenterprise text-xs uppercase tracking-widest transition-colors ${
                  isActive
                    ? 'text-[#043F1C] dark:text-[#346941] font-bold'
                    : 'text-zinc-650 dark:text-zinc-400 hover:text-ink-black dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User Actions & Toggle */}
        <div className="hidden md:flex items-center gap-6">
          {/* Cart Icon (only for Buyers / guests) */}
          {(!user || user.role === 'BUYER') && (
            <Link
              href="/cart"
              className="relative p-2 text-zinc-650 dark:text-zinc-400 hover:text-ink-black dark:hover:text-white transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5 stroke-[1.5]" />
            </Link>
          )}

          {/* Authentication States */}
          {mounted && isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="font-monoenterprise text-xs text-zinc-500 max-w-30 truncate">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 border border-[#E5E5E5] dark:border-zinc-800 px-4 py-2 font-monoenterprise text-[10px] uppercase tracking-widest hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all rounded-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            mounted && (
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/login"
                  className="font-monoenterprise text-xs uppercase tracking-widest text-zinc-650 dark:text-zinc-400 hover:text-ink-black dark:hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-ink-black dark:bg-white text-white dark:text-ink-black px-5 py-2 font-monoenterprise text-[10px] uppercase tracking-widest hover:bg-opacity-95 dark:hover:bg-opacity-95 transition-all rounded-sm"
                >
                  Register
                </Link>
              </div>
            )
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => mounted && setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-[#E5E5E5] dark:border-zinc-800 bg-transparent text-zinc-700 dark:text-zinc-300 transition-all duration-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Menu Actions */}
        <div className="flex md:hidden items-center gap-4">
          {(!user || user.role === 'BUYER') && (
            <Link
              href="/cart"
              className="p-2 text-zinc-650 dark:text-zinc-400"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>
          )}

          <button
            onClick={() => mounted && setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#E5E5E5] dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-zinc-700 dark:text-zinc-300"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Popover */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E5E5] dark:border-zinc-800 bg-[#F9F9F9] dark:bg-[#111111] px-6 py-8 space-y-6">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-monoenterprise text-xs uppercase tracking-widest py-2 transition-colors ${
                    isActive ? 'text-[#043F1C] dark:text-[#346941]' : 'text-zinc-650 dark:text-zinc-400'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[#E5E5E5] dark:border-zinc-800 pt-6 flex flex-col gap-4">
            {mounted && isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <span className="font-monoenterprise text-xs text-zinc-550 dark:text-zinc-400">
                  Logged in as: {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="w-full text-center border border-[#E5E5E5] dark:border-zinc-800 py-3 font-monoenterprise text-[10px] uppercase tracking-widest hover:bg-zinc-150 dark:hover:bg-zinc-900 transition-all rounded-[4px] text-ink-black dark:text-white"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center border border-[#E5E5E5] dark:border-zinc-800 py-3 font-monoenterprise text-[10px] uppercase tracking-widest hover:bg-zinc-150 dark:hover:bg-zinc-900 transition-all rounded-sm text-ink-black dark:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center bg-ink-black dark:bg-white text-white dark:text-ink-black py-3 font-monoenterprise text-[10px] uppercase tracking-widest hover:bg-opacity-90 transition-all rounded-sm"
                >
                  Register Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
