// app/(tabs)/index.tsx - Updated Add Transaction Screen
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Clipboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Services
import { loadCategories } from '@/database/categoriesService';
import { initializeDatabase } from '@/database/database';
import { addTransaction } from '@/database/transactionService';

// Utils
import { parseTransactionText } from '@/utils/transactionParser';

// Types
import { Category } from '@/types/settings';
import { NewTransaction, PaymentMethod, TransactionType } from '@/types/transaction';

export default function AddTransactionScreen() {
  const [rawText, setRawText] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isManualMode, setIsManualMode] = useState(false);

  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'cardBackgroundColor');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const styles = createStyles(backgroundColor, cardBackgroundColor, textColor, tintColor);

  useEffect(() => {
    initializeScreen();
  }, []);

  const initializeScreen = async () => {
    try {
      await initializeDatabase();
      const categoriesData = await loadCategories();
      setCategories(categoriesData);
      
      // Set default category (first one)
      if (categoriesData.length > 0) {
        setSelectedCategoryId(categoriesData[0].id);
      }
    } catch (error) {
      console.error('Failed to initialize screen:', error);
      Alert.alert('Error', 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardContent = await Clipboard.getString();
      if (clipboardContent) {
        setRawText(clipboardContent);
        handleParseText(clipboardContent);
      } else {
        Alert.alert('Info', 'Clipboard is empty');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to read from clipboard');
    }
  };

  const handleParseText = (text: string) => {
    if (!text.trim()) return;

    const parsed = parseTransactionText(text);
    
    if (parsed.amount) {
      setAmount(parsed.amount.toString());
    }
    
    if (parsed.description) {
      setDescription(parsed.description);
    }
    
    if (parsed.time) {
      const [hours, minutes] = parsed.time.split(':');
      const newTime = new Date();
      newTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setSelectedTime(newTime);
    }
  };

  const handleSaveTransaction = async () => {
    // Validation
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    
    if (!selectedCategoryId) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    try {
      const newTransaction: NewTransaction = {
        amount: parseFloat(amount),
        description: description.trim(),
        categoryId: selectedCategoryId,
        type: transactionType,
        paymentMethod,
        date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD format
        time: `${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime.getMinutes().toString().padStart(2, '0')}`,
      };

      await addTransaction(newTransaction);
      
      Alert.alert('Success', 'Transaction added successfully', [
        { text: 'OK', onPress: clearForm }
      ]);
    } catch (error) {
      console.error('Failed to save transaction:', error);
      Alert.alert('Error', 'Failed to save transaction');
    }
  };

  const clearForm = () => {
    setRawText('');
    setAmount('');
    setDescription('');
    setSelectedDate(new Date());
    setSelectedTime(new Date());
    setTransactionType('expense');
    setPaymentMethod('credit_card');
    if (categories.length > 0) {
      setSelectedCategoryId(categories[0].id);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ThemedView style={styles.container}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <ThemedText type="title" style={styles.title}>
              Add Transaction
            </ThemedText>

            {/* Parse or Manual Toggle */}
            <ThemedView style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, !isManualMode && styles.toggleButtonActive]}
                onPress={() => setIsManualMode(false)}
              >
                <ThemedText style={[styles.toggleButtonText, !isManualMode && styles.toggleButtonTextActive]}>
                  Parse Text
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, isManualMode && styles.toggleButtonActive]}
                onPress={() => setIsManualMode(true)}
              >
                <ThemedText style={[styles.toggleButtonText, isManualMode && styles.toggleButtonTextActive]}>
                  Manual Entry
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>

            {/* Text Parsing Section */}
            {!isManualMode && (
              <ThemedView style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Paste Transaction Text</ThemedText>
                <TextInput
                  style={styles.textArea}
                  value={rawText}
                  onChangeText={(text) => {
                    setRawText(text);
                    handleParseText(text);
                  }}
                  placeholder="Paste your transaction text here..."
                  placeholderTextColor={styles.placeholderColor.color}
                  multiline
                  numberOfLines={4}
                />
                <TouchableOpacity style={styles.pasteButton} onPress={handlePasteFromClipboard}>
                  <ThemedText style={styles.pasteButtonText}>📋 Paste from Clipboard</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            )}

            {/* Transaction Type */}
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Transaction Type</ThemedText>
              <ThemedView style={styles.typeContainer}>
                <TouchableOpacity
                  style={[styles.typeButton, transactionType === 'expense' && styles.typeButtonActive]}
                  onPress={() => setTransactionType('expense')}
                >
                  <ThemedText style={[styles.typeButtonText, transactionType === 'expense' && styles.typeButtonTextActive]}>
                    💸 Expense
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeButton, transactionType === 'income' && styles.typeButtonActive]}
                  onPress={() => setTransactionType('income')}
                >
                  <ThemedText style={[styles.typeButtonText, transactionType === 'income' && styles.typeButtonTextActive]}>
                    💰 Income
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>

            {/* Amount */}
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Amount</ThemedText>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor={styles.placeholderColor.color}
                keyboardType="decimal-pad"
              />
            </ThemedView>

            {/* Description */}
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Description</ThemedText>
              <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Transaction description"
                placeholderTextColor={styles.placeholderColor.color}
              />
            </ThemedView>

            {/* Category */}
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Category</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      selectedCategoryId === category.id && styles.categoryButtonActive
                    ]}
                    onPress={() => setSelectedCategoryId(category.id)}
                  >
                    <ThemedText style={styles.categoryIcon}>{category.icon}</ThemedText>
                    <ThemedText style={[
                      styles.categoryButtonText,
                      selectedCategoryId === category.id && styles.categoryButtonTextActive
                    ]}>
                      {category.name}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </ThemedView>

            {/* Payment Method */}
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Payment Method</ThemedText>
              <ThemedView style={styles.paymentMethodContainer}>
                {[
                  { key: 'credit_card' as PaymentMethod, label: '💳 Credit Card', icon: '💳' },
                  { key: 'bank_transfer' as PaymentMethod, label: '🏦 Bank Transfer', icon: '🏦' },
                  { key: 'atm_withdrawal' as PaymentMethod, label: '🏧 ATM', icon: '🏧' },
                  { key: 'cash' as PaymentMethod, label: '💵 Cash', icon: '💵' },
                ].map((method) => (
                  <TouchableOpacity
                    key={method.key}
                    style={[
                      styles.paymentMethodButton,
                      paymentMethod === method.key && styles.paymentMethodButtonActive
                    ]}
                    onPress={() => setPaymentMethod(method.key)}
                  >
                    <ThemedText style={[
                      styles.paymentMethodText,
                      paymentMethod === method.key && styles.paymentMethodTextActive
                    ]}>
                      {method.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ThemedView>
            </ThemedView>

            {/* Date and Time */}
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Date & Time</ThemedText>
              <ThemedView style={styles.dateTimeContainer}>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <ThemedText style={styles.dateTimeButtonText}>📅 {formatDate(selectedDate)}</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <ThemedText style={styles.dateTimeButtonText}>🕐 {formatTime(selectedTime)}</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveTransaction}>
              <ThemedText style={styles.saveButtonText}>💾 Save Transaction</ThemedText>
            </TouchableOpacity>

            <ThemedView style={styles.bottomSpacing} />
          </ScrollView>
        </ThemedView>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) setSelectedDate(date);
            }}
          />
        )}

        {/* Time Picker */}
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="default"
            onChange={(event, time) => {
              setShowTimePicker(false);
              if (time) setSelectedTime(time);
            }}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (backgroundColor: string, cardBackgroundColor: string, textColor: string, tintColor: string) =>
  StyleSheet.create({
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
    section: {
      marginBottom: 25,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 10,
      opacity: 0.8,
    },
    toggleContainer: {
      flexDirection: 'row',
      backgroundColor: cardBackgroundColor,
      borderRadius: 12,
      padding: 4,
      marginBottom: 25,
    },
    toggleButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
    },
    toggleButtonActive: {
      backgroundColor: tintColor,
    },
    toggleButtonText: {
      fontSize: 16,
      fontWeight: '500',
    },
    toggleButtonTextActive: {
      color: backgroundColor,
    },
    textArea: {
      backgroundColor: cardBackgroundColor,
      borderRadius: 12,
      padding: 15,
      fontSize: 16,
      color: textColor,
      minHeight: 100,
      textAlignVertical: 'top',
      marginBottom: 10,
    },
    pasteButton: {
      backgroundColor: tintColor,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    pasteButtonText: {
      color: backgroundColor,
      fontSize: 16,
      fontWeight: '600',
    },
    typeContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    typeButton: {
      flex: 1,
      backgroundColor: cardBackgroundColor,
      borderRadius: 12,
      paddingVertical: 15,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    typeButtonActive: {
      backgroundColor: tintColor,
    },
    typeButtonText: {
      fontSize: 16,
      fontWeight: '500',
    },
    typeButtonTextActive: {
      color: backgroundColor,
    },
    input: {
      backgroundColor: cardBackgroundColor,
      borderRadius: 12,
      paddingVertical: 15,
      paddingHorizontal: 20,
      fontSize: 16,
      color: textColor,
    },
    placeholderColor: {
      color: textColor + '60',
    },
    categoryScroll: {
      flexGrow: 0,
    },
    categoryButton: {
      backgroundColor: cardBackgroundColor,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginRight: 10,
      alignItems: 'center',
      minWidth: 80,
    },
    categoryButtonActive: {
      backgroundColor: tintColor,
    },
    categoryIcon: {
      fontSize: 24,
      marginBottom: 4,
    },
    categoryButtonText: {
      fontSize: 12,
      fontWeight: '500',
      textAlign: 'center',
    },
    categoryButtonTextActive: {
      color: backgroundColor,
    },
    paymentMethodContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    paymentMethodButton: {
      backgroundColor: cardBackgroundColor,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      flex: 1,
      minWidth: '45%',
      alignItems: 'center',
    },
    paymentMethodButtonActive: {
      backgroundColor: tintColor,
    },
    paymentMethodText: {
      fontSize: 14,
      fontWeight: '500',
    },
    paymentMethodTextActive: {
      color: backgroundColor,
    },
    dateTimeContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    dateTimeButton: {
      flex: 1,
      backgroundColor: cardBackgroundColor,
      borderRadius: 12,
      paddingVertical: 15,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    dateTimeButtonText: {
      fontSize: 16,
      fontWeight: '500',
    },
    saveButton: {
      backgroundColor: tintColor,
      borderRadius: 12,
      paddingVertical: 18,
      alignItems: 'center',
      marginTop: 10,
    },
    saveButtonText: {
      color: backgroundColor,
      fontSize: 18,
      fontWeight: '600',
    },
    bottomSpacing: {
      height: 20,
    },
  });