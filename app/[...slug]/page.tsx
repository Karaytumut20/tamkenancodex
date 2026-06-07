import { notFound } from "next/navigation";
import { CorporateTemplate } from "@/components/templates/CorporateTemplate";
import { ServiceTemplate } from "@/components/templates/ServiceTemplate";
import { buildMetadata } from "@/lib/seo";
import { getCorporatePages, getServices, getServiceAreas } from "@/lib/db";

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
  return buildMetadata({ title: page.metaTitle, description: page.description, path: `/${slug}` });
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugParts } = await params;
  const slug = slugParts.join("/");
  
  const allDbPages = await getAllPages();
  const page = allDbPages.find((item) => item.slug === slug);
  if (page) return <ServiceTemplate page={page} kind={page.type} />;
  
  const corporatePages = await getCorporatePages();
  const corporate = corporatePages.find((item) => item.slug === slug);
  if (corporate) return <CorporateTemplate page={corporate} />;
  
  notFound();
}
