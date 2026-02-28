'use client';

import * as React from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { SpendingChart } from '@/components/spending-chart';
import { CategorySpendingChart } from '@/components/category-spending-chart';
import { PieChart, TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

import { Category, Transaction } from '@/lib/types';

export default function AnalyticsPage() {
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

  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

  const topCategory = categories
    .filter(c => c.type === 'expense')
    .map(c => {
      const spent = transactions
        .filter(t => t.categoryId === c.id)
        .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
      return { ...c, spent };
    })
    .sort((a, b) => b.spent - a.spent)[0];

  const highestIncome = transactions
    .filter(t => t.amount > 0)
    .sort((a, b) => b.amount - a.amount)[0];

  const largestExpense = transactions
    .filter(t => t.amount < 0)
    .sort((a, b) => a.amount - b.amount)[0];

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        <div className="p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Deep dive into your spending habits and trends.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold">Income vs Expenses</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs text-zinc-500 font-medium">Income</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="text-xs text-zinc-500 font-medium">Expenses</span>
                  </div>
                </div>
              </div>
              <SpendingChart />
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-2 mb-8">
                <PieChart className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-bold">Expense Breakdown</h2>
              </div>
              <CategorySpendingChart categories={categories as any} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Top Category</span>
              </div>
              <h3 className="text-xl font-bold">{topCategory?.name || 'N/A'}</h3>
              <p className="text-sm text-zinc-500 mt-1">
                {topCategory && totalExpenses > 0 
                  ? `${((topCategory.spent / totalExpenses) * 100).toFixed(0)}% of total expenses`
                  : 'No data available'}
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Highest Income</span>
              </div>
              <h3 className="text-xl font-bold">
                {highestIncome ? `$${highestIncome.amount.toLocaleString()}` : 'N/A'}
              </h3>
              <p className="text-sm text-zinc-500 mt-1">
                {highestIncome ? `From ${highestIncome.name}` : 'No data available'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-2">
                <ArrowDownLeft className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Largest Expense</span>
              </div>
              <h3 className="text-xl font-bold">
                {largestExpense ? `$${Math.abs(largestExpense.amount).toLocaleString()}` : 'N/A'}
              </h3>
              <p className="text-sm text-zinc-500 mt-1">
                {largestExpense ? `For ${largestExpense.name}` : 'No data available'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
