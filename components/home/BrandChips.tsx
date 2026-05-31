import { brands } from "@/data/products";

const logoStyles: Record<string, string> = {
  Hikvision: "tracking-[-0.08em] font-black",
  Dahua: "tracking-[0.02em] font-black",
  TTEC: "tracking-[0.18em] font-black",
  UNV: "tracking-[0.22em] font-black",
  Xmeye: "tracking-[-0.04em] font-extrabold",
  Reolink: "tracking-[-0.05em] font-black",
  Inox: "tracking-[0.08em] font-black",
  Paradox: "tracking-[0.02em] font-black",
  DSC: "tracking-[0.18em] font-black",
  Teknim: "tracking-[0.02em] font-black",
  Ajax: "tracking-[0.08em] font-black",
};

export function BrandChips() {
  const marqueeBrands = [...brands, ...brands];

  return (
    <section className="overflow-hidden bg-surface py-10">
      <div className="container-primesec">
        <h2 className="text-center text-[15px] font-extrabold uppercase tracking-[0.14em] text-ink">Güvenilir Markalar, Kaliteli Çözümler</h2>
        <div className="relative mt-8 overflow-hidden border-y border-border py-5 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-[brand-marquee_34s_linear_infinite] items-center gap-4 hover:[animation-play-state:paused]">
            {marqueeBrands.map((brand, index) => (
              <BrandLogo key={`${brand}-${index}`} brand={brand} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandLogo({ brand }: { brand: string }) {
  return (
    <div className="flex h-16 w-[168px] shrink-0 items-center justify-center rounded-xl border border-border bg-white px-5 grayscale hover:grayscale-0 transition-all">
      <div className="flex items-center gap-3 text-[#111827]">
        <span className="relative flex h-8 w-8 items-center justify-center">
          <span className="absolute inset-0 rotate-45 rounded-[7px] border-2 border-current opacity-80" />
          <span className="h-3.5 w-3.5 rounded-sm bg-current opacity-90" />
        </span>
        <span className={`text-[20px] leading-none ${logoStyles[brand] ?? "font-black"}`}>{brand}</span>
      </div>
    </div>
  );
}
