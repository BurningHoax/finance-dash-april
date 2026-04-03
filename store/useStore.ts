import { create } from 'zustand';

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
};

interface AppState {
  role: 'viewer' | 'admin';
  setRole: (role: 'viewer' | 'admin') => void;
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
}

// Pre-loadeded this mock data for instant UI testing, change krna h inko
const initialTransactions: Transaction[] = [
  { id: '1', date: '2026-04-01', amount: 5000, category: 'Salary', type: 'income' },
  { id: '2', date: '2026-04-02', amount: 150, category: 'Groceries', type: 'expense' },
  { id: '3', date: '2026-04-03', amount: 1200, category: 'Rent', type: 'expense' },
  { id: '4', date: '2026-04-04', amount: 80, category: 'Entertainment', type: 'expense' },
  { id: '5', date: '2026-04-05', amount: 300, category: 'Utilities', type: 'expense' },
];

export const useStore = create<AppState>((set) => ({
  role: 'viewer', // Default role
  setRole: (role) => set({ role }),
  transactions: initialTransactions,
  addTransaction: (transaction) => 
    set((state) => ({ transactions: [transaction, ...state.transactions] })),
}));