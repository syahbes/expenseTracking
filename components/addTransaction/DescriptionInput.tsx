import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { TextInput } from 'react-native';
import { createStyles } from './styles';

export default function DescriptionInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const styles = createStyles(
    useThemeColor({}, 'background'),
    useThemeColor({}, 'cardBackgroundColor'),
    useThemeColor({}, 'text'),
    useThemeColor({}, 'tint')
  );

  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Description</ThemedText>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder="Transaction description"
        placeholderTextColor={styles.placeholderColor.color}
      />
    </ThemedView>
  );
}
