import React from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-zinc-50 dark:bg-zinc-950 pt-24 pb-12 overflow-hidden border-t border-zinc-200/60 dark:border-zinc-800/60">
      {/* Abstract Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-primary/5 dark:bg-brand-primary/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-zinc-200/80 dark:border-zinc-800/80">
          
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <Link href="/" className="inline-flex items-center space-x-2.5 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all group-hover:scale-105 group-hover:shadow-md p-1.5">
                  <img src="/favicon.ico" alt="TATAmart Logo" className="h-full w-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
                    TATAmart
                  </span>
                  <span className="text-[9px] font-black tracking-widest text-brand-primary uppercase leading-none mt-0.5">
                    Enterprise
                  </span>
                </div>
              </Link>
              <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
                The enterprise-native supply platform trusted by global manufacturing networks. Source high-volume components with absolute precision.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Subscribe to updates</h4>
              <div className="flex relative">
                <input 
                  type="email" 
                  placeholder="name@enterprise.com" 
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full py-3 px-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all shadow-sm"
                />
                <button className="absolute right-1 top-1 bottom-1 aspect-square bg-brand-primary hover:bg-indigo-600 rounded-full flex items-center justify-center text-white transition-colors group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Links Columns */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/products" className="text-sm text-zinc-500 hover:text-brand-primary dark:text-zinc-400 dark:hover:text-white transition-colors">Global Inventory</Link></li>
              <li><Link href="/categories" className="text-sm text-zinc-500 hover:text-brand-primary dark:text-zinc-400 dark:hover:text-white transition-colors">Niches & Categories</Link></li>
              <li><Link href="/dashboard/buyer" className="text-sm text-zinc-500 hover:text-brand-primary dark:text-zinc-400 dark:hover:text-white transition-colors">RFQ Management</Link></li>
              <li><Link href="/pricing" className="text-sm text-zinc-500 hover:text-brand-primary dark:text-zinc-400 dark:hover:text-white transition-colors">Enterprise Pricing</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-sm text-zinc-500 hover:text-brand-primary dark:text-zinc-400 dark:hover:text-white transition-colors">About TATAmart</Link></li>
              <li><Link href="/support" className="text-sm text-zinc-500 hover:text-brand-primary dark:text-zinc-400 dark:hover:text-white transition-colors">Help & Support</Link></li>
              <li><Link href="/privacy" className="text-sm text-zinc-500 hover:text-brand-primary dark:text-zinc-400 dark:hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-zinc-500 hover:text-brand-primary dark:text-zinc-400 dark:hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-primary shrink-0" />
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Management Training Centre,<br/>TATA Motors, Telco, Jamshedpur</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-primary shrink-0" />
                <a href="mailto:vaibhavsingh9301@gmail.com" className="text-sm text-zinc-500 hover:text-brand-primary dark:text-zinc-400 transition-colors">vaibhavsingh9301@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-primary shrink-0" />
                <a href="tel:+917482812189" className="text-sm text-zinc-500 hover:text-brand-primary dark:text-zinc-400 transition-colors">+91 7482812189</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-zinc-200/40 dark:border-zinc-800/40 pb-8">
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
            &copy; {currentYear} TATAmart Enterprise. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-200/50 hover:bg-brand-primary hover:text-white text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-brand-primary dark:hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-200/50 hover:bg-brand-primary hover:text-white text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-brand-primary dark:hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-200/50 hover:bg-brand-primary hover:text-white text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-brand-primary dark:hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
          </div>
        </div>

        {/* Creator Credits */}
        <div className="pt-8 text-center flex flex-col items-center justify-center">
          <p className="text-[11px] font-bold tracking-[0.05em] uppercase text-zinc-400 dark:text-zinc-600 transition-all duration-500 select-none hover:text-brand-primary dark:hover:text-indigo-400 group cursor-default">
            Made with love by <span className="text-zinc-600 dark:text-zinc-400 group-hover:text-brand-primary dark:group-hover:text-indigo-300 transition-colors">Vaibhav, Umang, Rishabh, Avinash, Prapti, Rick, Dilshad and Bhabya</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
