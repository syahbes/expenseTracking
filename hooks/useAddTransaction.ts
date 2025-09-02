// hooks/useAddTransaction.ts - Fixed version
import { createStyles } from '@/components/addTransaction/styles';
import { loadCategories } from '@/database/categoriesService';
import { initializeDatabase } from '@/database/database';
import { addTransaction } from '@/database/transactionService';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Category } from '@/types/settings';
import { NewTransaction, PaymentMethod, TransactionType } from '@/types/transaction';
import { parseTransactionText } from '@/utils/transactionParser';
import Clipboard from '@react-native-clipboard/clipboard';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function useAddTransaction() {
  const [rawText, setRawText] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
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
    const init = async () => {
      try {
        await initializeDatabase();
        const categoriesData = await loadCategories();
        setCategories(categoriesData);
        if (categoriesData.length > 0) {
          setSelectedCategoryId(categoriesData[0].id);
        }
      } catch (error) {
        console.error('Init error:', error);
        Alert.alert('Error', 'Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardContent = await Clipboard.getString();
      if (clipboardContent) {
        setRawText(clipboardContent);
        handleParseText(clipboardContent);
      } else {
        Alert.alert('Info', 'Clipboard is empty');
      }
    } catch {
      Alert.alert('Error', 'Failed to read from clipboard');
    }
  };

  const handleParseText = (text: string) => {
    setRawText(text);
    if (!text.trim()) return;

    const parsed = parseTransactionText(text);

    if (parsed.amount) setAmount(parsed.amount.toString());
    if (parsed.description) setDescription(parsed.description);

    if (parsed.time) {
      const [hours, minutes] = parsed.time.split(':');
      const newTime = new Date();
      newTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setSelectedTime(newTime);
    }
  };

  const handleSaveTransaction = async () => {
    if (!amount || parseFloat(amount) <= 0) return Alert.alert('Error', 'Please enter a valid amount');
    if (!description.trim()) return Alert.alert('Error', 'Please enter a description');
    if (!selectedCategoryId) return Alert.alert('Error', 'Please select a category');

    try {
      const newTransaction: NewTransaction = {
        amount: parseFloat(amount),
        description: description.trim(),
        categoryId: selectedCategoryId,
        type: transactionType,
        paymentMethod,
        date: selectedDate.toISOString().split('T')[0],
        time: `${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime.getMinutes().toString().padStart(2, '0')}`,
      };

      await addTransaction(newTransaction);

      // Show success message and clear form
      Alert.alert('Success', `${transactionType === 'expense' ? 'Expense' : 'Income'} added successfully!`, [
        {
          text: 'OK',
          onPress: clearForm,
        },
      ]);

      // console.log('Transaction saved successfully:', newTransaction); // Debug log
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save transaction. Please try again.');
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
    if (categories.length > 0) setSelectedCategoryId(categories[0].id);
  };

  return {
    state: {
      rawText,
      amount,
      description,
      selectedCategoryId,
      transactionType,
      paymentMethod,
      selectedDate,
      selectedTime,
      isManualMode,
    },
    handlers: {
      setAmount,
      setDescription,
      setSelectedCategoryId,
      setTransactionType,
      setPaymentMethod,
      setSelectedDate,
      setSelectedTime,
      handleParseText,
      handlePasteFromClipboard,
      handleSaveTransaction,
      toggleMode: () => setIsManualMode((m) => !m),
    },
    categories,
    isLoading,
    styles,
  };
}
