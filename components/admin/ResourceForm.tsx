import { ResourceFormClient } from "@/components/admin/ResourceFormClient";
import type { AdminResource } from "@/lib/admin/resources";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getMenuParentOptions() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("menu_items")
      .select("id, label, menu_key")
      .is("parent_id", null)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) return [];
    return (data ?? []).map((item) => ({
      label: `Alt menü olarak bağla: ${item.label}`,
      value: String(item.id),
    }));
  } catch {
    return [];
  }
}

async function getBrandOptions() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("brands")
      .select("id, name")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) return [];
    return (data ?? []).map((item) => ({
      label: String(item.name),
      value: String(item.id),
    }));
  } catch {
    return [];
  }
}

async function getProductCategoryOptions() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, description")
      .eq("type", "product")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) return [];
    return (data ?? []).map((item) => ({
      id: String(item.id),
      label: String(item.name),
      value: String(item.name),
      description: typeof item.description === "string" ? item.description : "",
    }));
  } catch {
    return [];
  }
}

export async function ResourceForm({
  resource,
  row,
}: {
  resource: AdminResource;
  row: Record<string, unknown> | null;
}) {
  const menuParentOptions = resource.key === "menuItems" ? await getMenuParentOptions() : [];
  const brandOptions = resource.key === "products" ? await getBrandOptions() : [];
  const productCategoryOptions = resource.key === "products" ? await getProductCategoryOptions() : [];

  return (
    <ResourceFormClient
      resource={resource}
      row={row}
      menuParentOptions={menuParentOptions}
      brandOptions={brandOptions}
      productCategoryOptions={productCategoryOptions}
    />
  );
}

