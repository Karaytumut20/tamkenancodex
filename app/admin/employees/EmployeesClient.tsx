"use client";

import React, { useState } from "react";
import { 
  Contact, 
  Phone, 
  Mail, 
  Clock, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  AlertTriangle,
  Briefcase,
  CheckCircle,
  FileText
} from "lucide-react";
import { saveEmployee, deleteEmployee } from "./actions";
import { useRouter } from "next/navigation";

type Props = {
  employees: any[];
};

export function EmployeesClient({ employees }: Props) {
  const router = useRouter();
  
  // Selected employee for detail view/stats
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || "");
  const selectedEmp = employees.find(e => e.id === selectedEmpId);

  // Form & Modal states
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formId, setFormId] = useState("");
  const [formFullName, setFormFullName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRoleTitle, setFormRoleTitle] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [formWorkingDays, setFormWorkingDays] = useState<string[]>([
    "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"
  ]);
  const [formHoursStart, setFormHoursStart] = useState("09:00");
  const [formHoursEnd, setFormHoursEnd] = useState("18:00");
  const [formNotes, setFormNotes] = useState("");

  const weekDays = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setFormId("");
    setFormFullName("");
    setFormPhone("");
    setFormEmail("");
    setFormRoleTitle("");
    setFormActive(true);
    setFormWorkingDays(["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"]);
    setFormHoursStart("09:00");
    setFormHoursEnd("18:00");
    setFormNotes("");
    setErrorMessage("");
    setSuccessMessage("");
    setIsOpen(true);
  };

  const handleOpenEdit = (emp: any) => {
    setIsEditMode(true);
    setFormId(emp.id);
    setFormFullName(emp.full_name);
    setFormPhone(emp.phone || "");
    setFormEmail(emp.email || "");
    setFormRoleTitle(emp.role_title || "");
    setFormActive(emp.is_active);
    setFormWorkingDays(emp.working_days || []);
    setFormHoursStart(emp.working_hours_start || "09:00");
    setFormHoursEnd(emp.working_hours_end || "18:00");
    setFormNotes(emp.notes || "");
    setErrorMessage("");
    setSuccessMessage("");
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const res = await saveEmployee({
      id: formId || undefined,
      full_name: formFullName,
      phone: formPhone,
      email: formEmail,
      role_title: formRoleTitle,
      is_active: formActive,
      working_days: formWorkingDays,
      working_hours_start: formHoursStart,
      working_hours_end: formHoursEnd,
      notes: formNotes,
    });

    if (res.success) {
      setSuccessMessage(isEditMode ? "Personel güncellendi." : "Yeni personel eklendi.");
      setIsOpen(false);
      router.refresh();
    } else {
      setErrorMessage(res.error || "Personel kaydedilemedi.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu personeli pasif duruma getirmek / silmek istediğinizden emin misiniz? Atanmış randevuları etkilenmeyecektir.")) return;
    setLoading(true);
    const res = await deleteEmployee(id);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || "Personel silinemedi.");
    }
    setLoading(false);
  };

  const toggleDay = (day: string) => {
    if (formWorkingDays.includes(day)) {
      setFormWorkingDays(formWorkingDays.filter(d => d !== day));
    } else {
      setFormWorkingDays([...formWorkingDays, day]);
    }
  };

  // Helper to categorize appointments for the selected employee
  const getCategorizedAppointments = (apps: any[]) => {
    const todayStr = new Date().toISOString().split("T")[0];
    
    // Week limits
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
    startOfWeek.setHours(0,0,0,0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23,59,59,999);

    const todayApps = apps.filter(a => a.appointment_date === todayStr);
    const weeklyApps = apps.filter(a => {
      const appDate = new Date(a.appointment_date);
      return appDate >= startOfWeek && appDate <= endOfWeek && a.appointment_date !== todayStr;
    });
    const monthlyApps = apps.filter(a => {
      const appDate = new Date(a.appointment_date);
      return (appDate < startOfWeek || appDate > endOfWeek) && a.appointment_date !== todayStr;
    });

    return { todayApps, weeklyApps, monthlyApps };
  };

  const { todayApps, weeklyApps, monthlyApps } = selectedEmp 
    ? getCategorizedAppointments(selectedEmp.appointments || []) 
    : { todayApps: [], weeklyApps: [], monthlyApps: [] };

  return (
    <div className="grid gap-6 lg:grid-cols-12 items-start">
      
      {/* Sidebar: Employees list */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-lg font-black text-slate-800">Personel Kadrosu</h3>
            <button
              onClick={handleOpenAdd}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-600 text-white hover:bg-cyan-700 transition-colors"
              title="Yeni Personel Ekle"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {employees.map((emp) => {
              const isSelected = selectedEmpId === emp.id;
              return (
                <div
                  key={emp.id}
                  onClick={() => setSelectedEmpId(emp.id)}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected 
                      ? "border-cyan-600 bg-cyan-50/50 shadow-sm" 
                      : "border-slate-150 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-slate-800 truncate text-sm sm:text-base">{emp.full_name}</p>
                    <p className="text-xs font-bold text-slate-400 mt-0.5 truncate uppercase tracking-wider">
                      {emp.role_title || "Tekniker"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className={`inline-block h-2 w-2 rounded-full ${emp.is_active ? "bg-emerald-500" : "bg-slate-400"}`} />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenEdit(emp); }}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(emp.id); }}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main content: Selected Employee stats and assigned work */}
      <div className="lg:col-span-8 space-y-6">
        {selectedEmp ? (
          <>
            {/* Stats Overview */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-xl font-black text-slate-800 leading-none">{selectedEmp.full_name}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase mt-1.5 tracking-wider">
                {selectedEmp.role_title || "Teknik Personel"} &bull; {selectedEmp.is_active ? "Aktif Çalışan" : "Pasif"}
              </p>

              <div className="grid gap-4 grid-cols-2 md:grid-cols-5 mt-6 border-t border-slate-100 pt-6 text-center md:text-left">
                <div className="p-3 border border-slate-100 rounded-2xl bg-slate-50/50">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Tamamlanan İş</p>
                  <p className="text-lg font-black text-slate-800 mt-1">{selectedEmp.stats.completedCount} Adet</p>
                </div>
                <div className="p-3 border border-slate-100 rounded-2xl bg-slate-50/50">
                  <p className="text-[10px] font-black text-slate-400 uppercase">İptal Edilen</p>
                  <p className="text-lg font-black text-slate-800 mt-1">{selectedEmp.stats.cancelledCount} Adet</p>
                </div>
                <div className="p-3 border border-slate-100 rounded-2xl bg-slate-50/50">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Toplam Süre</p>
                  <p className="text-lg font-black text-slate-800 mt-1">{selectedEmp.stats.workHours} Saat</p>
                </div>
                <div className="p-3 border border-slate-100 rounded-2xl bg-slate-50/50 col-span-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Maliyet</p>
                  <p className="text-lg font-black text-slate-800 mt-1">
                    {selectedEmp.stats.cost.toLocaleString("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="p-3 border border-slate-100 rounded-2xl bg-slate-50/50 col-span-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Getirdiği Ciro</p>
                  <p className="text-lg font-black text-emerald-600 mt-1">
                    {selectedEmp.stats.ciro.toLocaleString("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 0 })}
                  </p>
                </div>
              </div>

              {/* Working Hours/Days */}
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-slate-500 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <p className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>Çalışma Saatleri: <span className="font-extrabold text-slate-800">{selectedEmp.working_hours_start || "09:00"} - {selectedEmp.working_hours_end || "18:00"}</span></span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>Çalışma Günleri: <span className="font-extrabold text-slate-800">{(selectedEmp.working_days || []).join(", ")}</span></span>
                </p>
                {selectedEmp.notes && (
                  <p className="w-full mt-2 pt-2 border-t border-slate-200/60 font-medium text-slate-500">
                    Not: {selectedEmp.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Assigned Appointments (Daily, Weekly, Monthly) */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-3">Atanan İş Programı</h3>

              <div className="space-y-6">
                {/* 1. Daily */}
                <div>
                  <h4 className="text-xs font-black text-rose-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500" /> Bugünün İşleri ({todayApps.length})
                  </h4>
                  {todayApps.length === 0 ? (
                    <p className="text-xs font-semibold text-slate-400 italic pl-3">Bugün için atanmış randevu bulunmuyor.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {todayApps.map(a => (
                        <div key={a.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <p className="font-extrabold text-slate-800">{a.service_type}</p>
                            <p className="text-xs text-slate-500 mt-1">Müşteri: {a.customer?.name} &bull; Saat: {a.start_time.substring(0,5)} - {a.end_time.substring(0,5)}</p>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700 w-max">{a.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Weekly */}
                <div>
                  <h4 className="text-xs font-black text-cyan-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-cyan-600" /> Bu Haftanın Diğer Günleri ({weeklyApps.length})
                  </h4>
                  {weeklyApps.length === 0 ? (
                    <p className="text-xs font-semibold text-slate-400 italic pl-3">Bu hafta başka atanmış iş bulunmuyor.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {weeklyApps.map(a => (
                        <div key={a.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <p className="font-extrabold text-slate-800">{a.service_type}</p>
                            <p className="text-xs text-slate-500 mt-1">Müşteri: {a.customer?.name} &bull; Tarih: {a.appointment_date} @ {a.start_time.substring(0,5)}</p>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700 w-max">{a.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Monthly/Future */}
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-slate-400" /> Gelecek / Diğer Randevular ({monthlyApps.length})
                  </h4>
                  {monthlyApps.length === 0 ? (
                    <p className="text-xs font-semibold text-slate-400 italic pl-3">Gelecekte planlanmış başka iş bulunmuyor.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {monthlyApps.map(a => (
                        <div key={a.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <p className="font-extrabold text-slate-800">{a.service_type}</p>
                            <p className="text-xs text-slate-500 mt-1">Müşteri: {a.customer?.name} &bull; Tarih: {a.appointment_date} @ {a.start_time.substring(0,5)}</p>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700 w-max">{a.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
            <Contact className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-black text-slate-700">Personel Bulunamadı</h3>
            <p className="mt-2 text-sm font-semibold text-slate-400">
              Henüz teknik personel kaydetmediniz veya kayıtlı çalışan bulunmuyor.
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Employee Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white border-2 border-slate-300 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-xl font-black text-slate-800">
                {isEditMode ? "Personel Kartını Düzenle" : "Yeni Personel Kaydet"}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="h-10 w-10 flex items-center justify-center rounded-xl border-2 border-slate-200 hover:bg-slate-50"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 text-sm font-semibold mb-4">
                <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase">Ad Soyad *</label>
                <input
                  required
                  type="text"
                  value={formFullName}
                  onChange={(e) => setFormFullName(e.target.value)}
                  placeholder="Ahmet Yılmaz"
                  className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Telefon Numarası</label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="0555 123 4567"
                    className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">E-posta</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="ahmet@firmadi.com"
                    className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Görevi / Rolü</label>
                  <input
                    type="text"
                    value={formRoleTitle}
                    onChange={(e) => setFormRoleTitle(e.target.value)}
                    placeholder="Kamera Ustası, Stajyer vb."
                    className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Çalışma Başlangıç Saati</label>
                  <input
                    type="text"
                    value={formHoursStart}
                    onChange={(e) => setFormHoursStart(e.target.value)}
                    placeholder="09:00"
                    className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Çalışma Bitiş Saati</label>
                  <input
                    type="text"
                    value={formHoursEnd}
                    onChange={(e) => setFormHoursEnd(e.target.value)}
                    placeholder="18:00"
                    className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              {/* Working Days Checkboxes */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase">Çalışma Günleri</label>
                <div className="flex flex-wrap gap-2">
                  {weekDays.map((day) => {
                    const isChecked = formWorkingDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`h-9 px-3 rounded-lg text-xs font-black border transition-all ${
                          isChecked 
                            ? "bg-cyan-50 border-cyan-300 text-cyan-700" 
                            : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase">Özel Notlar</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Personel notları..."
                  className="w-full rounded-xl border-2 border-slate-200 bg-white p-3 text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="form-active"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="h-4 w-4 text-cyan-600 border-2 border-slate-300 rounded focus:ring-cyan-500"
                />
                <label htmlFor="form-active" className="text-xs font-black text-slate-700 uppercase cursor-pointer">
                  Bu personel aktif çalışıyor
                </label>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="h-11 px-5 rounded-xl border-2 border-slate-200 bg-white text-sm font-black text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 px-6 rounded-xl bg-cyan-600 border-2 border-cyan-700 text-white text-sm font-black hover:bg-cyan-700 transition-colors"
                >
                  {loading ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
