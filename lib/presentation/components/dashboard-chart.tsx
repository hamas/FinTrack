'use client';

import * as React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Transaction } from '@/lib/domain/entities/types';
import { formatCurrency } from '@/lib/format';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface DashboardChartProps {
  transactions: Transaction[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-xl backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-8">
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Income</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(payload[0].value)}</span>
          </div>
          <div className="flex items-center justify-between gap-8">
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Expenses</span>
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400">{formatCurrency(payload[1].value)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function DashboardChart({ transactions }: DashboardChartProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const data = React.useMemo(() => {
    const last6Months = Array.from({ length: 6 }).map((_, i) => {
      const date = subMonths(new Date(), 5 - i);
      return {
        month: format(date, 'MMM'),
        start: startOfMonth(date),
        end: endOfMonth(date),
        income: 0,
        expense: 0,
      };
    });

    transactions.forEach(tx => {
      const txDate = new Date(tx.date);
      const monthData = last6Months.find(m => 
        isWithinInterval(txDate, { start: m.start, end: m.end })
      );

      if (monthData) {
        if (tx.amount > 0) {
          monthData.income += tx.amount;
        } else {
          monthData.expense += Math.abs(tx.amount);
        }
      }
    });

    return last6Months;
  }, [transactions]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: mounted && typeof window !== 'undefined' && window.innerWidth < 640 ? 9 : 10, fontWeight: 600, fill: '#9ca3af' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: mounted && typeof window !== 'undefined' && window.innerWidth < 640 ? 9 : 10, fontWeight: 600, fill: '#9ca3af' }} 
            tickFormatter={(value) => `$${value}`}
            hide={mounted && typeof window !== 'undefined' && window.innerWidth < 640}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)', radius: 8 }} />
          <Bar 
            dataKey="income" 
            fill="#10b981" 
            radius={[4, 4, 0, 0]} 
            barSize={mounted && typeof window !== 'undefined' && window.innerWidth < 640 ? 12 : 20}
          />
          <Bar 
            dataKey="expense" 
            fill="#f43f5e" 
            radius={[4, 4, 0, 0]} 
            barSize={mounted && typeof window !== 'undefined' && window.innerWidth < 640 ? 12 : 20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
