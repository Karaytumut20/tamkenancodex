import Link from "next/link";
import { Edit } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deleteResource } from "@/lib/admin/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { InlineCreateModal } from "@/components/admin/InlineCreateModal";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { adminResources } from "@/lib/admin/resources";

export default async function BlogAdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, status, published_at, updated_at")
    .order("updated_at", { ascending: false });

  const rows = (posts ?? []) as {
    id: string;
    title: string;
    status: string;
    published_at: string | null;
    updated_at: string;
  }[];

  return (
    <ProtectedAdminPage>
      <AdminPageHeader
        title="📰 Blog Yazıları"
        description="Yazılarınızı buradan ekleyin veya düzenleyin."
        action={
          <InlineCreateModal
            title="Yeni Blog Yazısı Ekle"
            description="Yazıyı bu sayfadan ayrılmadan oluşturun."
            buttonLabel="Yeni Yazı Ekle"
            buttonClassName="inline-flex h-12 items-center gap-2 rounded-xl border-2 border-cyan-700 bg-cyan-600 px-6 text-base font-black text-white hover:bg-cyan-700"
          >
            <ResourceForm resource={adminResources.blog} row={null} />
          </InlineCreateModal>
        }
      />

      {rows.length === 0 ? (
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-10 text-center">
          <p className="text-xl font-black text-slate-700">Henüz yazı yok</p>
          <p className="mt-2 text-sm text-slate-400 font-medium">
            &quot;Yeni Yazı Ekle&quot; butonuna tıklayarak ilk blog yazınızı oluşturun.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((post) => {
            const isPublished = post.status === "published";
            const date = post.published_at || post.updated_at;
            const formattedDate = date
              ? new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(date))
              : "";

            return (
              <div
                key={post.id}
                className="flex items-center justify-between gap-4 rounded-xl border-2 border-slate-200 bg-white p-4 hover:border-cyan-300 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-base font-black text-slate-800 truncate">{post.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-full ${
                        isPublished
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {isPublished ? "Yayında" : "Taslak"}
                    </span>
                    {formattedDate && (
                      <span className="text-xs text-slate-400 font-medium">{formattedDate}</span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/admin/blog/${post.id}/edit`}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50 hover:border-cyan-300 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Düzenle
                  </Link>
                  <form action={deleteResource.bind(null, "blog", post.id)}>
                    <ConfirmDeleteButton showLabel />
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ProtectedAdminPage>
  );
}
