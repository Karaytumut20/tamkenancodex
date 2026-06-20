import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ReportsClient } from "./ReportsClient";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const supabase = await createSupabaseServerClient();

  // 1. Fetch Customers
  const { data: customers } = await supabase
    .from("customers")
    .select("id, name, phone, type")
    .is("deleted_at", null)
    .order("name", { ascending: true });

  // 2. Fetch Appointments
  const { data: appointments } = await supabase
    .from("appointments")
    .select("*, customer:customer_id(name)")
    .is("deleted_at", null)
    .order("appointment_date", { ascending: false });

  // 3. Fetch Service Orders
  const { data: serviceOrders } = await supabase
    .from("service_orders")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  // 4. Fetch Employees
  const { data: employees } = await supabase
    .from("employees")
    .select("id, full_name, role_title")
    .is("deleted_at", null)
    .order("full_name", { ascending: true });

  // 5. Fetch Payments
  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .order("payment_date", { ascending: false });

  // 6. Fetch Service Order Materials
  const { data: orderMaterials } = await supabase
    .from("service_order_materials")
    .select("*");

  // 7. Fetch Stock Movements (joining material name)
  const { data: stockMovements } = await supabase
    .from("stock_movements")
    .select("*, materials:material_id(name)")
    .order("created_at", { ascending: false });

  return (
    <ProtectedAdminPage>
      <AdminPageHeader
        title="📊 Finansal & Operasyonel Raporlar"
        description="Gelir-gider, net kâr, personel performansı ve stok hareket analizlerinizi detaylı inceleyin."
      />
      <ReportsClient
        customers={customers || []}
        appointments={appointments || []}
        serviceOrders={serviceOrders || []}
        employees={employees || []}
        payments={payments || []}
        orderMaterials={orderMaterials || []}
        stockMovements={stockMovements || []}
      />
    </ProtectedAdminPage>
  );
}
