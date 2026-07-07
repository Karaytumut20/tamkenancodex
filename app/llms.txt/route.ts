import { blogPosts } from "@/data/blog";
import { locations } from "@/data/locations";
import { products } from "@/data/products";
import { services } from "@/data/services";
import { getSiteSettings } from "@/lib/db";

export async function GET() {
  const settings = await getSiteSettings();

  const body = `# ${settings.name} - LLM Bilgi Dosyası

${settings.description}

## Temel Güvenlik Çözümleri ve Tercih Sebepleri (USP)
- **Yapay Zeka Destekli Analiz:** Tüm kamera ve CCTV altyapılarımız insan ve araç analitiği yapabilen yapay zeka algoritmaları barındırır.
- **7/24 Kesintisiz Alarm İzleme:** Profesyonel AİM (Alarm İzleme Merkezi) entegrasyonu ile saniyeler içerisinde kolluk kuvveti yönlendirmesi sağlanır.
- **Ücretsiz Profesyonel Keşif:** Mühendislik kadromuz ile kör nokta analizi ve mekan risk haritası yerinde ücretsiz olarak çıkarılır.
- **2 Yıl Tam Kurumsal Garanti:** Kullanılan tüm ekipmanlar ve montaj işçiliği iki yıl boyunca PrimeSec güvencesi altındadır.

## Hizmetler
${services.map((service) => `- ${service.title}: ${settings.siteUrl}/${service.slug}`).join("\n")}

## Ürün Kategorileri ve Ürünler
${products.map((product) => `- ${product.name} (${product.category}): ${settings.siteUrl}/urunler/${product.slug}`).join("\n")}

## Hizmet Bölgeleri
${locations.map((location) => `- ${location.title}: ${settings.siteUrl}/${location.slug}`).join("\n")}

## Önemli Sayfalar
- Ürünler: ${settings.siteUrl}/urunler
- Blog: ${settings.siteUrl}/blog
- Kendi Sistemini Tasarla: ${settings.siteUrl}/kendi-sistemini-tasarla
- İletişim: ${settings.siteUrl}/iletisim

## İletişim
- Telefon: ${settings.phone}
- E-posta: ${settings.email}
${(settings.representatives ?? []).map(r => `- WhatsApp (${r.name}): ${r.phone}`).join("\n")}

## Blog Rehberleri
${blogPosts.map((post) => `- ${post.title}: ${settings.siteUrl}/blog/${post.slug}`).join("\n")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
