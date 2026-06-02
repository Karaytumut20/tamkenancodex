"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Briefcase, Building2, Check, Home, Info, Lock, Phone, ShieldCheck, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import type { InputHTMLAttributes, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { products } from "@/data/products";
import { cn } from "@/lib/cn";

const leadSchema = z.object({
  name: z.string().min(3, "Ad soyad zorunlu"),
  phone: z.string().min(10, "Telefon zorunlu"),
  city: z.string().min(2, "Şehir zorunlu"),
  kvkkConsent: z.boolean().refine((value) => value, "KVKK onayı zorunlu"),
  marketingConsent: z.boolean().optional(),
});

type LeadForm = z.infer<typeof leadSchema>;

const homeFloors = ["Bodrum Kat", "Zemin Kat", "Bahçe Katı", "Ara Kat", "Müstakil", "Çatı Katı"];
const businessTypes = ["Dükkân", "Müstakil", "Apartman Dairesi", "Depo", "Diğer"];
const homeReasons = ["Yaşadığım bölgede hırsızlık yaygın", "Evim uzun süre boş kalıyor", "İçim rahat etsin istiyorum", "Taşınıyorum", "Küçük çocuğum var", "Diğer"];
const businessReasons = ["İş yerimin bulunduğu bölgede hırsızlık yaygın", "İş yerim uzun süre boş kalıyor", "İçim rahat etsin istiyorum", "Taşınıyorum", "Diğer"];
const smartProducts = ["Akıllı Priz", "Akıllı Kilit", "Akıllı Termostat", "Akıllı Termostatik Vana", "Akıllı Aydınlatma"];
const extraProducts = ["Su Baskını Alarmı", "Karbonmonoksit Gaz Dedektörü", "Yangın Alarmı", "Cam Kırılma Dedektörü", "Panik Butonu"];

