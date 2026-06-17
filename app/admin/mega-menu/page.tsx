import { requireAdmin } from "@/lib/admin/auth";
import { getAllMegaMenuSections } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { MegaMenuDashboard } from "./_MegaMenuDashboard";

export default async function MegaMenuAdminPage() {
  await requireAdmin();
  const sections = await getAllMegaMenuSections();

  return (
    <ProtectedAdminPage>
      <AdminPageHeader
        title="🖊 Mega Menü Yönetimi"
        description="Navbar'da üzerine gelindiğinde açılan menülerin içeriklerini düzenleyin. Menü ekleme, silme, yol/path ayarları ve detay içeriklerini yönetin."
      />

      <MegaMenuDashboard initialSections={sections} />

      <div className="mt-8 rounded-2xl bg-slate-50 border-2 border-slate-200 p-5">
        <h4 className="font-black text-slate-700">📋 Nasıl Kullanılır?</h4>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>• <strong>Yeni Menü Ekle</strong> — Üstteki butona basarak yeni bir açılır menü alanı oluşturun (boş bırakırsanız başlığa göre yolu otomatik slugify eder)</li>
          <li>• <strong>Düzenle İkonu</strong> — Menü başlığını, üst etiketini veya yolunu (path) hızlıca düzenleyin</li>
          <li>• <strong>Sil İkonu</strong> — Menüyü bağlı tüm alt linkleri ve hizmet detay sayfasıyla birlikte tamamen silin (onay sorulur)</li>
          <li>• <strong>İçerikleri Düzenle</strong> — Alt linkleri, persona kartlarını ve detaylı hizmet sayfası metinlerini/SSS bölümlerini yapılandırın</li>
        </ul>
      </div>
    </ProtectedAdminPage>
  );
}
