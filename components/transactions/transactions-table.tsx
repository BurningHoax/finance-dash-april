"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { Transaction } from "@/store/useStore";
import { formatCurrencyINR } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
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

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

type Props = {
  transactions: Transaction[];
  accessToken: string | null;
  isLoading: boolean;
  onDeleted: (id: string) => void;
};

export function TransactionsTable({
  transactions,
  accessToken,
  isLoading,
  onDeleted,
}: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!accessToken) {
      return;
    }

    setApiError(null);
    setDeletingId(id);

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        setApiError(payload.error ?? "Failed to delete transaction.");
        return;
      }

      onDeleted(id);
    } catch {
      setApiError("Network error while deleting transaction.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card className="border-border/70">
      <CardContent className="pt-6">
        {apiError ? (
          <p className="mb-4 text-sm text-destructive">{apiError}</p>
        ) : null}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-20 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Loading transactions...
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No transactions match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell className="font-medium">
                    {transaction.title}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.category}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.type === "income" ? "secondary" : "outline"
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
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={!accessToken || deletingId === transaction.id}
                      onClick={() => void handleDelete(transaction.id)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                      <span className="sr-only">Delete transaction</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
