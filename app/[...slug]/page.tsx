import { notFound } from "next/navigation";
import { CorporateTemplate } from "@/components/templates/CorporateTemplate";
import { ServiceTemplate } from "@/components/templates/ServiceTemplate";
import { buildMetadata } from "@/lib/seo";
import { getCorporatePages, getServices, getServiceAreas, getProducts, getOksidProducts } from "@/lib/db";

export const revalidate = 3600;

async function getAllPages() {
  const dbServices = await getServices();
  const dbAreas = await getServiceAreas();
  return [
    ...dbServices.map((page) => ({ ...page, type: "service" as const })),
    ...dbAreas.map((page) => ({ ...page, type: "location" as const }))
  ];
}

export async function generateStaticParams() {
  const allDbPages = await getAllPages();
  const corporatePages = await getCorporatePages();
  return [
    ...allDbPages.map((page) => ({ slug: page.slug.split("/") })),
    ...corporatePages.map((page) => ({ slug: [page.slug] })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugParts } = await params;
  const slug = slugParts.join("/");
  
  const allDbPages = await getAllPages();
  const corporatePages = await getCorporatePages();
  const page = allDbPages.find((item) => item.slug === slug) ?? corporatePages.find((item) => item.slug === slug);
  
  if (!page) return {};
  return buildMetadata({
    title: page.metaTitle,
    description: page.description,
    path: `/${slug}`,
    image: page.heroImage,
    robotsIndex: page.robotsIndex,
    robotsFollow: page.robotsFollow,
    canonicalUrl: page.canonicalUrl,
    ogTitle: page.ogTitle,
    ogDescription: page.ogDescription,
    twitterTitle: page.twitterTitle,
    twitterDescription: page.twitterDescription,
    twitterImage: page.twitterImage,
  });
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugParts } = await params;
  const slug = slugParts.join("/");
  
  const allDbPages = await getAllPages();
  const page = allDbPages.find((item) => item.slug === slug);
  if (page) {
    // Fetch and combine local and Oksid products
    let dbProducts: any[] = [];
    let oksidProducts: any[] = [];
    try {
      [dbProducts, oksidProducts] = await Promise.all([getProducts(), getOksidProducts()]);
    } catch (err) {
      console.error("[CatchAllPage] related products fetch error:", err);
    }
    const allProducts = [
      ...dbProducts.map((p) => ({
        ...p,
        id: p.id,
        slug: p.slug,
        name: p.name || p.title || "",
        category: p.category || "",
        brand: p.brand || "",
        image: p.image || p.image_url || "/images/alarm-sistemi.svg",
        tags: Array.isArray(p.tags) ? p.tags : [],
        description: p.description || "",
      })),
      ...oksidProducts.map((p: any) => ({
        ...p,
        id: p.id,
        slug: p.slug,
        name: p.name || p.urun_adi || "",
        category: p.kategori_ana || p.category || "",
        brand: p.marka || p.brand || "",
        image: p.image || (p.resimler && p.resimler[0]) || "/images/alarm-sistemi.svg",
        tags: Array.isArray(p.tags) ? p.tags : [],
        description: p.description || "",
      })),
    ];

    const relatedProductIds = page.relatedProductIds || [];
    let featuredProducts = relatedProductIds.length > 0
      ? allProducts.filter((p) => relatedProductIds.includes(p.id))
      : [];

    if (featuredProducts.length === 0 && oksidProducts.length > 0) {
      const categoryKeyword = page.category === "Kamera Sistemleri" ? "kamera" : (page.category === "Alarm Sistemleri" ? "alarm" : "");
      let candidates = oksidProducts;
      if (categoryKeyword) {
        candidates = oksidProducts.filter((p: any) => 
          (p.name || p.urun_adi || "").toLowerCase().includes(categoryKeyword) ||
          (p.kategori_ana || p.category || "").toLowerCase().includes(categoryKeyword)
        );
      }
      if (candidates.length === 0) {
        candidates = oksidProducts;
      }
      featuredProducts = candidates.slice(0, 4).map((p: any) => ({
        id: p.id,
        slug: p.slug,
        name: p.name || p.urun_adi || "",
        category: p.kategori_ana || p.category || "",
        brand: p.marka || p.brand || "",
        image: p.image || (p.resimler && p.resimler[0]) || "/images/alarm-sistemi.svg",
        tags: Array.isArray(p.tags) ? p.tags : [],
        description: p.description || "",
      }));
    }

    return <ServiceTemplate page={page} kind={page.type} featuredProducts={featuredProducts} />;
  }
  
  const corporatePages = await getCorporatePages();
  const corporate = corporatePages.find((item) => item.slug === slug);
  if (corporate) return <CorporateTemplate page={corporate} />;
  
  notFound();
}
