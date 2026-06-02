"use client";

import { useState, useRef, useEffect, type PointerEvent } from "react";
import { Plus, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { homeFaqs } from "@/data/faqs";
import { blogPosts } from "@/data/blog";
import { whatsappUrl } from "@/lib/whatsapp";

export function FaqBlog() {
  const [openFaq, setOpenFaq] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const blogScrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });

  function handleBlogPointerDown(event: PointerEvent<HTMLDivElement>) {
    const node = blogScrollerRef.current;
    if (!node) return;
    drag.current = { active: true, startX: event.clientX, scrollLeft: node.scrollLeft, moved: false };
    setIsDragging(true);
    node.setPointerCapture(event.pointerId);
  }

  function handleBlogPointerMove(event: PointerEvent<HTMLDivElement>) {
    const node = blogScrollerRef.current;
    if (!node || !drag.current.active) return;
    const delta = event.clientX - drag.current.startX;
    if (Math.abs(delta) > 6) drag.current.moved = true;
    node.scrollLeft = drag.current.scrollLeft - delta;
  }

  function finishBlogDrag(event: PointerEvent<HTMLDivElement>) {
    const node = blogScrollerRef.current;
    if (!node || !drag.current.active) return;
    drag.current.active = false;
    setIsDragging(false);
    node.releasePointerCapture(event.pointerId);
  }

  return (
    <>
      {/* FAQ Section */}
      <section className="bg-white py-16 md:py-24">
        <Container>
          <div className="grid gap-10 xl:grid-cols-12 xl:items-start">
            <div className="xl:col-span-5">
              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-primary-600">SSS</p>
              <h2 className="mt-3 text-[clamp(30px,3.2vw,46px)] font-extrabold leading-tight tracking-[-0.045em] text-ink">
                Sıkça Sorulan Sorular
              </h2>
              <p className="mt-4 leading-7 text-ink-muted">
                Kamera ve alarm sistemlerimizin özellikleri, kurulum süreleri ve destek süreçlerimiz hakkında en çok merak edilen konuları derledik.
              </p>
              <div className="mt-8 flex gap-4 rounded-2xl border border-border hover:border-primary-600 transition-colors duration-200 bg-white/50 p-6">
                <span className="text-3xl font-black text-primary-600">?</span>
                <div>
                  <p className="font-bold text-ink">Başka sorunuz mu var?</p>
                  <ButtonLink href={whatsappUrl("Merhaba, sormak istediğim soru var...")} className="mt-2 text-primary-600 hover:text-primary-500">
                    WhatsApp'tan Sorgulay <ChevronRight className="h-4 w-4 inline" />
                  </ButtonLink>
                </div>
              </div>
            </div>

            <div className="xl:col-span-7 space-y-3">
              {homeFaqs.map((faq, index) => (
                <div key={faq.question} className="rounded-xl border border-border hover:border-primary-600 transition-colors duration-200 bg-white">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left text-[16px] font-extrabold text-ink"
                  >
                    {faq.question}
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-white text-primary-600 duration-200",
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
      <section className="bg-surface py-16 md:py-24">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-primary-600">Blog</p>
              <h2 className="mt-3 text-[clamp(30px,3.2vw,48px)] font-extrabold leading-none tracking-[-0.045em] text-ink">
                Güvenlik Makaleleri
              </h2>
            </div>
            <ButtonLink href="/blog" className="hidden md:inline-flex rounded-full">
              Tüm Yazılar <ChevronRight className="h-4 w-4" />
            </ButtonLink>
          </div>

          <div
            ref={blogScrollerRef}
            onPointerDown={handleBlogPointerDown}
            onPointerMove={handleBlogPointerMove}
            onPointerUp={finishBlogDrag}
            onPointerCancel={finishBlogDrag}
            className={cn(
              "flex cursor-grab gap-5 overflow-x-auto pb-4 active:cursor-grabbing [&::-webkit-scrollbar]:hidden",
              isDragging ? "snap-none" : "snap-x snap-mandatory"
            )}
          >
            {blogPosts.map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                onClick={(e) => {
                  if (drag.current.moved) e.preventDefault();
                }}
                className="group flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-[24px] border border-white bg-white p-4 shadow-[0_18px_55px_rgba(15,23,42,0.06)] transition hover:-translate-y-1"
              >
                <div className="relative h-40 w-full overflow-hidden rounded-[20px] primesec-navy-surface">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl opacity-20">{post.title.charAt(0)}</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between pt-4">
                  <div>
                    <p className="text-xs font-bold text-ink-muted">{post.category}</p>
                    <h3 className="mt-2 line-clamp-2 min-h-[44px] text-[15px] font-extrabold leading-tight text-ink group-hover:text-primary-600">
                      {post.title}
                    </h3>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-xs font-extrabold text-primary-600 transition group-hover:text-primary-500">Oku</span>
                    <span className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-primary-600 shadow-sm">
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <ButtonLink href="/blog" className="md:hidden mt-6 w-full justify-center">
            Tüm Yazıları Gör <ChevronRight className="h-4 w-4" />
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
