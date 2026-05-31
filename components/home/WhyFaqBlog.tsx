"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronRight, HelpCircle, Plus, Wrench, Shield, HeartHandshake, BadgePercent, Cpu } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { homeFaqs } from "@/data/faqs";
import { blogPosts } from "@/data/blog";

const benefitsList = [
  { title: "Uzman Mühendis Kadrosu", desc: "Alanında deneyimli mühendislerimiz ile mekana en uygun teknik güvenlik planını hazırlıyoruz.", icon: Cpu },
  { title: "En Yeni Teknoloji Ürünler", desc: "Dünya standartlarında, akıllı ve mobil uyumlu yeni nesil güvenlik donanımları kullanıyoruz.", icon: Shield },
  { title: "Anahtar Teslim Çözümler", desc: "Keşiften kablolamaya, montajdan mobil kuruluma kadar tüm süreçleri üstleniyoruz.", icon: Wrench },
  { title: "Uygun Fiyat, Yüksek Kalite", desc: "Maliyeti optimize ederken güvenlik ve ekipman standartlarından asla ödün vermiyoruz.", icon: BadgePercent },
  { title: "Satış Sonrası Destek", desc: "7/24 kesintisiz teknik destek, arıza müdahale ve periyodik bakım hizmeti sunuyoruz.", icon: HeartHandshake },
];

export function WhyFaqBlog() {
  const [openFaq, setOpenFaq] = useState(0);
  const posts = blogPosts.slice(0, 3);

  return (
    <>
      {/* SECTION 1: Neden PrimeSec */}
      <section className="bg-[#030D21] py-16 relative overflow-hidden text-white">
        <div className="absolute inset-0 z-0 pointer-events-none">
           <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(0,107,255,0.12),transparent_70%)] blur-[70px]" />
        </div>
        <div className="container-primesec relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-cyan-400">Neden Biz?</p>
            <h2 className="mt-3 text-[clamp(30px,3.2vw,48px)] font-extrabold leading-none tracking-[-0.045em] text-white">Neden PrimeSec Teknoloji?</h2>
            <p className="mt-4 text-sm leading-7 text-white/70">Güvenlik sistemlerini sadece cihaz montajı olarak değil, uzun vadeli bir yaşam ve iş alanı koruma mimarisi olarak görüyoruz.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {benefitsList.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-white p-6 hover:border-primary-300 transition-all">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-primary-600">
                  <item.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-[17px] font-extrabold text-ink leading-tight">{item.title}</h3>
                <p className="mt-3 text-xs leading-5 text-ink-muted">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <ButtonLink href="/hakkimizda" className="rounded-full px-8 bg-white text-[#030D21] font-bold hover:bg-white">Hakkımızda Daha Fazla Bilgi</ButtonLink>
          </div>
        </div>
      </section>

      {/* SECTION 2: Sıkça Sorulan Sorular */}
      <section className="bg-[#FFFFFF] py-16">
        <div className="container-primesec grid gap-10 xl:grid-cols-12 xl:items-start">
          <div className="xl:col-span-5">
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-primary-600">SSS</p>
            <h2 className="mt-3 text-[clamp(30px,3.2vw,46px)] font-extrabold leading-tight tracking-[-0.045em] text-ink">Sıkça Sorulan Sorular</h2>
            <p className="mt-4 leading-7 text-ink-muted">Kamera ve alarm sistemlerimizin özellikleri, kurulum süreleri ve destek süreçlerimiz hakkında en çok merak edilen konuları derledik.</p>
            <div className="mt-8 flex gap-4 rounded-2xl border border-border bg-[#FFFFFF] p-6">
              <HelpCircle className="h-8 w-8 text-primary-600 shrink-0" />
              <div>
                <h4 className="font-extrabold text-ink">Aradığınız yanıtı bulamadınız mı?</h4>
                <p className="mt-1 text-xs leading-5 text-ink-muted">Aklınıza takılan her türlü soru için uzman danışmanımızla anında iletişime geçebilirsiniz.</p>
                <Link href="/iletisim" className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold text-primary-600 hover:text-primary-700 transition-colors">Bize Ulaşın <ChevronRight className="h-3 w-3" /></Link>
              </div>
            </div>
          </div>

          <div className="xl:col-span-7 space-y-3">
            {homeFaqs.map((faq, index) => (
              <div key={faq.question} className="rounded-xl border border-border bg-[#FFFFFF]">
                <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between gap-4 p-5 text-left text-[16px] font-extrabold text-ink">
                  {faq.question}
                  <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-[#FFFFFF] text-primary-600 duration-200", openFaq === index ? "rotate-45" : "")}>
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
      </section>

      {/* SECTION 3: Son Blog Yazıları */}
      <section className="bg-white py-16">
        <div className="container-primesec">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-primary-600">Rehberler & Blog</p>
              <h2 className="mt-3 text-[clamp(30px,3.2vw,46px)] font-extrabold leading-none tracking-[-0.045em] text-ink">Güncel güvenlik ipuçları</h2>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-extrabold text-primary-600 hover:text-primary-700 transition-colors">
              Tümünü Gör <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white">
                <div className="relative h-48 w-full bg-white flex items-center justify-center">
                  <Image src={post.image} alt={post.date} fill className="object-contain p-6" unoptimized />
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <p className="text-xs font-bold text-ink-muted">{post.category} · {new Date(post.date).toLocaleDateString("tr-TR")}</p>
                    <h3 className="mt-3 text-lg font-extrabold leading-tight text-ink group-hover:text-primary-600 transition-colors">{post.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-muted">{post.description}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 pt-4 border-t border-border">
                    <span className="text-xs font-extrabold text-primary-600 group-hover:text-primary-700 transition-colors">Oku</span>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-primary-600">
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
