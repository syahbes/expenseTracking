// components/transactions/TransactionsList.tsx
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { Category } from '@/types/settings';
import { Transaction } from '@/types/transaction';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

interface TransactionsListProps {
  transactions: Transaction[];
  categories: Category[];
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transactionId: number) => void;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({ transactions, categories, onEditTransaction, onDeleteTransaction }) => {
  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TransactionItem
      transaction={item}
      category={categories.find((c) => c.id === item.categoryId)}
      onEdit={() => onEditTransaction(item)}
      onDelete={() => onDeleteTransaction(item.id)}
    />
  );

  const renderEmptyState = () => (
    <ThemedView style={styles.emptyContainer}>
      <ThemedText style={styles.emptyText}>No transactions found</ThemedText>
      <ThemedText style={styles.emptySubtext}>Try adjusting your filters or add some transactions</ThemedText>
    </ThemedView>
  );

  const getItemLayout = (_: any, index: number) => ({
    length: 80, // Estimated height of each item
    offset: 80 * index,
    index,
  });

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id.toString()}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={20}
        windowSize={10}
        initialNumToRender={15}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContainer, transactions.length === 0 && styles.emptyListContainer]}
        ListEmptyComponent={renderEmptyState}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
    opacity: 0.6,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.4,
    textAlign: 'center',
  },
});
