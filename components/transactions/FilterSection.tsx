// components/transactions/FilterSection.tsx
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Category } from '@/types/settings';
import { formatDateToDDMMYYYY } from '@/utils/dateFormatter';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

interface FilterSectionProps {
  categories: Category[];
  selectedCategoryId: number | null;
  startDate: Date | null;
  endDate: Date | null;
  onCategorySelect: (categoryId: number | null) => void;
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
  onClearFilters: () => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  categories,
  selectedCategoryId,
  startDate,
  endDate,
  onCategorySelect,
  onDateRangeChange,
  onClearFilters,
}) => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const cardBackgroundColor = useThemeColor({}, 'cardBackgroundColor');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const styles = createStyles(cardBackgroundColor, textColor, tintColor);

  const formatDate = (date: Date | null) => {
    return date ? formatDateToDDMMYYYY(date) : 'Select Date';
  };

  const hasActiveFilters = selectedCategoryId !== null || startDate !== null || endDate !== null;

  const handleDateChange = (type: 'start' | 'end', selectedDate?: Date) => {
    if (type === 'start') {
      setShowStartDatePicker(false);
      if (selectedDate) {
        onDateRangeChange(selectedDate, endDate);
      }
    } else {
      setShowEndDatePicker(false);
      if (selectedDate) {
        onDateRangeChange(startDate, selectedDate);
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity style={styles.filterHeader} onPress={() => setIsExpanded(!isExpanded)}>
        <ThemedView style={styles.filterHeaderContent}>
          <IconSymbol name="line.horizontal.3.decrease.circle" size={20} color={textColor} />
          <ThemedText style={styles.filterHeaderText}>Filters</ThemedText>
          {hasActiveFilters && <ThemedView style={styles.activeFilterIndicator} />}
        </ThemedView>
        <IconSymbol name={isExpanded ? 'chevron.up' : 'chevron.down'} size={16} color={textColor + '60'} />
      </TouchableOpacity>

      {isExpanded && (
        <ThemedView style={styles.filterContent}>
          {/* Category Filter */}
          <ThemedView style={styles.filterRow}>
            <ThemedText style={styles.filterLabel}>Category</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              <TouchableOpacity
                style={[styles.categoryButton, selectedCategoryId === null && styles.categoryButtonActive]}
                onPress={() => onCategorySelect(null)}
              >
                <ThemedText style={[styles.categoryButtonText, selectedCategoryId === null && styles.categoryButtonTextActive]}>All</ThemedText>
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryButton, selectedCategoryId === category.id && styles.categoryButtonActive]}
                  onPress={() => onCategorySelect(category.id)}
                >
                  <ThemedText style={styles.categoryIcon}>{category.icon}</ThemedText>
                  <ThemedText style={[styles.categoryButtonText, selectedCategoryId === category.id && styles.categoryButtonTextActive]}>
                    {category.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ThemedView>

          {/* Date Range Filter */}
          <ThemedView style={styles.filterRow}>
            <ThemedText style={styles.filterLabel}>Date Range</ThemedText>
            <ThemedView style={styles.dateRangeContainer}>
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartDatePicker(true)}>
                <ThemedText style={styles.dateButtonText}>From: {formatDate(startDate)}</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndDatePicker(true)}>
                <ThemedText style={styles.dateButtonText}>To: {formatDate(endDate)}</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <TouchableOpacity style={styles.clearButton} onPress={onClearFilters}>
              <IconSymbol name="xmark.circle" size={16} color={textColor} />
              <ThemedText style={styles.clearButtonText}>Clear Filters</ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
      )}

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => handleDateChange('start', date)}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => handleDateChange('end', date)}
        />
      )}
    </ThemedView>
  );
};

const createStyles = (cardBackgroundColor: string, textColor: string, tintColor: string) =>
  StyleSheet.create({
    container: {
      marginHorizontal: 20,
      marginBottom: 15,
    },
    filterHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: cardBackgroundColor,
      borderRadius: 12,
      paddingHorizontal: 15,
      paddingVertical: 12,
    },
    filterHeaderContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: 'transparent',
    },
    filterHeaderText: {
      fontSize: 16,
      fontWeight: '500',
    },
    activeFilterIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: tintColor,
    },
    filterContent: {
      backgroundColor: cardBackgroundColor,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      paddingHorizontal: 15,
      paddingBottom: 15,
      marginTop: 2,
    },
    filterRow: {
      marginTop: 15,
      backgroundColor: 'transparent',
    },
    filterLabel: {
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 10,
      opacity: 0.8,
    },
    categoryScroll: {
      flexGrow: 0,
    },
    categoryButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: textColor + '30',
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginRight: 8,
      alignItems: 'center',
      flexDirection: 'row',
      gap: 4,
    },
    categoryButtonActive: {
      backgroundColor: tintColor,
      borderColor: tintColor,
    },
    categoryIcon: {
      fontSize: 14,
    },
    categoryButtonText: {
      fontSize: 12,
      fontWeight: '500',
    },
    categoryButtonTextActive: {
      color: cardBackgroundColor,
    },
    dateRangeContainer: {
      flexDirection: 'row',
      gap: 10,
      backgroundColor: 'transparent',
    },
    dateButton: {
      flex: 1,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: textColor + '30',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 15,
    },
    dateButtonText: {
      fontSize: 14,
      textAlign: 'center',
    },
    clearButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 15,
      paddingVertical: 10,
      gap: 8,
    },
    clearButtonText: {
      fontSize: 14,
      opacity: 0.7,
    },
  });
