'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { LayoutDashboard, Package, MessageSquare, LineChart, Settings, LogOut, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function SellerLayout({ children }) {
  const { user, loading, isSeller, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && !isSeller) {
      router.push('/'); // Boot regular users back to home or buyer view
    }
  }, [user, loading, isSeller, router]);

  if (loading || !isSeller) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><span className="animate-pulse text-muted-foreground tracking-widest uppercase text-sm">VERIFYING SELLER CREDENTIALS</span></div>;
  }

  const navItems = [
    { label: 'Overview', href: '/seller', icon: LayoutDashboard },
    { label: 'Products', href: '/seller/products', icon: Package },
    { label: 'Leads & RFQs', href: '/seller/leads', icon: MessageSquare },
    { label: 'Analytics', href: '/seller/analytics', icon: LineChart },
    { label: 'Settings', href: '/seller/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0d0d0d] border-r border-white/5 flex-shrink-0 hidden md:flex flex-col sticky top-0 h-screen pt-8">
        <div className="px-6 mb-10">
           <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-tata-red rounded-md flex items-center justify-center font-bold text-white">T</div>
              <span className="text-lg font-bold font-display">TATA<span className="text-tata-red">MART</span></span>
           </Link>
           <div className="mt-1 pl-1">
             <span className="text-[10px] font-bold tracking-widest text-green-400 bg-green-400/10 px-2 py-0.5 rounded">SELLER PORTAL</span>
           </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link 
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  active ? "bg-tata-red/10 text-tata-red border border-tata-red/20" : "text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-white/5">
           <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-red-400 rounded-lg hover:bg-red-500/5 transition-colors">
              <LogOut size={18} />
              <span>Sign Out</span>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
         <header className="h-16 border-b border-white/5 bg-background/80 backdrop-blur flex items-center justify-end px-8 sticky top-0 z-30">
            <div className="flex items-center gap-4">
               <Link href="/products" className="text-xs text-muted-foreground hover:text-white flex items-center gap-1 border border-white/10 rounded-full px-3 py-1 transition-colors"><Globe size={12}/> Live Site</Link>
               <div className="h-8 w-8 bg-white/10 rounded-full border border-white/10 flex items-center justify-center text-sm font-bold">{user.name.charAt(0)}</div>
            </div>
         </header>
         <main className="flex-1 overflow-y-auto p-6 md:p-10">
           {children}
         </main>
      </div>
    </div>
  );
}
