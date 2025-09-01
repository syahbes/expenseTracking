
// constants/settingsConstants.ts
import { Currency, NewCategory, Settings } from '@/types/settings';

export const DEFAULT_CATEGORIES: NewCategory[] = [
  { name: 'Food', icon: '🍔' },
  { name: 'Transportation', icon: '🚗' },
  { name: 'Fashion', icon: '👕' },
  { name: 'Health', icon: '🏥' },
  { name: 'Entertainment', icon: '🎬' },
  { name: 'Bills', icon: '📄' },
  { name: 'Shopping', icon: '🛒' },
  { name: 'Education', icon: '📚' },
];

export const CURRENCIES: Currency[] = [
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
];

export const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
  currency: 'EUR',
};