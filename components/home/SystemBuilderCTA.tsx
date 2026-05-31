import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";

export function SystemBuilderCTA() {
  return (
    <section className="bg-[#030D21] py-16 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(0,107,255,0.15),transparent_70%)] blur-[80px]" />
      </div>
      <div className="container-primesec relative z-10 grid gap-6 xl:grid-cols-2">
        <Link href="/kendi-sistemini-tasarla" className="group relative min-h-[320px] overflow-hidden rounded-[28px] border border-border bg-white p-8 text-ink hover:border-primary-300 transition-all">
          <div className="absolute -bottom-6 -right-6 h-[240px] w-[240px] opacity-20 sm:h-[280px] sm:w-[280px] group-hover:opacity-40 transition-opacity">
            <Image src="/images/local-security.svg" alt="PrimeSec kendi sistemini oluştur görseli" fill className="object-contain object-right-bottom p-4" unoptimized />
          </div>
          <div className="relative z-10 max-w-md">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary-600">PrimeSec Akıllı Teklif</p>
            <h2 className="mt-4 text-[clamp(28px,3vw,42px)] font-black leading-[1.02] tracking-[-0.045em] text-ink">Kendi Güvenlik Sistemini Oluştur</h2>
            <p className="mt-5 text-sm leading-6 text-ink-muted">Ev veya iş yeriniz için ihtiyacınızı seçin; alarm, kamera ve akıllı ürünlerden oluşan önerilen paketi birlikte çıkaralım.</p>
            <span className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-primary-600 px-5 text-sm font-extrabold text-white group-hover:bg-primary-500">
              Başla <ChevronRight className="ml-2 h-4 w-4" />
            </span>
          </div>
        </Link>

        <div className="min-h-[320px] rounded-[28px] border border-border bg-white p-8 text-ink">
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary-600">30 saniyede teklif</p>
              <h2 className="mt-4 max-w-xl text-[clamp(28px,3vw,40px)] font-black leading-[1.05] tracking-[-0.045em] text-ink">Seçimlerini yap, PrimeSec Plus önerini gör.</h2>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-ink-muted">Korunacak alanı, kat bilgisini, güvenlik ihtiyacını ve ek ürünleri seçerek sana özel özet ve teklif formuna geçebilirsin.</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/kendi-sistemini-tasarla" className="inline-flex h-12 items-center justify-center rounded-full bg-primary-600 px-6 text-sm font-extrabold text-white hover:bg-primary-500">
                Sistemi Oluştur <Sparkles className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/iletisim" className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-transparent px-6 text-sm font-extrabold text-ink hover:border-primary-600 hover:text-primary-600 transition-colors">
                Danışmanla Görüş <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
