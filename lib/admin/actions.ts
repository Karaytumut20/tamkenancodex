"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { getResourceByKey, type AdminField } from "@/lib/admin/resources";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";

function isMissingTableError(message?: string) {
  if (!message) return false;
  const normalized = message.toLowerCase();
  return (
    normalized.includes("schema cache") ||
    normalized.includes("could not find the table") ||
    normalized.includes("does not exist") ||
    (normalized.includes("relation") && normalized.includes("does not exist"))
  );
}

function parseHumanStructuredField(field: AdminField, value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    if (field.name === "metadata" || field.name === "json_ld" || field.name === "value") return {};
    return [];
  }

  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    return JSON.parse(trimmed);
  }

  if (field.name === "value") return { value: trimmed };
  if (field.name === "metadata" || field.name === "json_ld") return { text: trimmed };

  const lines = trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (field.name === "faqs") {
    return lines
      .map((line) => {
        const [question, ...answerParts] = line.split("|");
        return {
          question: question?.trim() ?? "",
          answer: answerParts.join("|").trim(),
        };
      })
      .filter((item) => item.question || item.answer);
  }

  if (field.name === "gallery") {
    return lines.map((line) => ({ url: line, alt: "" }));
  }

  return lines.length > 0 ? lines : trimmed.split(",").map((item) => item.trim()).filter(Boolean);
}

