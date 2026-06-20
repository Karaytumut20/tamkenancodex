import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { CustomerProfileClient } from "./CustomerProfileClient";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  // 1. Fetch Customer Info
  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!customer) {
    notFound();
  }

  // 2. Fetch Customer Appointments
  const { data: appointments } = await supabase
    .from("appointments")
    .select("*, employee:employee_id(full_name), assistant:assistant_employee_id(full_name)")
    .eq("customer_id", id)
    .is("deleted_at", null)
    .order("appointment_date", { ascending: false });

  // 3. Fetch Service Orders
  const { data: serviceOrders } = await supabase
    .from("service_orders")
    .select("*, appointment:appointment_id(appointment_date, start_time)")
    .eq("customer_id", id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const orderIds = (serviceOrders || []).map(o => o.id);

  // 4. Fetch Used Materials
  let materials: any[] = [];
  if (orderIds.length > 0) {
    const { data: mats } = await supabase
      .from("service_order_materials")
      .select("*, service_order:service_order_id(order_number)")
      .in("service_order_id", orderIds);
    if (mats) materials = mats;
  }

  // 5. Fetch Payments
  const { data: payments } = await supabase
    .from("payments")
    .select("*, service_order:service_order_id(order_number), employee:received_by_employee_id(full_name)")
    .eq("customer_id", id)
    .order("payment_date", { ascending: false });

  // 6. Fetch Notes
  const { data: notes } = await supabase
    .from("customer_notes")
    .select("*, profile:created_by_profile_id(full_name)")
    .eq("customer_id", id)
    .order("created_at", { ascending: false });

  // 7. Fetch Uploaded Files
  let files: any[] = [];
  if (orderIds.length > 0) {
    const { data: serviceFiles } = await supabase
      .from("service_files")
      .select("*, service_order:service_order_id(order_number)")
      .in("service_order_id", orderIds);
    if (serviceFiles) files = serviceFiles;
  }

  return (
    <ProtectedAdminPage>
      <AdminPageHeader
        title={`👥 ${customer.name}`}
        description={`${customer.type === "kurumsal" ? "Kurumsal Müşteri Profili" : "Bireysel Müşteri Profili"}`}
        showBackButton={true}
      />
      <CustomerProfileClient
        customer={customer}
        appointments={appointments || []}
        serviceOrders={serviceOrders || []}
        materials={materials}
        payments={payments || []}
        notes={notes || []}
        files={files}
      />
    </ProtectedAdminPage>
  );
}