export function SystemBuilder() {
  const [step, setStep] = useState(1);
  const [area, setArea] = useState<"Evimi" | "İş Yerimi" | "">("");
  const [floor, setFloor] = useState("");
  const [reason, setReason] = useState("");
  const wizardRef = useRef<HTMLDivElement>(null);
  const hasMounted = useRef(false);
  const recommended = area === "İş Yerimi" ? ["PrimeSec Plus", "Akıllı Video", "Akıllı Zil"] : ["PrimeSec Plus", "Su Baskını Alarmı", "Akıllı Video", "Akıllı Zil"];
  const [selectedProducts, setSelectedProducts] = useState<string[]>(recommended);
  const form = useForm<LeadForm>({ resolver: zodResolver(leadSchema), defaultValues: { name: "", phone: "", city: "", kvkkConsent: false, marketingConsent: false } });

  const canContinue = step === 1 ? Boolean(area) : step === 2 ? Boolean(floor) : step === 3 ? Boolean(reason) : true;
  const final = step === 5;

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (step <= 4) {
      wizardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  function next() {
    if (!canContinue) return;
    setStep((value) => Math.min(5, value + 1));
  }

  function toggleProduct(name: string) {
    setSelectedProducts((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  }

  async function submit(values: LeadForm) {
    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "system-builder",
        ...values,
        selectedArea: area,
        selectedFloorOrBusinessType: floor,
        selectedReason: reason,
        selectedProducts,
        pageUrl: window.location.href,
        createdAt: new Date().toISOString(),
      }),
    });
    setStep(6);
  }

  if (final || step === 6) {
    return (
      <FinalOffer
        submitted={step === 6}
        area={area}
        floor={floor}
        reason={reason}
        selectedProducts={selectedProducts}
        onBack={() => setStep(4)}
        form={form}
        onSubmit={submit}
      />
    );
  }

  return (
    <section className="bg-surface py-6 md:py-10">
      <div className="container-primesec">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px] xl:items-start">
          <div ref={wizardRef} className="scroll-mt-24 rounded-[24px] border border-border bg-white p-5 md:p-8">
            <Stepper step={step} />
            <div className="min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.2 }}>
                  {step === 1 ? (
                    <StepBlock title="Alarm sisteminle nereyi korumak istersin?">
                      <div className="grid gap-4 md:grid-cols-2">
                        <SelectionCard title="Evimi" description="Daire, villa, yazlık ve yaşam alanları" selected={area === "Evimi"} onClick={() => { setArea("Evimi"); setFloor(""); setReason(""); setSelectedProducts(["PrimeSec Plus", "Su Baskını Alarmı", "Akıllı Video", "Akıllı Zil"]); }} icon={<Home className="h-8 w-8" />} image="/images/local-security.svg" />
                        <SelectionCard title="İş Yerimi" description="Mağaza, ofis, depo ve ticari alanlar" selected={area === "İş Yerimi"} onClick={() => { setArea("İş Yerimi"); setFloor(""); setReason(""); setSelectedProducts(["PrimeSec Plus", "Akıllı Video", "Akıllı Zil"]); }} icon={<Briefcase className="h-8 w-8" />} image="/images/network.svg" />
                      </div>
                    </StepBlock>
                  ) : null}
                  {step === 2 ? (
                    <StepBlock title={area === "İş Yerimi" ? "İş yerinin bulunduğu alan türü nedir?" : "Evinin bulunduğu kat nedir?"}>
                      <OptionGrid options={area === "İş Yerimi" ? businessTypes : homeFloors} selected={floor} onSelect={setFloor} />
                    </StepBlock>
                  ) : null}
                  {step === 3 ? (
                    <StepBlock title="Neden alarm sistemine ihtiyaç duyuyorsun?">
                      <ReasonGrid options={area === "İş Yerimi" ? businessReasons : homeReasons} selected={reason} onSelect={setReason} />
                    </StepBlock>
                  ) : null}
                  {step === 4 ? (
                    <StepBlock title="Paketine hangi ürünleri eklemek istersin?">
                      <div className="mb-6 rounded-2xl border border-primary-500/20 bg-white p-5 text-sm leading-7 text-ink-muted">
                        {area === "İş Yerimi"
                          ? "Uzun süre kapalı kalan iş yerleri güvenlik riski oluşturabilir. PrimeSec Plus kameralı alarm sistemiyle iş yerini uzaktan izleyebilir, akıllı zil ile kapına gelenleri takip edebilir ve alarm sistemini mobil cihazından yönetebilirsin."
                          : "Bahçe katları ve girişe açık evler hırsızlık ve su baskınına karşı daha hassas olabilir. PrimeSec Plus ile alarmı uzaktan kontrol edebilir, hareketleri anlık takip edip kameralarla evini 7/24 izleyebilirsin."}
                      </div>
                      <ProductSection title="Önerilen alarm paketi" badge="En Popüler" products={recommended} selected={selectedProducts} onToggle={toggleProduct} />
                      <ProductSection title="Akıllı güvenlik ve konfor ürünleri" products={smartProducts} selected={selectedProducts} onToggle={toggleProduct} />
                      <ProductSection title="Ek güvenlik çözümleri" products={extraProducts} selected={selectedProducts} onToggle={toggleProduct} />
                    </StepBlock>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
              <Button variant="outlineBlue" disabled={step === 1} onClick={() => setStep((value) => Math.max(1, value - 1))}>
                <ArrowLeft className="h-4 w-4" /> Geri
              </Button>
              <Button disabled={!canContinue} onClick={step === 4 ? () => setStep(5) : next} className={!canContinue ? "opacity-50" : ""}>
                {step === 4 ? "Teklifimi Hazırla" : "Devam Et"} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <SummaryCard area={area} floor={floor} reason={reason} products={selectedProducts} />
        </div>
      </div>
    </section>
  );
}

