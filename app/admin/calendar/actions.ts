"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkEmployeeConflict, logActivity, generateServiceOrderNumber } from "@/lib/admin/service-system";

export type AppointmentInput = {
  id?: string;
  customer_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  service_type: string;
  description?: string;
  customer_issue?: string;
  address?: string;
  city?: string;
  district?: string;
  location_link?: string;
  employee_id?: string;
  assistant_employee_id?: string;
  priority: 'normal' | 'önemli' | 'acil';
  status: 'Planlandı' | 'Müşteri Arandı' | 'Yola Çıkıldı' | 'İşlem Başladı' | 'Malzeme Bekleniyor' | 'İşlem Tamamlandı' | 'İptal Edildi' | 'Ertelendi' | 'Tahsilat Bekleniyor';
  internal_notes?: string;
  customer_notes?: string;
  reminder_time?: string;
};

// Create or update appointment
export async function saveAppointment(input: AppointmentInput) {
  const supabase = await createSupabaseServerClient();

  try {
    // 1. Conflict checking
    if (input.employee_id) {
      const conflict = await checkEmployeeConflict(
        input.employee_id,
        input.appointment_date,
        input.start_time,
        input.end_time,
        input.id
      );
      if (conflict) {
        return { 
          success: false, 
          error: `Atanan personel (${conflict.employee?.full_name}) o saatte başka bir işe atanmıştır. (${conflict.customer?.name} - ${conflict.start_time.substring(0, 5)})` 
        };
      }
    }

    if (input.id) {
      // Fetch old values for logging
      const { data: oldData } = await supabase.from('appointments').select('*').eq('id', input.id).maybeSingle();

      const { data, error } = await supabase
        .from('appointments')
        .update({
          customer_id: input.customer_id,
          appointment_date: input.appointment_date,
          start_time: input.start_time,
          end_time: input.end_time,
          service_type: input.service_type,
          description: input.description || null,
          customer_issue: input.customer_issue || null,
          address: input.address || null,
          city: input.city || null,
          district: input.district || null,
          location_link: input.location_link || null,
          employee_id: input.employee_id || null,
          assistant_employee_id: input.assistant_employee_id || null,
          priority: input.priority,
          status: input.status,
          internal_notes: input.internal_notes || null,
          customer_notes: input.customer_notes || null,
          reminder_time: input.reminder_time || '30_min',
          updated_at: new Date().toISOString(),
        })
        .eq('id', input.id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      // Handle service order automatic creation if status changes to completed/started
      if (input.status === 'İşlem Başladı' || input.status === 'İşlem Tamamlandı') {
        await ensureServiceOrderExists(input.id, input.customer_id);
      }

      await logActivity('UPDATE', 'appointments', input.id, oldData, data);
    } else {
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          customer_id: input.customer_id,
          appointment_date: input.appointment_date,
          start_time: input.start_time,
          end_time: input.end_time,
          service_type: input.service_type,
          description: input.description || null,
          customer_issue: input.customer_issue || null,
          address: input.address || null,
          city: input.city || null,
          district: input.district || null,
          location_link: input.location_link || null,
          employee_id: input.employee_id || null,
          assistant_employee_id: input.assistant_employee_id || null,
          priority: input.priority,
          status: input.status,
          internal_notes: input.internal_notes || null,
          customer_notes: input.customer_notes || null,
          reminder_time: input.reminder_time || '30_min',
        })
        .select()
        .single();

      if (error) throw new Error(error.message);

      if (input.status === 'İşlem Başladı' || input.status === 'İşlem Tamamlandı') {
        await ensureServiceOrderExists(data.id, input.customer_id);
      }

      await logActivity('INSERT', 'appointments', data.id, null, data);
    }

    revalidatePath("/admin/calendar");
    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Randevu kaydedilemedi." };
  }
}

// Ensure job/service order exists
async function ensureServiceOrderExists(appointmentId: string, customerId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: existing } = await supabase
    .from('service_orders')
    .select('id')
    .eq('appointment_id', appointmentId)
    .maybeSingle();

  if (!existing) {
    const orderNumber = await generateServiceOrderNumber();
    await supabase.from('service_orders').insert({
      order_number: orderNumber,
      appointment_id: appointmentId,
      customer_id: customerId,
      status: 'İşlem Başladı',
    });
  }
}

// Drag & drop date change Server Action
export async function updateAppointmentDate(id: string, newDate: string) {
  const supabase = await createSupabaseServerClient();

  try {
    const { data: oldData } = await supabase.from('appointments').select('*').eq('id', id).maybeSingle();
    if (!oldData) throw new Error("Randevu bulunamadı.");

    // Conflict check
    if (oldData.employee_id) {
      const conflict = await checkEmployeeConflict(
        oldData.employee_id,
        newDate,
        oldData.start_time,
        oldData.end_time,
        id
      );
      if (conflict) {
        return { 
          success: false, 
          error: `Atanan personel o tarihte başka bir işe atanmıştır. (${conflict.customer?.name} - ${conflict.start_time.substring(0, 5)})` 
        };
      }
    }

    const { data, error } = await supabase
      .from('appointments')
      .update({ appointment_date: newDate, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    await logActivity('UPDATE', 'appointments', id, oldData, data);
    revalidatePath("/admin/calendar");
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Tarih güncellenemedi." };
  }
}

// Delete/Cancel appointment
export async function deleteAppointment(id: string) {
  const supabase = await createSupabaseServerClient();
  try {
    const { data: oldData } = await supabase.from('appointments').select('*').eq('id', id).maybeSingle();
    
    // Soft delete or hard delete. Let's do soft delete if deleted_at exists, or update status to cancel.
    // The prompt says "Kayıtlar kalıcı olarak silinmek yerine mümkün olduğunca soft delete yöntemiyle pasif duruma alınsın."
    const { data, error } = await supabase
      .from('appointments')
      .update({ deleted_at: new Date().toISOString(), status: 'İptal Edildi' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    await logActivity('UPDATE', 'appointments', id, oldData, data);
    revalidatePath("/admin/calendar");
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Silme işlemi başarısız." };
  }
}

// Inline new customer creation from appointment modal
export async function createQuickCustomer(name: string, phone: string, address: string, type: 'bireysel' | 'kurumsal') {
  const supabase = await createSupabaseServerClient();
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert({
        name,
        phone,
        address,
        type,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: "Bu telefon numarasıyla kayıtlı bir müşteri zaten var." };
      }
      throw new Error(error.message);
    }

    await logActivity('INSERT', 'customers', data.id, null, data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Müşteri kaydedilemedi." };
  }
}
