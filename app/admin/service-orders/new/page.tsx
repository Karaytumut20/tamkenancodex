import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { NewOrderClient } from "./NewOrderClient";
import { getUsdTryRate } from "@/lib/admin/exchange-rate";

export const dynamic = "force-dynamic";

export default async function NewServiceOrderPage() {
  const supabase = await createSupabaseServerClient();
  
  const [
    { data: customers },
    { data: materials },
    usdTryRate,
  ] = await Promise.all([
    supabase.from("customers").select("id, name, phone").is("deleted_at", null).order("name", { ascending: true }),
    supabase.from("materials").select("id, name, stock_quantity, selling_price").is("deleted_at", null).eq("is_active", true).order("name", { ascending: true }),
    getUsdTryRate(),
  ]);

  return (
    <ProtectedAdminPage>
      <AdminPageHeader
        title="➕ Yeni İş Emri / Hızlı İşlem"
        description="Müşterinize yeni bir hizmet veya ürün satışı yapın. Stok, ödeme ve takvim detaylarını tek ekranda tamamlayın."
      />
      <div className="max-w-3xl">
        <NewOrderClient 
          customers={customers || []} 
          materials={materials || []}
          usdTryRate={usdTryRate?.rate ?? null}
        />
      </div>
    </ProtectedAdminPage>
  );
}
