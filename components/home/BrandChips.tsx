import { getBrands, type Brand } from "@/lib/db";
import { DraggableMarquee } from "./DraggableMarquee";

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

export async function BrandChips() {
  const dynamicBrands = await getBrands();

  if (dynamicBrands.length === 0) return null;

  // 4 times duplicated to allow perfect looping in DraggableMarquee
  const marqueeBrands = [...dynamicBrands, ...dynamicBrands, ...dynamicBrands, ...dynamicBrands];

  return (
    <section className="bg-white py-12 md:py-16 overflow-hidden">
      <div className="container-primesec">
        <h2 className="text-center text-[13px] sm:text-[15px] font-extrabold uppercase tracking-[0.14em] text-ink">
          Güvenilir Markalar, Kaliteli Çözümler
        </h2>
      </div>
      <div className="relative mt-8 py-5">
        <DraggableMarquee>
          {marqueeBrands.map((brand, index) => (
            <BrandLogo key={`${brand.id}-${index}`} brand={brand} />
          ))}
        </DraggableMarquee>
      </div>
    </section>
  );
}

function BrandLogo({ brand }: { brand: Brand }) {
  return (
    <div className="flex h-20 w-auto min-w-[180px] shrink-0 items-center justify-center rounded-xl bg-white px-8 grayscale md:hover:grayscale-0 transition-all shadow-sm border border-slate-100 mx-2 pointer-events-none select-none whitespace-nowrap">
      {brand.logoUrl ? (
        <img src={brand.logoUrl} alt={brand.name} className="max-h-10 max-w-full object-contain pointer-events-none" />
      ) : (
        <div className="flex items-center gap-3 text-[#111827] pointer-events-none">
          <span className="relative flex h-8 w-8 items-center justify-center shrink-0">
            <span className="absolute inset-0 rotate-45 rounded-[7px] border-2 border-current opacity-80" />
            <span className="h-3.5 w-3.5 rounded-sm bg-current opacity-90" />
          </span>
          <span className={`text-[20px] leading-none ${logoStyles[brand.name] ?? "font-black"}`}>{brand.name}</span>
        </div>
      )}
    </div>
  );
}
