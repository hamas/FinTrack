'use client';

import * as React from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { HelpCircle, MessageSquare, Book, FileText, ExternalLink } from 'lucide-react';

export default function HelpPage() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const faqs = [
    { q: 'How do I add a recurring transaction?', a: 'Click the "Add Transaction" button on the dashboard and toggle the "Recurring" switch. You can then select the frequency.' },
    { q: 'Can I export my data?', a: 'Yes, you can export your transaction history as a CSV or PDF by clicking the "Export" button on the Transactions page.' },
    { q: 'How are budgets calculated?', a: 'Budgets are tracked based on the categories you assign to your transactions. The progress bar shows how much of your set limit has been spent.' },
  ];

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        <div className="p-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">How can we help?</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Search our knowledge base or contact our support team for assistance.</p>
            <div className="relative max-w-lg mx-auto">
              <input 
                type="text" 
                placeholder="Search for help articles..." 
                className="w-full px-6 py-4 bg-zinc-100 dark:bg-zinc-900 border-transparent focus:bg-white dark:focus:bg-zinc-950 border focus:border-emerald-500 rounded-2xl text-lg outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Documentation', icon: Book, desc: 'Detailed guides on every feature.' },
              { title: 'Community', icon: MessageSquare, desc: 'Join the discussion with other users.' },
              { title: 'API Reference', icon: FileText, desc: 'Build custom integrations with our API.' },
            ].map((card) => (
              <div key={card.title} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <div className="p-3 w-fit rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                  {card.title}
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-sm text-zinc-500">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <h3 className="font-bold mb-2">{faq.q}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900 text-white text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <HelpCircle className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Still need help?</h2>
              <p className="text-zinc-400 max-w-md mx-auto">Our support team is available 24/7 to help you with any issues or questions you might have.</p>
            </div>
            <button className="px-8 py-3 rounded-xl bg-emerald-600 font-bold hover:bg-emerald-700 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
