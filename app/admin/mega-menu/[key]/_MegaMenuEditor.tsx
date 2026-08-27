"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, GripVertical, Save, Check, X, ChevronDown, ChevronUp, Package, Sparkles } from "lucide-react";

type Persona = {
  id?: string;
  title: string;
  description: string;
  href: string;
  sort_order?: number;
  is_active: boolean;
};

type MegaItem = {
  id?: string;
  title: string;
  href: string;
  image_url: string;
  sort_order?: number;
  is_active: boolean;
  source_type: string;
  source_id?: string;
};

type SectionMeta = {
  id: string;
  menu_key: string;
  title: string;
  eyebrow: string;
  insight_title: string;
  insight_body: string;
  is_active: boolean;
};

type Props = {
  menuKey: string;
  initialData: SectionMeta & {
    personas: Persona[];
    items: MegaItem[];
  };
  allProducts: { id: string; slug: string; name: string; category: string; brand: string; image: string }[];
  initialServiceData: any; // Can be null
};

function textValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

// Sub-component for list builders
function StringListBuilder({
  items,
  setItems,
  placeholder,
  label,
}: {
  items: string[];
  setItems: (items: string[]) => void;
  placeholder: string;
  label: string;
}) {
  const handleAdd = () => setItems([...items, ""]);
  const handleRemove = (idx: number) => {
    if (window.confirm("Bu maddeyi silmek istediğinize emin misiniz? (Kaydet butonuna basana kadar kalıcı olarak kaydedilmez)")) {
      setItems(items.filter((_, i) => i !== idx));
    }
  };
  const handleChange = (idx: number, val: string) => {
    setItems(items.map((item, i) => (i === idx ? val : item)));
  };
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center bg-slate-50 p-3 rounded-t-xl border border-slate-200 border-b-0">
        <span className="text-sm font-black text-slate-700">{label}</span>
        <button
          type="button"
          onClick={handleAdd}
          className="text-xs bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-3 py-1 rounded-lg transition-colors"
        >
          + Ekle
        </button>
      </div>
      <div className="p-4 bg-white border border-slate-200 rounded-b-xl space-y-2 max-h-60 overflow-y-auto">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}.</span>
            <input
              value={item}
              onChange={(e) => handleChange(idx, e.target.value)}
              placeholder={placeholder}
              className="h-10 flex-1 rounded-lg border-2 border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-500"
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">Henüz eklenmiş bir madde bulunmuyor.</p>
        )}
      </div>
    </div>
  );
}

// Sub-component for Advantages builders (Title + Description)
function AdvantagesListBuilder({
  items,
  setItems,
}: {
  items: { title: string; description: string }[];
  setItems: (items: { title: string; description: string }[]) => void;
}) {
  const handleAdd = () => setItems([...items, { title: "", description: "" }]);
  const handleRemove = (idx: number) => {
    if (window.confirm("Bu avantajı silmek istediğinize emin misiniz? (Kaydet butonuna basana kadar kalıcı olarak kaydedilmez)")) {
      setItems(items.filter((_, i) => i !== idx));
    }
  };
  const handleChange = (idx: number, key: "title" | "description", val: string) => {
    setItems(items.map((item, i) => (i === idx ? { ...item, [key]: val } : item)));
  };
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center bg-slate-50 p-3 rounded-t-xl border border-slate-200 border-b-0">
        <span className="text-sm font-black text-slate-700">🛡️ Kazanacağınız Avantajlar (En fazla 4 adet)</span>
        <button
          type="button"
          onClick={handleAdd}
          disabled={items.length >= 4}
          className="text-xs bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
        >
          + Ekle
        </button>
      </div>
      <div className="p-4 bg-white border border-slate-200 rounded-b-xl space-y-3 max-h-96 overflow-y-auto">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-3 items-start bg-slate-50/50 p-3 rounded-xl border border-slate-200">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-black text-slate-600 mt-2">
              {idx + 1}
            </span>
            <div className="flex-1 space-y-2">
              <input
                value={item.title}
                onChange={(e) => handleChange(idx, "title", e.target.value)}
                placeholder="Avantaj Başlığı (Örn: 7/24 Kesintisiz Alarm Takibi)"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-500 font-bold"
              />
              <textarea
                value={item.description}
                onChange={(e) => handleChange(idx, "description", e.target.value)}
                placeholder="Açıklama Metni (Boş bırakılırsa varsayılan genel açıklama metni gösterilir)"
                rows={2}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500 resize-none"
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0 mt-2 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">Henüz avantaj eklenmemiş.</p>
        )}
      </div>
    </div>
  );
}

