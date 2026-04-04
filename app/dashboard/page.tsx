"use client";

import { useStore } from "@/store/useStore";
import { OverviewCharts } from "@/components/overview-charts";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { OverviewSummaryCards } from "@/components/overview-summary-cards";

export default function DashboardOverview() {
  const { transactions } = useStore();
  const { accessToken } = useSupabaseAuth();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Your financial summary at a glance.
        </p>
      </div>

      {!accessToken ? (
        <p className="text-sm text-muted-foreground">
          You are in guest mode with demo data. Sign up or log in to save your
          transactions and keep your history.
        </p>
      ) : null}

      <OverviewSummaryCards transactions={transactions} />

      <OverviewCharts />
    </div>
  );
}
