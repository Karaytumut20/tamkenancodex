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
  UserPlus,
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
import {
  calculateWarrantyEndDate,
  formatElapsedSince,
  formatMaterialDate,
  getWarrantyStatus,
} from "@/lib/admin/material-warranty";
import { customerWhatsappUrl, phoneCallUrl } from "@/lib/whatsapp";
import { StockModal } from "@/components/admin/modals/StockModal";
import { EmployeeModal } from "@/components/admin/modals/EmployeeModal";

type Props = {
  order: any;
  materialsInStock: any[];
  employees: any[];
  orderMaterials: any[];
  payments: any[];
  files: any[];
  logs: any[];
  currentUserRole: string;
  usdTryRate: {
    rate: number;
    date: string;
    source: "TCMB";
  } | null;
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
  usdTryRate,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("genel");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [stockMaterials, setStockMaterials] = useState(materialsInStock);
  const [employeeOptions, setEmployeeOptions] = useState(employees);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

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
  const [matSupplier, setMatSupplier] = useState("");
  const [matPurchaseDate, setMatPurchaseDate] = useState("");
  const [matPurchaseInvoice, setMatPurchaseInvoice] = useState("");
  const [matWarranty, setMatWarranty] = useState(0);
  const [matWarrantyStartDate, setMatWarrantyStartDate] = useState("");
  const [matDesc, setMatDesc] = useState("");

  // Form states - New Payment
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState<any>("Nakit");
  const [payDate, setPayDate] = useState(toCalendarDateKey(new Date()));
  const [payTxNum, setPayTxNum] = useState("");
  const [payEmployeeId, setPayEmployeeId] = useState("");
  const [payDesc, setPayDesc] = useState("");
  const [payCurrency, setPayCurrency] = useState<'TRY' | 'USD'>(order.labor_price_currency || 'TRY');
  const [payInFull, setPayInFull] = useState(false);

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

  const orderCurrency = order.labor_price_currency || 'TRY';
  const effectiveUsdTryRate = usdTryRate?.rate ?? 34;
  const formattedUsdTryRate = usdTryRate?.rate.toLocaleString("tr-TR", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
  const maxPaymentAmount =
    payCurrency === orderCurrency
      ? remainingBalance
      : payCurrency === 'USD'
        ? remainingBalance / effectiveUsdTryRate
        : remainingBalance * effectiveUsdTryRate;
  const formatOrderMoney = (value: number) => {
    return orderCurrency === 'USD'
      ? value.toLocaleString("en-US", { style: "currency", currency: "USD" })
      : value.toLocaleString("tr-TR", { style: "currency", currency: "TRY" });
  };
  const matSellingSum = orderMaterials.reduce((sum, m) => sum + Number(m.total_selling_price || 0), 0);
  const matSellingConverted = order.labor_price_currency === 'USD' ? (matSellingSum / effectiveUsdTryRate) : matSellingSum;
  const warrantyPreviewEndDate = calculateWarrantyEndDate(
    matWarrantyStartDate || matPurchaseDate,
    matWarranty,
  );

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
      setMatSupplier("");
      setMatPurchaseDate("");
      setMatPurchaseInvoice("");
      setMatWarranty(0);
      setMatWarrantyStartDate("");
      return;
    }
    const found = stockMaterials.find((m) => m.id === id);
    if (found) {
      setMatName(found.name);
      setMatCategory(found.category || "");
      setMatBrand(found.brand || "");
      setMatModel(found.model || "");
      setMatBuying(Number(found.buying_price || 0));
      setMatSelling(Number(found.selling_price || 0));
      setMatSupplier(found.supplier || "");
      setMatPurchaseDate(found.purchase_date || "");
      setMatPurchaseInvoice(found.purchase_invoice_number || "");
      setMatWarranty(Number(found.warranty_months || 0));
      setMatWarrantyStartDate(found.purchase_date || "");
    }
  };

  const handleStockCreated = (savedMaterial?: any) => {
    if (!savedMaterial?.id) {
      router.refresh();
      return;
    }

    setStockMaterials((current) => (
      [...current.filter((material) => material.id !== savedMaterial.id), savedMaterial]
        .sort((a, b) => String(a.name).localeCompare(String(b.name), "tr"))
    ));
    setSelectedStockId(savedMaterial.id);
    setMatName(savedMaterial.name || "");
    setMatCategory(savedMaterial.category || "");
    setMatBrand(savedMaterial.brand || "");
    setMatModel(savedMaterial.model || "");
    setMatBuying(Number(savedMaterial.buying_price || 0));
    setMatSelling(Number(savedMaterial.selling_price || 0));
    setMatSupplier(savedMaterial.supplier || "");
    setMatPurchaseDate(savedMaterial.purchase_date || "");
    setMatPurchaseInvoice(savedMaterial.purchase_invoice_number || "");
    setMatWarranty(Number(savedMaterial.warranty_months || 0));
    setMatWarrantyStartDate(savedMaterial.purchase_date || "");
  };

  const handleEmployeeCreated = (savedEmployee?: any) => {
    if (!savedEmployee?.id) {
      router.refresh();
      return;
    }

    setEmployeeOptions((current) => (
      [...current.filter((employee) => employee.id !== savedEmployee.id), savedEmployee]
        .sort((a, b) => String(a.full_name).localeCompare(String(b.full_name), "tr"))
    ));
    setPayEmployeeId(savedEmployee.id);
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
      supplier: matSupplier,
      purchase_date: matPurchaseDate,
      purchase_invoice_number: matPurchaseInvoice,
      warranty_months: matWarranty,
      warranty_start_date: matWarrantyStartDate,
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
      setMatSupplier("");
      setMatPurchaseDate("");
      setMatPurchaseInvoice("");
      setMatWarranty(0);
      setMatWarrantyStartDate("");
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
      setPayInFull(false);
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
      {/* Screen-only view wrapper */}
      <div className="print:hidden space-y-6">
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
      {!isServiceStaff && (
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
      )}

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
                            $ USD{formattedUsdTryRate ? ` · ₺${formattedUsdTryRate}` : ""}
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
                        <p className="mt-1 text-[10px] font-bold text-amber-700">
                          {usdTryRate
                            ? `TCMB satış kuru · ${usdTryRate.date}`
                            : "Güncel TCMB kuru alınamadı; USD tutarı kaydedilebilir."}
                        </p>
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
                      {orderMaterials.map((m) => {
                        const warrantyStatus = getWarrantyStatus({
                          warrantyMonths: m.warranty_months,
                          warrantyStartDate: m.warranty_start_date || m.purchase_date,
                          warrantyEndDate: m.warranty_end_date,
                        });

                        return (
                        <tr key={m.id}>
                          <td className="p-3">
                            <span className="font-extrabold text-slate-800 block">{m.name}</span>
                            <span className="block text-[10px] text-slate-400">{m.brand} {m.model} {m.serial_number ? `(S/N: ${m.serial_number})` : ""}</span>
                            {m.supplier && (
                              <span className="mt-1 block text-[10px] font-bold text-cyan-700">Tedarikçi: {m.supplier}</span>
                            )}
                          </td>
                          <td className="p-3">{Number(m.quantity)} {m.unit}</td>
                          {!isServiceStaff && (
                            <td className="p-3 text-slate-500">
                              <span className="block font-bold">
                                {Number(m.buying_price || 0).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                              </span>
                              {m.purchase_date && (
                                <span className="mt-1 block text-[10px]">
                                  Alış: {formatMaterialDate(m.purchase_date)}
                                  {formatElapsedSince(m.purchase_date) ? ` · ${formatElapsedSince(m.purchase_date)}` : ""}
                                </span>
                              )}
                              {m.purchase_invoice_number && (
                                <span className="block text-[10px]">Belge: {m.purchase_invoice_number}</span>
                              )}
                            </td>
                          )}
                          <td className="p-3 font-bold text-slate-700">
                            {order.labor_price_currency === 'USD'
                              ? (Number(m.selling_price || 0) / effectiveUsdTryRate).toLocaleString("en-US", { style: "currency", currency: "USD" })
                              : Number(m.selling_price || 0).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })
                            }
                          </td>
                          {!isServiceStaff && (
                            <td className="p-3 text-emerald-600 font-bold">
                              {order.labor_price_currency === 'USD'
                                ? (Number(m.profit || 0) / effectiveUsdTryRate).toLocaleString("en-US", { style: "currency", currency: "USD" })
                                : Number(m.profit || 0).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })
                              }
                            </td>
                          )}
                          <td className="p-3">
                            <span className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-black ${
                              warrantyStatus.key === "active"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : warrantyStatus.key === "expired"
                                  ? "border-red-200 bg-red-50 text-red-700"
                                  : "border-slate-200 bg-slate-50 text-slate-600"
                            }`}>
                              {warrantyStatus.label}
                            </span>
                            {warrantyStatus.detail && (
                              <span className="mt-1 block text-[10px] font-semibold text-slate-500">{warrantyStatus.detail}</span>
                            )}
                            {m.warranty_start_date && (
                              <span className="block text-[10px] text-slate-400">Başlangıç: {formatMaterialDate(m.warranty_start_date)}</span>
                            )}
                          </td>
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
                        );
                      })}
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
                    <label htmlFor="order-stock-material" className="text-xs font-black text-slate-500 uppercase">Stoktan Malzeme Seç (İsteğe Bağlı)</label>
                    <select
                      id="order-stock-material"
                      value={selectedStockId}
                      onChange={handleStockChange}
                      className="h-11 w-full px-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                    >
                      <option value="">-- Yeni / Kayıt Dışı Malzeme --</option>
                      {stockMaterials.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} {m.brand ? `[${m.brand}]` : ""} (Stok: {Number(m.stock_quantity)} adet)
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setIsStockModalOpen(true)}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-black text-cyan-700 hover:text-cyan-800"
                    >
                      <Plus className="h-4 w-4" /> Malzeme stokta yoksa buradan ekle
                    </button>
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

                  <div className="rounded-2xl border border-cyan-100 bg-cyan-50/40 p-4">
                    <div className="mb-3">
                      <h5 className="text-sm font-black text-slate-800">Satın Alma Kaydı</h5>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        Tedarikçi, alış tarihi ve belge numarası isteğe bağlıdır. Bu bilgiler bu müşterinin servis kaydında sabit kalır.
                      </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-1.5">
                        <label htmlFor="order-material-supplier" className="text-xs font-black text-slate-500 uppercase">Tedarikçi Firma</label>
                        <input
                          id="order-material-supplier"
                          type="text"
                          value={matSupplier}
                          onChange={(e) => setMatSupplier(e.target.value)}
                          placeholder="Ürünü aldığınız firma"
                          className="h-11 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-semibold outline-none transition-colors focus:border-cyan-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="order-material-purchase-date" className="text-xs font-black text-slate-500 uppercase">Alış Tarihi</label>
                        <input
                          id="order-material-purchase-date"
                          type="date"
                          value={matPurchaseDate}
                          onChange={(e) => {
                            setMatPurchaseDate(e.target.value);
                            if (!matWarrantyStartDate) setMatWarrantyStartDate(e.target.value);
                          }}
                          className="h-11 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-semibold outline-none transition-colors focus:border-cyan-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="order-material-invoice" className="text-xs font-black text-slate-500 uppercase">Fatura / İrsaliye No</label>
                        <input
                          id="order-material-invoice"
                          type="text"
                          value={matPurchaseInvoice}
                          onChange={(e) => setMatPurchaseInvoice(e.target.value)}
                          placeholder="İsteğe bağlı"
                          className="h-11 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-semibold outline-none transition-colors focus:border-cyan-500"
                        />
                      </div>
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
                          <label className="text-xs font-black text-slate-500 uppercase">Birim Alış Maliyeti (TL)</label>
                          <input
                            type="number"
                            value={matBuying}
                            onChange={(e) => setMatBuying(Number(e.target.value))}
                            className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-500 uppercase">
                            Müşteriye Birim Satış (TL) {order.labor_price_currency === 'USD' && <span className="text-[10px] text-amber-600 font-bold block">(USD'ye çevrilir)</span>}
                          </label>
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
                        <label className="text-xs font-black text-slate-500 uppercase">
                          Müşteriye Birim Satış (TL) {order.labor_price_currency === 'USD' && <span className="text-[10px] text-amber-600 font-bold block">(USD'ye çevrilir)</span>}
                        </label>
                        <input
                          type="number"
                          value={matSelling}
                          onChange={(e) => setMatSelling(Number(e.target.value))}
                          className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label htmlFor="order-material-warranty-months" className="text-xs font-black text-slate-500 uppercase">Garanti Süresi (Ay)</label>
                      <input
                        id="order-material-warranty-months"
                        type="number"
                        min="0"
                        step="1"
                        value={matWarranty}
                        onChange={(e) => setMatWarranty(Number(e.target.value))}
                        className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="order-material-warranty-start" className="text-xs font-black text-slate-500 uppercase">Garanti Başlangıç Tarihi</label>
                    <input
                      id="order-material-warranty-start"
                      type="date"
                      value={matWarrantyStartDate}
                      onChange={(e) => setMatWarrantyStartDate(e.target.value)}
                      className="h-11 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-semibold outline-none transition-colors focus:border-cyan-500 sm:max-w-xs"
                    />
                    <p className="text-[11px] font-semibold text-slate-400">
                      Boş bırakırsanız alış tarihi garanti başlangıcı olarak kullanılır. Garanti bitiş tarihi otomatik hesaplanır.
                    </p>
                    {warrantyPreviewEndDate && (
                      <p className="text-xs font-black text-emerald-700">
                        Hesaplanan garanti bitişi: {formatMaterialDate(warrantyPreviewEndDate)}
                      </p>
                    )}
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
                        <label className="text-xs font-black text-slate-500 uppercase">Para Birimi *</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={payInFull}
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
                            disabled={payInFull}
                            onClick={() => setPayCurrency('USD')}
                            className={`flex-1 h-11 rounded-xl border-2 text-sm font-black transition-all ${
                              payCurrency === 'USD'
                                ? 'bg-amber-500 border-amber-600 text-white'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            $ USD{formattedUsdTryRate ? ` · ₺${formattedUsdTryRate}` : ""}
                          </button>
                        </div>
                        <p className="mt-1 text-[10px] font-bold text-amber-700">
                          {usdTryRate
                            ? `TCMB satış kuru · ${usdTryRate.date}`
                            : "Güncel TCMB kuru alınamadı."}
                        </p>
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

                    <div className="grid gap-4 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase text-emerald-800">
                          Tahsil Edeceğim Tutar ({payCurrency})
                        </label>
                        <input
                          required
                          type="number"
                          min="0.01"
                          step="0.01"
                          max={maxPaymentAmount}
                          value={payAmount}
                          disabled={payInFull}
                          onChange={(e) => {
                            setPayInFull(false);
                            setPayAmount(Number(e.target.value));
                          }}
                          placeholder="Alacağınız tutarı yazın"
                          className="h-11 w-full rounded-xl border-2 border-emerald-200 bg-white px-4 text-sm font-black text-slate-800 outline-none transition-colors focus:border-emerald-500 disabled:bg-emerald-100 disabled:text-emerald-900"
                        />
                        <p className="text-[10px] font-bold text-emerald-700">
                          En fazla {maxPaymentAmount.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} {payCurrency} tahsil edilebilir.
                        </p>
                      </div>

                      <label className="flex h-11 cursor-pointer items-center gap-3 rounded-xl border-2 border-emerald-300 bg-white px-4 text-sm font-black text-emerald-800">
                        <input
                          type="checkbox"
                          checked={payInFull}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setPayInFull(checked);
                            setPayCurrency(orderCurrency);
                            setPayAmount(checked ? remainingBalance : 0);
                            if (checked && !payDesc) {
                              setPayDesc("Tutarın tamamı tahsil edildi");
                            }
                          }}
                          className="h-5 w-5 rounded border-emerald-300 accent-emerald-600"
                        />
                        <span>
                          Maks. tutar alındı
                          <span className="ml-2 text-xs font-bold text-emerald-700">
                            ({formatOrderMoney(remainingBalance)})
                          </span>
                        </span>
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label htmlFor="payment-employee" className="text-xs font-black text-slate-500 uppercase">Ödemeyi Alan Personel</label>
                        <select
                          id="payment-employee"
                          value={payEmployeeId}
                          onChange={(e) => setPayEmployeeId(e.target.value)}
                          className="h-11 w-full px-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                        >
                          <option value="">-- Seçiniz --</option>
                          {employeeOptions.map((emp) => (
                            <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setIsEmployeeModalOpen(true)}
                          className="mt-2 inline-flex items-center gap-1.5 text-xs font-black text-cyan-700 hover:text-cyan-800"
                        >
                          <UserPlus className="h-4 w-4" /> Personel listede yoksa buradan ekle
                        </button>
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

      {/* Printable Area for PDF/Invoice */}
      <div id="printable-area" className="hidden print:block font-sans p-6 text-slate-800 bg-white">
        {/* Style tag to inject print-specific CSS rules and ensure complete clean layout on print */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body {
              background: white !important;
              color: black !important;
              font-family: 'Inter', system-ui, sans-serif !important;
            }
            body * {
              visibility: hidden;
            }
            #printable-area, #printable-area * {
              visibility: visible;
            }
            #printable-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 0;
              margin: 0;
            }
            @page {
              size: A4;
              margin: 1.5cm;
            }
            .no-print {
              display: none !important;
            }
          }
        `}} />
        
        {/* 1. Form Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-200 pb-5 mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">PRIMESEC TEKNOLOJİ</h1>
            <p className="text-xs font-bold text-slate-500 mt-0.5">Güvenlik ve Bilişim Sistemleri</p>
            <div className="text-[10px] text-slate-400 mt-2 space-y-0.5">
              <p>Telefon: +90 (533) 000 00 00</p>
              <p>E-posta: info@primesec.com.tr | Web: www.primesec.com.tr</p>
              <p>Adres: Kartal, İstanbul</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-black text-slate-700 tracking-wide uppercase">SERVİS & HİZMET FORMU</h2>
            <div className="text-xs mt-3 space-y-1">
              <p className="font-semibold"><span className="text-slate-400 font-medium">İş Emri No:</span> <span className="font-black text-slate-900">{order.order_number}</span></p>
              <p className="font-semibold"><span className="text-slate-400 font-medium">Tarih:</span> {new Date(order.created_at).toLocaleDateString("tr-TR")}</p>
              <p className="font-semibold"><span className="text-slate-400 font-medium">Durum:</span> <span className="font-bold text-cyan-700">{status}</span></p>
            </div>
          </div>
        </div>

        {/* 2. Customer & Service Details Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">MÜŞTERİ BİLGİLERİ</h3>
            <div className="text-xs space-y-1.5 font-medium text-slate-700">
              <p><span className="text-slate-400">Müşteri Adı:</span> <span className="font-black text-slate-900">{order.customer?.name}</span></p>
              <p><span className="text-slate-400">Telefon:</span> {order.customer?.phone}</p>
              <p><span className="text-slate-400">Müşteri Tipi:</span> {order.customer?.type === 'corporate' ? 'Kurumsal' : 'Bireysel'}</p>
              <p className="leading-relaxed">
                <span className="text-slate-400">Adres:</span> {order.customer?.address || "—"}
                {order.customer?.district && `, ${order.customer.district}`}
                {order.customer?.city && ` / ${order.customer.city}`}
              </p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">SERVİS DETAYLARI</h3>
            <div className="text-xs space-y-1.5 font-medium text-slate-700">
              <p><span className="text-slate-400">Hizmet Türü:</span> <span className="font-bold">{order.appointment?.service_type || "Direkt İş Emri / Servis"}</span></p>
              {order.appointment?.appointment_date && (
                <p><span className="text-slate-400">Randevu Tarihi:</span> {order.appointment.appointment_date} {order.appointment.start_time ? `- ${order.appointment.start_time}` : ""}</p>
              )}
              {laborHours > 0 && (
                <p><span className="text-slate-400">Çalışma Süresi:</span> {laborHours} Saat</p>
              )}
              <p><span className="text-slate-400">Personel Notu:</span> {personnelNotes || "—"}</p>
            </div>
          </div>
        </div>

        {/* 3. Materials Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden mb-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500">
                <th className="p-3">Kullanılan Malzeme / Ürün</th>
                <th className="p-3 w-20">Miktar</th>
                <th className="p-3 w-32 text-right">Birim Fiyat</th>
                <th className="p-3 w-32 text-right">Toplam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
              {orderMaterials.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-slate-400">Bu hizmet için malzeme kullanımı kaydedilmemiştir.</td>
                </tr>
              ) : (
                orderMaterials.map((m) => {
                  const unitPrice = order.labor_price_currency === 'USD' ? (Number(m.selling_price || 0) / effectiveUsdTryRate) : Number(m.selling_price || 0);
                  const totalPrice = order.labor_price_currency === 'USD' ? (Number(m.total_selling_price || 0) / effectiveUsdTryRate) : Number(m.total_selling_price || 0);
                  return (
                    <tr key={m.id}>
                      <td className="p-3">
                        <span className="font-bold text-slate-900 block">{m.name}</span>
                        <span className="block text-[9px] text-slate-400 mt-0.5">{m.brand} {m.model} {m.serial_number ? `(S/N: ${m.serial_number})` : ""}</span>
                      </td>
                      <td className="p-3">{Number(m.quantity)} {m.unit}</td>
                      <td className="p-3 text-right">{formatOrderMoney(unitPrice)}</td>
                      <td className="p-3 text-right font-bold text-slate-900">{formatOrderMoney(totalPrice)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Financial Summary Grid */}
        <div className="grid grid-cols-12 gap-6 mb-8 items-start">
          {/* Notes / T&C */}
          <div className="col-span-6 border border-slate-150 rounded-2xl p-4 text-[10px] text-slate-400 space-y-1.5 leading-relaxed bg-white">
            <p className="font-bold text-slate-500 uppercase tracking-wider mb-1">Müşteri Notu / Talimatı</p>
            <p className="text-slate-600 font-semibold mb-3">{customerNotes || "Müşteri özel notu bulunmamaktadır."}</p>
            <p className="font-bold text-slate-500 uppercase tracking-wider mb-1">Açıklama & Garanti Koşulları</p>
            <p>1. Servis kapsamında montajı yapılan sıfır ürünler, üretici firma garantisi altındadır.</p>
            <p>2. Bu form, teslim edilen hizmet ve malzemelerin tutarını ve teslim durumunu gösteren yasal servis raporudur.</p>
            <p>3. İşçilik ve bakım hizmetleri teslim tarihinden itibaren firmamız güvencesindedir.</p>
          </div>

          {/* Financial Totals */}
          <div className="col-span-6 border border-slate-200 rounded-2xl bg-slate-50/50 p-4 space-y-2">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-1.5 mb-2">FİNANSAL HESAP DETAYI</h3>
            <div className="text-xs space-y-1.5 font-medium text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">İşçilik / Hizmet Bedeli:</span>
                <span className="font-bold">{formatOrderMoney(laborPrice)}</span>
              </div>
              
              {orderMaterials.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Malzeme Satış Toplamı:</span>
                  <span className="font-bold">{formatOrderMoney(matSellingConverted)}</span>
                </div>
              )}

              {discount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>İndirim (Düşülen):</span>
                  <span>- {formatOrderMoney(discount)}</span>
                </div>
              )}

              {taxRate > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-400">KDV (%{taxRate}):</span>
                  <span className="font-bold">{formatOrderMoney(order.tax_amount || 0)}</span>
                </div>
              )}

              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                <span className="font-black text-slate-950">Genel Toplam (KDV Dahil):</span>
                <span className="font-black text-slate-950">{formatOrderMoney(totalBilled)}</span>
              </div>

              <div className="flex justify-between text-emerald-600">
                <span>Tahsil Edilen (Ödenen):</span>
                <span className="font-bold">{formatOrderMoney(paidAmount)}</span>
              </div>

              <div className="flex justify-between border-t border-dashed border-slate-200 pt-1.5 text-xs">
                <span className="font-extrabold text-slate-800">Kalan Bakiye (Alacak):</span>
                <span className={`font-black ${remainingBalance > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                  {formatOrderMoney(remainingBalance)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Payments History (If any payments are recorded) */}
        {payments.length > 0 && (
          <div className="border border-slate-200 rounded-2xl overflow-hidden mb-8">
            <h3 className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">TAHSİLAT GEÇMİŞİ</h3>
            <table className="w-full text-left text-[10px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                  <th className="px-4 py-2">Tarih</th>
                  <th className="px-4 py-2">Ödeme Yöntemi</th>
                  <th className="px-4 py-2">Açıklama</th>
                  <th className="px-4 py-2 text-right">Tutar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-slate-600">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-2">{p.payment_date}</td>
                    <td className="px-4 py-2">{p.method}</td>
                    <td className="px-4 py-2">{p.description || "—"}</td>
                    <td className="px-4 py-2 text-right font-bold text-slate-800">
                      {p.currency === 'USD'
                        ? Number(p.amount || 0).toLocaleString("en-US", { style: "currency", currency: "USD" })
                        : Number(p.amount || 0).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 6. Signatures Footer */}
        <div className="grid grid-cols-2 gap-12 mt-12 pt-8 border-t border-dashed border-slate-200">
          <div className="text-center space-y-8">
            <p className="text-xs font-black text-slate-700 uppercase tracking-wider">HİZMETİ TESLİM EDEN (TEKNİSYEN)</p>
            <div className="h-16 flex items-center justify-center">
              <span className="text-[10px] text-slate-300 italic">[ İmza ve Kaşe ]</span>
            </div>
            <div className="text-xs font-bold text-slate-500">
              <p>Primesec Teknoloji Yetkilisi</p>
              <p className="text-[10px] text-slate-400 font-medium mt-1">Hizmet başarıyla tamamlanmış ve çalışır durumda teslim edilmiştir.</p>
            </div>
          </div>

          <div className="text-center space-y-8 border-l border-slate-100 pl-6">
            <p className="text-xs font-black text-slate-700 uppercase tracking-wider">MÜŞTERİ (TESLİM ALAN)</p>
            <div className="h-16 flex items-center justify-center">
              <span className="text-[10px] text-slate-300 italic">[ Ad Soyadı / İmza ]</span>
            </div>
            <div className="text-xs font-bold text-slate-500">
              <p>{order.customer?.name}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-1">Sistem ve hizmetleri eksiksiz ve çalışır durumda teslim aldım.</p>
            </div>
          </div>
        </div>

        {/* 7. Document Footer */}
        <div className="text-center text-[9px] text-slate-400 mt-12 border-t border-slate-100 pt-4">
          <p>Primesec Bilişim Güvenlik Sistemleri Tic. Ltd. Şti. | Bu belge elektronik olarak üretilmiştir.</p>
        </div>
      </div>

      <StockModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        material={null}
        onSuccess={handleStockCreated}
      />
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSuccess={handleEmployeeCreated}
      />
    </div>
  );
}
