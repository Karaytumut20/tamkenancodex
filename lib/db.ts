import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { requireSupabasePublicEnv } from "@/lib/supabase/env";
import { products as staticProducts, type Product } from "@/data/products";
import { services as staticServices, type ServicePage } from "@/data/services";
import { blogPosts as staticBlogPosts, type BlogPost } from "@/data/blog";
import { locations as staticLocations } from "@/data/locations";
import { corporatePages as staticCorporatePages, type CorporatePage } from "@/data/corporate";
import { mainNavigation as staticMainNavigation } from "@/data/navigation";
import { siteConfig } from "@/data/site";

export type SiteSettings = typeof siteConfig;
export type NavigationItem = {
  label: string;
  href: string;
  menuKey?: string;
};

// Singleton Supabase Client to reuse connection and reduce handshake latency
let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (supabaseInstance) return supabaseInstance;
  const env = requireSupabasePublicEnv();
  supabaseInstance = createClient(env.url, env.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
  return supabaseInstance;
}

function settingValue(value: unknown) {
  if (typeof value === "object" && value && "value" in value) {
    const nested = (value as { value?: unknown }).value;
    return typeof nested === "string" ? nested : undefined;
  }
  return typeof value === "string" ? value : undefined;
}

export const getSiteSettings = cache(async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("site_settings").select("key, value");
    if (error || !data) return siteConfig;

    const settings = new Map((data as any[]).map((row) => [String(row.key), row.value]));
    return {
      ...siteConfig,
      name: settingValue(settings.get("site.name")) ?? siteConfig.name,
      legalName: settingValue(settings.get("site.legalName")) ?? siteConfig.legalName,
      siteUrl: settingValue(settings.get("site.url")) ?? siteConfig.siteUrl,
      description: settingValue(settings.get("site.description")) ?? siteConfig.description,
      phone: settingValue(settings.get("contact.phone")) ?? siteConfig.phone,
      whatsapp: settingValue(settings.get("contact.whatsapp")) ?? siteConfig.whatsapp,
      email: settingValue(settings.get("contact.email")) ?? siteConfig.email,
      address: settingValue(settings.get("contact.address")) ?? siteConfig.address,
      city: settingValue(settings.get("contact.city")) ?? siteConfig.city,
    };
  } catch (err) {
    console.error("Error in getSiteSettings:", err);
    return siteConfig;
  }
});

export const getMenuItems = cache(async function getMenuItems(menuKey: string): Promise<NavigationItem[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("menu_items")
      .select("label, url, menu_key, mega_menu_key")
      .eq("menu_key", menuKey)
      .eq("is_active", true)
      .is("parent_id", null)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return menuKey === "header" ? staticMainNavigation : [];
    }

    return (data as any[]).map((item) => ({
      label: item.label,
      href: item.url,
      menuKey: item.mega_menu_key || undefined,
    }));
  } catch (err) {
    console.error("Error in getMenuItems:", err);
    return menuKey === "header" ? staticMainNavigation : [];
  }
});

export const getCorporatePages = cache(async function getCorporatePages(): Promise<CorporatePage[]> {
  try {
    const supabase = getSupabase();
    const { data: dbPages, error } = await supabase
      .from("pages")
      .select("*")
      .eq("status", "published")
      .order("updated_at", { ascending: false });

    if (error || !dbPages || dbPages.length === 0) {
      return staticCorporatePages;
    }

    return (dbPages as any[]).map((page) => {
      const body = page.content
        ? String(page.content)
            .split("\n\n")
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)
        : [];

      return {
        slug: page.slug,
        title: page.h1 || page.title,
        metaTitle: page.meta_title || `${page.title} | PrimeSec Teknoloji`,
        description: page.meta_description || page.excerpt || "",
        body: body.length > 0 ? body : [page.excerpt || ""].filter(Boolean),
        cta: page.cta_label || page.excerpt || "PrimeSec ekibiyle ihtiyacinizi netlestirelim.",
      };
    });
  } catch (err) {
    console.error("Error in getCorporatePages:", err);
    return staticCorporatePages;
  }
});

