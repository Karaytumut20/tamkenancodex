import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const { featured } = await req.json();
    const supabase = createSupabaseServiceClient();

    // Önce mevcutları sil
    const { error: deleteError } = await supabase
      .from("homepage_featured_products")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // trick to delete all

    if (deleteError) throw deleteError;

    // Yeni listeyi ekle
    if (featured && featured.length > 0) {
      const insertData = featured.map((f: any) => ({
        source_id: f.source_id,
        source_type: f.source_type,
        sort_order: f.sort_order
      }));

      const { error: insertError } = await supabase
        .from("homepage_featured_products")
        .insert(insertData);

      if (insertError) throw insertError;
    }

    // Revalidate paths to purge Next.js Full Route Cache and Data Cache
    revalidatePath("/admin/homepage/featured-products");
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Save featured error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
