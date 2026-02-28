'use client';

import * as React from 'react';
import { Sidebar } from '@/lib/presentation/components/sidebar';
import { Header } from '@/lib/presentation/components/header';
import { User, Bell, Shield, CreditCard, Globe, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();

  const settingsSections = [
    {
      title: 'Profile',
      icon: User,
      description: 'Manage your personal information and account security.',
      items: ['Edit Profile', 'Change Password', 'Two-Factor Authentication']
    },
    {
      title: 'Notifications',
      icon: Bell,
      description: 'Configure how you want to receive alerts and updates.',
      items: ['Email Notifications', 'Push Notifications', 'Transaction Alerts']
    },
    {
      title: 'Appearance',
      icon: theme === 'dark' ? Moon : Sun,
      description: 'Customize the look and feel of your dashboard.',
      items: ['Theme Mode', 'Font Size', 'Compact View']
    },
    {
      title: 'Billing',
      icon: CreditCard,
      description: 'Manage your subscription and payment methods.',
      items: ['Subscription Plan', 'Payment Methods', 'Billing History']
    }
  ];

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage your account preferences and application settings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {settingsSections.map((section) => (
              <div key={section.title} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    <section.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{section.title}</h2>
                    <p className="text-sm text-zinc-500">{section.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {section.items.map((item) => (
                    <button 
                      key={item}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm font-medium group"
                    >
                      {item}
                      <div className="h-5 w-5 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Globe className="h-3 w-3 text-zinc-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400">Danger Zone</h3>
              <p className="text-sm text-zinc-500">Permanently delete your account and all associated data.</p>
            </div>
            <button className="w-full sm:w-auto px-6 py-2 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20">
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
