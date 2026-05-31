import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import type { Product } from "@/data/products";
import { ButtonLink } from "@/components/ui/Button";
import { productWhatsappUrl } from "@/lib/whatsapp";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex aspect-[3/4.2] flex-col rounded-2xl border border-border bg-white p-4">
      <Link href={`/urunler/${product.slug}`} className="relative mb-4 block flex-[1.3] rounded-xl bg-white border border-border/70">
        <Image src={product.image} alt={`${product.name} ürün görseli`} fill className="object-contain p-6  " unoptimized />
      </Link>
      <div className="mb-3 flex flex-wrap gap-2">
        {product.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-extrabold text-primary-600">{tag}</span>
        ))}
      </div>
      <h2 className="text-lg font-extrabold text-ink">
        <Link href={`/urunler/${product.slug}`} className="hover:text-primary-600">{product.name}</Link>
      </h2>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-muted">{product.description}</p>
      <div className="mt-auto grid gap-2 pt-4">
        <ButtonLink href={`/urunler/${product.slug}`} variant="outlineBlue" className="w-full">Detayları İncele</ButtonLink>
        <ButtonLink href={productWhatsappUrl(product)} className="w-full">
          <MessageCircle className="h-4 w-4" /> WhatsApp'tan Teklif Al
        </ButtonLink>
      </div>
    </article>
  );
}
