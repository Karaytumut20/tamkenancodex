import { getHomepageServicesData } from "@/lib/db";
import { ServicesEditor } from "@/components/admin/ServicesEditor";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";

export const revalidate = 0;

export default async function ServicesAdminPage() {
  const { tabs, services } = await getHomepageServicesData();

  return (
    <ProtectedAdminPage>
      <div className="p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-800">Güvenlik Hizmet Alanları Yönetimi</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">Ana sayfadaki hizmet kategorilerini ve kartları yönetin.</p>
        </div>
        
        <ServicesEditor initialTabs={tabs} initialServices={services} />
      </div>
    </ProtectedAdminPage>
  );
}
