import Link from "next/link";
import { Edit } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const sourceLabels: Record<string, string> = {
  contact_form: "İletişim Formu",
  product_quote: "Ürün Teklifi",
  service_quote: "Hizmet Teklifi",
  system_builder: "Sistem Tasarlayıcı",
  whatsapp_click: "WhatsApp Tıklaması",
  manual: "Manuel Kayıt",
};

const statusLabels: Record<string, { label: string; class: string }> = {
  new: { label: "Yeni", class: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  contacted: { label: "Görüşüldü", class: "bg-amber-100 text-amber-700 border-amber-200" },
  proposal_sent: { label: "Teklif Verildi", class: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  won: { label: "Tamamlandı / Kazanıldı", class: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  lost: { label: "İptal / Kaybedildi", class: "bg-slate-100 text-slate-500 border-slate-200" },
  spam: { label: "Gereksiz (Spam)", class: "bg-rose-100 text-rose-700 border-rose-200" },
};

export default async function LeadsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("id, full_name, phone, email, source, status, created_at")
    .order("created_at", { ascending: false });

  const rows = (leads ?? []) as {
    id: string;
    full_name: string | null;
    phone: string | null;
    email: string | null;
    source: string;
    status: string;
    created_at: string;
  }[];

  return (
    <ProtectedAdminPage>
      <AdminPageHeader
        title="📞 Gelen Talepler / Leads"
        description="Sitedeki iletişim formları ve teklif taleplerini buradan takip edin."
      />

      {rows.length === 0 ? (
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-10 text-center">
          <p className="text-xl font-black text-slate-700">Henüz talep gelmedi</p>
          <p className="mt-2 text-sm text-slate-400 font-medium">
            Siteden form doldurulduğunda talepler burada görünecektir.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((lead) => {
            const statusConfig = statusLabels[lead.status] || { label: lead.status, class: "bg-slate-100 text-slate-700" };
            const sourceLabel = sourceLabels[lead.source] || lead.source;
            const date = lead.created_at
              ? new Intl.DateTimeFormat("tr-TR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(lead.created_at))
              : "";

            return (
              <div
                key={lead.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border-2 border-slate-200 bg-white p-5 hover:border-cyan-300 transition-colors"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-black text-slate-800">
                      {lead.full_name || "İsimsiz Müşteri"}
                    </p>
                    <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${statusConfig.class}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 font-medium">
                    {lead.phone && <span>📞 {lead.phone}</span>}
                    {date && <span className="text-xs text-slate-400 font-normal">{date}</span>}
                  </div>
                </div>
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-5 text-sm font-black text-slate-700 hover:bg-slate-50 hover:border-cyan-300 transition-colors shrink-0"
                >
                  <Edit className="h-4 w-4" />
                  İncele / Güncelle
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </ProtectedAdminPage>
  );
}
