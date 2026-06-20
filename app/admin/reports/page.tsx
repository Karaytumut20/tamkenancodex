import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ReportsClient } from "./ReportsClient";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const supabase = await createSupabaseServerClient();

  const [
    { data: customers },
    { data: appointments },
    { data: serviceOrders },
    { data: employees },
    { data: payments },
    { data: orderMaterials },
    { data: stockMovements },
  ] = await Promise.all([
    supabase.from("customers").select("id, name, phone, type").is("deleted_at", null).order("name", { ascending: true }),
    supabase.from("appointments").select("*, customer:customer_id(name)").is("deleted_at", null).order("appointment_date", { ascending: false }),
    supabase.from("service_orders").select("*").is("deleted_at", null).order("created_at", { ascending: false }),
    supabase.from("employees").select("id, full_name, role_title").is("deleted_at", null).order("full_name", { ascending: true }),
    supabase.from("payments").select("*").order("payment_date", { ascending: false }),
    supabase.from("service_order_materials").select("*"),
    supabase.from("stock_movements").select("*, materials:material_id(name)").order("created_at", { ascending: false }),
  ]);

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
