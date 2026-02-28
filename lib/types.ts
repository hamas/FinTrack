export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'weekday' | 'custom';

export interface RecurringMetadata {
  dayOfWeek?: number; // 0-6
  weekOfMonth?: number; // 1-5
  dayOfMonth?: number; // 1-31
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  color: string;
  type: 'income' | 'expense';
  budget?: number;
}

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: string;
  categoryId: string;
  categoryName?: string;
  categoryColor?: string;
  categoryIcon?: string;
  isRecurring: boolean;
  frequency?: Frequency;
  recurringId?: string;
}

export interface RecurringTransaction {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
  frequency: Frequency;
  nextDate: string;
  endDate?: string;
  metadata?: string; // JSON string of RecurringMetadata
}
