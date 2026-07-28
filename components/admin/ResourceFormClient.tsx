"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  createQuickProductBrand,
  createQuickProductCategory,
  deleteQuickProductCategory,
  saveResource,
  updateQuickProductCategory,
} from "@/lib/admin/actions";
import type { AdminResource, AdminField, FieldGroup } from "@/lib/admin/resources";
import { Eye, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";

function CustomListBuilder({
  defaultValue,
  name,
  label,
  max,
}: {
  defaultValue: string;
  name: string;
  label: string;
  max: number;
}) {
  let initialValues: string[] = [];
  if (defaultValue) {
    try {
      initialValues = JSON.parse(defaultValue);
    } catch {
      initialValues = defaultValue.split("\n").map((s) => s.trim()).filter(Boolean);
    }
  }

  const [items, setItems] = useState<string[]>(() => {
    const list = [...initialValues];
    while (list.length < max) {
      list.push("");
    }
    return list.slice(0, max);
  });

  const handleChange = (index: number, val: string) => {
    const newItems = [...items];
    newItems[index] = val;
    setItems(newItems);
  };

  const serializedValue = items.filter((item) => item.trim() !== "").join("\n");

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={serializedValue} />
      <span className="text-sm font-bold text-slate-700 block">{label}</span>
      <div className="grid gap-2">
        {items.map((item, index) => (
          <input
            key={index}
            type="text"
            placeholder={`${index + 1}. Madde`}
            value={item}
            onChange={(e) => handleChange(index, e.target.value)}
            className="w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 text-base outline-none focus:border-cyan-500 transition-colors focus:ring-2 focus:ring-cyan-100"
          />
        ))}
      </div>
    </div>
  );
}

