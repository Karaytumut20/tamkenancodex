import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { getResourceRow } from "@/lib/admin/data";
import { adminResources } from "@/lib/admin/resources";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await getResourceRow(adminResources.leads, id);
  const phone = row?.phone ? String(row.phone).replace(/\s+/g, "") : "";
  return (
    <ProtectedAdminPage roles={adminResources.leads.roles}>
      <AdminPageHeader title="Lead Detayı" description="Müşteri bilgileri, durum ve sistem tasarla metadata özeti." />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <ResourceForm resource={adminResources.leads} row={row} />
        <aside className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-black">Hızlı Aksiyonlar</h2>
            <div className="mt-4 space-y-3">
              {phone ? <Link href={`tel:${phone}`} className="block rounded-lg bg-slate-100 px-4 py-3 text-sm font-bold text-center">📞 Telefonu Ara</Link> : null}
              {phone ? <Link href={`https://wa.me/${phone}`} className="block rounded-lg bg-[#25D366] px-4 py-3 text-sm font-bold text-white text-center hover:bg-[#20c35a] transition-colors">💬 WhatsApp ile Aç</Link> : null}
              {row?.email ? <Link href={`mailto:${row.email}`} className="block rounded-lg bg-slate-100 px-4 py-3 text-sm font-bold text-center">✉️ E-posta Gönder</Link> : null}
            </div>
          </div>
        </aside>
      </div>
    </ProtectedAdminPage>
  );
}
