import Link from "next/link";
import { Edit } from "lucide-react";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import type { AdminResource } from "@/lib/admin/resources";
import { deleteResource } from "@/lib/admin/actions";
import { formatAdminValue } from "@/lib/admin/format";
import { InlineCreateModal } from "@/components/admin/InlineCreateModal";

export function AdminTable({
  resource,
  rows,
  createForm,
}: {
  resource: AdminResource;
  rows: Record<string, unknown>[];
  createForm?: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4">
        <div>
          <p className="text-sm font-extrabold">{rows.length} kayıt</p>
          <p className="text-xs text-ink-muted">Arama yaparak kayıtları kolayca bulun.</p>
        </div>
        {resource.canCreate && createForm ? (
          <InlineCreateModal
            title={`${resource.title} Ekle`}
            description={`${resource.title} kaydını bu sayfadan ayrılmadan oluşturun.`}
          >
            {createForm}
          </InlineCreateModal>
        ) : null}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-extrabold uppercase text-ink-muted">
            <tr>
              {resource.columns.map((column) => (
                <th key={column.key} className="px-4 py-3">
                  {column.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={resource.columns.length + 1} className="px-4 py-14 text-center">
                  <p className="text-base font-black text-ink">Kayıt bulunamadı</p>
                  <p className="mt-2 text-sm text-ink-muted">İlk kaydı ekleyebilir veya arama kelimesini değiştirebilirsiniz.</p>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={String(row.id)} className="hover:bg-slate-50">
                  {resource.columns.map((column) => (
                    <td key={column.key} className="max-w-[280px] truncate px-4 py-3 font-medium">
                      {formatAdminValue(row[column.key])}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {resource.canEdit ? (
                        <Link
                          href={`${resource.path}/${row.id}/edit`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-ink hover:border-primary-400 hover:text-primary-600"
                          aria-label="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      ) : null}
                      {resource.canDelete ? (
                        <form action={deleteResource.bind(null, resource.key, String(row.id))}>
                          <ConfirmDeleteButton />
                        </form>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
