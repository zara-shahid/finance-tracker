export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  currency: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color: string;
  created_at: string;
}

export interface Transaction {
  id: number;
  category: number;
  category_details?: Category;
  amount: string;
  description: string;
  date: string;
  payment_method: 'cash' | 'card' | 'bank_transfer' | 'upi' | 'other';
  receipt?: string;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: number;
  category: number;
  category_details?: Category;
  amount: string;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}