import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { getResourceRow } from "@/lib/admin/data";
import { adminResources } from "@/lib/admin/resources";
import { customerWhatsappUrl, phoneCallUrl } from "@/lib/whatsapp";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await getResourceRow(adminResources.leads, id);
  const phone = row?.phone ? String(row.phone) : "";
  const metadata = row?.metadata && typeof row.metadata === "object" ? row.metadata as Record<string, unknown> : null;
  const builder = metadata?.systemBuilder && typeof metadata.systemBuilder === "object"
    ? metadata.systemBuilder as Record<string, unknown>
    : null;
  const selectedServices = Array.isArray(builder?.selectedServices)
    ? builder.selectedServices
        .map((service) => typeof service === "string" ? service : service && typeof service === "object" && "title" in service ? String((service as { title: unknown }).title) : "")
        .filter(Boolean)
    : [];
  const isSystemBuilder = row?.source === "system_builder";
  return (
    <ProtectedAdminPage roles={adminResources.leads.roles}>
      <AdminPageHeader 
        title="Lead Detayı" 
        description="Müşteri bilgileri, durum ve sistem metadata özeti." 
        showBackButton={true}
      />
      {isSystemBuilder ? (
        <section className="mb-6 rounded-2xl border-2 border-cyan-200 bg-white p-5 shadow-sm md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-cyan-600">Sistem Tasarlama Başvurusu</p>
              <h2 className="mt-1 text-2xl font-black text-slate-800">Paket özeti</h2>
            </div>
            <span className="rounded-full bg-cyan-50 px-4 py-2 text-sm font-black text-cyan-700">Yeni Talep</span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <SummaryItem label="Korunan Alan" value={builder?.protectedArea} />
            <SummaryItem label="Alan Bilgisi" value={builder?.spaceType} />
            <SummaryItem label="İhtiyaç Nedeni" value={builder?.needReason} />
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">Kullanıcının Seçtiği Hizmetler</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedServices.length > 0 ? selectedServices.map((service) => (
                  <span key={service} className="rounded-full border border-cyan-200 bg-white px-3 py-1.5 text-sm font-black text-cyan-700">{service}</span>
                )) : <span className="text-sm font-semibold text-slate-500">Hizmet bilgisi bulunamadı.</span>}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <SummaryItem label="Ad Soyad" value={row?.full_name} />
              <SummaryItem label="Telefon" value={row?.phone} />
              <SummaryItem label="Şehir" value={row?.city} />
            </div>
          </div>
        </section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <ResourceForm resource={adminResources.leads} row={row} />
        <aside className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-black">Hızlı Aksiyonlar</h2>
            <div className="mt-4 space-y-3">
              {phone ? <a href={phoneCallUrl(phone)} className="block rounded-lg bg-slate-100 px-4 py-3 text-sm font-bold text-center">📞 Müşteriyi Ara</a> : null}
              {phone ? <a href={customerWhatsappUrl(phone, row?.full_name ? String(row.full_name) : undefined)} target="_blank" rel="noopener noreferrer" className="block rounded-lg bg-[#25D366] px-4 py-3 text-sm font-bold text-white text-center hover:bg-[#20c35a] transition-colors">💬 WhatsApp’tan Yaz</a> : null}
              {row?.email ? <Link href={`mailto:${row.email}`} className="block rounded-lg bg-slate-100 px-4 py-3 text-sm font-bold text-center">✉️ E-posta Gönder</Link> : null}
            </div>
          </div>
        </aside>
      </div>
    </ProtectedAdminPage>
  );
}

function SummaryItem({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-2 font-black text-slate-800">{value ? String(value) : "—"}</p>
    </div>
  );
}
