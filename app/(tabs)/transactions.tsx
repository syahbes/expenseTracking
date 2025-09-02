// app/(tabs)/transactions.tsx - Updated to pass displayPeriod
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
    displayPeriod,
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
      <ThemedView style={styles.content}>
        {/* Dynamic Monthly Summary - now shows stats based on filtered results */}
        <MonthlyTotal
          income={monthlyStats.income}
          expenses={monthlyStats.expenses}
          netTotal={monthlyStats.netTotal}
          displayPeriod={displayPeriod}
          totalTransactions={monthlyStats.totalTransactions}
          filteredTransactions={monthlyStats.filteredTransactions}
        />

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

        {/* Transactions List */}
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
