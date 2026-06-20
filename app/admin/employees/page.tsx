import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { EmployeesClient } from "./EmployeesClient";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  const supabase = await createSupabaseServerClient();

  // 1. Fetch all active employees
  const { data: rawEmployees } = await supabase
    .from("employees")
    .select("*")
    .is("deleted_at", null)
    .order("full_name", { ascending: true });

  const employees = rawEmployees || [];

  // 2. Fetch all active appointments with customer details
  const { data: appointments } = await supabase
    .from("appointments")
    .select("*, customer:customer_id(name)")
    .is("deleted_at", null)
    .order("appointment_date", { ascending: false });

  // 3. Fetch all active service orders
  const { data: serviceOrders } = await supabase
    .from("service_orders")
    .select("*")
    .is("deleted_at", null);

  // Compute stats and attach appointments to each employee
  const employeesWithStats = employees.map((emp: any) => {
    // Filter appointments assigned to this employee (either primary or assistant)
    const empApps = (appointments || []).filter(
      (a: any) => a.employee_id === emp.id || a.assistant_employee_id === emp.id
    );

    const appIds = empApps.map((a: any) => a.id);

    // Filter service orders related to this employee's appointments
    const empOrders = (serviceOrders || []).filter(
      (o: any) => o.appointment_id && appIds.includes(o.appointment_id)
    );

    const completed = empOrders.filter((o: any) => o.status === "Tamamlandı");
    const cancelled = empOrders.filter((o: any) => o.status === "İptal Edildi");

    let completedCount = completed.length;
    let cancelledCount = cancelled.length;
    let workHours = 0;
    let ciro = 0;
    let cost = 0;

    completed.forEach((o: any) => {
      workHours += Number(o.labor_hours || 0);
      ciro += Number(o.grand_total || 0);
      cost += Number(o.labor_cost || 0) + Number(o.employee_cost || 0);
    });

    return {
      ...emp,
      appointments: empApps,
      stats: {
        completedCount,
        cancelledCount,
        workHours,
        ciro,
        cost,
      },
    };
  });

  return (
    <ProtectedAdminPage>
      <AdminPageHeader
        title="👥 Personel & Usta Takibi"
        description="Teknik ekibinizin çalışma planlarını, atanan işleri ve performans metriklerini yönetin."
      />
      <EmployeesClient employees={employeesWithStats} />
    </ProtectedAdminPage>
  );
}
