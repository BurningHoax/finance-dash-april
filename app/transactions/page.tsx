"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, Search, X } from "lucide-react";
import { useStore, type Transaction } from "@/store/useStore";
import { formatCurrencyINR } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TransactionTypeFilter = "all" | Transaction["type"];
type SortOption = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function TransactionsPage() {
  const { transactions } = useStore();

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  const filteredTransactions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = transactions.filter((transaction) => {
      const matchesType =
        typeFilter === "all" ? true : transaction.type === typeFilter;

      const matchesQuery =
        normalizedQuery.length === 0
          ? true
          : transaction.category.toLowerCase().includes(normalizedQuery) ||
            transaction.id.toLowerCase().includes(normalizedQuery);

      return matchesType && matchesQuery;
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
      return a.amount - b.amount;
    });
  }, [transactions, query, typeFilter, sortBy]);

  const resetFilters = () => {
    setQuery("");
    setTypeFilter("all");
    setSortBy("date-desc");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">
          Search, filter, and sort your recent financial activity.
        </p>
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_200px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by category or ID"
                className="pl-8"
              />
            </div>

            <Select
              value={typeFilter}
              onValueChange={(value) =>
                setTypeFilter(value as TransactionTypeFilter)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Latest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="amount-desc">Amount High to Low</SelectItem>
                <SelectItem value="amount-asc">Amount Low to High</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={resetFilters} className="gap-2">
              <X className="size-4" />
              Reset
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              {filteredTransactions.length} result
              {filteredTransactions.length === 1 ? "" : "s"}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowDownUp className="size-3.5" />
              Sorted: {sortBy.replace("-", " ")}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No transactions match the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell className="font-medium">
                      {transaction.category}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.type === "income"
                            ? "secondary"
                            : "outline"
                        }
                        className={
                          transaction.type === "income"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }
                      >
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right font-semibold ${
                        transaction.type === "income"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrencyINR(transaction.amount)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
