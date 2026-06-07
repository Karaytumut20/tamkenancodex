import { AdminPageHeader } from "@/components/admin/AdminShell";
import { AdminTable } from "@/components/admin/AdminTable";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { getResourceRows } from "@/lib/admin/data";
import type { AdminResource } from "@/lib/admin/resources";

const logsResource: AdminResource = {
  key: "activityLogs",
  title: "İşlem Logları",
  table: "activity_logs",
  path: "/admin/activity-logs",
  description: "Admin işlemleri ve denetim kayıtları.",
  roles: ["super_admin"],
  canCreate: false,
  canEdit: false,
  canDelete: false,
  searchable: ["action", "entity_type"],
  columns: [{ key: "action", label: "İşlem" }, { key: "entity_type", label: "Varlık" }, { key: "entity_id", label: "ID" }, { key: "created_at", label: "Tarih" }],
  fields: [],
};

export default async function ActivityLogsPage() {
  const rows = await getResourceRows(logsResource);
  return (
    <ProtectedAdminPage roles={["super_admin"]}>
      <AdminPageHeader title="İşlem Logları" description="Super admin denetim görünümü." />
      <AdminTable resource={logsResource} rows={rows} />
    </ProtectedAdminPage>
  );
}
