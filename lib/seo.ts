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

export function resolveCanonicalUrl(path: string, canonicalUrl?: string) {
  const fallback = new URL(path, siteConfig.siteUrl);
  if (!canonicalUrl || !/^(?:https?:\/\/|\/)/i.test(canonicalUrl.trim())) {
    return fallback.toString();
  }

  try {
    const canonical = new URL(canonicalUrl.trim(), siteConfig.siteUrl);
    const site = new URL(siteConfig.siteUrl);
    const canonicalHost = canonical.hostname.replace(/^www\./i, "");
    const siteHost = site.hostname.replace(/^www\./i, "");

    // The bare domain permanently redirects to www. Keep one canonical host
    // even when an older CMS record still contains the bare-domain URL.
    if (canonicalHost === siteHost) {
      canonical.protocol = site.protocol;
      canonical.host = site.host;
    }

    return canonical.toString();
  } catch {
    return fallback.toString();
  }
}

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
  const url = resolveCanonicalUrl(path, canonicalUrl);
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