export type SiteContentBlock = {
  sectionKey: string;
  title?: string;
  subtitle?: string;
  body?: string;
  primaryButtonLabel?: string;
  primaryButtonUrl?: string;
  secondaryButtonLabel?: string;
  secondaryButtonUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  items?: unknown[];
};

export const getSiteContentBlock = cache(async function getSiteContentBlock(sectionKey: string): Promise<SiteContentBlock | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .eq("section_key", sectionKey)
      .eq("status", "active")
      .maybeSingle();

    if (error || !data) return null;

    const dataBlock = data as any;
    return {
      sectionKey: dataBlock.section_key,
      title: dataBlock.title ?? undefined,
      subtitle: dataBlock.subtitle ?? undefined,
      body: dataBlock.body ?? undefined,
      primaryButtonLabel: dataBlock.primary_button_label ?? undefined,
      primaryButtonUrl: dataBlock.primary_button_url ?? undefined,
      secondaryButtonLabel: dataBlock.secondary_button_label ?? undefined,
      secondaryButtonUrl: dataBlock.secondary_button_url ?? undefined,
      imageUrl: dataBlock.image_url ?? undefined,
      imageAlt: dataBlock.image_alt ?? undefined,
      items: Array.isArray(dataBlock.items) ? dataBlock.items : undefined,
    };
  } catch (err) {
    console.error("Error in getSiteContentBlock:", err);
    return null;
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────

export const getProducts = cache(async function getProducts(): Promise<Product[]> {
  try {
    const supabase = getSupabase();
    
    // Fetch products with categories and brands
    const { data: dbProducts, error } = await supabase
      .from("products")
      .select("*, categories(name), brands(name)")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !dbProducts || dbProducts.length === 0) {
      console.warn("Using fallback products due to DB error or empty table:", error);
      return staticProducts;
    }

    return (dbProducts as any[]).map((p) => {
      const categoryName = p.categories?.name || "Güvenlik Sistemleri";
      const brandName = p.brands?.name || "PrimeSec";
      
      return {
        slug: p.slug,
        name: p.title,
        code: p.sku || "",
        category: categoryName,
        brand: brandName,
        usage: Array.isArray(p.usage_areas) ? p.usage_areas : [],
        description: p.short_description || "",
        longDescription: p.long_description || "",
        image: p.image_url || "/images/alarm-sistemi.svg",
        tags: Array.isArray(p.tags) ? p.tags : [],
        features: Array.isArray(p.features)
          ? p.features.map((f: any) =>
              typeof f === "string"
                ? { title: f, description: "", active: true }
                : { title: String(f?.title ?? ""), description: String(f?.description ?? ""), active: f?.active !== false }
            )
          : [],
        showFeatures: p.show_features !== false,
        specs: Array.isArray(p.installation_steps)
          ? p.installation_steps.map((f: any) =>
              typeof f === "string"
                ? { title: f, description: "", active: true }
                : { title: String(f?.title ?? ""), description: String(f?.description ?? ""), active: f?.active !== false }
            )
          : [],
        specsTitle: p.specs_title || undefined,
        specsDescription: p.specs_description || undefined,
        showSpecs: p.show_specs !== false,
        benefits: Array.isArray(p.benefits)
          ? p.benefits.map((f: any) =>
              typeof f === "string"
                ? { title: f, description: "", active: true }
                : { title: String(f?.title ?? ""), description: String(f?.description ?? ""), active: f?.active !== false }
            )
          : [],
        benefitsTitle: p.benefits_title || undefined,
        benefitsDescription: p.benefits_description || undefined,
        showBenefits: p.show_benefits !== false,
        faqs: Array.isArray(p.faqs) ? p.faqs : [],
        gallery: Array.isArray(p.gallery)
          ? p.gallery.map((g: any) => (typeof g === "object" && g ? String(g.url ?? "") : String(g))).filter(Boolean)
          : [],
      };
    });
  } catch (err) {
    console.error("Error in getProducts:", err);
    return staticProducts;
  }
});

