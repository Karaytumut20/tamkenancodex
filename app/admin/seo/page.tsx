import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { getSeoOverview, getSeoScore } from "@/lib/admin/data";

function statusLabel(ok: boolean, warnText = "Missing") {
  return (
    <span className={ok ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700" : "rounded-full bg-red-50 px-2.5 py-1 text-xs font-black text-red-700"}>
      {ok ? "OK" : warnText}
    </span>
  );
}

export default async function SeoPage() {
  const rows = await getSeoOverview();

  return (
    <ProtectedAdminPage roles={["super_admin", "editor"]}>
      <AdminPageHeader
        title="SEO Center"
        description="Audit CMS records for title length, meta descriptions, focus keywords, image alt text, index rules and update freshness."
        action={
          <Link href="/admin/seo-settings/new" className="inline-flex h-11 items-center rounded-lg primesec-navy-action px-5 text-sm font-extrabold text-white">
            New SEO override
          </Link>
        }
      />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-extrabold uppercase text-ink-muted">
              <tr>
                <th className="px-4 py-3">Record</th>
                <th className="px-4 py-3">URL</th>
                <th className="px-4 py-3">SEO title</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Alt text</th>
                <th className="px-4 py-3">Index</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-14 text-center">
                    <p className="text-base font-black text-ink">No SEO records found</p>
                    <p className="mt-2 text-sm text-ink-muted">Create pages, services, blog posts or media records to populate this audit.</p>
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const score = getSeoScore(row);
                  const titleLength = row.meta_title?.trim().length ?? 0;
                  const descriptionLength = row.meta_description?.trim().length ?? 0;
                  const alt = row.alt_text ?? row.image_alt ?? row.cover_image_alt;
                  return (
                    <tr key={`${row.type}-${row.id}`} className="hover:bg-slate-50">
                      <td className="max-w-[260px] px-4 py-3">
                        <p className="truncate font-black">{row.title}</p>
                        <p className="mt-1 text-xs font-bold text-ink-muted">{row.type}</p>
                      </td>
                      <td className="max-w-[220px] truncate px-4 py-3 font-medium">{row.path}</td>
                      <td className="px-4 py-3">{statusLabel(titleLength >= 50 && titleLength <= 60, titleLength ? `${titleLength} chars` : "Missing")}</td>
                      <td className="px-4 py-3">{statusLabel(descriptionLength >= 140 && descriptionLength <= 160, descriptionLength ? `${descriptionLength} chars` : "Missing")}</td>
                      <td className="px-4 py-3">{statusLabel(Boolean(alt?.trim()), "Missing")}</td>
                      <td className="px-4 py-3">{row.robots_index === "noindex" ? statusLabel(false, "noindex") : statusLabel(true)}</td>
                      <td className="px-4 py-3">
                        <span className={score >= 80 ? "font-black text-emerald-700" : score >= 50 ? "font-black text-amber-700" : "font-black text-red-700"}>{score}%</span>
                      </td>
                      <td className="px-4 py-3 text-ink-muted">{row.updated_at ? new Date(row.updated_at).toLocaleDateString("tr-TR") : "-"}</td>
                      <td className="px-4 py-3 text-right">
                        <Link href={row.editPath} className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-ink hover:border-primary-400">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedAdminPage>
  );
}
