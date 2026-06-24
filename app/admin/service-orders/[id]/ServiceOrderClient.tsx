"use client";

import React, { useState } from "react";
import { 
  Wrench, 
  User, 
  Calendar, 
  Package, 
  CreditCard, 
  DollarSign, 
  FileText, 
  Clock, 
  Plus, 
  Trash2, 
  Upload, 
  History, 
  CheckCircle2, 
  AlertTriangle,
  Building,
  Phone,
  MapPin,
  ExternalLink,
  Printer,
  MessageCircle,
} from "lucide-react";
import { 
  saveServiceOrder, 
  addMaterialToOrder, 
  removeMaterialFromOrder, 
  addPayment, 
  deletePayment, 
  addServiceFileRecord, 
  deleteServiceFileRecord,
  uploadFileBase64
} from "../actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toCalendarDateKey } from "@/lib/admin/calendar-date";
import { customerWhatsappUrl, phoneCallUrl } from "@/lib/whatsapp";

type Props = {
  order: any;
  materialsInStock: any[];
  employees: any[];
  orderMaterials: any[];
  payments: any[];
  files: any[];
  logs: any[];
  currentUserRole: string;
};

export function ServiceOrderClient({
  order,
  materialsInStock,
  employees,
  orderMaterials,
  payments,
  files,
  logs,
  currentUserRole,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("genel");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Check if role is service_staff (who shouldn't see costs and profits)
  const isServiceStaff = currentUserRole === "service_staff";

  // Form states - General Info
  const [status, setStatus] = useState(order.status);
  const [laborHours, setLaborHours] = useState(Number(order.labor_hours || 0));
  const [laborCost, setLaborCost] = useState(Number(order.labor_cost || 0));
  const [laborPrice, setLaborPrice] = useState(Number(order.labor_price || 0));
  const [laborPriceCurrency, setLaborPriceCurrency] = useState<'TRY' | 'USD'>(order.labor_price_currency || 'TRY');
  const [transportationCost, setTransportationCost] = useState(Number(order.transportation_cost || 0));
  const [employeeCost, setEmployeeCost] = useState(Number(order.employee_cost || 0));
  const [otherCosts, setOtherCosts] = useState(Number(order.other_costs || 0));
  const [discount, setDiscount] = useState(Number(order.discount || 0));
  const [taxRate, setTaxRate] = useState(Number(order.tax_rate || 0));
  const [personnelNotes, setPersonnelNotes] = useState(order.personnel_notes || "");
  const [customerNotes, setCustomerNotes] = useState(order.customer_notes || "");

  // Form states - New Material
  const [selectedStockId, setSelectedStockId] = useState("");
  const [matName, setMatName] = useState("");
  const [matCategory, setMatCategory] = useState("");
  const [matBrand, setMatBrand] = useState("");
  const [matModel, setMatModel] = useState("");
  const [matSerial, setMatSerial] = useState("");
  const [matUnit, setMatUnit] = useState<any>("Adet");
  const [matQty, setMatQty] = useState(1);
  const [matBuying, setMatBuying] = useState(0);
  const [matSelling, setMatSelling] = useState(0);
  const [matWarranty, setMatWarranty] = useState(0);
  const [matDesc, setMatDesc] = useState("");

  // Form states - New Payment
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState<any>("Nakit");
  const [payDate, setPayDate] = useState(toCalendarDateKey(new Date()));
  const [payTxNum, setPayTxNum] = useState("");
  const [payEmployeeId, setPayEmployeeId] = useState("");
  const [payDesc, setPayDesc] = useState("");
  const [payCurrency, setPayCurrency] = useState<'TRY' | 'USD'>(order.labor_price_currency || 'TRY');

  // Form states - File Upload
  const [fileType, setFileType] = useState<any>("before_photo");
  const [uploadProgress, setUploadProgress] = useState(false);

  // Financial aggregates
  const totalBilled = Number(order.grand_total || 0);
  const totalCost = Number(order.total_cost || 0);
  const netProfit = Number(order.net_profit || 0);
  const paidAmount = Number(order.paid_amount || 0);
  const remainingBalance = totalBilled - paidAmount;
  const profitMargin = totalBilled > 0 ? (netProfit / totalBilled) * 100 : 0;

  // Handle stock selection
  const handleStockChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedStockId(id);
    if (!id) {
      setMatName("");
      setMatCategory("");
      setMatBrand("");
      setMatModel("");
      setMatBuying(0);
      setMatSelling(0);
      return;
    }
    const found = materialsInStock.find((m) => m.id === id);
    if (found) {
      setMatName(found.name);
      setMatCategory(found.category || "");
      setMatBrand(found.brand || "");
      setMatModel(found.model || "");
      setMatBuying(Number(found.buying_price || 0));
      setMatSelling(Number(found.selling_price || 0));
    }
  };

  // Handle General Form Submit
  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const res = await saveServiceOrder({
      id: order.id,
      customer_id: order.customer_id,
      appointment_id: order.appointment_id,
      labor_hours: laborHours,
      labor_cost: laborCost,
      labor_price: laborPrice,
      labor_price_currency: laborPriceCurrency,
      transportation_cost: transportationCost,
      employee_cost: employeeCost,
      other_costs: otherCosts,
      discount: discount,
      tax_rate: taxRate,
      status: status,
      personnel_notes: personnelNotes,
      customer_notes: customerNotes,
    });

    if (res.success) {
      setSuccessMessage("İş emri başarıyla güncellendi.");
      router.refresh();
    } else {
      setErrorMessage(res.error || "Güncelleme sırasında bir hata oluştu.");
    }
    setLoading(false);
  };

  // Handle Add Material
  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matName) return;
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const res = await addMaterialToOrder(order.id, selectedStockId || null, {
      name: matName,
      category: matCategory,
      brand: matBrand,
      model: matModel,
      serial_number: matSerial,
      unit: matUnit,
      quantity: matQty,
      buying_price: matBuying,
      selling_price: matSelling,
      warranty_months: matWarranty,
      description: matDesc,
    });

    if (res.success) {
      setSuccessMessage("Malzeme başarıyla iş emrine eklendi.");
      // Reset material form
      setSelectedStockId("");
      setMatName("");
      setMatCategory("");
      setMatBrand("");
      setMatModel("");
      setMatSerial("");
      setMatQty(1);
      setMatBuying(0);
      setMatSelling(0);
      setMatWarranty(0);
      setMatDesc("");
      router.refresh();
    } else {
      setErrorMessage(res.error || "Malzeme eklenirken bir hata oluştu.");
    }
    setLoading(false);
  };

  // Handle Delete Material
  const handleDeleteMaterial = async (matRecId: string) => {
    if (!confirm("Bu malzemeyi iş emrinden kaldırmak istediğinizden emin misiniz? Stok miktarı otomatik geri eklenecektir.")) return;
    setLoading(true);
    setErrorMessage("");
    const res = await removeMaterialFromOrder(matRecId, order.id);
    if (res.success) {
      setSuccessMessage("Malzeme başarıyla kaldırıldı.");
      router.refresh();
    } else {
      setErrorMessage(res.error || "Malzeme kaldırılamadı.");
    }
    setLoading(false);
  };

  // Handle Add Payment
  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) return;
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const res = await addPayment({
      customer_id: order.customer_id,
      service_order_id: order.id,
      payment_date: payDate,
      amount: payAmount,
      currency: payCurrency,
      method: payMethod,
      transaction_number: payTxNum,
      received_by_employee_id: payEmployeeId || null,
      description: payDesc,
    });

    if (res.success) {
      setSuccessMessage("Tahsilat kaydı başarıyla eklendi.");
      setPayAmount(0);
      setPayTxNum("");
      setPayDesc("");
      setPayCurrency(order.labor_price_currency || 'TRY');
      router.refresh();
    } else {
      setErrorMessage(res.error || "Ödeme eklenemedi.");
    }
    setLoading(false);
  };

  // Handle Delete Payment
  const handleDeletePayment = async (payId: string) => {
    if (!confirm("Bu tahsilat kaydını silmek istediğinizden emin misiniz?")) return;
    setLoading(true);
    setErrorMessage("");
    const res = await deletePayment(payId, order.id, order.customer_id);
    if (res.success) {
      setSuccessMessage("Tahsilat kaydı başarıyla silindi.");
      router.refresh();
    } else {
      setErrorMessage(res.error || "Tahsilat kaydı silinemedi.");
    }
    setLoading(false);
  };

  // Handle File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        // Upload to public/uploads
        const uploadRes = await uploadFileBase64(base64Data, file.name);
        
        if (uploadRes.success && uploadRes.url) {
          // Add record to DB
          const dbRes = await addServiceFileRecord({
            service_order_id: order.id,
            file_path: uploadRes.url,
            file_name: file.name,
            file_type: fileType,
          });

          if (dbRes.success) {
            setSuccessMessage("Dosya başarıyla yüklendi.");
            router.refresh();
          } else {
            setErrorMessage(dbRes.error || "Dosya veritabanına kaydedilemedi.");
          }
        } else {
          setErrorMessage(uploadRes.error || "Dosya sunucuya yüklenemedi.");
        }
        setUploadProgress(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setErrorMessage("Yükleme sırasında hata oluştu.");
      setUploadProgress(false);
    }
  };

  // Handle Delete File
  const handleDeleteFile = async (fileId: string) => {
    if (!confirm("Bu dosya/görsel kaydını silmek istediğinizden emin misiniz?")) return;
    setLoading(true);
    setErrorMessage("");
    const res = await deleteServiceFileRecord(fileId, order.id);
    if (res.success) {
      setSuccessMessage("Dosya başarıyla silindi.");
      router.refresh();
    } else {
      setErrorMessage(res.error || "Dosya silinemedi.");
    }
    setLoading(false);
  };

  // Parse audit logs changes
  const renderLogDiff = (log: any) => {
    const oldVal = log.old_values;
    const newVal = log.new_values;
    if (!oldVal && !newVal) return null;
    if (!oldVal) return <span className="text-emerald-600 font-bold">Yeni Kayıt Oluşturuldu</span>;
    if (!newVal) return <span className="text-rose-600 font-bold">Kayıt Silindi</span>;

    const diffs: React.ReactNode[] = [];
    Object.keys(newVal).forEach(key => {
      // Exclude system fields
      if (['updated_at', 'created_at', 'deleted_at'].includes(key)) return;
      if (JSON.stringify(oldVal[key]) !== JSON.stringify(newVal[key])) {
        diffs.push(
          <div key={key} className="text-xs flex flex-wrap gap-1 items-center mt-1">
            <span className="font-extrabold uppercase text-slate-500 bg-slate-100 px-1 rounded text-[10px]">{key}:</span>
            <span className="text-slate-400 line-through text-[11px]">{String(oldVal[key] ?? 'Boş')}</span>
            <span className="text-slate-400">→</span>
            <span className="text-emerald-600 font-extrabold text-[11px]">{String(newVal[key] ?? 'Boş')}</span>
          </div>
        );
      }
    });

    return diffs.length > 0 ? (
      <div className="space-y-1 border-t border-slate-100 pt-2 mt-2">{diffs}</div>
    ) : (
      <span className="text-slate-400 text-xs italic block mt-1">Sadece sistem alanları güncellendi</span>
    );
  };

  const tabs = [
    { id: "genel", label: "Genel Bilgiler", icon: Wrench },
    { id: "malzemeler", label: "Malzemeler", icon: Package },
    { id: "odemeler", label: "Ödemeler & Tahsilat", icon: CreditCard },
    { id: "dosyalar", label: "Görseller & Dosyalar", icon: FileText },
    { id: "gecmis", label: "İşlem Geçmişi", icon: History },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100">
              <Wrench className="h-5 w-5" />
            </span>
            <h2 className="text-2xl font-black text-slate-800">{order.order_number}</h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              status === 'Tamamlandı' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
            }`}>
              {status}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-2">
            Müşteri: <Link href={`/admin/customers/${order.customer_id}`} className="font-extrabold text-cyan-600 hover:underline">{order.customer?.name}</Link> ({order.customer?.phone})
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          {order.customer?.phone && (
            <>
              <a href={phoneCallUrl(order.customer.phone)} className="inline-flex h-11 items-center gap-1.5 rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50">
                <Phone className="h-4 w-4 text-emerald-600" /> Ara
              </a>
              <a href={customerWhatsappUrl(order.customer.phone, order.customer.name)} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-[#25D366] px-4 text-sm font-black text-white hover:bg-[#20ba59]">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </>
          )}
          <button
            onClick={() => window.print()}
            className="inline-flex h-11 items-center gap-1.5 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 px-4 text-sm font-black text-slate-700 transition-colors"
          >
            <Printer className="h-4 w-4" /> Yazdır / PDF
          </button>
          <Link
            href="/admin/service-orders"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-800 text-white px-5 text-sm font-black hover:bg-slate-900 transition-colors"
          >
            Listeye Dön
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 text-sm font-semibold">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 text-sm font-semibold">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Financial Summary Block (Hidden for service_staff role) */}
      {!isServiceStaff && (() => {
        const orderCurrency = order.labor_price_currency || 'TRY';
        const formatOrderMoney = (value: number) => {
          return orderCurrency === 'USD'
            ? value.toLocaleString("en-US", { style: "currency", currency: "USD" })
            : value.toLocaleString("tr-TR", { style: "currency", currency: "TRY" });
        };
        return (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="text-center sm:text-left border-b sm:border-b-0 sm:border-r border-slate-100 pb-4 sm:pb-0 sm:pr-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Toplam Maliyet (TL)</p>
              <p className="text-xl font-black text-slate-700 mt-1">
                {totalCost.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
              </p>
            </div>
            <div className="text-center sm:text-left border-b sm:border-b-0 sm:border-r border-slate-100 py-4 sm:py-0 sm:px-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Müşteri Toplamı</p>
              <p className="text-xl font-black text-slate-800 mt-1">
                {formatOrderMoney(totalBilled)}
              </p>
            </div>
            <div className="text-center sm:text-left border-b sm:border-b-0 sm:border-r border-slate-100 py-4 sm:py-0 sm:px-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Kalan Bakiye</p>
              <p className={`text-xl font-black mt-1 ${remainingBalance > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                {formatOrderMoney(remainingBalance)}
              </p>
            </div>
            <div className="text-center sm:text-left py-4 sm:py-0 sm:pl-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Net Kâr (Oran)</p>
              <p className={`text-xl font-black mt-1 ${netProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {formatOrderMoney(netProfit)}
                <span className="text-xs font-bold block sm:inline sm:ml-1">({profitMargin.toFixed(1)}%)</span>
              </p>
            </div>
          </div>
        );
      })()}

      {/* Main Grid: Navigation & Content */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-3">
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

        <div className="lg:col-span-9 bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm min-h-[450px]">
          
          {/* TAB 1: GENEL BİLGİLER */}
          {activeTab === "genel" && (
            <form onSubmit={handleSaveGeneral} className="space-y-6">
              <h3 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3">Servis & Finans Detayları</h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Servis Durumu</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="h-11 w-full px-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="Taslak">Taslak (Teklif)</option>
                    <option value="İşlem Başladı">İşlem Başladı</option>
                    <option value="Malzeme Bekleniyor">Malzeme Bekleniyor</option>
                    <option value="Tamamlandı">Tamamlandı</option>
                    <option value="İptal Edildi">İptal Edildi</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Toplam İşçilik Süresi (Saat)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={laborHours}
                    onChange={(e) => setLaborHours(Number(e.target.value))}
                    className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              {!isServiceStaff && (
                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-wider">Maliyet ve Fiyatlandırma Girişleri</h4>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-500 uppercase">İşçilik Maliyeti (Alış)</label>
                      <input
                        type="number"
                        value={laborCost}
                        onChange={(e) => setLaborCost(Number(e.target.value))}
                        className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-slate-500 uppercase">Müşteriye İşçilik Ücreti (Satış)</label>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => setLaborPriceCurrency('TRY')}
                            className={`h-7 px-2.5 rounded-lg text-xs font-black border-2 transition-all ${
                              laborPriceCurrency === 'TRY'
                                ? 'bg-cyan-600 border-cyan-700 text-white'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            ₺ TL
                          </button>
                          <button
                            type="button"
                            onClick={() => setLaborPriceCurrency('USD')}
                            className={`h-7 px-2.5 rounded-lg text-xs font-black border-2 transition-all ${
                              laborPriceCurrency === 'USD'
                                ? 'bg-amber-500 border-amber-600 text-white'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            $ USD
                          </button>
                        </div>
                      </div>
                      <input
                        type="number"
                        value={laborPrice}
                        onChange={(e) => setLaborPrice(Number(e.target.value))}
                        className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                      />
                      {laborPriceCurrency === 'USD' && (
                        <p className="mt-1 text-[10px] font-bold text-amber-600">$ USD cinsinden işçilik ücreti.</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-500 uppercase">Ulaşım Giderleri</label>
                      <input
                        type="number"
                        value={transportationCost}
                        onChange={(e) => setTransportationCost(Number(e.target.value))}
                        className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-500 uppercase">Ek Personel Maliyeti</label>
                      <input
                        type="number"
                        value={employeeCost}
                        onChange={(e) => setEmployeeCost(Number(e.target.value))}
                        className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-500 uppercase">Diğer Maliyetler / Giderler</label>
                      <input
                        type="number"
                        value={otherCosts}
                        onChange={(e) => setOtherCosts(Number(e.target.value))}
                        className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-500 uppercase">İndirim Tutarı</label>
                      <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-500 uppercase">Vergi Oranı (%)</label>
                      <input
                        type="number"
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value))}
                        className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-slate-100 pt-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Teknik Personel Notları (Müşteriye Gizli)</label>
                  <textarea
                    rows={3}
                    value={personnelNotes}
                    onChange={(e) => setPersonnelNotes(e.target.value)}
                    placeholder="Arıza tespitleri, teknik detaylar, usta notları..."
                    className="w-full rounded-xl border-2 border-slate-200 bg-white p-4 text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Müşteri Form Notu (Müşteriye Gösterilir)</label>
                  <textarea
                    rows={3}
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="Müşterinin görebileceği garanti şartları veya genel açıklamalar..."
                    className="w-full rounded-xl border-2 border-slate-200 bg-white p-4 text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-cyan-600 border-2 border-cyan-700 px-6 text-sm font-black text-white hover:bg-cyan-700 transition-colors"
                >
                  {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: MALZEMELER */}
          {activeTab === "malzemeler" && (
            <div className="space-y-8">
              <h3 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3">Kullanılan Malzemelerin Listesi</h3>
              
              {/* Materials list */}
              {orderMaterials.length === 0 ? (
                <p className="py-8 text-center text-sm font-semibold text-slate-400">Bu iş emrinde henüz malzeme kullanılmadı.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-black uppercase">
                        <th className="p-3">Malzeme</th>
                        <th className="p-3">Miktar</th>
                        {!isServiceStaff && <th className="p-3">Birim Alış</th>}
                        <th className="p-3">Birim Satış</th>
                        {!isServiceStaff && <th className="p-3">Kâr</th>}
                        <th className="p-3">Garanti</th>
                        <th className="p-3 text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {orderMaterials.map((m) => (
                        <tr key={m.id}>
                          <td className="p-3">
                            <span className="font-extrabold text-slate-800 block">{m.name}</span>
                            <span className="block text-[10px] text-slate-400">{m.brand} {m.model} {m.serial_number ? `(S/N: ${m.serial_number})` : ""}</span>
                          </td>
                          <td className="p-3">{Number(m.quantity)} {m.unit}</td>
                          {!isServiceStaff && (
                            <td className="p-3 text-slate-500">
                              {Number(m.buying_price || 0).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                            </td>
                          )}
                          <td className="p-3 font-bold text-slate-700">
                            {Number(m.selling_price || 0).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                          </td>
                          {!isServiceStaff && (
                            <td className="p-3 text-emerald-600 font-bold">
                              {Number(m.profit || 0).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                            </td>
                          )}
                          <td className="p-3 text-slate-500">{m.warranty_months ? `${m.warranty_months} Ay` : "Yok"}</td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteMaterial(m.id)}
                              className="text-red-500 hover:text-red-700 inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Add material form */}
              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-base font-black text-slate-800 mb-4">Yeni Malzeme Ekle</h4>
                <form onSubmit={handleAddMaterial} className="space-y-4">
                  
                  {/* Stock card selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase">Stoktan Malzeme Seç (İsteğe Bağlı)</label>
                    <select
                      value={selectedStockId}
                      onChange={handleStockChange}
                      className="h-11 w-full px-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                    >
                      <option value="">-- Yeni / Kayıt Dışı Malzeme --</option>
                      {materialsInStock.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} {m.brand ? `[${m.brand}]` : ""} (Stok: {Number(m.stock_quantity)} adet)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-500 uppercase">Malzeme Adı *</label>
                      <input
                        required
                        type="text"
                        value={matName}
                        onChange={(e) => setMatName(e.target.value)}
                        placeholder="Örn: Hikvision Bullet Kamera"
                        className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-500 uppercase">Kategori</label>
                      <input
                        type="text"
                        value={matCategory}
                        onChange={(e) => setMatCategory(e.target.value)}
                        placeholder="Kamera, kablo vb."
                        className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-500 uppercase">Marka</label>
                      <input
                        type="text"
                        value={matBrand}
                        onChange={(e) => setMatBrand(e.target.value)}
                        className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-500 uppercase">Model</label>
                      <input
                        type="text"
                        value={matModel}
                        onChange={(e) => setMatModel(e.target.value)}
                        className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-500 uppercase">Seri Numarası</label>
                      <input
                        type="text"
                        value={matSerial}
                        onChange={(e) => setMatSerial(e.target.value)}
                        placeholder="S/N"
                        className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-500 uppercase">Birim</label>
                      <select
                        value={matUnit}
                        onChange={(e: any) => setMatUnit(e.target.value)}
                        className="h-11 w-full px-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                      >
                        <option value="Adet">Adet</option>
                        <option value="Metre">Metre</option>
                        <option value="Paket">Paket</option>
                        <option value="Kutu">Kutu</option>
                        <option value="Kilogram">Kilogram</option>
                        <option value="Litre">Litre</option>
                        <option value="Set">Set</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-500 uppercase">Kullanılan Miktar</label>
                      <input
                        type="number"
                        step="0.01"
                        value={matQty}
                        onChange={(e) => setMatQty(Number(e.target.value))}
                        className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                    
                    {!isServiceStaff ? (
                      <>
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-500 uppercase">Birim Alış Maliyeti</label>
                          <input
                            type="number"
                            value={matBuying}
                            onChange={(e) => setMatBuying(Number(e.target.value))}
                            className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-500 uppercase">Müşteriye Birim Satış</label>
                          <input
                            type="number"
                            value={matSelling}
                            onChange={(e) => setMatSelling(Number(e.target.value))}
                            className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="space-y-1.5 col-span-2">
                        <label className="text-xs font-black text-slate-500 uppercase">Müşteriye Birim Satış</label>
                        <input
                          type="number"
                          value={matSelling}
                          onChange={(e) => setMatSelling(Number(e.target.value))}
                          className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-500 uppercase">Garanti Süresi (Ay)</label>
                      <input
                        type="number"
                        value={matWarranty}
                        onChange={(e) => setMatWarranty(Number(e.target.value))}
                        className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase">Açıklama</label>
                    <input
                      type="text"
                      value={matDesc}
                      onChange={(e) => setMatDesc(e.target.value)}
                      placeholder="Malzeme kullanım detayları veya notu..."
                      className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-cyan-600 border-2 border-cyan-700 px-6 text-sm font-black text-white hover:bg-cyan-700 transition-colors"
                  >
                    Malzemeyi Kaydet
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: ÖDEMELER */}
          {activeTab === "odemeler" && (
            <div className="space-y-8">
              <h3 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3">Servis Tahsilat Geçmişi</h3>

              {payments.length === 0 ? (
                <p className="py-8 text-center text-sm font-semibold text-slate-400">Bu iş emri için henüz ödeme alınmadı.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-black uppercase text-xs">
                        <th className="p-3">Tarih</th>
                        <th className="p-3">Tutar</th>
                        <th className="p-3">Yöntem</th>
                        <th className="p-3">Tahsil Eden</th>
                        <th className="p-3">İşlem / Ref No</th>
                        <th className="p-3 text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {payments.map((p) => (
                      <tr key={p.id}>
                          <td className="p-3 text-slate-600">{p.payment_date}</td>
                          <td className="p-3 font-black text-emerald-600">
                            {p.currency === 'USD'
                              ? Number(p.amount || 0).toLocaleString("en-US", { style: "currency", currency: "USD" })
                              : Number(p.amount || 0).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })
                            }
                            {p.currency && p.currency !== 'TRY' && (
                              <span className="ml-1 text-[9px] font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-200 px-1 py-0.5 rounded">
                                {p.currency}
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-bold text-slate-700">{p.method}</td>
                          <td className="p-3 text-slate-500">{p.employee?.full_name || "-"}</td>
                          <td className="p-3 text-slate-500">{p.transaction_number || "-"}</td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeletePayment(p.id)}
                              className="text-red-500 hover:text-red-700 inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Add Payment form */}
              {remainingBalance > 0 && (
                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-base font-black text-slate-800 mb-4">Yeni Tahsilat Kaydet</h4>
                  <form onSubmit={handleAddPayment} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase">Ödeme Tarihi *</label>
                        <input
                          required
                          type="date"
                          value={payDate}
                          onChange={(e) => setPayDate(e.target.value)}
                          className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase">Alınan Tutar (Maks: {remainingBalance}) *</label>
                        <input
                          required
                          type="number"
                          step="0.01"
                          max={remainingBalance}
                          value={payAmount}
                          onChange={(e) => setPayAmount(Number(e.target.value))}
                          className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase">Para Birimi *</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setPayCurrency('TRY')}
                            className={`flex-1 h-11 rounded-xl border-2 text-sm font-black transition-all ${
                              payCurrency === 'TRY'
                                ? 'bg-cyan-600 border-cyan-700 text-white'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            ₺ TL
                          </button>
                          <button
                            type="button"
                            onClick={() => setPayCurrency('USD')}
                            className={`flex-1 h-11 rounded-xl border-2 text-sm font-black transition-all ${
                              payCurrency === 'USD'
                                ? 'bg-amber-500 border-amber-600 text-white'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            $ USD
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase">Ödeme Yöntemi *</label>
                        <select
                          value={payMethod}
                          onChange={(e: any) => setPayMethod(e.target.value)}
                          className="h-11 w-full px-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                        >
                          <option value="Nakit">Nakit</option>
                          <option value="Kredi Kartı">Kredi Kartı</option>
                          <option value="Banka Havalesi">Banka Havalesi</option>
                          <option value="EFT">EFT</option>
                          <option value="Çek">Çek</option>
                          <option value="Diğer">Diğer</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase">Ödemeyi Alan Personel</label>
                        <select
                          value={payEmployeeId}
                          onChange={(e) => setPayEmployeeId(e.target.value)}
                          className="h-11 w-full px-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                        >
                          <option value="">-- Seçiniz --</option>
                          {employees.map((emp) => (
                            <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase">İşlem / Referans Numarası</label>
                        <input
                          type="text"
                          value={payTxNum}
                          onChange={(e) => setPayTxNum(e.target.value)}
                          placeholder="Dekont no, slip no vb."
                          className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-500 uppercase">Ödeme Açıklaması</label>
                      <input
                        type="text"
                        value={payDesc}
                        onChange={(e) => setPayDesc(e.target.value)}
                        placeholder="Örn: İlk taksit ödemesi"
                        className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-cyan-600 border-2 border-cyan-700 px-6 text-sm font-black text-white hover:bg-cyan-700 transition-colors"
                    >
                      Tahsilatı Kaydet
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DOSYALAR */}
          {activeTab === "dosyalar" && (
            <div className="space-y-8">
              <h3 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3">Öncesi/Sonrası Fotoğrafları & Belgeler</h3>

              {/* Upload settings */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 grid gap-4 sm:grid-cols-2 items-end">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Dosya Tipi</label>
                  <select
                    value={fileType}
                    onChange={(e: any) => setFileType(e.target.value)}
                    className="h-11 w-full px-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="before_photo">İş Öncesi Fotoğrafı</option>
                    <option value="after_photo">İş Sonrası Fotoğrafı</option>
                    <option value="document">İmza Belgesi / Servis Formu</option>
                  </select>
                </div>

                <div className="relative">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    id="file-upload"
                    className="hidden"
                    disabled={uploadProgress}
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-600 text-white font-black text-sm hover:bg-cyan-700 cursor-pointer transition-colors shadow-sm"
                  >
                    <Upload className="h-5 w-5" /> {uploadProgress ? "Yükleniyor..." : "Dosya / Görsel Seç"}
                  </label>
                </div>
              </div>

              {/* Files Grid */}
              {files.length === 0 ? (
                <p className="py-8 text-center text-sm font-semibold text-slate-400 font-semibold">Bu iş emrine eklenmiş dosya bulunmuyor.</p>
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
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded">
                              {file.file_type === 'before_photo' ? 'Öncesi' : file.file_type === 'after_photo' ? 'Sonrası' : 'Belge'}
                            </span>
                            <div className="flex gap-2">
                              <a
                                href={file.file_path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-500 hover:text-cyan-600 inline-flex items-center justify-center p-1 rounded hover:bg-slate-100"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                              <button
                                type="button"
                                onClick={() => handleDeleteFile(file.id)}
                                className="text-red-500 hover:text-red-700 inline-flex items-center justify-center p-1 rounded hover:bg-red-50"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: İŞLEM GEÇMİŞİ */}
          {activeTab === "gecmis" && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3">Kayıt Güncelleme Geçmişi (Audit Trail)</h3>

              {logs.length === 0 ? (
                <p className="py-8 text-center text-sm font-semibold text-slate-400">Bu iş emri için henüz bir değişiklik kaydı bulunmuyor.</p>
              ) : (
                <div className="relative border-l-2 border-slate-200 ml-4 space-y-6">
                  {logs.map((log) => (
                    <div key={log.id} className="relative pl-6">
                      {/* Timeline dot */}
                      <span className="absolute -left-1.5 top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-cyan-500" />
                      
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-black text-slate-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md">
                            {log.action_type === 'INSERT' ? 'Oluşturma' : log.action_type === 'DELETE' ? 'Silme' : 'Güncelleme'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {new Date(log.created_at).toLocaleString("tr-TR")}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-500 mt-2">
                          İşlemi Yapan: <span className="font-extrabold text-slate-800">{log.user_fullname}</span>
                        </p>

                        <p className="text-xs font-semibold text-slate-500 mt-1">
                          Tablo: <span className="font-extrabold text-slate-800 uppercase">{log.target_table}</span>
                        </p>

                        {renderLogDiff(log)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
