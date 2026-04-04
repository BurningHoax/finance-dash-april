import { create } from "zustand";
import type { TransactionType } from "@/lib/transactions";

export type Transaction = {
  id: string;
  date: string;
  title: string;
  amount: number;
  category: string;
  type: TransactionType;
};

interface AppState {
  transactions: Transaction[];
  isTransactionsLoading: boolean;
  setTransactionsLoading: (isLoading: boolean) => void;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  transactions: [],
  isTransactionsLoading: true,
  setTransactionsLoading: (isLoading) =>
    set({ isTransactionsLoading: isLoading }),
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) =>
    set((state) => ({ transactions: [transaction, ...state.transactions] })),
  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter(
        (transaction) => transaction.id !== id,
      ),
    })),
}));
