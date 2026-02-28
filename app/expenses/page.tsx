'use client';

import * as React from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { TransactionList } from '@/components/transaction-list';
import { AddTransactionModal } from '@/components/add-transaction-modal';
import { ExportModal } from '@/components/export-modal';
import { Category, Transaction } from '@/lib/types';
import { Download, Plus, TrendingUp, ArrowDownLeft } from 'lucide-react';

export default function ExpensesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);
  const [editingTransaction, setEditingTransaction] = React.useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);

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
      await fetch('/api/recurring/process', { method: 'POST' });
      const [txsRes, catsRes] = await Promise.all([
        fetch('/api/transactions'),
        fetch('/api/categories')
      ]);
      const txs = await txsRes.json();
      const cats = await catsRes.json();
      setTransactions(txs.filter((t: Transaction) => t.amount < 0));
      setCategories(cats);
    } catch (error) {
      console.error('Failed to fetch data:', error);
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

  const totalExpenses = Math.abs(transactions.reduce((acc, curr) => acc + curr.amount, 0));

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
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Expenses</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Monitor and control your spending habits.</p>
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
                <span className="sm:inline">Add Expense</span>
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

          <ExportModal 
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            transactions={transactions}
            categories={categories}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
              <p className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">Total Expenses</p>
              <h3 className="text-2xl font-bold">${totalExpenses.toLocaleString()}</h3>
              <div className="flex items-center gap-1 text-rose-600 text-xs font-bold mt-2">
                <TrendingUp className="h-3 w-3" />
                +4.2% from last month
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Average Monthly</p>
              <h3 className="text-2xl font-bold">$2,700.00</h3>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Top Category</p>
              <h3 className="text-2xl font-bold">Food & Dining</h3>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <ArrowDownLeft className="h-5 w-5 text-rose-600" />
              <h2 className="text-lg font-bold">Expense History</h2>
            </div>
            <TransactionList transactions={filteredTransactions} onEdit={handleEditClick} />
          </div>
        </div>
      </main>
    </div>
  );
}
