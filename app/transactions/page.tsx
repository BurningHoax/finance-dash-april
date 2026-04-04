"use client";

import { useMemo, useState } from "react";
import { useStore, type Transaction } from "@/store/useStore";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog";
import { TransactionsFilters } from "@/components/transactions/transactions-filters";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

type TransactionTypeFilter = "all" | Transaction["type"];
type SortOption = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

export default function TransactionsPage() {
  const {
    transactions,
    addTransaction,
    removeTransaction,
    isTransactionsLoading,
  } = useStore();
  const { accessToken, user } = useSupabaseAuth();
  const [dismissedTipForUser, setDismissedTipForUser] = useState<string | null>(
    null,
  );

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

  const hasSeenTipInStorage =
    !!user &&
    typeof window !== "undefined" &&
    window.localStorage.getItem(`findash-transactions-tip-seen-${user.id}`) ===
      "true";

  const showOnboardingTip =
    !!user &&
    !!accessToken &&
    !hasSeenTipInStorage &&
    dismissedTipForUser !== user.id;

  const dismissOnboardingTip = () => {
    if (user) {
      const storageKey = `findash-transactions-tip-seen-${user.id}`;
      window.localStorage.setItem(storageKey, "true");
      setDismissedTipForUser(user.id);
    }
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

      {showOnboardingTip ? (
        <Card className="border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_0_1px_hsl(142_76%_46%/0.25),0_20px_40px_-28px_hsl(142_76%_46%/0.75)]">
          <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                <Sparkles className="size-4" />
                Quick tip for your first visit
              </p>
              <p className="text-sm text-muted-foreground">
                Use filters to narrow results fast, then add transactions from
                the top-right button. You can dismiss this guide anytime.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={dismissOnboardingTip}
              >
                Got it
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={dismissOnboardingTip}
              >
                Skip
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

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
