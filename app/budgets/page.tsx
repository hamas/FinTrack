'use client';

import * as React from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { motion } from 'motion/react';
import { Plus, Settings2, TrendingUp } from 'lucide-react';

import { Category, Transaction } from '@/lib/types';

export default function BudgetsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, txsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/transactions')
        ]);
        const cats = await catsRes.json();
        const txs = await txsRes.json();
        setCategories(cats);
        setTransactions(txs);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const budgets = categories
    .filter(c => c.type === 'expense' && c.budget)
    .map(c => {
      const spent = transactions
        .filter(t => t.categoryId === c.id)
        .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
      return {
        id: c.id,
        name: c.name,
        spent,
        limit: c.budget || 0,
        color: c.color
      };
    });

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1">Set and track your monthly spending limits.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20">
              <Plus className="h-4 w-4" />
              Create Budget
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => {
              const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
              const isNearLimit = percentage > 85;
              
              return (
                <div key={budget.id} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${budget.color}20`, color: budget.color }}>
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold">{budget.name}</h3>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-colors">
                      <Settings2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Spent</p>
                        <p className="text-xl font-bold">${budget.spent.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Limit</p>
                        <p className="text-sm font-semibold text-zinc-400">${budget.limit.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full"
                          style={{ backgroundColor: isNearLimit ? '#f43f5e' : budget.color }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className={isNearLimit ? 'text-rose-500' : 'text-zinc-400'}>
                          {percentage.toFixed(0)}% Used
                        </span>
                        <span className="text-zinc-400">
                          ${(budget.limit - budget.spent).toLocaleString()} Remaining
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {budgets.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-zinc-500">No budgets found. Create a budget to start tracking.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
