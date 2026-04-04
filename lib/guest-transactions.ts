import type { Transaction } from "@/store/useStore";

function getIsoDateOffset(daysOffset: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().slice(0, 10);
}

export const GUEST_TRANSACTIONS: Transaction[] = [
  {
    id: "guest-1",
    date: getIsoDateOffset(-8),
    title: "Monthly Salary",
    amount: 85000,
    category: "Salary",
    type: "income",
  },
  {
    id: "guest-2",
    date: getIsoDateOffset(-7),
    title: "Apartment Rent",
    amount: 22000,
    category: "Rent",
    type: "expense",
  },
  {
    id: "guest-3",
    date: getIsoDateOffset(-6),
    title: "Freelance Project",
    amount: 14500,
    category: "Freelance",
    type: "income",
  },
  {
    id: "guest-4",
    date: getIsoDateOffset(-5),
    title: "Groceries",
    amount: 3200,
    category: "Groceries",
    type: "expense",
  },
  {
    id: "guest-5",
    date: getIsoDateOffset(-4),
    title: "Internet and Utilities",
    amount: 2800,
    category: "Utilities",
    type: "expense",
  },
  {
    id: "guest-6",
    date: getIsoDateOffset(-3),
    title: "Mutual Fund Dividend",
    amount: 2100,
    category: "Investment",
    type: "income",
  },
  {
    id: "guest-7",
    date: getIsoDateOffset(-2),
    title: "Weekend Dining",
    amount: 1600,
    category: "Food",
    type: "expense",
  },
  {
    id: "guest-8",
    date: getIsoDateOffset(-1),
    title: "Cab Commute",
    amount: 900,
    category: "Transport",
    type: "expense",
  },
];
