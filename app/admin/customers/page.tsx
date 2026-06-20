import Link from "next/link";
import { Plus, Search, User, Building, MapPin, Phone, ArrowRight, UserCheck } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { AdminPageHeader } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string; type?: string }>;

export default async function CustomersPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createSupabaseServerClient();
  const params = await searchParams;
  const q = params.q || "";
  const typeFilter = params.type || "";

  let query = supabase
    .from("customers")
    .select("id, name, type, contact_person, phone, city, district, is_active")
    .is("deleted_at", null)
    .order("name", { ascending: true })
    .limit(1000);

  if (q) {
    query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%,contact_person.ilike.%${q}%`);
  }
  if (typeFilter) {
    query = query.eq("type", typeFilter);
  }

  const { data: customers } = await query;

  return (
    <ProtectedAdminPage>
      <AdminPageHeader
        title="👥 Müşteri Yönetimi"
        description="Bireysel ve kurumsal müşterilerinizi buradan kaydedin ve takibini yapın."
        action={
          <Link
            href="/admin/customers/new"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-cyan-600 border-2 border-cyan-700 px-6 text-base font-black text-white hover:bg-cyan-700 transition-colors"
          >
            <Plus className="h-5 w-5" /> Yeni Müşteri Ekle
          </Link>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-sm mb-6">
        <form className="relative flex-1 max-w-md">
          <input
            name="q"
            defaultValue={q}
            placeholder="Müşteri adı, yetkili veya telefon ara..."
            className="h-11 w-full pl-10 pr-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
          />
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
          {typeFilter && <input type="hidden" name="type" value={typeFilter} />}
        </form>

        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl">
          <Link
            href={`/admin/customers${q ? `?q=${q}` : ""}`}
            className={`h-9 px-4 rounded-lg text-xs font-black transition-colors flex items-center ${
              !typeFilter ? "bg-white text-cyan-600 shadow-sm" : "text-slate-600 hover:text-slate-800"
            }`}
          >
            Tümü
          </Link>
          <Link
            href={`/admin/customers?type=bireysel${q ? `&q=${q}` : ""}`}
            className={`h-9 px-4 rounded-lg text-xs font-black transition-colors flex items-center gap-1.5 ${
              typeFilter === "bireysel" ? "bg-white text-cyan-600 shadow-sm" : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <User className="h-3.5 w-3.5" /> Bireysel
          </Link>
          <Link
            href={`/admin/customers?type=kurumsal${q ? `&q=${q}` : ""}`}
            className={`h-9 px-4 rounded-lg text-xs font-black transition-colors flex items-center gap-1.5 ${
              typeFilter === "kurumsal" ? "bg-white text-cyan-600 shadow-sm" : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <Building className="h-3.5 w-3.5" /> Kurumsal
          </Link>
        </div>
      </div>

      {/* Grid List */}
      {!customers || customers.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <UserCheck className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-lg font-black text-slate-700">Müşteri Bulunamadı</h3>
          <p className="mt-2 text-sm font-semibold text-slate-400">
            Arama kriterlerinize uygun kayıt bulunamadı veya henüz hiç müşteri eklenmedi.
          </p>
          <Link
            href="/admin/customers/new"
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-cyan-600 text-white px-5 text-sm font-black hover:bg-cyan-700 transition-colors"
          >
            İlk Müşteriyi Ekle
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {customers.map((c) => (
            <Link
              key={c.id}
              href={`/admin/customers/${c.id}`}
              className="group block rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm hover:border-cyan-400 hover:shadow-md transition-all relative overflow-hidden"
            >
              {/* Type Badge */}
              <span className={`absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                c.type === 'kurumsal' 
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {c.type === 'kurumsal' ? <Building className="h-2.5 w-2.5" /> : <User className="h-2.5 w-2.5" />}
                {c.type}
              </span>

              <h3 className="text-lg font-black text-slate-800 group-hover:text-cyan-600 transition-colors truncate pr-16">
                {c.name}
              </h3>
              
              <div className="mt-4 space-y-2 text-xs font-semibold text-slate-500">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{c.phone}</span>
                </p>
                {c.contact_person && (
                  <p className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>Yetkili: {c.contact_person}</span>
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{c.district ? `${c.district}, ${c.city || ''}` : c.city || 'Konum belirtilmemiş'}</span>
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-slate-400 group-hover:text-cyan-600 transition-colors">
                <span>Müşteri Profilini Gör</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </ProtectedAdminPage>
  );
}
