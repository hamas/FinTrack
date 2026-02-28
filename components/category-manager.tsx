'use client';

import * as React from 'react';
import { X, Tag, Trash2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category } from '@/lib/types';
import { ICON_MAP, ICON_NAMES } from '@/lib/icons';

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onUpdateCategory: (id: string, category: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
}

const COLORS = [
  '#10b981', '#3b82f6', '#f43f5e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#71717a'
];

export function CategoryManager({ isOpen, onClose, categories, onAddCategory, onUpdateCategory, onDeleteCategory }: CategoryManagerProps) {
  const [newName, setNewName] = React.useState('');
  const [newBudget, setNewBudget] = React.useState('');
  const [newColor, setNewColor] = React.useState(COLORS[0]);
  const [newType, setNewType] = React.useState<'income' | 'expense'>('expense');
  const [newIcon, setNewIcon] = React.useState(ICON_NAMES[0]);
  const [isIconPickerOpen, setIsIconPickerOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const budgetValue = newBudget ? parseFloat(newBudget) : undefined;

    if (editingId) {
      onUpdateCategory(editingId, {
        name: newName,
        color: newColor,
        type: newType,
        iconName: newIcon,
        budget: budgetValue
      });
      setEditingId(null);
    } else {
      onAddCategory({
        name: newName,
        color: newColor,
        type: newType,
        iconName: newIcon,
        budget: budgetValue
      });
    }
    setNewName('');
    setNewBudget('');
    setNewIcon(ICON_NAMES[0]);
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setNewName(cat.name);
    setNewBudget(cat.budget?.toString() || '');
    setNewColor(cat.color);
    setNewType(cat.type);
    setNewIcon(cat.iconName);
  };

  const SelectedIcon = ICON_MAP[newIcon] || Tag;

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
          className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
        >
          <div className="p-4 sm:p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold">Manage Categories</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[70vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400">
                {editingId ? 'Edit Category' : 'Add New Category'}
              </p>
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Category Name" 
                      className="w-full px-3 sm:px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:border-emerald-500 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsIconPickerOpen(!isIconPickerOpen)}
                      className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-emerald-500 transition-all flex items-center gap-2"
                    >
                      <SelectedIcon className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-600 dark:text-zinc-400" />
                      <ChevronDown className="h-3 w-3 text-zinc-400" />
                    </button>
                    
                    {isIconPickerOpen && (
                      <div className="absolute right-0 top-full mt-2 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-20 grid grid-cols-4 sm:grid-cols-5 gap-1 w-40 sm:w-48">
                        {ICON_NAMES.map(name => {
                          const Icon = ICON_MAP[name];
                          return (
                            <button
                              key={name}
                              type="button"
                              onClick={() => {
                                setNewIcon(name);
                                setIsIconPickerOpen(false);
                              }}
                              className={`p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${newIcon === name ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' : 'text-zinc-500'}`}
                            >
                              <Icon className="h-4 w-4" />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-400">Monthly Budget (Optional)</label>
                  <input 
                    type="number" 
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    placeholder="0.00" 
                    className="w-full px-3 sm:px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:border-emerald-500 outline-none transition-all text-sm"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewColor(color)}
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all ${newColor === color ? 'border-zinc-900 dark:border-white scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('expense')}
                    className={`flex-1 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${newType === 'expense' ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/30' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('income')}
                    className={`flex-1 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${newType === 'income' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}
                  >
                    Income
                  </button>
                </div>
                <div className="flex gap-2">
                  {editingId && (
                    <button 
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setNewName('');
                        setNewBudget('');
                      }}
                      className="flex-1 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs sm:text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <button 
                    type="submit"
                    className="flex-[2] py-2 bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-emerald-700 transition-colors"
                  >
                    {editingId ? 'Update' : 'Add Category'}
                  </button>
                </div>
              </div>
            </form>

            <div className="space-y-2 sm:space-y-3">
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400">Existing Categories</p>
              <div className="space-y-2">
                {categories.map(cat => {
                  const Icon = ICON_MAP[cat.iconName] || Tag;
                  return (
                    <div key={cat.id} className="flex items-center justify-between p-2.5 sm:p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl group">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium truncate">{cat.name}</p>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <p className="text-[9px] sm:text-[10px] uppercase font-bold text-zinc-400">{cat.type}</p>
                            {cat.budget && (
                              <p className="text-[9px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Budget: ${cat.budget}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => startEdit(cat)}
                          className="p-1.5 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-all"
                        >
                          <Tag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                        <button 
                          onClick={() => onDeleteCategory(cat.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
