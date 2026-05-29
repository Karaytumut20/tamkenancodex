import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Breadcrumbs, type Crumb } from "@/components/seo/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function PageHero({ title, description, image, crumbs }: { title: string; description: string; image: string; crumbs: Crumb[] }) {
  return (
    <section className="bg-[#F7FAFF] py-4">
      <Container className="bg-transparent">
        <div className="desktop-grid items-center px-5 py-12 md:px-10 lg:py-16">
          <div className="col-span-4 md:col-span-8 xl:col-span-6">
            <Breadcrumbs items={crumbs} />
            <div className="mt-8 inline-flex h-10 items-center gap-2 rounded-full border border-[#D8DDE6] bg-white px-4 text-xs font-extrabold tracking-wide text-ink">
              <ShieldCheck className="h-4 w-4 text-primary-600" /> PRIMESEC TEKNOLOJİ
            </div>
            <h1 className="mt-6 text-[clamp(38px,4vw,68px)] font-black leading-[1.02] tracking-[-0.055em] text-[#171923]">{title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5D6472]">{description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/kendi-sistemini-tasarla" size="lg" className="rounded-full bg-primary-600 shadow-none">
                Ücretsiz Keşif Al <ArrowRight className="h-5 w-5" />
              </ButtonLink>
              <ButtonLink href="/iletisim" variant="outlineBlue" size="lg" className="rounded-full border-[#CBD3DF] bg-white text-ink hover:bg-ink hover:text-white">Teklif İste</ButtonLink>
            </div>
          </div>
          <div className="col-span-4 mt-10 md:col-span-8 xl:col-span-6 xl:mt-0">
            <div className="relative mx-auto h-[300px] max-w-[620px] md:h-[430px]">
              <div className="absolute inset-8 rounded-[38px] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.10)]" />
              <Image src={image} alt={`${title} görseli`} fill priority className="object-contain p-8 drop-shadow-[0_24px_60px_rgba(15,23,42,0.18)]" unoptimized />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
