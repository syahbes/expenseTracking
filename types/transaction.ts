// types/transaction.ts

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  categoryId: number;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  date: string; // ISO string
  time: string; // HH:MM format
  createdAt: string; // ISO string
}

export interface NewTransaction {
  amount: number;
  description: string;
  categoryId: number;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  date: string; // ISO string
  time: string; // HH:MM format
}

export type TransactionType = 'expense' | 'income';

export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'atm_withdrawal' | 'cash';

export interface ParsedTransaction {
  amount?: number;
  description?: string;
  time?: string;
}

// Database result type
export interface TransactionRow {
  id: number;
  amount: number;
  description: string;
  categoryId: number;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  date: string;
  time: string;
  createdAt: string;
}
