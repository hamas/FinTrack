'use client';

import * as React from 'react';
import { Category, Transaction } from '@/lib/domain/entities/types';

interface DashboardStats {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    savingsRate: number;
}

/**
 * Custom hook encapsulating the Dashboard's business logic, state, and data fetching.
 * Adheres to SRP by separating UI from data orchestration.
 */
export function useDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isCategoryManagerOpen, setIsCategoryManagerOpen] = React.useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);
    const [editingTransaction, setEditingTransaction] = React.useState<Transaction | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchData = React.useCallback(async () => {
        try {
            // Process recurring transactions
            await fetch('/api/recurring/process', { method: 'POST' });

            const [catsRes, txsRes] = await Promise.all([
                fetch('/api/categories'),
                fetch('/api/transactions')
            ]);
            const catsArr: Category[] = await catsRes.json();
            const txsArr: Transaction[] = await txsRes.json();
            setCategories(catsArr);
            setTransactions(txsArr);
        } catch (error) {
            console.error('[Dashboard] Data synchronization failure.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredTransactions = React.useMemo(() => {
        if (!searchTerm) return transactions;
        const term = searchTerm.toLowerCase();
        return transactions.filter((tx: Transaction) =>
            tx.name.toLowerCase().includes(term) ||
            (tx.categoryName && tx.categoryName.toLowerCase().includes(term)) ||
            tx.amount.toString().includes(term)
        );
    }, [transactions, searchTerm]);

    const stats = React.useMemo((): DashboardStats => {
        const now = new Date();
        const currentMonth = now.getMonth();

        const totalBalance = transactions.reduce((acc: number, curr: Transaction) => acc + curr.amount, 0);

        const monthlyIncome = transactions
            .filter((t: Transaction) => t.amount > 0 && new Date(t.date).getMonth() === currentMonth)
            .reduce((acc: number, curr: Transaction) => acc + curr.amount, 0);

        const monthlyExpenses = Math.abs(transactions
            .filter((t: Transaction) => t.amount < 0 && new Date(t.date).getMonth() === currentMonth)
            .reduce((acc: number, curr: Transaction) => acc + curr.amount, 0));

        const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

        return { totalBalance, monthlyIncome, monthlyExpenses, savingsRate };
    }, [transactions]);

    const handleAddCategory = async (newCat: Omit<Category, 'id'>) => {
        await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...newCat, id: crypto.randomUUID() })
        });
        fetchData();
    };

    const handleDeleteCategory = async (id: string) => {
        await fetch(`/api/categories/${id}`, { method: 'DELETE' });
        fetchData();
    };

    const handleUpdateCategory = async (id: string, updates: Partial<Category>) => {
        await fetch(`/api/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        fetchData();
    };

    const handleSaveTransaction = async (tx: Partial<Transaction> & { updateRecurring?: boolean }) => {
        const isEdit = !!tx.id;
        const url = isEdit ? `/api/transactions/${tx.id}` : '/api/transactions';
        const method = isEdit ? 'PUT' : 'POST';

        const payload = isEdit ? tx : { ...tx, id: crypto.randomUUID() };

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        fetchData();
    };

    const actions = {
        setSearchTerm,
        setIsSidebarOpen,
        setIsModalOpen,
        setIsCategoryManagerOpen,
        setIsExportModalOpen,
        setEditingTransaction,
        handleSaveTransaction,
        handleAddCategory,
        handleDeleteCategory,
        handleUpdateCategory,
        fetchData,
        handleEditClick: (tx: Transaction) => {
            setEditingTransaction(tx);
            setIsModalOpen(true);
        },
        handleModalClose: () => {
            setIsModalOpen(false);
            setEditingTransaction(null);
        }
    };

    return {
        state: {
            isSidebarOpen,
            isModalOpen,
            isCategoryManagerOpen,
            isExportModalOpen,
            editingTransaction,
            searchTerm,
            categories,
            transactions,
            filteredTransactions,
            isLoading,
            ...stats
        },
        actions
    };
}
