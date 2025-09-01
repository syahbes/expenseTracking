// database/transactionService.ts - Updated with edit support
import { NewTransaction, Transaction } from '@/types/transaction';
import { getDatabase } from './database';

export const addTransaction = async (transaction: NewTransaction): Promise<void> => {
  try {
    const db = getDatabase();
    const createdAt = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO transactions (amount, description, categoryId, type, paymentMethod, date, time, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        transaction.amount,
        transaction.description,
        transaction.categoryId,
        transaction.type,
        transaction.paymentMethod,
        transaction.date,
        transaction.time,
        createdAt,
      ]
    );
  } catch (error) {
    console.error('Failed to add transaction:', error);
    throw new Error('Failed to add transaction');
  }
};

export const updateTransaction = async (id: number, transaction: NewTransaction): Promise<void> => {
  try {
    const db = getDatabase();

    await db.runAsync(
      `UPDATE transactions 
       SET amount = ?, description = ?, categoryId = ?, type = ?, paymentMethod = ?, date = ?, time = ?
       WHERE id = ?`,
      [
        transaction.amount,
        transaction.description,
        transaction.categoryId,
        transaction.type,
        transaction.paymentMethod,
        transaction.date,
        transaction.time,
        id,
      ]
    );
  } catch (error) {
    console.error('Failed to update transaction:', error);
    throw new Error('Failed to update transaction');
  }
};

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const db = getDatabase();
    const result = (await db.getAllAsync('SELECT * FROM transactions ORDER BY date DESC, time DESC')) as Transaction[];

    return result;
  } catch (error) {
    console.error('Failed to get transactions:', error);
    return [];
  }
};

export const getTransactionsByDateRange = async (startDate: string, endDate: string): Promise<Transaction[]> => {
  try {
    const db = getDatabase();
    const result = (await db.getAllAsync('SELECT * FROM transactions WHERE date BETWEEN ? AND ? ORDER BY date DESC, time DESC', [
      startDate,
      endDate,
    ])) as Transaction[];

    return result;
  } catch (error) {
    console.error('Failed to get transactions by date range:', error);
    return [];
  }
};

export const getTransactionById = async (id: number): Promise<Transaction | null> => {
  try {
    const db = getDatabase();
    const result = (await db.getFirstAsync('SELECT * FROM transactions WHERE id = ?', [id])) as Transaction | null;
    return result;
  } catch (error) {
    console.error('Failed to get transaction:', error);
    return null;
  }
};

export const deleteTransaction = async (id: number): Promise<void> => {
  try {
    const db = getDatabase();
    await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    throw new Error('Failed to delete transaction');
  }
};
