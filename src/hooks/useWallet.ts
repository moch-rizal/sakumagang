import { useState, useEffect, useMemo } from 'react';
import { Category, Transaction, WalletSettings } from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_SETTINGS,
  INITIAL_TRANSACTIONS,
  getDemoTransactions,
} from '../data/initialData';
import { resolveIconName } from '../components/CategoryIcon';

const STORAGE_KEYS = {
  CATEGORIES: 'maganghub_wallet_categories_v3',
  TRANSACTIONS: 'maganghub_wallet_transactions_v3',
  SETTINGS: 'maganghub_wallet_settings_v3',
};



export function useWallet() {
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) {
        const parsed: Category[] = JSON.parse(saved);
        // Normalize any old emoji icons to clean vector keys
        return parsed.map((c) => ({
          ...c,
          icon: resolveIconName(c.icon),
        }));
      }
    } catch {
      // ignore
    }
    return INITIAL_CATEGORIES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_TRANSACTIONS;
  });

  const [settings, setSettings] = useState<WalletSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_SETTINGS;
  });

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save transactions', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }, [settings]);

  // Calculations
  const categorySpending = useMemo(() => {
    const map: Record<string, number> = {};
    for (const cat of categories) {
      map[cat.id] = 0;
    }
    for (const tx of transactions) {
      if (map[tx.categoryId] !== undefined) {
        map[tx.categoryId] += tx.amount;
      } else {
        map[tx.categoryId] = tx.amount;
      }
    }
    return map;
  }, [categories, transactions]);

  const totalSpent = useMemo(() => {
    return transactions.reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  const totalAllocatedBudget = useMemo(() => {
    return categories.reduce((sum, cat) => sum + (cat.budget || 0), 0);
  }, [categories]);

  const remainingAllowance = useMemo(() => {
    return Math.max(0, settings.allowance - totalSpent);
  }, [settings.allowance, totalSpent]);

  // Recently used categories based on recent transactions
  const recentCategories = useMemo(() => {
    const seen = new Set<string>();
    const sortedCats: Category[] = [];

    // Check recent transactions first
    const sortedTx = [...transactions].sort((a, b) => b.createdAt - a.createdAt);
    for (const tx of sortedTx) {
      if (!seen.has(tx.categoryId)) {
        const cat = categories.find((c) => c.id === tx.categoryId);
        if (cat) {
          seen.add(cat.id);
          sortedCats.push(cat);
        }
      }
    }

    // Add remaining categories
    for (const cat of categories) {
      if (!seen.has(cat.id)) {
        seen.add(cat.id);
        sortedCats.push(cat);
      }
    }

    return sortedCats;
  }, [categories, transactions]);

  // Action methods
  const addTransaction = (data: {
    amount: number;
    categoryId: string;
    note: string;
    date: string;
  }) => {
    const newTx: Transaction = {
      id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      amount: data.amount,
      categoryId: data.categoryId,
      note: data.note.trim() || 'Pengeluaran',
      date: data.date,
      createdAt: Date.now(),
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const updateTransaction = (id: string, updated: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      id: 'cat-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: categoryData.name.trim(),
      icon: resolveIconName(categoryData.icon) || 'tag',
      budget: Number(categoryData.budget) || 0,
    };
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = (id: string, updated: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const deleteCategory = (id: string) => {
    // Also consider transactions under this category; reassign or keep
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const updateSettings = (updated: Partial<WalletSettings>) => {
    setSettings((prev) => ({ ...prev, ...updated }));
  };

  const loadDemoData = () => {
    const demo = getDemoTransactions();
    setTransactions(demo);
  };

  const clearTransactions = () => {
    setTransactions([]);
  };

  const resetToDefault = () => {
    setCategories(INITIAL_CATEGORIES);
    setTransactions(INITIAL_TRANSACTIONS);
    setSettings(INITIAL_SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  };

  return {
    categories,
    transactions,
    settings,
    totalAllowance: settings.allowance,
    totalSpent,
    totalAllocatedBudget,
    remainingAllowance,
    categorySpending,
    recentCategories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    updateSettings,
    resetToDefault,
    loadDemoData,
    clearTransactions,
  };
}
