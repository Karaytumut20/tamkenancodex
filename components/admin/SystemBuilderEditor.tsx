"use client";

import { useState, useMemo } from "react";
import { GripVertical, Plus, Save, Trash2, ChevronDown, ChevronUp, Search, Image as ImageIcon, X, Check } from "lucide-react";
import { SystemBuilderGroup, SystemBuilderItem } from "@/lib/db";
import Image from "next/image";

type EditorGroup = {
  id?: string;
  title: string;
  items: EditorItem[];
};

type EditorItem = {
  id?: string;
  product_name: string;
  image_url: string;
  source_type: string;
  source_id: string;
};

type Product = {
  id: string;
  title: string;
  image: string;
  type: string;
  category: string;
};

export function SystemBuilderEditor({
  initialGroups,
  availableProducts,
}: {
  initialGroups: SystemBuilderGroup[];
  availableProducts: Product[];
}) {
  const [groups, setGroups] = useState<EditorGroup[]>(
    initialGroups.map((g) => ({
      id: g.id,
      title: g.title,
      items: g.items.map((i) => ({
        id: i.id,
        product_name: i.title,
        image_url: i.image,
        source_type: i.source_type,
        source_id: i.source_id,
      })),
    }))
  );

  const [saving, setSaving] = useState(false);
  
  // Modal state
  const [activeGroupIndex, setActiveGroupIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const cats = new Set(availableProducts.map(p => p.category));
    return Array.from(cats).sort((a, b) => a.localeCompare(b, "tr"));
  }, [availableProducts]);

  const filteredProducts = useMemo(() => {
    return availableProducts.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === "all" || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [availableProducts, searchQuery, selectedCategory]);

  const addGroup = () => {
    setGroups([...groups, { title: "", items: [] }]);
  };

  const removeGroup = (idx: number) => {
    if (window.confirm("Bu ürün grubunu ve içindeki tüm ürünleri silmek istediğinize emin misiniz? (Kaydet butonuna basana kadar kalıcı olarak kaydedilmez)")) {
      setGroups(groups.filter((_, i) => i !== idx));
    }
  };

  const updateGroupTitle = (idx: number, val: string) => {
    const newGroups = [...groups];
    newGroups[idx].title = val;
    setGroups(newGroups);
  };

  const moveGroup = (idx: number, dir: number) => {
    if (idx + dir < 0 || idx + dir >= groups.length) return;
    const newGroups = [...groups];
    const temp = newGroups[idx];
    newGroups[idx] = newGroups[idx + dir];
    newGroups[idx + dir] = temp;
    setGroups(newGroups);
  };

  const openProductModal = (idx: number) => {
    setActiveGroupIndex(idx);
    setSearchQuery("");
    setSelectedCategory("all");
  };

  const addItemToActiveGroup = (product: Product) => {
    if (activeGroupIndex === null) return;
    const newGroups = [...groups];
    
    // Prevent duplicates
    const isDuplicate = newGroups[activeGroupIndex].items.some(i => i.source_id === product.id);
    if (!isDuplicate) {
      newGroups[activeGroupIndex].items.push({
        product_name: product.title,
        image_url: product.image,
        source_type: product.type,
        source_id: product.id,
      });
      setGroups(newGroups);
    }
  };

  const removeItem = (groupIndex: number, itemIndex: number) => {
    if (window.confirm("Bu ürünü gruptan çıkarmak istediğinize emin misiniz? (Kaydet butonuna basana kadar kalıcı olarak kaydedilmez)")) {
      const newGroups = [...groups];
      newGroups[groupIndex].items = newGroups[groupIndex].items.filter((_, i) => i !== itemIndex);
      setGroups(newGroups);
    }
  };

  const moveItem = (groupIndex: number, itemIndex: number, dir: number) => {
    const items = groups[groupIndex].items;
    if (itemIndex + dir < 0 || itemIndex + dir >= items.length) return;
    const newGroups = [...groups];
    const temp = items[itemIndex];
    items[itemIndex] = items[itemIndex + dir];
    items[itemIndex + dir] = temp;
    setGroups(newGroups);
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/system-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groups }),
      });
      if (res.ok) {
        alert("Kaydedildi!");
      } else {
        alert("Hata oluştu.");
      }
    } catch (err) {
      alert("Bir hata oluştu.");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <p className="text-sm font-semibold text-slate-500">
          Toplam {groups.length} grup mevcut.
        </p>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          {saving ? "Kaydediliyor..." : "Tümünü Kaydet"}
        </button>
      </div>

      <div className="space-y-6">
        {groups.map((group, gIdx) => (
          <div key={gIdx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex gap-4 items-center">
              <div className="flex flex-col gap-1">
                <button onClick={() => moveGroup(gIdx, -1)} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700" title="Yukarı Taşı"><ChevronUp className="h-4 w-4" /></button>
                <button onClick={() => moveGroup(gIdx, 1)} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700" title="Aşağı Taşı"><ChevronDown className="h-4 w-4" /></button>
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 mb-1 block">Grup Başlığı (Opsiyonel)</label>
                <input
                  type="text"
                  value={group.title}
                  onChange={(e) => updateGroupTitle(gIdx, e.target.value)}
                  placeholder="Örn: Akıllı Ev Çözümleri"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <button onClick={() => removeGroup(gIdx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0 mt-5">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4 bg-slate-50/50">
              {group.items.length > 0 ? (
                <div className="space-y-2">
                  {group.items.map((item, iIdx) => (
                    <div key={iIdx} className="flex items-center gap-3 bg-white border border-slate-200 p-2 rounded-xl">
                      <div className="flex flex-col">
                        <button onClick={() => moveItem(gIdx, iIdx, -1)} className="p-1 hover:bg-slate-100 rounded text-slate-400"><ChevronUp className="h-3 w-3" /></button>
                        <button onClick={() => moveItem(gIdx, iIdx, 1)} className="p-1 hover:bg-slate-100 rounded text-slate-400"><ChevronDown className="h-3 w-3" /></button>
                      </div>
                      <div className="h-10 w-10 relative bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center shrink-0">
                        {item.image_url ? (
                          <Image src={item.image_url} alt="" fill className="object-contain p-1" unoptimized />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{item.product_name}</p>
                        <p className="text-xs font-semibold text-slate-400 truncate">Kaynak: {item.source_type} | ID: {item.source_id}</p>
                      </div>
                      <button onClick={() => removeItem(gIdx, iIdx)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-slate-400 font-semibold border-2 border-dashed border-slate-200 rounded-xl">
                  Bu grupta henüz ürün yok.
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => openProductModal(gIdx)}
                  className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Ürün Ekle
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addGroup}
          className="w-full border-2 border-dashed border-slate-300 hover:border-cyan-500 hover:bg-cyan-50 text-slate-500 hover:text-cyan-600 rounded-2xl py-6 flex flex-col items-center justify-center gap-2 transition-colors"
        >
          <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
            <Plus className="h-5 w-5" />
          </div>
          <span className="font-bold text-sm">Yeni Grup Ekle</span>
        </button>
      </div>

      {/* Product Selection Modal */}
      {activeGroupIndex !== null && (
        <div className="fixed inset-0 lg:left-72 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-black text-slate-800">Ürün Ekle</h3>
              <button 
                onClick={() => setActiveGroupIndex(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ürün adı ile ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-cyan-500 w-full sm:w-64"
              >
                <option value="all">Tüm Kategoriler</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredProducts.map((p) => {
                  const isAdded = groups[activeGroupIndex].items.some(i => i.source_id === p.id);
                  return (
                    <div 
                      key={p.id} 
                      className={`relative flex items-center gap-3 bg-white border rounded-xl p-3 transition-colors ${isAdded ? 'border-cyan-200 bg-cyan-50/30' : 'border-slate-200 hover:border-cyan-400'}`}
                    >
                      <div className="h-12 w-12 relative shrink-0 bg-white border border-slate-100 rounded-lg p-1">
                        <Image src={p.image} alt="" fill className="object-contain" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate" title={p.title}>{p.title}</p>
                        <p className="text-xs text-slate-500 truncate" title={p.category}>{p.category}</p>
                      </div>
                      <button
                        onClick={() => addItemToActiveGroup(p)}
                        disabled={isAdded}
                        className={`shrink-0 h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${isAdded ? 'bg-slate-100 text-cyan-600' : 'bg-slate-100 text-slate-600 hover:bg-cyan-600 hover:text-white'}`}
                        title={isAdded ? "Zaten Eklendi" : "Ekle"}
                      >
                        {isAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </button>
                    </div>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-500 font-semibold">
                    Aradığınız kriterlere uygun ürün bulunamadı.
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
              <button
                onClick={() => setActiveGroupIndex(null)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors"
              >
                Bitti
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
