"use server";

import { revalidatePath } from "next/cache";
import fs from "node:fs";
import path from "node:path";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logActivity, generateServiceOrderNumber } from "@/lib/admin/service-system";
import { toTurkeyDateKey } from "@/lib/admin/calendar-date";

export type ServiceOrderInput = {
  id?: string;
  appointment_id?: string | null;
  customer_id: string;
  started_at?: string | null;
  finished_at?: string | null;
  labor_hours?: number;
  labor_cost?: number;
  labor_price?: number;
  transportation_cost?: number;
  employee_cost?: number;
  other_costs?: number;
  discount?: number;
  tax_rate?: number;
  status: 'Taslak' | 'İşlem Başladı' | 'Malzeme Bekleniyor' | 'Tamamlandı' | 'İptal Edildi';
  personnel_notes?: string;
  customer_notes?: string;
};

// Recalculate financial fields for a service order
export async function recalculateOrderTotals(orderId: string, supabaseClient?: any) {
  const supabase = supabaseClient || await createSupabaseServerClient();

  // 1. Get service order details
  const { data: order, error: orderErr } = await supabase
    .from('service_orders')
    .select('*')
    .eq('id', orderId)
    .maybeSingle();

  if (orderErr || !order) return { success: false, error: "İş emri bulunamadı." };

  // 2. Sum materials costs and sales prices
  const { data: orderMaterials, error: matErr } = await supabase
    .from('service_order_materials')
    .select('total_buying_cost, total_selling_price')
    .eq('service_order_id', orderId);

  if (matErr) return { success: false, error: "Malzemeler hesaplanırken hata oluştu." };

  let totalMaterialCost = 0;
  let totalMaterialSelling = 0;

  if (orderMaterials) {
    orderMaterials.forEach((m: any) => {
      totalMaterialCost += Number(m.total_buying_cost || 0);
      totalMaterialSelling += Number(m.total_selling_price || 0);
    });
  }

  // 3. Sum payments
  const { data: payments, error: payErr } = await supabase
    .from('payments')
    .select('amount')
    .eq('service_order_id', orderId);

  let totalPaid = 0;
  if (!payErr && payments) {
    payments.forEach((p: any) => {
      totalPaid += Number(p.amount || 0);
    });
  }

  // 4. Compute financial totals
  // Toplam maliyet = Malzeme maliyeti + işçilik maliyeti + ulaşım maliyeti + personel maliyeti + diğer giderler
  const laborCost = Number(order.labor_cost || 0);
  const transportationCost = Number(order.transportation_cost || 0);
  const employeeCost = Number(order.employee_cost || 0);
  const otherCosts = Number(order.other_costs || 0);

  const totalCost = totalMaterialCost + laborCost + transportationCost + employeeCost + otherCosts;

  // Genel toplam = Malzeme satış fiyatı + müşteriye yansıtılan işçilik + vergi - indirim
  const laborPrice = Number(order.labor_price || 0);
  const discount = Number(order.discount || 0);
  const taxRate = Number(order.tax_rate || 0);

  const taxableAmount = Math.max(0, totalMaterialSelling + laborPrice - discount);
  const taxAmount = taxableAmount * (taxRate / 100);
  const grandTotal = taxableAmount + taxAmount;

  // Net kâr = Genel toplam - toplam maliyet
  const netProfit = grandTotal - totalCost;

  // Update order with computed values
  const { data: updatedOrder, error: updateErr } = await supabase
    .from('service_orders')
    .update({
      total_cost: totalCost,
      tax_amount: taxAmount,
      grand_total: grandTotal,
      paid_amount: totalPaid,
      net_profit: netProfit,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .select()
    .single();

  if (updateErr) return { success: false, error: updateErr.message };

  return { success: true, data: updatedOrder };
}

// Save or Update Service Order
export async function saveServiceOrder(input: ServiceOrderInput) {
  const supabase = await createSupabaseServerClient();

  try {
    if (input.id) {
      // Fetch old values
      const { data: oldData } = await supabase.from('service_orders').select('*').eq('id', input.id).maybeSingle();

      const { data, error } = await supabase
        .from('service_orders')
        .update({
          appointment_id: input.appointment_id || null,
          customer_id: input.customer_id,
          started_at: input.started_at || null,
          finished_at: input.finished_at || null,
          labor_hours: input.labor_hours || 0,
          labor_cost: input.labor_cost || 0,
          labor_price: input.labor_price || 0,
          transportation_cost: input.transportation_cost || 0,
          employee_cost: input.employee_cost || 0,
          other_costs: input.other_costs || 0,
          discount: input.discount || 0,
          tax_rate: input.tax_rate || 0,
          status: input.status,
          personnel_notes: input.personnel_notes || null,
          customer_notes: input.customer_notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', input.id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      // Recalculate totals
      await recalculateOrderTotals(input.id, supabase);

      // Fetch final updated data for log
      const { data: finalData } = await supabase.from('service_orders').select('*').eq('id', input.id).single();
      await logActivity('UPDATE', 'service_orders', input.id, oldData, finalData);

      // If status changed to 'Tamamlandı', update appointment status to 'İşlem Tamamlandı'
      if (input.status === 'Tamamlandı' && input.appointment_id) {
        await supabase
          .from('appointments')
          .update({ status: 'İşlem Tamamlandı', updated_at: new Date().toISOString() })
          .eq('id', input.appointment_id);
      }
    } else {
      const orderNumber = await generateServiceOrderNumber();
      const { data, error } = await supabase
        .from('service_orders')
        .insert({
          order_number: orderNumber,
          appointment_id: input.appointment_id || null,
          customer_id: input.customer_id,
          started_at: input.started_at || null,
          finished_at: input.finished_at || null,
          labor_hours: input.labor_hours || 0,
          labor_cost: input.labor_cost || 0,
          labor_price: input.labor_price || 0,
          transportation_cost: input.transportation_cost || 0,
          employee_cost: input.employee_cost || 0,
          other_costs: input.other_costs || 0,
          discount: input.discount || 0,
          tax_rate: input.tax_rate || 0,
          status: input.status,
          personnel_notes: input.personnel_notes || null,
          customer_notes: input.customer_notes || null,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);

      // Recalculate totals
      await recalculateOrderTotals(data.id, supabase);

      // Fetch final updated data for log
      const { data: finalData } = await supabase.from('service_orders').select('*').eq('id', data.id).single();
      await logActivity('INSERT', 'service_orders', data.id, null, finalData);

      // If status is 'Tamamlandı' and we have an appointment
      if (input.status === 'Tamamlandı' && input.appointment_id) {
        await supabase
          .from('appointments')
          .update({ status: 'İşlem Tamamlandı', updated_at: new Date().toISOString() })
          .eq('id', input.appointment_id);
      }
      
      input.id = data.id; // Assign ID back
    }

    revalidatePath("/admin/service-orders");
    if (input.appointment_id) revalidatePath("/admin/calendar");
    revalidatePath(`/admin/customers/${input.customer_id}`);
    return { success: true, id: input.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "İş emri kaydedilemedi." };
  }
}

// Add material to Service Order (Checking stock, triggering database auto stock update)
export async function addMaterialToOrder(
  serviceOrderId: string,
  materialId: string | null,
  input: {
    name: string;
    category?: string;
    brand?: string;
    model?: string;
    serial_number?: string;
    unit: 'Adet' | 'Metre' | 'Paket' | 'Kutu' | 'Kilogram' | 'Litre' | 'Set';
    quantity: number;
    buying_price: number;
    selling_price: number;
    warranty_months?: number;
    description?: string;
  }
) {
  const supabase = await createSupabaseServerClient();
  try {
    // 1. If materialId is provided, check if we have enough stock (prevent negative stock)
    if (materialId) {
      const { data: material } = await supabase
        .from('materials')
        .select('stock_quantity, name')
        .eq('id', materialId)
        .maybeSingle();

      if (!material) return { success: false, error: "Seçilen stok kartı bulunamadı." };
      
      if (Number(material.stock_quantity) < input.quantity) {
        return { 
          success: false, 
          error: `Yetersiz stok! Mevcut stok: ${Number(material.stock_quantity)} ${input.unit}, talep edilen: ${input.quantity} ${input.unit}.` 
        };
      }
    }

    // 2. Insert order material record (Triggers will deduct stock automatically)
    const totalBuyingCost = input.quantity * input.buying_price;
    const totalSellingPrice = input.quantity * input.selling_price;
    const profit = totalSellingPrice - totalBuyingCost;

    const { data: newMat, error } = await supabase
      .from('service_order_materials')
      .insert({
        service_order_id: serviceOrderId,
        material_id: materialId || null,
        name: input.name,
        category: input.category || null,
        brand: input.brand || null,
        model: input.model || null,
        serial_number: input.serial_number || null,
        unit: input.unit,
        quantity: input.quantity,
        buying_price: input.buying_price,
        total_buying_cost: totalBuyingCost,
        selling_price: input.selling_price,
        total_selling_price: totalSellingPrice,
        profit,
        warranty_months: input.warranty_months || 0,
        description: input.description || null,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    // 3. Recalculate totals
    await recalculateOrderTotals(serviceOrderId, supabase);

    // Log action
    await logActivity('INSERT', 'service_order_materials', newMat.id, null, newMat);

    revalidatePath(`/admin/service-orders/${serviceOrderId}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Malzeme eklenemedi." };
  }
}

// Remove Material from Order (Stok quantities will be returned automatically by DB trigger)
export async function removeMaterialFromOrder(materialRecordId: string, serviceOrderId: string) {
  const supabase = await createSupabaseServerClient();
  try {
    const { data: oldData } = await supabase.from('service_order_materials').select('*').eq('id', materialRecordId).maybeSingle();
    if (!oldData) return { success: false, error: "Malzeme kaydı bulunamadı." };

    const { error } = await supabase
      .from('service_order_materials')
      .delete()
      .eq('id', materialRecordId);

    if (error) throw new Error(error.message);

    // Recalculate totals
    await recalculateOrderTotals(serviceOrderId, supabase);

    // Log activity
    await logActivity('DELETE', 'service_order_materials', materialRecordId, oldData, null);

    revalidatePath(`/admin/service-orders/${serviceOrderId}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Malzeme kaldırılamadı." };
  }
}

// Add Payment
export async function addPayment(input: {
  customer_id: string;
  service_order_id?: string | null;
  payment_date: string;
  amount: number;
  method: 'Nakit' | 'Kredi Kartı' | 'Banka Havalesi' | 'EFT' | 'Çek' | 'Diğer';
  transaction_number?: string;
  received_by_employee_id?: string | null;
  description?: string;
}) {
  const supabase = await createSupabaseServerClient();
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert({
        customer_id: input.customer_id,
        service_order_id: input.service_order_id || null,
        payment_date: input.payment_date,
        amount: input.amount,
        method: input.method,
        transaction_number: input.transaction_number || null,
        received_by_employee_id: input.received_by_employee_id || null,
        description: input.description || null,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    if (input.service_order_id) {
      await recalculateOrderTotals(input.service_order_id, supabase);
      revalidatePath(`/admin/service-orders/${input.service_order_id}`);
    }
    
    await logActivity('INSERT', 'payments', data.id, null, data);
    
    revalidatePath(`/admin/customers/${input.customer_id}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Ödeme kaydedilemedi." };
  }
}

// Delete Payment
export async function deletePayment(id: string, serviceOrderId?: string | null, customerId?: string) {
  const supabase = await createSupabaseServerClient();
  try {
    const { data: oldData } = await supabase.from('payments').select('*').eq('id', id).maybeSingle();
    if (!oldData) return { success: false, error: "Ödeme kaydı bulunamadı." };

    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    if (serviceOrderId) {
      await recalculateOrderTotals(serviceOrderId, supabase);
      revalidatePath(`/admin/service-orders/${serviceOrderId}`);
    }

    await logActivity('DELETE', 'payments', id, oldData, null);

    if (customerId) revalidatePath(`/admin/customers/${customerId}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Ödeme silinemedi." };
  }
}

// Upload file details
export async function addServiceFileRecord(input: {
  service_order_id: string;
  file_path: string;
  file_name: string;
  file_type: 'before_photo' | 'after_photo' | 'document';
}) {
  const supabase = await createSupabaseServerClient();
  try {
    const { data, error } = await supabase
      .from('service_files')
      .insert({
        service_order_id: input.service_order_id,
        file_path: input.file_path,
        file_name: input.file_name,
        file_type: input.file_type,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    await logActivity('INSERT', 'service_files', data.id, null, data);
    revalidatePath(`/admin/service-orders/${input.service_order_id}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Dosya kaydı eklenemedi." };
  }
}

// Delete file details
export async function deleteServiceFileRecord(id: string, serviceOrderId: string) {
  const supabase = await createSupabaseServerClient();
  try {
    const { data: oldData } = await supabase.from('service_files').select('*').eq('id', id).maybeSingle();
    if (!oldData) return { success: false, error: "Dosya kaydı bulunamadı." };

    const { error } = await supabase
      .from('service_files')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    await logActivity('DELETE', 'service_files', id, oldData, null);
    revalidatePath(`/admin/service-orders/${serviceOrderId}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Dosya silinemedi." };
  }
}

// Upload file to local public/uploads directory
export async function uploadFileBase64(
  base64Data: string,
  fileName: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Extract base64 content
    const base64Content = base64Data.includes(",") ? base64Data.split(",")[1] : base64Data;
    const buffer = Buffer.from(base64Content, "base64");
    
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadsDir, safeName);
    
    fs.writeFileSync(filePath, buffer);
    
    return { success: true, url: `/uploads/${safeName}` };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Dosya yüklenemedi." };
  }
}

export async function createDirectServiceOrder(input: {
  customer_id: string;
  service_name: string;
  service_price: number;
  appointment_date?: string;
  start_time?: string;
  material_id?: string;
  material_quantity?: number;
  is_paid?: boolean;
  payment_method?: string;
}) {
  const supabase = await createSupabaseServerClient();
  let appointmentId: string | null = null;
  let createdOrderId: string | null = null;
  try {
    let selectedMaterial: any = null;
    if (input.material_id && input.material_quantity && input.material_quantity > 0) {
      const { data: material, error: materialError } = await supabase
        .from('materials')
        .select('id, name, category, brand, model, stock_quantity, buying_price, selling_price')
        .eq('id', input.material_id)
        .eq('is_active', true)
        .is('deleted_at', null)
        .maybeSingle();
      if (materialError || !material) throw new Error("Seçilen malzeme bulunamadı veya aktif değil.");
      if (Number(material.stock_quantity) < input.material_quantity) {
        throw new Error(`Yetersiz stok! Mevcut: ${material.stock_quantity}, istenen: ${input.material_quantity}.`);
      }
      selectedMaterial = material;
    }

    // Eğer tarih girilmişse takvime (appointment) de ekle
    if (input.appointment_date && input.start_time) {
      const { data: appData, error: appErr } = await supabase
        .from('appointments')
        .insert({
          customer_id: input.customer_id,
          appointment_date: input.appointment_date,
          start_time: input.start_time,
          end_time: `${String((Number(input.start_time.split(':')[0]) + 1) % 24).padStart(2, '0')}:${input.start_time.split(':')[1] || '00'}`,
          service_type: input.service_name,
          priority: 'normal',
          status: 'Planlandı',
        })
        .select()
        .single();
        
      if (appErr) throw new Error("Takvim randevusu oluşturulamadı: " + appErr.message);
      appointmentId = appData.id;
    }

    // İş Emrini Oluştur
    const orderNumber = await generateServiceOrderNumber();
    
    // Eğer takvim (appointment) yoksa işlemi direkt tamamlandı olarak işaretle
    const initialStatus = input.appointment_date ? 'Taslak' : 'Tamamlandı';

    const { data: orderData, error: orderErr } = await supabase
      .from('service_orders')
      .insert({
        order_number: orderNumber,
        appointment_id: appointmentId,
        customer_id: input.customer_id,
        labor_price: input.service_price, // Hizmet satış fiyatı (ya da malzeme toplamı)
        status: initialStatus,
        started_at: initialStatus === 'Tamamlandı' ? new Date().toISOString() : null,
        finished_at: initialStatus === 'Tamamlandı' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (orderErr) throw new Error("İş emri oluşturulamadı: " + orderErr.message);
    createdOrderId = orderData.id;

    // Eğer Stok/Malzeme seçilmişse, malzemeyi ekle (addMaterialToOrder trigger ile stok düşer)
    if (input.material_id && input.material_quantity && input.material_quantity > 0) {
      if (selectedMaterial) {
        const materialResult = await addMaterialToOrder(orderData.id, input.material_id, {
          name: selectedMaterial.name,
          category: selectedMaterial.category,
          brand: selectedMaterial.brand,
          model: selectedMaterial.model,
          unit: 'Adet',
          quantity: input.material_quantity,
          buying_price: Number(selectedMaterial.buying_price || 0),
          selling_price: Number(selectedMaterial.selling_price || 0),
          description: "Hızlı satış ekranından eklendi.",
        });
        if (!materialResult.success) throw new Error(materialResult.error || "Malzeme iş emrine eklenemedi.");
      }
    }

    const totalsResult = await recalculateOrderTotals(orderData.id, supabase);
    if (!totalsResult.success || !totalsResult.data) {
      throw new Error(totalsResult.error || "İş emri toplamları hesaplanamadı.");
    }

    // Eğer Tahsilat alındıysa (is_paid = true)
    if (input.is_paid) {
      const paymentAmount = Number(totalsResult.data.grand_total || 0);
      if (paymentAmount <= 0) throw new Error("Ödeme kaydı için toplam tutar sıfırdan büyük olmalı.");
      const paymentResult = await addPayment({
        customer_id: input.customer_id,
        service_order_id: orderData.id,
        payment_date: toTurkeyDateKey(),
        amount: paymentAmount,
        method: (input.payment_method as any) || 'Nakit',
        description: "Peşin Tahsilat (Hızlı İşlem)",
      });
      if (!paymentResult.success) throw new Error(paymentResult.error || "Tahsilat kaydedilemedi.");
      await recalculateOrderTotals(orderData.id, supabase);
    }
    
    revalidatePath("/admin/service-orders");
    if (appointmentId) revalidatePath("/admin/calendar");
    
    return { success: true, order_id: orderData.id };
  } catch (err) {
    if (createdOrderId) await supabase.from('service_orders').delete().eq('id', createdOrderId);
    if (appointmentId) await supabase.from('appointments').delete().eq('id', appointmentId);
    return { success: false, error: err instanceof Error ? err.message : "Sistem hatası." };
  }
}
