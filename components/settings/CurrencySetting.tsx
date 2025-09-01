// components/settings/CurrencySetting.tsx
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CURRENCIES } from '@/constants/settingsConstants';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface CurrencySettingProps {
  selectedCurrency: string;
  onCurrencyPress: () => void;
}

export const CurrencySetting: React.FC<CurrencySettingProps> = ({
  selectedCurrency,
  onCurrencyPress,
}) => {
  const cardBackgroundColor = useThemeColor({}, "cardBackgroundColor");
  const styles = createStyles(cardBackgroundColor);

  const currentCurrency = CURRENCIES.find(c => c.code === selectedCurrency);

  return (
    <ThemedView style={styles.settingSection}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>Currency</ThemedText>
      <TouchableOpacity style={styles.settingItem} onPress={onCurrencyPress}>
        <ThemedView style={styles.settingInfo}>
          <ThemedText style={styles.settingIcon}>💱</ThemedText>
          <ThemedText style={styles.settingLabel}>Currency</ThemedText>
        </ThemedView>
        <ThemedText style={styles.settingValue}>
          {currentCurrency?.symbol} {selectedCurrency}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const createStyles = (cardBackgroundColor: string) => StyleSheet.create({
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
    backgroundColor: cardBackgroundColor,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
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