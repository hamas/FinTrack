'use client';

import * as React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  trend: 'up' | 'down';
  color?: 'emerald' | 'rose' | 'blue' | 'amber';
}

export function StatsCard({ title, value, change, icon: Icon, trend, color = 'emerald' }: StatsCardProps) {
  const colorClasses = {
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 border-rose-100 dark:border-rose-900/30",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border-blue-100 dark:border-blue-900/30",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 border-amber-100 dark:border-amber-900/30",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="p-4 sm:p-6 lg:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className={cn("p-3 sm:p-4 rounded-2xl border transition-transform group-hover:scale-110", colorClasses[color])}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border",
          trend === 'up' 
            ? "text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30" 
            : "text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30"
        )}>
          {trend === 'up' ? <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="mt-4 sm:mt-6">
        <p className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest">{title}</p>
        <h3 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 tracking-tight tabular-nums text-zinc-900 dark:text-zinc-100">{value}</h3>
      </div>
    </motion.div>
  );
}
