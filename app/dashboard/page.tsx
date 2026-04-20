"use client";

import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import { OverviewCharts } from "@/components/overview-charts";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { OverviewSummaryCards } from "@/components/overview-summary-cards";
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

function DashboardOverviewContent() {
  const { transactions } = useStore();
  const { accessToken } = useSupabaseAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const monthOptions = useMemo(() => {
    return getTransactionMonthOptions(
      transactions.map((transaction) => transaction.date),
    );
  }, [transactions]);

  const monthFilter = useMemo(() => {
    const requestedMonth = searchParams.get("month") ?? "all";
    const hasRequestedMonth = monthOptions.some(
      (monthOption) => monthOption.value === requestedMonth,
    );

    return requestedMonth === "all" || hasRequestedMonth
      ? requestedMonth
      : "all";
  }, [searchParams, monthOptions]);

  const visibleTransactions = useMemo(() => {
    return filterTransactionsByMonth(transactions, monthFilter);
  }, [transactions, monthFilter]);

  const handleMonthFilterChange = (value: string) => {
    if (value === "all") {
      router.replace("/dashboard");
      return;
    }

    router.replace(`/dashboard?month=${encodeURIComponent(value)}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Your financial summary at a glance.
        </p>
      </div>

      <div className="max-w-xs">
        <Select value={monthFilter} onValueChange={handleMonthFilterChange}>
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

      {!accessToken ? (
        <p className="text-sm text-muted-foreground">
          You are in guest mode with demo data. Sign up or log in to save your
          transactions and keep your history.
        </p>
      ) : null}

      <OverviewSummaryCards transactions={visibleTransactions} />

      <OverviewCharts transactions={visibleTransactions} />
    </div>
  );
}

export default function DashboardOverview() {
  return (
    <Suspense
      fallback={
        <div className="text-sm text-muted-foreground">
          Loading dashboard...
        </div>
      }
    >
      <DashboardOverviewContent />
    </Suspense>
  );
}
