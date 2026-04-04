export type TransactionType = "income" | "expense";

export type NewTransactionPayload = {
  date: string;
  title: string;
  amount: number;
  category: string;
  type: TransactionType;
};

export const EXPENSE_CATEGORIES = [
  "Groceries",
  "Rent",
  "Utilities",
  "Entertainment",
  "Transport",
  "Food",
  "Healthcare",
  "Shopping",
  "Education",
  "Travel",
  "Bills",
  "Other",
] as const;

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Bonus",
  "Refund",
  "Other",
] as const;

export const EXPENSE_CATEGORY_STYLE_MAP: Record<
  string,
  { label: string; color: string }
> = {
  groceries: { label: "Groceries", color: "var(--chart-1)" },
  rent: { label: "Rent", color: "var(--chart-2)" },
  entertainment: { label: "Entertainment", color: "var(--chart-3)" },
  utilities: { label: "Utilities", color: "var(--chart-4)" },
  transport: { label: "Transport", color: "var(--chart-1)" },
  food: { label: "Food", color: "var(--chart-5)" },
  healthcare: { label: "Healthcare", color: "var(--chart-2)" },
  shopping: { label: "Shopping", color: "var(--chart-3)" },
  education: { label: "Education", color: "var(--chart-4)" },
  travel: { label: "Travel", color: "var(--chart-4)" },
  bills: { label: "Bills", color: "var(--chart-2)" },
  other: { label: "Other", color: "var(--chart-5)" },
};

export function isTransactionType(value: unknown): value is TransactionType {
  return value === "income" || value === "expense";
}

export function getDefaultCategory(type: TransactionType): string {
  return type === "expense" ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0];
}

export function getCategoryOptions(type: TransactionType): readonly string[] {
  return type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
}

export function mapExpenseCategory(category: string): {
  label: string;
  color: string;
} {
  return (
    EXPENSE_CATEGORY_STYLE_MAP[category.trim().toLowerCase()] ?? {
      label: "Other",
      color: "var(--chart-5)",
    }
  );
}
