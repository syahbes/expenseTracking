import AmountInput from '@/components/addTransaction/AmountInput';
import CategorySelector from '@/components/addTransaction/CategorySelector';
import DateTimePickerSection from '@/components/addTransaction/DateTimePickerSection';
import DescriptionInput from '@/components/addTransaction/DescriptionInput';
import ParseTextSection from '@/components/addTransaction/ParseTextSection';
import PaymentMethodSelector from '@/components/addTransaction/PaymentMethodSelector';
import SaveButton from '@/components/addTransaction/SaveButton';
import ToggleMode from '@/components/addTransaction/ToggleMode';
import TransactionTypeSelector from '@/components/addTransaction/TransactionTypeSelector';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAddTransaction } from '@/hooks/useAddTransaction';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddTransactionScreen() {
  const { state, handlers, categories, isLoading, styles } = useAddTransaction();

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ThemedView style={styles.container}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <ThemedText type="title" style={styles.title}>
              Add Transaction
            </ThemedText>

            <ToggleMode isManual={state.isManualMode} onToggle={handlers.toggleMode} />

            {!state.isManualMode && (
              <ParseTextSection rawText={state.rawText} onChangeText={handlers.handleParseText} onPaste={handlers.handlePasteFromClipboard} />
            )}

            <TransactionTypeSelector value={state.transactionType} onChange={handlers.setTransactionType} />

            <AmountInput value={state.amount} onChange={handlers.setAmount} />
            <DescriptionInput value={state.description} onChange={handlers.setDescription} />

            <CategorySelector categories={categories} selectedId={state.selectedCategoryId} onSelect={handlers.setSelectedCategoryId} />

            <PaymentMethodSelector value={state.paymentMethod} onChange={handlers.setPaymentMethod} />

            <DateTimePickerSection
              date={state.selectedDate}
              time={state.selectedTime}
              onChangeDate={handlers.setSelectedDate}
              onChangeTime={handlers.setSelectedTime}
            />

            <SaveButton onPress={handlers.handleSaveTransaction} />

            <ThemedView style={styles.bottomSpacing} />
          </ScrollView>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
