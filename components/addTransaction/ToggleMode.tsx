import { createStyles } from '@/components/addTransaction/styles';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function ToggleMode({ isManual, onToggle }: { isManual: boolean; onToggle: () => void }) {
  const styles = createStyles(
    useThemeColor({}, 'background'),
    useThemeColor({}, 'cardBackgroundColor'),
    useThemeColor({}, 'text'),
    useThemeColor({}, 'tint')
  );

  return (
    <ThemedView style={styles.toggleContainer}>
      <TouchableOpacity
        style={[styles.toggleButton, !isManual && styles.toggleButtonActive]}
        onPress={onToggle}
      >
        <ThemedText style={[styles.toggleButtonText, !isManual && styles.toggleButtonTextActive]}>
          Parse Text
        </ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.toggleButton, isManual && styles.toggleButtonActive]}
        onPress={onToggle}
      >
        <ThemedText style={[styles.toggleButtonText, isManual && styles.toggleButtonTextActive]}>
          Manual Entry
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
