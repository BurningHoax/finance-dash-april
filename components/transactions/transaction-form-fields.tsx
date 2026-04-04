"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getCategoryOptions,
  getDefaultCategory,
  type TransactionType,
} from "@/lib/transactions";

type Props = {
  formDate: string;
  formTitle: string;
  formAmount: string;
  formType: TransactionType;
  formCategory: string;
  onDateChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onTypeChange: (value: TransactionType) => void;
  onCategoryChange: (value: string) => void;
};

export function TransactionFormFields({
  formDate,
  formTitle,
  formAmount,
  formType,
  formCategory,
  onDateChange,
  onTitleChange,
  onAmountChange,
  onTypeChange,
  onCategoryChange,
}: Props) {
  const categories = getCategoryOptions(formType);

  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="transaction-date">
            Date
          </label>
          <Input
            id="transaction-date"
            type="date"
            value={formDate}
            onChange={(event) => onDateChange(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="transaction-amount">
            Amount
          </label>
          <Input
            id="transaction-amount"
            type="number"
            min="0"
            step="0.01"
            value={formAmount}
            onChange={(event) => onAmountChange(event.target.value)}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="transaction-title">
          Transaction Name
        </label>
        <Input
          id="transaction-title"
          value={formTitle}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Weekly grocery run"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Transaction Type</label>
          <Select
            value={formType}
            onValueChange={(value) => {
              const nextType = value as TransactionType;
              onTypeChange(nextType);
              onCategoryChange(getDefaultCategory(nextType));
            }}
          >
            <SelectTrigger className="transition-all hover:border-ring hover:bg-muted/60 hover:shadow-sm">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="data-open:animate-none data-closed:animate-none">
              <SelectItem
                value="income"
                className="cursor-pointer hover:bg-muted/70"
              >
                Income
              </SelectItem>
              <SelectItem
                value="expense"
                className="cursor-pointer hover:bg-muted/70"
              >
                Expense
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select value={formCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="transition-all hover:border-ring hover:bg-muted/60 hover:shadow-sm">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="data-open:animate-none data-closed:animate-none">
              {categories.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="cursor-pointer hover:bg-muted/70"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
