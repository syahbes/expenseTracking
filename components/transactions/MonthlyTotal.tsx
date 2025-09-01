// components/transactions/MonthlyTotal.tsx
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { StyleSheet } from 'react-native';

interface MonthlyTotalProps {
  total: number;
}

export const MonthlyTotal: React.FC<MonthlyTotalProps> = ({ total }) => {
  const cardBackgroundColor = useThemeColor({}, 'cardBackgroundColor');
  const tintColor = useThemeColor({}, 'tint');
  const styles = createStyles(cardBackgroundColor, tintColor);

  const formatAmount = (amount: number) => {
    const absAmount = Math.abs(amount);
    return `€${absAmount.toFixed(2)}`;
  };

  const getMonthName = () => {
    return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isPositive = total >= 0;

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.monthLabel}>{getMonthName()}</ThemedText>
      <ThemedText style={[styles.totalAmount, isPositive ? styles.positiveAmount : styles.negativeAmount]}>
        {isPositive ? '+' : '-'}
        {formatAmount(total)}
      </ThemedText>
      <ThemedText style={styles.totalLabel}>{isPositive ? 'Net Income' : 'Net Expense'}</ThemedText>
    </ThemedView>
  );
};

const createStyles = (cardBackgroundColor: string, tintColor: string) =>
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
      marginBottom: 8,
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
