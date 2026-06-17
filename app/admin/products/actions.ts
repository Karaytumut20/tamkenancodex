"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteProduct(id: string, type: "product" | "oksid") {
  const supabase = await createSupabaseServerClient();
  
  if (type === "product") {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("oksid_urunler").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/products");
  revalidatePath("/urunler");
}
