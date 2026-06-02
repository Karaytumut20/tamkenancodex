"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { brands, productCategories, products } from "@/data/products";

const ALL = "Tümü";

export function ProductGrid() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [brand, setBrand] = useState(ALL);
  const [usage, setUsage] = useState(ALL);
  const [tag, setTag] = useState(ALL);

  const allBrands = useMemo(() => Array.from(new Set([...brands, ...products.map((product) => product.brand)])).sort((a, b) => a.localeCompare(b, "tr")), []);
  const usageOptions = useMemo(() => Array.from(new Set(products.flatMap((product) => product.usage))).sort((a, b) => a.localeCompare(b, "tr")), []);
  const tagOptions = useMemo(() => Array.from(new Set(products.flatMap((product) => product.tags))).sort((a, b) => a.localeCompare(b, "tr")), []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const searchable = [
        product.name,
        product.code,
        product.brand,
        product.category,
        product.description,
        product.usage.join(" "),
        product.tags.join(" "),
        product.features.join(" "),
      ].join(" ").toLowerCase();

      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
      const matchesCategory = category === ALL || product.category === category;
      const matchesBrand = brand === ALL || product.brand === brand;
      const matchesUsage = usage === ALL || product.usage.includes(usage);
      const matchesTag = tag === ALL || product.tags.includes(tag);

      return matchesQuery && matchesCategory && matchesBrand && matchesUsage && matchesTag;
    });
  }, [query, category, brand, usage, tag]);

  const hasFilter = query || category !== ALL || brand !== ALL || usage !== ALL || tag !== ALL;

  function clearFilters() {
    setQuery("");
    setCategory(ALL);
    setBrand(ALL);
    setUsage(ALL);
    setTag(ALL);
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
      <aside className="h-fit rounded-2xl border border-border bg-white p-5 xl:sticky xl:top-28">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-ink">
            <SlidersHorizontal className="h-5 w-5 text-primary-600" /> Ürün Filtreleri
          </h2>
          {hasFilter ? (
            <button onClick={clearFilters} className="inline-flex items-center gap-1 rounded-lg bg-surface px-2.5 py-1.5 text-xs font-extrabold text-ink-muted  hover:bg-white hover:text-cyan-500">
              <X className="h-3.5 w-3.5" /> Temizle
            </button>
          ) : null}
        </div>

        <label className="mt-5 block text-sm font-extrabold text-ink" htmlFor="product-search">Arama</label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            id="product-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ürün, marka, kod veya çözüm ara..."
            className="h-12 w-full rounded-xl border border-border bg-white pl-10 pr-3 text-sm outline-none focus:border-primary-500"
          />
        </div>

        <Filter label="Kategori" value={category} values={[ALL, ...productCategories]} onChange={setCategory} />
        <Filter label="Marka" value={brand} values={[ALL, ...allBrands]} onChange={setBrand} />
        <Filter label="Kullanım Alanı" value={usage} values={[ALL, ...usageOptions]} onChange={setUsage} />
        <Filter label="Özellik / Etiket" value={tag} values={[ALL, ...tagOptions]} onChange={setTag} />

        <div className="mt-5 rounded-xl bg-surface p-4 text-sm leading-6 text-ink-muted">
          Tüm ürünler marka, kategori, kullanım alanı ve öne çıkan özelliklere göre filtrelenebilir. Ürün detayında WhatsApp teklif mesajı otomatik hazırlanır.
        </div>
      </aside>

      <div>
        <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-border bg-white p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold text-ink-muted">Katalog sonucu</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.03em] text-ink">{filtered.length} ürün listeleniyor</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {[category, brand, usage, tag].filter((item) => item !== ALL).map((item) => (
              <span key={item} className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-extrabold text-primary-600">{item}</span>
            ))}
          </div>
        </div>

        {filtered.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => <ProductCard key={product.slug} product={product} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-white p-8 text-center">
            <h3 className="text-2xl font-extrabold text-ink">Bu filtrelerle ürün bulunamadı</h3>
            <p className="mt-3 text-ink-muted">Arama kelimesini sadeleştirin veya filtreleri temizleyerek tüm ürünleri tekrar görüntüleyin.</p>
            <button onClick={clearFilters} className="mt-5 h-11 rounded-xl primesec-navy-action px-5 text-sm font-extrabold text-white">Filtreleri Temizle</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Filter({ label, value, values, onChange }: { label: string; value: string; values: string[]; onChange: (value: string) => void }) {
  return (
    <div className="mt-5">
      <label className="text-sm font-extrabold text-ink">{label}</label>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-primary-500">
        {values.map((item) => <option key={item}>{item}</option>)}
      </select>
    </div>
  );
}
