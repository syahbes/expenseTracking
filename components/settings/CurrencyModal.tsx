// components/settings/CurrencyModal.tsx
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CURRENCIES } from '@/constants/settingsConstants';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Currency } from '@/types/settings';
import React from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';

interface CurrencyModalProps {
  visible: boolean;
  selectedCurrency: string;
  onSelectCurrency: (currencyCode: string) => void;
  onClose: () => void;
}

export const CurrencyModal: React.FC<CurrencyModalProps> = ({ visible, selectedCurrency, onSelectCurrency, onClose }) => {
  // Theme-aware colors
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'cardBackgroundColor');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const styles = createStyles(backgroundColor, cardBackgroundColor, textColor, tintColor);

  const renderCurrencyItem = ({ item }: { item: Currency }) => (
    <TouchableOpacity
      style={[styles.currencyItem, selectedCurrency === item.code && styles.selectedCurrencyItem]}
      onPress={() => onSelectCurrency(item.code)}
    >
      <ThemedText style={styles.currencySymbol}>{item.symbol}</ThemedText>
      <ThemedView style={styles.currencyInfo}>
        <ThemedText style={styles.currencyCode}>{item.code}</ThemedText>
        <ThemedText style={styles.currencyName}>{item.name}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <ThemedView style={styles.modalOverlay}>
        <ThemedView style={styles.modalContent}>
          <ThemedView style={styles.modalHeader}>
            <ThemedText type="subtitle">Select Currency</ThemedText>
            <TouchableOpacity onPress={onClose}>
              <ThemedText style={styles.closeButton}>✕</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <FlatList data={CURRENCIES} keyExtractor={item => item.code} renderItem={renderCurrencyItem} style={styles.modalList} />
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

const createStyles = (backgroundColor: string, cardBackgroundColor: string, tintColor: string, text: string) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '90%',
      maxHeight: '80%',
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
    closeButton: {
      fontSize: 24,
      fontWeight: 'bold',
      opacity: 0.7,
    },
    modalList: {
      maxHeight: 400,
    },
    currencyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 12,
      marginBottom: 8,
      backgroundColor: cardBackgroundColor,
    },
    selectedCurrencyItem: {
      backgroundColor: tintColor + '40', // Semi-transparent tint color for selection
    },
    currencySymbol: {
      fontSize: 24,
      marginRight: 15,
      minWidth: 30,
    },
    currencyInfo: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    currencyCode: {
      fontSize: 16,
      fontWeight: '600',
    },
    currencyName: {
      fontSize: 14,
      opacity: 0.7,
      marginTop: 2,
    },
  });
