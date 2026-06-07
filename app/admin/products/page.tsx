import Link from "next/link";
import { Edit, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProductsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, title, price, is_active, updated_at")
    .order("updated_at", { ascending: false });

  const rows = (products ?? []) as {
    id: string;
    title: string;
    price: number | null;
    is_active: boolean;
    updated_at: string;
  }[];

  return (
    <ProtectedAdminPage>
      <AdminPageHeader
        title="📦 Ürünler"
        description="Ürünlerinizi buradan ekleyin veya düzenleyin."
        action={
          <Link
            href="/admin/products/new"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-cyan-600 border-2 border-cyan-700 px-6 text-base font-black text-white hover:bg-cyan-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Yeni Ürün Ekle
          </Link>
        }
      />

      {rows.length === 0 ? (
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-10 text-center">
          <p className="text-xl font-black text-slate-700">Henüz ürün yok</p>
          <p className="mt-2 text-sm text-slate-400 font-medium">
            &quot;Yeni Ürün Ekle&quot; butonuna tıklayarak ilk ürününüzü oluşturun.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((product) => {
            const date = product.updated_at
              ? new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(product.updated_at))
              : "";

            return (
              <div
                key={product.id}
                className="flex items-center justify-between gap-4 rounded-xl border-2 border-slate-200 bg-white p-4 hover:border-cyan-300 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-base font-black text-slate-800 truncate">{product.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-full ${
                        product.is_active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {product.is_active ? "Aktif" : "Pasif"}
                    </span>
                    {product.price != null && (
                      <span className="text-sm font-bold text-slate-600">
                        {product.price.toLocaleString("tr-TR")} ₺
                      </span>
                    )}
                    {date && (
                      <span className="text-xs text-slate-400 font-medium">{date}</span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50 hover:border-cyan-300 transition-colors shrink-0"
                >
                  <Edit className="h-4 w-4" />
                  Düzenle
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </ProtectedAdminPage>
  );
}