function Stepper({ step }: { step: number }) {
  const labels = ["Alan", "Mekan", "İhtiyaç", "Ürünler"];
  const currentStep = Math.min(step, labels.length);

  return (
    <div className="mb-8">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary-600">Adım {currentStep} / {labels.length}</p>
          <p className="mt-1 text-sm font-semibold text-ink-muted">Seçim yaptıkça paket özeti güncellenir.</p>
        </div>
        <span className="rounded-full bg-surface px-4 py-2 text-sm font-extrabold text-ink">{labels[currentStep - 1]}</span>
      </div>

      <div className="relative grid grid-cols-4 gap-2">
        <div className="absolute left-[12.5%] right-[12.5%] top-4 h-0.5 bg-border">
          <div className="h-full primesec-navy-action duration-300" style={{ width: `${((currentStep - 1) / (labels.length - 1)) * 100}%` }} />
        </div>
        {labels.map((label, index) => {
          const active = currentStep >= index + 1;
          const current = currentStep === index + 1;
          return (
            <div key={label} className="relative z-10 flex min-w-0 flex-col items-center text-center">
              <span className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-extrabold duration-300",
                active ? "border-primary-600 primesec-navy-action text-white" : "border-border bg-surface text-ink-muted",
                current ? "ring-4 ring-primary-600/10" : ""
              )}>
                {index + 1}
              </span>
              <span className={cn(
                "mt-2 block truncate text-xs font-extrabold duration-300 md:text-sm",
                active ? "text-primary-600" : "text-ink-muted"
              )}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}



function StepBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="mb-5 text-2xl font-extrabold leading-tight tracking-[-0.02em] text-ink md:text-3xl">{title}</h2>
      {children}
    </div>
  );
}

function SelectionCard({ title, description, selected, onClick, icon, image }: { title: string; description: string; selected: boolean; onClick: () => void; icon: ReactNode; image: string }) {
  return (
    <button onClick={onClick} className={cn("relative flex min-h-[168px] items-center gap-5 rounded-2xl border-2 bg-surface p-5 text-left", selected ? "border-primary-600 bg-white" : "border-border hover:border-primary-200 hover:bg-white transition-colors")}>
      {selected ? <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full primesec-navy-action text-white"><Check className="h-4 w-4" /></span> : null}
      <span className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white border border-border">
        <Image src={image} alt="" fill className="object-contain p-3" unoptimized />
        <span className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl primesec-navy-action text-white">{icon}</span>
      </span>
      <span>
        <span className="block text-xl font-extrabold text-ink">{title}</span>
        <span className="mt-2 block text-sm leading-6 text-ink-muted">{description}</span>
      </span>
    </button>
  );
}

function OptionGrid({ options, selected, onSelect }: { options: string[]; selected: string; onSelect: (value: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {options.map((option) => (
        <button key={option} onClick={() => onSelect(option)} className={cn("relative flex min-h-[118px] flex-col items-center justify-between gap-3 rounded-xl border-2 bg-white p-4 font-extrabold text-ink transition-colors", selected === option ? "border-primary-600 bg-white" : "border-border hover:border-primary-200 hover:bg-surface")}>
          {selected === option ? <Check className="absolute right-2 top-2 h-4 w-4 text-primary-600" /> : null}
          <div className="flex flex-1 items-center justify-center">
            <Building2 className="h-8 w-8 text-primary-600" />
          </div>
          <span className="text-center text-xs leading-4">{option}</span>
        </button>
      ))}
    </div>
  );
}

function ReasonGrid({ options, selected, onSelect }: { options: string[]; selected: string; onSelect: (value: string) => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {options.map((option) => (
        <button key={option} onClick={() => onSelect(option)} className={cn("relative flex min-h-[96px] items-center gap-4 rounded-xl border-2 bg-white p-4 text-left font-bold text-ink transition-colors", selected === option ? "border-primary-600 bg-white" : "border-border hover:border-primary-200 hover:bg-surface")}>
          {selected === option ? <Check className="absolute right-3 top-3 h-4 w-4 text-primary-600" /> : null}
          <Info className="h-8 w-8 shrink-0 text-primary-600" />
          {option}
        </button>
      ))}
    </div>
  );
}

function ProductSection({ title, badge, products: items, selected, onToggle }: { title: string; badge?: string; products: string[]; selected: string[]; onToggle: (value: string) => void }) {
  return (
    <div className="mb-8">
      <h3 className="mb-3 flex flex-wrap items-center gap-2 text-lg font-extrabold text-ink">
        {title}
        {badge ? <span className="rounded-full bg-orange-500 px-3 py-1 text-xs text-white">{badge}</span> : null}
      </h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => {
          const product = products.find((entry) => entry.name.includes(item) || item.includes(entry.name.split(" ")[0]));
          const active = selected.includes(item);
          return (
            <button key={item} onClick={() => onToggle(item)} className={cn("relative flex min-h-[148px] flex-col items-center justify-between gap-3 rounded-xl border-2 bg-white p-4   ", active ? "border-primary-500 bg-white" : "border-border")}>
              <span className={cn("absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded border", active ? "border-primary-600 primesec-navy-action text-white" : "border-border-strong bg-white")}>{active ? <Check className="h-3 w-3" /> : null}</span>
              <div className="flex flex-1 items-center justify-center pt-2">
                <span className="relative h-14 w-14 block">
                  <Image src={product?.image ?? "/images/alarm-sistemi.svg"} alt={`${item} ürün görseli`} fill className="object-contain" unoptimized />
                </span>
              </div>
              <span className="text-center text-xs font-extrabold leading-4 text-ink">{item}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SummaryCard({ area, floor, reason, products }: { area: string; floor: string; reason: string; products: string[] }) {
  return (
    <aside className="h-fit rounded-[24px] border border-border bg-white p-6 xl:sticky xl:top-24">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary-600">Canlı plan</p>
          <h2 className="mt-1 text-2xl font-extrabold text-ink">Paket özeti</h2>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface text-primary-600 border border-border">
          <ShieldCheck className="h-6 w-6" />
        </span>
      </div>
      <div className="mt-6 space-y-3">
        <SummaryRow label="Korunan Alan" value={area || "Seçim bekleniyor"} />
        <SummaryRow label={area === "İş Yerimi" ? "Alan Bilgisi" : "Kat Bilgisi"} value={floor || "Seçim bekleniyor"} />
        <SummaryRow label="İhtiyaç Nedeni" value={reason || "Seçim bekleniyor"} />
      </div>
      <div className="mt-6 rounded-2xl border border-border bg-surface p-4">
        <p className="text-sm font-extrabold text-ink">Seçili ürünler ({products.length})</p>
        <div className="mt-3 space-y-2.5">
          {products.slice(0, 5).map((product) => (
            <div key={product} className="flex items-center gap-2 text-sm font-semibold text-ink-muted">
              <Check className="h-4 w-4 text-primary-600" /> {product}
            </div>
          ))}
          {products.length > 5 ? <p className="text-xs font-bold text-primary-600">+{products.length - 5} ürün daha</p> : null}
        </div>
      </div>
      <div className="mt-6 border-t border-border pt-5">
        <p className="text-sm text-ink-muted">Temsili paket değeri</p>
        <p className="text-3xl font-extrabold text-ink">₺24.990</p>
        <p className="text-xs text-ink-muted">KDV dahil, nihai teklif keşif sonrası netleşir.</p>
      </div>
      <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-ink-muted">
        <Lock className="h-4 w-4 text-primary-600" /> Bilgilerin güvende. 256-bit SSL ile korunur.
      </div>
    </aside>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <p className="text-xs font-extrabold uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="mt-1 font-extrabold text-ink">{value}</p>
    </div>
  );
}

function FinalOffer({ submitted, area, floor, reason, selectedProducts, onBack, form, onSubmit }: { submitted: boolean; area: string; floor: string; reason: string; selectedProducts: string[]; onBack: () => void; form: ReturnType<typeof useForm<LeadForm>>; onSubmit: (values: LeadForm) => void }) {
  return (
    <section className="bg-surface min-h-screen py-12 text-ink">
      <div className="container-primesec">
        <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-ink-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Seçimlere dön
        </button>
        <div className="grid gap-9 xl:grid-cols-12 xl:items-end">
          <div className="xl:col-span-7">
            <h1 className="text-[clamp(44px,5vw,72px)] font-extrabold leading-none tracking-[-0.045em] text-ink">Son Adımdayız!</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-ink-muted">Değerli bilgilerinizi bizimle paylaştığınız için teşekkür ederiz. Şimdi PrimeSec uzman ekibimiz sizi arayarak tüm detayları netleştirecek ve size özel en iyi teklifi sunacak.</p>
          </div>
          <div className="relative hidden h-56 xl:col-span-5 xl:block">
            <Image src="/images/local-security.svg" alt="PrimeSec mavi neon bina güvenliği görseli" fill className="object-contain opacity-80" unoptimized />
          </div>
        </div>
        <div className="mt-10 grid gap-7 xl:grid-cols-12">
          <div className="rounded-[28px] border border-border bg-white p-6 md:p-8 xl:col-span-6">
            {submitted ? (
              <div className="rounded-2xl border border-border bg-surface p-8 text-center">
                <ShieldCheck className="mx-auto h-12 w-12 text-primary-600" />
                <h2 className="mt-4 text-3xl font-extrabold">Talebiniz alındı</h2>
                <p className="mt-3 text-ink-muted">PrimeSec ekibi en kısa sürede sizinle iletişime geçecek.</p>
              </div>
            ) : (
              <>
                <div className="rounded-[18px] border border-border bg-surface p-6 text-center">
                  <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-primary-600">Özel Teklifiniz</p>
                  <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.035em] text-ink">İlk 2 Ay %50 İndirim! <span className="text-primary-600">PrimeSec Plus</span></h2>
                  <div className="mt-5 flex items-center gap-4 rounded-2xl border border-border bg-white p-4 text-left">
                    <ShieldCheck className="h-10 w-10 shrink-0 text-primary-600" />
                    <p className="text-sm leading-6 text-ink-muted"><strong className="text-ink">Tebrikler!</strong> Bu teklifimize özel 1 adet manyetik kontak hediye.</p>
                  </div>
                  <p className="mt-4 text-xs text-ink-muted">*Teklif 11 Haziran 2026 tarihine kadar geçerlidir.</p>
                </div>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 space-y-4">
                  <h3 className="text-2xl font-extrabold text-ink">Sizinle İletişime Geçelim</h3>
                  <DarkInput label="Ad Soyad" error={form.formState.errors.name?.message} {...form.register("name")} />
                  <DarkInput label="Telefon" error={form.formState.errors.phone?.message} {...form.register("phone")} />
                  <DarkInput label="Şehir" error={form.formState.errors.city?.message} {...form.register("city")} />
                  <label className="flex gap-3 text-sm leading-6 text-ink-muted">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-border" {...form.register("kvkkConsent")} />
                    KVKK metnini okudum, kişisel verilerimin teklif amacıyla işlenmesini kabul ediyorum.
                  </label>
                  {form.formState.errors.kvkkConsent ? <p className="text-sm text-red-500">{form.formState.errors.kvkkConsent.message}</p> : null}
                  <label className="flex gap-3 text-sm leading-6 text-ink-muted">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-border" {...form.register("marketingConsent")} />
                    Kampanya ve bilgilendirme iletişimi almak istiyorum.
                  </label>
                  <div className="rounded-xl border border-border bg-surface p-4 text-sm text-ink-muted">
                    Bilgileriniz güvenle saklanır ve yalnızca teklif süreci için kullanılır.
                  </div>
                  <Button size="xl" className="w-full text-xl">
                    <Phone className="h-5 w-5" /> Beni Arayın <ArrowRight className="h-5 w-5" />
                  </Button>
                </form>
              </>
            )}
          </div>
          <div className="rounded-[24px] border border-border bg-white p-6 md:p-8 xl:col-span-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-extrabold text-ink">Seçtiğiniz {area === "İş Yerimi" ? "İş Yeri" : "Ev"} Paketi</h2>
              <span className="rounded-full border border-primary-200 bg-white px-4 py-2 text-sm font-extrabold text-primary-600">PrimeSec Plus</span>
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border border-border">
              {selectedProducts.map((item) => {
                const product = products.find((entry) => entry.name.includes(item) || item.includes(entry.name.split(" ")[0]));
                const imageSrc = product?.image ?? "/images/alarm-sistemi.svg";
                return (
                  <div key={item} className="grid min-h-[72px] grid-cols-[56px_1fr_auto] items-center gap-3 border-b border-border bg-white px-4 last:border-b-0">
                    <span className="relative h-11 w-11 rounded-lg bg-surface border border-border">
                      <Image src={imageSrc} alt="" fill className="object-contain p-2" unoptimized />
                    </span>
                    <span className="font-extrabold text-ink">{item}</span>
                    <span className="font-bold text-ink-muted">x 1</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
              <h3 className="text-2xl font-extrabold text-primary-600">{area === "İş Yerimi" ? "İş yeriniz her zaman güvende olsun" : "Eviniz her zaman güvende olsun"}</h3>
              <p className="mt-3 leading-7 text-ink-muted">{floor} ve “{reason}” seçiminize göre alarm, akıllı video ve mobil bildirim odaklı bir paket öneriyoruz.</p>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {["Uzaktan İzleme", "Anında Bildirim", "7/24 Koruma"].map((item) => (
                <div key={item} className="rounded-xl border border-border bg-white p-4">
                  <SlidersHorizontal className="h-5 w-5 text-primary-600" />
                  <p className="mt-3 font-extrabold text-ink">{item}</p>
                  <p className="mt-1 text-sm text-ink-muted">PrimeSec Plus</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DarkInput({ label, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input aria-label={label} placeholder={label} className="h-[58px] w-full rounded-xl border border-border bg-surface px-4 text-ink placeholder:text-ink-lighter outline-none focus:border-primary-600 focus:bg-white transition-colors" {...props} />
      {error ? <span className="mt-1 block text-sm text-red-500">{error}</span> : null}
    </label>
  );
}
