// components/settings/ThemeSetting.tsx
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Theme } from '@/types/settings';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface ThemeSettingProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const ThemeSetting: React.FC<ThemeSettingProps> = ({ theme, onThemeChange }) => {
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    onThemeChange(newTheme);
  };

  return (
    <ThemedView style={styles.settingSection}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>Theme</ThemedText>
      <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
        <ThemedView style={styles.settingInfo}>
          <ThemedText style={styles.settingIcon}>
            {theme === 'light' ? '☀️' : '🌙'}
          </ThemedText>
          <ThemedText style={styles.settingLabel}>
            {theme === 'light' ? 'Light Theme' : 'Dark Theme'}
          </ThemedText>
        </ThemedView>
        <ThemedText style={styles.settingValue}>
          Tap to switch
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
});