// components/transactions/TransactionsList.tsx - Fixed version
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { Category } from '@/types/settings';
import { Transaction } from '@/types/transaction';
import React from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';

interface TransactionsListProps {
  transactions: Transaction[];
  categories: Category[];
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transactionId: number) => void;
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  categories,
  onEditTransaction,
  onDeleteTransaction,
  onRefresh,
  isRefreshing,
}) => {
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
      <ThemedText style={styles.emptySubtext}>
        {transactions.length === 0 ? 'Start by adding your first transaction!' : 'Try adjusting your filters'}
      </ThemedText>
    </ThemedView>
  );

  const renderHeader = () => <ThemedView style={styles.headerSpacing} />;

  const renderFooter = () => <ThemedView style={styles.footerSpacing} />;

  return (
    <FlatList
      data={transactions}
      renderItem={renderTransaction}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmptyState}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.listContainer, transactions.length === 0 && styles.emptyListContainer]}
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={20}
      windowSize={10}
      initialNumToRender={15}
      getItemLayout={(data, index) => ({
        length: 100, // Estimated height
        offset: 100 * index,
        index,
      })}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
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
    paddingHorizontal: 40,
  },
  headerSpacing: {
    height: 10,
  },
  footerSpacing: {
    height: 20,
  },
});
