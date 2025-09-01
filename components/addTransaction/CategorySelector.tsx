import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Category } from '@/types/settings';
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { createStyles } from './styles';

export default function CategorySelector({
  categories,
  selectedId,
  onSelect,
}: {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const styles = createStyles(
    useThemeColor({}, 'background'),
    useThemeColor({}, 'cardBackgroundColor'),
    useThemeColor({}, 'text'),
    useThemeColor({}, 'tint')
  );

  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Category</ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[styles.categoryButton, selectedId === c.id && styles.categoryButtonActive]}
            onPress={() => onSelect(c.id)}
          >
            <ThemedText style={styles.categoryIcon}>{c.icon}</ThemedText>
            <ThemedText style={[styles.categoryButtonText, selectedId === c.id && styles.categoryButtonTextActive]}>
              {c.name}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
}
