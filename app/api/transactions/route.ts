import { NextResponse } from "next/server";
import { getServiceRoleClient, supabase } from "@/lib/supabase";

type TransactionType = "income" | "expense";

type TransactionRow = {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
  created_at: string;
};

type NewTransactionPayload = {
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
};

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isValidTransactionType(value: unknown): value is TransactionType {
  return value === "income" || value === "expense";
}

function validatePayload(payload: unknown): {
  valid: boolean;
  data?: NewTransactionPayload;
  message?: string;
} {
  if (!payload || typeof payload !== "object") {
    return { valid: false, message: "Invalid payload" };
  }

  const candidate = payload as Record<string, unknown>;

  const date = typeof candidate.date === "string" ? candidate.date : "";
  const amount = typeof candidate.amount === "number" ? candidate.amount : NaN;
  const category =
    typeof candidate.category === "string" ? candidate.category.trim() : "";
  const type = candidate.type;

  if (!isValidDate(date)) {
    return { valid: false, message: "date must be in YYYY-MM-DD format" };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return { valid: false, message: "amount must be a positive number" };
  }

  if (!category) {
    return { valid: false, message: "category is required" };
  }

  if (!isValidTransactionType(type)) {
    return { valid: false, message: "type must be income or expense" };
  }

  return {
    valid: true,
    data: {
      date,
      amount,
      category,
      type,
    },
  };
}

export async function GET() {
  const { data, error } = await supabase
    .from("transactions")
    .select("id, date, amount, category, type, created_at")
    .order("date", { ascending: false })
    .returns<TransactionRow[]>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}

export async function POST(request: Request) {
  const roleHeader = request.headers.get("x-role");
  if (roleHeader !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: admin role required" },
      { status: 403 },
    );
  }

  const payload = await request.json();
  const validation = validatePayload(payload);

  if (!validation.valid || !validation.data) {
    return NextResponse.json(
      { error: validation.message ?? "Invalid transaction payload" },
      { status: 400 },
    );
  }

  const serviceRoleClient = getServiceRoleClient();
  const { data, error } = await serviceRoleClient
    .from("transactions")
    .insert(validation.data)
    .select("id, date, amount, category, type, created_at")
    .single<TransactionRow>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
