"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (!password || !confirmPassword) {
      setError("Both password fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setIsSubmitting(false);
      return;
    }

    setSuccess("Password updated successfully. Redirecting to dashboard...");
    setIsSubmitting(false);

    setTimeout(() => {
      router.replace("/dashboard");
    }, 1000);
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6 rounded-2xl border border-border/70 bg-card p-6 md:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset password
        </h1>
        <p className="text-sm text-muted-foreground">
          Set a new password for your account.
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="new-password">
            New password
          </label>
          <Input
            id="new-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter new password"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="confirm-password">
            Confirm password
          </label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm new password"
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
      </div>

      <Button
        type="button"
        className="w-full"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Updating..." : "Update password"}
      </Button>
    </div>
  );
}
