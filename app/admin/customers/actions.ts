"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/admin/service-system";

export type CustomerInput = {
  id?: string;
  name: string;
  type: 'bireysel' | 'kurumsal';
  contact_person?: string;
  phone: string;
  phone_secondary?: string;
  email?: string;
  tax_number?: string;
  tax_office?: string;
  address?: string;
  city?: string;
  district?: string;
  location_link?: string;
  notes?: string;
  is_active?: boolean;
};

// Check if phone number is unique
export async function isPhoneUnique(phone: string, excludeId?: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from('customers')
    .select('id')
    .eq('phone', phone)
    .is('deleted_at', null);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data } = await query;
  return !data || data.length === 0;
}

// Save or Update Customer
export async function saveCustomer(input: CustomerInput) {
  const supabase = await createSupabaseServerClient();
  let savedCustomer: Record<string, unknown> | null = null;

  try {
    const isUnique = await isPhoneUnique(input.phone, input.id);
    if (!isUnique) {
      return { success: false, error: "Bu telefon numarasıyla kayıtlı başka bir müşteri zaten var." };
    }

    if (input.id) {
      const { data: oldData } = await supabase.from('customers').select('*').eq('id', input.id).maybeSingle();

      const { data, error } = await supabase
        .from('customers')
        .update({
          name: input.name,
          type: input.type,
          contact_person: input.contact_person || null,
          phone: input.phone,
          phone_secondary: input.phone_secondary || null,
          email: input.email || null,
          tax_number: input.tax_number || null,
          tax_office: input.tax_office || null,
          address: input.address || null,
          city: input.city || null,
          district: input.district || null,
          location_link: input.location_link || null,
          notes: input.notes || null,
          is_active: input.is_active ?? true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', input.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      savedCustomer = data;
      await logActivity('UPDATE', 'customers', input.id, oldData, data);
    } else {
      const { data, error } = await supabase
        .from('customers')
        .insert({
          name: input.name,
          type: input.type,
          contact_person: input.contact_person || null,
          phone: input.phone,
          phone_secondary: input.phone_secondary || null,
          email: input.email || null,
          tax_number: input.tax_number || null,
          tax_office: input.tax_office || null,
          address: input.address || null,
          city: input.city || null,
          district: input.district || null,
          location_link: input.location_link || null,
          notes: input.notes || null,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      savedCustomer = data;
      await logActivity('INSERT', 'customers', data.id, null, data);
    }

    revalidatePath("/admin/customers");
    revalidatePath("/admin/calendar");
    revalidatePath("/admin");
    return { success: true, customer: savedCustomer };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Müşteri kaydedilemedi." };
  }
}

// Soft delete customer
export async function deleteCustomer(id: string) {
  const supabase = await createSupabaseServerClient();
  try {
    const { data: oldData } = await supabase.from('customers').select('*').eq('id', id).maybeSingle();
    const { data, error } = await supabase
      .from('customers')
      .update({ deleted_at: new Date().toISOString(), is_active: false })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    await logActivity('UPDATE', 'customers', id, oldData, data);

    revalidatePath("/admin/customers");
    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Müşteri silinemedi." };
  }
}

// Add Customer Note
export async function addCustomerNote(customerId: string, note: string) {
  const supabase = await createSupabaseServerClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('customer_notes')
      .insert({
        customer_id: customerId,
        note,
        created_by_profile_id: user?.id || null,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    await logActivity('INSERT', 'customer_notes', data.id, null, data);

    revalidatePath(`/admin/customers/${customerId}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Not eklenemedi." };
  }
}
