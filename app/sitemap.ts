import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import {
  getProducts,
  getServices,
  getBlogPosts,
  getServiceAreas,
  getCorporatePages,
} from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, services, posts, locations, corporate] = await Promise.all([
    getProducts(),
    getServices(),
    getBlogPosts(),
    getServiceAreas(),
    getCorporatePages(),
  ]);

  const currentRuntimeDate = new Date();

  const buildPaths = () => {
    const paths = [
      { url: "", priority: 1, changeFrequency: "daily" },
      { url: "urunler", priority: 0.9, changeFrequency: "daily" },
      { url: "blog", priority: 0.9, changeFrequency: "daily" },
      {
        url: "kendi-sistemini-tasarla",
        priority: 0.9,
        changeFrequency: "weekly",
      },
    ];

    products
      .filter((p: any) => p.sitemapInclude !== false)
      .forEach((p: any) =>
        paths.push({
          url: `urunler/${p.slug}`,
          priority: 0.8,
          changeFrequency: "weekly",
        }),
      );

    posts
      .filter((p: any) => p.sitemapInclude !== false)
      .forEach((p: any) =>
        paths.push({
          url: `blog/${p.slug}`,
          priority: 0.7,
          changeFrequency: "weekly",
        }),
      );

    services
      .filter((p: any) => p.sitemapInclude !== false)
      .forEach((p: any) =>
        paths.push({ url: p.slug, priority: 0.8, changeFrequency: "weekly" }),
      );

    locations
      .filter((p: any) => p.sitemapInclude !== false)
      .forEach((p: any) =>
        paths.push({ url: p.slug, priority: 0.7, changeFrequency: "weekly" }),
      );

    corporate
      .filter((p: any) => p.sitemapInclude !== false)
      .forEach((p: any) =>
        paths.push({ url: p.slug, priority: 0.6, changeFrequency: "monthly" }),
      );

    return paths;
  };

  return buildPaths().map((item) => ({
    url: `${siteConfig.siteUrl}/${item.url}`.replace(/\/$/, ""),
    lastModified: currentRuntimeDate,
    changeFrequency: item.changeFrequency as any,
    priority: item.priority,
  }));
}
