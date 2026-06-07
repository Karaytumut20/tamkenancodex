export function getSupabaseEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

export function hasSupabasePublicEnv() {
  const env = getSupabaseEnv();
  return Boolean(env.url && env.anonKey);
}

export function requireSupabasePublicEnv() {
  const env = getSupabaseEnv();
  if (!env.url || !env.anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.");
  }
  return { url: env.url, anonKey: env.anonKey };
}

export function requireSupabaseServiceEnv() {
  const env = getSupabaseEnv();
  if (!env.url || !env.serviceRoleKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
  }
  return { url: env.url, serviceRoleKey: env.serviceRoleKey };
}
