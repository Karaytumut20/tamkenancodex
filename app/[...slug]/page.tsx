import { notFound } from "next/navigation";
import { CorporateTemplate } from "@/components/templates/CorporateTemplate";
import { ServiceTemplate } from "@/components/templates/ServiceTemplate";
import { corporatePages } from "@/data/corporate";
import { locations } from "@/data/locations";
import { services } from "@/data/services";
import { buildMetadata } from "@/lib/seo";

const allPages = [...services.map((page) => ({ ...page, type: "service" as const })), ...locations.map((page) => ({ ...page, type: "location" as const }))];

export function generateStaticParams() {
  return [
    ...allPages.map((page) => ({ slug: page.slug.split("/") })),
    ...corporatePages.map((page) => ({ slug: [page.slug] })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugParts } = await params;
  const slug = slugParts.join("/");
  const page = allPages.find((item) => item.slug === slug) ?? corporatePages.find((item) => item.slug === slug);
  if (!page) return {};
  return buildMetadata({ title: page.metaTitle, description: page.description, path: `/${slug}` });
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugParts } = await params;
  const slug = slugParts.join("/");
  const page = allPages.find((item) => item.slug === slug);
  if (page) return <ServiceTemplate page={page} kind={page.type} />;
  const corporate = corporatePages.find((item) => item.slug === slug);
  if (corporate) return <CorporateTemplate page={corporate} />;
  notFound();
}
