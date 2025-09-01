// components/settings/CategoriesSection.tsx
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Category } from '@/types/settings';
import React from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

interface CategoriesSectionProps {
  categories: Category[];
  onAddCategory: () => void;
  onDeleteCategory: (categoryId: number, categoryName: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories, onAddCategory, onDeleteCategory }) => {
  const cardBackgroundColor = useThemeColor({}, 'cardBackgroundColor');
  const styles = createStyles(cardBackgroundColor);

  const handleDeleteCategory = (categoryId: number, categoryName: string) => {
    Alert.alert('Delete Category', `Are you sure you want to delete "${categoryName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => onDeleteCategory(categoryId, categoryName),
      },
    ]);
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <ThemedView style={styles.categoryItem}>
      <ThemedView style={styles.categoryInfo}>
        <ThemedText style={styles.categoryIcon}>{item.icon}</ThemedText>
        <ThemedText style={styles.categoryName}>{item.name}</ThemedText>
      </ThemedView>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteCategory(item.id, item.name)}>
        <ThemedText style={styles.deleteButtonText}>🗑️</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );

  const ItemSeparator = () => <ThemedView style={styles.separator} />;

  return (
    <ThemedView style={styles.settingSection}>
      <ThemedView style={styles.sectionHeader}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Categories
        </ThemedText>
        <TouchableOpacity style={styles.addButton} onPress={onAddCategory}>
          <ThemedText style={styles.addButtonText}>+ Add</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCategoryItem}
        scrollEnabled={false}
        ItemSeparatorComponent={ItemSeparator}
      />
    </ThemedView>
  );
};

const createStyles = (cardBackgroundColor: string) =>
  StyleSheet.create({
    settingSection: {
      marginBottom: 30,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    sectionTitle: {
      opacity: 0.8,
    },
    addButton: {
      paddingHorizontal: 15,
      paddingVertical: 8,
      backgroundColor: '#007AFF',
      borderRadius: 8,
    },
    addButtonText: {
      color: 'white',
      fontWeight: '600',
    },
    categoryItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
      backgroundColor: cardBackgroundColor,
    },
    categoryInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'transparent',
      flex: 1,
    },
    categoryIcon: {
      fontSize: 20,
      marginRight: 12,
    },
    categoryName: {
      fontSize: 16,
    },
    deleteButton: {
      padding: 8,
    },
    deleteButtonText: {
      fontSize: 18,
    },
    separator: {
      height: 8,
    },
  });
