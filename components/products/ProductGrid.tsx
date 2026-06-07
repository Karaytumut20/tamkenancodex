"use client";

import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { brands as staticBrands, productCategories as staticCategories, products as staticProducts, type Product } from "@/data/products";

const ALL = "Tümü";

interface ProductGridProps {
  initialProducts?: Product[];
  initialBrands?: string[];
  initialCategories?: string[];
}

export function ProductGrid({
  initialProducts,
  initialBrands,
  initialCategories
}: ProductGridProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [brand, setBrand] = useState(ALL);
  const [usage, setUsage] = useState(ALL);
  const [tag, setTag] = useState(ALL);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const productsList = initialProducts || staticProducts;
  const categoriesList = initialCategories || staticCategories;
  const brandsList = initialBrands || staticBrands;

  const allBrands = useMemo(() => Array.from(new Set([...brandsList, ...productsList.map((product) => product.brand)])).sort((a, b) => a.localeCompare(b, "tr")), [brandsList, productsList]);
  const usageOptions = useMemo(() => Array.from(new Set(productsList.flatMap((product) => product.usage))).sort((a, b) => a.localeCompare(b, "tr")), [productsList]);
  
  const tagOptions = useMemo(() => {
    const productCategories = ["Alarm Sistemleri", "Akıllı Ev Sistemleri", "Kamera Sistemleri", "Yangın İhbar Sistemleri", "Personel Takip PDKS", "Network Çözümleri"];
    return Array.from(new Set(productsList.flatMap((product) => product.tags)))
      .filter((t) => !productCategories.includes(t))
      .sort((a, b) => a.localeCompare(b, "tr"));
  }, [productsList]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return productsList.filter((product) => {
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
      const matchesCategory = category === ALL || product.category === category || product.tags.includes(category);
      const matchesBrand = brand === ALL || product.brand === brand;
      const matchesUsage = usage === ALL || product.usage.includes(usage);
      const matchesTag = tag === ALL || product.tags.includes(tag);

      return matchesQuery && matchesCategory && matchesBrand && matchesUsage && matchesTag;
    });
  }, [query, category, brand, usage, tag, productsList]);

  const hasFilter = query || category !== ALL || brand !== ALL || usage !== ALL || tag !== ALL;
  const activeFilters = [
    { key: "category", label: category, clear: () => setCategory(ALL) },
    { key: "brand", label: brand, clear: () => setBrand(ALL) },
    { key: "usage", label: usage, clear: () => setUsage(ALL) },
    { key: "tag", label: tag, clear: () => setTag(ALL) },
  ].filter((item) => item.label !== ALL);

  function clearFilters() {
    setQuery("");
    setCategory(ALL);
    setBrand(ALL);
    setUsage(ALL);
    setTag(ALL);
  }

  const filterPanelProps = {
    query,
    setQuery,
    category,
    setCategory,
    brand,
    setBrand,
    usage,
    setUsage,
    tag,
    setTag,
    allBrands,
    usageOptions,
    tagOptions,
    hasFilter,
    clearFilters,
  };

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[320px_1fr]">
      <aside className="hidden h-fit rounded-2xl border border-border bg-white p-5 xl:sticky xl:top-28 xl:block w-full min-w-0">
        <FilterPanel {...filterPanelProps} searchId="product-search-desktop" categoriesList={categoriesList} />
      </aside>

      <div className="w-full min-w-0">
        <div className="mb-5 rounded-2xl border border-border bg-white p-4 sm:p-5 xl:hidden w-full min-w-0">
          <button
            type="button"
            onClick={() => setFiltersOpen((value) => !value)}
            className="flex w-full items-center justify-between gap-3 text-left"
            aria-expanded={filtersOpen}
            aria-controls="mobile-product-filters"
          >
            <span>
              <span className="flex items-center gap-2 text-base sm:text-lg font-extrabold text-ink">
                <SlidersHorizontal className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" /> Filtrele
              </span>
              <span className="mt-1 block text-xs sm:text-sm font-bold text-ink-muted">
                {hasFilter ? "Seçili filtreleri düzenleyin" : "Kategori, marka ve özellik seçin"}
              </span>
            </span>
            <ChevronDown className={`h-5 w-5 shrink-0 text-ink-muted transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
          </button>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[ALL, ...categoriesList].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full border px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-extrabold transition-colors ${
                  category === item ? "border-primary-600 bg-primary-600 text-white" : "border-border bg-surface text-ink"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {filtersOpen ? (
            <div id="mobile-product-filters" className="mt-5 border-t border-border pt-5">
              <FilterPanel {...filterPanelProps} searchId="product-search-mobile" categoriesList={categoriesList} />
            </div>
          ) : null}
        </div>

        <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-border bg-white p-4 sm:p-5 md:flex-row md:items-center md:justify-between w-full min-w-0">
          <div>
            <p className="text-xs sm:text-sm font-bold text-ink-muted">Katalog sonucu</p>
            <h2 className="mt-1 text-xl sm:text-2xl font-extrabold tracking-[-0.03em] text-ink">{filtered.length} ürün listeleniyor</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={item.clear}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-extrabold text-primary-600 transition-colors hover:border-primary-500 shrink-0 md:shrink"
              >
                {item.label}
                <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>
            ))}
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-extrabold text-primary-600 transition-colors hover:border-primary-500 shrink-0 md:shrink"
              >
                Arama: {query}
                <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>
            ) : null}
          </div>
        </div>

        {filtered.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
            {filtered.map((product) => <ProductCard key={product.slug} product={product} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 text-center w-full min-w-0">
            <h3 className="text-xl sm:text-2xl font-extrabold text-ink break-words">Bu filtrelerle ürün bulunamadı</h3>
            <p className="mt-3 text-sm sm:text-base text-ink-muted">Arama kelimesini sadeleştirin veya filtreleri temizleyerek tüm ürünleri tekrar görüntüleyin.</p>
            <button onClick={clearFilters} className="mt-5 h-11 rounded-xl primesec-navy-action px-5 text-sm font-extrabold text-white w-full sm:w-auto">Filtreleri Temizle</button>
          </div>
        )}
      </div>
    </div>
  );
}

type FilterPanelProps = {
  query: string;
  setQuery: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  brand: string;
  setBrand: (value: string) => void;
  usage: string;
  setUsage: (value: string) => void;
  tag: string;
  setTag: (value: string) => void;
  allBrands: string[];
  usageOptions: string[];
  tagOptions: string[];
  hasFilter: string | boolean;
  clearFilters: () => void;
  searchId: string;
  categoriesList: string[];
};

function FilterPanel({ query, setQuery, category, setCategory, brand, setBrand, usage, setUsage, tag, setTag, allBrands, usageOptions, tagOptions, hasFilter, clearFilters, searchId, categoriesList }: FilterPanelProps) {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-ink">
          <SlidersHorizontal className="h-5 w-5 text-primary-600" /> Ürün Filtreleri
        </h2>
        {hasFilter ? (
          <button type="button" onClick={clearFilters} className="inline-flex items-center gap-1 rounded-lg bg-surface px-2.5 py-1.5 text-xs font-extrabold text-ink-muted hover:bg-white hover:text-cyan-500">
            <X className="h-3.5 w-3.5" /> Temizle
          </button>
        ) : null}
      </div>

      <label className="mt-5 block text-sm font-extrabold text-ink" htmlFor={searchId}>Arama</label>
      <div className="relative mt-2">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          id={searchId}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ürün, marka, kod veya çözüm ara..."
          className="h-12 w-full rounded-xl border border-border bg-white pl-10 pr-3 text-base md:text-sm outline-none focus:border-primary-500"
        />
      </div>

      <Filter label="Kategori" value={category} values={[ALL, ...categoriesList]} onChange={setCategory} />
      <Filter label="Marka" value={brand} values={[ALL, ...allBrands]} onChange={setBrand} />
      <Filter label="Kullanım Alanı" value={usage} values={[ALL, ...usageOptions]} onChange={setUsage} />
      <Filter label="Özellik / Etiket" value={tag} values={[ALL, ...tagOptions]} onChange={setTag} />

      <div className="mt-5 rounded-xl bg-surface p-4 text-sm leading-6 text-ink-muted">
        Tüm ürünler marka, kategori, kullanım alanı ve öne çıkan özelliklere göre filtrelenebilir.
      </div>
    </>
  );
}

function Filter({ label, value, values, onChange }: { label: string; value: string; values: string[]; onChange: (value: string) => void }) {
  return (
    <div className="mt-5">
      <label className="text-sm font-extrabold text-ink">{label}</label>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-border bg-white px-3 text-base md:text-sm outline-none focus:border-primary-500">
        {values.map((item) => <option key={item}>{item}</option>)}
      </select>
    </div>
  );
}
