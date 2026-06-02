"use client";

import { useState, useEffect } from "react";
import { Plus, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { homeFaqs } from "@/data/faqs";
import { blogPosts } from "@/data/blog";
import { whatsappUrl } from "@/lib/whatsapp";

export function FaqBlog() {
  const [openFaq, setOpenFaq] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const itemsPerView = isMobile ? 1 : 3;
  const maxIndex = blogPosts.length - itemsPerView;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Autoplay effect
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [maxIndex]);

  return (
    <>
      {/* FAQ Section */}
      <section className="bg-white py-16 md:py-24">
        <Container>
          <div className="grid gap-10 xl:grid-cols-12 xl:items-start">
            <div className="xl:col-span-5">
              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-cyan-500">SSS</p>
              <h2 className="mt-3 text-[clamp(30px,3.2vw,46px)] font-extrabold leading-tight tracking-[-0.045em] text-ink">
                Sıkça Sorulan Sorular
              </h2>
              <p className="mt-4 leading-7 text-ink-muted">
                Kamera ve alarm sistemlerimizin özellikleri, kurulum süreleri ve destek süreçlerimiz hakkında en çok merak edilen konuları derledik.
              </p>
              <div className="mt-8 rounded-2xl border border-border bg-white/50 p-6 text-center transition-colors duration-200 md:hover:border-cyan-500">
                <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center gap-4">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl font-black text-cyan-500 shrink-0">?</span>
                    <p className="font-bold text-ink">Başka sorunuz mu var?</p>
                  </div>
                  <ButtonLink
                     href={whatsappUrl("Merhaba, sormak istediğim soru var...")}
                    variant="whatsapp"
                    className="w-full justify-center rounded-xl px-5 py-2.5 text-sm font-extrabold shadow-md md:hover:shadow-lg"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp'tan Sorun <ChevronRight className="h-4 w-4" />
                  </ButtonLink>
                </div>
              </div>
            </div>

            <div className="xl:col-span-7 space-y-3">
              {homeFaqs.map((faq, index) => (
                <div key={faq.question} className="rounded-xl border border-border md:hover:border-cyan-500 transition-colors duration-200 bg-white">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left text-[16px] font-extrabold text-ink"
                  >
                    {faq.question}
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-white text-cyan-500 duration-200",
                        openFaq === index ? "rotate-45" : ""
                      )}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                  {openFaq === index ? (
                    <div className="px-5 pb-5 border-t border-border pt-3">
                      <p className="text-sm leading-6 text-ink-muted">{faq.answer}</p>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Blog Section */}
      <section className="bg-surface py-16 md:py-24 overflow-hidden">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-cyan-500">Blog</p>
              <h2 className="mt-3 text-[clamp(30px,3.2vw,48px)] font-extrabold leading-none tracking-[-0.045em] text-ink">
                Güvenlik Makaleleri
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white md:hover:bg-cyan-500 transition-colors duration-200 shadow-sm"
                aria-label="Önceki Yazı"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white md:hover:bg-cyan-500 transition-colors duration-200 shadow-sm"
                aria-label="Sonraki Yazı"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden -mx-3 pt-4 pb-4">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {blogPosts.map((post) => (
                <div
                  key={post.slug}
                  className="w-full md:w-1/3 shrink-0 px-3"
                >
                  <a
                    href={`/blog/${post.slug}`}
                    className="group flex w-full flex-col overflow-hidden rounded-[24px] border border-white bg-white p-4 transition md:hover:-translate-y-1 md:hover:border-cyan-500"
                  >
                    <div className="relative h-48 w-full overflow-hidden rounded-[20px] bg-slate-50 flex items-center justify-center p-4">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-contain transition-transform duration-500 md:group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between pt-4">
                      <div>
                        <p className="text-xs font-bold text-ink-muted">{post.category}</p>
                        <h3 className="mt-2 line-clamp-2 min-h-[44px] text-[15px] font-extrabold leading-tight text-ink md:group-hover:text-cyan-500">
                          {post.title}
                        </h3>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="text-xs font-extrabold text-primary-600 transition md:group-hover:text-cyan-500">Oku</span>
                        <span className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-primary-600 shadow-sm md:group-hover:bg-cyan-500 md:group-hover:text-white transition-colors duration-300">
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <ButtonLink href="/blog" className="rounded-full px-8 py-3 w-full sm:w-auto justify-center">
              Tüm Yazılar <ChevronRight className="h-4 w-4 ml-1" />
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
