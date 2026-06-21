import { cookies } from "next/headers";
import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { requireSupabasePublicEnv, requireSupabaseServiceEnv } from "@/lib/supabase/env";

const getSupabaseServerClient = cache(async () => {
  const env = requireSupabasePublicEnv();
  const cookieStore = await cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set cookies; middleware and actions can.
        }
      },
    },
  });
});

export async function createSupabaseServerClient() {
  return getSupabaseServerClient();
}

export function createSupabaseServiceClient() {
  const env = requireSupabaseServiceEnv();
  return createClient(env.url, env.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
