import { requireAdmin } from "@/lib/admin/auth";
import { getMegaMenuAdmin, getOksidProducts, getProducts } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { notFound } from "next/navigation";
import { MegaMenuEditor } from "./_MegaMenuEditor";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const menuKeyLabels: Record<string, string> = {
  "alarm-sistemleri": "🔔 Alarm Sistemleri",
  "akilli-ev-sistemleri": "🏠 Akıllı Ev Sistemleri",
  "kamera-sistemleri": "📷 Kamera Sistemleri",
};

export default async function MegaMenuDetailPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  await requireAdmin();
  const { key } = await params;

  const supabase = await createSupabaseServerClient();
  const [sectionData, oksidProducts, dbProducts, { data: servicePage }] = await Promise.all([
    getMegaMenuAdmin(key),
    getOksidProducts(),
    getProducts(),
    supabase.from("services").select("*").eq("slug", key).maybeSingle(),
  ]);

  if (!sectionData) {
    // Section might not be seeded yet
    notFound();
  }

  // Build product list for the product picker
  const allProducts = [
    ...dbProducts.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name || p.title || "",
      category: p.category || "",
      brand: p.brand || "",
      image: p.image || p.image_url || "/images/alarm-sistemi.svg",
    })),
    ...oksidProducts.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      name: p.urun_adi || p.name || "",
      category: p.kategori_ana || p.category || "",
      brand: p.marka || p.brand || "",
      image: (p.resimler && p.resimler.length > 0 ? p.resimler[0] : null) || p.image || "/images/alarm-sistemi.svg",
    })),
  ];

  return (
    <ProtectedAdminPage>
      <div className="mb-6">
        <Link
          href="/admin/mega-menu"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-cyan-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Tüm Mega Menüler
        </Link>
      </div>
      <AdminPageHeader
        title={menuKeyLabels[key] ?? key}
        description="Navbar mega menüsünün persona kartlarını, ürün linklerini ve sağ panel içeriğini düzenleyin."
      />
      <MegaMenuEditor
        menuKey={key}
        initialData={sectionData}
        allProducts={allProducts}
        initialServiceData={servicePage}
      />
    </ProtectedAdminPage>
  );
}
