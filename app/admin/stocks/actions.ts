"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/admin/service-system";

export type MaterialInput = {
  id?: string;
  name: string;
  category?: string;
  brand?: string;
  model?: string;
  barcode?: string;
  sku?: string;
  stock_quantity: number;
  min_stock_level: number;
  buying_price: number;
  selling_price: number;
  supplier?: string;
  purchase_date?: string;
  purchase_invoice_number?: string;
  warranty_months?: number;
  location?: string;
  description?: string;
  is_active: boolean;
};

// Check barcode uniqueness
export async function isBarcodeUnique(barcode: string, excludeId?: string): Promise<boolean> {
  if (!barcode) return true;
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from('materials')
    .select('id')
    .eq('barcode', barcode)
    .is('deleted_at', null);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data } = await query;
  return !data || data.length === 0;
}

// Check SKU uniqueness
export async function isSkuUnique(sku: string, excludeId?: string): Promise<boolean> {
  if (!sku) return true;
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from('materials')
    .select('id')
    .eq('sku', sku)
    .is('deleted_at', null);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data } = await query;
  return !data || data.length === 0;
}

// Save or Update Material
export async function saveMaterial(input: MaterialInput) {
  const supabase = await createSupabaseServerClient();
  let savedMaterialId = input.id;

  try {
    if (input.barcode) {
      const isBUnique = await isBarcodeUnique(input.barcode, input.id);
      if (!isBUnique) {
        return { success: false, error: "Bu barkod ile kayıtlı başka bir malzeme zaten var." };
      }
    }

    if (input.sku) {
      const isSUnique = await isSkuUnique(input.sku, input.id);
      if (!isSUnique) {
        return { success: false, error: "Bu stok kodu (SKU) ile kayıtlı başka bir malzeme zaten var." };
      }
    }

    if (input.id) {
      const { data: oldData } = await supabase.from('materials').select('*').eq('id', input.id).maybeSingle();

      const { data, error } = await supabase
        .from('materials')
        .update({
          name: input.name,
          category: input.category || null,
          brand: input.brand || null,
          model: input.model || null,
          barcode: input.barcode || null,
          sku: input.sku || null,
          stock_quantity: input.stock_quantity,
          min_stock_level: input.min_stock_level,
          buying_price: input.buying_price,
          selling_price: input.selling_price,
          supplier: input.supplier || null,
          purchase_date: input.purchase_date || null,
          purchase_invoice_number: input.purchase_invoice_number || null,
          warranty_months: Math.max(0, Math.trunc(Number(input.warranty_months || 0))),
          location: input.location || null,
          description: input.description || null,
          is_active: input.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', input.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      savedMaterialId = data.id;

      // Handle stock adjustment logs manually if stock quantity changed
      if (oldData && Number(oldData.stock_quantity) !== Number(input.stock_quantity)) {
        const diff = Number(input.stock_quantity) - Number(oldData.stock_quantity);
        await supabase.from('stock_movements').insert({
          material_id: input.id,
          type: 'adjustment',
          quantity: Math.abs(diff),
          description: `Manuel Stok Düzeltme (Eski: ${oldData.stock_quantity} -> Yeni: ${input.stock_quantity})`,
        });
      }

      await logActivity('UPDATE', 'materials', input.id, oldData, data);
    } else {
      const { data, error } = await supabase
        .from('materials')
        .insert({
          name: input.name,
          category: input.category || null,
          brand: input.brand || null,
          model: input.model || null,
          barcode: input.barcode || null,
          sku: input.sku || null,
          stock_quantity: input.stock_quantity,
          min_stock_level: input.min_stock_level,
          buying_price: input.buying_price,
          selling_price: input.selling_price,
          supplier: input.supplier || null,
          purchase_date: input.purchase_date || null,
          purchase_invoice_number: input.purchase_invoice_number || null,
          warranty_months: Math.max(0, Math.trunc(Number(input.warranty_months || 0))),
          location: input.location || null,
          description: input.description || null,
          is_active: input.is_active ?? true,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      savedMaterialId = data.id;

      // Log stock movement for initial stock
      if (input.stock_quantity > 0) {
        await supabase.from('stock_movements').insert({
          material_id: data.id,
          type: 'in',
          quantity: input.stock_quantity,
          description: 'İlk Stok Girişi',
        });
      }

      await logActivity('INSERT', 'materials', data.id, null, data);
    }

    revalidatePath("/admin/stocks");
    revalidatePath("/admin/service-orders");
    revalidatePath("/admin");
    return { success: true, id: savedMaterialId };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Malzeme kaydedilemedi." };
  }
}

// Soft delete material
export async function deleteMaterial(id: string) {
  const supabase = await createSupabaseServerClient();
  try {
    const { data: oldData } = await supabase.from('materials').select('*').eq('id', id).maybeSingle();
    const { data, error } = await supabase
      .from('materials')
      .update({ deleted_at: new Date().toISOString(), is_active: false })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    await logActivity('UPDATE', 'materials', id, oldData, data);

    revalidatePath("/admin/stocks");
    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Malzeme silinemedi." };
  }
}

// Soft delete ALL materials (bulk clear)
export async function deleteAllMaterials() {
  const supabase = await createSupabaseServerClient();
  try {
    const { error } = await supabase
      .from('materials')
      .update({ deleted_at: new Date().toISOString(), is_active: false })
      .is('deleted_at', null);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/stocks");
    revalidatePath("/admin/service-orders");
    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Stoklar temizlenemedi." };
  }
}
