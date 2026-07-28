import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ServiceOrderClient } from "./ServiceOrderClient";
import { getUsdTryRate } from "@/lib/admin/exchange-rate";

export const dynamic = "force-dynamic";

export default async function ServiceOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  // 1. Fetch Current User Role
  const { data: { user } } = await supabase.auth.getUser();
  let currentUserRole = "viewer";
  if (user) {
    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile) currentUserRole = profile.role;
  }

  // 2. Fetch Service Order
  const { data: order } = await supabase
    .from("service_orders")
    .select(`
      *,
      customer:customer_id (id, name, phone, type, address, city, district),
      appointment:appointment_id (appointment_date, start_time, service_type)
    `)
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!order) {
    notFound();
  }

  const [
    { data: materialsInStock },
    { data: employees },
    { data: orderMaterials },
    { data: payments },
    { data: files },
    { data: logs },
    usdTryRate,
  ] = await Promise.all([
    supabase.from("materials").select("*").eq("is_active", true).is("deleted_at", null).order("name", { ascending: true }),
    supabase.from("employees").select("*").eq("is_active", true).is("deleted_at", null).order("full_name", { ascending: true }),
    supabase.from("service_order_materials").select("*").eq("service_order_id", id).order("created_at", { ascending: true }),
    supabase.from("payments").select("*, employee:received_by_employee_id(full_name)").eq("service_order_id", id).order("payment_date", { ascending: false }),
    supabase.from("service_files").select("*").eq("service_order_id", id).order("uploaded_at", { ascending: false }),
    supabase.from("activity_logs").select("*").eq("record_id", id).order("created_at", { ascending: false }),
    getUsdTryRate(),
  ]);

  return (
    <ProtectedAdminPage>
      <AdminPageHeader
        title="🛠️ İş Emri Detayı"
        description="Servis işlemlerini ve maliyet hesaplarını buradan yönetin."
        showBackButton={true}
      />
      <ServiceOrderClient
        order={order}
        materialsInStock={materialsInStock || []}
        employees={employees || []}
        orderMaterials={orderMaterials || []}
        payments={payments || []}
        files={files || []}
        logs={logs || []}
        currentUserRole={currentUserRole}
        usdTryRate={usdTryRate}
      />
    </ProtectedAdminPage>
  );
}
