import { requireAdmin, type AdminRole } from "@/lib/admin/auth";

export async function ProtectedAdminPage({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: AdminRole[];
}) {
  await requireAdmin(roles);
  return children;
}
