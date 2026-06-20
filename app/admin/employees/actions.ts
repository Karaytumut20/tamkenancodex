"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/admin/service-system";

export type EmployeeInput = {
  id?: string;
  full_name: string;
  phone?: string;
  email?: string;
  role_title?: string;
  is_active: boolean;
  working_days?: string[];
  working_hours_start?: string;
  working_hours_end?: string;
  notes?: string;
};

// Save or Update Employee
export async function saveEmployee(input: EmployeeInput) {
  const supabase = await createSupabaseServerClient();

  try {
    if (input.id) {
      const { data: oldData } = await supabase.from('employees').select('*').eq('id', input.id).maybeSingle();

      const { data, error } = await supabase
        .from('employees')
        .update({
          full_name: input.full_name,
          phone: input.phone || null,
          email: input.email || null,
          role_title: input.role_title || null,
          is_active: input.is_active,
          working_days: input.working_days || null,
          working_hours_start: input.working_hours_start || null,
          working_hours_end: input.working_hours_end || null,
          notes: input.notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', input.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      await logActivity('UPDATE', 'employees', input.id, oldData, data);
    } else {
      const { data, error } = await supabase
        .from('employees')
        .insert({
          full_name: input.full_name,
          phone: input.phone || null,
          email: input.email || null,
          role_title: input.role_title || null,
          is_active: input.is_active ?? true,
          working_days: input.working_days || ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'],
          working_hours_start: input.working_hours_start || '09:00',
          working_hours_end: input.working_hours_end || '18:00',
          notes: input.notes || null,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      await logActivity('INSERT', 'employees', data.id, null, data);
    }

    revalidatePath("/admin/employees");
    revalidatePath("/admin/calendar");
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Personel kaydedilemedi." };
  }
}

// Soft delete employee
export async function deleteEmployee(id: string) {
  const supabase = await createSupabaseServerClient();
  try {
    const { data: oldData } = await supabase.from('employees').select('*').eq('id', id).maybeSingle();
    const { data, error } = await supabase
      .from('employees')
      .update({ deleted_at: new Date().toISOString(), is_active: false })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    await logActivity('UPDATE', 'employees', id, oldData, data);

    revalidatePath("/admin/employees");
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Personel silinemedi." };
  }
}
