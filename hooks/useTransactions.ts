// hooks/useTransactions.ts - Fixed version with dynamic monthly stats
import { loadCategories } from '@/database/categoriesService';
import { initializeDatabase } from '@/database/database';
import { deleteTransaction, getTransactions } from '@/database/transactionService';
import { Category } from '@/types/settings';
import { Transaction } from '@/types/transaction';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

interface TransactionFilters {
  searchQuery: string;
  selectedCategoryId: number | null;
  startDate: Date | null;
  endDate: Date | null;
}

interface MonthlyStats {
  income: number;
  expenses: number;
  netTotal: number;
  totalTransactions: number;
  filteredTransactions: number;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>({
    searchQuery: '',
    selectedCategoryId: null,
    startDate: null,
    endDate: null,
  });

  // Load initial data
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setIsLoading(true);
      await initializeDatabase();
      await loadData();
    } catch (error) {
      console.error('Failed to load data:', error);
      Alert.alert('Error', 'Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = useCallback(async () => {
    try {
      const [transactionsData, categoriesData] = await Promise.all([getTransactions(), loadCategories()]);

      console.log('Loaded transactions:', transactionsData.length);
      console.log('Loaded categories:', categoriesData.length);

      setTransactions(transactionsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  // Refresh data function for manual refresh
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    await loadData();
    setIsLoading(false);
  }, [loadData]);

  // Filter transactions based on current filters
  const filteredTransactions = useMemo(() => {
    console.log('Filtering transactions. Total:', transactions.length);

    const filtered = transactions.filter((transaction) => {
      // Search filter
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        if (!transaction.description.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Category filter
      if (filters.selectedCategoryId !== null && transaction.categoryId !== filters.selectedCategoryId) {
        return false;
      }

      // Date range filter
      if (filters.startDate || filters.endDate) {
        const transactionDate = new Date(transaction.date);

        if (filters.startDate) {
          const startOfDay = new Date(filters.startDate);
          startOfDay.setHours(0, 0, 0, 0);
          if (transactionDate < startOfDay) return false;
        }

        if (filters.endDate) {
          const endOfDay = new Date(filters.endDate);
          endOfDay.setHours(23, 59, 59, 999);
          if (transactionDate > endOfDay) return false;
        }
      }

      return true;
    });

    console.log('Filtered transactions:', filtered.length);
    return filtered;
  }, [transactions, filters]);

  // Calculate statistics based on filtered transactions (dynamic)
  const monthlyStats = useMemo((): MonthlyStats => {
    // Calculate stats from filtered transactions instead of current month only
    const income = filteredTransactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0);

    const expenses = filteredTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0);

    const netTotal = income - expenses;

    return {
      income,
      expenses,
      netTotal,
      totalTransactions: transactions.length,
      filteredTransactions: filteredTransactions.length,
    };
  }, [filteredTransactions, transactions.length]);

  // Get the display period for the MonthlyTotal component
  const getDisplayPeriod = useMemo(() => {
    const hasFilters = filters.searchQuery || filters.selectedCategoryId !== null || filters.startDate || filters.endDate;

    if (!hasFilters) {
      // No filters - show current month
      return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    if (filters.startDate && filters.endDate) {
      // Both dates selected
      const start = filters.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const end = filters.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return `${start} - ${end}`;
    } else if (filters.startDate) {
      // Only start date
      const start = filters.startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      return `From ${start}`;
    } else if (filters.endDate) {
      // Only end date
      const end = filters.endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      return `Until ${end}`;
    } else {
      // Other filters (search, category) - show "Filtered Results"
      return 'Filtered Results';
    }
  }, [filters]);

  // Handlers
  const handleSearchChange = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const handleCategorySelect = useCallback((categoryId: number | null) => {
    setFilters((prev) => ({ ...prev, selectedCategoryId: categoryId }));
  }, []);

  const handleDateRangeChange = useCallback((startDate: Date | null, endDate: Date | null) => {
    setFilters((prev) => ({ ...prev, startDate, endDate }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      selectedCategoryId: null,
      startDate: null,
      endDate: null,
    });
  }, []);

  const handleDeleteTransaction = useCallback(
    async (transactionId: number) => {
      Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(transactionId);
              await loadData();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete transaction');
            }
          },
        },
      ]);
    },
    [loadData]
  );

  const handleEditTransaction = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setShowEditModal(false);
    setEditingTransaction(null);
  }, []);

  const handleTransactionUpdated = useCallback(async () => {
    await loadData();
  }, [loadData]);

  return {
    transactions,
    filteredTransactions,
    categories,
    monthlyStats,
    displayPeriod: getDisplayPeriod,
    isLoading,
    filters,
    editingTransaction,
    showEditModal,
    handlers: {
      handleSearchChange,
      handleCategorySelect,
      handleDateRangeChange,
      handleClearFilters,
      handleDeleteTransaction,
      handleEditTransaction,
      handleCloseEditModal,
      handleTransactionUpdated,
      refreshData,
    },
  };
}
