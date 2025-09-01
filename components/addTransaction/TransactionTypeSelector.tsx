import { createStyles } from '@/components/addTransaction/styles';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { TransactionType } from '@/types/transaction';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function TransactionTypeSelector({
  value,
  onChange,
}: {
  value: TransactionType;
  onChange: (t: TransactionType) => void;
}) {
  const styles = createStyles(
    useThemeColor({}, 'background'),
    useThemeColor({}, 'cardBackgroundColor'),
    useThemeColor({}, 'text'),
    useThemeColor({}, 'tint')
  );

  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Transaction Type</ThemedText>
      <ThemedView style={styles.typeContainer}>
        <TouchableOpacity
          style={[styles.typeButton, value === 'expense' && styles.typeButtonActive]}
          onPress={() => onChange('expense')}
        >
          <ThemedText style={[styles.typeButtonText, value === 'expense' && styles.typeButtonTextActive]}>
            💸 {" "}Expense
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, value === 'income' && styles.typeButtonActive]}
          onPress={() => onChange('income')}
        >
          <ThemedText style={[styles.typeButtonText, value === 'income' && styles.typeButtonTextActive]}>
            💰 {" "}Income
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}
