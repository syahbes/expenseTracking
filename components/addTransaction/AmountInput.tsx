import { createStyles } from '@/components/addTransaction/styles';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { TextInput } from 'react-native';

export default function AmountInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const styles = createStyles(
    useThemeColor({}, 'background'),
    useThemeColor({}, 'cardBackgroundColor'),
    useThemeColor({}, 'text'),
    useThemeColor({}, 'tint')
  );

  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Amount</ThemedText>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder="0.00"
        placeholderTextColor={styles.placeholderColor.color}
        keyboardType="decimal-pad"
      />
    </ThemedView>
  );
}
