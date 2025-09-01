// components/settings/CategoryModal.tsx
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useState } from 'react';
import { Modal, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

interface CategoryModalProps {
  visible: boolean;
  onAddCategory: (name: string, icon: string) => void;
  onClose: () => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({ visible, onAddCategory, onClose }) => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('📁');

  // Theme-aware colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const handleAddCategory = () => {
    if (categoryName.trim()) {
      onAddCategory(categoryName.trim(), categoryIcon);
      setCategoryName('');
      setCategoryIcon('📁');
      onClose();
    }
  };

  const handleClose = () => {
    setCategoryName('');
    setCategoryIcon('📁');
    onClose();
  };

  const styles = createStyles(backgroundColor, textColor, tintColor);

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={handleClose}>
      <ThemedView style={styles.modalOverlay}>
        <ThemedView style={styles.modalContent}>
          <ThemedView style={styles.modalHeader}>
            <ThemedText type="subtitle">Add Category</ThemedText>
            <TouchableOpacity onPress={handleClose}>
              <ThemedText style={styles.closeButton}>✕</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>Category Name</ThemedText>
            <TextInput
              style={styles.textInput}
              value={categoryName}
              onChangeText={setCategoryName}
              placeholder="Enter category name"
              placeholderTextColor={styles.placeholderColor.color}
              maxLength={50}
            />

            <ThemedText style={styles.inputLabel}>Icon (Emoji)</ThemedText>
            <TextInput
              style={styles.textInput}
              value={categoryIcon}
              onChangeText={setCategoryIcon}
              placeholder="📁"
              placeholderTextColor={styles.placeholderColor.color}
              maxLength={2}
            />

            <TouchableOpacity
              style={[styles.saveButton, !categoryName.trim() && styles.saveButtonDisabled]}
              onPress={handleAddCategory}
              disabled={!categoryName.trim()}
            >
              <ThemedText style={styles.saveButtonText}>Add Category</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

const createStyles = (backgroundColor: string, textColor: string, tintColor: string) =>
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
    inputContainer: {
      gap: 15,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 5,
    },
    textInput: {
      borderWidth: 1,
      borderColor: textColor + '30', // Add transparency to text color for border
      borderRadius: 8,
      paddingHorizontal: 15,
      paddingVertical: 12,
      fontSize: 16,
      backgroundColor: backgroundColor,
      color: textColor,
    },
    placeholderColor: {
      color: textColor + '60', // Semi-transparent text color for placeholder
    },
    saveButton: {
      backgroundColor: tintColor,
      borderRadius: 8,
      paddingVertical: 15,
      alignItems: 'center',
      marginTop: 10,
    },
    saveButtonDisabled: {
      backgroundColor: textColor + '30', // Semi-transparent text color for disabled state
    },
    saveButtonText: {
      color: backgroundColor, // Use background color for contrast
      fontSize: 16,
      fontWeight: '600',
    },
  });
