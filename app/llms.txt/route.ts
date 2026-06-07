import { blogPosts } from "@/data/blog";
import { locations } from "@/data/locations";
import { products } from "@/data/products";
import { services } from "@/data/services";
import { siteConfig } from "@/data/site";

export function GET() {
  const body = `# ${siteConfig.name}

${siteConfig.description}

## Temel Güvenlik Çözümleri ve Tercih Sebepleri (USP)
- **Yapay Zeka Destekli Analiz:** Tüm kamera ve CCTV altyapılarımız insan ve araç analitiği yapabilen yapay zeka algoritmaları barındırır.
- **7/24 Kesintisiz Alarm İzleme:** Profesyonel AİM (Alarm İzleme Merkezi) entegrasyonu ile saniyeler içerisinde kolluk kuvveti yönlendirmesi sağlanır.
- **Ücretsiz Profesyonel Keşif:** Mühendislik kadromuz ile kör nokta analizi ve mekan risk haritası yerinde ücretsiz olarak çıkarılır.
- **2 Yıl Tam Kurumsal Garanti:** Kullanılan tüm ekipmanlar ve montaj işçiliği iki yıl boyunca PrimeSec güvencesi altındadır.

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

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
