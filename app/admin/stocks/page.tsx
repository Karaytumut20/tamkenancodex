import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { StocksClient } from "./StocksClient";

export const dynamic = "force-dynamic";

export default async function StocksPage() {
  const supabase = await createSupabaseServerClient();

  // Fetch all active stock items
  const { data: materials } = await supabase
    .from("materials")
    .select("id, name, stock_quantity, min_stock_level")
    .is("deleted_at", null)
    .order("name", { ascending: true })
    .limit(250);

  return (
    <ProtectedAdminPage>
      <AdminPageHeader
        title="📦 Stok ve Malzeme Yönetimi"
        description="Servislerde kullanılan tüm yedek parça ve sarf malzemelerinin stok takibini yapın."
      />
      <StocksClient materials={materials || []} />
    </ProtectedAdminPage>
  );
}
