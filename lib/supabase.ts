import { createClient } from "@supabase/supabase-js";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

const supabaseUrl = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
const supabaseAnonKey = getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getServiceRoleClient() {
  const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE");

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
