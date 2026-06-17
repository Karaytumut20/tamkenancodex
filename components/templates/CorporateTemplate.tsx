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
import { ContactForm } from "@/components/templates/ContactForm";
import { getSiteSettings } from "@/lib/db";

export async function CorporateTemplate({ page }: { page: CorporatePage }) {
  const settings = await getSiteSettings();
  const isContact = page.slug === "iletisim";
  const isAbout = page.slug === "hakkimizda" || page.slug === "kurumsal";
  const isPolicy = page.slug === "kvkk" || page.slug === "gizlilik-politikasi" || page.slug === "cerez-politikasi";

  if (isContact) {
    return (
      <>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: page.title,
            description: page.description,
            url: `${settings.siteUrl}/${page.slug}`,
          }}
        />
        
        <PageHero 
          title="İletişime Geçin" 
          description="Soru, görüş veya ücretsiz keşif talepleriniz için uzman ekibimizle doğrudan bağlantı kurun." 
          crumbs={[{ label: page.title, href: `/${page.slug}` }]} 
        />

        <section className="bg-slate-50/50 py-16 md:py-24 border-t border-border">
          <Container className="grid gap-10 lg:grid-cols-12">
            
            {/* Sol Taraf: İletişim Kanalları ve Temsilciler */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-black tracking-wide uppercase">
                  <Sparkles className="h-3.5 w-3.5" /> Hızlı Erişim
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                  Müşteri Temsilcilerimiz
                </h2>
                <p className="text-slate-500 text-sm md:text-base font-semibold">
                  İhtiyacınıza göre ilgili temsilcimizle arayarak veya WhatsApp üzerinden hızlıca iletişime geçebilirsiniz.
                </p>
              </div>

              {/* Temsilciler Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {(settings.representatives ?? []).map((rep) => (
                  <div key={rep.name} className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-base">{rep.name}</h4>
                        <p className="text-[11px] font-bold text-cyan-600 uppercase tracking-wider mt-0.5">{rep.role}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-2.5">
                      <a
                        href={`tel:${rep.phone.replace(/\s+/g, "")}`}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 px-4 py-3 text-xs font-bold text-slate-700 transition-colors w-full"
                      >
                        <Phone className="h-4 w-4 text-cyan-600" />
                        Arama Yap
                      </a>
                      <a
                        href={`https://wa.me/${rep.whatsapp}?text=${encodeURIComponent(
                          `Merhaba ${rep.name}, PrimeSec Teknoloji web sitenizden ulaşıyorum. Bilgi alabilir miyim?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20c35a] px-4 py-3 text-xs font-bold text-white transition-colors w-full"
                      >
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Kurumsal Detaylar */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 space-y-6 shadow-sm">
                <h3 className="font-extrabold text-slate-800 text-lg leading-tight">Genel İletişim Bilgileri</h3>
                <div className="space-y-4">
                  <a href={`tel:${settings.phone}`} className="flex items-center gap-4 group">
                    <div className="h-10 w-10 rounded-xl border border-slate-200 bg-slate-50 text-cyan-600 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Merkez Telefon</p>
                      <p className="text-sm font-extrabold text-slate-800 group-hover:text-cyan-600 transition-colors">{settings.phone}</p>
                    </div>
                  </a>

                  <a href={`mailto:${settings.email}`} className="flex items-center gap-4 group">
                    <div className="h-10 w-10 rounded-xl border border-slate-200 bg-slate-50 text-cyan-600 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">E-posta</p>
                      <p className="text-sm font-extrabold text-slate-800 group-hover:text-cyan-600 transition-colors">{settings.email}</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl border border-slate-200 bg-slate-50 text-cyan-600 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Adres</p>
                      <p className="text-sm font-extrabold text-slate-800">{settings.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ Taraf: Keşif ve Teklif Formu */}
            <div className="lg:col-span-6">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
                <ContactForm />
              </div>
            </div>

          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: page.title,
          description: page.description,
          url: `${settings.siteUrl}/${page.slug}`,
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
              <a href={`tel:${settings.phone}`} className="flex items-center gap-4 rounded-xl border border-border p-4 hover:bg-white transition-colors group">
                <div className="h-10 w-10 rounded-lg border border-border bg-white text-primary-600 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink-muted">Telefon</p>
                  <p className="text-sm font-extrabold text-ink group-hover:text-primary-600 transition-colors">{settings.phone}</p>
                </div>
              </a>

              <a href={`mailto:${settings.email}`} className="flex items-center gap-4 rounded-xl border border-border p-4 hover:bg-white transition-colors group">
                <div className="h-10 w-10 rounded-lg border border-border bg-white text-primary-600 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink-muted">E-posta</p>
                  <p className="text-sm font-extrabold text-ink group-hover:text-primary-600 transition-colors">{settings.email}</p>
                </div>
              </a>

              <div className="flex items-center gap-4 rounded-xl border border-border p-4">
                <div className="h-10 w-10 rounded-lg border border-border bg-white text-primary-600 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink-muted">Adres</p>
                  <p className="text-sm font-extrabold text-ink">{settings.address}</p>
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


