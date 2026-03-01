'use client';

import * as React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className="theme-card-interactive group cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className={cn("p-2.5 sm:p-3 rounded-xl border transition-transform group-hover:scale-105", colorClasses[color])}>
          <Icon className="h-4 w-4 sm:h-5 w-5" />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full border",
          trend === 'up'
            ? "text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30"
            : "text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30"
        )}>
          {trend === 'up' ? <TrendingUp className="h-2 w-2 sm:h-2.5 sm:w-2.5" /> : <TrendingDown className="h-2 w-2 sm:h-2.5 sm:w-2.5" />}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="mt-3">
        <p className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">{title}</p>
        <h3 className="text-lg sm:text-xl font-bold mt-1 sm:mt-1.5 tracking-tight tabular-nums text-zinc-900 dark:text-zinc-100">{value}</h3>
      </div>
    </motion.div>
  );
}
