"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type SignInInput = {
  email: string;
  password: string;
};

type SignUpInput = {
  email: string;
  password: string;
};

type OtpInput = {
  email: string;
  shouldCreateUser?: boolean;
};

type VerifyOtpInput = {
  email: string;
  token: string;
};

type PasswordResetInput = {
  email: string;
};

type UpdatePasswordInput = {
  password: string;
};

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setAccessToken(data.session?.access_token ?? null);
      setIsLoading(false);
    };

    void init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAccessToken(session?.access_token ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async ({ email, password }: SignInInput) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  }, []);

  const signUp = useCallback(async ({ email, password }: SignUpInput) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  }, []);

  const sendEmailOtp = useCallback(
    async ({ email, shouldCreateUser = false }: OtpInput) => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser,
        },
      });

      return { error };
    },
    [],
  );

  const verifyEmailOtp = useCallback(
    async ({ email, token }: VerifyOtpInput) => {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });

      return { error };
    },
    [],
  );

  const sendPasswordResetEmail = useCallback(
    async ({ email }: PasswordResetInput) => {
      const redirectTo =
        typeof window === "undefined"
          ? undefined
          : `${window.location.origin}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      return { error };
    },
    [],
  );

  const updatePassword = useCallback(
    async ({ password }: UpdatePasswordInput) => {
      const { error } = await supabase.auth.updateUser({ password });
      return { error };
    },
    [],
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  }, []);

  return {
    user,
    accessToken,
    isLoading,
    signIn,
    signUp,
    sendEmailOtp,
    verifyEmailOtp,
    sendPasswordResetEmail,
    updatePassword,
    signOut,
  };
}
