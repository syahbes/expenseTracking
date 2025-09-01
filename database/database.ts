// database/database.ts
import { DEFAULT_CATEGORIES } from '@/constants/settingsConstants';
import * as SQLite from 'expo-sqlite';

let database: SQLite.SQLiteDatabase | null = null;

export const initializeDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (database) {
    return database;
  }

  try {
    database = await SQLite.openDatabaseAsync('expenseTracker.db');

    // Create tables
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE,
        value TEXT
      );
      
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        icon TEXT NOT NULL
      );
    `);

    // Insert default categories if none exist
    const existingCategories = (await database.getAllAsync('SELECT COUNT(*) as count FROM categories')) as [{ count: number }];
    const categoryCount = existingCategories[0].count;

    if (categoryCount === 0) {
      for (const category of DEFAULT_CATEGORIES) {
        await database.runAsync('INSERT INTO categories (name, icon) VALUES (?, ?)', [category.name, category.icon]);
      }
    }

    return database;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw new Error('Failed to initialize database');
  }
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!database) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return database;
};