// Sub-component for Usage Areas builders (Title + Description)
function UsageAreasListBuilder({
  items,
  setItems,
}: {
  items: { title: string; description: string }[];
  setItems: (items: { title: string; description: string }[]) => void;
}) {
  const handleAdd = () => setItems([...items, { title: "", description: "" }]);
  const handleRemove = (idx: number) => {
    if (window.confirm("Bu kullanım alanını silmek istediğinize emin misiniz? (Kaydet butonuna basana kadar kalıcı olarak kaydedilmez)")) {
      setItems(items.filter((_, i) => i !== idx));
    }
  };
  const handleChange = (idx: number, key: "title" | "description", val: string) => {
    setItems(items.map((item, i) => (i === idx ? { ...item, [key]: val } : item)));
  };
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center bg-slate-50 p-3 rounded-t-xl border border-slate-200 border-b-0">
        <span className="text-sm font-black text-slate-700">🏢 Kullanım Alanları</span>
        <button
          type="button"
          onClick={handleAdd}
          className="text-xs bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-3 py-1 rounded-lg transition-colors"
        >
          + Ekle
        </button>
      </div>
      <div className="p-4 bg-white border border-slate-200 rounded-b-xl space-y-3 max-h-96 overflow-y-auto">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-3 items-start bg-slate-50/50 p-3 rounded-xl border border-slate-200">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-black text-slate-600 mt-2">
              {idx + 1}
            </span>
            <div className="flex-1 space-y-2">
              <input
                value={item.title}
                onChange={(e) => handleChange(idx, "title", e.target.value)}
                placeholder="Kullanım Alanı Başlığı (Örn: Müstakil Villalar ve Yazlıklar)"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-500 font-bold"
              />
              <textarea
                value={item.description}
                onChange={(e) => handleChange(idx, "description", e.target.value)}
                placeholder="Açıklama Metni (Örn: Giriş kapıları, bahçe sınırları ve kör noktalar analiz edilir...)"
                rows={2}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500 resize-none"
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0 mt-2 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">Henüz kullanım alanı eklenmemiş.</p>
        )}
      </div>
    </div>
  );
}

// Sub-component for FAQ builders
function FaqListBuilder({
  faqs,
  setFaqs,
}: {
  faqs: { question: string; answer: string }[];
  setFaqs: (faqs: { question: string; answer: string }[]) => void;
}) {
  const handleAdd = () => setFaqs([...faqs, { question: "", answer: "" }]);
  const handleRemove = (idx: number) => {
    if (window.confirm("Bu soru/cevap kaydını silmek istediğinize emin misiniz? (Kaydet butonuna basana kadar kalıcı olarak kaydedilmez)")) {
      setFaqs(faqs.filter((_, i) => i !== idx));
    }
  };
  const handleChange = (idx: number, key: "question" | "answer", val: string) => {
    setFaqs(faqs.map((faq, i) => (i === idx ? { ...faq, [key]: val } : faq)));
  };
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center bg-slate-50 p-3 rounded-t-xl border border-slate-200 border-b-0">
        <span className="text-sm font-black text-slate-700">Sıkça Sorulan Sorular (Soru & Cevap)</span>
        <button
          type="button"
          onClick={handleAdd}
          className="text-xs bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-3 py-1 rounded-lg transition-colors"
        >
          + Yeni Soru Ekle
        </button>
      </div>
      <div className="p-4 bg-white border border-slate-200 rounded-b-xl space-y-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className="flex gap-3 items-start bg-slate-50/50 p-3 rounded-xl border border-slate-200">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-black text-slate-600 mt-1.5">
              {idx + 1}
            </span>
            <div className="flex-1 space-y-2">
              <input
                value={faq.question}
                onChange={(e) => handleChange(idx, "question", e.target.value)}
                placeholder="Soru"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-500"
              />
              <textarea
                value={faq.answer}
                onChange={(e) => handleChange(idx, "answer", e.target.value)}
                placeholder="Cevap"
                rows={2}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500 resize-none"
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0 mt-1.5 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {faqs.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">Henüz SSS eklenmemiş.</p>
        )}
      </div>
    </div>
  );
}

