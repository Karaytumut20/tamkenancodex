import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/data/products";
import { ButtonLink } from "@/components/ui/Button";
import { productWhatsappUrl } from "@/lib/whatsapp";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col rounded-xl border border-border bg-white p-2.5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500 hover:shadow-md sm:aspect-[3/4.2] sm:rounded-2xl sm:p-4">
      <Link href={`/urunler/${product.slug}`} className="relative mb-3 block aspect-square rounded-lg border border-border/70 bg-white sm:mb-4 sm:flex-[1.3] sm:rounded-xl">
        <Image src={product.image} alt={`${product.name} ürün görseli`} fill className="object-contain p-3 sm:p-6" unoptimized />
      </Link>
      <div className="mb-3 hidden flex-wrap gap-2 sm:flex">
        {product.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-extrabold text-primary-600">{tag}</span>
        ))}
      </div>
      <h2 className="text-sm font-extrabold leading-5 text-ink sm:text-lg sm:leading-normal">
        <Link href={`/urunler/${product.slug}`} className="hover:text-cyan-500">{product.name}</Link>
      </h2>
      <p className="mt-2 hidden text-sm leading-6 text-ink-muted sm:line-clamp-2">{product.description}</p>
      <div className="mt-auto grid gap-2 pt-3 sm:pt-4">
        <ButtonLink href={`/urunler/${product.slug}`} variant="primary" size="sm" className="w-full rounded-lg px-2 text-xs sm:rounded-xl sm:text-sm">Detaylar<span className="hidden sm:inline">ı İncele</span></ButtonLink>
        <ButtonLink href={productWhatsappUrl(product)} variant="whatsapp" size="sm" className="w-full rounded-lg px-2 text-xs sm:rounded-xl sm:text-sm">
          <svg className="h-4 w-4 shrink-0 fill-current sm:mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Teklif <span className="hidden sm:inline">Al</span>
        </ButtonLink>
      </div>
    </article>
  );
}
