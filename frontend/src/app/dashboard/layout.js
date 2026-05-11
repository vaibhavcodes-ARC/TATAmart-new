'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { LayoutDashboard, Heart, ShoppingBag, FileText, Settings, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function BuyerLayout({ children }) {
  const { user, loading, isBuyer, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && !isBuyer) {
      router.push('/');
    }
  }, [user, loading, isBuyer, router]);

  if (loading || !isBuyer) return <div className="h-screen bg-background animate-pulse"></div>;

  const navItems = [
    { label: 'Account Home', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My RFQs', href: '/dashboard/rfqs', icon: FileText },
    { label: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
    { label: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 border-b border-white/5 bg-black/50 backdrop-blur sticky top-0 z-40 flex items-center justify-between px-8">
         <Link href="/" className="font-display font-bold text-lg">TATA<span className="text-tata-red">MART</span></Link>
         <div className="flex items-center gap-6">
            <span className="text-sm text-muted-foreground hidden md:block">Welcome, <strong>{user.name}</strong></span>
            <button onClick={logout} className="text-xs text-tata-red font-medium hover:underline flex items-center gap-1"><LogOut size={14}/> Logout</button>
         </div>
      </header>

      <div className="flex-1 flex max-w-7xl mx-auto w-full p-6 gap-8 mt-6">
         <aside className="w-64 hidden md:block flex-shrink-0">
            <nav className="space-y-1 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
               {navItems.map((i) => {
                 const Icon = i.icon;
                 return (
                   <Link 
                     key={i.href} href={i.href}
                     className={cn(
                       "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                       pathname === i.href ? "bg-tata-red text-white shadow-md" : "text-muted-foreground hover:text-white hover:bg-white/5"
                     )}
                   >
                     <Icon size={18} />
                     {i.label}
                   </Link>
                 );
               })}
            </nav>
         </aside>

         <main className="flex-1 min-w-0">
            {children}
         </main>
      </div>
    </div>
  );
}
