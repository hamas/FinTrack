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

const data = [
  { name: 'Jan', income: 4000, expenses: 2400 },
  { name: 'Feb', income: 3000, expenses: 1398 },
  { name: 'Mar', income: 2000, expenses: 9800 },
  { name: 'Apr', income: 2780, expenses: 3908 },
  { name: 'May', income: 1890, expenses: 4800 },
  { name: 'Jun', income: 2390, expenses: 3800 },
  { name: 'Jul', income: 3490, expenses: 4300 },
];

export function SpendingChart() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
