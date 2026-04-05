import { NextResponse } from "next/server";
import { getUserScopedClient } from "@/lib/supabase";

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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authenticateRequest(request);
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await params;

  if (!id || !id.trim()) {
    return NextResponse.json(
      { error: "Transaction id is required" },
      { status: 400 },
    );
  }

  const { data, error } = await auth.client
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", auth.user.id)
    .select("id")
    .single<{ id: string }>();

  if (error) {
    const status = error.code === "PGRST116" ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ data }, { status: 200 });
}
