// app/(tabs)/transactions.tsx - Fixed version
import { ThemedView } from '@/components/ThemedView';
import { EditTransactionModal } from '@/components/transactions/EditTransactionModal';
import { FilterSection } from '@/components/transactions/FilterSection';
import { MonthlyTotal } from '@/components/transactions/MonthlyTotal';
import { SearchSection } from '@/components/transactions/SearchSection';
import { TransactionsList } from '@/components/transactions/TransactionsList';
import { useTransactions } from '@/hooks/useTransactions';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';

export default function TransactionsScreen() {
  const {
    transactions,
    filteredTransactions,
    categories,
    monthlyStats,
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
      refreshData, // Add this method
    },
  } = useTransactions();

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [refreshData])
  );

  if (isLoading) {
    return <ThemedView style={styles.container}>{/* You can add a loading indicator here */}</ThemedView>;
  }

  return (
    <ThemedView style={styles.container}>
      {/* Fixed: Remove ScrollView wrapper and let FlatList handle its own scrolling */}
      <ThemedView style={styles.content}>
        {/* Monthly Summary */}
        <MonthlyTotal income={monthlyStats.income} expenses={monthlyStats.expenses} netTotal={monthlyStats.netTotal} />

        {/* Search Section */}
        <SearchSection searchQuery={filters.searchQuery} onSearchChange={handleSearchChange} />

        {/* Filter Section */}
        <FilterSection
          categories={categories}
          selectedCategoryId={filters.selectedCategoryId}
          startDate={filters.startDate}
          endDate={filters.endDate}
          onCategorySelect={handleCategorySelect}
          onDateRangeChange={handleDateRangeChange}
          onClearFilters={handleClearFilters}
        />

        {/* Transactions List - Now handles its own scrolling */}
        <TransactionsList
          transactions={filteredTransactions}
          categories={categories}
          onEditTransaction={handleEditTransaction}
          onDeleteTransaction={handleDeleteTransaction}
          onRefresh={refreshData}
          isRefreshing={isLoading}
        />
      </ThemedView>

      {/* Edit Modal */}
      <EditTransactionModal
        visible={showEditModal}
        transaction={editingTransaction}
        categories={categories}
        onClose={handleCloseEditModal}
        onTransactionUpdated={handleTransactionUpdated}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
