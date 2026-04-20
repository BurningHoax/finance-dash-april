"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { ArrowDownRight, ArrowUpRight, IndianRupee } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrencyINR } from "@/lib/utils";
import type { Transaction } from "@/store/useStore";

type Props = {
  transactions: Transaction[];
  incomeHref?: string;
  expenseHref?: string;
};

export function OverviewSummaryCards({
  transactions,
  incomeHref,
  expenseHref,
}: Props) {
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const expense = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    };
  }, [transactions]);

  const renderMetricCard = ({
    title,
    value,
    icon,
    cardClassName,
    valueClassName,
    href,
  }: {
    title: string;
    value: string;
    icon: ReactNode;
    cardClassName: string;
    valueClassName?: string;
    href?: string;
  }) => {
    const card = (
      <Card className={cardClassName}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold", valueClassName)}>
            {value}
          </div>
        </CardContent>
      </Card>
    );

    if (!href) {
      return card;
    }

    return (
      <Link href={href} className="block">
        {card}
      </Link>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {renderMetricCard({
        title: "Total Balance",
        value: formatCurrencyINR(balance),
        icon: <IndianRupee className="h-4 w-4 text-muted-foreground" />,
        cardClassName:
          "border-border/70 transition-all hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.25),0_20px_40px_-28px_hsl(var(--primary)/0.8)]",
      })}

      {renderMetricCard({
        title: "Total Income",
        value: `+${formatCurrencyINR(totalIncome)}`,
        icon: <ArrowUpRight className="h-4 w-4 text-emerald-500" />,
        cardClassName:
          "border-border/70 transition-all hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_hsl(142_76%_46%/0.28),0_20px_40px_-28px_hsl(142_76%_46%/0.75)]",
        valueClassName: "text-emerald-500",
        href: incomeHref,
      })}

      {renderMetricCard({
        title: "Total Expenses",
        value: `-${formatCurrencyINR(totalExpense)}`,
        icon: <ArrowDownRight className="h-4 w-4 text-rose-500" />,
        cardClassName:
          "border-border/70 transition-all hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_hsl(346_87%_43%/0.28),0_20px_40px_-28px_hsl(346_87%_43%/0.75)]",
        valueClassName: "text-rose-500",
        href: expenseHref,
      })}
    </div>
  );
}
