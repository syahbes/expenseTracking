// app/(tabs)/transactions.tsx
import { ThemedView } from '@/components/ThemedView';
import { EditTransactionModal } from '@/components/transactions/EditTransactionModal';
import { FilterSection } from '@/components/transactions/FilterSection';
import { MonthlyTotal } from '@/components/transactions/MonthlyTotal';
import { SearchSection } from '@/components/transactions/SearchSection';
import { TransactionsList } from '@/components/transactions/TransactionsList';
import { useTransactions } from '@/hooks/useTransactions';
import React from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';

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
    },
  } = useTransactions();

  const onRefresh = async () => {
    // Force reload of transactions
    await handleTransactionUpdated();
  };

  if (isLoading) {
    return <ThemedView style={styles.container}>{/* You can add a loading indicator here */}</ThemedView>;
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Monthly Summary - Now shows income, expenses, and net total */}
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

        {/* Transactions List - Shows both income and expense transactions */}
        <TransactionsList
          transactions={filteredTransactions}
          categories={categories}
          onEditTransaction={handleEditTransaction}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </ScrollView>

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
  scrollView: {
    flex: 1,
  },
});
