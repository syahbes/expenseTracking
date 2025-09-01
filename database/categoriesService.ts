// database/categoriesService.ts
import { Category } from '@/types/settings';
import { getDatabase } from './database';

export const loadCategories = async (): Promise<Category[]> => {
  try {
    const db = getDatabase();
    const result = (await db.getAllAsync('SELECT * FROM categories ORDER BY name')) as Category[];
    return result;
  } catch (error) {
    console.error('Failed to load categories:', error);
    return [];
  }
};

export const addCategory = async (name: string, icon: string): Promise<void> => {
  try {
    const db = getDatabase();
    await db.runAsync('INSERT INTO categories (name, icon) VALUES (?, ?)', [name.trim(), icon]);
  } catch (error) {
    console.error('Failed to add category:', error);
    throw new Error('Failed to add category. It might already exist.');
  }
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
  try {
    const db = getDatabase();
    await db.runAsync('DELETE FROM categories WHERE id = ?', [categoryId]);
  } catch (error) {
    console.error('Failed to delete category:', error);
    throw new Error('Failed to delete category');
  }
};

export const getCategoryById = async (id: number): Promise<Category | null> => {
  try {
    const db = getDatabase();
    const result = (await db.getFirstAsync('SELECT * FROM categories WHERE id = ?', [id])) as Category | null;

    return result;
  } catch (error) {
    console.error('Failed to get category:', error);
    return null;
  }
};
