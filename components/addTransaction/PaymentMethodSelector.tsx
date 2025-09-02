import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { PaymentMethod } from '@/types/transaction';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStyles } from './styles';

export default function PaymentMethodSelector({ value, onChange }: { value: PaymentMethod; onChange: (m: PaymentMethod) => void }) {
  const styles = createStyles(
    useThemeColor({}, 'background'),
    useThemeColor({}, 'cardBackgroundColor'),
    useThemeColor({}, 'text'),
    useThemeColor({}, 'tint')
  );

  const methods = [
    { key: 'credit_card' as PaymentMethod, iconName: 'credit-card' as const, label: 'Credit Card' },
    { key: 'bank_transfer' as PaymentMethod, iconName: 'bank-transfer' as const, label: 'Bank Transfer' },
    { key: 'atm_withdrawal' as PaymentMethod, iconName: 'projector-screen-variant-outline' as const, label: 'ATM' },
    { key: 'cash' as PaymentMethod, iconName: 'cash' as const, label: 'Cash' },
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
            <MaterialCommunityIcons name={m.iconName} size={24} color={value === m.key ? styles.paymentMethodTextActive.color : styles.paymentMethodText.color}/>
            <ThemedText style={[styles.paymentMethodText, value === m.key && styles.paymentMethodTextActive]}>{m.label}</ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ThemedView>
  );
}
