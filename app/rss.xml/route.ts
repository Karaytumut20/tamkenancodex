import { blogPosts } from "@/data/blog";
import { siteConfig } from "@/data/site";

export function GET() {
  const items = blogPosts
    .map((post) => `<item><title><![CDATA[${post.title}]]></title><link>${siteConfig.siteUrl}/blog/${post.slug}</link><description><![CDATA[${post.description}]]></description><pubDate>${new Date(post.date).toUTCString()}</pubDate></item>`)
    .join("");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${siteConfig.name} Blog</title><link>${siteConfig.siteUrl}/blog</link><description>${siteConfig.description}</description>${items}</channel></rss>`, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
