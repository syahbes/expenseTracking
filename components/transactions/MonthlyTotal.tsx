// components/transactions/MonthlyTotal.tsx - Updated version
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { StyleSheet } from 'react-native';

interface MonthlyTotalProps {
  income: number;
  expenses: number;
  netTotal: number;
}

export const MonthlyTotal: React.FC<MonthlyTotalProps> = ({ income, expenses, netTotal }) => {
  const cardBackgroundColor = useThemeColor({}, 'cardBackgroundColor');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const styles = createStyles(cardBackgroundColor, tintColor, textColor);

  const formatAmount = (amount: number) => {
    return `€${amount.toFixed(2)}`;
  };

  const getMonthName = () => {
    return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isPositive = netTotal >= 0;

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.monthLabel}>{getMonthName()}</ThemedText>
      
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
      <ThemedText style={styles.totalLabel}>
        {isPositive ? 'Net Surplus' : 'Net Deficit'}
      </ThemedText>
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
    monthLabel: {
      fontSize: 16,
      opacity: 0.7,
      marginBottom: 12,
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