"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type LoginState = {
  error?: string;
};

export async function signInAdmin(_state: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  const redirectTo = next.startsWith("/admin") ? next : "/admin";

  if (!email || !password) {
    return { error: "E-posta ve şifre zorunlu." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: error?.message ?? "Giriş yapılamadı." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("id, is_active")
    .eq("id", data.user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return { error: "Bu kullanıcı için aktif admin profili bulunamadı." };
  }

  redirect(redirectTo);
}
