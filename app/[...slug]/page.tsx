import { notFound } from "next/navigation";
import { CorporateTemplate } from "@/components/templates/CorporateTemplate";
import { ServiceTemplate } from "@/components/templates/ServiceTemplate";
import { buildMetadata } from "@/lib/seo";
import { getCorporatePages, getServices, getServiceAreas, getProducts, getOksidProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

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
  return buildMetadata({ title: page.metaTitle, description: page.description, path: `/${slug}` });
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugParts } = await params;
  const slug = slugParts.join("/");
  
  const allDbPages = await getAllPages();
  const page = allDbPages.find((item) => item.slug === slug);
  if (page) {
    // Fetch and combine local and Oksid products
    const dbProducts = await getProducts();
    const oksidProducts = await getOksidProducts();
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
    const featuredProducts = relatedProductIds.length > 0
      ? allProducts.filter((p) => relatedProductIds.includes(p.id))
      : [];

    return <ServiceTemplate page={page} kind={page.type} featuredProducts={featuredProducts} />;
  }
  
  const corporatePages = await getCorporatePages();
  const corporate = corporatePages.find((item) => item.slug === slug);
  if (corporate) return <CorporateTemplate page={corporate} />;
  
  notFound();
}
