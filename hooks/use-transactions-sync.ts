"use client";

import { useEffect } from "react";
import { useStore, type Transaction } from "@/store/useStore";
import { GUEST_TRANSACTIONS } from "@/lib/guest-transactions";

type SyncInput = {
  accessToken: string | null;
  isAuthLoading: boolean;
};

export function useTransactionsSync({ accessToken, isAuthLoading }: SyncInput) {
  const { setTransactions, setTransactionsLoading } = useStore();

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    const fetchTransactions = async () => {
      if (!accessToken) {
        setTransactions(GUEST_TRANSACTIONS);
        setTransactionsLoading(false);
        return;
      }

      setTransactionsLoading(true);

      const response = await fetch("/api/transactions", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        setTransactionsLoading(false);
        return;
      }

      const payload = (await response.json()) as { data?: Transaction[] };
      if (payload.data) {
        setTransactions(payload.data);
      }

      setTransactionsLoading(false);
    };

    void fetchTransactions();
  }, [accessToken, isAuthLoading, setTransactions, setTransactionsLoading]);
}
