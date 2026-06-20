"use client";

import { useState } from "react";
import { 
  User, 
  Calendar, 
  Wrench, 
  Package, 
  FileText, 
  CreditCard, 
  DollarSign, 
  FileCode, 
  FileImage,
  Plus, 
  Trash2, 
  MapPin, 
  Phone,
  Mail,
  Building,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { CustomerForm } from "../CustomerForm";
import { addCustomerNote, deleteCustomer } from "../actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  customer: any;
  appointments: any[];
  serviceOrders: any[];
  materials: any[];
  payments: any[];
  notes: any[];
  files: any[];
};

export function CustomerProfileClient({
  customer,
  appointments,
  serviceOrders,
  materials,
  payments,
  notes: initialNotes,
  files,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("genel");
  const [notes, setNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);

  // Financial aggregates
  const completedOrders = serviceOrders.filter(o => o.status === 'Tamamlandı');
  const draftOrders = serviceOrders.filter(o => o.status === 'Taslak'); // Acts as Quotes/Teklifler

  const totalBilled = serviceOrders
    .filter(o => o.status !== 'İptal Edildi')
    .reduce((sum, o) => sum + Number(o.grand_total || 0), 0);

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const balance = totalBilled - totalPaid;

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setLoading(true);
    const res = await addCustomerNote(customer.id, newNote);
    if (res.success) {
      setNewNote("");
      // Refresh notes list locally
      window.location.reload();
    } else {
      alert(res.error || "Not eklenemedi.");
    }
    setLoading(false);
  };

  const handleSoftDeleteCustomer = async () => {
    if (!confirm("Bu müşteriyi silmek istediğinizden emin misiniz? (Mevcut randevu ve geçmiş kayıtlar korunacaktır)")) return;
    setLoading(true);
    const res = await deleteCustomer(customer.id);
    if (res.success) {
      alert("Müşteri başarıyla silindi (arşive alındı).");
      router.push("/admin/customers");
    } else {
      alert(res.error || "Müşteri silinemedi.");
    }
    setLoading(false);
  };

  const tabs = [
    { id: "genel", label: "Genel Bilgiler", icon: User },
    { id: "randevular", label: "Randevular", icon: Calendar },
    { id: "isler", label: "İş Emirleri", icon: Wrench },
    { id: "malzemeler", label: "Malzemeler", icon: Package },
    { id: "teklifler", label: "Teklifler", icon: FileText },
    { id: "odemeler", label: "Ödemeler", icon: CreditCard },
    { id: "borc", label: "Borç & Alacak", icon: DollarSign },
    { id: "notlar", label: "Notlar", icon: FileCode },
    { id: "dosyalar", label: "Dosyalar", icon: FileImage },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-12 items-start">
      {/* Sidebar: Navigation tabs & Quick Action buttons */}
      <div className="lg:col-span-3 space-y-4">
        {/* Profile Card */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 text-cyan-600 border border-cyan-100 mb-3">
            {customer.type === 'kurumsal' ? <Building className="h-8 w-8" /> : <User className="h-8 w-8" />}
          </div>
          <h2 className="text-lg font-black text-slate-800 leading-tight">{customer.name}</h2>
          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">{customer.type}</p>
          <div className="mt-4 pt-3 border-t border-slate-100 text-left text-xs font-semibold text-slate-500 space-y-2">
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400 shrink-0" /> {customer.phone}</p>
            {customer.email && <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400 shrink-0" /> {customer.email}</p>}
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400 shrink-0" /> {customer.district || 'İlçe belirtilmemiş'}</p>
          </div>

          <button
            onClick={handleSoftDeleteCustomer}
            disabled={loading}
            className="mt-6 w-full inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 text-xs font-black text-red-600 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="h-4 w-4" /> Müşteriyi Sil
          </button>
        </div>

        {/* Tab Buttons */}
        <nav className="bg-white border-2 border-slate-200 rounded-3xl p-2 shadow-sm flex overflow-x-auto lg:flex-col gap-1 scrollbar-none">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`shrink-0 lg:shrink flex items-center gap-3 px-3 py-2.5 lg:px-4 lg:py-3 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                  isActive 
                    ? "bg-cyan-600 text-white shadow-md" 
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="lg:col-span-9 bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm min-h-[450px]">
        
        {/* 1. GENEL BİLGİLER */}
        {activeTab === "genel" && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3">Müşteri Düzenle</h3>
            <CustomerForm initialData={customer} />
          </div>
        )}

        {/* 2. RANDEVULAR */}
        {activeTab === "randevular" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-black text-slate-800">Randevu Geçmişi</h3>
              <Link 
                href={`/admin/calendar?setup=add&customer_id=${customer.id}`}
                className="inline-flex h-9 px-4 rounded-xl bg-cyan-600 text-white text-xs font-black hover:bg-cyan-700 transition-colors items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Randevu Planla
              </Link>
            </div>

            {appointments.length === 0 ? (
              <p className="py-8 text-center text-sm font-semibold text-slate-400">Bu müşteriye ait aktif randevu bulunmuyor.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {appointments.map((app) => (
                  <div key={app.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base">{app.service_type}</h4>
                      <p className="text-xs font-semibold text-slate-500 mt-1">
                        Tarih: {app.appointment_date} @ {app.start_time.substring(0,5)} - {app.end_time.substring(0,5)}
                      </p>
                      {app.employee && <p className="text-xs font-bold text-slate-400 mt-0.5">Usta: {app.employee.full_name}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        app.priority === 'acil' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-50 text-slate-600'
                      }`}>
                        {app.priority}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. İŞ EMİRLERİ */}
        {activeTab === "isler" && (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3">Tamamlanan ve Aktif İşler</h3>

            {serviceOrders.length === 0 ? (
              <p className="py-8 text-center text-sm font-semibold text-slate-400">Bu müşteriye ait iş emri bulunmuyor.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-black text-xs uppercase">
                      <th className="p-3">İş Emri No</th>
                      <th className="p-3">Hizmet Tarihi</th>
                      <th className="p-3">Genel Toplam</th>
                      <th className="p-3">Kalan Tutar</th>
                      <th className="p-3">Durum</th>
                      <th className="p-3">Detay</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {serviceOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50">
                        <td className="p-3 font-extrabold text-slate-800">{o.order_number}</td>
                        <td className="p-3 text-slate-600">{o.appointment?.appointment_date || o.created_at.split('T')[0]}</td>
                        <td className="p-3 font-bold text-slate-700">
                          {Number(o.grand_total || 0).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                        </td>
                        <td className="p-3 font-bold text-rose-600">
                          {Number(o.grand_total - o.paid_amount).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${
                            o.status === 'Tamamlandı' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <Link href={`/admin/service-orders/${o.id}`} className="text-xs font-black text-cyan-600 hover:text-cyan-700">Gör →</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 4. MALZEMELER */}
        {activeTab === "malzemeler" && (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3">Kullanılan Malzemeler</h3>

            {materials.length === 0 ? (
              <p className="py-8 text-center text-sm font-semibold text-slate-400">Bu müşteriye servislerde malzeme teslim edilmemiş.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-black text-xs uppercase">
                      <th className="p-3">Malzeme Adı</th>
                      <th className="p-3">Miktar</th>
                      <th className="p-3">Satış Fiyatı</th>
                      <th className="p-3">Garanti</th>
                      <th className="p-3">İş Emri</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {materials.map((m) => (
                      <tr key={m.id}>
                        <td className="p-3 font-extrabold text-slate-800">{m.name}</td>
                        <td className="p-3">{Number(m.quantity)} {m.unit}</td>
                        <td className="p-3 font-bold text-slate-700">
                          {Number(m.total_selling_price || 0).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                        </td>
                        <td className="p-3 text-slate-500">{m.warranty_months ? `${m.warranty_months} Ay` : "Yok"}</td>
                        <td className="p-3 font-bold text-cyan-600">{m.service_order?.order_number || "Bilinmiyor"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 5. TEKLİFLER */}
        {activeTab === "teklifler" && (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3">Hazırlanan Teklifler (Taslak İşler)</h3>

            {draftOrders.length === 0 ? (
              <p className="py-8 text-center text-sm font-semibold text-slate-400">Müşteriye ait taslak teklif bulunmuyor.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-black text-xs uppercase">
                      <th className="p-3">Teklif No</th>
                      <th className="p-3">Oluşturma Tarihi</th>
                      <th className="p-3">Tutar</th>
                      <th className="p-3">Detay</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {draftOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50">
                        <td className="p-3 font-extrabold text-slate-800">{o.order_number}</td>
                        <td className="p-3 text-slate-600">{o.created_at.split('T')[0]}</td>
                        <td className="p-3 font-bold text-slate-700">
                          {Number(o.grand_total || 0).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                        </td>
                        <td className="p-3">
                          <Link href={`/admin/service-orders/${o.id}`} className="text-xs font-black text-cyan-600 hover:text-cyan-700">Düzenle / Detay →</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 6. ÖDEMELER */}
        {activeTab === "odemeler" && (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3">Tahsilat Kayıtları</h3>

            {payments.length === 0 ? (
              <p className="py-8 text-center text-sm font-semibold text-slate-400">Henüz tahsilat kaydı eklenmemiş.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-black text-xs uppercase">
                      <th className="p-3">Tarih</th>
                      <th className="p-3">Tutar</th>
                      <th className="p-3">Yöntem</th>
                      <th className="p-3">Açıklama</th>
                      <th className="p-3">Tahsil Eden</th>
                      <th className="p-3">İş Emri</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {payments.map((p) => (
                      <tr key={p.id}>
                        <td className="p-3 text-slate-600">{p.payment_date}</td>
                        <td className="p-3 font-black text-emerald-600">
                          {Number(p.amount || 0).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                        </td>
                        <td className="p-3 font-bold text-slate-700">{p.method}</td>
                        <td className="p-3 text-slate-500">{p.description || "-"}</td>
                        <td className="p-3 text-slate-500">{p.employee?.full_name || "-"}</td>
                        <td className="p-3 font-bold text-cyan-600">{p.service_order?.order_number || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 7. BORÇ VE ALACAK DURUMU */}
        {activeTab === "borc" && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3">Borç & Alacak Özeti</h3>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm text-center">
                <p className="text-xs font-black text-slate-400 uppercase">Toplam Faturalandırılan</p>
                <p className="text-2xl font-black text-slate-800 mt-2">
                  {totalBilled.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                </p>
              </div>
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm text-center">
                <p className="text-xs font-black text-slate-400 uppercase">Toplam Tahsil Edilen</p>
                <p className="text-2xl font-black text-emerald-600 mt-2">
                  {totalPaid.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                </p>
              </div>
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm text-center">
                <p className="text-xs font-black text-slate-400 uppercase">Kalan Borç / Bakiye</p>
                <p className={`text-2xl font-black mt-2 ${balance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {balance.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                </p>
              </div>
            </div>

            {balance > 0 ? (
              <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                <AlertTriangle className="h-6 w-6 text-red-600 shrink-0 animate-pulse" />
                <div>
                  <p className="font-extrabold text-sm sm:text-base">Müşterinin Açık Borcu Bulunuyor</p>
                  <p className="text-xs font-medium mt-0.5">
                    Bu müşteri adına tamamlanmış veya aktif işlerden kalan toplam borç tutarı <span className="font-black">{balance.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}</span>'dir.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-extrabold text-sm sm:text-base">Hesap Dengede</p>
                  <p className="text-xs font-medium mt-0.5">Müşterinin vadesi geçmiş veya açıkta kalan herhangi bir borç kaydı bulunmamaktadır.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 8. NOTLAR */}
        {activeTab === "notlar" && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3">Müşteri Notları</h3>

            {/* Note creation form */}
            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                required
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Müşteriye dair teknik bir not, özel detay veya açıklama yazın..."
                rows={3}
                className="w-full rounded-xl border-2 border-slate-200 bg-white p-4 text-sm font-semibold outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-cyan-600 border-2 border-cyan-700 px-6 text-sm font-black text-white hover:bg-cyan-700 transition-colors"
              >
                {loading ? "Kaydediliyor..." : "Not Ekle"}
              </button>
            </form>

            {/* Notes List */}
            {notes.length === 0 ? (
              <p className="py-8 text-center text-sm font-semibold text-slate-400">Henüz bir not eklenmemiş.</p>
            ) : (
              <div className="space-y-4">
                {notes.map((n) => (
                  <div key={n.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 relative">
                    <p className="text-sm font-semibold text-slate-700 leading-relaxed pr-6">{n.note}</p>
                    <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span>Ekleyen: {n.profile?.full_name || "Yönetici"}</span>
                      <span>{new Date(n.created_at).toLocaleString("tr-TR")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 9. DOSYALAR */}
        {activeTab === "dosyalar" && (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3">Dosyalar & Görseller</h3>

            {files.length === 0 ? (
              <p className="py-8 text-center text-sm font-semibold text-slate-400">Müşterinin iş emirlerine eklenmiş herhangi bir belge veya görsel bulunmuyor.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {files.map((file) => {
                  const isImage = file.file_path.match(/\.(jpg|jpeg|png|webp|gif)$/i);
                  return (
                    <div key={file.id} className="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
                      {isImage ? (
                        <div className="relative w-full h-32 bg-slate-100">
                          <img
                            src={file.file_path}
                            alt={file.file_name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-32 bg-slate-50 flex items-center justify-center text-slate-400">
                          <FileText className="h-10 w-10" />
                        </div>
                      )}
                      <div className="p-3">
                        <p className="font-extrabold text-xs text-slate-800 truncate" title={file.file_name}>
                          {file.file_name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">İş Emri: {file.service_order?.order_number}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded">
                            {file.file_type === 'before_photo' ? 'Öncesi Foto' : file.file_type === 'after_photo' ? 'Sonrası Foto' : 'Belge'}
                          </span>
                          <a
                            href={file.file_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-black text-cyan-600 hover:text-cyan-700"
                          >
                            İndir
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
