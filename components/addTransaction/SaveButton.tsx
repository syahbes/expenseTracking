import { createStyles } from '@/components/addTransaction/styles';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function SaveButton({ onPress }: { onPress: () => void }) {
  const styles = createStyles(
    useThemeColor({}, 'background'),
    useThemeColor({}, 'cardBackgroundColor'),
    useThemeColor({}, 'text'),
    useThemeColor({}, 'tint')
  );

  return (
    <TouchableOpacity style={styles.saveButton} onPress={onPress}>
      <ThemedText style={styles.saveButtonText}>💾 Save Transaction</ThemedText>
    </TouchableOpacity>
  );
}
