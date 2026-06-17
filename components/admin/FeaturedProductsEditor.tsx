"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { GripVertical, Plus, Save, Trash2, Search, X, Check, Loader2 } from "lucide-react";
import Image from "next/image";

type FeaturedProduct = {
  id: string;
  source_id: string;
  source_type: "local" | "oksid";
  sort_order: number;
};

type AvailableProduct = {
  id: string;
  title: string;
  category: string;
  image: string;
  type: "local" | "oksid";
};

export function FeaturedProductsEditor({
  initialFeatured,
  availableProducts
}: {
  initialFeatured: FeaturedProduct[];
  availableProducts: AvailableProduct[];
}) {
  const router = useRouter();
  const [featured, setFeatured] = useState<FeaturedProduct[]>(initialFeatured);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSaving, setIsSaving] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    availableProducts.forEach(p => cats.add(p.category));
    return Array.from(cats).sort();
  }, [availableProducts]);

  const filteredProducts = useMemo(() => {
    return availableProducts.filter(p => {
      if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
      if (searchQuery.trim() !== "" && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [availableProducts, searchQuery, selectedCategory]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("index", index.toString());
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    const fromIndex = parseInt(e.dataTransfer.getData("index"));
    if (fromIndex === index) return;
    
    const newFeatured = [...featured];
    const [movedItem] = newFeatured.splice(fromIndex, 1);
    newFeatured.splice(index, 0, movedItem);
    
    newFeatured.forEach((item, i) => {
      item.sort_order = i;
    });
    
    setFeatured(newFeatured);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFeatured = (id: string) => {
    if (window.confirm("Bu ürünü öne çıkanlardan kaldırmak istediğinize emin misiniz? (Kaydet butonuna basana kadar kalıcı olarak silinmez)")) {
      setFeatured(featured.filter(f => f.id !== id));
    }
  };

  const addProduct = (p: AvailableProduct) => {
    const newId = Math.random().toString(36).substring(7);
    setFeatured([...featured, {
      id: newId,
      source_id: p.id,
      source_type: p.type,
      sort_order: featured.length
    }]);
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/homepage/featured-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured })
      });
      if (!res.ok) throw new Error("Kaydetme başarısız");
      router.refresh();
      alert("Başarıyla kaydedildi!");
    } catch (err) {
      alert("Hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500 font-semibold">Ana sayfada gösterilecek ürünleri belirleyin ve sırasını ayarlayın.</p>
        <button
          onClick={saveChanges}
          disabled={isSaving}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-black transition-colors disabled:opacity-70"
        >
          {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          Değişiklikleri Kaydet
        </button>
      </div>

      <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-black text-slate-800 text-lg">Öne Çıkan Ürünler ({featured.length})</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            Ürün Ekle
          </button>
        </div>
        
        <div className="p-4 space-y-2">
          {featured.length === 0 && (
            <p className="text-center text-slate-500 py-8">Henüz ürün eklenmemiş.</p>
          )}
          {featured.map((f, index) => {
            const product = availableProducts.find(p => p.id === f.source_id);
            if (!product) return null;
            
            return (
              <div
                key={f.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
                className="flex items-center gap-4 bg-white border border-slate-200 p-3 rounded-xl cursor-move hover:border-cyan-400 transition-colors"
              >
                <div className="text-slate-300">
                  <GripVertical className="h-5 w-5" />
                </div>
                <div className="h-12 w-12 relative shrink-0 bg-white border border-slate-100 rounded-lg p-1">
                  <Image src={product.image} alt="" fill className="object-contain" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">{product.title}</p>
                  <p className="text-xs text-slate-500">{product.category}</p>
                </div>
                <button
                  onClick={() => removeFeatured(f.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 lg:left-72 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-black text-slate-800">Vitrine Ürün Ekle</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
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
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold focus:outline-none focus:border-cyan-500"
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
                  const isAdded = featured.some(f => f.source_id === p.id);
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
                        onClick={() => addProduct(p)}
                        disabled={isAdded}
                        className={`shrink-0 h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${isAdded ? 'bg-slate-100 text-cyan-600' : 'bg-slate-100 text-slate-600 hover:bg-cyan-600 hover:text-white'}`}
                      >
                        {isAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
