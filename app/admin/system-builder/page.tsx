import Image from "next/image";
import Link from "next/link";
import { Edit, Search, Wrench } from "lucide-react";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { deleteResource } from "@/lib/admin/actions";
import { getResourceRows } from "@/lib/admin/data";
import { adminResources } from "@/lib/admin/resources";
import { InlineCreateModal } from "@/components/admin/InlineCreateModal";
import { ResourceForm } from "@/components/admin/ResourceForm";

export const revalidate = 0;

export default async function SystemBuilderAdminPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const resource = adminResources.services;
  const services = await getResourceRows(resource, params?.q);

  return (
    <ProtectedAdminPage roles={resource.roles}>
      <div className="p-4 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Kendi Sistemini Tasarla Yönetimi</h1>
            <p className="mt-1 text-sm font-semibold text-slate-500">Formun 4. adımında gösterilecek hizmetleri buradan yönetin.</p>
          </div>
          <InlineCreateModal
            title="Yeni Hizmet Ekle"
            description="Hizmeti bu sayfadan ayrılmadan oluşturun."
            buttonLabel="Yeni Hizmet Ekle"
            buttonClassName="inline-flex h-12 items-center gap-2 rounded-xl bg-cyan-600 px-5 font-black text-white transition hover:bg-cyan-700"
          >
            <ResourceForm resource={resource} row={null} />
          </InlineCreateModal>
        </div>

        <form className="relative mt-7 max-w-2xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            name="q"
            defaultValue={params?.q ?? ""}
            placeholder="Hizmetlerde ara..."
            className="h-12 w-full rounded-xl border-2 border-slate-200 bg-white pl-12 pr-4 text-sm font-semibold outline-none transition focus:border-cyan-400"
          />
        </form>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const image = String(service.card_image_url || service.image_url || "/images/alarm-sistemi.svg");
            const title = String(service.title || "İsimsiz Hizmet");
            const description = String(service.hero_description || service.intro_content || "");
            const active = service.is_active !== false;

            return (
              <article key={String(service.id)} className="group overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md">
                <div className="relative h-48 border-b border-slate-100 bg-slate-50 md:h-52">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-contain p-2 transition duration-300 group-hover:scale-105"
                    unoptimized
                  />
                  <span className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-xs font-black ${active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-500"}`}>
                    {active ? "Aktif" : "Pasif"}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600"><Wrench className="h-5 w-5" /></span>
                    <div className="min-w-0">
                      <h2 className="truncate font-black text-slate-800" title={title}>{title}</h2>
                      {service.slug ? <p className="mt-1 truncate text-xs font-semibold text-slate-400">/{String(service.slug)}</p> : null}
                    </div>
                  </div>
                  {description ? <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">{description}</p> : <p className="mt-4 min-h-10 text-sm text-slate-400">Açıklama eklenmemiş.</p>}

                  <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
                    <Link href={`/admin/system-builder/${service.id}/edit`} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700">
                      <Edit className="h-4 w-4" /> Düzenle
                    </Link>
                    <form action={deleteResource.bind(null, resource.key, String(service.id))}>
                      <ConfirmDeleteButton />
                    </form>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {services.length === 0 ? (
          <div className="mt-8 rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
            <Wrench className="mx-auto h-10 w-10 text-cyan-600" />
            <p className="mt-4 font-black text-slate-700">Hizmet bulunamadı</p>
            <p className="mt-1 text-sm font-semibold text-slate-400">Yeni bir hizmet ekleyebilir veya arama kelimesini değiştirebilirsiniz.</p>
          </div>
        ) : null}
      </div>
    </ProtectedAdminPage>
  );
}
