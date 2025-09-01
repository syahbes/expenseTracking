// types/settings.ts

export interface Category {
  id: number;
  name: string;
  icon: string; // Made required - categories should always have icons
}

export interface Settings {
  theme: 'light' | 'dark';
  currency: string;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export type Theme = 'light' | 'dark';

// Database result types
export interface SettingRow {
  id: number;
  key: string;
  value: string;
}

export interface CategoryRow {
  id: number;
  name: string;
  icon: string;
}

// For creating new categories
export interface NewCategory {
  name: string;
  icon: string;
}