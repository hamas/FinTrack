'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart,
  Settings,
  HelpCircle,
  TrendingUp,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserProfile } from '@/lib/presentation/context/user-profile-context';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: Wallet },
  { name: 'Income', href: '/income', icon: ArrowUpRight },
  { name: 'Expenses', href: '/expenses', icon: ArrowDownLeft },
  { name: 'Analytics', href: '/analytics', icon: PieChart },
  { name: 'Budgets', href: '/budgets', icon: TrendingUp },
];

const secondaryNav = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { profile } = useUserProfile();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  // Auto-collapse on smaller screens (but not mobile, where it's a drawer)
  React.useEffect(() => {
    const handleResize = () => {
      if (!isMobile) {
        setIsCollapsed(window.innerWidth < 1280);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  const sidebarContent = (
    <div className={cn(
      "flex flex-col h-full bg-white/90 dark:bg-[#121212]/90 backdrop-blur-xl border border-zinc-200 dark:border-[#282828] transition-all duration-300 ease-in-out z-50 overflow-hidden",
      isMobile ? "rounded-[32px] sm:rounded-none" : "rounded-[32px]",
      isCollapsed ? "w-24" : "w-72"
    )}>
      <div className={cn(
        "flex items-center p-6 transition-all duration-300",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center shrink-0">
            <Wallet className="text-white h-5 w-5" />
          </div>
          <span className={cn(
            "font-bold text-xl tracking-tight transition-all duration-300 whitespace-nowrap",
            isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto"
          )}>
            FinTrack
          </span>
        </div>

        {isMobile && (
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={isMobile ? onClose : undefined}
              className="relative group block"
              title={isCollapsed ? item.name : undefined}
            >
              {isActive && (
                <span className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-1.5 h-8 bg-emerald-500 rounded-r-full" />
              )}
              <div className={cn(
                "flex items-center px-3 py-3 rounded-2xl transition-all duration-200",
                isActive
                  ? "bg-emerald-50 text-emerald-700 dark:bg-[rgba(0,230,118,0.1)] dark:text-emerald-400 font-medium"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 font-normal",
                isCollapsed ? "justify-center" : "gap-3"
              )}>
                <item.icon className="h-5 w-5 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                <span className={cn(
                  "text-[15px] whitespace-nowrap transition-all duration-300",
                  isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"
                )}>
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Profile & Secondary Nav */}
      <div className="p-4 border-t border-zinc-200 dark:border-[#282828] flex flex-col gap-1">
        {secondaryNav.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={isMobile ? onClose : undefined}
            title={isCollapsed ? item.name : undefined}
            className={cn(
              "flex items-center px-3 py-3 rounded-2xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors group",
              isCollapsed ? "justify-center" : "gap-3"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" strokeWidth={2} />
            <span className={cn(
              "text-[15px] font-normal whitespace-nowrap transition-all duration-300",
              isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"
            )}>
              {item.name}
            </span>
          </Link>
        ))}

        {/* User Profile */}
        <div className={cn(
          "mt-2 flex items-center p-2 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          <div className="flex items-center gap-3">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-[#282828]"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-300 dark:border-zinc-700">
                <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">
                  {profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}
            <div className={cn(
              "flex flex-col overflow-hidden transition-all duration-300 w-auto",
              isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"
            )}>
              <span className="text-sm font-bold whitespace-nowrap">{profile.name}</span>
              <span className="text-xs text-zinc-500 whitespace-nowrap">{profile.username}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
            onClick={onClose}
          />
        )}
        <aside className={cn(
          "fixed inset-y-0 left-0 w-[85vw] max-w-[320px] p-4 sm:p-6 z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {sidebarContent}
        </aside>
      </>
    );
  }

  // Desktop Floating Sidebar
  return (
    <div className="relative p-6 sm:p-8 pr-0 h-screen sticky top-0 flex flex-col z-40">
      {sidebarContent}

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-12 w-8 h-8 bg-white dark:bg-[#282828] border border-zinc-200 dark:border-zinc-700 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-50 text-zinc-600 dark:text-zinc-300"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </div>
  );
}
