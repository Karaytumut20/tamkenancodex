"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const knownKeys = [
  "contact.phone",
  "contact.whatsapp",
  "contact.email",
  "contact.address",
  "contact.city",
  "site.name",
  "site.legalName",
  "site.url",
  "site.description",
];

export async function saveSetting(
  _prev: { success: boolean; error: string | null },
  formData: FormData
): Promise<{ success: boolean; error: string | null }> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();

  try {
    for (const key of knownKeys) {
      const rawValue = formData.get(key);
      if (rawValue === null) continue; // field not in form
      const value = String(rawValue).trim();

      // Check if this setting already exists
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("key", key)
        .maybeSingle();

      const jsonValue = { value };

      if (existing) {
        await supabase
          .from("site_settings")
          .update({ value: jsonValue })
          .eq("id", existing.id);
      } else if (value) {
        // Only insert if there's a value
        await supabase
          .from("site_settings")
          .insert({ key, value: jsonValue });
      }
    }

    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Bilinmeyen hata oluştu." };
  }
}
