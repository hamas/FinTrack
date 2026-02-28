'use client';

import * as React from 'react';
import { X, Download, Calendar, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, Transaction } from '@/lib/types';
import { format, isWithinInterval, parseISO } from 'date-fns';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  categories: Category[];
}

export function ExportModal({ isOpen, onClose, transactions, categories }: ExportModalProps) {
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [selectedCategoryId, setSelectedCategoryId] = React.useState('all');

  if (!isOpen) return null;

  const handleExport = () => {
    let filtered = [...transactions];

    if (startDate && endDate) {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      filtered = filtered.filter(tx => {
        const date = parseISO(tx.date);
        return isWithinInterval(date, { start, end });
      });
    }

    if (selectedCategoryId !== 'all') {
      filtered = filtered.filter(tx => tx.categoryId === selectedCategoryId);
    }

    // Generate CSV
    const headers = ['Date', 'Name', 'Amount', 'Category', 'Type', 'Recurring'];
    const rows = filtered.map(tx => [
      tx.date,
      `"${tx.name.replace(/"/g, '""')}"`,
      tx.amount.toFixed(2),
      `"${tx.categoryName?.replace(/"/g, '""') || ''}"`,
      tx.amount > 0 ? 'Income' : 'Expense',
      tx.isRecurring ? 'Yes' : 'No'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `fintrack-export-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
        >
          <div className="p-4 sm:p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold">Export Data</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:border-emerald-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:border-emerald-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">Category</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <select 
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:border-emerald-500 outline-none transition-all appearance-none text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 sm:pt-4 flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 py-2.5 sm:py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button 
                onClick={handleExport}
                className="flex-1 py-2.5 sm:py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">Export</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
