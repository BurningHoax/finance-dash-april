"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewSummaryCards } from "@/components/overview-summary-cards";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useStore } from "@/store/useStore";
import { cn, formatCurrencyINR } from "@/lib/utils";
import {
  filterTransactionsByMonth,
  getTransactionMonthOptions,
} from "@/lib/transactions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AuthenticatedHomePage() {
  const { user, isLoading } = useSupabaseAuth();
  const { transactions } = useStore();
  const router = useRouter();
  const [monthFilter, setMonthFilter] = useState("all");

  const monthOptions = useMemo(() => {
    return getTransactionMonthOptions(
      transactions.map((transaction) => transaction.date),
    );
  }, [transactions]);

  const createTransactionsFilterHref = (type: "income" | "expense") => {
    const params = new URLSearchParams({ type });
    if (monthFilter !== "all") {
      params.set("month", monthFilter);
    }
    return `/transactions?${params.toString()}`;
  };

  const monthlySummaryCards = useMemo(() => {
    return monthOptions.slice(0, 6).map((monthOption) => {
      const monthlyTransactions = filterTransactionsByMonth(
        transactions,
        monthOption.value,
      );

      const totals = monthlyTransactions.reduce(
        (acc, transaction) => {
          if (transaction.type === "income") {
            acc.income += transaction.amount;
          } else {
            acc.expense += transaction.amount;
          }

          return acc;
        },
        { income: 0, expense: 0 },
      );

      return {
        monthKey: monthOption.value,
        monthLabel: monthOption.label,
        income: totals.income,
        expense: totals.expense,
        balance: totals.income - totals.expense,
      };
    });
  }, [transactions, monthOptions]);

  const visibleTransactions = useMemo(() => {
    return filterTransactionsByMonth(transactions, monthFilter);
  }, [transactions, monthFilter]);

  const selectedDashboardHref =
    monthFilter === "all"
      ? "/dashboard"
      : `/dashboard?month=${encodeURIComponent(monthFilter)}`;

  const incomeTransactionsHref = createTransactionsFilterHref("income");
  const expenseTransactionsHref = createTransactionsFilterHref("expense");

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return null;
  }

  const displayName = user.email?.split("@")[0] ?? "there";

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {displayName}.
        </h1>
        <p className="text-muted-foreground">
          Thanks for choosing FinDash! Hope you like using our tool.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link href="/transactions">
          <Button
            variant="secondary"
            size="sm"
            className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            Go to Transactions
          </Button>
        </Link>
        <Link href={selectedDashboardHref}>
          <Button
            variant="ghost"
            size="sm"
            className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
          >
            Open Dashboard for Selected Month
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Monthly Snapshot
        </h2>
        <div className="max-w-xs">
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {monthOptions.map((monthOption) => (
                <SelectItem key={monthOption.value} value={monthOption.value}>
                  {monthOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {monthlySummaryCards.length === 0 ? (
          <Card className="border-border/70">
            <CardContent className="pt-6 text-sm text-muted-foreground">
              Add transactions to see monthly income and expense cards here.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {monthlySummaryCards.map((monthSummary) => (
              <Card
                key={monthSummary.monthLabel}
                className={cn(
                  "border-border/70 cursor-pointer transition-all",
                  monthFilter === monthSummary.monthKey
                    ? "ring-2 ring-primary/40 shadow-[0_0_0_1px_hsl(var(--primary)/0.28),0_20px_40px_-28px_hsl(var(--primary)/0.7)]"
                    : "hover:-translate-y-0.5",
                )}
                onClick={() => {
                  router.push(
                    `/dashboard?month=${encodeURIComponent(monthSummary.monthKey)}`,
                  );
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(
                      `/dashboard?month=${encodeURIComponent(monthSummary.monthKey)}`,
                    );
                  }
                }}
              >
                <CardHeader className="pb-2">
                  <CardTitle>{monthSummary.monthLabel}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    Income:{" "}
                    <span className="font-medium text-emerald-600">
                      {formatCurrencyINR(monthSummary.income)}
                    </span>
                  </p>
                  <p className="text-muted-foreground">
                    Expense:{" "}
                    <span className="font-medium text-rose-600">
                      {formatCurrencyINR(monthSummary.expense)}
                    </span>
                  </p>
                  <p className="font-medium">
                    Balance: {formatCurrencyINR(monthSummary.balance)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <OverviewSummaryCards
        transactions={visibleTransactions}
        incomeHref={incomeTransactionsHref}
        expenseHref={expenseTransactionsHref}
      />
    </div>
  );
}
