"use client";

import { useStore } from "@/store/useStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
} from "recharts";
import { mapExpenseCategory } from "@/lib/transactions";

type BarDataPoint = {
  date: string;
  income: number;
  expense: number;
  rawDate: number;
};

type PieDataPoint = {
  category: string;
  amount: number;
  fill: string;
};

// Configuration for the Bar Chart colors/labels
const barChartConfig = {
  income: { label: "Income", color: "var(--chart-2)" },
  expense: { label: "Expense", color: "var(--chart-1)" },
};

// Configuration for the Pie Chart colors/labels
const pieChartConfig = {
  amount: { label: "Amount" },
  Groceries: { label: "Groceries", color: "var(--chart-1)" },
  Rent: { label: "Rent", color: "var(--chart-2)" },
  Entertainment: { label: "Entertainment", color: "var(--chart-3)" },
  Utilities: { label: "Utilities", color: "var(--chart-4)" },
  Food: { label: "Food", color: "var(--chart-5)" },
  Transport: { label: "Transport", color: "var(--chart-1)" },
  Healthcare: { label: "Healthcare", color: "var(--chart-2)" },
  Shopping: { label: "Shopping", color: "var(--chart-3)" },
  Education: { label: "Education", color: "var(--chart-4)" },
  Travel: { label: "Travel", color: "var(--chart-5)" },
  Bills: { label: "Bills", color: "var(--chart-2)" },
  Other: { label: "Other", color: "var(--chart-5)" },
};

export function OverviewCharts() {
  const { transactions } = useStore();

  // 1. Process Data for Bar Chart (Income vs Expense by Date)
  const barData = transactions
    .reduce((acc, curr) => {
      const dateObj = new Date(curr.date);
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const existing = acc.find((item) => item.date === formattedDate);
      if (existing) {
        if (curr.type === "income") existing.income += curr.amount;
        else existing.expense += curr.amount;
      } else {
        acc.push({
          date: formattedDate,
          income: curr.type === "income" ? curr.amount : 0,
          expense: curr.type === "expense" ? curr.amount : 0,
          rawDate: dateObj.getTime(),
        });
      }
      return acc;
    }, [] as BarDataPoint[])
    .sort((a, b) => a.rawDate - b.rawDate);

  // 2. Process Data for Pie Chart (Expenses by Category)
  const pieData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => {
      const mappedCategory = mapExpenseCategory(curr.category);

      const existing = acc.find(
        (item) => item.category === mappedCategory.label,
      );

      if (existing) {
        existing.amount += curr.amount;
      } else {
        acc.push({
          category: mappedCategory.label,
          amount: curr.amount,
          fill: mappedCategory.color,
        });
      }
      return acc;
    }, [] as PieDataPoint[])
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Time-Based Visualization */}
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Cash Flow</CardTitle>
          <CardDescription>Income vs Expenses over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={barChartConfig} className="h-75 w-full">
            <BarChart accessibilityLayer data={barData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  `Rs ${Number(value).toLocaleString("en-IN")}`
                }
                width={88}
              />
              <ChartTooltip
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="income" fill="var(--color-income)" radius={4} />
              <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Categorical Visualization */}
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Spending Breakdown</CardTitle>
          <CardDescription>Where your money is going</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={pieChartConfig} className="h-75 w-full">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={pieData}
                dataKey="amount"
                nameKey="category"
                innerRadius={60}
                strokeWidth={5}
                paddingAngle={5}
              />
              <ChartLegend
                content={<ChartLegendContent nameKey="category" />}
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
