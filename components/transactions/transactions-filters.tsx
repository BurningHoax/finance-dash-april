"use client";

import { ArrowDownUp, Search, X } from "lucide-react";
import type { Transaction } from "@/store/useStore";
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

type TransactionTypeFilter = "all" | Transaction["type"];
type SortOption = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

type Props = {
  query: string;
  typeFilter: TransactionTypeFilter;
  categoryFilter: string;
  categories: string[];
  sortBy: SortOption;
  resultCount: number;
  onQueryChange: (value: string) => void;
  onTypeFilterChange: (value: TransactionTypeFilter) => void;
  onCategoryFilterChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onReset: () => void;
};

export function TransactionsFilters({
  query,
  typeFilter,
  categoryFilter,
  categories,
  sortBy,
  resultCount,
  onQueryChange,
  onTypeFilterChange,
  onCategoryFilterChange,
  onSortChange,
  onReset,
}: Props) {
  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle className="text-base">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_170px_180px_200px_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search by category or ID"
              className="pl-8"
            />
          </div>

          <Select
            value={typeFilter}
            onValueChange={(value) =>
              onTypeFilterChange(value as TransactionTypeFilter)
            }
          >
            <SelectTrigger className="w-full transition-colors hover:border-ring/60 hover:bg-muted/40">
              <SelectValue placeholder="Filter type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
            <SelectTrigger className="w-full transition-colors hover:border-ring/60 hover:bg-muted/40">
              <SelectValue placeholder="Filter category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value) => onSortChange(value as SortOption)}
          >
            <SelectTrigger className="w-full transition-colors hover:border-ring/60 hover:bg-muted/40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Latest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="amount-desc">Amount High to Low</SelectItem>
              <SelectItem value="amount-asc">Amount Low to High</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={onReset} className="gap-2">
            <X className="size-4" />
            Reset
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="secondary">
            {resultCount} result
            {resultCount === 1 ? "" : "s"}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowDownUp className="size-3.5" />
            Sorted: {sortBy.replace("-", " ")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
