"use client";

import { useMemo, useState } from "react";
import { useStore, type Transaction } from "@/store/useStore";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog";
import { TransactionsFilters } from "@/components/transactions/transactions-filters";
import { TransactionsTable } from "@/components/transactions/transactions-table";

type TransactionTypeFilter = "all" | Transaction["type"];
type SortOption = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

export default function TransactionsPage() {
  const {
    transactions,
    addTransaction,
    removeTransaction,
    isTransactionsLoading,
  } = useStore();
  const { accessToken } = useSupabaseAuth();

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const categories = useMemo(() => {
    return Array.from(
      new Set(transactions.map((transaction) => transaction.category)),
    ).sort((a, b) => a.localeCompare(b));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = transactions.filter((transaction) => {
      const matchesType =
        typeFilter === "all" ? true : transaction.type === typeFilter;

      const matchesCategory =
        categoryFilter === "all"
          ? true
          : transaction.category === categoryFilter;

      const matchesQuery =
        normalizedQuery.length === 0
          ? true
          : transaction.title.toLowerCase().includes(normalizedQuery) ||
            transaction.category.toLowerCase().includes(normalizedQuery) ||
            transaction.id.toLowerCase().includes(normalizedQuery);

      return matchesType && matchesCategory && matchesQuery;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === "date-asc") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === "amount-desc") {
        return b.amount - a.amount;
      }
      if (sortBy === "amount-asc") {
        return a.amount - b.amount;
      }
      return a.amount - b.amount;
    });
  }, [transactions, query, typeFilter, categoryFilter, sortBy]);

  const resetFilters = () => {
    setQuery("");
    setTypeFilter("all");
    setCategoryFilter("all");
    setSortBy("date-desc");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Search, filter, sort, and manage your recent financial activity.
          </p>
        </div>

        <AddTransactionDialog
          accessToken={accessToken}
          onCreated={addTransaction}
        />
      </div>

      <TransactionsFilters
        query={query}
        typeFilter={typeFilter}
        categoryFilter={categoryFilter}
        categories={categories}
        sortBy={sortBy}
        resultCount={filteredTransactions.length}
        onQueryChange={setQuery}
        onTypeFilterChange={setTypeFilter}
        onCategoryFilterChange={setCategoryFilter}
        onSortChange={setSortBy}
        onReset={resetFilters}
      />

      {!accessToken ? (
        <p className="text-sm text-muted-foreground">
          Guest mode is active. You can add and delete transactions locally, but
          data will reset after refresh. Sign up or log in to save records.
        </p>
      ) : null}

      <TransactionsTable
        transactions={filteredTransactions}
        accessToken={accessToken}
        isLoading={isTransactionsLoading}
        onDeleted={removeTransaction}
      />
    </div>
  );
}
