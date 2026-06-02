import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { siteConfig } from "@/data/site";
import { services } from "@/data/services";
import { brands, products } from "@/data/products";
import { locations } from "@/data/locations";

export function Footer() {
  const serviceLinks = services.filter((service) => !service.slug.includes("/")).slice(0, 10);

  return (
    <footer className="primesec-navy-bg text-white">
      <Container className="pt-24 pb-16">
        <div className="grid gap-9 md:grid-cols-2 xl:grid-cols-5">
          <div>
            <Logo />
            <p className="mt-5 text-sm leading-7 text-[#b8c7dd]">{siteConfig.description}</p>
            <div className="mt-5 space-y-3 text-sm text-[#b8c7dd]">
              <p className="flex gap-2"><Phone className="h-4 w-4 text-primary-300" /> {siteConfig.phone}</p>
              <p className="flex gap-2"><Mail className="h-4 w-4 text-primary-300" /> {siteConfig.email}</p>
              <p className="flex gap-2"><MapPin className="h-4 w-4 text-primary-300" /> {siteConfig.address}</p>
            </div>
          </div>
          <FooterColumn title="Hizmetler" links={serviceLinks.map((service) => ({ label: service.title, href: `/${service.slug}` }))} />
          <FooterColumn title="Ürünler" links={products.slice(0, 10).map((product) => ({ label: product.name, href: `/urunler/${product.slug}` }))} />
          <FooterColumn title="Markalar" links={brands.slice(0, 10).map((brand) => ({ label: brand, href: `/urunler?marka=${brand}` }))} />
          <FooterColumn title="Hizmet Bölgeleri" links={locations.slice(0, 8).map((location) => ({ label: location.title, href: `/${location.slug}` }))} />
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-7 text-sm text-[#b8c7dd] md:flex-row md:items-center md:justify-between">
          <p>© 2026 PrimeSec Teknoloji. Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/kvkk" className="hover:text-primary-300">KVKK</Link>
            <Link href="/gizlilik-politikasi" className="hover:text-primary-300">Gizlilik Politikası</Link>
            <Link href="/cerez-politikasi" className="hover:text-primary-300">Çerez Politikası</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="mb-4 flex items-center gap-2 font-extrabold">
        <ShieldCheck className="h-4 w-4 text-primary-300" /> {title}
      </h3>
      <ul className="space-y-3 text-sm text-[#b8c7dd]">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-primary-300">{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
