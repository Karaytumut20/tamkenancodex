import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireSupabasePublicEnv } from "@/lib/supabase/env";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { randomUUID } from "crypto";

function getSupabaseAdmin() {
  const env = requireSupabasePublicEnv();
  // Use service role if available, otherwise fallback to anon (RLS handles auth via session)
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? env.anonKey;
  return createClient(env.url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  // Verify admin session
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await params;
  const body = await req.json();
  const { section, personas, items, servicePage } = body as {
    section: Record<string, unknown>;
    personas: Record<string, unknown>[];
    items: Record<string, unknown>[];
    servicePage?: {
      title: string;
      hero_title: string;
      hero_description: string;
      intro_title: string;
      intro_content: string;
      advantages: string[];
      usage_areas: string[];
      process_steps: string[];
      faqs: { question: string; answer: string }[];
      related_product_ids?: string[];
      deep_dive?: { title: string; text: string }[];
    } | null;
  };

  const supabase = getSupabaseAdmin();

  try {
    // 1. Upsert section
    const { data: sectionData, error: sectionErr } = await supabase
      .from("mega_menu_sections")
      .upsert(
        {
          menu_key: key,
          title: section.title,
          eyebrow: section.eyebrow,
          insight_title: section.insight_title,
          insight_body: section.insight_body,
          is_active: section.is_active ?? true,
        },
        { onConflict: "menu_key" },
      )
      .select("id")
      .single();

    if (sectionErr || !sectionData) {
      console.error("Section upsert error:", sectionErr);
      return NextResponse.json({ error: "Section save failed" }, { status: 500 });
    }

    const sectionId = (sectionData as any).id as string;

    // 2. Upsert personas
    if (personas !== undefined) {
      if (personas.length === 0) {
        await supabase.from("mega_menu_personas").delete().eq("section_id", sectionId);
      } else {
      const personaRows = personas.map((p, idx) => ({
        id: p.id || randomUUID(),
        section_id: sectionId,
        title: p.title,
        description: p.description ?? "",
        href: p.href,
        sort_order: idx,
        is_active: p.is_active ?? true,
      }));

      // Delete removed personas (those not in the new list)
      const keepIds = personaRows.map((p) => p.id);
      if (keepIds.length > 0) {
        await supabase
          .from("mega_menu_personas")
          .delete()
          .eq("section_id", sectionId)
          .not("id", "in", `(${keepIds.join(",")})`);
      } else {
        // No existing IDs → delete all and re-insert
        await supabase.from("mega_menu_personas").delete().eq("section_id", sectionId);
      }

      const { error: personaErr } = await supabase
        .from("mega_menu_personas")
        .upsert(personaRows, { onConflict: "id" });
      if (personaErr) console.error("Persona upsert error:", personaErr);
      }
    }

    // 3. Upsert items
    if (items && items.length > 0) {
      const itemRows = items.map((it, idx) => ({
        id: it.id || randomUUID(),
        section_id: sectionId,
        title: it.title,
        href: it.href,
        image_url: it.image_url ?? "",
        sort_order: idx,
        is_active: it.is_active ?? true,
        source_type: it.source_type ?? "custom",
        source_id: it.source_id ?? null,
      }));

      const keepItemIds = itemRows.filter((i) => i.id).map((i) => i.id);
      if (keepItemIds.length > 0) {
        await supabase
          .from("mega_menu_items")
          .delete()
          .eq("section_id", sectionId)
          .not("id", "in", `(${keepItemIds.join(",")})`);
      } else {
        await supabase.from("mega_menu_items").delete().eq("section_id", sectionId);
      }

      const { error: itemErr } = await supabase
        .from("mega_menu_items")
        .upsert(itemRows, { onConflict: "id" });
      if (itemErr) console.error("Items upsert error:", itemErr);
    }

    // 4. Save Service Page if provided
    if (servicePage !== undefined) {
      if (servicePage === null) {
        await supabase
          .from("services")
          .update({ is_active: false })
          .eq("slug", key);
      } else {
        const { error: serviceErr } = await supabase
          .from("services")
          .upsert(
            {
              slug: key,
              title: servicePage.title,
              hero_title: servicePage.hero_title,
              hero_description: servicePage.hero_description,
              intro_title: servicePage.intro_title,
              intro_content: servicePage.intro_content,
              advantages: servicePage.advantages,
              usage_areas: servicePage.usage_areas,
              process_steps: servicePage.process_steps,
              faqs: servicePage.faqs,
              related_product_ids: servicePage.related_product_ids || [],
              deep_dive: servicePage.deep_dive || [],
              is_active: true,
            },
            { onConflict: "slug" }
          );

        if (serviceErr) {
          console.error("Service page upsert error:", serviceErr);
          return NextResponse.json({ error: "Service page save failed: " + serviceErr.message }, { status: 500 });
        }
      }
    }

    // Sync/update menu_items record to keep label and is_active in sync
    try {
      const { data: existingMenuItems } = await supabase
        .from("menu_items")
        .select("id")
        .eq("mega_menu_key", key);

      if (existingMenuItems && existingMenuItems.length > 0) {
        const { error: menuItemsError } = await supabase
          .from("menu_items")
          .update({
            label: String(section.title).trim(),
            is_active: section.is_active ?? true,
          })
          .eq("mega_menu_key", key);

        if (menuItemsError) {
          console.error("Error syncing menu items on detail save:", menuItemsError);
        }
      } else {
        // If it somehow doesn't exist, create it
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
            label: String(section.title).trim(),
            url: `/${key}`,
            mega_menu_key: key,
            sort_order: nextSortOrder,
            is_active: section.is_active ?? true
          });

        if (menuItemsError) {
          console.error("Error inserting missing menu item on detail save:", menuItemsError);
        }
      }
    } catch (syncErr) {
      console.error("Failed to sync section details to menu_items:", syncErr);
    }

    // 5. Revalidate public pages
    revalidatePath("/", "layout");
    revalidatePath(`/${key}`);

    return NextResponse.json({ success: true, sectionId });
  } catch (err) {
    console.error("Mega menu save error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
