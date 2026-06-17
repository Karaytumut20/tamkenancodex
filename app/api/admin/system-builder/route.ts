import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireSupabasePublicEnv } from "@/lib/supabase/env";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { randomUUID } from "crypto";

function getSupabaseAdmin() {
  const env = requireSupabasePublicEnv();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? env.anonKey;
  return createClient(env.url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { groups } = body as {
    groups: {
      id?: string;
      title: string;
      items: {
        id?: string;
        source_type: string;
        source_id: string;
        product_name: string;
        image_url: string;
      }[];
    }[];
  };

  const supabase = getSupabaseAdmin();

  try {
    // 1. Fetch existing groups
    const { data: existingGroups } = await supabase.from("system_builder_groups").select("id");
    const existingGroupIds = existingGroups?.map((g) => g.id) || [];

    const incomingGroupIds = groups.filter((g) => g.id).map((g) => g.id!);
    const groupsToDelete = existingGroupIds.filter((id) => !incomingGroupIds.includes(id));

    // Delete removed groups
    if (groupsToDelete.length > 0) {
      await supabase.from("system_builder_groups").delete().in("id", groupsToDelete);
    }

    // Process each group
    for (let i = 0; i < groups.length; i++) {
      const g = groups[i];
      let groupId = g.id;

      if (!groupId || !existingGroupIds.includes(groupId)) {
        // Create new group
        groupId = randomUUID();
        const { error: gErr } = await supabase.from("system_builder_groups").insert({
          id: groupId,
          title: g.title,
          sort_order: i,
          is_active: true,
        });
        if (gErr) throw gErr;
      } else {
        // Update existing
        const { error: gErr } = await supabase.from("system_builder_groups").update({
          title: g.title,
          sort_order: i,
          is_active: true,
          updated_at: new Date().toISOString(),
        }).eq("id", groupId);
        if (gErr) throw gErr;
      }

      // Sync items for this group
      const { data: existingItems } = await supabase
        .from("system_builder_items")
        .select("id")
        .eq("group_id", groupId);

      const existingItemIds = existingItems?.map((x) => x.id) || [];
      const incomingItemIds = g.items.filter((x) => x.id).map((x) => x.id!);
      const itemsToDelete = existingItemIds.filter((id) => !incomingItemIds.includes(id));

      if (itemsToDelete.length > 0) {
        await supabase.from("system_builder_items").delete().in("id", itemsToDelete);
      }

      for (let j = 0; j < g.items.length; j++) {
        const item = g.items[j];
        if (!item.id || !existingItemIds.includes(item.id)) {
          // Insert
          await supabase.from("system_builder_items").insert({
            id: randomUUID(),
            group_id: groupId,
            source_type: item.source_type,
            source_id: item.source_id,
            product_name: item.product_name,
            image_url: item.image_url,
            sort_order: j,
            is_active: true,
          });
        } else {
          // Update
          await supabase.from("system_builder_items").update({
            source_type: item.source_type,
            source_id: item.source_id,
            product_name: item.product_name,
            image_url: item.image_url,
            sort_order: j,
            is_active: true,
            updated_at: new Date().toISOString(),
          }).eq("id", item.id);
        }
      }
    }

    revalidatePath("/kendi-sistemini-tasarla");
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("System Builder Update Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