function FaqBuilder({ defaultValue, name }: { defaultValue: string; name: string }) {
  let initialFaqs: { question: string; answer: string }[] = [];
  if (defaultValue) {
    try {
      const parsed = JSON.parse(defaultValue);
      if (Array.isArray(parsed)) {
        initialFaqs = parsed.map((item) => {
          if (typeof item === "object" && item) {
            return {
              question: String(item.question ?? ""),
              answer: String(item.answer ?? ""),
            };
          }
          return { question: "", answer: "" };
        });
      }
    } catch {
      initialFaqs = defaultValue.split("\n").map((line) => {
        const [q, ...a] = line.split("|");
        return { question: q?.trim() ?? "", answer: a.join("|").trim() };
      });
    }
  }

  const [faqs, setFaqs] = useState(initialFaqs.length > 0 ? initialFaqs : [{ question: "", answer: "" }]);

  const updateFaq = (index: number, key: "question" | "answer", value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][key] = value;
    setFaqs(newFaqs);
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const removeFaq = (index: number) => {
    if (window.confirm("Bu soru/cevap kaydını silmek istediğinize emin misiniz? (Kaydet butonuna basana kadar kalıcı olarak kaydedilmez)")) {
      setFaqs(faqs.filter((_, i) => i !== index));
    }
  };

  const serializedValue = JSON.stringify(faqs.filter((f) => f.question.trim() !== "" || f.answer.trim() !== ""));

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={serializedValue} />
      <span className="text-base font-black text-slate-700 block">Sıkça Sorulan Sorular (Soru & Cevap)</span>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="flex gap-3 items-start bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex-1 space-y-2">
              <input
                type="text"
                placeholder="Soru"
                value={faq.question}
                onChange={(e) => updateFaq(index, "question", e.target.value)}
                className="w-full h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-500 bg-white"
              />
              <textarea
                placeholder="Cevap"
                value={faq.answer}
                onChange={(e) => updateFaq(index, "answer", e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 bg-white resize-none"
              />
            </div>
            {faqs.length > 1 && (
              <button
                type="button"
                onClick={() => removeFaq(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0 mt-1"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addFaq}
        className="inline-flex items-center gap-1 text-xs font-bold text-cyan-600 hover:text-cyan-700 bg-cyan-50 hover:bg-cyan-100 px-3 py-2 rounded-lg transition-colors"
      >
        <Plus className="h-4 w-4" /> Yeni Soru/Cevap Ekle
      </button>
    </div>
  );
}

function GalleryBuilder({ defaultValue, name }: { defaultValue: string; name: string }) {
  let initialImages: string[] = [];
  if (defaultValue) {
    try {
      const parsed = JSON.parse(defaultValue);
      if (Array.isArray(parsed)) {
        initialImages = parsed.map((item) => {
          if (typeof item === "object" && item) {
            return String(item.url ?? "");
          }
          return String(item);
        }).filter(Boolean);
      }
    } catch {
      initialImages = defaultValue.split("\n").map((line) => {
        if (line.includes("|")) {
          return line.split("|")[0].trim();
        }
        return line.trim();
      }).filter(Boolean);
    }
  }

  const [images, setImages] = useState<string[]>(initialImages);
  const [newUrl, setNewUrl] = useState("");

  const addImage = () => {
    if (newUrl.trim()) {
      setImages([...images, newUrl.trim()]);
      setNewUrl("");
    }
  };

  const removeImage = (index: number) => {
    if (window.confirm("Bu görseli galeriden kaldırmak istediğinize emin misiniz? (Kaydet butonuna basana kadar kalıcı olarak kaydedilmez)")) {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const serializedValue = JSON.stringify(images.map((url) => ({ url, alt: "" })));

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={serializedValue} />
      <span className="text-base font-black text-slate-700 block">Ürün Galeri Görselleri (Birden Çok Resim)</span>
      
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
          {images.map((url, index) => (
            <div key={index} className="relative aspect-video bg-white rounded-lg border border-slate-200 overflow-hidden group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors opacity-90 group-hover:opacity-100 shadow-sm"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Yeni görsel URL adresi (https://...)"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className="flex-1 h-12 rounded-xl border-2 border-slate-200 bg-white px-4 text-sm outline-none focus:border-cyan-500 transition-colors"
        />
        <button
          type="button"
          onClick={addImage}
          className="h-12 inline-flex items-center gap-1 text-sm font-bold bg-cyan-600 hover:bg-cyan-700 text-white px-5 rounded-xl transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" /> Ekle
        </button>
      </div>
    </div>
  );
}

function FeaturesBuilder({
  defaultValue,
  name,
  label,
  titlePlaceholder = "Başlık",
  descPlaceholder = "Açıklama veya Değer",
}: {
  defaultValue: string;
  name: string;
  label?: string;
  titlePlaceholder?: string;
  descPlaceholder?: string;
}) {
  const isSpecs = ["installation_steps", "custom_attributes", "side_attributes", "technical_attributes"].includes(name);
  const defaultPlaceholders = [
    { title: "Lens Tipi", desc: "Sabit Lens" },
    { title: "Kamera Tipi", desc: "AHD / HD-CVI / HD-TVI" },
    { title: "Lens Boyutu", desc: "3.6 MM" },
    { title: "Kullanım Tipi", desc: "Dış Mekan (Bullet)" }
  ];

  let initialFeatures: { title: string; description: string; active?: boolean }[] = [];
  if (defaultValue) {
    try {
      const parsed = JSON.parse(defaultValue);
      if (Array.isArray(parsed)) {
        initialFeatures = parsed
          .map((item) => {
            if (typeof item === "string") return { title: item, description: "", active: true };
            if (typeof item === "object" && item) {
              return {
                title: String(item.title ?? ""),
                description: String(item.description ?? ""),
                active: item.active !== false
              };
            }
            return { title: "", description: "", active: true };
          })
          .filter((f) => f.title.trim() !== "" || f.description.trim() !== "");
      }
    } catch {
      const lines = defaultValue.split("\n").map((s) => s.trim()).filter(Boolean);
      initialFeatures = lines.map((line) => {
        if (line.startsWith("{") && line.endsWith("}")) {
          try {
            const obj = JSON.parse(line);
            return {
              title: String(obj.title ?? ""),
              description: String(obj.description ?? ""),
              active: obj.active !== false
            };
          } catch {}
        }
        return { title: line, description: "", active: true };
      });
    }
  }

  const [features, setFeatures] = useState(() => {
    const list = [...initialFeatures];
    while (list.length < 4) {
      list.push({ title: "", description: "", active: true });
    }
    return list.map((item) => ({
      title: item.title,
      description: item.description,
      active: item.active !== false
    }));
  });

  const updateFeature = (index: number, key: string, value: any) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [key]: value };
    setFeatures(newFeatures);
  };

  const addFeature = () => {
    setFeatures([...features, { title: "", description: "", active: true }]);
  };

  const removeFeature = (index: number) => {
    if (window.confirm("Bu kartı/maddeyi silmek istediğinize emin misiniz? (Kaydet butonuna basana kadar kalıcı olarak kaydedilmez)")) {
      setFeatures(features.filter((_, i) => i !== index));
    }
  };

  const serializedValue = JSON.stringify(
    features
      .map((f) => {
        const title = f.title.trim();
        const description = f.description.trim();
        return {
          title,
          description,
          active: f.active !== false
        };
      })
      .filter((f) => f.title.trim() !== "")
  );

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={serializedValue} />
      <span className="text-base font-black text-slate-700 block">{label || "Avantaj Kartları"}</span>
      <div className="space-y-3">
        {features.map((feature, index) => {
          const placeholderObj = isSpecs && defaultPlaceholders[index]
            ? defaultPlaceholders[index]
            : { title: titlePlaceholder, desc: descPlaceholder };

          return (
            <div key={index} className="flex gap-3 items-start bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-600 text-white font-bold text-sm mt-1">
                {index + 1}
              </div>
              <div className="flex-1 space-y-2">
                {isSpecs ? <span className="block text-xs font-black uppercase tracking-wider text-slate-500">Etiket</span> : null}
                <input
                  type="text"
                  placeholder={placeholderObj.title}
                  value={feature.title}
                  onChange={(e) => updateFeature(index, "title", e.target.value)}
                  className="w-full h-11 rounded-lg border border-slate-200 px-3 text-sm font-bold outline-none focus:border-cyan-500 bg-white"
                />
                {isSpecs ? (
                  <>
                    <span className="block pt-1 text-xs font-black uppercase tracking-wider text-slate-500">Değer</span>
                    <input
                      type="text"
                      placeholder={placeholderObj.desc}
                      value={feature.description}
                      onChange={(e) => updateFeature(index, "description", e.target.value)}
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-cyan-500"
                    />
                  </>
                ) : (
                  <textarea
                    placeholder={placeholderObj.desc}
                    value={feature.description}
                    onChange={(e) => updateFeature(index, "description", e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 bg-white resize-none"
                  />
                )}
              </div>
              <div className="flex flex-col gap-2 justify-center items-center shrink-0 mt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-500 select-none">
                  <input
                    type="checkbox"
                    checked={feature.active !== false}
                    onChange={(e) => updateFeature(index, "active", e.target.checked)}
                    className="h-4 w-4 accent-cyan-600 rounded border-slate-300"
                  />
                  Göster
                </label>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                  title="Sil"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={addFeature}
        className="inline-flex items-center gap-1 text-xs font-bold text-cyan-600 hover:text-cyan-700 bg-cyan-50 hover:bg-cyan-100 px-3 py-2 rounded-lg transition-colors"
      >
        <Plus className="h-4 w-4" /> Yeni Madde Ekle
      </button>
    </div>
  );
}

const groupLabels: Record<FieldGroup, { title: string; description: string }> = {
  content: {
    title: "📝 İçerik",
    description: "Başlık, açıklama ve metin alanları.",
  },
  media: {
    title: "🖼️ Görsel",
    description: "Resim adresi.",
  },
  publish: {
    title: "📢 Yayın Durumu",
    description: "Sitede görünsün mü?",
  },
  seo: {
    title: "🔍 Google Ayarları",
    description: "Teknik SEO alanları.",
  },
  settings: {
    title: "⚙️ Teknik Ayarlar",
    description: "Teknik ayarlar.",
  },
};

// Determine which fields should be visible in the simple mode.
// Only show the bare minimum a non-technical person would fill in.
function isSimpleField(field: AdminField, resourceKey: string): boolean {
  // siteSettings: show key + value (that's the whole point)
  if (resourceKey === "siteSettings") {
    return field.name === "key" || field.name === "value";
  }

  // leads: show basic contact info + status
  if (resourceKey === "leads") {
    return ["full_name", "phone", "message", "status", "admin_note"].includes(field.name);
  }

  if (resourceKey === "products") {
    return [
      "title",
      "categories_list",
      "brand_id",
      "sku",
      "warranty_months",
      "image_url",
      "is_active",
      "side_attributes",
      "technical_attributes",
      "gallery"
    ].includes(field.name);
  }

  if (resourceKey === "oksidProducts") {
    return [
      "urun_adi",
      "stok_kodu",
      "side_attributes",
      "technical_attributes",
      "is_active",
    ].includes(field.name);
  }

  // Blog: title, excerpt, content, cover image, status
  if (resourceKey === "blog") {
    return ["title", "excerpt", "content", "cover_image_url", "status"].includes(field.name);
  }

  // Services: title, hero_title, hero_description, image, is_active
  if (resourceKey === "services") {
    return ["title", "hero_title", "hero_description", "image_url", "is_active"].includes(field.name);
  }

  // FAQs: question, answer, is_active
  if (resourceKey === "faqs") {
    return ["question", "answer", "is_active"].includes(field.name);
  }

  // Testimonials: company_name, person_name, quote, is_active
  if (resourceKey === "testimonials") {
    return ["company_name", "person_name", "quote", "is_active"].includes(field.name);
  }

  // Pages: title, h1, excerpt, content, image_url, status
  if (resourceKey === "pages") {
    return ["title", "h1", "excerpt", "content", "image_url", "status"].includes(field.name);
  }

  // Projects: title, summary, content, image_url, location, status
  if (resourceKey === "projects") {
    return ["title", "summary", "content", "image_url", "location", "status"].includes(field.name);
  }

  // Menu items: label, url, menu_key, is_active
  if (resourceKey === "menuItems") {
    return ["label", "url", "menu_key", "is_active"].includes(field.name);
  }

  // Site content: title, subtitle, body, image_url, status
  if (resourceKey === "siteContent") {
    return ["title", "subtitle", "body", "image_url", "status"].includes(field.name);
  }

  // Brands: name, logo_url, is_active
  if (resourceKey === "brands") {
    return ["name", "logo_url", "is_active"].includes(field.name);
  }

  // Categories: name, type, is_active
  if (resourceKey === "categories") {
    return ["name", "type", "is_active"].includes(field.name);
  }

  // Default: show content fields that are text/textarea + publish booleans
  if (field.group === "content" && (field.type === "text" || field.type === "textarea" || !field.type)) return true;
  if (field.group === "publish" && field.type === "boolean") return true;
  if (field.group === "publish" && field.type === "select") return true;

  return false;
}

function getValue(row: Record<string, unknown> | null, field: AdminField) {
  const value = row?.[field.name];
  if (value === null || value === undefined) {
    if (!row && field.defaultValue !== undefined) return String(field.defaultValue);
    if (field.type === "json") return field.name === "json_ld" || field.name === "value" || field.name === "metadata" ? "{}" : "[]";
    return "";
  }
  if (field.type === "json") {
    if (field.name === "value" && typeof value === "object" && value && "value" in value) {
      return String((value as { value?: unknown }).value ?? "");
    }
    if (Array.isArray(value)) {
      if (field.name === "faqs") {
        return value
          .map((item) => {
            if (typeof item === "object" && item) {
              const faq = item as { question?: unknown; answer?: unknown };
              return `${String(faq.question ?? "")} | ${String(faq.answer ?? "")}`.trim();
            }
            return String(item);
          })
          .join("\n");
      }
      return value
        .map((item) => {
          if (typeof item === "object" && item && "url" in item) return String((item as { url?: unknown }).url ?? "");
          return typeof item === "string" ? item : JSON.stringify(item);
        })
        .join("\n");
    }
    if (typeof value === "object" && value && "text" in value) return String((value as { text?: unknown }).text ?? "");
    return "";
  }
  if (field.type === "custom_list") {
    if (Array.isArray(value)) {
      return value.join("\n");
    }
    return String(value);
  }
  if (field.type === "features_list") {
    if (Array.isArray(value)) {
      return JSON.stringify(value);
    }
    return "[]";
  }
  if (field.type === "array") return Array.isArray(value) ? value.join(", ") : String(value);
  if (field.type === "datetime" && typeof value === "string") return value.slice(0, 16);
  return String(value);
}

type ProductCategoryOption = {
  id?: string;
  label: string;
  value: string;
  description?: string;
};

function ProductBrandField({
  field,
  row,
}: {
  field: AdminField;
  row: Record<string, unknown> | null;
}) {
  const [options, setOptions] = useState(field.options ?? []);
  const [selectedValue, setSelectedValue] = useState(row?.[field.name] ? String(row[field.name]) : "");
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const createBrand = () => {
    setError("");
    startTransition(async () => {
      const result = await createQuickProductBrand({ name });
      if (!result.success) {
        setError(result.error);
        return;
      }

      const option = { label: result.brand.name, value: result.brand.id };
      setOptions((current) => (
        [...current.filter((item) => item.value !== option.value), option]
          .sort((a, b) => a.label.localeCompare(b.label, "tr"))
      ));
      setSelectedValue(option.value);
      setName("");
      setIsOpen(false);
    });
  };

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor="product-brand" className="text-base font-black text-slate-700">
          {field.label}
        </label>
        <button
          type="button"
          onClick={() => {
            setName("");
            setError("");
            setIsOpen(true);
          }}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border-2 border-cyan-600 bg-cyan-50 px-4 text-sm font-black text-cyan-700 hover:bg-cyan-100"
        >
          <Plus className="h-4 w-4" /> Marka Ekle
        </button>
      </div>
      <select
        id="product-brand"
        name={field.name}
        value={selectedValue}
        onChange={(event) => setSelectedValue(event.target.value)}
        required={field.required}
        className="mt-2 h-14 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-base outline-none transition-colors focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
      >
        <option value="">Seçiniz</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>

      {isOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="quick-brand-title" className="w-full max-w-md rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 id="quick-brand-title" className="text-xl font-black text-slate-900">Yeni Marka Ekle</h3>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Marka penceresini kapat" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5">
              <label htmlFor="quick-brand-name" className="text-sm font-black text-slate-700">Marka Adı *</label>
              <input
                id="quick-brand-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    if (!isPending && name.trim().length >= 2) createBrand();
                  }
                }}
                className="mt-2 h-12 w-full rounded-xl border-2 border-slate-200 px-4 text-base outline-none focus:border-cyan-500"
              />
            </div>
            {error && <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setIsOpen(false)} className="h-11 rounded-xl bg-slate-100 px-5 text-sm font-black text-slate-700">Vazgeç</button>
              <button
                type="button"
                onClick={createBrand}
                disabled={isPending || name.trim().length < 2}
                className="h-11 rounded-xl bg-cyan-600 px-5 text-sm font-black text-white disabled:opacity-50"
              >
                {isPending ? "Ekleniyor..." : "Ekle ve Seç"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function ProductCategoriesField({
  field,
  row,
}: {
  field: AdminField;
  row: Record<string, unknown> | null;
}) {
  const initialSelected = (() => {
    const values = new Set<string>();
    const rawValue = row?.[field.name];

    if (Array.isArray(rawValue)) {
      rawValue.forEach((value) => {
        if (typeof value === "string") values.add(value);
      });
    } else if (typeof rawValue === "string") {
      values.add(rawValue);
    }

    if (Array.isArray(row?.tags)) {
      row.tags.forEach((tag) => {
        if (typeof tag === "string" && field.options?.some((option) => option.value === tag)) {
          values.add(tag);
        }
      });
    }

    return Array.from(values);
  })();

  const [options, setOptions] = useState<ProductCategoryOption[]>(field.options ?? []);
  const [selectedValues, setSelectedValues] = useState(initialSelected);
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "delete">("create");
  const [activeCategory, setActiveCategory] = useState<ProductCategoryOption | null>(null);
  const [tagReplacements, setTagReplacements] = useState<Record<string, string | null>>({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      if (modalMode === "delete") {
        dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
      } else {
        nameInputRef.current?.focus();
      }
    }, 0);
    const handleDialogKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) {
        setIsOpen(false);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };
    window.addEventListener("keydown", handleDialogKeys);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleDialogKeys);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, isPending, modalMode]);

  const closeModal = () => {
    if (isPending) return;
    setIsOpen(false);
    setError("");
  };

  const openCreateModal = () => {
    setModalMode("create");
    setActiveCategory(null);
    setName("");
    setDescription("");
    setError("");
    setIsOpen(true);
  };

  const openEditModal = (category: ProductCategoryOption) => {
    if (!category.id) return;
    setModalMode("edit");
    setActiveCategory(category);
    setName(category.label);
    setDescription(category.description ?? "");
    setError("");
    setIsOpen(true);
  };

  const openDeleteModal = (category: ProductCategoryOption) => {
    if (!category.id) return;
    setModalMode("delete");
    setActiveCategory(category);
    setName(category.label);
    setDescription(category.description ?? "");
    setError("");
    setIsOpen(true);
  };

  const saveCategory = () => {
    const normalizedName = name.trim().replace(/\s+/g, " ");
    if (normalizedName.length < 2) {
      setError("Kategori adı en az 2 karakter olmalıdır.");
      nameInputRef.current?.focus();
      return;
    }

    setError("");
    startTransition(async () => {
      try {
        const result = modalMode === "edit" && activeCategory?.id
          ? await updateQuickProductCategory({
              id: activeCategory.id,
              name: normalizedName,
              description,
            })
          : await createQuickProductCategory({ name: normalizedName, description });

        if (!result.success) {
          setError(result.error);
          return;
        }

        if (modalMode === "edit" && activeCategory && result.category) {
          const updatedOption: ProductCategoryOption = {
            id: result.category.id,
            label: result.category.name,
            value: result.category.name,
            description: "description" in result.category ? result.category.description : description.trim(),
          };
          setOptions((currentOptions) =>
            currentOptions.map((option) => option.id === activeCategory.id ? updatedOption : option)
          );
          setSelectedValues((currentValues) =>
            Array.from(new Set(
              currentValues.map((value) => value === activeCategory.value ? updatedOption.value : value)
            ))
          );
          if (activeCategory.value !== updatedOption.value) {
            setTagReplacements((currentReplacements) => ({
              ...currentReplacements,
              [activeCategory.value]: updatedOption.value,
            }));
          }
          setIsOpen(false);
          return;
        }

        if (!result.category) {
          setError("Kategori bilgisi alınamadı. Lütfen tekrar deneyin.");
          return;
        }

        const newOption = {
          id: result.category.id,
          label: result.category.name,
          value: result.category.name,
          description: result.category.description,
        };
        setOptions((currentOptions) => {
          if (currentOptions.some((option) => option.value === newOption.value)) return currentOptions;
          return [...currentOptions, newOption];
        });
        setSelectedValues((currentValues) =>
          currentValues.includes(newOption.value)
            ? currentValues
            : [...currentValues, newOption.value]
        );
        setName("");
        setDescription("");
        setIsOpen(false);
      } catch {
        setError("Kategori kaydedilirken bağlantı hatası oluştu. Lütfen tekrar deneyin.");
      }
    });
  };

  const deleteCategory = () => {
    if (!activeCategory?.id) return;
    setError("");
    startTransition(async () => {
      try {
        const result = await deleteQuickProductCategory({ id: activeCategory.id! });
        if (!result.success) {
          setError(result.error);
          return;
        }

        setOptions((currentOptions) =>
          currentOptions.filter((option) => option.id !== activeCategory.id)
        );
        setSelectedValues((currentValues) =>
          currentValues.filter((value) => value !== activeCategory.value)
        );
        setTagReplacements((currentReplacements) => ({
          ...currentReplacements,
          [activeCategory.value]: null,
        }));
        setIsOpen(false);
      } catch {
        setError("Kategori silinirken bağlantı hatası oluştu. Lütfen tekrar deneyin.");
      }
    });
  };

  const toggleCategory = (value: string, checked: boolean) => {
    setSelectedValues((currentValues) =>
      checked
        ? currentValues.includes(value) ? currentValues : [...currentValues, value]
        : currentValues.filter((currentValue) => currentValue !== value)
    );
  };

  return (
    <div className="block">
      <input
        type="hidden"
        name="__category_tag_replacements"
        value={JSON.stringify(tagReplacements)}
      />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-base font-black text-slate-700">{field.label}</span>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border-2 border-cyan-600 bg-cyan-50 px-4 text-sm font-black text-cyan-700 transition-colors hover:bg-cyan-100 sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Kategori Ekle
        </button>
      </div>

      {options.length > 0 ? (
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const isChecked = selectedValues.includes(option.value);
            return (
              <div
                key={option.value}
                className={`flex items-center gap-2 rounded-xl border-2 bg-white p-2 text-sm font-bold transition-colors ${
                  isChecked
                    ? "border-cyan-500 bg-cyan-50/50 text-cyan-950"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 p-1">
                  <input
                    type="checkbox"
                    name={field.name}
                    value={option.value}
                    checked={isChecked}
                    onChange={(event) => toggleCategory(option.value, event.target.checked)}
                    className="h-5 w-5 shrink-0 accent-cyan-600"
                  />
                  <span className="min-w-0 break-words">{option.label}</span>
                </label>
                <div className="flex shrink-0 items-center gap-1 border-l border-slate-200 pl-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(option)}
                    disabled={!option.id}
                    aria-label={`${option.label} kategorisini düzenle`}
                    title="Düzenle"
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-cyan-100 hover:text-cyan-700 disabled:hidden"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openDeleteModal(option)}
                    disabled={!option.id}
                    aria-label={`${option.label} kategorisini sil`}
                    title="Sil"
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-100 hover:text-red-600 disabled:hidden"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 text-center text-sm text-slate-500">
          Henüz ürün kategorisi yok. İlk kategoriyi hemen oluşturabilirsiniz.
        </div>
      )}
      {field.helpText ? <p className="mt-2 text-sm text-slate-400">{field.helpText}</p> : null}

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-category-title"
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <h2 id="quick-category-title" className="text-xl font-black text-slate-900">
                  {modalMode === "create"
                    ? "Yeni Ürün Kategorisi"
                    : modalMode === "edit"
                      ? "Ürün Kategorisini Düzenle"
                      : "Ürün Kategorisini Sil"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {modalMode === "create"
                    ? "Kategori kaydedilince ürüne otomatik olarak seçilir."
                    : modalMode === "edit"
                      ? "Değişiklikler bu kategoriyi kullanan ürünlere de uygulanır."
                      : "Bu işlem geri alınamaz."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={isPending}
                aria-label="Pencereyi kapat"
                className="ml-4 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              className="space-y-4 px-5 py-5 sm:px-6"
              onKeyDown={(event) => {
                if (
                  modalMode !== "delete" &&
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  event.target instanceof HTMLInputElement
                ) {
                  event.preventDefault();
                  if (!isPending) saveCategory();
                }
              }}
            >
              {modalMode === "delete" ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="font-black text-red-900">“{activeCategory?.label}” kategorisi silinecek.</p>
                  <p className="mt-2 text-sm leading-6 text-red-700">
                    Kategori bağlı ürünlerin kategori seçimlerinden ve etiketlerinden kaldırılır.
                    Ürün kayıtları silinmez.
                  </p>
                </div>
              ) : (
                <>
                  <label className="block">
                    <span className="text-sm font-black text-slate-700">
                      Kategori Adı <span className="text-red-500">*</span>
                    </span>
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                        if (error) setError("");
                      }}
                      maxLength={120}
                      disabled={isPending}
                      placeholder="Örn: Kamera Sistemleri"
                      className="mt-2 h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-base outline-none transition-colors focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-50"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-black text-slate-700">Açıklama (İsteğe Bağlı)</span>
                    <textarea
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      maxLength={1000}
                      disabled={isPending}
                      rows={3}
                      placeholder="Kategori hakkında kısa bir açıklama"
                      className="mt-2 w-full resize-none rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base outline-none transition-colors focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-50"
                    />
                  </label>
                </>
              )}

              {error ? (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                  {error}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={closeModal}
                disabled={isPending}
                className="inline-flex h-11 items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={modalMode === "delete" ? deleteCategory : saveCategory}
                disabled={isPending || (modalMode !== "delete" && name.trim().length < 2)}
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border-2 px-5 text-sm font-black text-white transition-colors disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300 ${
                  modalMode === "delete"
                    ? "border-red-700 bg-red-600 hover:bg-red-700"
                    : "border-cyan-700 bg-cyan-600 hover:bg-cyan-700"
                }`}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : modalMode === "delete" ? (
                  <Trash2 className="h-4 w-4" />
                ) : modalMode === "edit" ? (
                  <Pencil className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {isPending
                  ? modalMode === "delete" ? "Siliniyor..." : "Kaydediliyor..."
                  : modalMode === "delete" ? "Kategoriyi Sil"
                    : modalMode === "edit" ? "Değişiklikleri Kaydet"
                      : "Kategoriyi Ekle"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({ field, row }: { field: AdminField; row: Record<string, unknown> | null }) {
  const baseInputClass = "mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-base outline-none focus:border-cyan-500 transition-colors focus:ring-2 focus:ring-cyan-100";
  const requiredMark = field.required ? <span className="text-red-500 font-bold"> *</span> : null;
  const defaultChecked = row
    ? Boolean(row[field.name])
    : field.name === "is_active" || field.name === "sitemap_include" || field.name === "lazy_load";

  if (field.name === "categories_list" && field.type === "checkboxes") {
    return <ProductCategoriesField field={field} row={row} />;
  }

  if (field.name === "brand_id" && field.optionSource === "brands") {
    return <ProductBrandField field={field} row={row} />;
  }

  if (field.type === "custom_list") {
    return (
      <CustomListBuilder
        defaultValue={getValue(row, field)}
        name={field.name}
        label={field.label}
        max={4}
      />
    );
  }

  if (field.type === "features_list") {
    const isSpecs = ["installation_steps", "custom_attributes", "side_attributes", "technical_attributes"].includes(field.name);
    const listLabel = field.name === "side_attributes"
      ? "Ürün Yanındaki Label'lar"
      : field.name === "technical_attributes"
        ? "Alt Teknik Özellik Label'ları"
        : "Ürüne Özel Teknik Özellikler";
    return (
      <FeaturesBuilder 
        defaultValue={getValue(row, field)} 
        name={field.name} 
        label={isSpecs ? listLabel : "Neden Bu Ürün? — Avantaj Kartları (En fazla 4 adet)"}
        titlePlaceholder={isSpecs ? "Özellik Adı (Örn: Lens Tipi)" : "Avantaj Başlığı"}
        descPlaceholder={isSpecs ? "Özellik Değeri (Örn: Sabit Lens)" : "Açıklama (Boş bırakırsanız varsayılan metin kullanılır)"}
      />
    );
  }

  if (field.name === "faqs" && (field.type === "json" || !field.type)) {
    return <FaqBuilder defaultValue={getValue(row, field)} name={field.name} />;
  }

  if (field.name === "gallery" && (field.type === "json" || !field.type)) {
    return <GalleryBuilder defaultValue={getValue(row, field)} name={field.name} />;
  }

  if (field.type === "checkboxes") {
    const selectedValues: string[] = row
      ? Array.isArray(row[field.name])
        ? (row[field.name] as string[])
        : typeof row[field.name] === "string"
        ? [row[field.name] as string]
        : []
      : [];

    if (field.name === "categories_list" && row && Array.isArray(row.tags)) {
      row.tags.forEach((t) => {
        if (typeof t === "string" && field.options?.some((o) => o.value === t) && !selectedValues.includes(t)) {
          selectedValues.push(t);
        }
      });
    }

    return (
      <div className="block">
        <span className="text-base font-black text-slate-700">{field.label}{requiredMark}</span>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {field.options?.map((opt) => {
            const isChecked = selectedValues.includes(opt.value);
            return (
              <label key={opt.value} className="flex items-center gap-3 rounded-xl border-2 border-slate-200 bg-white p-3 text-sm font-bold cursor-pointer hover:bg-slate-50 transition-colors">
                <input type="checkbox" name={field.name} value={opt.value} defaultChecked={isChecked} className="h-5 w-5 accent-cyan-600" />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
        {field.helpText ? <p className="mt-2 text-sm text-slate-400">{field.helpText}</p> : null}
      </div>
    );
  }

  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-3 rounded-xl border-2 border-slate-200 bg-white p-4 text-base font-bold cursor-pointer hover:bg-slate-50 transition-colors">
        <input type="checkbox" name={field.name} defaultChecked={defaultChecked} className="h-5 w-5 accent-cyan-600" />
        <span>{field.label}</span>
      </label>
    );
  }

  if (field.type === "select") {
    const defaultValue = !row && field.name === "status"
      ? "published"
      : getValue(row, field);

    return (
      <label className="block">
        <span className="text-base font-black text-slate-700">{field.label}{requiredMark}</span>
        <select name={field.name} defaultValue={defaultValue} required={field.required} className={`${baseInputClass} h-14`}>
          <option value="">-- Seçin --</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "textarea" || field.type === "json") {
    return (
      <label className="block">
        <span className="text-base font-black text-slate-700">{field.label}{requiredMark}</span>
        <textarea
          name={field.name}
          defaultValue={getValue(row, field)}
          required={field.required}
          rows={4}
          placeholder={field.placeholder}
          className={`${baseInputClass} py-3`}
        />
        {field.helpText ? <p className="mt-1 text-sm text-slate-400">{field.helpText}</p> : null}
      </label>
    );
  }

  return (
    <label className="block">
      <span className="text-base font-black text-slate-700">{field.label}{requiredMark}</span>
      <input
        type={field.type === "number" ? "number" : field.type === "datetime" ? "datetime-local" : "text"}
        name={field.name}
        defaultValue={getValue(row, field)}
        required={field.required}
        placeholder={field.placeholder}
        className={`${baseInputClass} h-14`}
      />
      {field.helpText ? <p className="mt-1 text-sm text-slate-400">{field.helpText}</p> : null}
    </label>
  );
}

export function ResourceFormClient({
  resource,
  row,
  menuParentOptions,
  brandOptions = [],
  productCategoryOptions = [],
}: {
  resource: AdminResource;
  row: Record<string, unknown> | null;
  menuParentOptions: { label: string; value: string }[];
  brandOptions?: { label: string; value: string }[];
  productCategoryOptions?: ProductCategoryOption[];
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const isProduct = resource.key === "products";
  const productDetailFields = [
    "long_description",
    "features",
    "show_features",
    "specs_title",
    "specs_description",
    "installation_steps",
    "show_specs",
    "benefits_title",
    "benefits_description",
    "show_benefits",
    "faqs"
  ];

  const hasDetailValues = row
    ? Boolean(
        row.long_description ||
        (Array.isArray(row.features) && row.features.length > 0) ||
        (Array.isArray(row.installation_steps) && row.installation_steps.length > 0) ||
        (Array.isArray(row.faqs) && row.faqs.length > 0)
      )
    : false;

  const [showDetailFields, setShowDetailFields] = useState(hasDetailValues);

  const allFields = resource.fields.map((field) => {
    if (field.optionSource === "menuParents") {
      return { ...field, options: menuParentOptions };
    }
    if (field.optionSource === "brands") {
      return { ...field, options: brandOptions };
    }
    if (field.optionSource === "productCategories") {
      return { ...field, options: productCategoryOptions };
    }
    return field;
  });

  const simpleFields = allFields.filter((f) => {
    if (isProduct && productDetailFields.includes(f.name)) {
      return false;
    }
    return isSimpleField(f, resource.key);
  });
  
  const advancedFields = allFields.filter((f) => !isSimpleField(f, resource.key));

  const slug = row?.slug ? String(row.slug) : null;
  const previewHref = slug
    ? resource.key === "blog" ? `/blog/${slug}`
    : resource.key === "products" ? `/urunler/${slug}`
    : `/${slug}`
    : null;

  return (
    <form action={saveResource.bind(null, resource.key, row?.id ? String(row.id) : null)} className="space-y-5">

      {/* Hidden inputs for all advanced fields so they preserve their values */}
      {advancedFields.map((field) => {
        if (showAdvanced) return null; // will be rendered as visible inputs instead
        const defaultChecked = row
          ? Boolean(row[field.name])
          : field.name === "is_active" || field.name === "sitemap_include" || field.name === "lazy_load";
        if (field.type === "boolean") {
          return defaultChecked ? <input key={field.name} type="hidden" name={field.name} value="on" /> : null;
        }
        return <input key={field.name} type="hidden" name={field.name} value={getValue(row, field)} />;
      })}

      {/* Simple fields */}
      <section className="rounded-xl border-2 border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          {simpleFields.map((field) => (
            <div key={field.name} className={field.type === "textarea" || field.type === "json" || field.type === "features_list" ? "md:col-span-2" : ""}>
              <Field field={field} row={row} />
            </div>
          ))}
        </div>
      </section>

      {/* Product Detail Fields Checkbox & Section */}
      {isProduct && allFields.some((field) => productDetailFields.includes(field.name)) && (
        <div className="rounded-xl border-2 border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showDetailFields}
              onChange={(e) => setShowDetailFields(e.target.checked)}
              className="h-6 w-6 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 accent-cyan-600"
            />
            <span className="text-base font-black text-slate-800">
              Ürün iç detay sayfasına bilgi eklemek istiyor musunuz?
            </span>
          </label>
          {showDetailFields && (
            <div className="pt-4 border-t border-slate-100 space-y-6">
              {/* Bölüm 1: Genel Detaylar */}
              {allFields.some((f) => f.name === "long_description") && (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Genel Detaylar</div>
                  <div className="grid gap-5 md:grid-cols-2">
                    {allFields.filter((f) => f.name === "long_description").map((field) => (
                      <div key={field.name} className="md:col-span-2">
                        <Field field={field} row={row} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bölüm 2: Neden Bu Ürün? */}
              {allFields.some((f) => f.name === "features" || f.name === "show_features") && (
                <div className="p-4 rounded-xl border-2 border-dashed border-cyan-200 bg-cyan-50/10 space-y-4">
                  <div className="text-sm font-bold text-cyan-600 uppercase tracking-wider">1. Bölüm: Neden Bu Ürün? (Avantaj Kartları)</div>
                  <div className="grid gap-5 md:grid-cols-2">
                    {allFields.filter((f) => f.name === "features" || f.name === "show_features").map((field) => (
                      <div key={field.name} className={field.name === "features" ? "md:col-span-2" : ""}>
                        <Field field={field} row={row} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bölüm 3: Teknik Özellikler */}
              {allFields.some((f) => f.name === "specs_title" || f.name === "specs_description" || f.name === "installation_steps" || f.name === "show_specs") && (
                <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/30 space-y-4">
                  <div className="text-sm font-bold text-slate-600 uppercase tracking-wider">2. Bölüm: Teknik Özellikler</div>
                  <div className="grid gap-5 md:grid-cols-2">
                    {allFields.filter((f) => ["specs_title", "specs_description", "installation_steps", "show_specs"].includes(f.name)).map((field) => (
                      <div key={field.name} className={field.name === "specs_description" || field.name === "installation_steps" ? "md:col-span-2" : ""}>
                        <Field field={field} row={row} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bölüm 4: Akıllı Entegrasyon */}
              {allFields.some((f) => f.name === "benefits_title" || f.name === "benefits_description" || f.name === "show_benefits") && (
                <div className="p-4 rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/10 space-y-4">
                  <div className="text-sm font-bold text-emerald-600 uppercase tracking-wider">3. Bölüm: Akıllı Entegrasyon (Kusursuz Uyum)</div>
                  <div className="grid gap-5 md:grid-cols-2">
                    {allFields.filter((f) => ["benefits_title", "benefits_description", "show_benefits"].includes(f.name)).map((field) => (
                      <div key={field.name} className={field.name === "benefits_description" ? "md:col-span-2" : ""}>
                        <Field field={field} row={row} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bölüm 5: Sıkça Sorulan Sorular (SSS) */}
              {allFields.some((f) => f.name === "faqs") && (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">4. Bölüm: Sıkça Sorulan Sorular</div>
                  <div className="grid gap-5 md:grid-cols-2">
                    {allFields.filter((f) => f.name === "faqs").map((field) => (
                      <div key={field.name} className="md:col-span-2">
                        <Field field={field} row={row} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Advanced toggle */}
      {advancedFields.length > 0 && (
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
        >
          {showAdvanced ? "▲ Gelişmiş alanları gizle" : `▼ Gelişmiş alanları göster (${advancedFields.length} alan)`}
        </button>
      )}

      {/* Advanced fields */}
      {showAdvanced && advancedFields.length > 0 && (
        <section className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-5">
          <p className="text-xs font-bold text-slate-400 uppercase mb-4">Teknik / Gelişmiş Alanlar</p>
          <div className="grid gap-5 md:grid-cols-2">
            {advancedFields.map((field) => (
              <div key={field.name} className={field.type === "textarea" || field.type === "json" ? "md:col-span-2" : ""}>
                <Field field={field} row={row} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Save bar */}
      <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-xl border-2 border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-end">
        {previewHref && resource.key !== "brands" && (
          <Link href={previewHref} target="_blank" className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-slate-200 px-5 text-sm font-bold text-slate-600 hover:bg-slate-50 w-full sm:w-auto">
            <Eye className="mr-2 h-4 w-4" /> Önizle
          </Link>
        )}
        <button type="submit" className="inline-flex h-12 items-center justify-center rounded-xl bg-cyan-600 border-2 border-cyan-700 px-8 text-sm font-black text-white hover:bg-cyan-700 transition-all w-full sm:w-auto">
          💾 Kaydet
        </button>
      </div>
    </form>
  );
}
