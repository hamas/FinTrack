'use client';

import * as React from 'react';
import { Sidebar } from '@/lib/presentation/components/sidebar';
import { Header } from '@/lib/presentation/components/header';
import { StatsCard } from '@/lib/presentation/components/stats-card';
import { TransactionList } from '@/lib/presentation/components/transaction-list';
import { DashboardChart } from '@/lib/presentation/components/dashboard-chart';
import { BudgetProgress } from '@/lib/presentation/components/budget-progress';
import { formatCurrency } from '@/lib/format';
import { AddTransactionModal } from '@/lib/presentation/components/add-transaction-modal';
import { CategoryManager } from '@/lib/presentation/components/category-manager';
import { CategorySpendingChart } from '@/lib/presentation/components/category-spending-chart';
import { ExportModal } from '@/lib/presentation/components/export-modal';
import { Category, Transaction } from '@/lib/domain/entities/types';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Plus,
  Download,
  Filter,
  ChevronRight,
  PieChart as PieChartIcon,
  Settings2,
  Activity,
  List,
  Server
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { useDashboard } from '@/lib/presentation/hooks/use-dashboard';
import { CardHeader } from '@/lib/presentation/components/card-header';
import { CardStack } from '@/lib/presentation/components/card-stack';

export default function DashboardPage() {
  const { state, actions } = useDashboard();
  const {
    isSidebarOpen,
    isModalOpen,
    isCategoryManagerOpen,
    isExportModalOpen,
    editingTransaction,
    searchTerm,
    categories,
    transactions,
    filteredTransactions,
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    savingsRate
  } = state;

  // Framer Motion Variants for Staggered Load
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => actions.setIsSidebarOpen(false)} />

      <main className="flex-1 flex flex-col overflow-x-hidden">
        <Header
          onMenuClick={() => actions.setIsSidebarOpen(true)}
          onSearch={actions.setSearchTerm}
        />

        <motion.div
          className="p-4 sm:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Welcome Section */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Welcome back, Alex!</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Here&apos;s what&apos;s happening with your money today.</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => actions.setIsExportModalOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-[32px] bg-white dark:bg-[#1E1E1E] border border-zinc-200 dark:border-zinc-800/0 text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <Download className="h-4 w-4" />
                <span className="sm:inline">Export</span>
              </button>
              <button
                onClick={() => actions.setIsModalOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-[32px] bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 dark:shadow-[0_0_20px_rgba(0,230,118,0.2)] active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                <span className="sm:inline">Add Transaction</span>
              </button>
            </div>
          </motion.div>

          {/* ... Modal Components ... */}
          <AddTransactionModal
            isOpen={isModalOpen}
            onClose={actions.handleModalClose}
            categories={categories}
            onAddTransaction={actions.handleSaveTransaction}
            initialData={editingTransaction}
          />
          <CategoryManager
            isOpen={isCategoryManagerOpen}
            onClose={() => actions.setIsCategoryManagerOpen(false)}
            categories={categories}
            onAddCategory={actions.handleAddCategory}
            onUpdateCategory={actions.handleUpdateCategory}
            onDeleteCategory={actions.handleDeleteCategory}
          />
          <ExportModal
            isOpen={isExportModalOpen}
            onClose={() => actions.setIsExportModalOpen(false)}
            transactions={transactions}
            categories={categories}
          />

          {/* Macro Hero Layout - Single Focal Anchor */}
          <motion.div variants={itemVariants} className="theme-card relative overflow-hidden group border-0 shadow-2xl shadow-zinc-200/50 dark:shadow-none ring-1 ring-zinc-200 dark:ring-[#282828]">
            <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none">
              <Wallet className="w-64 h-64 -mt-16 -mr-16 text-zinc-900 dark:text-white transform rotate-12 group-hover:rotate-6 transition-transform duration-700 ease-out" />
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative z-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-[#1E1E1E] text-xs font-bold text-zinc-600 dark:text-zinc-400">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" style={{ boxShadow: '0 0 10px rgba(0,230,118,0.5)' }}></div>
                  Live Balance Target
                </div>
                <div>
                  <h2 className="text-5xl sm:text-7xl lg:text-8xl font-light tracking-tighter tabular-nums text-zinc-900 dark:text-white leading-none">
                    {formatCurrency(totalBalance)}
                  </h2>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20" style={{ boxShadow: '0 0 15px rgba(0,230,118,0.15)' }}>
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-sm font-bold">+12.5%</span>
                  </div>
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-500">vs last complete month</span>
                </div>
              </div>

              {/* Nested Modular Metrics */}
              <div className="flex bg-zinc-50 dark:bg-[#0A0A0A] rounded-[24px] p-6 gap-8 border border-zinc-200/50 dark:border-[#282828]">
                <div>
                  <p className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider mb-2">Income Flow</p>
                  <p className="text-2xl sm:text-3xl font-light tracking-tight tabular-nums text-zinc-800 dark:text-zinc-200">
                    {formatCurrency(monthlyIncome)}
                  </p>
                </div>
                <div className="w-px bg-zinc-200 dark:bg-[#282828]" />
                <div>
                  <p className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider mb-2">Total Expenses</p>
                  <p className="text-2xl sm:text-3xl font-light tracking-tight tabular-nums text-zinc-800 dark:text-zinc-200">
                    {formatCurrency(monthlyExpenses)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Masonry Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">

            {/* Primary Column - Data Viz (Spans 8 cols) */}
            <div className="lg:col-span-8 space-y-6 sm:space-y-8 flex flex-col">

              <motion.div variants={itemVariants} className="theme-card flex-1 min-h-[400px]">
                <CardHeader
                  title="Financial Flux Orbit"
                  subtitle="Income velocity vs Expense friction tracking over 180 days"
                  icon={Activity}
                  className="mb-6 sm:mb-8"
                  action={
                    <div className="flex items-center gap-1 bg-zinc-100 dark:bg-[#1E1E1E] p-1.5 rounded-2xl w-fit mt-4 sm:mt-0">
                      <button className="px-4 py-2 text-xs font-bold rounded-xl bg-white dark:bg-[#282828] shadow-sm text-zinc-900 dark:text-white transition-all">Monthly</button>
                      <button className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Quarterly</button>
                    </div>
                  }
                />
                <div className="h-[280px] sm:h-[350px] w-full">
                  <DashboardChart transactions={transactions} />
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <motion.div variants={itemVariants} className="theme-card">
                  <CardHeader
                    title="Category Distribution"
                    icon={PieChartIcon}
                    className="mb-6 sm:mb-8"
                  />
                  <div className="h-[250px] sm:h-[300px]">
                    <CategorySpendingChart categories={categories} transactions={transactions} />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="theme-card flex flex-col">
                  <CardHeader
                    title="Recent Signatures"
                    icon={List}
                    className="mb-6 sm:mb-8"
                    action={
                      <button className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-700 transition-colors flex items-center gap-1 mt-4 sm:mt-0">
                        View all <ChevronRight className="h-4 w-4" />
                      </button>
                    }
                  />
                  <div className="flex-1">
                    <TransactionList
                      transactions={filteredTransactions.slice(0, 5)}
                      onEdit={actions.handleEditClick}
                      searchTerm={searchTerm}
                    />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Secondary Column - Ancillary Tools (Spans 4 cols) */}
            <div className="lg:col-span-4 space-y-6 sm:space-y-8 flex flex-col">

              {/* Budget Hardware Progress Tracks */}
              <motion.div variants={itemVariants} className="theme-card">
                <CardHeader
                  title="Hardware Allocation"
                  icon={Server}
                  className="mb-6 sm:mb-8"
                  action={
                    <button
                      onClick={() => actions.setIsCategoryManagerOpen(true)}
                      className="p-2.5 rounded-full bg-zinc-100 dark:bg-[#1E1E1E] hover:bg-zinc-200 dark:hover:bg-[#282828] text-zinc-500 dark:text-zinc-400 transition-colors mt-4 sm:mt-0"
                    >
                      <Settings2 className="h-4 w-4" />
                    </button>
                  }
                />
                <BudgetProgress categories={categories} transactions={transactions} />
              </motion.div>

              {/* Interactive Layered Card Stack */}
              <motion.div variants={itemVariants} className="w-full relative z-10">
                <CardStack />
              </motion.div>

              {/* Quick Action Dock */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                <button className="theme-card-interactive flex flex-col items-center justify-center gap-3 !p-6">
                  <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-[#1E1E1E] text-zinc-700 dark:text-zinc-300 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 group-hover:text-emerald-600 transition-colors">Transfer</span>
                </button>
                <button className="theme-card-interactive flex flex-col items-center justify-center gap-3 !p-6">
                  <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-[#1E1E1E] text-zinc-700 dark:text-zinc-300 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Filter className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 group-hover:text-blue-600 transition-colors">Reports</span>
                </button>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
