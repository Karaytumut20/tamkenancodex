import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin, type AdminRole } from "@/lib/admin/auth";

export async function ProtectedAdminPage({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: AdminRole[];
}) {
  const { profile } = await requireAdmin(roles);
  return <AdminShell profile={profile}>{children}</AdminShell>;
}
