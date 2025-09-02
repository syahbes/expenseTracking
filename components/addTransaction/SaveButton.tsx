import { createStyles } from '@/components/addTransaction/styles';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function SaveButton({ onPress }: { onPress: () => void }) {
  const styles = createStyles(
    useThemeColor({}, 'background'),
    useThemeColor({}, 'cardBackgroundColor'),
    useThemeColor({}, 'text'),
    useThemeColor({}, 'tint')
  );
  const iconColor = useThemeColor({}, 'background');
  return (
    <TouchableOpacity style={styles.saveButton} onPress={onPress}>
      <FontAwesome name="save" size={24} color={iconColor} />
      <ThemedText style={styles.saveButtonText}>Save Transaction</ThemedText>
    </TouchableOpacity>
  );
}
