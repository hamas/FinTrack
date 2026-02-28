'use client';

import * as React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useTheme } from 'next-themes';
import { Transaction } from '@/lib/domain/entities/types';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface SpendingChartProps {
  transactions: Transaction[];
}

export function SpendingChart({ transactions }: SpendingChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === 'dark';

  const data = React.useMemo(() => {
    const last7Months = Array.from({ length: 7 }).map((_, i) => {
      const date = subMonths(new Date(), 6 - i);
      return {
        name: format(date, 'MMM'),
        start: startOfMonth(date),
        end: endOfMonth(date),
        income: 0,
        expenses: 0,
      };
    });

    transactions.forEach(tx => {
      const txDate = new Date(tx.date);
      const monthData = last7Months.find(m => 
        isWithinInterval(txDate, { start: m.start, end: m.end })
      );

      if (monthData) {
        if (tx.amount > 0) {
          monthData.income += tx.amount;
        } else {
          monthData.expenses += Math.abs(tx.amount);
        }
      }
    });

    return last7Months;
  }, [transactions]);

  if (!mounted) return <div className="h-[350px] w-full mt-4 bg-zinc-50 dark:bg-zinc-900/50 animate-pulse rounded-3xl" />;

  return (
    <div className="h-[350px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke={isDark ? '#27272a' : '#f4f4f5'} 
          />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: isDark ? '#a1a1aa' : '#71717a', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: isDark ? '#a1a1aa' : '#71717a', fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: isDark ? '#18181b' : '#ffffff', 
              borderColor: isDark ? '#27272a' : '#e4e4e7',
              borderRadius: '12px',
              fontSize: '12px',
              color: isDark ? '#f4f4f5' : '#18181b'
            }}
            itemStyle={{ padding: '2px 0' }}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorIncome)"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#f43f5e"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorExpenses)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
