import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { CustomerForm } from "../CustomerForm";

export default function NewCustomerPage() {
  return (
    <ProtectedAdminPage>
      <AdminPageHeader
        title="👥 Yeni Müşteri Ekle"
        description="Bireysel veya kurumsal yeni bir müşteri profili tanımlayın."
      />
      <div className="max-w-2xl bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <CustomerForm />
      </div>
    </ProtectedAdminPage>
  );
}
