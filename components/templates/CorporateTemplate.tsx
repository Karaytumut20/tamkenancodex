import { Mail, MapPin, Phone, Building, Award, Users, CheckCircle, Sparkles } from "lucide-react";
import Image from "next/image";
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
  const isAbout = page.slug === "hakkimizda" || page.slug === "kurumsal";
  const isPolicy = page.slug === "kvkk" || page.slug === "gizlilik-politikasi" || page.slug === "cerez-politikasi";

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
      
      {/* ── Page Hero ── */}
      <PageHero title={page.title} description={page.description} crumbs={[{ label: page.title, href: `/${page.slug}` }]} />

      {/* ── Main Content Section ── */}
      <section className="bg-white py-16 md:py-20 border-t border-border">
        <Container className="grid gap-12 xl:grid-cols-12">
          
          {/* Left Side: Body Content */}
          <div className="xl:col-span-7 space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-white text-primary-700 text-xs font-extrabold tracking-wide uppercase">
                <Sparkles className="h-3.5 w-3.5" /> PrimeSec Kurumsal
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink leading-tight">
                {page.cta}
              </h2>
            </div>

            <div className="space-y-6 text-[17px] leading-8 text-ink-muted">
              {page.body.map((paragraph, index) => (
                <p key={index} className={index === 0 ? "text-lg font-medium text-ink/90 leading-relaxed" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* About Page Special: Stats Cards */}
            {isAbout && (
              <div className="grid gap-4 sm:grid-cols-3 mt-10">
                <div className="p-6 rounded-2xl border border-border bg-white text-center">
                  <p className="text-3xl font-black text-primary-600">1000+</p>
                  <p className="text-xs font-extrabold text-ink-muted mt-2 uppercase tracking-wider">Mutlu Müşteri</p>
                </div>
                <div className="p-6 rounded-2xl border border-border bg-white text-center">
                  <p className="text-3xl font-black text-primary-600">7/24</p>
                  <p className="text-xs font-extrabold text-ink-muted mt-2 uppercase tracking-wider">Kesintisiz Destek</p>
                </div>
                <div className="p-6 rounded-2xl border border-border bg-white text-center">
                  <p className="text-3xl font-black text-primary-600">%100</p>
                  <p className="text-xs font-extrabold text-ink-muted mt-2 uppercase tracking-wider">Güvenlik Odaklı</p>
                </div>
              </div>
            )}

            {/* Policy Pages Details Checkmark List */}
            {isPolicy && (
              <div className="space-y-4 mt-8">
                {[
                  "Kişisel verilerinizin korunması ve güvenliği en yüksek önceliğimizdir.",
                  "Toplanan tüm veriler yasal mevzuat sınırları dahilinde saklanır.",
                  "Verilerinize üçüncü şahıslar tarafından izinsiz erişim tamamen engellenmektedir.",
                  "Dilediğiniz an verileriniz hakkında bilgi alabilir veya silinmesini talep edebilirsiniz."
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white">
                    <CheckCircle className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-ink">{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* FAQ Page Accordions */}
            {page.slug === "sikca-sorulan-sorular" ? (
              <div className="mt-10 space-y-4">
                {homeFaqs.map((faq) => (
                  <div key={faq.question} className="rounded-2xl border border-border bg-[#FFFFFF] p-6">
                    <h3 className="font-extrabold text-ink text-lg leading-snug">{faq.question}</h3>
                    <p className="mt-2.5 text-sm md:text-base leading-7 text-ink-muted">{faq.answer}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Right Side: Interactive Card Deck / Contact Panel */}
          <aside className="h-fit rounded-[32px] border border-border bg-white p-6 md:p-8 xl:sticky xl:top-32 xl:col-span-5 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -right-20 -top-20 w-48 h-48 bg-white rounded-full blur-2xl -z-10" />
            
            <h2 className="text-2xl font-black text-ink">{isContact ? "Bize Ulaşın" : "Hızlı İletişim"}</h2>
            <p className="text-sm text-ink-muted mt-2">
              Sorularınız ve keşif talepleriniz için bize aşağıdaki kanallardan ulaşabilirsiniz.
            </p>

            <div className="mt-6 space-y-4">
              <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-4 rounded-xl border border-border p-4 hover:bg-white transition-colors group">
                <div className="h-10 w-10 rounded-lg border border-border bg-white text-primary-600 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink-muted">Telefon</p>
                  <p className="text-sm font-extrabold text-ink group-hover:text-primary-600 transition-colors">{siteConfig.phone}</p>
                </div>
              </a>

              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-4 rounded-xl border border-border p-4 hover:bg-white transition-colors group">
                <div className="h-10 w-10 rounded-lg border border-border bg-white text-primary-600 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink-muted">E-posta</p>
                  <p className="text-sm font-extrabold text-ink group-hover:text-primary-600 transition-colors">{siteConfig.email}</p>
                </div>
              </a>

              <div className="flex items-center gap-4 rounded-xl border border-border p-4">
                <div className="h-10 w-10 rounded-lg border border-border bg-white text-primary-600 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink-muted">Adres</p>
                  <p className="text-sm font-extrabold text-ink">{siteConfig.address}</p>
                </div>
              </div>
            </div>

            {isContact ? <ContactForm /> : null}

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <ButtonLink href="/kendi-sistemini-tasarla">
                Ücretsiz Keşif Al
              </ButtonLink>
              <ButtonLink href={whatsappUrl("Merhaba, PrimeSec Teknoloji ile iletişime geçmek istiyorum.")} variant="outlineBlue">
                WhatsApp
              </ButtonLink>
            </div>
          </aside>

        </Container>
      </section>

      {/* About & Corporate: Company values banner */}
      {isAbout && (
        <section className="bg-white py-16 border-t border-b border-border">
          <Container className="grid gap-8 md:grid-cols-3">
            <div className="p-8 bg-white border border-border rounded-3xl space-y-4">
              <Award className="h-8 w-8 text-primary-600" />
              <h3 className="text-xl font-bold text-ink">Yüksek Standartlar</h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Yalnızca test edilmiş, dünya çapında güvenilir markaların lisanslı ürünlerini kullanıyoruz.
              </p>
            </div>
            <div className="p-8 bg-white border border-border rounded-3xl space-y-4">
              <Users className="h-8 w-8 text-primary-600" />
              <h3 className="text-xl font-bold text-ink">Uzman Mühendislik</h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Saha keşfi ve projelendirme süreçlerimizi profesyonel teknik ekibimizle titizlikle yönetiyoruz.
              </p>
            </div>
            <div className="p-8 bg-white border border-border rounded-3xl space-y-4">
              <Building className="h-8 w-8 text-primary-600" />
              <h3 className="text-xl font-bold text-ink">Sürdürülebilir Destek</h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Kurulum sonrasında periyodik bakım, arıza ve sistem genişletme süreçlerinde hep yanınızdayız.
              </p>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

function ContactForm() {
  return (
    <form action="/api/lead" method="post" className="mt-8 space-y-4 border-t border-border pt-6">
      <input type="hidden" name="source" value="contact" />
      <input name="company" className="hidden" tabIndex={-1} autoComplete="off" />
      <h3 className="text-lg font-bold text-ink mb-1">Keşif & Teklif Formu</h3>
      
      {["Ad Soyad", "Telefon", "Şehir"].map((label) => (
        <label key={label} className="block">
          <span className="sr-only">{label}</span>
          <input
            name={label === "Ad Soyad" ? "name" : label === "Telefon" ? "phone" : "city"}
            required
            placeholder={label}
            className="h-12 w-full rounded-xl border border-border bg-white text-ink placeholder-ink-lighter px-4 outline-none focus:border-primary-600 focus:bg-white transition-colors"
          />
        </label>
      ))}
      <label className="flex gap-3 text-sm leading-6 text-ink-muted">
        <input required name="kvkkConsent" type="checkbox" className="mt-1 h-5 w-5 shrink-0 rounded border-border" />
        <span>KVKK kapsamında iletişime geçilmesini kabul ediyorum.</span>
      </label>
      <button className="h-12 w-full rounded-xl bg-primary-600 text-white font-extrabold hover:bg-primary-500 transition-colors">
        Bilgilerimi Gönder
      </button>
    </form>
  );
}