export const getProductBySlug = cache(async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = getSupabase();
    const { data: p, error } = await supabase
      .from("products")
      .select("*, categories(name), brands(name)")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !p) {
      // Fallback
      return staticProducts.find((item) => item.slug === slug) || null;
    }

    const pData = p as any;
    const categoryName = pData.categories?.name || "Güvenlik Sistemleri";
    const brandName = pData.brands?.name || "PrimeSec";

    return {
      slug: pData.slug,
      name: pData.title,
      code: pData.sku || "",
      category: categoryName,
      brand: brandName,
      usage: Array.isArray(pData.usage_areas) ? pData.usage_areas : [],
      description: pData.short_description || "",
      longDescription: pData.long_description || "",
      image: pData.image_url || "/images/alarm-sistemi.svg",
      tags: Array.isArray(pData.tags) ? pData.tags : [],
      features: Array.isArray(pData.features)
        ? pData.features.map((f: any) =>
            typeof f === "string"
              ? { title: f, description: "", active: true }
              : { title: String(f?.title ?? ""), description: String(f?.description ?? ""), active: f?.active !== false }
          )
        : [],
      showFeatures: pData.show_features !== false,
      specs: Array.isArray(pData.installation_steps)
        ? pData.installation_steps.map((f: any) =>
            typeof f === "string"
              ? { title: f, description: "", active: true }
              : { title: String(f?.title ?? ""), description: String(f?.description ?? ""), active: f?.active !== false }
          )
        : [],
      specsTitle: pData.specs_title || undefined,
      specsDescription: pData.specs_description || undefined,
      showSpecs: pData.show_specs !== false,
      benefits: Array.isArray(pData.benefits)
        ? pData.benefits.map((f: any) =>
            typeof f === "string"
              ? { title: f, description: "", active: true }
              : { title: String(f?.title ?? ""), description: String(f?.description ?? ""), active: f?.active !== false }
          )
        : [],
      benefitsTitle: pData.benefits_title || undefined,
      benefitsDescription: pData.benefits_description || undefined,
      showBenefits: pData.show_benefits !== false,
      faqs: Array.isArray(pData.faqs) ? pData.faqs : [],
      gallery: Array.isArray(pData.gallery)
        ? pData.gallery.map((g: any) => (typeof g === "object" && g ? String(g.url ?? "") : String(g))).filter(Boolean)
        : [],
    };
  } catch (err) {
    console.error("Error in getProductBySlug:", err);
    return staticProducts.find((item) => item.slug === slug) || null;
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────────────────────────────────────────

export const getServices = cache(async function getServices(): Promise<ServicePage[]> {
  try {
    const supabase = getSupabase();
    const { data: dbServices, error } = await supabase
      .from("services")
      .select("*, categories(name)")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !dbServices || dbServices.length === 0) {
      return staticServices;
    }

    return (dbServices as any[]).map((s) => {
      const categoryName = s.categories?.name || "Güvenlik Sistemleri";
      return {
        slug: s.slug,
        title: s.title,
        metaTitle: s.meta_title || `${s.title} | PrimeSec Teknoloji`,
        description: s.hero_description || s.intro_content || "",
        heroImage: s.image_url || "/images/alarm-sistemi.svg",
        category: categoryName,
        keywords: [s.title, "Güvenlik sistemleri", "PrimeSec Teknoloji"],
        benefits: Array.isArray(s.advantages) ? s.advantages : [],
        useCases: Array.isArray(s.usage_areas) ? s.usage_areas : [],
        process: Array.isArray(s.process_steps) ? s.process_steps : [],
        faqs: Array.isArray(s.faqs) ? s.faqs : [],
      };
    });
  } catch (err) {
    console.error("Error in getServices:", err);
    return staticServices;
  }
});

