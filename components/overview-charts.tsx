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
import { Bar, BarChart, CartesianGrid, XAxis, PieChart, Pie } from "recharts"; // Removed 'Cell'

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
    }, [] as any[])
    .sort((a, b) => a.rawDate - b.rawDate);

  // 2. Process Data for Pie Chart (Expenses by Category) - UPDATED FOR MODERN RECHARTS
  const pieData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => {
      const existing = acc.find((item) => item.category === curr.category);
      if (existing) {
        existing.amount += curr.amount;
      } else {
        // Map the category to a key in our config, fallback to 'Other' if it doesn't exist
        const configKey =
          curr.category in pieChartConfig ? curr.category : "Other";

        acc.push({
          category: curr.category,
          amount: curr.amount,
          // Inject the fill color directly into the data payload using shadcn's CSS variables
          fill: `var(--color-${configKey})`,
        });
      }
      return acc;
    }, [] as any[]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Time-Based Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow</CardTitle>
          <CardDescription>Income vs Expenses over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={barChartConfig} className="h-[300px] w-full">
            <BarChart accessibilityLayer data={barData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
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
      <Card>
        <CardHeader>
          <CardTitle>Spending Breakdown</CardTitle>
          <CardDescription>Where your money is going</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={pieChartConfig} className="h-[300px] w-full">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              {/* No more deprecated <Cell> mapping here! */}
              <Pie
                data={pieData}
                dataKey="amount"
                nameKey="category"
                innerRadius={60}
                strokeWidth={5}
                paddingAngle={5}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
