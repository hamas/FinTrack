'use client';

import * as React from 'react';
import { Sidebar } from '@/lib/presentation/components/sidebar';
import { Header } from '@/lib/presentation/components/header';
import { TransactionList } from '@/lib/presentation/components/transaction-list';
import { AddTransactionModal } from '@/lib/presentation/components/add-transaction-modal';
import { ExportModal } from '@/lib/presentation/components/export-modal';
import { Category, Transaction } from '@/lib/domain/entities/types';
import { Download, Filter, Plus, Search, Calendar, Tag, ChevronRight } from 'lucide-react';
import { subDays, isWithinInterval, startOfYear, subMonths } from 'date-fns';
import { motion } from 'motion/react';

export default function TransactionsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);
  const [editingTransaction, setEditingTransaction] = React.useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [dateRange, setDateRange] = React.useState('all');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const filteredTransactions = React.useMemo(() => {
    let filtered = [...transactions];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.name.toLowerCase().includes(term) ||
        tx.categoryName?.toLowerCase().includes(term) ||
        tx.amount.toString().includes(term)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tx => tx.categoryId === selectedCategory);
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      let start: Date;
      
      if (dateRange === '30days') start = subDays(now, 30);
      else if (dateRange === '6months') start = subMonths(now, 6);
      else if (dateRange === 'year') start = startOfYear(now);
      else start = new Date(0);

      filtered = filtered.filter(tx => {
        const txDate = new Date(tx.date);
        return isWithinInterval(txDate, { start, end: now });
      });
    }

    return filtered;
  }, [transactions, searchTerm, dateRange, selectedCategory]);

  const fetchData = async () => {
    try {
      await fetch('/api/recurring/process', { method: 'POST' });
      const [txsRes, catsRes] = await Promise.all([
        fetch('/api/transactions'),
        fetch('/api/categories')
      ]);
      const txs = await txsRes.json();
      const cats = await catsRes.json();
      setTransactions(txs);
      setCategories(cats);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleSaveTransaction = async (tx: any) => {
    if (tx.id) {
      await fetch(`/api/transactions/${tx.id}`, {
        method: 'PUT',
        body: JSON.stringify(tx)
      });
    } else {
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

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col">
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)} 
          onSearch={setSearchTerm}
        />
        
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Transactions</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">View and manage all your financial activities.</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExportModalOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span className="sm:inline">Export</span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
              >
                <Plus className="h-4 w-4" />
                <span className="sm:inline">Add New</span>
              </motion.button>
            </div>
          </div>

          <AddTransactionModal 
            isOpen={isModalOpen} 
            onClose={handleModalClose} 
            categories={categories}
            onAddTransaction={handleSaveTransaction}
            initialData={editingTransaction}
          />

          <ExportModal 
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            transactions={transactions}
            categories={categories}
          />

          <div className="p-4 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-10">
              <div className="relative flex-1 max-w-sm group w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-emerald-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search transactions..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-emerald-500 rounded-2xl text-sm outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative group flex-1 sm:flex-none">
                  <Tag className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3 sm:h-3.5 w-3 sm:w-3.5 text-zinc-400 group-focus-within:text-emerald-600 transition-colors" />
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full sm:w-auto pl-8 sm:pl-9 pr-7 sm:pr-8 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-zinc-50 dark:bg-zinc-950 text-[9px] sm:text-xs font-bold text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 outline-none appearance-none cursor-pointer hover:border-emerald-500 transition-all"
                  >
                    <option value="all">Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 h-2.5 sm:h-3 w-2.5 sm:w-3 text-zinc-400 rotate-90 pointer-events-none" />
                </div>
                <div className="relative group flex-1 sm:flex-none">
                  <Calendar className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3 sm:h-3.5 w-3 sm:w-3.5 text-zinc-400 group-focus-within:text-emerald-600 transition-colors" />
                  <select 
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full sm:w-auto pl-8 sm:pl-9 pr-7 sm:pr-8 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-zinc-50 dark:bg-zinc-950 text-[9px] sm:text-xs font-bold text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 outline-none appearance-none cursor-pointer hover:border-emerald-500 transition-all"
                  >
                    <option value="all">All Time</option>
                    <option value="30days">30 Days</option>
                    <option value="6months">6 Months</option>
                    <option value="year">Year</option>
                  </select>
                  <ChevronRight className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 h-2.5 sm:h-3 w-2.5 sm:w-3 text-zinc-400 rotate-90 pointer-events-none" />
                </div>
              </div>
            </div>
            
            <TransactionList 
              transactions={filteredTransactions} 
              onEdit={handleEditClick} 
              searchTerm={searchTerm}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
