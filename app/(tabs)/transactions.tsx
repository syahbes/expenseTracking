// app/(tabs)/transactions.tsx - Final version with edit modal
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { EditTransactionModal } from '@/components/transactions/EditTransactionModal';
import { FilterSection } from '@/components/transactions/FilterSection';
import { MonthlyTotal } from '@/components/transactions/MonthlyTotal';
import { SearchSection } from '@/components/transactions/SearchSection';
import { TransactionsList } from '@/components/transactions/TransactionsList';
import { useTransactions } from '@/hooks/useTransactions';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransactionsScreen() {
  const {
    filteredTransactions,
    categories,
    monthlyTotal,
    isLoading,
    filters,
    editingTransaction,
    showEditModal,
    handlers,
  } = useTransactions();

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Loading transactions...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Transactions
        </ThemedText>

        <MonthlyTotal total={monthlyTotal} />

        <SearchSection 
          searchQuery={filters.searchQuery}
          onSearchChange={handlers.handleSearchChange}
        />

        <FilterSection
          categories={categories}
          selectedCategoryId={filters.selectedCategoryId}
          startDate={filters.startDate}
          endDate={filters.endDate}
          onCategorySelect={handlers.handleCategorySelect}
          onDateRangeChange={handlers.handleDateRangeChange}
          onClearFilters={handlers.handleClearFilters}
        />

        <TransactionsList
          transactions={filteredTransactions}
          categories={categories}
          onEditTransaction={handlers.handleEditTransaction}
          onDeleteTransaction={handlers.handleDeleteTransaction}
        />

        <EditTransactionModal
          visible={showEditModal}
          transaction={editingTransaction}
          categories={categories}
          onClose={handlers.handleCloseEditModal}
          onTransactionUpdated={handlers.handleTransactionUpdated}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
});