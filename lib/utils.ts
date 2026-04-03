import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyINR(amount: number) {
  return inrFormatter.format(amount);
}
