// components/transactions/EditTransactionModal.tsx
import AmountInput from '@/components/addTransaction/AmountInput';
import CategorySelector from '@/components/addTransaction/CategorySelector';
import DescriptionInput from '@/components/addTransaction/DescriptionInput';
import PaymentMethodSelector from '@/components/addTransaction/PaymentMethodSelector';
import TransactionTypeSelector from '@/components/addTransaction/TransactionTypeSelector';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { updateTransaction } from '@/database/transactionService';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Category } from '@/types/settings';
import { NewTransaction, PaymentMethod, Transaction, TransactionType } from '@/types/transaction';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

interface EditTransactionModalProps {
  visible: boolean;
  transaction: Transaction | null;
  categories: Category[];
  onClose: () => void;
  onTransactionUpdated: () => void;
}

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ visible, transaction, categories, onClose, onTransactionUpdated }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'cardBackgroundColor');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const styles = createStyles(backgroundColor, cardBackgroundColor, textColor, tintColor);

  // Populate form when transaction changes
  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString());
      setDescription(transaction.description);
      setSelectedCategoryId(transaction.categoryId);
      setTransactionType(transaction.type);
      setPaymentMethod(transaction.paymentMethod);

      // Parse date and time
      const date = new Date(transaction.date);
      setSelectedDate(date);

      const [hours, minutes] = transaction.time.split(':');
      const time = new Date();
      time.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setSelectedTime(time);
    }
  }, [transaction]);

  const handleSave = async () => {
    if (!transaction) return;
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
      const updatedTransaction: NewTransaction = {
        amount: parseFloat(amount),
        description: description.trim(),
        categoryId: selectedCategoryId,
        type: transactionType,
        paymentMethod,
        date: selectedDate.toISOString().split('T')[0],
        time: `${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime.getMinutes().toString().padStart(2, '0')}`,
      };

      await updateTransaction(transaction.id, updatedTransaction);
      Alert.alert('Success', 'Transaction updated successfully');
      onTransactionUpdated();
      onClose();
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Failed to update transaction');
    }
  };

  const formatDate = (date: Date) => date.toLocaleDateString();
  const formatTime = (time: Date) => time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!transaction) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <ThemedView style={styles.modalOverlay}>
        <ThemedView style={styles.modalContent}>
          <ThemedView style={styles.modalHeader}>
            <ThemedText type="subtitle">Edit Transaction</ThemedText>
            <TouchableOpacity onPress={onClose}>
              <IconSymbol name="xmark.circle" size={24} color={textColor} />
            </TouchableOpacity>
          </ThemedView>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <TransactionTypeSelector value={transactionType} onChange={setTransactionType} />

            <AmountInput value={amount} onChange={setAmount} />

            <DescriptionInput value={description} onChange={setDescription} />

            <CategorySelector categories={categories} selectedId={selectedCategoryId} onSelect={setSelectedCategoryId} />

            <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />

            {/* Date & Time Section */}
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Date & Time</ThemedText>
              <ThemedView style={styles.dateTimeContainer}>
                <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowDatePicker(true)}>
                  <AntDesign name="calendar" size={20} color={textColor} />
                  <ThemedText style={styles.dateTimeButtonText}>{formatDate(selectedDate)}</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowTimePicker(true)}>
                  <AntDesign name="clockcircleo" size={20} color={textColor} />
                  <ThemedText style={styles.dateTimeButtonText}>{formatTime(selectedTime)}</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <FontAwesome name="save" size={24} color={backgroundColor} />
              <ThemedText style={styles.saveButtonText}>Update Transaction</ThemedText>
            </TouchableOpacity>
          </ScrollView>

          {/* Date Pickers */}
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setSelectedDate(date);
              }}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, time) => {
                setShowTimePicker(false);
                if (time) setSelectedTime(time);
              }}
            />
          )}
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

const createStyles = (backgroundColor: string, cardBackgroundColor: string, textColor: string, tintColor: string) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '95%',
      maxHeight: '90%',
      backgroundColor: backgroundColor,
      borderRadius: 16,
      padding: 20,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalBody: {
      maxHeight: 500,
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
      flexDirection: 'row',
      gap: 10,
      justifyContent: 'center',
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
      marginBottom: 20,
      flexDirection: 'row',
      gap: 10,
      justifyContent: 'center',
    },
    saveButtonText: {
      color: backgroundColor,
      fontSize: 18,
      fontWeight: '600',
    },
  });
