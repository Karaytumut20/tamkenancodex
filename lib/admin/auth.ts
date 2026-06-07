import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminRole = "super_admin" | "editor" | "support" | "viewer";

export type AdminProfile = {
  id: string;
  full_name: string | null;
  role: AdminRole;
  avatar_url: string | null;
  is_active: boolean;
};

export async function getCurrentAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("id, full_name, role, avatar_url, is_active")
    .eq("id", user.id)
    .eq("is_active", true)
    .maybeSingle<AdminProfile>();

  if (!profile) return null;
  return { user, profile };
}

export async function requireAdmin(roles?: AdminRole[]) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  if (roles && !roles.includes(admin.profile.role)) redirect("/admin");
  return admin;
}
