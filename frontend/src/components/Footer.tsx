'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F0EBE5]/30 dark:bg-[#161514]/30 border-t border-[#E5E5E5] dark:border-zinc-800 py-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 pb-16">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-heading text-4xl tracking-tighter text-ink-black dark:text-white">
                Tata<span className="italic font-normal">Mart</span>
              </span>
            </Link>
            <p className="font-sans text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xs">
              Building the bridge between global industrial manufacturing and enterprise-grade scale with a premium, editorial eye for quality and vetting.
            </p>
          </div>

          {/* Platform Links */}
          <div className="md:col-span-2 space-y-6">
            <h5 className="font-monoenterprise text-xs uppercase tracking-widest text-ink-black dark:text-white font-bold">
              Platform
            </h5>
            <ul className="space-y-4 font-sans text-sm text-zinc-650 dark:text-zinc-400">
              <li>
                <Link href="/products" className="hover:text-ink-black dark:hover:text-white transition-colors">
                  Global Inventory
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-ink-black dark:hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/dashboard/buyer" className="hover:text-ink-black dark:hover:text-white transition-colors">
                  RFQ Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="md:col-span-2 space-y-6">
            <h5 className="font-monoenterprise text-xs uppercase tracking-widest text-ink-black dark:text-white font-bold">
              Company
            </h5>
            <ul className="space-y-4 font-sans text-sm text-zinc-650 dark:text-zinc-400">
              <li>
                <Link href="/about" className="hover:text-ink-black dark:hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-ink-black dark:hover:text-white transition-colors">
                  Support Hub
                </Link>
              </li>
              <li>
                <Link href="/from-the-developers" className="hover:text-ink-black dark:hover:text-white transition-colors">
                  From The Developers
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-ink-black dark:hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-ink-black dark:hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Insights / Newsletter */}
          <div className="md:col-span-4 space-y-6">
            <h5 className="font-monoenterprise text-xs uppercase tracking-widest text-ink-black dark:text-white font-bold">
              Corporate Insights
            </h5>
            <p className="font-sans text-xs text-zinc-550 dark:text-zinc-450">
              Get raw industrial intelligence reports and market analysis directly in your inbox.
            </p>
            <div className="flex border-b border-[#E5E5E5] dark:border-zinc-800 pb-2">
              <input
                className="bg-transparent border-none focus:ring-0 w-full text-xs font-sans placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none"
                placeholder="Your corporate email"
                type="email"
              />
              <button className="text-ink-black dark:text-white hover:opacity-70 transition-opacity" aria-label="Subscribe">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Details */}
        <div className="border-t border-[#E5E5E5] dark:border-zinc-800 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="font-monoenterprise text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
            © {currentYear} TATAmart Enterprise. All rights reserved.
          </span>
          
          {/* Creator Credits */}
          <div className="text-center font-monoenterprise text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
            Made with love by{' '}
            <span className="text-zinc-700 dark:text-zinc-300 font-bold transition-colors duration-300 hover:text-[#346941] dark:hover:text-[#346941]">
              Vaibhav, Umang, Rishabh, Avinash, Prapti, Rick, Dilshad and Bhabya
            </span>
          </div>

          <div className="flex gap-8 font-monoenterprise text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
            <Link href="/privacy" className="hover:text-ink-black dark:hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-ink-black dark:hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
