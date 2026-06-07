import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AdminResource } from "@/lib/admin/resources";
import { mainNavigation } from "@/data/navigation";

function isMissingTableError(message?: string) {
  if (!message) return false;
  const normalized = message.toLowerCase();
  return (
    normalized.includes("schema cache") ||
    normalized.includes("could not find the table") ||
    normalized.includes("does not exist") ||
    normalized.includes("relation") && normalized.includes("does not exist")
  );
}

type SeoOverviewRow = {
  id: string;
  title: string;
  type: string;
  path: string;
  meta_title?: string | null;
  meta_description?: string | null;
  focus_keyword?: string | null;
  robots_index?: string | null;
  image_alt?: string | null;
  cover_image_alt?: string | null;
  alt_text?: string | null;
  updated_at?: string | null;
  editPath: string;
};

export async function getResourceRows(resource: AdminResource, search?: string) {
  const supabase = await createSupabaseServerClient();
  let query = supabase.from(resource.table).select("*").order("created_at", { ascending: false }).limit(100);

  if (search && resource.searchable.length > 0) {
    query = query.or(resource.searchable.map((key) => `${key}.ilike.%${search}%`).join(","));
  }

  const { data, error } = await query;
  if (error) {
    if (isMissingTableError(error.message)) return [];
    throw new Error(error.message);
  }

  if (resource.key === "menuItems" && !search && (!data || data.length === 0)) {
    return seedDefaultMenuItems();
  }

  return (data ?? []) as Record<string, unknown>[];
}

async function seedDefaultMenuItems() {
  const supabase = await createSupabaseServerClient();
  const defaults = mainNavigation.map((item, index) => ({
    menu_key: "header",
    label: item.label,
    url: item.href,
    target: "_self",
    mega_menu_key: item.menuKey ?? null,
    sort_order: index + 1,
    is_active: true,
  }));

  const { error } = await supabase.from("menu_items").insert(defaults);

  if (error) {
    const fallbackDefaults = defaults.map(({ mega_menu_key: _megaMenuKey, ...item }) => item);
    const retry = await supabase.from("menu_items").insert(fallbackDefaults);
    if (retry.error) return [];
  }

  const { data, error: selectError } = await supabase
    .from("menu_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .limit(100);

  if (selectError) return [];
  return (data ?? []) as Record<string, unknown>[];
}

export async function getResourceRow(resource: AdminResource, id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from(resource.table).select("*").eq("id", id).maybeSingle();
  if (error) {
    if (isMissingTableError(error.message)) return null;
    throw new Error(error.message);
  }
  return data as Record<string, unknown> | null;
}

async function safeCount(table: string, filter?: (query: any) => any) {
  try {
    const supabase = await createSupabaseServerClient();
    let query = supabase.from(table).select("id", { count: "exact", head: true });
    if (filter) query = filter(query) as typeof query;
    const { count, error } = await query;
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

async function safeRows(table: string, columns = "*", limit = 10) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from(table).select(columns).order("created_at", { ascending: false }).limit(limit);
    if (error) return [];
    return (data ?? []) as unknown as Record<string, unknown>[];
  } catch {
    return [];
  }
}

export async function getDashboardStats() {
  const supabase = await createSupabaseServerClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalPages,
    publishedPages,
    draftPages,
    services,
    posts,
    media,
    missingMediaAlt,
    latestLeads,
    latestContent,
    seoRows,
  ] = await Promise.all([
    safeCount("pages"),
    safeCount("pages", (query) => query.eq("status", "published")),
    safeCount("pages", (query) => query.eq("status", "draft")),
    safeCount("services", (query) => query.eq("is_active", true)),
    safeCount("blog_posts"),
    safeCount("media_assets"),
    safeCount("media_assets", (query) => query.or("alt_text.is.null,alt_text.eq.")),
    safeRows("leads", "id, full_name, phone, email, source, status, created_at", 8),
    safeRows("site_content", "id, section_key, title, status, updated_at, created_at", 8),
    getSeoOverview(),
  ]);

  const todayLeads = await safeCount("leads", (query) => query.gte("created_at", today.toISOString()));
  const seoIssues = seoRows.filter((row) => getSeoScore(row) < 80).length;

  return {
    totalPages,
    publishedPages,
    draftPages,
    services,
    posts,
    media,
    missingMediaAlt,
    todayLeads,
    seoIssues,
    latestLeads,
    latestContent,
    quickStats: {
      totalManagedContent: totalPages + services + posts,
    },
  };
}

function titleLengthOk(value?: string | null) {
  const length = value?.trim().length ?? 0;
  return length >= 50 && length <= 60;
}

