// components/transactions/MonthlyTotal.tsx - Updated with dynamic period
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { StyleSheet } from 'react-native';

interface MonthlyTotalProps {
  income: number;
  expenses: number;
  netTotal: number;
  displayPeriod: string;
  totalTransactions?: number;
  filteredTransactions?: number;
}

export const MonthlyTotal: React.FC<MonthlyTotalProps> = ({
  income,
  expenses,
  netTotal,
  displayPeriod,
  totalTransactions = 0,
  filteredTransactions = 0,
}) => {
  const cardBackgroundColor = useThemeColor({}, 'cardBackgroundColor');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const styles = createStyles(cardBackgroundColor, tintColor, textColor);

  const formatAmount = (amount: number) => {
    return `€${amount.toFixed(2)}`;
  };

  const isPositive = netTotal >= 0;
  const hasFilters = filteredTransactions < totalTransactions;

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.periodLabel}>{displayPeriod}</ThemedText>

      {/* Show transaction count if filtered */}
      {hasFilters && (
        <ThemedText style={styles.filterInfo}>
          {filteredTransactions} of {totalTransactions} transactions
        </ThemedText>
      )}

      {/* Income and Expenses breakdown */}
      <ThemedView style={styles.breakdown}>
        <ThemedView style={styles.breakdownItem}>
          <ThemedText style={styles.breakdownLabel}>Income</ThemedText>
          <ThemedText style={styles.incomeAmount}>+{formatAmount(income)}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.breakdownItem}>
          <ThemedText style={styles.breakdownLabel}>Expenses</ThemedText>
          <ThemedText style={styles.expenseAmount}>-{formatAmount(expenses)}</ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Net Total */}
      <ThemedText style={[styles.totalAmount, isPositive ? styles.positiveAmount : styles.negativeAmount]}>
        {isPositive ? '+' : ''}
        {formatAmount(netTotal)}
      </ThemedText>
      <ThemedText style={styles.totalLabel}>{isPositive ? 'Net Surplus' : 'Net Deficit'}</ThemedText>
    </ThemedView>
  );
};

const createStyles = (cardBackgroundColor: string, tintColor: string, textColor: string) =>
  StyleSheet.create({
    container: {
      backgroundColor: cardBackgroundColor,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 20,
      marginBottom: 20,
      alignItems: 'center',
    },
    periodLabel: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 8,
      opacity: 0.8,
    },
    filterInfo: {
      fontSize: 12,
      opacity: 0.6,
      marginBottom: 12,
      color: tintColor,
    },
    breakdown: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 16,
      backgroundColor: 'transparent',
    },
    breakdownItem: {
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    breakdownLabel: {
      fontSize: 12,
      opacity: 0.6,
      marginBottom: 4,
    },
    incomeAmount: {
      fontSize: 16,
      fontWeight: '600',
      color: '#22c55e', // Green for income
    },
    expenseAmount: {
      fontSize: 16,
      fontWeight: '600',
      color: '#ef4444', // Red for expenses
    },
    totalAmount: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    positiveAmount: {
      color: '#22c55e', // Green for positive
    },
    negativeAmount: {
      color: '#ef4444', // Red for negative
    },
    totalLabel: {
      fontSize: 14,
      opacity: 0.6,
    },
  });
