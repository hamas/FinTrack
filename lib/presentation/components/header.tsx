'use client';

import * as React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useUserProfile } from '@/lib/presentation/context/user-profile-context';

interface HeaderProps {
  onMenuClick?: () => void;
  onSearch?: (term: string) => void;
}

export function Header({ onMenuClick, onSearch }: HeaderProps) {
  const isMobile = useIsMobile();
  const { profile } = useUserProfile();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  return (
    <header className="h-16 theme-card backdrop-blur-md sticky top-6 z-10 mx-6 flex items-center justify-between transition-all">
      <div className="flex items-center gap-2 sm:gap-3 flex-1">
        {isMobile && !isSearchOpen && (
          <button onClick={onMenuClick} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            <Menu className="h-4 w-4" />
          </button>
        )}

        {/* Search Bar - Desktop and Mobile (when open) */}
        <div className={cn(
          "flex-1 max-w-md transition-all duration-300",
          isMobile ? (isSearchOpen ? "flex items-center gap-2" : "hidden") : "block"
        )}>
          <div className="relative group flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 group-focus-within:text-emerald-600 transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              autoFocus={isMobile && isSearchOpen}
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 border-transparent focus:bg-white dark:focus:bg-zinc-950 border focus:border-emerald-500 rounded-full text-[13px] outline-none transition-all"
            />
          </div>
          {isMobile && isSearchOpen && (
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1.5 text-[11px] font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        {isMobile && !isSearchOpen && (
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Search className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
          </button>
        )}

        {!isSearchOpen && (
          <>
            <ThemeToggle />
            <button className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative">
              <Bell className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-950"></span>
            </button>
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 sm:mx-1.5"></div>
            <button className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-1.5 pr-1 py-0.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <div className="text-right hidden md:block">
                <p className="text-[13px] font-semibold leading-none">{profile.name}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">{profile.username}</p>
              </div>

              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-7 h-7 rounded-full object-cover border border-zinc-200 dark:border-[#282828]"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                  <User className="h-4 w-4 text-zinc-500" />
                </div>
              )}
            </button>
          </>
        )}
      </div>
    </header>
  );
}
