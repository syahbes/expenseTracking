// components/transactions/SearchSection.tsx
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  const cardBackgroundColor = useThemeColor({}, 'cardBackgroundColor');
  const textColor = useThemeColor({}, 'text');
  const styles = createStyles(cardBackgroundColor, textColor);

  const handleClearSearch = () => {
    onSearchChange('');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.searchInputContainer}>
        <IconSymbol name="magnifyingglass" size={20} color={textColor + '60'} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search transactions..."
          placeholderTextColor={textColor + '60'}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
            <IconSymbol name="xmark.circle.fill" size={20} color={textColor + '60'} />
          </TouchableOpacity>
        )}
      </ThemedView>
    </ThemedView>
  );
};

const createStyles = (cardBackgroundColor: string, textColor: string) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      marginBottom: 15,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: cardBackgroundColor,
      borderRadius: 12,
      paddingHorizontal: 15,
      paddingVertical: 12,
      gap: 10,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: textColor,
    },
    clearButton: {
      padding: 4,
    },
  });