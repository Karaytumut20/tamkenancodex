import { Breadcrumbs, type Crumb } from "@/components/seo/Breadcrumbs";

export function PageHero({ title, description, crumbs }: { title: string; description: string; image?: string; crumbs: Crumb[] }) {
  return (
    <section className="hero-bg relative flex flex-col items-center justify-center overflow-hidden px-4 text-center font-sans pt-28 pb-14 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-20">
      {/* ── FRAMER STYLE BACKGROUND GRADIENTS ── */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-end overflow-hidden">
         <div className="absolute bottom-[-30%] w-[min(150vw,2000px)] h-[80vh] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#3d6b93]/40 via-[#4f81ac]/10 to-transparent blur-[80px]" />
         <div className="absolute bottom-[0%] left-[-20%] w-[60vw] h-[60vh] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1c273e]/60 via-[#22314e]/20 to-transparent blur-[100px]" />
         <div className="absolute bottom-[5%] right-[-10%] w-[50vw] h-[60vh] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#3d6b93]/20 via-[#2b3d60]/5 to-transparent blur-[90px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
        {crumbs && crumbs.length > 0 && (
          <div className="mb-6">
            <div className="inline-flex items-center px-4 sm:px-5 py-2 rounded-full border border-white/10 primesec-navy-chip backdrop-blur-md">
              <Breadcrumbs items={crumbs} dark />
            </div>
          </div>
        )}
        
        <h1 className="text-[clamp(2rem,7vw,5.5rem)] leading-[1.05] font-bold tracking-[-0.03em] sm:tracking-[-0.04em] md:tracking-[-0.05em] text-white max-w-[900px] break-words">
          {title}
        </h1>

        <p className="mt-5 sm:mt-6 md:mt-8 text-[14px] sm:text-[15px] md:text-[18px] text-[#A1A1AA] font-medium max-w-[700px] leading-relaxed tracking-[-0.01em] break-words">
          {description}
        </p>
      </div>
    </section>
  );
}
