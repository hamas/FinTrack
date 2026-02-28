'use client';

import * as React from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { StatsCard } from '@/components/stats-card';
import { TransactionList } from '@/components/transaction-list';
import { DashboardChart } from '@/components/dashboard-chart';
import { BudgetProgress } from '@/components/budget-progress';
import { formatCurrency } from '@/lib/format';
import { AddTransactionModal } from '@/components/add-transaction-modal';
import { CategoryManager } from '@/components/category-manager';
import { CategorySpendingChart } from '@/components/category-spending-chart';
import { ExportModal } from '@/components/export-modal';
import { Category, Transaction } from '@/lib/types';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard,
  Plus,
  Download,
  Filter,
  ChevronRight,
  PieChart as PieChartIcon,
  Settings2
} from 'lucide-react';
import { motion } from 'motion/react';

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = React.useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);
  const [editingTransaction, setEditingTransaction] = React.useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const filteredTransactions = React.useMemo(() => {
    if (!searchTerm) return transactions;
    const term = searchTerm.toLowerCase();
    return transactions.filter(tx => 
      tx.name.toLowerCase().includes(term) ||
      tx.categoryName?.toLowerCase().includes(term) ||
      tx.amount.toString().includes(term)
    );
  }, [transactions, searchTerm]);

  const fetchData = async () => {
    try {
      // Process recurring transactions first
      await fetch('/api/recurring/process', { method: 'POST' });

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

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleAddCategory = async (newCat: Omit<Category, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    await fetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ ...newCat, id })
    });
    fetchData();
  };

  const handleDeleteCategory = async (id: string) => {
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleUpdateCategory = async (id: string, updates: Partial<Category>) => {
    await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    fetchData();
  };

  const handleSaveTransaction = async (tx: any) => {
    if (tx.id) {
      // Edit existing
      await fetch(`/api/transactions/${tx.id}`, {
        method: 'PUT',
        body: JSON.stringify(tx)
      });
    } else {
      // Add new
      const id = Math.random().toString(36).substr(2, 9);
      await fetch('/api/transactions', {
        method: 'POST',
        body: JSON.stringify({ ...tx, id })
      });
    }
    fetchData();
  };

  const handleEditClick = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const totalBalance = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const monthlyIncome = transactions
    .filter(t => t.amount > 0 && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((acc, curr) => acc + curr.amount, 0);
  const monthlyExpenses = Math.abs(transactions
    .filter(t => t.amount < 0 && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((acc, curr) => acc + curr.amount, 0));
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col">
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)} 
          onSearch={setSearchTerm}
        />
        
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          {/* Welcome Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back, Alex!</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Here&apos;s what&apos;s happening with your money today.</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={() => setIsExportModalOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span className="sm:inline">Export</span>
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
              >
                <Plus className="h-4 w-4" />
                <span className="sm:inline">Add Transaction</span>
              </button>
            </div>
          </div>
          
          <AddTransactionModal 
            isOpen={isModalOpen} 
            onClose={handleModalClose} 
            categories={categories}
            onAddTransaction={handleSaveTransaction}
            initialData={editingTransaction}
          />

          <CategoryManager 
            isOpen={isCategoryManagerOpen}
            onClose={() => setIsCategoryManagerOpen(false)}
            categories={categories}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
          />

          <ExportModal 
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            transactions={transactions}
            categories={categories}
          />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Total Balance"
              value={formatCurrency(totalBalance)}
              change={12.5}
              icon={Wallet}
              trend="up"
              color="emerald"
            />
            <StatsCard 
              title="Monthly Income"
              value={formatCurrency(monthlyIncome)}
              change={8.2}
              icon={ArrowUpRight}
              trend="up"
              color="blue"
            />
            <StatsCard 
              title="Monthly Expenses"
              value={formatCurrency(monthlyExpenses)}
              change={-4.3}
              icon={ArrowDownLeft}
              trend="down"
              color="rose"
            />
            <StatsCard 
              title="Savings Rate"
              value={`${savingsRate.toFixed(1)}%`}
              change={2.1}
              icon={CreditCard}
              trend="up"
              color="amber"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Chart Section */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              <div className="p-4 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold">Financial Performance</h2>
                    <p className="text-xs sm:text-sm text-zinc-500">Income vs Expenses for the last 6 months</p>
                  </div>
                  <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl w-fit">
                    <button className="px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg bg-white dark:bg-zinc-700 shadow-sm">Monthly</button>
                    <button className="px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Weekly</button>
                  </div>
                </div>
                <div className="h-[250px] sm:h-[300px]">
                  <DashboardChart transactions={transactions} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="p-4 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <div className="flex items-center gap-2 mb-6 sm:mb-8">
                    <PieChartIcon className="h-5 w-5 text-emerald-600" />
                    <h2 className="text-lg sm:text-xl font-bold">By Category</h2>
                  </div>
                  <div className="h-[250px] sm:h-[300px]">
                    <CategorySpendingChart categories={categories} transactions={transactions} />
                  </div>
                </div>

                <div className="p-4 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <h2 className="text-lg sm:text-xl font-bold">Recent Transactions</h2>
                    <button className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1">
                      View all <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <TransactionList 
                    transactions={filteredTransactions.slice(0, 5)} 
                    onEdit={handleEditClick}
                    searchTerm={searchTerm}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6 sm:space-y-8">
              {/* Budget Progress */}
              <div className="p-4 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <h2 className="text-lg sm:text-xl font-bold">Budget Status</h2>
                  <button 
                    onClick={() => setIsCategoryManagerOpen(true)}
                    className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 transition-colors"
                  >
                    <Settings2 className="h-5 w-5" />
                  </button>
                </div>
                <BudgetProgress categories={categories} transactions={transactions} />
              </div>

              {/* Card Section */}
              <div className="p-5 sm:p-8 rounded-3xl bg-zinc-900 dark:bg-emerald-950/20 border border-zinc-800 dark:border-emerald-900/30 text-white relative overflow-hidden group">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6 sm:mb-10">
                    <div className="p-2 sm:p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                      <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Visa Platinum</span>
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                    <p className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Current Balance</p>
                    <h3 className="text-2xl sm:text-3xl font-bold tabular-nums">{formatCurrency(totalBalance)}</h3>
                  </div>
                  <div className="mt-6 sm:mt-10 flex justify-between items-end">
                    <p className="text-xs sm:text-sm font-mono tracking-widest text-zinc-300">**** **** **** 4582</p>
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-rose-500/80 backdrop-blur-sm border border-white/10"></div>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-amber-500/80 backdrop-blur-sm border border-white/10"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center gap-2 sm:gap-3 hover:border-emerald-500 transition-all group">
                  <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Transfer</span>
                </button>
                <button className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center gap-2 sm:gap-3 hover:border-emerald-500 transition-all group">
                  <div className="p-2.5 sm:p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Reports</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
