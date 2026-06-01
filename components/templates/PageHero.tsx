import { Breadcrumbs, type Crumb } from "@/components/seo/Breadcrumbs";

export function PageHero({ title, description, crumbs }: { title: string; description: string; image?: string; crumbs: Crumb[] }) {
  return (
    <section className="relative min-h-[50vh] flex flex-col items-center justify-center overflow-hidden bg-[#031a46] text-center px-4 font-sans pt-32 pb-16">
      {/* ── FRAMER STYLE BACKGROUND GRADIENTS ── */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-end overflow-hidden">
         <div className="absolute bottom-[-30%] w-[150vw] md:w-[100vw] h-[80vh] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#0044FF]/40 via-[#0066FF]/10 to-transparent blur-[80px]" />
         <div className="absolute bottom-[0%] left-[-20%] w-[60vw] h-[60vh] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0C2556]/60 via-[#031a46]/20 to-transparent blur-[100px]" />
         <div className="absolute bottom-[5%] right-[-10%] w-[50vw] h-[60vh] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00C2FF]/20 via-[#0088FF]/5 to-transparent blur-[90px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
        {crumbs && crumbs.length > 0 && (
          <div className="mb-6">
            <div className="inline-flex items-center px-5 py-2 rounded-full border border-white/10 bg-[#081C44]/50 backdrop-blur-md">
              <Breadcrumbs items={crumbs} dark />
            </div>
          </div>
        )}
        
        <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] leading-[1.05] font-bold tracking-[-0.04em] md:tracking-[-0.05em] text-white max-w-[900px]">
          {title}
        </h1>

        <p className="mt-6 md:mt-8 text-[15px] md:text-[18px] text-[#A1A1AA] font-medium max-w-[700px] leading-relaxed tracking-[-0.01em]">
          {description}
        </p>
      </div>
    </section>
  );
}