function descriptionLengthOk(value?: string | null) {
  const length = value?.trim().length ?? 0;
  return length >= 140 && length <= 160;
}

function hasValue(value?: string | null) {
  return Boolean(value && value.trim().length > 0);
}

export function getSeoScore(row: SeoOverviewRow) {
  const checks = [
    titleLengthOk(row.meta_title),
    descriptionLengthOk(row.meta_description),
    hasValue(row.focus_keyword),
    row.robots_index !== "noindex",
  ];

  if ("alt_text" in row || "image_alt" in row || "cover_image_alt" in row) {
    checks.push(hasValue(row.alt_text ?? row.image_alt ?? row.cover_image_alt));
  }

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

async function getSeoRows({
  table,
  type,
  pathPrefix,
  editBasePath,
  titleColumn = "title",
  altColumn,
}: {
  table: string;
  type: string;
  pathPrefix: string;
  editBasePath: string;
  titleColumn?: string;
  altColumn?: "image_alt" | "cover_image_alt" | "alt_text";
}) {
  try {
    const supabase = await createSupabaseServerClient();
    const columns = [
      "id",
      titleColumn,
      "slug",
      "meta_title",
      "meta_description",
      "focus_keyword",
      "robots_index",
      altColumn,
      "updated_at",
    ].filter(Boolean).join(", ");

    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .order("updated_at", { ascending: false })
      .limit(100);

    if (error) return [];

    const rows = (data ?? []) as unknown as Record<string, unknown>[];
    return rows.map((row) => {
      const slug = typeof row.slug === "string" ? row.slug : "";
      const title = typeof row[titleColumn] === "string" ? String(row[titleColumn]) : slug || String(row.id);
      return {
        id: String(row.id),
        title,
        type,
        path: `${pathPrefix}${slug}`.replace("//", "/"),
        meta_title: row.meta_title as string | null,
        meta_description: row.meta_description as string | null,
        focus_keyword: row.focus_keyword as string | null,
        robots_index: row.robots_index as string | null,
        image_alt: altColumn === "image_alt" ? row.image_alt as string | null : null,
        cover_image_alt: altColumn === "cover_image_alt" ? row.cover_image_alt as string | null : null,
        alt_text: altColumn === "alt_text" ? row.alt_text as string | null : null,
        updated_at: row.updated_at as string | null,
        editPath: `${editBasePath}/${row.id}/edit`,
      } satisfies SeoOverviewRow;
    });
  } catch {
    return [];
  }
}

async function getMediaSeoRows() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("media_assets")
      .select("id, file_name, path, alt_text, updated_at")
      .order("updated_at", { ascending: false })
      .limit(100);

    if (error) return [];

    const rows = (data ?? []) as unknown as Record<string, unknown>[];
    return rows.map((row) => ({
      id: String(row.id),
      title: typeof row.file_name === "string" ? row.file_name : String(row.id),
      type: "Media",
      path: typeof row.path === "string" ? row.path : "/media",
      meta_title: "Media asset",
      meta_description: "Media asset alt text audit",
      focus_keyword: "media",
      robots_index: "index",
      image_alt: null,
      cover_image_alt: null,
      alt_text: row.alt_text as string | null,
      updated_at: row.updated_at as string | null,
      editPath: `/admin/media/${row.id}/edit`,
    } satisfies SeoOverviewRow));
  } catch {
    return [];
  }
}

export async function getSeoOverview() {
  const [pages, services, blog, projects, products, serviceAreas, media] = await Promise.all([
    getSeoRows({ table: "pages", type: "Page", pathPrefix: "/", editBasePath: "/admin/pages", altColumn: "image_alt" }),
    getSeoRows({ table: "services", type: "Service", pathPrefix: "/", editBasePath: "/admin/services", altColumn: "image_alt" }),
    getSeoRows({ table: "blog_posts", type: "Blog", pathPrefix: "/blog/", editBasePath: "/admin/blog", altColumn: "cover_image_alt" }),
    getSeoRows({ table: "projects", type: "Project", pathPrefix: "/projeler/", editBasePath: "/admin/projects", altColumn: "image_alt" }),
    getSeoRows({ table: "products", type: "Product", pathPrefix: "/urunler/", editBasePath: "/admin/products", altColumn: "image_alt" }),
    getSeoRows({ table: "service_areas", type: "Local SEO", pathPrefix: "/", editBasePath: "/admin/service-areas" }),
    getMediaSeoRows(),
  ]);

  return [...pages, ...services, ...blog, ...projects, ...products, ...serviceAreas, ...media].sort((a, b) => getSeoScore(a) - getSeoScore(b));
}
