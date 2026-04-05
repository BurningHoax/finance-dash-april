import { NextResponse } from "next/server";
import { getUserScopedClient } from "@/lib/supabase";
import {
  isTransactionType,
  type NewTransactionPayload,
  type TransactionType,
} from "@/lib/transactions";

type TransactionRow = {
  id: string;
  date: string;
  title: string;
  amount: number;
  category: string;
  type: TransactionType;
  user_id: string | null;
  created_at: string;
};

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
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
  const title =
    typeof candidate.title === "string" ? candidate.title.trim() : "";
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

  if (!title) {
    return { valid: false, message: "title is required" };
  }

  if (!category) {
    return { valid: false, message: "category is required" };
  }

  if (!isTransactionType(type)) {
    return { valid: false, message: "type must be income or expense" };
  }

  return {
    valid: true,
    data: {
      date,
      title,
      amount,
      category,
      type,
    },
  };
}

function getAccessToken(request: Request): string | null {
  const authorization = request.headers.get("authorization");
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
}

async function authenticateRequest(request: Request) {
  const accessToken = getAccessToken(request);
  if (!accessToken) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Missing Bearer token in Authorization header" },
        { status: 401 },
      ),
    };
  }

  const client = getUserScopedClient(accessToken);
  const { data, error } = await client.auth.getUser();

  if (error || !data.user) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return {
    ok: true as const,
    client,
    user: data.user,
  };
}

export async function GET(request: Request) {
  const auth = await authenticateRequest(request);
  if (!auth.ok) {
    return auth.response;
  }

  const { data, error } = await auth.client
    .from("transactions")
    .select("id, date, title, amount, category, type, user_id, created_at")
    .order("date", { ascending: false })
    .returns<TransactionRow[]>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (!auth.ok) {
    return auth.response;
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 },
    );
  }

  const validation = validatePayload(payload);

  if (!validation.valid || !validation.data) {
    return NextResponse.json(
      { error: validation.message ?? "Invalid transaction payload" },
      { status: 400 },
    );
  }

  const { data, error } = await auth.client
    .from("transactions")
    .insert({ ...validation.data, user_id: auth.user.id })
    .select("id, date, title, amount, category, type, user_id, created_at")
    .single<TransactionRow>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
