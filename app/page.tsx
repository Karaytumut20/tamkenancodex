import { BrandChips } from "@/components/home/BrandChips";
import { Hero } from "@/components/home/Hero";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { ServiceGrid } from "@/components/home/ServiceGrid";
import { ServiceShowcase } from "@/components/home/ServiceShowcase";
import { StatsBand } from "@/components/home/StatsBand";
import { SystemBuilderCTA } from "@/components/home/SystemBuilderCTA";
import { TrustBar } from "@/components/home/TrustBar";
import { WhyFaqBlog } from "@/components/home/WhyFaqBlog";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/data/site";

export const metadata = buildMetadata({
  title: "CCTV Kamera, Alarm ve Güvenlik Sistemleri | PrimeSec Teknoloji",
  description: "PrimeSec Teknoloji ile alarm, kamera, akıllı ev, yangın ihbar, PDKS ve network güvenlik sistemleri için keşif ve teklif alın.",
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "PrimeSec Teknoloji Ana Sayfa",
          description: siteConfig.description,
          url: siteConfig.siteUrl,
        }}
      />
      <Hero />
      <ServiceGrid />
      <ProductCarousel />
      <SystemBuilderCTA />
      <BrandChips />
      <ServiceShowcase />
      <StatsBand />
      <WhyFaqBlog />
      <TrustBar />
    </>
  );
}
