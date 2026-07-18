"use server";

import { revalidatePath, revalidateTag } from "next/cache";
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
  "contact.rep1.name",
  "contact.rep1.phone",
  "contact.rep1.whatsapp",
  "contact.rep2.name",
  "contact.rep2.phone",
  "contact.rep2.whatsapp",
  "seo.ga_id",
  "seo.google_ads_id",
  "seo.gsc_verification",
  "seo.gtag_script",
  "popup.active",
  "popup.title",
  "popup.content",
  "popup.image_url",
  "popup.button_label",
  "popup.button_url",
  "popup.cooldown",
];

export async function saveSetting(
  _prev: { success: boolean; error: string | null },
  formData: FormData
): Promise<{ success: boolean; error: string | null }> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();

  try {
    const rows: { key: string; value: { value: string } }[] = [];
    for (const key of knownKeys) {
      const rawValue = formData.get(key);
      if (rawValue === null) continue;
      const value = String(rawValue).trim();
      if (value) rows.push({ key, value: { value } });
    }

    if (rows.length > 0) {
      const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
      if (error) throw new Error(error.message);
    }

    revalidateTag("site-settings");
    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/whatsapp");
    revalidatePath("/urunler", "layout");
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Bilinmeyen hata oluştu." };
  }
}