function parseValue(field: AdminField, formData: FormData) {
  if (field.type === "checkboxes") {
    return formData.getAll(field.name).map(String);
  }
  if (field.type === "custom_list") {
    const raw = formData.get(field.name);
    if (raw === null || raw === "") return [];
    return String(raw).split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  }
  if (field.type === "features_list") {
    const raw = formData.get(field.name);
    if (raw === null || raw === "") return [];
    try {
      return JSON.parse(String(raw));
    } catch (e) {
      console.error("Failed to parse features_list JSON:", e);
      return [];
    }
  }
  if (field.type === "boolean") return formData.get(field.name) === "on";
  const raw = formData.get(field.name);

  if (raw === null || raw === "") {
    if (field.type === "json") {
      if (field.name === "metadata" || field.name === "json_ld" || field.name === "value") return {};
      return [];
    }
    if (field.type === "array") return [];
    return null;
  }

  const value = String(raw);
  if (field.name.endsWith("_id") || field.name === "parent_id" || field.name === "entity_id") {
    const trimmed = value.trim();
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(trimmed)
      ? trimmed
      : null;
  }
  if (field.type === "number") return Number(value);
  if (field.type === "array") {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (field.type === "json") {
    try {
      return parseHumanStructuredField(field, value);
    } catch (error) {
      console.error("Structured field parse failed:", field.name, value, error);
      throw new Error(`${field.label} alani okunamadi. Liste alanlarinda her maddeyi yeni satira yazin. SSS icin: Soru | Cevap`);
    }
  }
  return value;
}

function getPayload(fields: AdminField[], formData: FormData) {
  return fields.reduce<Record<string, unknown>>((payload, field) => {
    payload[field.name] = parseValue(field, formData);
    return payload;
  }, {});
}

async function makeUniqueSlug({
  supabase,
  table,
  baseSlug,
  id,
}: {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  table: string;
  baseSlug: string;
  id: string | null;
}) {
  let slug = baseSlug || "icerik";
  let suffix = 2;

  while (true) {
    let query = supabase.from(table).select("id").eq("slug", slug).limit(1);
    if (id) query = query.neq("id", id);
    const { data, error } = await query;

    if (error) return slug;
    if (!data || data.length === 0) return slug;

    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

async function normalizePayload(resourceKey: string, table: string, id: string | null, payload: Record<string, unknown>) {
  const hasSlug = "slug" in payload;
  const currentSlug = typeof payload.slug === "string" ? payload.slug.trim() : "";

  if (hasSlug && !currentSlug) {
    const source =
      typeof payload.title === "string" ? payload.title :
      typeof payload.name === "string" ? payload.name :
      typeof payload.h1 === "string" ? payload.h1 :
      "";

    if (source) {
      const supabase = await createSupabaseServerClient();
      payload.slug = await makeUniqueSlug({
        supabase,
        table,
        baseSlug: slugify(source),
        id,
      });
    }
  }

  if ("sort_order" in payload && (payload.sort_order === null || payload.sort_order === undefined)) {
    payload.sort_order = 0;
  }

  if ("step_number" in payload && (payload.step_number === null || payload.step_number === undefined)) {
    payload.step_number = 1;
  }

  if ("robots_index" in payload && (payload.robots_index === null || payload.robots_index === undefined || payload.robots_index === "")) {
    payload.robots_index = "index";
  }

  if ("robots_follow" in payload && (payload.robots_follow === null || payload.robots_follow === undefined || payload.robots_follow === "")) {
    payload.robots_follow = "follow";
  }

  if ("sitemap_include" in payload && (payload.sitemap_include === null || payload.sitemap_include === undefined)) {
    payload.sitemap_include = true;
  }

  if ("schema_type" in payload && (payload.schema_type === null || payload.schema_type === undefined || payload.schema_type === "")) {
    payload.schema_type =
      resourceKey === "products" ? "Product" :
      resourceKey === "services" ? "Service" :
      resourceKey === "blog" ? "Article" :
      resourceKey === "serviceAreas" ? "LocalBusiness" :
      "WebPage";
  }

  if (resourceKey === "products") {
    if (payload.is_active === false && id === null) {
      payload.is_active = true;
    }

    if ("categories_list" in payload) {
      const selectedCats = Array.isArray(payload.categories_list) ? (payload.categories_list as string[]) : [];
      
      // 1. Ensure these categories are included in the tags array so they are saved
      const existingTags = Array.isArray(payload.tags) ? (payload.tags as string[]) : [];
      const productCategories = ["Alarm Sistemleri", "Akıllı Ev Sistemleri", "Kamera Sistemleri", "Yangın İhbar Sistemleri", "Personel Takip PDKS", "Network Çözümleri"];
      const otherTags = existingTags.filter((t) => !productCategories.includes(t));
      payload.tags = Array.from(new Set([...otherTags, ...selectedCats]));

      // 2. Resolve primary category id
      if (selectedCats.length > 0) {
        const primaryCatName = selectedCats[0];
        const slugMap: Record<string, string> = {
          "Alarm Sistemleri": "product-alarm-sistemleri",
          "Akıllı Ev Sistemleri": "product-akilli-ev-sistemleri",
          "Kamera Sistemleri": "product-kamera-sistemleri",
          "Yangın İhbar Sistemleri": "product-yangin-ihbar-sistemleri",
          "Personel Takip PDKS": "product-personel-takip-pdks",
          "Network Çözümleri": "product-network-cozumleri"
        };
        const catSlug = slugMap[primaryCatName];
        if (catSlug) {
          const supabase = createSupabaseServiceClient();
          const { data } = await supabase.from("categories").select("id").eq("slug", catSlug).maybeSingle();
          if (data) {
            payload.category_id = data.id;
          }
        }
      } else {
        payload.category_id = null;
      }
      
      delete payload.categories_list;
    }
  }

  if (resourceKey === "menuItems") {
    if (!payload.target) payload.target = "_self";
    if (!payload.menu_key) payload.menu_key = "header";
  }

  return payload;
}

export async function saveResource(resourceKey: string, id: string | null, formData: FormData) {
  const resource = getResourceByKey(resourceKey);
  if (!resource) throw new Error("Bilinmeyen kaynak.");
  await requireAdmin(resource.roles);

  const supabase = await createSupabaseServerClient();
  const payload = await normalizePayload(resourceKey, resource.table, id, getPayload(resource.fields, formData));
  const query = id
    ? supabase.from(resource.table).update(payload).eq("id", id)
    : supabase.from(resource.table).insert(payload);

  const { error } = await query;
  if (error) {
    if (isMissingTableError(error.message)) {
      redirect(`${resource.path}?setup=missing-table`);
    }
    throw new Error(error.message);
  }

  revalidatePath(resource.path);
  if (resourceKey === "products") {
    revalidatePath("/urunler");
    if (typeof payload.slug === "string") revalidatePath(`/urunler/${payload.slug}`);
  }
  redirect(resource.path);
}

export async function deleteResource(resourceKey: string, id: string) {
  const resource = getResourceByKey(resourceKey);
  if (!resource || !resource.canDelete) throw new Error("Silme izni yok.");
  await requireAdmin(resource.roles);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from(resource.table).delete().eq("id", id);
  if (error) {
    if (isMissingTableError(error.message)) return;
    throw new Error(error.message);
  }
  revalidatePath(resource.path);
}

export async function signOutAdmin() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
