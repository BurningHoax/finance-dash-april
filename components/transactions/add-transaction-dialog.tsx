"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { Transaction } from "@/store/useStore";
import { createTransaction } from "@/lib/transactions-client";
import {
  getDefaultCategory,
  type NewTransactionPayload,
  type TransactionType,
} from "@/lib/transactions";
import { TransactionFormFields } from "@/components/transactions/transaction-form-fields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  accessToken: string | null;
  onCreated: (transaction: Transaction) => void;
};

export function AddTransactionDialog({ accessToken, onCreated }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [formDate, setFormDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<string>(
    getDefaultCategory("expense"),
  );
  const [formAmount, setFormAmount] = useState("");
  const [formType, setFormType] = useState<TransactionType>("expense");

  const resetForm = () => {
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormTitle("");
    setFormCategory(getDefaultCategory("expense"));
    setFormAmount("");
    setFormType("expense");
  };

  const handleCreate = async () => {
    setApiError(null);

    if (!accessToken) {
      setApiError("Please log in first.");
      return;
    }

    const amount = Number(formAmount);
    if (
      !formDate ||
      !formTitle.trim() ||
      !formCategory.trim() ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setApiError("Provide a valid name, date, category, and amount.");
      return;
    }

    const payload: NewTransactionPayload = {
      date: formDate,
      title: formTitle.trim(),
      amount,
      category: formCategory.trim(),
      type: formType,
    };

    setIsSubmitting(true);

    const result = await createTransaction(accessToken, payload);

    if (result.error) {
      setApiError(result.error);
      setIsSubmitting(false);
      return;
    }

    if (result.data) {
      onCreated(result.data);
      resetForm();
      setIsOpen(false);
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={!accessToken} className="gap-2">
          <Plus className="size-4" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Transaction</DialogTitle>
          <DialogDescription>Saved to your account.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <TransactionFormFields
            formDate={formDate}
            formTitle={formTitle}
            formAmount={formAmount}
            formType={formType}
            formCategory={formCategory}
            onDateChange={setFormDate}
            onTitleChange={setFormTitle}
            onAmountChange={setFormAmount}
            onTypeChange={setFormType}
            onCategoryChange={setFormCategory}
          />

          {apiError ? (
            <p className="text-sm text-destructive">{apiError}</p>
          ) : null}
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleCreate} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
