import { siteConfig } from "@/data/site";
import type { Product } from "@/data/products";

function normalizeWhatsAppNumber(phone?: string) {
  const digits = (phone || siteConfig.whatsapp).replace(/\D/g, "");
  if (digits.startsWith("0")) return `90${digits.slice(1)}`;
  if (digits.length === 10) return `90${digits}`;
  return digits;
}

export function whatsappUrl(message: string, phone?: string) {
  return `https://wa.me/${normalizeWhatsAppNumber(phone)}?text=${encodeURIComponent(message)}`;
}

export function productWhatsappUrl(product: Product, phone?: string) {
  return whatsappUrl(`Merhaba, PrimeSec Teknoloji web sitenizde yer alan ürün hakkında bilgi almak istiyorum.

Ürün Adı: ${product.name}
Ürün Kodu: ${product.code}
Ürün URL: ${siteConfig.siteUrl}/urunler/${product.slug}

Bu ürün için detaylı bilgi ve teklif alabilir miyim?`, phone);
}
