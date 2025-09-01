// app/(tabs)/settings.tsx - Refactored version
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';

// Database services
import { addCategory, deleteCategory, loadCategories } from '@/database/categoriesService';
import { initializeDatabase } from '@/database/database';
import { loadSettings, updateSetting } from '@/database/settingsService';

// Components
import { CategoriesSection } from '@/components/settings/CategoriesSection';
import { CategoryModal } from '@/components/settings/CategoryModal';
import { CurrencyModal } from '@/components/settings/CurrencyModal';
import { CurrencySetting } from '@/components/settings/CurrencySetting';
import { ThemeSetting } from '@/components/settings/ThemeSetting';

// Types
import { Category, Settings, Theme } from '@/types/settings';

export default function SettingsScreen() {
  const [settings, setSettings] = useState<Settings>({
    theme: 'light',
    currency: 'EUR',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize database and load data
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await initializeDatabase();
      await loadAppData();
    } catch (error) {
      console.error('Failed to initialize app:', error);
      Alert.alert('Error', 'Failed to initialize settings');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAppData = async () => {
    try {
      const [settingsData, categoriesData] = await Promise.all([
        loadSettings(),
        loadCategories(),
      ]);
      
      setSettings(settingsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load app data:', error);
    }
  };

  // Theme handlers
  const handleThemeChange = async (newTheme: Theme) => {
    try {
      await updateSetting('theme', newTheme);
      setSettings(prev => ({ ...prev, theme: newTheme }));
    } catch (error) {
      Alert.alert('Error', 'Failed to update theme');
    }
  };

  // Currency handlers
  const handleCurrencySelect = async (currencyCode: string) => {
    try {
      await updateSetting('currency', currencyCode);
      setSettings(prev => ({ ...prev, currency: currencyCode }));
      setShowCurrencyModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update currency');
    }
  };

  // Category handlers
  const handleAddCategory = async (name: string, icon: string) => {
    try {
      await addCategory(name, icon);
      const updatedCategories = await loadCategories();
      setCategories(updatedCategories);
    } catch (error) {
      Alert.alert('Error', 'Failed to add category. It might already exist.');
    }
  };

  const handleDeleteCategory = async (categoryId: number, categoryName: string) => {
    try {
      await deleteCategory(categoryId);
      const updatedCategories = await loadCategories();
      setCategories(updatedCategories);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete category');
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.title}>Settings</ThemedText>

        <ThemeSetting
          theme={settings.theme}
          onThemeChange={handleThemeChange}
        />

        <CurrencySetting
          selectedCurrency={settings.currency}
          onCurrencyPress={() => setShowCurrencyModal(true)}
        />

        <CategoriesSection
          categories={categories}
          onAddCategory={() => setShowCategoryModal(true)}
          onDeleteCategory={handleDeleteCategory}
        />
      </ScrollView>

      <CurrencyModal
        visible={showCurrencyModal}
        selectedCurrency={settings.currency}
        onSelectCurrency={handleCurrencySelect}
        onClose={() => setShowCurrencyModal(false)}
      />

      <CategoryModal
        visible={showCategoryModal}
        onAddCategory={handleAddCategory}
        onClose={() => setShowCategoryModal(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
  },
});