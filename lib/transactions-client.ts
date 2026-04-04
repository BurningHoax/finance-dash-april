import type { Transaction } from "@/store/useStore";
import type { NewTransactionPayload } from "@/lib/transactions";

type TransactionApiResponse = {
  data: Transaction;
};

type TransactionApiError = {
  error?: string;
};

export async function createTransaction(
  accessToken: string,
  payload: NewTransactionPayload,
): Promise<{ data?: Transaction; error?: string }> {
  try {
    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as
      | TransactionApiResponse
      | TransactionApiError;

    if (!response.ok) {
      return {
        error:
          "error" in result
            ? (result.error ?? "Failed to create transaction.")
            : "Failed to create transaction.",
      };
    }

    if (!("data" in result)) {
      return { error: "Unexpected response from server." };
    }

    return { data: result.data };
  } catch {
    return { error: "Network error while creating transaction." };
  }
}
