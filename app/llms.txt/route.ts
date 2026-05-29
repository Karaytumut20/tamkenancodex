import { blogPosts } from "@/data/blog";
import { locations } from "@/data/locations";
import { products } from "@/data/products";
import { services } from "@/data/services";
import { siteConfig } from "@/data/site";

export function GET() {
  const body = `# ${siteConfig.name}

${siteConfig.description}

## Hizmetler
${services.map((service) => `- ${service.title}: ${siteConfig.siteUrl}/${service.slug}`).join("\n")}

## Ürün Kategorileri ve Ürünler
${products.map((product) => `- ${product.name} (${product.category}): ${siteConfig.siteUrl}/urunler/${product.slug}`).join("\n")}

## Hizmet Bölgeleri
${locations.map((location) => `- ${location.title}: ${siteConfig.siteUrl}/${location.slug}`).join("\n")}

## Önemli Sayfalar
- Ürünler: ${siteConfig.siteUrl}/urunler
- Blog: ${siteConfig.siteUrl}/blog
- Kendi Sistemini Tasarla: ${siteConfig.siteUrl}/kendi-sistemini-tasarla
- İletişim: ${siteConfig.siteUrl}/iletisim

## İletişim
- Telefon: ${siteConfig.phone}
- WhatsApp: ${siteConfig.whatsapp}
- E-posta: ${siteConfig.email}

## Blog Rehberleri
${blogPosts.map((post) => `- ${post.title}: ${siteConfig.siteUrl}/blog/${post.slug}`).join("\n")}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
