import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { resolveCanonicalUrl } from "@/lib/seo";
import {
  getProducts,
  getOksidProducts,
  getServices,
  getBlogPosts,
  getServiceAreas,
  getCorporatePages,
} from "@/lib/db";

const ROUTE_REDIRECTS = new Set(["kurumsal"]);

function isSameCanonicalPath(canonicalUrl: string | undefined, path: string) {
  if (!canonicalUrl) return true;
  if (!/^(?:https?:\/\/|\/)/i.test(canonicalUrl.trim())) return false;

  try {
    const canonical = new URL(resolveCanonicalUrl(`/${path}`, canonicalUrl));
    const expected = new URL(`/${path}`, siteConfig.siteUrl);
    const normalizePath = (value: string) => value.replace(/\/+$/, "") || "/";

    return (
      canonical.origin === expected.origin &&
      normalizePath(canonical.pathname) === normalizePath(expected.pathname) &&
      !canonical.search &&
      !canonical.hash
    );
  } catch {
    return false;
  }
}

function isIndexableEntry(entry: any, path: string) {
  return (
    entry.sitemapInclude !== false &&
    entry.robotsIndex !== "noindex" &&
    !entry.redirectTo &&
    !ROUTE_REDIRECTS.has(path) &&
    isSameCanonicalPath(entry.canonicalUrl, path)
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, oksidProducts, services, posts, locations, corporate] = await Promise.all([
    getProducts(),
    getOksidProducts(),
    getServices(),
    getBlogPosts(),
    getServiceAreas(),
    getCorporatePages(),
  ]);

  const buildPaths = () => {
    const paths = [
      { url: "", priority: 1, changeFrequency: "daily" },
      { url: "urunler", priority: 0.9, changeFrequency: "daily" },
      { url: "referanslarimiz", priority: 0.8, changeFrequency: "monthly" },
      { url: "blog", priority: 0.9, changeFrequency: "daily" },
      {
        url: "kendi-sistemini-tasarla",
        priority: 0.9,
        changeFrequency: "weekly",
      },
    ];

    products
      .filter((p: any) => isIndexableEntry(p, `urunler/${p.slug}`))
      .forEach((p: any) =>
        paths.push({
          url: `urunler/${p.slug}`,
          priority: 0.8,
          changeFrequency: "weekly",
        }),
      );

    // XML ile içe aktarılan katalog ürünleri de herkese açık ve kanonik ürün
    // sayfalarına sahiptir. Bunlar site haritasında olmadığında Google onları
    // yalnızca iç bağlantılardan keşfeder; özellikle büyük kataloglarda bu,
    // taramanın uzun süre ertelenmesine neden olabilir.
    oksidProducts
      .filter((p: any) => p.isActive !== false && p.slug)
      .forEach((p: any) =>
        paths.push({
          url: `urunler/${p.slug}`,
          priority: 0.8,
          changeFrequency: "weekly",
        }),
      );

    posts
      .filter((p: any) => isIndexableEntry(p, `blog/${p.slug}`))
      .forEach((p: any) =>
        paths.push({
          url: `blog/${p.slug}`,
          priority: 0.7,
          changeFrequency: "weekly",
        }),
      );

    services
      .filter((p: any) => isIndexableEntry(p, p.slug))
      .forEach((p: any) =>
        paths.push({ url: p.slug, priority: 0.8, changeFrequency: "weekly" }),
      );

    locations
      .filter((p: any) => isIndexableEntry(p, p.slug))
      .forEach((p: any) =>
        paths.push({ url: p.slug, priority: 0.7, changeFrequency: "weekly" }),
      );

    corporate
      .filter((p: any) => isIndexableEntry(p, p.slug))
      .forEach((p: any) =>
        paths.push({ url: p.slug, priority: 0.6, changeFrequency: "monthly" }),
      );

    return paths;
  };

  const uniquePaths = Array.from(
    new Map(buildPaths().map((item) => [item.url.replace(/^\/+|\/+$/g, ""), item])).values(),
  );

  return uniquePaths.map((item) => ({
    url: `${siteConfig.siteUrl}/${item.url}`.replace(/\/$/, ""),
    changeFrequency: item.changeFrequency as any,
    priority: item.priority,
  }));
}
