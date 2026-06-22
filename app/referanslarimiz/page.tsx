import Image from "next/image";
import { Building2 } from "lucide-react";
import { PageHero } from "@/components/templates/PageHero";
import { Container } from "@/components/ui/Container";
import { getReferences } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Referanslarımız | PrimeSec Teknoloji",
  description: "PrimeSec Teknoloji'yi tercih eden referans firmalarımızı inceleyin.",
  path: "/referanslarimiz",
});

export default async function ReferencesPage() {
  const references = await getReferences();

  return (
    <>
      <PageHero
        title="Referanslarımız"
        description="Güvenlik ve teknoloji çözümlerinde birlikte çalıştığımız değerli firmalar."
        crumbs={[{ label: "Referanslarımız", href: "/referanslarimiz" }]}
      />
      <section className="bg-surface py-12 md:py-20">
        <Container>
          {references.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {references.map((reference) => (
                <article key={reference.id} className="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-border bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative h-28 w-full">
                    <Image src={reference.logoUrl} alt={`${reference.companyName} logosu`} fill className="object-contain" unoptimized />
                  </div>
                  <h2 className="mt-6 text-lg font-extrabold text-ink">{reference.companyName}</h2>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-border bg-white p-12 text-center">
              <Building2 className="mx-auto h-10 w-10 text-primary-600" />
              <p className="mt-4 font-bold text-ink-muted">Referanslarımız yakında burada yayınlanacak.</p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
