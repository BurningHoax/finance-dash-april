"use client";

import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, IndianRupee } from "lucide-react";
import { OverviewCharts } from "@/components/overview-charts";
import { formatCurrencyINR } from "@/lib/utils";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";

export default function DashboardOverview() {
  const { transactions } = useStore();
  const { accessToken } = useSupabaseAuth();

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

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

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/70">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrencyINR(balance)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              +{formatCurrencyINR(totalIncome)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <ArrowDownRight className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-500">
              -{formatCurrencyINR(totalExpense)}
            </div>
          </CardContent>
        </Card>
      </div>

      <OverviewCharts />
    </div>
  );
}
