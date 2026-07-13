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

  // 1. Try standard JSON parse first
  try {
    return JSON.parse(trimmed);
  } catch {
    // Ignore standard JSON parse error and try line-by-line parsing below
  }

  // 2. Split lines (filtering out empty lines)
  const lines = trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  // 3. Try parsing as NDJSON (lines of JSON objects)
  const lineObjects: any[] = [];
  let isNdJson = true;
  for (const line of lines) {
    if ((line.startsWith("{") && line.endsWith("}")) || (line.startsWith("[") && line.endsWith("]"))) {
      try {
        lineObjects.push(JSON.parse(line));
      } catch {
        isNdJson = false;
        break;
      }
    } else {
      isNdJson = false;
      break;
    }
  }

  if (isNdJson && lineObjects.length > 0) {
    return lineObjects;
  }

  // 4. Field-specific parsers
  if (field.name === "value") return { value: trimmed };
  if (field.name === "metadata" || field.name === "json_ld") return { text: trimmed };

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

  // 5. Safe structured array fallback for advantages, features, usage_areas, process_steps, etc.
  if (["advantages", "features", "benefits", "usage_areas", "process_steps", "custom_attributes", "side_attributes", "technical_attributes"].includes(field.name)) {
    return lines.map((line) => {
      if (line.startsWith("{") && line.endsWith("}")) {
        try {
          return JSON.parse(line);
        } catch {}
      }
      return { title: line, description: "", active: true };
    });
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

export type QuickProductCategoryResult =
  | { success: true; category: { id: string; name: string; description: string } }
  | { success: false; error: string };

export type QuickProductCategoryMutationResult =
  | { success: true; category?: { id: string; name: string; description: string } }
  | { success: false; error: string };

function revalidateProductCategoryPaths() {
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/urunler");
}

function normalizeQuickCategoryInput(input: { name?: string; description?: string }) {
  return {
    name: typeof input?.name === "string" ? input.name.trim().replace(/\s+/g, " ") : "",
    description: typeof input?.description === "string" ? input.description.trim() : "",
  };
}

function validateQuickCategoryInput(name: string, description: string): string | null {
  if (name.length < 2) return "Kategori adı en az 2 karakter olmalıdır.";
  if (name.length > 120) return "Kategori adı en fazla 120 karakter olabilir.";
  if (description.length > 1000) return "Açıklama en fazla 1000 karakter olabilir.";
  return null;
}

export async function createQuickProductCategory(input: {
  name: string;
  description?: string;
}): Promise<QuickProductCategoryResult> {
  await requireAdmin(getResourceByKey("categories")?.roles);

  const { name, description } = normalizeQuickCategoryInput(input);
  const validationError = validateQuickCategoryInput(name, description);
  if (validationError) return { success: false, error: validationError };

  const supabase = await createSupabaseServerClient();
  const { data: productCategories, error: lookupError } = await supabase
    .from("categories")
    .select("id, name, description, is_active")
    .eq("type", "product");

  if (lookupError) {
    return { success: false, error: "Kategori kontrol edilemedi. Lütfen tekrar deneyin." };
  }

  const normalizedName = name.toLocaleLowerCase("tr-TR");
  const existingCategory = productCategories?.find(
    (category) => String(category.name).trim().toLocaleLowerCase("tr-TR") === normalizedName
  );

  if (existingCategory) {
    if (!existingCategory.is_active) {
      const { error: activateError } = await supabase
        .from("categories")
        .update({ is_active: true })
        .eq("id", existingCategory.id);

      if (activateError) {
        return { success: false, error: "Mevcut kategori yeniden etkinleştirilemedi." };
      }
    }

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/urunler");
    return {
      success: true,
      category: {
        id: String(existingCategory.id),
        name: String(existingCategory.name),
        description: typeof existingCategory.description === "string" ? existingCategory.description : "",
      },
    };
  }

  const { data: lastCategory } = await supabase
    .from("categories")
    .select("sort_order")
    .eq("type", "product")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const slug = await makeUniqueSlug({
    supabase,
    table: "categories",
    baseSlug: slugify(name),
    id: null,
  });
  const nextSortOrder = Number(lastCategory?.sort_order ?? 0) + 10;
  const { data: createdCategory, error: insertError } = await supabase
    .from("categories")
    .insert({
      name,
      slug,
      type: "product",
      description: description || null,
      sort_order: nextSortOrder,
      is_active: true,
    })
    .select("id, name, description")
    .single();

  if (insertError || !createdCategory) {
    return {
      success: false,
      error: insertError?.message.includes("duplicate")
        ? "Bu kategori zaten mevcut."
        : "Kategori oluşturulamadı. Lütfen tekrar deneyin.",
    };
  }

  revalidateProductCategoryPaths();

  return {
    success: true,
    category: {
      id: String(createdCategory.id),
      name: String(createdCategory.name),
      description: typeof createdCategory.description === "string" ? createdCategory.description : "",
    },
  };
}

export async function updateQuickProductCategory(input: {
  id: string;
  name: string;
  description?: string;
}): Promise<QuickProductCategoryMutationResult> {
  await requireAdmin(getResourceByKey("categories")?.roles);

  const id = typeof input?.id === "string" ? input.id.trim() : "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return { success: false, error: "Geçersiz kategori kaydı." };
  }

  const { name, description } = normalizeQuickCategoryInput(input);
  const validationError = validateQuickCategoryInput(name, description);
  if (validationError) return { success: false, error: validationError };

  const supabase = createSupabaseServiceClient();
  const { data: categories, error: lookupError } = await supabase
    .from("categories")
    .select("id, name")
    .eq("type", "product");

  if (lookupError) {
    return { success: false, error: "Kategori kontrol edilemedi. Lütfen tekrar deneyin." };
  }

  const currentCategory = categories?.find((category) => String(category.id) === id);
  if (!currentCategory) {
    return { success: false, error: "Düzenlenecek kategori bulunamadı." };
  }

  const normalizedName = name.toLocaleLowerCase("tr-TR");
  const duplicateCategory = categories?.find(
    (category) =>
      String(category.id) !== id &&
      String(category.name).trim().toLocaleLowerCase("tr-TR") === normalizedName
  );
  if (duplicateCategory) {
    return { success: false, error: "Bu isimde başka bir ürün kategorisi zaten mevcut." };
  }

  const oldName = String(currentCategory.name);
  const { data: updatedCategory, error: updateError } = await supabase
    .from("categories")
    .update({ name, description: description || null })
    .eq("id", id)
    .eq("type", "product")
    .select("id, name, description")
    .single();

  if (updateError || !updatedCategory) {
    return { success: false, error: "Kategori güncellenemedi. Lütfen tekrar deneyin." };
  }

  if (oldName !== name) {
    const { data: taggedProducts } = await supabase
      .from("products")
      .select("id, tags")
      .contains("tags", [oldName]);

    await Promise.all(
      (taggedProducts ?? []).map((product) => {
        const tags = Array.isArray(product.tags)
          ? Array.from(new Set(product.tags.map((tag) => String(tag) === oldName ? name : String(tag))))
          : [];
        return supabase.from("products").update({ tags }).eq("id", product.id);
      })
    );
  }

  revalidateProductCategoryPaths();
  return {
    success: true,
    category: {
      id: String(updatedCategory.id),
      name: String(updatedCategory.name),
      description: typeof updatedCategory.description === "string" ? updatedCategory.description : "",
    },
  };
}

