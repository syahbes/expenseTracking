import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { PaymentMethod } from '@/types/transaction';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStyles } from './styles';

export default function PaymentMethodSelector({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
}) {
  const styles = createStyles(
    useThemeColor({}, 'background'),
    useThemeColor({}, 'cardBackgroundColor'),
    useThemeColor({}, 'text'),
    useThemeColor({}, 'tint')
  );

  const methods = [
    { key: 'credit_card' as PaymentMethod, label: '💳 Credit Card' },
    { key: 'bank_transfer' as PaymentMethod, label: '🏦 Bank Transfer' },
    { key: 'atm_withdrawal' as PaymentMethod, label: '🏧 ATM' },
    { key: 'cash' as PaymentMethod, label: '💵 Cash' },
  ];

  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Payment Method</ThemedText>
      <ThemedView style={styles.paymentMethodContainer}>
        {methods.map((m) => (
          <TouchableOpacity
            key={m.key}
            style={[styles.paymentMethodButton, value === m.key && styles.paymentMethodButtonActive]}
            onPress={() => onChange(m.key)}
          >
            <ThemedText style={[styles.paymentMethodText, value === m.key && styles.paymentMethodTextActive]}>
              {m.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ThemedView>
  );
}
