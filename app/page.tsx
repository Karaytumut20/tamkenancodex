import { BrandChips } from "@/components/home/BrandChips";
import { Hero } from "@/components/home/Hero";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { ServiceGrid } from "@/components/home/ServiceGrid";
import { PlanBanner } from "@/components/home/PlanBanner";
import { SystemBuilderCTA } from "@/components/home/SystemBuilderCTA";
import { WhyPrimeSec } from "@/components/home/WhyPrimeSec";
import { FaqBlog } from "@/components/home/FaqBlog";
import { HomePopup } from "@/components/home/HomePopup";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/data/site";
import { getBlogPosts, getProducts, getOksidProducts, getSiteContentBlock, getHomepageFeaturedProducts, getHomepageServicesData, getHomepageFaqs, getSiteSettings } from "@/lib/db";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "CCTV Kamera, Alarm ve Güvenlik Sistemleri | PrimeSec Teknoloji",
  description: "PrimeSec Teknoloji ile alarm, kamera, akıllı ev, yangın ihbar, PDKS ve network güvenlik sistemleri için keşif ve teklif alın.",
});

export default async function HomePage() {
  const [dbPosts, localProducts, oksidProducts, heroContent, featuredRefs, servicesData, faqs, settings] = await Promise.all([
    getBlogPosts(),
    getProducts(),
    getOksidProducts(),
    getSiteContentBlock("home.hero"),
    getHomepageFeaturedProducts(),
    getHomepageServicesData(),
    getHomepageFaqs(),
    getSiteSettings()
  ]);

  // Map featured product refs to actual product data
  const allProductsMap = new Map();
  localProducts.forEach(p => {
    allProductsMap.set(p.slug, {
      name: p.title || p.name || "",
      slug: p.slug,
      brand: p.brand || "PrimeSec",
      category: p.category || "Diğer",
      image: p.image || p.image_url || "/images/alarm-sistemi.svg"
    });
  });
  oksidProducts.forEach((p: any) => {
    allProductsMap.set(p.slug, {
      name: p.name || "",
      slug: p.slug,
      brand: p.brand || "PrimeSec",
      category: p.categoryAlt || p.category || "Diğer",
      image: p.image || "/images/alarm-sistemi.svg"
    });
  });

  const featuredProducts = featuredRefs.map((f: any) => allProductsMap.get(f.source_id)).filter(Boolean);

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
      <Hero content={heroContent} />
      <ServiceGrid dynamicData={servicesData} />
      <PlanBanner />
      <ProductCarousel initialProducts={featuredProducts.length > 0 ? featuredProducts : undefined} />
      <SystemBuilderCTA />
      <BrandChips />
      <WhyPrimeSec />
      <FaqBlog initialBlogPosts={dbPosts} initialFaqs={faqs} />
      <HomePopup
        active={settings.popupActive}
        title={settings.popupTitle}
        content={settings.popupContent}
        imageUrl={settings.popupImageUrl}
        buttonLabel={settings.popupButtonLabel}
        buttonUrl={settings.popupButtonUrl}
        cooldownMinutes={settings.popupCooldown}
      />
    </>
  );
}