export function MegaMenuEditor({ menuKey, initialData, allProducts, initialServiceData }: Props) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"menu" | "service">("menu");

  // Section meta state
  const [section, setSection] = useState<SectionMeta>({
    id: initialData.id,
    menu_key: initialData.menu_key,
    title: initialData.title,
    eyebrow: initialData.eyebrow,
    insight_title: initialData.insight_title,
    insight_body: initialData.insight_body,
    is_active: initialData.is_active,
  });

  // Items state
  const [items, setItems] = useState<MegaItem[]>(
    initialData.items.map((i) => ({
      ...i,
      image_url: textValue((i as any).image_url ?? (i as any).image),
    })),
  );

  // Service Page state
  const [hasServiceData, setHasServiceData] = useState(!!initialServiceData);
  const [serviceTitle, setServiceTitle] = useState(textValue(initialServiceData?.title));
  const [serviceHeroTitle, setServiceHeroTitle] = useState(textValue(initialServiceData?.hero_title));
  const [serviceHeroImage, setServiceHeroImage] = useState(textValue(initialServiceData?.image_url));
  const [serviceHeroDescription, setServiceHeroDescription] = useState(textValue(initialServiceData?.hero_description));
  const [serviceIntroTitle, setServiceIntroTitle] = useState(textValue(initialServiceData?.intro_title));
  const [serviceIntroContent, setServiceIntroContent] = useState(textValue(initialServiceData?.intro_content));
  const [serviceAdvantages, setServiceAdvantages] = useState<{ title: string; description: string }[]>(
    Array.isArray(initialServiceData?.advantages)
      ? initialServiceData.advantages.map((adv: any) =>
          typeof adv === "string"
            ? { title: adv, description: "" }
            : { title: textValue(adv?.title), description: textValue(adv?.description) }
        )
      : []
  );
  const [serviceUsageAreas, setServiceUsageAreas] = useState<{ title: string; description: string }[]>(
    Array.isArray(initialServiceData?.usage_areas)
      ? initialServiceData.usage_areas.map((item: any) =>
          typeof item === "string"
            ? { title: item, description: "" }
            : { title: textValue(item?.title), description: textValue(item?.description) }
        )
      : []
  );
  const [serviceProcessSteps, setServiceProcessSteps] = useState<string[]>(
    Array.isArray(initialServiceData?.process_steps)
      ? initialServiceData.process_steps.map(textValue)
      : []
  );
  const [serviceFaqs, setServiceFaqs] = useState<{ question: string; answer: string }[]>(
    Array.isArray(initialServiceData?.faqs)
      ? initialServiceData.faqs.map((faq: any) => ({
          question: textValue(faq?.question),
          answer: textValue(faq?.answer),
        }))
      : []
  );

  // Product picker state
  const [productSearch, setProductSearch] = useState("");
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [replacingItemIndex, setReplacingItemIndex] = useState<number | null>(null);

  // Service page specific states
  const [serviceRelatedProductIds, setServiceRelatedProductIds] = useState<string[]>(
    Array.isArray(initialServiceData?.related_product_ids) ? initialServiceData.related_product_ids : []
  );

  const [serviceDeepDive, setServiceDeepDive] = useState<{ title: string; text: string }[]>(
    Array.isArray(initialServiceData?.deep_dive) && initialServiceData.deep_dive.length === 3
      ? initialServiceData.deep_dive
      : [
          {
            title: "Hizmet kapsamı nasıl belirlenir?",
            text: "Kapsam belirlenirken öncelikle korunacak alan, risk seviyesi ve günlük kullanım ritmi incelenir. Alarm Sistemlerissasdadasdadasda için 7/24 algılama ve caydırıcılıkdasda, mobil uygulama ile uzaktan kontrolsdasd, mekana göre sensör planıasdas, kablolu ve kablosuz seçeneklerdasdasd gibi avantajların gerçekten çalışması, keşif sırasında toplanan verilerin doğru yorumlanmasına bağlıdır. PrimeSec ekibi bu aşamada cihaz sayısını, bağlantı şeklini, kullanıcı yetkilerini ve servis ihtiyaçlarını netleştirir."
          },
          {
            title: "Kurulum sonrası kullanım deneyimi",
            text: "İyi bir güvenlik sistemi yalnızca kurulduğu gün değil, her gün kolay kullanılmalıdır. Bu nedenle mobil uygulama ayarları, bildirim tercihleri, kayıt erişimi, kullanıcı rolleri ve temel bakım noktaları teslim sırasında anlatılır. Böylece sistem teknik olarak güçlü olduğu kadar kullanıcı açısından da anlaşılır kalır."
          },
          {
            title: "Neden PrimeSec yaklaşımı?",
            text: "PrimeSec Teknoloji ürünleri tek tek satmak yerine, birbirini tamamlayan bir çözüm mimarisi kurmaya odaklanır. Alarm, kamera, akıllı ev, yangın ihbar, PDKS, kapı geçiş ve network çözümleri gerektiğinde aynı plan içinde değerlendirilir. Bu yaklaşım hem maliyet kontrolü sağlar hem de sistemin ileride genişletilmesini kolaylaştırır."
          }
        ]
  );

  const [serviceProductSearch, setServiceProductSearch] = useState("");
  const [showServiceProductPicker, setShowServiceProductPicker] = useState(false);

  function toggleServiceProduct(productId: string) {
    setServiceRelatedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }

  const filteredServiceProducts = allProducts.filter((p) => {
    const q = serviceProductSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  });

  // ── Item helpers ─────────────────────────────────────────────
  function updateItem(idx: number, key: keyof MegaItem, value: string | boolean) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [key]: value } : it)));
  }

  function addCustomItem() {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: "",
        href: "/",
        image_url: "/images/alarm-sistemi.svg",
        is_active: true,
        source_type: "custom",
      },
    ]);
  }

  function removeItem(idx: number) {
    if (window.confirm("Bu menü linkini kaldırmak istediğinize emin misiniz? (Kaydet butonuna basana kadar kalıcı olarak silinmez)")) {
      setItems((prev) => prev.filter((_, i) => i !== idx));
    }
  }

  function moveItem(idx: number, dir: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  // Add product from picker
  function addProduct(product: { slug: string; name: string; category: string; image: string }) {
    const href = `/urunler/${product.slug}`;
    const alreadyAdded = items.some((it) => it.source_id === product.slug);
    if (alreadyAdded) return;
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: product.name,
        href,
        image_url: product.image,
        is_active: true,
        source_type: "product",
        source_id: product.slug,
      },
    ]);
  }

  function replaceItemWithProduct(
    index: number,
    product: { slug: string; name: string; category: string; image: string },
  ) {
    setItems((prev) => prev.map((item, itemIndex) => (
      itemIndex === index
        ? {
            ...item,
            title: product.name,
            href: `/urunler/${product.slug}`,
            image_url: product.image,
            source_type: "product",
            source_id: product.slug,
          }
        : item
    )));
    setReplacingItemIndex(null);
    setShowProductPicker(false);
    setProductSearch("");
  }

  // ── Save ─────────────────────────────────────────────────────
  async function handleSave() {
    setError(null);
    setSaved(false);

    if (hasServiceData && (!textValue(serviceTitle).trim() || !textValue(serviceHeroTitle).trim())) {
      setError("Hizmet sayfası için Sayfa Başlığı ve Hero Başlığı (H1) zorunludur.");
      return;
    }

    startTransition(async () => {
      try {
        const body = {
          section: {
            title: section.title,
            eyebrow: section.eyebrow,
            insight_title: section.insight_title,
            insight_body: section.insight_body,
            is_active: section.is_active,
          },
          items: items.map((it, idx) => ({ ...it, sort_order: idx })),
          servicePage: hasServiceData ? {
            title: serviceTitle,
            hero_title: serviceHeroTitle,
            hero_description: serviceHeroDescription,
            image_url: serviceHeroImage,
            intro_title: serviceIntroTitle,
            intro_content: serviceIntroContent,
            advantages: serviceAdvantages.filter((item) => textValue(item.title).trim() !== ""),
            usage_areas: serviceUsageAreas.filter((item) => textValue(item.title).trim() !== ""),
            process_steps: serviceProcessSteps.filter((item) => textValue(item).trim() !== ""),
            faqs: serviceFaqs.filter((faq) =>
              textValue(faq.question).trim() !== "" || textValue(faq.answer).trim() !== ""
            ),
            related_product_ids: serviceRelatedProductIds,
            deep_dive: serviceDeepDive,
          } : null
        };

        const res = await fetch(`/api/admin/mega-menu/${menuKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error((data as any).error ?? "Kayıt başarısız");
        }

        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch (err: any) {
        setError(err.message ?? "Bir hata oluştu");
      }
    });
  }

  // Filtered products for picker
  const filteredProducts = allProducts.filter((p) => {
    const q = productSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  });

  const addedSlugs = new Set(items.filter((i) => i.source_type === "product").map((i) => i.source_id));

  return (
    <div className="space-y-6">
      {/* Save bar */}
      <div className="sticky top-16 z-20 flex items-center justify-between gap-4 rounded-2xl border-2 border-slate-200 bg-white/95 backdrop-blur px-5 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={section.is_active}
              onChange={(e) => setSection((s) => ({ ...s, is_active: e.target.checked }))}
              className="h-5 w-5 accent-cyan-600"
            />
            <span className="text-sm font-black text-slate-700">Menü Aktif</span>
          </label>
          {error && <p className="text-sm font-bold text-red-600">⚠️ {error}</p>}
          {saved && <p className="text-sm font-bold text-emerald-600">✓ Kaydedildi!</p>}
        </div>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-cyan-600 px-5 text-sm font-black text-white transition-all hover:bg-cyan-700 disabled:opacity-60"
        >
          {isPending ? (
            <span className="animate-spin">⟳</span>
          ) : saved ? (
            <Check className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isPending ? "Kaydediliyor..." : saved ? "Kaydedildi" : "Tümünü Kaydet"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("menu")}
          className={`px-6 py-4 text-sm font-black border-b-2 transition-colors ${
            activeTab === "menu"
              ? "border-cyan-600 text-cyan-700 bg-cyan-50/50"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          }`}
        >
          🧭 Mega Menü Ayarları
        </button>
        <button
          onClick={() => setActiveTab("service")}
          className={`px-6 py-4 text-sm font-black border-b-2 transition-colors ${
            activeTab === "service"
              ? "border-cyan-600 text-cyan-700 bg-cyan-50/50"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          }`}
        >
          📄 Hizmet Sayfası İçeriği (/{menuKey})
        </button>
      </div>

      {/* Render Tab Contents */}
      {activeTab === "menu" ? (
        <>
          {/* Section Meta */}
          <section className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-black text-slate-800">⚙️ Genel Bilgiler</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-black text-slate-700">Menü Başlığı</span>
                <input
                  value={section.title}
                  onChange={(e) => setSection((s) => ({ ...s, title: e.target.value }))}
                  className="mt-1.5 h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm outline-none focus:border-cyan-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-black text-slate-700">Eyebrow (Üst Etiket)</span>
                <input
                  value={section.eyebrow}
                  onChange={(e) => setSection((s) => ({ ...s, eyebrow: e.target.value }))}
                  className="mt-1.5 h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm outline-none focus:border-cyan-500"
                  placeholder="Örn: Risk tipine göre seçin"
                />
              </label>
              <label className="block">
                <span className="text-sm font-black text-slate-700">Sağ Panel Başlık (CTA Kutusu)</span>
                <input
                  value={section.insight_title}
                  onChange={(e) => setSection((s) => ({ ...s, insight_title: e.target.value }))}
                  className="mt-1.5 h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm outline-none focus:border-cyan-500"
                  placeholder="Örn: Ücretsiz Keşif İster misiniz?"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-black text-slate-700">Sağ Panel Açıklama (CTA Alt Metni)</span>
                <textarea
                  value={section.insight_body}
                  onChange={(e) => setSection((s) => ({ ...s, insight_body: e.target.value }))}
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500 resize-none"
                  placeholder="Hemen WhatsApp hattımızdan bize ulaşın..."
                />
              </label>
            </div>
          </section>

          {/* Items */}
          <section className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-800">🔗 Menü Linkleri (Orta Kolon)</h3>
                <p className="text-sm text-slate-500 border-0 p-0 bg-transparent">
                  {items.length} link — aktif olanlar menüde görünür
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setReplacingItemIndex(null);
                    setShowProductPicker((value) => !value);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-600 hover:border-cyan-400 hover:text-cyan-600 transition-colors"
                >
                  <Package className="h-4 w-4" /> Üründen Ekle
                  {showProductPicker ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={addCustomItem}
                  className="inline-flex items-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 bg-white px-3 py-2 text-sm font-black text-slate-600 hover:border-cyan-400 hover:text-cyan-600 transition-colors"
                >
                  <Plus className="h-4 w-4" /> Özel Link
                </button>
              </div>
            </div>

            {/* Product picker */}
            {showProductPicker && (
              <div className="mb-4 rounded-xl border-2 border-cyan-200 bg-cyan-50 p-4">
                <p className="mb-2 text-sm font-black text-cyan-800">
                  {replacingItemIndex === null
                    ? "Mevcut ürünlerden seçin (checkbox ile menüye ekleyin):"
                    : `“${items[replacingItemIndex]?.title || "Menü ürünü"}” yerine kullanılacak ürünü seçin:`}
                </p>
                <input
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Ürün ara (isim, kategori, marka, slug)..."
                  className="mb-3 h-10 w-full rounded-lg border border-cyan-300 bg-white px-3 text-sm outline-none focus:border-cyan-500"
                />
                <div className="max-h-96 overflow-y-auto space-y-1 pr-1">
                  {filteredProducts.map((p) => {
                    const added = addedSlugs.has(p.slug);
                    if (replacingItemIndex !== null) {
                      const isCurrent = items[replacingItemIndex]?.source_id === p.slug;
                      return (
                        <button
                          type="button"
                          key={p.slug}
                          onClick={() => replaceItemWithProduct(replacingItemIndex, p)}
                          disabled={isCurrent}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${isCurrent ? "cursor-not-allowed bg-cyan-100 opacity-60" : "bg-white hover:bg-cyan-100"}`}
                        >
                          <Package className="h-4 w-4 shrink-0 text-cyan-600" />
                          <div className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-bold text-slate-800">{p.name}</span>
                            <span className="block truncate text-xs text-slate-400">{p.category} · {p.brand}</span>
                          </div>
                          <span className="text-xs font-black text-cyan-700">{isCurrent ? "Mevcut" : "Seç"}</span>
                        </button>
                      );
                    }
                    return (
                      <label
                        key={p.slug}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors ${added ? "bg-cyan-100" : "bg-white hover:bg-slate-50"}`}
                      >
                        <input
                          type="checkbox"
                          checked={added}
                          onChange={() => {
                            if (added) {
                              setItems((prev) => prev.filter((it) => it.source_id !== p.slug));
                            } else {
                              addProduct(p);
                            }
                          }}
                          className="h-4 w-4 accent-cyan-600 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="block text-sm font-bold text-slate-800 truncate">{p.name}</span>
                          <span className="block text-xs text-slate-400 truncate">{p.category} · {p.brand}</span>
                        </div>
                      </label>
                    );
                  })}
                  {filteredProducts.length === 0 && (
                    <p className="py-4 text-center text-sm text-slate-400">Sonuç bulunamadı</p>
                  )}
                </div>
              </div>
            )}

            {/* Items list */}
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border-2 p-4 transition-colors ${item.is_active ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50 opacity-60"}`}
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-black text-slate-600">
                        {idx + 1}
                      </span>
                      {item.source_type === "product" && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-black text-blue-600">
                          ÜRÜN
                        </span>
                      )}
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.is_active}
                          onChange={(e) => updateItem(idx, "is_active", e.target.checked)}
                          className="h-4 w-4 accent-cyan-600"
                        />
                        <span className="text-xs font-bold text-slate-500">Göster</span>
                      </label>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveItem(idx, -1)}
                        disabled={idx === 0}
                        className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg"
                        title="Yukarı taşı"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(idx, 1)}
                        disabled={idx === items.length - 1}
                        className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg"
                        title="Aşağı taşı"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setReplacingItemIndex(idx);
                          setShowProductPicker(true);
                          setProductSearch("");
                        }}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-black text-cyan-700 hover:bg-cyan-50"
                        title="Bu menü kaydındaki ürünü değiştir"
                      >
                        <Package className="h-4 w-4" /> Değiştir
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="block">
                      <span className="text-xs font-black text-slate-600">Başlık</span>
                      <input
                        value={item.title}
                        onChange={(e) => updateItem(idx, "title", e.target.value)}
                        className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-500"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-black text-slate-600">Link (href)</span>
                      <input
                        value={item.href}
                        onChange={(e) => updateItem(idx, "href", e.target.value)}
                        className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-500"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-black text-slate-600">Görsel URL</span>
                      <input
                        value={item.image_url}
                        onChange={(e) => updateItem(idx, "image_url", e.target.value)}
                        className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-500"
                        placeholder="/images/alarm-sistemi.svg"
                      />
                    </label>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
                  <p className="text-sm text-slate-400">Henüz link yok. Yukarıdaki butonlarla ekleyin.</p>
                </div>
              )}
            </div>
          </section>
        </>
      ) : (
        /* Tab 2: Service Page Contents */
        <div className="space-y-6">
          {!hasServiceData ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="h-6 w-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-black text-slate-800">Hizmet Sayfası Bulunamadı</h3>
              <p className="text-sm text-slate-500 font-semibold max-w-md mx-auto">
                Veritabanınızda bu mega menüye (/{menuKey}) bağlı bir hizmet detay sayfası bulunmamaktadır. Aşağıdaki butona tıklayarak hemen oluşturabilirsiniz.
              </p>
              <button
                type="button"
                onClick={() => {
                  setHasServiceData(true);
                  setServiceTitle(section.title || menuKey);
                  setServiceHeroTitle(section.title || menuKey);
                }}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-6 text-sm transition-colors"
              >
                Hizmet Sayfası İçerik Editörünü Aktif Et
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header / Intro section */}
              <section className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
                  <span>📝 Sayfa Giriş ve Kahraman (Hero) Bölümü</span>
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-black text-slate-700">Hizmet Sayfası Başlığı</span>
                    <input
                      value={serviceTitle}
                      onChange={(e) => setServiceTitle(e.target.value)}
                      className="mt-1.5 h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm outline-none focus:border-cyan-500"
                      placeholder="Örn: Hırsız Alarm Sistemleri"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-black text-slate-700">Kahraman Bölümü Başlığı (H1)</span>
                    <input
                      value={serviceHeroTitle}
                      onChange={(e) => setServiceHeroTitle(e.target.value)}
                      className="mt-1.5 h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm outline-none focus:border-cyan-500"
                      placeholder="Örn: Ev ve İş Yeri Alarm Çözümleri"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-black text-slate-700">Kahraman Bölümü Kısa Açıklaması (Hero Description)</span>
                    <textarea
                      value={serviceHeroDescription}
                      onChange={(e) => setServiceHeroDescription(e.target.value)}
                      rows={2}
                      className="mt-1.5 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500 resize-none"
                      placeholder="Ev ve iş yerleriniz için 7/24 kesintisiz koruma sunan alarm çözümleri..."
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-black text-slate-700">Kahraman Bölümü Görsel Linki (Hero Image URL)</span>
                    <input
                      value={serviceHeroImage}
                      onChange={(e) => setServiceHeroImage(e.target.value)}
                      className="mt-1.5 h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm outline-none focus:border-cyan-500"
                      placeholder="Örn: https://images.unsplash.com/photo-... veya /images/alarm-sistemi.svg"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-black text-slate-700">Detaylı Tanıtım Bölümü Başlığı</span>
                    <input
                      value={serviceIntroTitle}
                      onChange={(e) => setServiceIntroTitle(e.target.value)}
                      className="mt-1.5 h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm outline-none focus:border-cyan-500"
                      placeholder="Örn: Alarm Sistemi Nasıl Planlanmalı?"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-black text-slate-700">Detaylı Tanıtım Yazısı (Intro Content)</span>
                    <textarea
                      value={serviceIntroContent}
                      onChange={(e) => setServiceIntroContent(e.target.value)}
                      rows={5}
                      className="mt-1.5 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
                      placeholder="Paragraflar arasında bir boşluk bırakarak yazın (Çift Enter). Bu metin detaylı hizmet rehberi alanında gösterilir."
                    />
                  </label>
                </div>
              </section>

              {/* Lists section */}
              <section className="grid gap-6 md:grid-cols-2">
                <AdvantagesListBuilder
                  items={serviceAdvantages}
                  setItems={setServiceAdvantages}
                />
                <UsageAreasListBuilder
                  items={serviceUsageAreas}
                  setItems={setServiceUsageAreas}
                />
                <div className="md:col-span-2">
                  <StringListBuilder
                    items={serviceProcessSteps}
                    setItems={setServiceProcessSteps}
                    label="⚙️ Adım Adım Proje Sürecimiz"
                    placeholder="Örn: Ücretsiz Keşif ve Risk Analizi Yapılması"
                  />
                </div>
              </section>

              {/* FAQs section */}
              <section className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
                <FaqListBuilder
                  faqs={serviceFaqs}
                  setFaqs={setServiceFaqs}
                />
              </section>

              {/* Featured Products selection */}
              <section className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-800">🛍️ Bu Hizmet İçin Öne Çıkan Ürünlerimiz</h3>
                    <p className="text-sm text-slate-500 border-0 p-0 bg-transparent">
                      Hizmet sayfasının altında gösterilecek ürünleri seçin ({serviceRelatedProductIds.length} ürün seçildi)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowServiceProductPicker((v) => !v)}
                    className="inline-flex items-center gap-1.5 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-600 hover:border-cyan-400 hover:text-cyan-600 transition-colors"
                  >
                    <Package className="h-4 w-4" /> Ürün Seç
                    {showServiceProductPicker ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                {showServiceProductPicker && (
                  <div className="mb-4 rounded-xl border-2 border-cyan-200 bg-cyan-50/30 p-4">
                    <input
                      value={serviceProductSearch}
                      onChange={(e) => setServiceProductSearch(e.target.value)}
                      placeholder="Ürün ara (isim, marka, kategori, model)..."
                      className="mb-3 h-10 w-full rounded-lg border border-cyan-300 bg-white px-3 text-sm outline-none focus:border-cyan-500"
                    />
                    <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                      {filteredServiceProducts.map((p) => {
                        const isSelected = serviceRelatedProductIds.includes(p.id);
                        return (
                          <label
                            key={p.slug}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isSelected ? "bg-cyan-100/70" : "bg-white hover:bg-slate-50"}`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleServiceProduct(p.id)}
                              className="h-4 w-4 accent-cyan-600 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <span className="block text-sm font-bold text-slate-800 truncate">{p.name}</span>
                              <span className="block text-xs text-slate-400 truncate">{p.category} · {p.brand}</span>
                            </div>
                          </label>
                        );
                      })}
                      {filteredServiceProducts.length === 0 && (
                        <p className="py-4 text-center text-sm text-slate-400">Sonuç bulunamadı</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Show selected products as badges */}
                <div className="flex flex-wrap gap-2">
                  {serviceRelatedProductIds.map((id) => {
                    const product = allProducts.find((p) => p.id === id);
                    if (!product) return null;
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700"
                      >
                        <span>{product.name}</span>
                        <button
                          type="button"
                          onClick={() => toggleServiceProduct(id)}
                          className="text-red-500 hover:text-red-700 font-extrabold text-sm ml-1"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                  {serviceRelatedProductIds.length === 0 && (
                    <p className="text-sm text-slate-400 italic">Henüz öne çıkan ürün seçilmedi. Kategoriye ait ürünler varsayılan olarak gösterilecektir.</p>
                  )}
                </div>
              </section>

              {/* Deep Dive Blocks */}
              <section className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
                  <span>📖 Kapsam Belirleme ve Yaklaşımlar (Derinlemesine İnceleme)</span>
                </h3>
                <div className="space-y-4">
                  {serviceDeepDive.map((block, idx) => (
                    <div key={idx} className="p-4 bg-slate-50/50 border border-slate-200 rounded-xl space-y-2">
                      <label className="block">
                        <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">Kart {idx + 1} Başlığı</span>
                        <input
                          type="text"
                          value={block.title}
                          onChange={(e) => {
                            const newDeep = [...serviceDeepDive];
                            newDeep[idx].title = e.target.value;
                            setServiceDeepDive(newDeep);
                          }}
                          className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none focus:border-cyan-500"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">Kart {idx + 1} Metni</span>
                        <textarea
                          value={block.text}
                          onChange={(e) => {
                            const newDeep = [...serviceDeepDive];
                            newDeep[idx].text = e.target.value;
                            setServiceDeepDive(newDeep);
                          }}
                          rows={4}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-cyan-500 resize-none"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      )}

      {/* Bottom save button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-cyan-600 px-8 text-base font-black text-white transition-all hover:bg-cyan-700 hover:scale-[1.02] disabled:opacity-60"
        >
          {isPending ? "Kaydediliyor..." : "💾 Değişiklikleri Kaydet"}
        </button>
      </div>
    </div>
  );
}