export async function deleteQuickProductCategory(input: {
  id: string;
}): Promise<QuickProductCategoryMutationResult> {
  await requireAdmin(getResourceByKey("categories")?.roles);

  const id = typeof input?.id === "string" ? input.id.trim() : "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return { success: false, error: "Geçersiz kategori kaydı." };
  }

  const supabase = createSupabaseServiceClient();
  const { data: category, error: lookupError } = await supabase
    .from("categories")
    .select("id, name")
    .eq("id", id)
    .eq("type", "product")
    .maybeSingle();

  if (lookupError) {
    return { success: false, error: "Kategori kontrol edilemedi. Lütfen tekrar deneyin." };
  }
  if (!category) {
    return { success: false, error: "Silinecek kategori bulunamadı." };
  }

  const categoryName = String(category.name);
  const { data: taggedProducts } = await supabase
    .from("products")
    .select("id, tags")
    .contains("tags", [categoryName]);

  const cleanupResults = await Promise.all([
    supabase.from("products").update({ category_id: null }).eq("category_id", id),
    ...(taggedProducts ?? []).map((product) => {
      const tags = Array.isArray(product.tags)
        ? product.tags.map(String).filter((tag) => tag !== categoryName)
        : [];
      return supabase.from("products").update({ tags }).eq("id", product.id);
    }),
  ]);

  if (cleanupResults.some((result) => result.error)) {
    return { success: false, error: "Kategori ürünlerden kaldırılamadı. Lütfen tekrar deneyin." };
  }

  const { error: deleteError } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("type", "product");

  if (deleteError) {
    return { success: false, error: "Kategori silinemedi. Lütfen tekrar deneyin." };
  }

  revalidateProductCategoryPaths();
  return { success: true };
}

