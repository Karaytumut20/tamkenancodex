"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit2, X, LayoutGrid, ChevronRight, Save, Info, AlertTriangle } from "lucide-react";
import Link from "next/link";

type Section = {
  id: string;
  menu_key: string;
  title: string;
  eyebrow: string;
  insight_title: string;
  insight_body: string;
  is_active: boolean;
};

type Props = {
  initialSections: Section[];
};

export function MegaMenuDashboard({ initialSections }: Props) {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  // Form states for creating
  const [createTitle, setCreateTitle] = useState("");
  const [createMenuKey, setCreateMenuKey] = useState("");
  const [createEyebrow, setCreateEyebrow] = useState("");
  const [createIsActive, setCreateIsActive] = useState(true);

  // Form states for editing
  const [editTitle, setEditTitle] = useState("");
  const [editMenuKey, setEditMenuKey] = useState("");
  const [editEyebrow, setEditEyebrow] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);

  // Helpers
  function handleOpenEdit(section: Section) {
    setEditingSection(section);
    setEditTitle(section.title);
    setEditMenuKey(section.menu_key);
    setEditEyebrow(section.eyebrow);
    setEditIsActive(section.is_active);
    setError(null);
  }

  async function handleCreate() {
    setError(null);
    if (!createTitle.trim()) {
      setError("Menü Başlığı zorunludur.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/mega-menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: createTitle,
            menu_key: createMenuKey,
            eyebrow: createEyebrow,
            is_active: createIsActive,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Ekleme işlemi başarısız");
        }

        // Reset
        setCreateTitle("");
        setCreateMenuKey("");
        setCreateEyebrow("");
        setCreateIsActive(true);
        setIsCreateOpen(false);

        router.refresh();
        // Optimistic update
        if (data.data) {
          setSections((prev) => [...prev, data.data]);
        }
      } catch (err: any) {
        setError(err.message ?? "Bir hata oluştu");
      }
    });
  }

  async function handleUpdate() {
    setError(null);
    if (!editingSection) return;
    if (!editTitle.trim()) {
      setError("Menü Başlığı zorunludur.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/mega-menu", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingSection.id,
            title: editTitle,
            menu_key: editMenuKey,
            eyebrow: editEyebrow,
            is_active: editIsActive,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Güncelleme işlemi başarısız");
        }

        setEditingSection(null);
        router.refresh();
        if (data.data) {
          setSections((prev) =>
            prev.map((s) => (s.id === data.data.id ? data.data : s))
          );
        }
      } catch (err: any) {
        setError(err.message ?? "Bir hata oluştu");
      }
    });
  }

  async function handleDelete(id: string, name: string) {
    if (
      !window.confirm(
        `"${name}" isimli mega menüyü tamamen silmek istediğinize emin misiniz?\nBu menüye ait tüm persona kartları, alt linkler ve oluşturulan hizmet detay sayfası kalıcı olarak silinecektir.`
      )
    ) {
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/mega-menu?id=${id}`, {
          method: "DELETE",
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Silme işlemi başarısız");
        }

        setSections((prev) => prev.filter((s) => s.id !== id));
        router.refresh();
      } catch (err: any) {
        setError(err.message ?? "Bir hata oluştu");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            Toplam {sections.length} adet mega menü bulunuyor.
          </p>
          {error && <p className="text-sm font-bold text-red-600 mt-1">⚠️ Hata: {error}</p>}
        </div>
        <button
          onClick={() => {
            setIsCreateOpen(true);
            setError(null);
          }}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 px-5 text-sm font-black text-white transition-colors shrink-0"
        >
          <Plus className="h-4.5 w-4.5" />
          Yeni Mega Menü Ekle
        </button>
      </div>

      {/* Grid List */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <div
            key={section.id}
            className="group flex flex-col justify-between rounded-2xl border-2 border-slate-200 bg-white p-6 transition-all hover:border-cyan-400 hover:shadow-lg relative"
          >
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black ${
                    section.is_active
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {section.is_active ? "✓ Aktif" : "✗ Pasif"}
                </span>
                
                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenEdit(section)}
                    className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                    title="Genel Ayarları Düzenle / Yolu Değiştir"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(section.id, section.title)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Menüyü Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-800 truncate" title={section.title}>
                {section.title}
              </h3>
              
              <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500">
                <div>
                  <span className="text-slate-400 font-bold block">Menü Yolu (Path/Key)</span>
                  <code className="text-cyan-600 text-[13px] font-black">/{section.menu_key}</code>
                </div>
                {section.eyebrow && (
                  <div>
                    <span className="text-slate-400 font-bold block">Üst Etiket (Eyebrow)</span>
                    <span className="text-slate-700">{section.eyebrow}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
              <Link
                href={`/admin/mega-menu/${section.menu_key}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-50 hover:bg-cyan-50 px-4 text-xs font-black text-cyan-600 hover:text-cyan-700 transition-colors w-full justify-center border border-slate-100 hover:border-cyan-200"
              >
                <span>İçerikleri Düzenle</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
            <LayoutGrid className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-black text-slate-500">Henüz eklenmiş bir mega menü bulunmuyor.</p>
            <p className="mt-2 text-sm text-slate-400 font-medium max-w-sm mx-auto">
              Yukarıdaki butonu kullanarak ilk mega menü alanınızı anında oluşturabilir, linkleri ve iç sayfa detaylarını girmeye başlayabilirsiniz.
            </p>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 lg:left-72 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-slate-800">Yeni Mega Menü Ekle</h3>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">Menü Başlığı</span>
                  <input
                    type="text"
                    value={createTitle}
                    onChange={(e) => setCreateTitle(e.target.value)}
                    placeholder="Örn: Yangın İhbar Sistemleri"
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none focus:border-cyan-500"
                  />
                </label>

                <label className="block">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">Menü Yolu (Path/Slug)</span>
                    <span className="text-[10px] font-bold text-slate-400">Boş bırakılırsa başlığa göre otomatik oluşur</span>
                  </div>
                  <input
                    type="text"
                    value={createMenuKey}
                    onChange={(e) => setCreateMenuKey(e.target.value)}
                    placeholder="Örn: yangin-ihbar-sistemleri"
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none focus:border-cyan-500"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">Üst Etiket (Eyebrow - Örn: Konfor ve Güvenlik)</span>
                  <input
                    type="text"
                    value={createEyebrow}
                    onChange={(e) => setCreateEyebrow(e.target.value)}
                    placeholder="Örn: Erken algılama çözümleri"
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none focus:border-cyan-500"
                  />
                </label>

                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={createIsActive}
                    onChange={(e) => setCreateIsActive(e.target.checked)}
                    className="h-5 w-5 accent-cyan-600"
                  />
                  <span className="text-sm font-bold text-slate-700">Yayınla (Menüde Gösterilsin)</span>
                </label>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                disabled={isPending}
                className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-black text-xs hover:bg-cyan-700 transition-colors disabled:opacity-60"
              >
                {isPending ? "Ekleniyor..." : "💾 Ekle"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingSection && (
        <div className="fixed inset-0 lg:left-72 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-slate-800">Menü Ayarlarını Düzenle</h3>
                <button
                  onClick={() => setEditingSection(null)}
                  className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">Menü Başlığı</span>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none focus:border-cyan-500"
                  />
                </label>

                <label className="block">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">Menü Yolu (Path/Slug)</span>
                    <span className="text-[10px] font-bold text-red-500 flex items-center gap-0.5">
                      <AlertTriangle className="h-3 w-3" /> Yolu değiştirmek eski linkleri bozabilir
                    </span>
                  </div>
                  <input
                    type="text"
                    value={editMenuKey}
                    onChange={(e) => setEditMenuKey(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none focus:border-cyan-500"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">Üst Etiket (Eyebrow)</span>
                  <input
                    type="text"
                    value={editEyebrow}
                    onChange={(e) => setEditEyebrow(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none focus:border-cyan-500"
                  />
                </label>

                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={editIsActive}
                    onChange={(e) => setEditIsActive(e.target.checked)}
                    className="h-5 w-5 accent-cyan-600"
                  />
                  <span className="text-sm font-bold text-slate-700">Yayınla (Menüde Gösterilsin)</span>
                </label>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                disabled={isPending}
                className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-black text-xs hover:bg-cyan-700 transition-colors disabled:opacity-60"
              >
                {isPending ? "Kaydediliyor..." : "💾 Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
