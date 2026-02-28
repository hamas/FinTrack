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
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
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
                )}>
                  {Math.round(percentage)}%
                </p>
                <p className="text-[10px] font-medium text-zinc-400">
                  {isOverBudget ? 'Over budget' : `${formatCurrency((category.budget || 0) - spent)} left`}
                </p>
              </div>
            </div>
            <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-500 ease-out rounded-full",
                  isOverBudget ? "bg-rose-500" : "bg-emerald-500"
                )}
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: isOverBudget ? undefined : category.color 
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