export const getServiceBySlug = cache(async function getServiceBySlug(slug: string): Promise<ServicePage | null> {
  try {
    const supabase = getSupabase();
    const { data: s, error } = await supabase
      .from("services")
      .select("*, categories(name)")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !s) {
      return staticServices.find((item) => item.slug === slug) || null;
    }

    const sData = s as any;
    const categoryName = sData.categories?.name || "Güvenlik Sistemleri";
    return {
      slug: sData.slug,
      title: sData.title,
      metaTitle: sData.meta_title || `${sData.title} | PrimeSec Teknoloji`,
      description: sData.hero_description || sData.intro_content || "",
      heroImage: sData.image_url || "/images/alarm-sistemi.svg",
      category: categoryName,
      keywords: [sData.title, "Güvenlik sistemleri", "PrimeSec Teknoloji"],
      benefits: Array.isArray(sData.advantages) ? sData.advantages : [],
      useCases: Array.isArray(sData.usage_areas) ? sData.usage_areas : [],
      process: Array.isArray(sData.process_steps) ? sData.process_steps : [],
      faqs: Array.isArray(sData.faqs) ? sData.faqs : [],
    };
  } catch (err) {
    console.error("Error in getServiceBySlug:", err);
    return staticServices.find((item) => item.slug === slug) || null;
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// BLOG POSTS
// ─────────────────────────────────────────────────────────────────────────────

export const getBlogPosts = cache(async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const supabase = getSupabase();
    const { data: dbPosts, error } = await supabase
      .from("blog_posts")
      .select("*, categories(name)")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error || !dbPosts || dbPosts.length === 0) {
      return staticBlogPosts;
    }

    return (dbPosts as any[]).map((post) => {
      const categoryName = post.categories?.name || "Satın Alma Rehberleri";
      const dateStr = post.published_at ? new Date(post.published_at).toISOString().split("T")[0] : new Date(post.created_at).toISOString().split("T")[0];
      
      const paragraphs = post.content ? post.content.split("\n\n").map((p: string) => p.trim()).filter(Boolean) : [];

      return {
        slug: post.slug,
        title: post.title,
        description: post.excerpt || "",
        category: categoryName,
        date: dateStr,
        updatedAt: post.updated_at ? new Date(post.updated_at).toISOString().split("T")[0] : dateStr,
        readTime: post.reading_time || "5 dk",
        image: post.cover_image_url || "/images/blog-security.svg",
        body: paragraphs.length > 0 ? paragraphs : ["Güvenlik sistemi hakkında detaylar."],
        faqs: Array.isArray(post.faqs) ? post.faqs : [],
      };
    });
  } catch (err) {
    console.error("Error in getBlogPosts:", err);
    return staticBlogPosts;
  }
});

export const getBlogPostBySlug = cache(async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = getSupabase();
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select("*, categories(name)")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error || !post) {
      return staticBlogPosts.find((item) => item.slug === slug) || null;
    }

    const postData = post as any;
    const categoryName = postData.categories?.name || "Satın Alma Rehberleri";
    const dateStr = postData.published_at ? new Date(postData.published_at).toISOString().split("T")[0] : new Date(postData.created_at).toISOString().split("T")[0];
    
    const paragraphs = postData.content ? postData.content.split("\n\n").map((p: string) => p.trim()).filter(Boolean) : [];

    return {
      slug: postData.slug,
      title: postData.title,
      description: postData.excerpt || "",
      category: categoryName,
      date: dateStr,
      updatedAt: postData.updated_at ? new Date(postData.updated_at).toISOString().split("T")[0] : dateStr,
      readTime: postData.reading_time || "5 dk",
      image: postData.cover_image_url || "/images/blog-security.svg",
      body: paragraphs.length > 0 ? paragraphs : ["Güvenlik sistemi hakkında detaylar."],
      faqs: Array.isArray(postData.faqs) ? postData.faqs : [],
    };
  } catch (err) {
    console.error("Error in getBlogPostBySlug:", err);
    return staticBlogPosts.find((item) => item.slug === slug) || null;
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE AREAS (LOCATIONS)
// ─────────────────────────────────────────────────────────────────────────────

export const getServiceAreas = cache(async function getServiceAreas(): Promise<ServicePage[]> {
  try {
    const supabase = getSupabase();
    const { data: dbAreas, error } = await supabase
      .from("service_areas")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error || !dbAreas || dbAreas.length === 0) {
      return staticLocations;
    }

    return (dbAreas as any[]).map((area) => {
      const city = area.city;
      const title = area.title;
      return {
        slug: area.slug,
        title: title,
        metaTitle: area.meta_title || `${title} | PrimeSec Teknoloji`,
        description: area.description || "",
        heroImage: area.slug.includes("kamera") ? "/images/kamera-sistemi.svg" : "/images/local-security.svg",
        category: area.slug.includes("kamera") ? "Kamera Sistemleri" : "Alarm Sistemleri",
        keywords: [title, `${city} güvenlik sistemleri`, "PrimeSec Teknoloji"],
        benefits: [
          `${city} ve çevresine hızlı keşif planı`,
          "Ev ve iş yeri için ayrı risk analizi",
          "Alarm, kamera ve akıllı sistem entegrasyonu",
          "Kurulum sonrası teknik destek",
        ],
        useCases: [`${city} konut projeleri`, `${city} mağaza ve ofisleri`, "Depo, üretim ve ortak alanlar"],
        process: ["Bölge ihtiyacının analizi", "Ürün ve kamera/sensör planı", "Kurulum ve mobil ayarlar", "Bakım ve destek"],
        faqs: Array.isArray(area.faqs) && area.faqs.length > 0 ? area.faqs : [
          { question: `${city} için keşif süreci nasıl ilerler?`, answer: "İhtiyaç bilgilerinizi aldıktan sonra uygun gün ve saat için keşif planı oluştururuz." },
          { question: "Yerel servis desteği var mı?", answer: "PrimeSec Teknoloji yakın hizmet ağında kurulum ve satış sonrası destek sağlar." },
        ],
      };
    });
  } catch (err) {
    console.error("Error in getServiceAreas:", err);
    return staticLocations;
  }
});

