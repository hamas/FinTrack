'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ICON_MAP } from '@/lib/icons';
import { Transaction } from '@/lib/types';
import { MoreVertical, Tag, Search, RefreshCw, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

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
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-100 dark:border-zinc-800">
          <Tag className="h-8 w-8 text-zinc-300" />
        </div>
        <p className="text-sm text-zinc-500 font-bold">No transactions found</p>
        <p className="text-xs text-zinc-400 mt-1">Try adding your first transaction.</p>
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
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-emerald-500 rounded-xl text-sm outline-none transition-all"
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
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 hover:border-emerald-500/30 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all group cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 border border-transparent group-hover:border-current"
                    style={{ backgroundColor: `${color}15`, color: color }}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">{tx.name}</p>
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md truncate max-w-[80px] sm:max-w-none">{tx.categoryName}</span>
                      <span className="text-[10px] text-zinc-300 dark:text-zinc-700">•</span>
                      <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-medium text-zinc-400">
                        <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        <span className="hidden sm:inline">{format(new Date(tx.date), 'MMM dd, yyyy')}</span>
                        <span className="sm:hidden">{format(new Date(tx.date), 'MMM dd')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-6 ml-2">
                  <div className="text-right shrink-0">
                    <p className={cn(
                      "text-sm sm:text-base font-bold tabular-nums",
                      tx.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    )}>
                      {tx.amount > 0 ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                    <div className="flex items-center justify-end gap-1.5 mt-0.5 sm:mt-1">
                      {tx.isRecurring ? (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                          <RefreshCw className="h-2 w-2 sm:h-2.5 sm:w-2.5 animate-spin-slow" />
                          <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider">Recurring</span>
                        </div>
                      ) : (
                        <span className="text-[8px] sm:text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Done</span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(tx);
                    }}
                    className="p-2 rounded-xl opacity-0 sm:group-hover:opacity-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all hidden sm:block"
                  >
                    <MoreVertical className="h-4 w-4 text-zinc-400" />
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
