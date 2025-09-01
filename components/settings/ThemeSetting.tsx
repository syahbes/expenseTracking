// components/settings/ThemeSetting.tsx - Updated to use context
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/context/ThemeContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

export const ThemeSetting: React.FC = () => {
  const { theme, setTheme, isLoading } = useTheme();

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    await setTheme(newTheme);
  };

  const cardBackgroundColor = useThemeColor({}, 'cardBackgroundColor');
  const styles = createStyles(cardBackgroundColor);

  if (isLoading) {
    return (
      <ThemedView style={styles.settingSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Theme
        </ThemedText>
        <ThemedView style={[styles.settingItem, styles.loadingItem]}>
          <ActivityIndicator size="small" />
          <ThemedText style={styles.loadingText}>Loading theme...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.settingSection}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Theme
      </ThemedText>
      <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
        <ThemedView style={styles.settingInfo}>
          <ThemedText style={styles.settingIcon}>{theme === 'light' ? '☀️' : '🌙'}</ThemedText>
          <ThemedText style={styles.settingLabel}>{theme === 'light' ? 'Light Theme' : 'Dark Theme'}</ThemedText>
        </ThemedView>
        <ThemedText style={styles.settingValue}>Tap to switch</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const createStyles = (cardBackgroundColor: string) =>
  StyleSheet.create({
    settingSection: {
      marginBottom: 30,
    },
    sectionTitle: {
      marginBottom: 15,
      opacity: 0.8,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 12,
      backgroundColor: cardBackgroundColor,
    },
    loadingItem: {
      justifyContent: 'center',
      gap: 10,
    },
    settingInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    settingIcon: {
      fontSize: 24,
      marginRight: 15,
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: '500',
    },
    settingValue: {
      fontSize: 16,
      opacity: 0.7,
    },
    loadingText: {
      fontSize: 14,
      opacity: 0.7,
    },
  });
