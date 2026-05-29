import { Mail, MapPin, Phone } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/templates/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { CorporatePage } from "@/data/corporate";
import { siteConfig } from "@/data/site";
import { homeFaqs } from "@/data/faqs";
import { whatsappUrl } from "@/lib/whatsapp";

export function CorporateTemplate({ page }: { page: CorporatePage }) {
  const isContact = page.slug === "iletisim";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: page.title,
          description: page.description,
          url: `${siteConfig.siteUrl}/${page.slug}`,
        }}
      />
      <PageHero title={page.title} description={page.description} image="/images/local-security.svg" crumbs={[{ label: page.title, href: `/${page.slug}` }]} />
      <section className="bg-[#F7FAFF] py-14">
        <Container className="grid gap-8 xl:grid-cols-12">
          <div className="xl:col-span-7">
            <h2 className="section-title">{page.cta}</h2>
            <div className="mt-6 space-y-5 text-lg leading-8 text-ink-muted">
              {page.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            {page.slug === "sikca-sorulan-sorular" ? (
              <div className="mt-8 space-y-4">
                {homeFaqs.map((faq) => (
                  <div key={faq.question} className="rounded-2xl border border-border bg-white p-5 shadow-card">
                    <h3 className="font-extrabold text-ink">{faq.question}</h3>
                    <p className="mt-2 text-sm leading-6 text-ink-muted">{faq.answer}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <aside className="h-fit rounded-[24px] border border-border bg-surface p-6 xl:sticky xl:top-32 xl:col-span-5">
            <h2 className="text-2xl font-extrabold text-ink">{isContact ? "Bize Ulaşın" : "Teklif Alın"}</h2>
            <div className="mt-5 space-y-3 text-sm font-semibold text-ink-muted">
              <p className="flex gap-2"><Phone className="h-5 w-5 text-primary-600" /> {siteConfig.phone}</p>
              <p className="flex gap-2"><Mail className="h-5 w-5 text-primary-600" /> {siteConfig.email}</p>
              <p className="flex gap-2"><MapPin className="h-5 w-5 text-primary-600" /> {siteConfig.address}</p>
            </div>
            {isContact ? <ContactForm /> : null}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <ButtonLink href="/kendi-sistemini-tasarla">Ücretsiz Keşif</ButtonLink>
              <ButtonLink href={whatsappUrl("Merhaba, PrimeSec Teknoloji ile iletişime geçmek istiyorum.")} variant="outlineBlue">WhatsApp</ButtonLink>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}

function ContactForm() {
  return (
    <form action="/api/lead" method="post" className="mt-6 space-y-3">
      <input type="hidden" name="source" value="contact" />
      <input name="company" className="hidden" tabIndex={-1} autoComplete="off" />
      {["Ad Soyad", "Telefon", "Şehir"].map((label) => (
        <label key={label} className="block">
          <span className="sr-only">{label}</span>
          <input name={label === "Ad Soyad" ? "name" : label === "Telefon" ? "phone" : "city"} required placeholder={label} className="h-12 w-full rounded-xl border border-border bg-white px-4 outline-none focus:border-primary-500" />
        </label>
      ))}
      <label className="flex gap-3 text-sm leading-6 text-ink-muted">
        <input required name="kvkkConsent" type="checkbox" className="mt-1 h-5 w-5" /> KVKK kapsamında iletişime geçilmesini kabul ediyorum.
      </label>
      <button className="h-12 w-full rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 font-extrabold text-white shadow-glow">Gönder</button>
    </form>
  );
}
