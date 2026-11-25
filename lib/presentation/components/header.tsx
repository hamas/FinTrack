'use client';

import * as React from 'react';
import { Search, Bell, User, Menu, Wallet } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { useIsMobile } from '@/lib/presentation/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useUserProfile } from '@/lib/presentation/context/user-profile-context';

/**
 * Props for the main application Header component.
 * @interface HeaderProps
 */
interface HeaderProps {
  /** Callback triggered when the mobile hamburger menu icon is clicked */
  onMenuClick?: () => void;
  /** Callback for when the user types in the global search bar */
  onSearch?: (term: string) => void;
}

/**
 * The primary top navigation bar of the application.
 * Manages global search, theme toggling, notifications, and user profile display.
 * Becomes "sticky" when scrolling down the page.
 * 
 * @param {HeaderProps} props - Component properties
 */
export function Header({ onMenuClick, onSearch }: HeaderProps) {
  const isMobile = useIsMobile();
  const { profile } = useUserProfile();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const mainContainer = document.querySelector('main');
    const handleScroll = () => {
      const scrollPos = mainContainer ? mainContainer.scrollTop : window.scrollY;
      setIsScrolled(scrollPos > 10);
    };

    if (mainContainer) {
      mainContainer.addEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      mainContainer?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    // Sticky header container that subtly animated its shadow/border when scrolled
    <header className={cn(
      "sticky top-4 z-50 mx-6 transition-all duration-300",
      "h-16 flex items-center"
    )}>
      <div className="w-full h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left Side: Branding & Search */}
        <div className="flex items-center gap-6 flex-1">
          {/* Logo & Name */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
              <Wallet className="text-white h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden lg:block">
              FinTrack
            </span>
          </div>

          {isMobile && !isSearchOpen && (
            <button
              onClick={onMenuClick}
              className="p-3 rounded-2xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 transition-all border border-zinc-200 dark:border-white/5"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
          )}

          {/* Integrated Search Well */}
          <div className={cn(
            "relative group flex-1 max-w-md transition-all duration-300",
            isMobile && !isSearchOpen && "hidden"
          )}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Search anything..."
              autoFocus={isMobile && isSearchOpen}
              onChange={(e) => onSearch?.(e.target.value)}
              className={cn(
                "w-full pl-11 pr-16 h-14 rounded-full outline-none text-[13.5px] transition-all",
                "bg-zinc-100 dark:bg-[#121212] border border-zinc-200 dark:border-white/10",
                "focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-emerald-500/50"
              )}
            />
            {/* Keyboard Shortcut Hint */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm pointer-events-none">
              <span className="text-[10px] font-medium text-zinc-400">⌘</span>
              <span className="text-[10px] font-medium text-zinc-400">K</span>
            </div>
          </div>
        </div>

        {/* Right Side: Action Hub */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle className="w-14 h-14" />

          <button className={cn(
            "w-14 h-14 flex items-center justify-center rounded-full transition-all relative group shrink-0",
            "bg-zinc-100 dark:bg-[#121212] hover:bg-zinc-200 dark:hover:bg-[#1A1A1A]",
            "border border-zinc-200 dark:border-white/10"
          )}>
            <Bell className="h-5 w-5 text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-500" />
            {/* Glowing Green Notification Dot */}
            <span className="absolute top-4.5 right-4.5 w-2 h-2 bg-[#00E676] rounded-full ring-2 ring-white dark:ring-[#121212] shadow-[0_0_8px_rgba(0,230,118,0.6)]"></span>
          </button>

          <div className="h-8 w-px bg-zinc-200 dark:bg-white/10 hidden sm:block"></div>

          {/* Compact Profile Pill: 
              Displays the user avatar and name in a sleek, rounded pill format.
              Uses a fallback generated avatar if no image is provided.
          */}
          <button className={cn(
            "flex items-center gap-3 px-4 h-14 rounded-full transition-all text-left",
            "bg-zinc-100 dark:bg-[#121212] hover:bg-zinc-200 dark:hover:bg-[#1A1A1A]",
            "border border-zinc-200 dark:border-white/10"
          )}>
            <div className="relative shrink-0">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-8 h-8 rounded-full object-cover border border-zinc-300 dark:border-white/20"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <User className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-500" />
                </div>
              )}
              {/* Online indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#00E676] rounded-full border-2 border-white dark:border-[#121212]"></div>
            </div>

            <div className="text-left hidden md:block">
              <p className="text-[13.5px] font-medium tracking-tight truncate max-w-[120px]">{profile.name}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
