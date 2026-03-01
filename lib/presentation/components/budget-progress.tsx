'use client';

import * as React from 'react';
import { Category, Transaction } from '@/lib/domain/entities/types';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import { ICON_MAP } from '@/lib/icons';
import { Tag } from 'lucide-react';

interface BudgetProgressProps {
  categories: Category[];
  transactions: Transaction[];
}

export function BudgetProgress({ categories, transactions }: BudgetProgressProps) {
  const budgetCategories = categories.filter(c => c.budget && c.budget > 0);

  if (budgetCategories.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl">
        <p className="text-sm text-zinc-400 font-medium">No budgets set yet.</p>
        <p className="text-xs text-zinc-500 mt-1">Set a budget in category settings to track spending.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {budgetCategories.map(category => {
        const spent = transactions
          .filter(tx => tx.categoryId === category.id && tx.amount < 0)
          .reduce((acc, tx) => acc + Math.abs(tx.amount), 0);

        const percentage = Math.min((spent / (category.budget || 1)) * 100, 100);
        const isOverBudget = spent > (category.budget || 0);
        const Icon = ICON_MAP[category.iconName] || Tag;

        return (
          <div key={category.id} className="space-y-2 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-black/20"
                  style={{ backgroundColor: `${category.color}15`, color: category.color }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{category.name}</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    {formatCurrency(spent)} of {formatCurrency(category.budget || 0)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "text-xs font-bold",
                  isOverBudget ? "text-rose-500" : "text-zinc-600 dark:text-zinc-400"
                )} style={!isOverBudget ? { textShadow: `0 0 10px ${category.color}40` } : {}}>
                  {Math.round(percentage)}%
                </p>
                <p className="text-[10px] font-medium text-zinc-400">
                  {isOverBudget ? 'Over budget' : `${formatCurrency((category.budget || 0) - spent)} left`}
                </p>
              </div>
            </div>

            {/* 12px Hardware Glass Track */}
            <div className="h-3 w-full bg-zinc-100 dark:bg-white/5 backdrop-blur-md rounded-full overflow-hidden border border-zinc-200/50 dark:border-white/10 shadow-inner">
              <div
                className={cn(
                  "h-full transition-all duration-700 ease-out rounded-full relative",
                  isOverBudget ? "bg-rose-500" : ""
                )}
                style={{
                  width: `${percentage}%`,
                  backgroundColor: isOverBudget ? undefined : category.color,
                  boxShadow: isOverBudget ? '0 0 15px rgba(244, 63, 94, 0.4)' : `0 0 15px ${category.color}60`
                }}
              >
                {/* Simulated LED Glint */}
                <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-r from-transparent to-white/30 rounded-r-full"></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
