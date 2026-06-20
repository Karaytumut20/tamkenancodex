import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { NewOrderClient } from "./NewOrderClient";

export const dynamic = "force-dynamic";

export default async function NewServiceOrderPage() {
  const supabase = await createSupabaseServerClient();
  
  const { data: customers } = await supabase
    .from("customers")
    .select("id, name, phone")
    .is("deleted_at", null)
    .order("name", { ascending: true });

  return (
    <ProtectedAdminPage>
      <AdminPageHeader
        title="➕ Yeni İş Emri / Hizmet Satışı"
        description="Müşterinize yeni bir hizmet veya ürün satışı yapın. İleri tarihli bir hizmetse takvime de ekleyebilirsiniz."
      />
      <div className="max-w-3xl">
        <NewOrderClient customers={customers || []} />
      </div>
    </ProtectedAdminPage>
  );
}
