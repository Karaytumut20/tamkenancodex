import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { CalendarClient } from "./CalendarClient";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const supabase = await createSupabaseServerClient();

  const [appsRes, custsRes, empsRes] = await Promise.all([
    supabase
      .from("appointments")
      .select("*, customer:customer_id(name, phone, city, district), employee:employee_id(full_name), assistant:assistant_employee_id(full_name)")
      .is("deleted_at", null)
      .order("start_time"),
    supabase
      .from("customers")
      .select("id, name, phone, address, city, district, type")
      .is("deleted_at", null)
      .order("name"),
    supabase
      .from("employees")
      .select("id, full_name, role_title")
      .eq("is_active", true)
      .order("full_name"),
  ]);

  return (
    <ProtectedAdminPage>
      <AdminPageHeader
        title="📅 Randevu Takvimi"
        description="Müşteri randevularını ve servis takvimini buradan günlük, haftalık veya aylık planlayın. Taşımak için kartları sürükleyip bırakabilirsiniz."
      />
      <CalendarClient
        initialAppointments={appsRes.data ?? []}
        customers={custsRes.data ?? []}
        employees={empsRes.data ?? []}
      />
    </ProtectedAdminPage>
  );
}
