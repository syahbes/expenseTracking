import { createStyles } from '@/components/addTransaction/styles';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { TextInput, TouchableOpacity } from 'react-native';

export default function ParseTextSection({
  rawText,
  onChangeText,
  onPaste,
}: {
  rawText: string;
  onChangeText: (t: string) => void;
  onPaste: () => void;
}) {
  const styles = createStyles(
    useThemeColor({}, 'background'),
    useThemeColor({}, 'cardBackgroundColor'),
    useThemeColor({}, 'text'),
    useThemeColor({}, 'tint')
  );

  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Paste Transaction Text</ThemedText>
      <TextInput
        style={styles.textArea}
        value={rawText}
        onChangeText={onChangeText}
        placeholder="Paste your transaction text here..."
        placeholderTextColor={styles.placeholderColor.color}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.pasteButton} onPress={onPaste}>
        <ThemedText style={styles.pasteButtonText}>📋 Paste from Clipboard</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
