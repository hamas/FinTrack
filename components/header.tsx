'use client';

import * as React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuClick?: () => void;
  onSearch?: (term: string) => void;
}

export function Header({ onMenuClick, onSearch }: HeaderProps) {
  const isMobile = useIsMobile();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10 px-4 sm:px-8 flex items-center justify-between transition-all">
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        {isMobile && !isSearchOpen && (
          <button onClick={onMenuClick} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            <Menu className="h-5 w-5" />
          </button>
        )}
        
        {/* Search Bar - Desktop and Mobile (when open) */}
        <div className={cn(
          "flex-1 max-w-md transition-all duration-300",
          isMobile ? (isSearchOpen ? "flex items-center gap-2" : "hidden") : "block"
        )}>
          <div className="relative group flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-emerald-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search..." 
              autoFocus={isMobile && isSearchOpen}
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-900 border-transparent focus:bg-white dark:focus:bg-zinc-950 border focus:border-emerald-500 rounded-full text-sm outline-none transition-all"
            />
          </div>
          {isMobile && isSearchOpen && (
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="p-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-4">
        {isMobile && !isSearchOpen && (
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Search className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        )}
        
        {!isSearchOpen && (
          <>
            <ThemeToggle />
            <button className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative">
              <Bell className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-950"></span>
            </button>
            <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 sm:mx-2"></div>
            <button className="flex items-center gap-2 sm:gap-3 pl-1 sm:pl-2 pr-1 py-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold leading-none">Alex Rivera</p>
                <p className="text-xs text-zinc-500 mt-1">Pro Plan</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                <User className="h-5 w-5 text-zinc-500" />
              </div>
            </button>
          </>
        )}
      </div>
    </header>
  );
}
