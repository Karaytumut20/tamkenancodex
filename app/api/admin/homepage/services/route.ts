import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";

export async function POST(req: Request) {
  try {
    await requireAdmin(["super_admin", "editor"]);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { tabs, services } = await req.json();
    const supabase = createSupabaseServiceClient();

    // 1. Sekmeleri (Tabs) senkronize et
    // Mevcut sekmeleri çek
    const { data: existingTabs } = await supabase.from("homepage_service_tabs").select("id");
    const existingTabIds = existingTabs?.map(t => t.id) || [];
    const incomingTabIds = tabs.map((t: any) => t.id);

    // Silinen sekmeleri bul ve sil
    const tabsToDelete = existingTabIds.filter(id => !incomingTabIds.includes(id));
    if (tabsToDelete.length > 0) {
      await supabase.from("homepage_service_tabs").delete().in("id", tabsToDelete);
    }

    // Yeni ve güncellenen sekmeleri kaydet
    if (tabs && tabs.length > 0) {
      const { error: tabError } = await supabase.from("homepage_service_tabs").upsert(
        tabs.map((t: any) => ({
          id: t.id,
          title: t.title,
          sort_order: t.sort_order
        }))
      );
      if (tabError) throw tabError;
    }

    // 2. Servisleri (Kartları) senkronize et
    const { data: existingServices } = await supabase.from("homepage_services").select("id");
    const existingServiceIds = existingServices?.map(s => s.id) || [];
    const incomingServiceIds = services.map((s: any) => s.id);

    const servicesToDelete = existingServiceIds.filter(id => !incomingServiceIds.includes(id));
    if (servicesToDelete.length > 0) {
      await supabase.from("homepage_services").delete().in("id", servicesToDelete);
    }

    if (services && services.length > 0) {
      const { error: serviceError } = await supabase.from("homepage_services").upsert(
        services.map((s: any) => ({
          id: s.id,
          tab_id: s.tab_id,
          title: s.title,
          description: s.description || null,
          image: s.image || null,
          link: s.link || null,
          sort_order: s.sort_order
        }))
      );
      if (serviceError) throw serviceError;
    }

    // Revalidate paths to purge Next.js Full Route Cache and Data Cache
    revalidatePath("/admin/homepage/services");
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Save services VERBOSE error:", error);
    console.error("Stack:", error.stack);
    return new NextResponse("Internal Server Error: " + error.message, { status: 500 });
  }
}
