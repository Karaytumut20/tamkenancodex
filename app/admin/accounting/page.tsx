import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AccountingClient } from "./AccountingClient";

export const dynamic = "force-dynamic";

export default async function AccountingPage() {
  const supabase = await createSupabaseServerClient();
  const ordersPromise = supabase
    .from("service_orders")
    .select("id, order_number, grand_total, paid_amount, total_cost, net_profit, status, created_at, customer:customer_id(id,name)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(1000);

  const customersPromise = supabase
    .from("customers")
    .select("id, name")
    .is("deleted_at", null)
    .order("name", { ascending: true })
    .limit(1000);

  const [ { data: orders }, { data: customers } ] = await Promise.all([
    ordersPromise,
    customersPromise
  ]);

  return (
    <ProtectedAdminPage>
      <AdminPageHeader title="📊 Muhasebe & Tahsilat Paneli" description="İş emirleri, maliyetler, tahsilatlar ve müşteri cari durumlarını kolayca yönetin." />
      <AccountingClient orders={orders || []} customers={customers || []} />
    </ProtectedAdminPage>
  );
}
