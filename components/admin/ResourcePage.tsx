import { AdminPageHeader } from "@/components/admin/AdminShell";
import { AdminTable } from "@/components/admin/AdminTable";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { getResourceRow, getResourceRows } from "@/lib/admin/data";
import type { AdminResource } from "@/lib/admin/resources";

export async function ResourceListPage({
  resource,
  searchParams,
}: {
  resource: AdminResource;
  searchParams?: Promise<{ q?: string; setup?: string }>;
}) {
  const params = await searchParams;
  const rows = await getResourceRows(resource, params?.q);
  return (
    <ProtectedAdminPage roles={resource.roles}>
      <AdminPageHeader title={resource.title} description={resource.description} />
      {params?.setup === "missing-table" ? (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          Bu bolum icin gerekli Supabase tablo/kolonlari mevcut projede henuz gorunmuyor. SQL'i dogru Supabase projesinde
          calistirdiginizdan emin olun ve schema cache yenilenene kadar kisa bir sure bekleyin. Navbar icin hizli kurulum dosyasi:
          <span className="font-black"> supabase/sql-editor-menu-items.sql</span>
        </div>
      ) : null}
      <form className="mb-4">
        <input
          name="q"
          defaultValue={params?.q ?? ""}
          placeholder="Ara..."
          className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-primary-400"
        />
      </form>
      <AdminTable resource={resource} rows={rows} />
    </ProtectedAdminPage>
  );
}

export async function ResourceNewPage({ resource }: { resource: AdminResource }) {
  return (
    <ProtectedAdminPage roles={resource.roles}>
      <AdminPageHeader title={`${resource.title} Ekle`} description={resource.description} />
      <ResourceForm resource={resource} row={null} />
    </ProtectedAdminPage>
  );
}

export async function ResourceEditPage({
  resource,
  params,
}: {
  resource: AdminResource;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getResourceRow(resource, id);
  return (
    <ProtectedAdminPage roles={resource.roles}>
      <AdminPageHeader title={`${resource.title} Düzenle`} description={resource.description} />
      <ResourceForm resource={resource} row={row} />
    </ProtectedAdminPage>
  );
}
