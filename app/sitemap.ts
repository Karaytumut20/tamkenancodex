import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { corporatePages } from "@/data/corporate";
import { locations } from "@/data/locations";
import { products } from "@/data/products";
import { services } from "@/data/services";
import { siteConfig } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "urunler",
    "blog",
    "kendi-sistemini-tasarla",
    ...products.map((product) => `urunler/${product.slug}`),
    ...blogPosts.map((post) => `blog/${post.slug}`),
    ...services.map((service) => service.slug),
    ...locations.map((location) => location.slug),
    ...corporatePages.map((page) => page.slug),
  ];

  return paths.map((path) => ({
    url: `${siteConfig.siteUrl}/${path}`.replace(/\/$/, ""),
    lastModified: new Date("2026-05-28"),
    changeFrequency: path ? "weekly" : "daily",
    priority: path ? 0.75 : 1,
  }));
}
