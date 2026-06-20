import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ServiceOrderClient } from "./ServiceOrderClient";

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

  // 3. Fetch Materials in Stock for Selection
  const { data: materialsInStock } = await supabase
    .from("materials")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  // 4. Fetch Employees
  const { data: employees } = await supabase
    .from("employees")
    .select("*")
    .eq("is_active", true)
    .order("full_name", { ascending: true });

  // 5. Fetch Service Order Materials
  const { data: orderMaterials } = await supabase
    .from("service_order_materials")
    .select("*")
    .eq("service_order_id", id)
    .order("created_at", { ascending: true });

  // 6. Fetch Payments
  const { data: payments } = await supabase
    .from("payments")
    .select("*, employee:received_by_employee_id(full_name)")
    .eq("service_order_id", id)
    .order("payment_date", { ascending: false });

  // 7. Fetch Uploaded Files
  const { data: files } = await supabase
    .from("service_files")
    .select("*")
    .eq("service_order_id", id)
    .order("uploaded_at", { ascending: false });

  // 8. Fetch Activity Logs
  const { data: logs } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("record_id", id)
    .order("created_at", { ascending: false });

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
      />
    </ProtectedAdminPage>
  );
}
