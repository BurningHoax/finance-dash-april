"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordField } from "@/components/password-field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";

type AuthMode = "signin" | "signup";

type Props = {
  mode?: AuthMode;
  triggerLabel?: string;
  variant?: "outline" | "default" | "secondary" | "ghost";
};

export function AuthDialog({
  mode = "signin",
  triggerLabel,
  variant = "outline",
}: Props) {
  const router = useRouter();
  const {
    signIn,
    sendEmailOtp,
    verifyEmailOtp,
    sendPasswordResetEmail,
    updatePassword,
  } = useSupabaseAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<AuthMode>(mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    if (activeMode === "signup" && !isOtpVerified) {
      setError("Verify your email OTP first, then complete signup.");
      return;
    }

    setIsSubmitting(true);
    const result =
      activeMode === "signin"
        ? await signIn({ email: email.trim(), password })
        : await updatePassword({ password });

    if (result.error) {
      setError(result.error.message);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setPassword("");

    if (activeMode === "signup") {
      setSuccess("Account created and verified successfully.");
      setIsOpen(false);
      router.replace("/transactions");
      return;
    }

    setIsOpen(false);
    router.replace("/transactions");
  };

  const onSendOtp = async () => {
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError("Email is required to send an OTP.");
      return;
    }

    setIsSubmitting(true);
    const result = await sendEmailOtp({
      email: email.trim(),
      shouldCreateUser: true,
    });

    if (result.error) {
      setError(result.error.message);
      setIsSubmitting(false);
      return;
    }

    setSuccess("OTP sent. Enter the code from your email to verify signup.");
    setIsOtpVerified(false);
    setIsSubmitting(false);
  };

  const onVerifyOtp = async () => {
    setError(null);
    setSuccess(null);

    if (!email.trim() || !otpCode.trim()) {
      setError("Email and OTP code are required.");
      return;
    }

    setIsSubmitting(true);
    const result = await verifyEmailOtp({
      email: email.trim(),
      token: otpCode.trim(),
    });

    if (result.error) {
      setError(result.error.message);
      setIsSubmitting(false);
      return;
    }

    setSuccess("Email verified. Now set your password and click Sign up.");
    setIsOtpVerified(true);
    setOtpCode("");
    setIsSubmitting(false);
  };

  const onForgotPassword = async () => {
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError("Enter your email first to receive a password reset link.");
      return;
    }

    setIsSubmitting(true);
    const result = await sendPasswordResetEmail({ email: email.trim() });

    if (result.error) {
      setError(result.error.message);
      setIsSubmitting(false);
      return;
    }

    setSuccess(
      "Password reset email sent. Check your inbox for the recovery link.",
    );
    setIsSubmitting(false);
  };

  const title = activeMode === "signin" ? "Sign in" : "Create account";
  const description =
    activeMode === "signin"
      ? "Sign in with email and password."
      : "Create an account with OTP verification, then set your password.";
  const actionLabel = activeMode === "signin" ? "Sign in" : "Sign up";
  const loadingLabel =
    activeMode === "signin" ? "Signing in..." : "Signing up...";
  const label = triggerLabel ?? (mode === "signin" ? "Login" : "Sign up");

  const onOpenChange = (nextOpen: boolean) => {
    setIsOpen(nextOpen);
    setActiveMode(mode);
    setError(null);
    setSuccess(null);
    setPassword("");
    setOtpCode("");
    setIsOtpVerified(false);
  };

  const switchMode = (nextMode: AuthMode) => {
    setActiveMode(nextMode);
    setError(null);
    setSuccess(null);
    setIsOtpVerified(false);
    setOtpCode("");
    setPassword("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant={variant} size="sm" className="gap-2">
          {mode === "signin" ? (
            <LogIn className="size-4" />
          ) : (
            <UserPlus className="size-4" />
          )}
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="auth-email">
              Email
            </label>
            <Input
              id="auth-email"
              type="email"
              value={email}
              autoComplete="email"
              onChange={(event) => {
                setEmail(event.target.value);
                if (activeMode === "signup") {
                  setIsOtpVerified(false);
                }
              }}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <PasswordField
              id="auth-password"
              label="Password"
              value={password}
              onValueChange={setPassword}
              placeholder="Enter your password"
              autoComplete={
                activeMode === "signin" ? "current-password" : "new-password"
              }
              disabled={isSubmitting}
            />
            {activeMode === "signin" ? (
              <button
                type="button"
                className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                onClick={onForgotPassword}
                disabled={isSubmitting}
              >
                Forgot password?
              </button>
            ) : null}
          </div>

          {activeMode === "signup" ? (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={onSendOtp}
                disabled={isSubmitting}
              >
                Send OTP
              </Button>
              <Input
                id="auth-otp"
                value={otpCode}
                autoComplete="one-time-code"
                inputMode="numeric"
                onChange={(event) => setOtpCode(event.target.value)}
                placeholder="Enter OTP"
              />
              <Button
                type="button"
                variant="outline"
                onClick={onVerifyOtp}
                disabled={isSubmitting}
              >
                Verify OTP
              </Button>
            </div>
          ) : null}

          {activeMode === "signup" ? (
            <p className="text-xs text-muted-foreground">
              {isOtpVerified
                ? "OTP verified. You can now complete signup."
                : "Step 1: Send OTP. Step 2: Verify OTP. Step 3: Set password and Sign up."}
            </p>
          ) : null}

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {success ? (
            <p className="text-sm text-emerald-600">{success}</p>
          ) : null}
        </div>

        <DialogFooter>
          {activeMode === "signin" ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => switchMode("signup")}
              disabled={isSubmitting}
            >
              Create account
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onClick={() => switchMode("signin")}
              disabled={isSubmitting}
            >
              Already have an account?
            </Button>
          )}
          <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? loadingLabel : actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
