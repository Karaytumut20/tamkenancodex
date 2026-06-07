import type { Metadata } from "next";
import { siteConfig } from "@/data/site";

type SeoInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  robotsIndex?: string;
  robotsFollow?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
};

export function buildMetadata({
  title,
  description,
  path = "/",
  image = "/images/primesec-hero-guvenlik-sistemleri.svg",
  robotsIndex = "index",
  robotsFollow = "follow",
  canonicalUrl,
  ogTitle,
  ogDescription,
  twitterTitle,
  twitterDescription,
  twitterImage,
}: SeoInput): Metadata {
  const url = canonicalUrl || new URL(path, siteConfig.siteUrl).toString();
  const imageUrl = new URL(
    twitterImage || image,
    siteConfig.siteUrl,
  ).toString();
  const mainImageUrl = new URL(image, siteConfig.siteUrl).toString();

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: {
      index: robotsIndex === "index",
      follow: robotsFollow === "follow",
    },
    openGraph: {
      title: ogTitle || title,
      description: ogDescription || description,
      url,
      siteName: siteConfig.name,
      type: "website",
      images: [
        {
          url: mainImageUrl,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} güvenlik sistemleri`,
        },
      ],
      locale: "tr_TR",
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle || title,
      description: twitterDescription || description,
      images: [imageUrl],
    },
  };
}
