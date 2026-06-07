import { AdminPageHeader } from "@/components/admin/AdminShell";
import { AdminTable } from "@/components/admin/AdminTable";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { getResourceRows } from "@/lib/admin/data";
import type { AdminResource } from "@/lib/admin/resources";

const usersResource: AdminResource = {
  key: "users",
  title: "Kullanıcılar",
  table: "admin_profiles",
  path: "/admin/users",
  description: "Admin profilleri. Sadece super_admin erişebilir.",
  roles: ["super_admin"],
  canCreate: false,
  canEdit: false,
  canDelete: false,
  searchable: ["full_name", "role"],
  columns: [{ key: "full_name", label: "Ad" }, { key: "role", label: "Rol" }, { key: "is_active", label: "Aktif" }, { key: "created_at", label: "Tarih" }],
  fields: [],
};

export default async function UsersPage() {
  const rows = await getResourceRows(usersResource);
  return (
    <ProtectedAdminPage roles={["super_admin"]}>
      <AdminPageHeader title="Kullanıcılar" description="Auth kullanıcıları Supabase Auth üzerinden oluşturulur, admin rolleri admin_profiles tablosunda tutulur." />
      <AdminTable resource={usersResource} rows={rows} />
    </ProtectedAdminPage>
  );
}
