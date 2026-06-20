import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireSupabasePublicEnv } from "@/lib/supabase/env";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";

function getSupabaseAdmin() {
  const env = requireSupabasePublicEnv();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? env.anonKey;
  return createClient(env.url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function slugify(text: string): string {
  const trMap: Record<string, string> = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'I': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u'
  };
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[çğışöüÇĞİŞÖÜ]/g, (c) => trMap[c] || c)
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// 1. Create a section
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, menu_key, eyebrow, is_active } = await req.json();
    if (!title?.trim()) {
      return NextResponse.json({ error: "Başlık zorunludur" }, { status: 400 });
    }

    const finalKey = menu_key?.trim() ? slugify(menu_key) : slugify(title);
    if (!finalKey) {
      return NextResponse.json({ error: "Geçersiz menü yolu (path)" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Check if another section already uses this menu_key
    const { data: existingDup } = await supabase
      .from("mega_menu_sections")
      .select("id")
      .eq("menu_key", finalKey)
      .maybeSingle();

    if (existingDup) {
      return NextResponse.json({ error: "Bu menü yolu (slug) zaten başka bir menü tarafından kullanılıyor. Lütfen farklı bir başlık veya yol belirleyin." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("mega_menu_sections")
      .insert({
        title: title.trim(),
        menu_key: finalKey,
        eyebrow: eyebrow?.trim() || "",
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating section:", error);
      return NextResponse.json({ error: `Kayıt oluşturulamadı: ${error.message}` }, { status: 500 });
    }

    // Insert/Sync matching menu_items record
    try {
      const { data: maxSortData } = await supabase
        .from("menu_items")
        .select("sort_order")
        .eq("menu_key", "header")
        .order("sort_order", { ascending: false })
        .limit(1);

      const nextSortOrder = maxSortData && maxSortData[0] ? (maxSortData[0].sort_order || 0) + 1 : 1;

      const { error: menuItemsError } = await supabase
        .from("menu_items")
        .insert({
          menu_key: "header",
          label: title.trim(),
          url: `/${finalKey}`,
          mega_menu_key: finalKey,
          sort_order: nextSortOrder,
          is_active: is_active ?? true
        });

      if (menuItemsError) {
        console.error("Error creating menu item for new section:", menuItemsError);
      }
    } catch (syncErr) {
      console.error("Failed to sync new section to menu_items:", syncErr);
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/mega-menu");

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// 2. Update a section's metadata/path
export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, title, menu_key, eyebrow, is_active } = await req.json();
    console.log("MEGA-MENU PUT payload:", { id, title, menu_key, eyebrow, is_active });
    if (!id) {
      return NextResponse.json({ error: "Kimlik (id) zorunludur" }, { status: 400 });
    }
    if (!title?.trim()) {
      return NextResponse.json({ error: "Başlık zorunludur" }, { status: 400 });
    }

    const finalKey = menu_key?.trim() ? slugify(menu_key) : slugify(title);
    console.log("MEGA-MENU PUT calculated finalKey:", finalKey);
    if (!finalKey) {
      return NextResponse.json({ error: "Geçersiz menü yolu (path)" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Check if another section already uses this menu_key
    const { data: existingDup } = await supabase
      .from("mega_menu_sections")
      .select("id")
      .eq("menu_key", finalKey)
      .neq("id", id)
      .maybeSingle();

    if (existingDup) {
      return NextResponse.json({ error: "Bu menü yolu (slug) zaten başka bir menü tarafından kullanılıyor. Lütfen farklı bir başlık veya yol belirleyin." }, { status: 400 });
    }

    // Get the current section to find the old menuKey
    const { data: currentSection, error: fetchError } = await supabase
      .from("mega_menu_sections")
      .select("menu_key")
      .eq("id", id)
      .maybeSingle();

    if (fetchError || !currentSection) {
      console.error("MEGA-MENU PUT fetchError or section not found:", { fetchError, id });
      return NextResponse.json({ error: "Menü grubu bulunamadı" }, { status: 404 });
    }

    const oldKey = currentSection.menu_key;
    console.log("MEGA-MENU PUT oldKey:", oldKey, "newKey:", finalKey);

    // Update mega_menu_sections
    const { data, error } = await supabase
      .from("mega_menu_sections")
      .update({
        title: title.trim(),
        menu_key: finalKey,
        eyebrow: eyebrow?.trim() || "",
        is_active: is_active ?? true,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating section in Supabase:", error);
      return NextResponse.json({ error: `Güncelleme başarısız: ${error.message}` }, { status: 500 });
    }

    // Sync to menu_items (update label, mega_menu_key, url, and is_active)
    try {
      const { data: existingMenuItems } = await supabase
        .from("menu_items")
        .select("id")
        .eq("mega_menu_key", oldKey);

      if (existingMenuItems && existingMenuItems.length > 0) {
        const { error: menuItemsError } = await supabase
          .from("menu_items")
          .update({
            label: title.trim(),
            mega_menu_key: finalKey,
            url: `/${finalKey}`,
            is_active: is_active ?? true,
          })
          .eq("mega_menu_key", oldKey);

        if (menuItemsError) {
          console.error("Error updating menu items:", menuItemsError);
        }
      } else {
        // Doesn't exist, insert a new one
        const { data: maxSortData } = await supabase
          .from("menu_items")
          .select("sort_order")
          .eq("menu_key", "header")
          .order("sort_order", { ascending: false })
          .limit(1);
        
        const nextSortOrder = maxSortData && maxSortData[0] ? (maxSortData[0].sort_order || 0) + 1 : 1;

        const { error: menuItemsError } = await supabase
          .from("menu_items")
          .insert({
            menu_key: "header",
            label: title.trim(),
            url: `/${finalKey}`,
            mega_menu_key: finalKey,
            sort_order: nextSortOrder,
            is_active: is_active ?? true
          });

        if (menuItemsError) {
          console.error("Error inserting missing menu item:", menuItemsError);
        }
      }
    } catch (syncErr) {
      console.error("Failed to sync updated section to menu_items:", syncErr);
    }

    // If key changed, cascade to services and child records
    if (oldKey !== finalKey) {
      // Update services slug
      const { error: servicesError } = await supabase
        .from("services")
        .update({
          slug: finalKey
        })
        .eq("slug", oldKey);

      if (servicesError) {
        console.error("Error updating services slug on key rename:", servicesError);
      }

      // Update mega_menu_personas links (starting with /oldKey)
      const { data: personas } = await supabase
        .from("mega_menu_personas")
        .select("id, href")
        .eq("section_id", id);

      if (personas) {
        const updatedPersonas = personas.map((p) => {
          let newHref = p.href;
          if (p.href.startsWith(`/${oldKey}`)) {
            newHref = p.href.replace(`/${oldKey}`, `/${finalKey}`);
          }
          return { id: p.id, href: newHref };
        });
        if (updatedPersonas.length > 0) {
          await supabase.from("mega_menu_personas").upsert(updatedPersonas);
        }
      }

      // Update mega_menu_items links (starting with /oldKey)
      const { data: items } = await supabase
        .from("mega_menu_items")
        .select("id, href")
        .eq("section_id", id);

      if (items) {
        const updatedItems = items.map((it) => {
          let newHref = it.href;
          if (it.href.startsWith(`/${oldKey}`)) {
            newHref = it.href.replace(`/${oldKey}`, `/${finalKey}`);
          }
          return { id: it.id, href: newHref };
        });
        if (updatedItems.length > 0) {
          await supabase.from("mega_menu_items").upsert(updatedItems);
        }
      }

      revalidatePath(`/${oldKey}`);
      revalidatePath(`/${finalKey}`);
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/mega-menu");

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("PUT error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// 3. Delete a section
export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Kimlik (id) zorunludur" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Get the menuKey before deleting
    const { data: currentSection, error: fetchError } = await supabase
      .from("mega_menu_sections")
      .select("menu_key")
      .eq("id", id)
      .maybeSingle();

    const menuKey = currentSection?.menu_key;

    // Delete mega_menu_sections (which cascades to personas and items)
    const { error } = await supabase
      .from("mega_menu_sections")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting section:", error);
      return NextResponse.json({ error: `Silme işlemi başarısız: ${error.message}` }, { status: 500 });
    }

    // Delete matching menu_items and services
    if (menuKey) {
      await supabase.from("menu_items").delete().eq("mega_menu_key", menuKey);
      await supabase.from("services").delete().eq("slug", menuKey);
      revalidatePath(`/${menuKey}`);
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/mega-menu");

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
