'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ICON_MAP } from '@/lib/icons';
import { Transaction } from '@/lib/domain/entities/types';
import { MoreVertical, Tag, Search, RefreshCw, Calendar, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

import { formatCurrency } from '@/lib/format';

interface TransactionListProps {
  transactions?: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  showSearch?: boolean;
}

export function TransactionList({
  transactions = [],
  onEdit,
  searchTerm = '',
  onSearchChange,
  showSearch = false
}: TransactionListProps) {
  if (transactions.length === 0 && !searchTerm) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 bg-emerald-50 dark:bg-[#1E1E1E] rounded-3xl flex items-center justify-center mb-6 border border-emerald-100 dark:border-[#282828] shadow-inner relative group">
          <div className="absolute inset-0 bg-emerald-500/10 rounded-3xl blur-xl group-hover:bg-emerald-500/20 transition-all duration-500"></div>
          <Tag className="h-8 w-8 text-emerald-500 relative z-10" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">No Transactions Yet</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-[250px] mx-auto mb-6">
          Your financial orbit is clear. Add a transaction to start tracking your momentum.
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            // This assumes a parent component handles the modal state.
            // If `AddTransactionModal` relies on global state, we leave it to the user.
            // For now, it's a visually compliant CTA.
          }}
          className="flex items-center justify-center gap-2 px-8 py-3 rounded-[32px] bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 dark:shadow-[0_0_20px_rgba(0,230,118,0.2)] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          <span>Add Transaction</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showSearch && (
        <div className="relative group mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-emerald-600 transition-colors" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search transactions, categories, or amount..."
            className="w-full pl-10 pr-4 py-3 theme-card focus:border-emerald-500 text-sm outline-none"
          />
        </div>
      )}

      <div className="space-y-3">
        {transactions.length === 0 && searchTerm ? (
          <div className="text-center py-12">
            <p className="text-sm text-zinc-500 font-bold">No results for &quot;{searchTerm}&quot;</p>
            <p className="text-xs text-zinc-400 mt-1">Try a different search term.</p>
          </div>
        ) : (
          transactions.map((tx) => {
            const Icon = ICON_MAP[tx.categoryIcon || 'Tag'] || Tag;
            const color = tx.categoryColor || '#10b981';

            return (
              <motion.div
                key={tx.id}
                onClick={() => onEdit?.(tx)}
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.99 }}
                className="flex items-center justify-between theme-card-interactive group cursor-pointer !p-4"
              >
                <div className="flex items-center gap-2.5 sm:gap-3.5 flex-1 min-w-0">
                  <div
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 border border-transparent group-hover:border-current"
                    style={{ backgroundColor: `${color}15`, color: color }}
                  >
                    <Icon className="h-4 w-4 sm:h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">{tx.name}</p>
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
                      <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md truncate max-w-[70px] sm:max-w-none">{tx.categoryName}</span>
                      <span className="text-[10px] text-zinc-300 dark:text-zinc-700">•</span>
                      <div className="flex items-center gap-1 text-[8px] sm:text-[9px] font-medium text-zinc-400">
                        <Calendar className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                        <span className="hidden sm:inline">{format(new Date(tx.date), 'MMM dd, yyyy')}</span>
                        <span className="sm:hidden">{format(new Date(tx.date), 'MMM dd')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 ml-2">
                  <div className="text-right shrink-0">
                    <p className={cn(
                      "text-[13px] sm:text-[14px] font-bold tabular-nums",
                      tx.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    )}>
                      {tx.amount > 0 ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      {tx.isRecurring ? (
                        <div className="flex items-center gap-1 px-1 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                          <RefreshCw className="h-2 w-2 animate-spin-slow" />
                          <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-wider">Recurring</span>
                        </div>
                      ) : (
                        <span className="text-[7px] sm:text-[8px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Done</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(tx);
                    }}
                    className="p-1.5 rounded-lg opacity-0 sm:group-hover:opacity-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all hidden sm:block"
                  >
                    <MoreVertical className="h-3.5 w-3.5 text-zinc-400" />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
