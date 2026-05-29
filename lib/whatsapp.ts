import { siteConfig } from "@/data/site";
import type { Product } from "@/data/products";

export function whatsappUrl(message: string) {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function productWhatsappUrl(product: Product) {
  return whatsappUrl(`Merhaba, PrimeSec Teknoloji web sitenizde yer alan ürün hakkında bilgi almak istiyorum.

Ürün Adı: ${product.name}
Ürün Kodu: ${product.code}
Ürün URL: ${siteConfig.siteUrl}/urunler/${product.slug}

Bu ürün için detaylı bilgi ve teklif alabilir miyim?`);
}
