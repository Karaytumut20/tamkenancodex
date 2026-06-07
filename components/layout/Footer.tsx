import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { brands } from "@/data/products";
import { locations } from "@/data/locations";
import { getProducts, getServices, getSiteSettings, type SiteSettings } from "@/lib/db";

export async function Footer() {
  const [settings, services, products] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getProducts(),
  ]);
  const serviceLinks = services.filter((service) => !service.slug.includes("/")).slice(0, 10);

  return (
    <footer className="primesec-navy-bg text-white">
      <Container className="py-10 md:py-16 lg:pt-24">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-5">
          <div className="md:pr-4">
            <Logo />
            <p className="mt-4 text-sm leading-6 text-[#b8c7dd] md:mt-5 md:leading-7">{settings.description}</p>
            <FooterContact settings={settings} />
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-7 md:contents">
            <FooterColumn title="Hizmetler" links={serviceLinks.map((service) => ({ label: service.title, href: `/${service.slug}` }))} />
            <FooterColumn title="Urunler" links={products.slice(0, 10).map((product) => ({ label: product.name, href: `/urunler/${product.slug}` }))} />
            <FooterColumn title="Markalar" links={brands.slice(0, 10).map((brand) => ({ label: brand, href: `/urunler?marka=${brand}` }))} />
            <FooterColumn title="Hizmet Bolgeleri" links={locations.slice(0, 8).map((location) => ({ label: location.title, href: `/${location.slug}` }))} />
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-sm text-[#b8c7dd] md:mt-12 md:flex-row md:items-center md:justify-between md:gap-4 md:pt-7">
          <p>© 2026 {settings.name}. Tum haklari saklidir.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/kvkk" className="hover:text-primary-300">KVKK</Link>
            <Link href="/gizlilik-politikasi" className="hover:text-primary-300">Gizlilik Politikasi</Link>
            <Link href="/cerez-politikasi" className="hover:text-primary-300">Cerez Politikasi</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterContact({ settings }: { settings: SiteSettings }) {
  return (
    <div className="mt-4 grid gap-2 text-sm text-[#b8c7dd] sm:grid-cols-2 md:mt-5 md:grid-cols-1 md:gap-3">
      <p className="flex gap-2"><Phone className="h-4 w-4 text-primary-300" /> {settings.phone}</p>
      <p className="flex gap-2"><Mail className="h-4 w-4 text-primary-300" /> {settings.email}</p>
      <p className="flex gap-2 sm:col-span-2 md:col-span-1"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-300" /> {settings.address}</p>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="min-w-0">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-extrabold md:mb-4 md:text-base">
        <ShieldCheck className="h-4 w-4 text-primary-300" /> {title}
      </h3>
      <ul className="space-y-2 text-sm leading-5 text-[#b8c7dd] md:space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-primary-300">{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
