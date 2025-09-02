// components/transactions/TransactionItem.tsx
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Category } from '@/types/settings';
import { Transaction } from '@/types/transaction';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface TransactionItemProps {
  transaction: Transaction;
  category?: Category;
  onEdit: () => void;
  onDelete: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  category,
  onEdit,
  onDelete,
}) => {
  const cardBackgroundColor = useThemeColor({}, 'cardBackgroundColor');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const styles = createStyles(cardBackgroundColor, textColor, tintColor);

  const formatAmount = (amount: number, type: string) => {
    const sign = type === 'expense' ? '-' : '+';
    return `${sign}€${amount.toFixed(2)}`;
  };

  const formatDateTime = (date: string, time: string) => {
    const transactionDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateStr = '';
    if (transactionDate.toDateString() === today.toDateString()) {
      dateStr = 'Today';
    } else if (transactionDate.toDateString() === yesterday.toDateString()) {
      dateStr = 'Yesterday';
    } else {
      dateStr = transactionDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }

    return `${dateStr} • ${time}`;
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
        return <MaterialCommunityIcons name="credit-card" size={16} color={textColor} />;
      case 'bank_transfer':
        return <MaterialCommunityIcons name="bank-transfer" size={16} color={textColor} />;
      case 'atm_withdrawal':
        return <MaterialCommunityIcons name="projector-screen-variant-outline" size={16} color={textColor} />;
      case 'cash':
        return <MaterialCommunityIcons name="cash" size={16} color={textColor} />;
      default:
        return <MaterialCommunityIcons name="credit-card-outline" size={16} color={textColor} />;
    }
  };

  const isExpense = transaction.type === 'expense';

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.leftSection}>
        <ThemedView style={styles.categoryContainer}>
          <ThemedText style={styles.categoryIcon}>
            {category?.icon || '📁'}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.transactionInfo}>
          <ThemedText style={styles.description} numberOfLines={1}>
            {transaction.description}
          </ThemedText>
          <ThemedText style={styles.metadata}>
            {formatDateTime(transaction.date, transaction.time)}
          </ThemedText>
          <ThemedView style={styles.tagsContainer}>
            <ThemedText style={styles.categoryTag}>
              {category?.name || 'Unknown'}
            </ThemedText>
            <ThemedText style={styles.paymentTag}>
              {getPaymentMethodIcon(transaction.paymentMethod)}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.rightSection}>
        <ThemedText style={[
          styles.amount,
          isExpense ? styles.expenseAmount : styles.incomeAmount
        ]}>
          {formatAmount(transaction.amount, transaction.type)}
        </ThemedText>
        
        <ThemedView style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
            <IconSymbol name="pencil" size={16} color={textColor + '60'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
            <IconSymbol name="trash" size={16} color="#ef4444" />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const createStyles = (cardBackgroundColor: string, textColor: string, tintColor: string) =>
  StyleSheet.create({
    container: {
      backgroundColor: cardBackgroundColor,
      borderRadius: 12,
      padding: 15,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    leftSection: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    categoryContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: tintColor + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    categoryIcon: {
      fontSize: 18,
    },
    transactionInfo: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    description: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 4,
    },
    metadata: {
      fontSize: 12,
      opacity: 0.6,
      marginBottom: 6,
    },
    tagsContainer: {
      flexDirection: 'row',
      gap: 8,
      backgroundColor: 'transparent',
    },
    categoryTag: {
      fontSize: 11,
      backgroundColor: tintColor + '20',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
      overflow: 'hidden',
    },
    paymentTag: {
      fontSize: 12,
    },
    rightSection: {
      alignItems: 'flex-end',
      backgroundColor: 'transparent',
    },
    amount: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    expenseAmount: {
      color: '#ef4444',
    },
    incomeAmount: {
      color: '#22c55e',
    },
    actionsContainer: {
      flexDirection: 'row',
      gap: 8,
      backgroundColor: 'transparent',
    },
    actionButton: {
      padding: 8,
    },
  });