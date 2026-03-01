'use client';

import * as React from 'react';
import { X, Plus, DollarSign, Tag, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

import { Category, Transaction, Frequency, RecurringMetadata } from '@/lib/domain/entities/types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAddTransaction: (transaction: any) => void;
  initialData?: Transaction | null;
}

export function AddTransactionModal({ isOpen, onClose, categories, onAddTransaction, initialData }: AddTransactionModalProps) {
  const [name, setName] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = React.useState('');
  const [isRecurring, setIsRecurring] = React.useState(false);
  const [frequency, setFrequency] = React.useState<Frequency>('monthly');
  const [endDate, setEndDate] = React.useState('');
  const [metadata, setMetadata] = React.useState<RecurringMetadata>({});
  const [updateRecurring, setUpdateRecurring] = React.useState(false);

  const [errors, setErrors] = React.useState<{ name?: string; amount?: string; date?: string }>({});
  const [touched, setTouched] = React.useState<{ name?: boolean; amount?: boolean; date?: boolean }>({});

  const validate = React.useCallback(() => {
    const newErrors: { name?: string; amount?: string; date?: string } = {};
    if (!name) newErrors.name = 'Name is required';
    else if (name.length < 3) newErrors.name = 'Name must be at least 3 characters';

    if (!amount) newErrors.amount = 'Amount is required';
    else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) newErrors.amount = 'Amount must be a positive number';

    if (!date) newErrors.date = 'Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, amount, date]);

  React.useEffect(() => {
    validate();
  }, [name, amount, date, validate]);

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setAmount(Math.abs(initialData.amount).toString());
      setDate(initialData.date);
      setCategoryId(initialData.categoryId);
      setIsRecurring(initialData.isRecurring);
      setFrequency(initialData.frequency || 'monthly');
      setUpdateRecurring(false);
      // If editing, we might want to pre-fill end date if it exists in the recurring rule
      // But for simplicity, we'll focus on the transaction details
    } else {
      setName('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      if (categories.length > 0) setCategoryId(categories[0].id);
      setIsRecurring(false);
      setFrequency('monthly');
      setEndDate('');
      setMetadata({});
    }
    setTouched({});
  }, [initialData, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, amount: true, date: true });
    if (!validate()) return;

    const selectedCategory = categories.find(c => c.id === categoryId);
    const finalAmount = selectedCategory?.type === 'expense' ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));

    onAddTransaction({
      id: initialData?.id,
      name,
      amount: finalAmount,
      date,
      categoryId,
      isRecurring,
      frequency: isRecurring ? frequency : null,
      endDate: isRecurring && endDate ? endDate : null,
      metadata: isRecurring && frequency === 'custom' ? metadata : null,
      updateRecurring: initialData ? updateRecurring : undefined
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md theme-card !p-0 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          <div className="p-4 sm:p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between sticky top-0 bg-white dark:bg-zinc-900 z-10">
            <h2 className="text-xl sm:text-2xl font-bold">{initialData ? 'Edit Transaction' : 'Add Transaction'}</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-transform active:scale-95">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form className="p-4 sm:p-6 space-y-4 sm:space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">Transaction Name</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                  placeholder="e.g. Grocery Shopping"
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 sm:py-3 bg-zinc-50 dark:bg-zinc-950 border rounded-xl outline-none transition-all text-sm sm:text-base",
                    touched.name && errors.name
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-zinc-200 dark:border-zinc-800 focus:border-emerald-500"
                  )}
                  required
                />
              </div>
              {touched.name && errors.name && (
                <p className="text-[10px] sm:text-xs text-rose-500 font-medium animate-in fade-in slide-in-from-top-1">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, amount: true }))}
                    placeholder="0.00"
                    className={cn(
                      "w-full pl-10 pr-4 py-2.5 sm:py-3 bg-zinc-50 dark:bg-zinc-950 border rounded-xl outline-none transition-all text-sm sm:text-base",
                      touched.amount && errors.amount
                        ? "border-rose-500 focus:border-rose-500"
                        : "border-zinc-200 dark:border-zinc-800 focus:border-emerald-500"
                    )}
                    required
                  />
                </div>
                {touched.amount && errors.amount && (
                  <p className="text-[10px] sm:text-xs text-rose-500 font-medium animate-in fade-in slide-in-from-top-1">{errors.amount}</p>
                )}
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, date: true }))}
                    className={cn(
                      "w-full pl-10 pr-4 py-2.5 sm:py-3 bg-zinc-50 dark:bg-zinc-950 border rounded-xl outline-none transition-all text-sm sm:text-base",
                      touched.date && errors.date
                        ? "border-rose-500 focus:border-rose-500"
                        : "border-zinc-200 dark:border-zinc-800 focus:border-emerald-500"
                    )}
                    required
                  />
                </div>
                {touched.date && errors.date && (
                  <p className="text-[10px] sm:text-xs text-rose-500 font-medium animate-in fade-in slide-in-from-top-1">{errors.date}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 sm:py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:border-emerald-500 outline-none transition-all appearance-none text-sm sm:text-base"
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name} ({cat.type})</option>
                ))}
              </select>
            </div>

            {!initialData && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Recurring Transaction</label>
                  <button
                    type="button"
                    onClick={() => setIsRecurring(!isRecurring)}
                    className={`w-12 h-6 rounded-full transition-all relative ${isRecurring ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-800'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isRecurring ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                {isRecurring && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Frequency</label>
                      <select
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value as Frequency)}
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:border-emerald-500 outline-none transition-all appearance-none"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekday">Weekday (Mon-Fri)</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="custom">Custom Rule</option>
                      </select>
                    </div>

                    {frequency === 'custom' && (
                      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Custom Rule Type</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setMetadata({ dayOfWeek: 1 })}
                              className={cn(
                                "py-2 px-3 rounded-lg text-xs font-medium border transition-all",
                                metadata.dayOfWeek !== undefined && metadata.weekOfMonth === undefined
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400"
                                  : "bg-white border-zinc-200 text-zinc-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
                              )}
                            >
                              Specific Day
                            </button>
                            <button
                              type="button"
                              onClick={() => setMetadata({ dayOfWeek: 1, weekOfMonth: 1 })}
                              className={cn(
                                "py-2 px-3 rounded-lg text-xs font-medium border transition-all",
                                metadata.weekOfMonth !== undefined
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400"
                                  : "bg-white border-zinc-200 text-zinc-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
                              )}
                            >
                              Relative Day
                            </button>
                          </div>
                        </div>

                        {metadata.dayOfWeek !== undefined && metadata.weekOfMonth === undefined && (
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500">Every</label>
                            <select
                              value={metadata.dayOfWeek}
                              onChange={(e) => setMetadata({ dayOfWeek: parseInt(e.target.value) })}
                              className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none"
                            >
                              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => (
                                <option key={day} value={i}>{day}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        {metadata.weekOfMonth !== undefined && (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-zinc-500">The</label>
                              <select
                                value={metadata.weekOfMonth}
                                onChange={(e) => setMetadata({ ...metadata, weekOfMonth: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none"
                              >
                                {['1st', '2nd', '3rd', '4th', 'Last'].map((w, i) => (
                                  <option key={w} value={i + 1}>{w}</option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-zinc-500">Day</label>
                              <select
                                value={metadata.dayOfWeek}
                                onChange={(e) => setMetadata({ ...metadata, dayOfWeek: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none"
                              >
                                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => (
                                  <option key={day} value={i}>{day}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">End Date (Optional)</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {initialData?.recurringId && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                <input
                  type="checkbox"
                  id="updateRecurring"
                  checked={updateRecurring}
                  onChange={(e) => setUpdateRecurring(e.target.checked)}
                  className="w-4 h-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="updateRecurring" className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                  Update future recurring transactions too
                </label>
              </div>
            )}

            <div className="pt-2 sm:pt-4 flex gap-3 sticky bottom-0 bg-white dark:bg-zinc-900 py-3 sm:py-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 sm:py-4 rounded-[32px] border border-zinc-200 dark:border-zinc-800 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-[0.98] text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 sm:py-4 rounded-[32px] bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98] text-sm sm:text-base"
              >
                {initialData ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