export const getServiceAreaBySlug = cache(async function getServiceAreaBySlug(slug: string): Promise<ServicePage | null> {
  try {
    const supabase = getSupabase();
    const { data: area, error } = await supabase
      .from("service_areas")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !area) {
      return staticLocations.find((item) => item.slug === slug) || null;
    }

    const areaData = area as any;
    const city = areaData.city;
    const title = areaData.title;

    return {
      slug: areaData.slug,
      title: title,
      metaTitle: areaData.meta_title || `${title} | PrimeSec Teknoloji`,
      description: areaData.description || "",
      heroImage: areaData.slug.includes("kamera") ? "/images/kamera-sistemi.svg" : "/images/local-security.svg",
      category: areaData.slug.includes("kamera") ? "Kamera Sistemleri" : "Alarm Sistemleri",
      keywords: [title, `${city} güvenlik sistemleri`, "PrimeSec Teknoloji"],
      benefits: [
        `${city} ve çevresine hızlı keşif planı`,
        "Ev ve iş yeri için ayrı risk analizi",
        "Alarm, kamera ve akıllı sistem entegrasyonu",
        "Kurulum sonrası teknik destek",
      ],
      useCases: [`${city} konut projeleri`, `${city} mağaza ve ofisleri`, "Depo, üretim ve ortak alanlar"],
      process: ["Bölge ihtiyacının analizi", "Ürün ve kamera/sensör planı", "Kurulum ve mobil ayarlar", "Bakım ve destek"],
      faqs: Array.isArray(areaData.faqs) && areaData.faqs.length > 0 ? areaData.faqs : [
        { question: `${city} için keşif süreci nasıl ilerler?`, answer: "İhtiyaç bilgilerinizi aldıktan sonra uygun gün ve saat için keşif planı oluştururuz." },
        { question: "Yerel servis desteği var mı?", answer: "PrimeSec Teknoloji yakın hizmet ağında kurulum ve satış sonrası destek sağlar." },
      ],
    };
  } catch (err) {
    console.error("Error in getServiceAreaBySlug:", err);
    return staticLocations.find((item) => item.slug === slug) || null;
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM BUILDER OPTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const getBuilderOptions = cache(async function getBuilderOptions() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("builder_options")
      .select("*")
      .eq("is_active", true)
      .order("step_number", { ascending: true })
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return null;
    }
    return data;
  } catch (err) {
    console.error("Error in getBuilderOptions:", err);
    return null;
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// BRANDS
// ─────────────────────────────────────────────────────────────────────────────

export type Brand = {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  isFeatured: boolean;
};

export const getBrands = cache(async function getBrands(): Promise<Brand[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return [];
    }

    return (data as any[]).map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      logoUrl: b.logo_url || undefined,
      isFeatured: b.is_featured || false,
    }));
  } catch (err) {
    console.error("Error in getBrands:", err);
    return [];
  }
});
