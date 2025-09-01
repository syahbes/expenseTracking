// hooks/useTransactions.ts - Updated with edit modal support
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

  const loadData = async () => {
    const [transactionsData, categoriesData] = await Promise.all([getTransactions(), loadCategories()]);
    setTransactions(transactionsData);
    setCategories(categoriesData);
  };

  // Filter transactions based on current filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
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
  }, [transactions, filters]);

  // Calculate monthly total for current month
  const monthlyTotal = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return transactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getFullYear() === currentYear && transactionDate.getMonth() === currentMonth;
      })
      .reduce((total, transaction) => {
        return transaction.type === 'expense' ? total - transaction.amount : total + transaction.amount;
      }, 0);
  }, [transactions]);

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

  const handleDeleteTransaction = useCallback(async (transactionId: number) => {
    Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTransaction(transactionId);
            await loadData(); // Reload data
          } catch (error) {
            Alert.alert('Error', 'Failed to delete transaction');
          }
        },
      },
    ]);
  }, []);

  const handleEditTransaction = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setShowEditModal(false);
    setEditingTransaction(null);
  }, []);

  const handleTransactionUpdated = useCallback(async () => {
    await loadData(); // Reload data after update
  }, []);

  return {
    transactions,
    filteredTransactions,
    categories,
    monthlyTotal,
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
    },
  };
}
