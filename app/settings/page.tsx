'use client';

import * as React from 'react';
import { Sidebar } from '@/lib/presentation/components/sidebar';
import { Header } from '@/lib/presentation/components/header';
import { Camera, Mail, Smartphone, Shield, Key, Monitor, Sun, Moon, Type, Globe, CreditCard, Plus, ChevronRight, Trash2, LogOut, CheckCircle2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useUserProfile } from '@/lib/presentation/context/user-profile-context';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const { profile, updateProfile } = useUserProfile();

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex bg-white dark:bg-[#000000] min-h-screen transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0 max-w-full relative pb-20 sm:pb-8 h-screen overflow-y-auto overflow-x-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-8 pt-0 space-y-8 mt-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Account Hub</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Manage your personal identity and application preferences.</p>
          </div>

          {/* Personal Identity Module */}
          <div className="theme-card">
            <h2 className="text-xl font-bold mb-6 text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-[#282828] pb-4">Personal Identity</h2>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex flex-col items-center gap-4 shrink-0">
                <div className="relative group cursor-pointer">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-[120px] h-[120px] rounded-full object-cover border-4 border-white dark:border-[#121212] shadow-xl"
                    />
                  ) : (
                    <div className="w-[120px] h-[120px] rounded-full bg-zinc-100 dark:bg-[#1A1D23] flex items-center justify-center border-4 border-white dark:border-[#121212] shadow-xl">
                      <span className="text-3xl font-bold text-zinc-400 dark:text-zinc-500">
                        {profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <Camera className="text-white h-8 w-8" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full rounded-full"
                  />
                </div>
                <div className="text-center">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">Profile Photo</span>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400 pl-4">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => updateProfile({ name: e.target.value })}
                    className="minimalist-input"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400 pl-4">Username</label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => updateProfile({ username: e.target.value })}
                    className="minimalist-input"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400 pl-4 flex items-center gap-2">
                    <Mail className="h-3 w-3" /> Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => updateProfile({ email: e.target.value })}
                      className="minimalist-input pr-24"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-md">
                      <CheckCircle2 className="h-3 w-3" />
                      <span className="text-[10px] font-bold tracking-wide">VERIFIED</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400 pl-4 flex items-center gap-2">
                    <Smartphone className="h-3 w-3" /> Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => updateProfile({ phone: e.target.value })}
                      className="minimalist-input pr-20"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <button className="text-[11px] font-bold text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 hover:underline">
                        CHANGE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Card 1: Account Security */}
            <div className="theme-card flex flex-col h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-[16px] bg-zinc-100 dark:bg-[#1A1D23] flex items-center justify-center shrink-0">
                  <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Security</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Protect your FinTrack account.</p>
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-[#1A1D23] transition-colors group">
                  <div className="flex items-center gap-3">
                    <Key className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Change Password</p>
                      <p className="text-[11px] text-zinc-500">Last changed 3 months ago</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 transition-colors" />
                </button>

                <div className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-[#1A1D23] transition-colors group">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Two-Factor Authentication</p>
                      <p className="text-[11px] text-zinc-500">Secured via Authenticator App</p>
                    </div>
                  </div>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-500">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                  </div>
                </div>

                <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-[#1A1D23] transition-colors group">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Login Activity</p>
                      <p className="text-[11px] text-zinc-500">Active on Mac OS / Chrome</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 transition-colors" />
                </button>
              </div>
            </div>

            {/* Card 2: Preferences */}
            <div className="theme-card flex flex-col h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-[16px] bg-zinc-100 dark:bg-[#1A1D23] flex items-center justify-center shrink-0">
                  <Sun className="h-5 w-5 text-emerald-600 dark:text-emerald-500 dark:hidden" />
                  <Moon className="h-5 w-5 text-emerald-600 dark:text-emerald-500 hidden dark:block" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Preferences</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Customize your dashboard experience.</p>
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <div className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-[#1A1D23] transition-colors group">
                  <div className="flex items-center gap-3">
                    <Moon className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Dark Mode (AMOLED)</p>
                      <p className="text-[11px] text-zinc-500">Uses True Black #000000</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      theme === 'dark' ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'
                    )}
                  >
                    <span className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition",
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    )} />
                  </button>
                </div>

                <div className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-[#1A1D23] transition-colors group">
                  <div className="flex items-center gap-3">
                    <Type className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Font Scaling (Flex)</p>
                      <p className="text-[11px] text-zinc-500">Google Sans Flex at 14px Scale</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl">
                    <button className="px-3 py-1 rounded-lg text-[11px] font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">A-</button>
                    <button className="px-3 py-1 rounded-lg bg-white dark:bg-[#282828] text-[11px] font-bold shadow-sm">A</button>
                    <button className="px-3 py-1 rounded-lg text-[11px] font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">A+</button>
                  </div>
                </div>

                <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-[#1A1D23] transition-colors group">
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Base Currency</p>
                      <p className="text-[11px] text-zinc-500">Currently set to USD ($)</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold bg-zinc-100 dark:bg-zinc-950 px-3 py-1 rounded-lg text-emerald-600 dark:text-emerald-500">USD</span>
                </button>
              </div>
            </div>

            {/* Card 3: Financial Methods */}
            <div className="theme-card flex flex-col h-full xl:col-span-2">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[16px] bg-zinc-100 dark:bg-[#1A1D23] flex items-center justify-center shrink-0">
                    <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Financial Methods</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Manage your saved cards and institutions.</p>
                  </div>
                </div>
                <button className="h-10 px-4 rounded-[16px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-sm flex items-center gap-2 hover:bg-emerald-500/20 transition-colors active:scale-95">
                  <Plus className="h-4 w-4" /> Add Method
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Simulated Saved Card */}
                <div className="p-5 rounded-[24px] bg-gradient-to-br from-slate-800 to-slate-900 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-16 translate-x-8"></div>
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="text-sm font-bold opacity-80">Salary Account</div>
                    <div className="text-xs font-bold font-mono bg-white/10 px-2 py-1 rounded">VISA</div>
                  </div>
                  <div className="text-xl font-mono tracking-widest relative z-10 opacity-90 mb-2">
                    **** **** **** 4281
                  </div>
                  <div className="flex justify-between items-center relative z-10 text-xs font-bold opacity-60">
                    <span>Exp 12/28</span>
                    <span>Debit</span>
                  </div>
                </div>

                <div className="p-5 rounded-[24px] bg-emerald-50 dark:bg-[#1A1D23] border border-dashed border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-500 flex flex-col items-center justify-center gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 transition-colors cursor-pointer active:scale-95">
                  <Plus className="h-6 w-6" />
                  <span className="text-sm font-bold">Link New Bank</span>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="theme-card relative overflow-hidden border-rose-100 dark:border-rose-900/30">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-transparent dark:from-rose-950/10 dark:to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold text-rose-600 dark:text-rose-500 mb-1">Danger Zone</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Authentication actions and account deletion.</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-[32px] bg-zinc-100 dark:bg-[#1A1D23] text-zinc-700 dark:text-zinc-300 font-bold hover:bg-zinc-200 dark:hover:bg-[#282828] transition-colors active:scale-95">
                  <LogOut className="h-4 w-4" /> Log Out
                </button>
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-[32px] bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20 active:scale-95">
                  <Trash2 className="h-4 w-4" /> Delete Account
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