async function normalizePayload(resourceKey: string, table: string, id: string | null, payload: Record<string, unknown>) {
  const hasSlug = "slug" in payload;
  const currentSlug = typeof payload.slug === "string" ? payload.slug.trim() : "";

  if (hasSlug && !currentSlug) {
    const source =
      typeof payload.title === "string" && payload.title ? payload.title :
      typeof payload.name === "string" && payload.name ? payload.name :
      typeof payload.h1 === "string" && payload.h1 ? payload.h1 :
      "";

    if (source) {
      const supabase = await createSupabaseServerClient();
      payload.slug = await makeUniqueSlug({
        supabase,
        table,
        baseSlug: slugify(source),
        id,
      });
    } else if (resourceKey === "brands") {
      const randomStr = Math.random().toString(36).substring(2, 7);
      const supabase = await createSupabaseServerClient();
      payload.slug = await makeUniqueSlug({
        supabase,
        table,
        baseSlug: `marka-${randomStr}`,
        id,
      });
    }
  }

  if (resourceKey === "brands") {
    if (payload.name === null || payload.name === undefined || String(payload.name).trim() === "") {
      payload.name = "";
    }

    // A newly-created brand is intended for the public brand strip by default.
    // Without this, an unchecked/omitted checkbox stores false and the public
    // query deliberately filters the brand out.
    if (id === null) {
      payload.is_active = true;
    }
  }

  if (resourceKey === "references" && id === null && payload.is_active === false) {
    payload.is_active = true;
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
      const supabase = createSupabaseServiceClient();
      const { data: productCategories } = await supabase
        .from("categories")
        .select("id, name")
        .eq("type", "product");

      // Kategori seçimlerini etiketlerde de tut; böylece çoklu kategori yapısı
      // mevcut ürün şemasıyla geriye dönük uyumlu kalır.
      const categoryTagReplacements =
        typeof payload.__category_tag_replacements === "object" &&
        payload.__category_tag_replacements !== null &&
        !Array.isArray(payload.__category_tag_replacements)
          ? payload.__category_tag_replacements as Record<string, unknown>
          : {};
      const existingTags = Array.isArray(payload.tags)
        ? (payload.tags as string[]).flatMap((tag) => {
            let currentTag: unknown = tag;
            const visitedTags = new Set<string>();
            while (
              typeof currentTag === "string" &&
              currentTag in categoryTagReplacements &&
              !visitedTags.has(currentTag)
            ) {
              visitedTags.add(currentTag);
              currentTag = categoryTagReplacements[currentTag];
            }
            return typeof currentTag === "string" && currentTag.trim() ? [currentTag.trim()] : [];
          })
        : [];
      const categoryNames = (productCategories ?? []).map((category) => String(category.name));
      const otherTags = existingTags.filter((tag) => !categoryNames.includes(tag));
      payload.tags = Array.from(new Set([...otherTags, ...selectedCats]));

      // İlk seçimi products.category_id alanındaki ana kategori olarak sakla.
      if (selectedCats.length > 0) {
        const primaryCategory = (productCategories ?? []).find(
          (category) => String(category.name) === selectedCats[0]
        );
        payload.category_id = primaryCategory?.id ?? null;
      } else {
        payload.category_id = null;
      }
      
      delete payload.categories_list;
      delete payload.__category_tag_replacements;
    }
  }
  if (resourceKey === "oksidProducts") {
    revalidatePath("/urunler", "layout");
  }

  if (resourceKey === "blog") {
    // Public blog queries intentionally show only published records. Make a new
    // admin-created article immediately visible unless the editor chose Draft.
    if (id === null && !payload.status) {
      payload.status = "published";
    }
    if (payload.status === "published" && !payload.published_at) {
      payload.published_at = new Date().toISOString();
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
  const rawPayload = getPayload(resource.fields, formData);
  if (resourceKey === "products") {
    const rawCategoryTagReplacements = formData.get("__category_tag_replacements");
    if (typeof rawCategoryTagReplacements === "string" && rawCategoryTagReplacements) {
      try {
        rawPayload.__category_tag_replacements = JSON.parse(rawCategoryTagReplacements);
      } catch {
        rawPayload.__category_tag_replacements = {};
      }
    }
  }
  const payload = await normalizePayload(resourceKey, resource.table, id, rawPayload);
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
  if (resourceKey === "services") {
    revalidatePath("/");
    revalidatePath("/kendi-sistemini-tasarla");
    if (typeof payload.slug === "string") {
      revalidatePath(`/${payload.slug}`);
      revalidatePath(`/hizmetler/${payload.slug}`);
    }
  }
  if (resourceKey === "blog") {
    revalidatePath("/blog");
    revalidatePath("/");
    if (typeof payload.slug === "string") revalidatePath(`/blog/${payload.slug}`);
  }
  if (resourceKey === "brands") {
    revalidatePath("/");
  }
  if (resourceKey === "categories") {
    revalidatePath("/admin/products");
    revalidatePath("/urunler");
  }
  if (resourceKey === "references") revalidatePath("/referanslarimiz");
  redirect(resource.path);
}

export async function deleteResource(resourceKey: string, id: string) {
  const resource = getResourceByKey(resourceKey);
  if (!resource || !resource.canDelete) throw new Error("Silme izni yok.");
  await requireAdmin(resource.roles);

  const supabase = await createSupabaseServerClient();
  let deletedSlug: string | null = null;
  if (resourceKey === "blog" || resourceKey === "services") {
    const { data } = await supabase
      .from(resource.table)
      .select("slug")
      .eq("id", id)
      .maybeSingle();
    deletedSlug = typeof data?.slug === "string" ? data.slug : null;
  }
  const { error } = await supabase.from(resource.table).delete().eq("id", id);
  if (error) {
    if (isMissingTableError(error.message)) return;
    throw new Error(error.message);
  }
  revalidatePath(resource.path);
  if (resourceKey === "services") {
    revalidatePath("/");
    revalidatePath("/kendi-sistemini-tasarla");
    if (deletedSlug) {
      revalidatePath(`/${deletedSlug}`);
      revalidatePath(`/hizmetler/${deletedSlug}`);
    }
  }
  if (resourceKey === "blog") {
    revalidatePath("/blog");
    revalidatePath("/");
    if (deletedSlug) revalidatePath(`/blog/${deletedSlug}`);
  }
  if (resourceKey === "brands") revalidatePath("/");
  if (resourceKey === "categories") {
    revalidatePath("/admin/products");
    revalidatePath("/urunler");
  }
  if (resourceKey === "references") revalidatePath("/referanslarimiz");
}

export async function signOutAdmin() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
