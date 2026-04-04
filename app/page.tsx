"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";

export default function LandingPage() {
  const { user, isLoading } = useSupabaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [isLoading, user, router]);

  if (isLoading || user) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-background via-background to-rose-950/15 p-6 md:p-10">
      <div className="pointer-events-none absolute -top-28 -right-24 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative mx-auto flex max-w-4xl flex-col gap-8">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            FinanceDash
          </p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            Track money with clarity.
            <br className="hidden md:block" />
            Save your history with an account.
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Browse the dashboard and transactions as a guest. Sign up to
            securely save transactions and access your past records from
            Supabase.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <AuthDialog triggerLabel="Login" mode="signin" />
          <AuthDialog triggerLabel="Sign up" mode="signup" variant="default" />
        </div>

        <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
          <div className="rounded-lg border border-border/60 bg-background/50 p-4">
            Explore dashboard with demo data
          </div>
          <div className="rounded-lg border border-border/60 bg-background/50 p-4">
            Add and delete transactions in guest mode
          </div>
          <div className="rounded-lg border border-border/60 bg-background/50 p-4">
            Sign up to save and keep history
          </div>
        </div>
      </div>
    </div>
  );
}
