import type { Metadata } from "next";
import { siteConfig } from "@/data/site";

type SeoInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
};

export function buildMetadata({ title, description, path = "/", image = "/images/primesec-hero-guvenlik-sistemleri.svg" }: SeoInput): Metadata {
  const url = new URL(path, siteConfig.siteUrl).toString();
  const imageUrl = new URL(image, siteConfig.siteUrl).toString();

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${siteConfig.name} güvenlik sistemleri` }],
      locale: "tr_TR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
