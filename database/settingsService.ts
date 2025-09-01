// database/settingsService.ts
import { DEFAULT_SETTINGS } from '@/constants/settingsConstants';
import { SettingRow, Settings } from '@/types/settings';
import { getDatabase } from './database';

export const loadSettings = async (): Promise<Settings> => {
  try {
    const db = getDatabase();
    const result = await db.getAllAsync('SELECT * FROM settings') as SettingRow[];
    
    const settingsMap = result.reduce((acc: Record<string, string>, row: SettingRow) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    return {
      theme: (settingsMap.theme as 'light' | 'dark') || DEFAULT_SETTINGS.theme,
      currency: settingsMap.currency || DEFAULT_SETTINGS.currency,
    };
  } catch (error) {
    console.error('Failed to load settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export const updateSetting = async (key: string, value: string): Promise<void> => {
  try {
    const db = getDatabase();
    await db.runAsync(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      [key, value]
    );
  } catch (error) {
    console.error('Failed to update setting:', error);
    throw new Error('Failed to save setting');
  }
};

export const getSetting = async (key: string): Promise<string | null> => {
  try {
    const db = getDatabase();
    const result = await db.getFirstAsync(
      'SELECT value FROM settings WHERE key = ?',
      [key]
    ) as { value: string } | null;
    
    return result ? result.value : null;
  } catch (error) {
    console.error('Failed to get setting:', error);
    return null;
  }
};