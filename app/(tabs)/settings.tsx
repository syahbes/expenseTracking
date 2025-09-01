// app/(tabs)/settings.tsx - Updated to remove duplicate theme handling
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
import { Category } from '@/types/settings';

export default function SettingsScreen() {
  const [currency, setCurrency] = useState('EUR');
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
      const [settingsData, categoriesData] = await Promise.all([loadSettings(), loadCategories()]);

      setCurrency(settingsData.currency);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load app data:', error);
    }
  };

  // Currency handlers
  const handleCurrencySelect = async (currencyCode: string) => {
    try {
      await updateSetting('currency', currencyCode);
      setCurrency(currencyCode);
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <ThemedText type="title" style={styles.title}>
            Settings
          </ThemedText>

          <ThemeSetting />

          <CurrencySetting selectedCurrency={currency} onCurrencyPress={() => setShowCurrencyModal(true)} />

          <CategoriesSection categories={categories} onAddCategory={() => setShowCategoryModal(true)} onDeleteCategory={handleDeleteCategory} />
        </ScrollView>

        <CurrencyModal
          visible={showCurrencyModal}
          selectedCurrency={currency}
          onSelectCurrency={handleCurrencySelect}
          onClose={() => setShowCurrencyModal(false)}
        />

        <CategoryModal visible={showCategoryModal} onAddCategory={handleAddCategory} onClose={() => setShowCategoryModal(false)} />
      </ThemedView>
    </SafeAreaView>
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
