'use client';

import * as React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from 'next-themes';
import { Category, Transaction } from '@/lib/domain/entities/types';

interface CategorySpendingChartProps {
  categories: Category[];
  transactions: Transaction[];
}

export function CategorySpendingChart({ categories, transactions }: CategorySpendingChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === 'dark';

  const data = React.useMemo(() => categories
    .filter(c => c.type === 'expense')
    .map((c) => {
      const spent = transactions
        .filter(t => t.categoryId === c.id && t.amount < 0)
        .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
      
      return {
        name: c.name,
        value: spent,
        color: c.color
      };
    })
    .filter(d => d.value > 0), [categories, transactions]);

  if (!mounted) return <div className="h-[300px] w-full mt-4 bg-zinc-50 dark:bg-zinc-900/50 animate-pulse rounded-3xl" />;

  if (data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-zinc-500 text-sm">
        No expense categories found
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={mounted && typeof window !== 'undefined' && window.innerWidth < 640 ? 50 : 60}
            outerRadius={mounted && typeof window !== 'undefined' && window.innerWidth < 640 ? 70 : 80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: isDark ? '#18181b' : '#ffffff',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
            itemStyle={{ color: isDark ? '#ffffff' : '#000000' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[10px] font-medium text-zinc-500 truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
