"use client";

import { ArrowDownRight, ArrowUpRight, IndianRupee } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyINR } from "@/lib/utils";
import type { Transaction } from "@/store/useStore";

type Props = {
  transactions: Transaction[];
};

export function OverviewSummaryCards({ transactions }: Props) {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-border/70 transition-all hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.25),0_20px_40px_-28px_hsl(var(--primary)/0.8)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrencyINR(balance)}</div>
        </CardContent>
      </Card>

      <Card className="border-border/70 transition-all hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_hsl(142_76%_46%/0.28),0_20px_40px_-28px_hsl(142_76%_46%/0.75)]">
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

      <Card className="border-border/70 transition-all hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_hsl(346_87%_43%/0.28),0_20px_40px_-28px_hsl(346_87%_43%/0.75)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <ArrowDownRight className="h-4 w-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-500">
            -{formatCurrencyINR(totalExpense)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
