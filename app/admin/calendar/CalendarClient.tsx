"use client";

import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  AlertTriangle,
  CheckCircle,
  X,
  Trash2,
  AlertCircle,
  Navigation,
  MessageCircle,
} from "lucide-react";
import { saveAppointment, updateAppointmentDate, deleteAppointment, createQuickCustomer } from "./actions";
import { isDateKeyOnOrAfter, toCalendarDateKey } from "@/lib/admin/calendar-date";
import { customerWhatsappUrl, phoneCallUrl } from "@/lib/whatsapp";

type DBAppointment = {
  id: string;
  customer_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  service_type: string;
  description: string | null;
  customer_issue: string | null;
  address: string | null;
  city: string | null;
  district: string | null;
  location_link: string | null;
  employee_id: string | null;
  assistant_employee_id: string | null;
  priority: 'normal' | 'önemli' | 'acil';
  status: string;
  internal_notes: string | null;
  customer_notes: string | null;
  reminder_time: string;
  customer?: { name: string; phone: string; city: string; district: string; address: string };
  employee?: { full_name: string };
  assistant?: { full_name: string };
};

type DBCustomer = {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  city: string | null;
  district: string | null;
  type: string;
};

type DBEmployee = {
  id: string;
  full_name: string;
  role_title: string | null;
};

type Props = {
  initialAppointments: any[];
  customers: DBCustomer[];
  employees: DBEmployee[];
};

const TURKISH_MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", 
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

const TURKISH_DAYS_SHORT = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Planlandı": { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-300" },
  "Müşteri Arandı": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-300" },
  "Yola Çıkıldı": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-300" },
  "İşlem Başladı": { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-300" },
  "Malzeme Bekleniyor": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-300" },
  "İşlem Tamamlandı": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-300" },
  "İptal Edildi": { bg: "bg-red-50", text: "text-red-700", border: "border-red-300" },
  "Ertelendi": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-300" },
  "Tahsilat Bekleniyor": { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-300" }
};

export function CalendarClient({ initialAppointments, customers: initialCustomers, employees }: Props) {
  const [appointments, setAppointments] = useState<DBAppointment[]>(initialAppointments);
  const [customers, setCustomers] = useState<DBCustomer[]>(initialCustomers);
  const [view, setView] = useState<'month' | 'week' | 'day' | 'list'>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Partial<DBAppointment> | null>(null);
  const [isQuickCustomerOpen, setIsQuickCustomerOpen] = useState(false);
  const [popupDate, setPopupDate] = useState<string | null>(null);
  
  // Feedback state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Quick Customer inputs
  const [quickName, setQuickName] = useState("");
  const [quickPhone, setQuickPhone] = useState("");
  const [quickAddress, setQuickAddress] = useState("");
  const [quickType, setQuickType] = useState<'bireysel' | 'kurumsal'>('bireysel');

  // Drag states
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);

  // -------------------------------------------------------------
  // DATE CALCULATION FUNCTIONS (Turkish standard Monday-start)
  // -------------------------------------------------------------
  
  const getStartOfWeek = (date: Date) => {
    const temp = new Date(date);
    const day = temp.getDay();
    const diff = temp.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    return new Date(temp.setDate(diff));
  };

  const formatDateString = (date: Date) => {
    return toCalendarDateKey(date);
  };

  const getDaysInMonthGrid = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay(); // Sun:0, Mon:1 ...
    
    // Days in current month
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const grid: Date[] = [];
    
    // Fill previous month offset
    const prevMonthDaysOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    for (let i = prevMonthDaysOffset - 1; i >= 0; i--) {
      grid.push(new Date(year, month - 1, prevMonthTotalDays - i));
    }
    
    // Fill current month
    for (let i = 1; i <= totalDays; i++) {
      grid.push(new Date(year, month, i));
    }
    
    // Fill next month offset to form complete grid of 6 weeks (42 days)
    const remainingDays = 42 - grid.length;
    for (let i = 1; i <= remainingDays; i++) {
      grid.push(new Date(year, month + 1, i));
    }
    
    return grid;
  };

  const getWeekDays = (date: Date) => {
    const start = getStartOfWeek(date);
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  };

  // Navigations
  const handlePrev = () => {
    const temp = new Date(currentDate);
    if (view === 'month') temp.setMonth(temp.getMonth() - 1);
    else if (view === 'week') temp.setDate(temp.getDate() - 7);
    else if (view === 'day') temp.setDate(temp.getDate() - 1);
    setCurrentDate(temp);
  };

  const handleNext = () => {
    const temp = new Date(currentDate);
    if (view === 'month') temp.setMonth(temp.getMonth() + 1);
    else if (view === 'week') temp.setDate(temp.getDate() + 7);
    else if (view === 'day') temp.setDate(temp.getDate() + 1);
    setCurrentDate(temp);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // -------------------------------------------------------------
  // DRAG & DROP HANDLERS
  // -------------------------------------------------------------

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedAppId(id);
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetDate: string) => {
    e.preventDefault();
    const id = draggedAppId || e.dataTransfer.getData("text/plain");
    if (!id) return;
    
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await updateAppointmentDate(id, targetDate);
    if (res.success) {
      setAppointments(prev => 
        prev.map(app => app.id === id ? { ...app, appointment_date: targetDate } : app)
      );
      setSuccessMsg("Randevu tarihi başarıyla güncellendi.");
    } else {
      setErrorMsg(res.error || "Tarih güncellenirken bir hata oluştu.");
    }
    setLoading(false);
    setDraggedAppId(null);
  };

  // -------------------------------------------------------------
  // MODAL LOGIC (SAVE/DELETE/QUICK CUSTOMER)
  // -------------------------------------------------------------

  const handleOpenAddModal = (date?: string) => {
    const initialDate = date || formatDateString(new Date());
    setEditingApp({
      appointment_date: initialDate,
      start_time: "09:00",
      end_time: "10:00",
      priority: "normal",
      status: "Planlandı",
      service_type: "CCTV Kamera Kurulumu",
      reminder_time: "30_min"
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (app: DBAppointment) => {
    setEditingApp(app);
    setIsModalOpen(true);
  };

  const handleSaveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp?.customer_id) {
      setErrorMsg("Lütfen bir müşteri seçin.");
      return;
    }
    if (!editingApp?.service_type) {
      setErrorMsg("Lütfen yapılacak hizmeti girin.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await saveAppointment(editingApp as any);
    if (res.success) {
      setSuccessMsg("Randevu başarıyla kaydedildi.");
      setIsModalOpen(false);
      
      // Reload page to fetch full references from server
      window.location.reload();
    } else {
      setErrorMsg(res.error || "Randevu kaydedilirken bir hata oluştu.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu randevuyu iptal edip silmek istediğinizden emin misiniz?")) return;
    setLoading(true);
    const res = await deleteAppointment(id);
    if (res.success) {
      setAppointments(prev => prev.filter(app => app.id !== id));
      setSuccessMsg("Randevu iptal edildi ve silindi.");
      setIsModalOpen(false);
    } else {
      setErrorMsg(res.error || "İşlem başarısız.");
    }
    setLoading(false);
  };

  const handleQuickCustomerSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName || !quickPhone) {
      alert("Müşteri adı ve telefon numarası zorunludur.");
      return;
    }

    setLoading(true);
    const res = await createQuickCustomer(quickName, quickPhone, quickAddress, quickType);
    if (res.success && res.data) {
      setCustomers(prev => [...prev, res.data].sort((a,b) => a.name.localeCompare(b.name)));
      setEditingApp(prev => prev ? { ...prev, customer_id: res.data.id } : null);
      setIsQuickCustomerOpen(false);
      setQuickName("");
      setQuickPhone("");
      setQuickAddress("");
      alert("Yeni müşteri hızlıca eklendi ve seçildi.");
    } else {
      alert(res.error || "Müşteri kaydedilemedi.");
    }
    setLoading(false);
  };

  // -------------------------------------------------------------
  // RENDER HELPERS
  // -------------------------------------------------------------

  const filterAppointmentsForDate = (dateStr: string) => {
    return appointments.filter(app => app.appointment_date === dateStr);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert Feedback */}
      {successMsg && (
        <div className="flex items-center gap-3 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4 text-emerald-800 font-extrabold text-sm shadow-sm">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="ml-auto text-emerald-600 hover:text-emerald-800"><X className="h-4 w-4" /></button>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-3 rounded-xl border-2 border-red-200 bg-red-50 p-4 text-red-800 font-extrabold text-sm shadow-sm">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="ml-auto text-red-600 hover:text-red-800"><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Control Bar: Month, Navigation & View Toggle */}
      <div className="flex flex-col gap-3 bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-slate-600" />
            </button>
            
            <button
              onClick={handleToday}
              className="h-10 px-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-black text-slate-800 hover:bg-slate-50 transition-colors"
            >
              Bugün
            </button>
            
            <button
              onClick={handleNext}
              className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          <span className="text-base sm:text-lg font-black text-slate-800">
            {TURKISH_MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
        </div>

        {/* View Switchers */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl">
          {(['month', 'week', 'day', 'list'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`h-9 px-3 rounded-lg text-xs font-black transition-colors ${
                view === v 
                  ? "bg-white text-cyan-600 shadow-sm" 
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              {v === 'month' ? "Aylık" : v === 'week' ? "Haftalık" : v === 'day' ? "Günlük" : "Liste"}
            </button>
          ))}

          <button
            onClick={() => handleOpenAddModal()}
            className="h-9 px-3 rounded-lg text-xs font-black bg-cyan-600 text-white hover:bg-cyan-700 transition-colors flex items-center gap-1.5 ml-auto"
          >
            <Plus className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Randevu Ekle</span><span className="sm:hidden">Ekle</span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
          Aylık Görünüm (MONTH VIEW)
         ------------------------------------------------------------- */}
      {view === 'month' && (
        <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Day Names header */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center">
            {TURKISH_DAYS_SHORT.map(d => (
              <div key={d} className="py-3 text-xs font-black text-slate-500 uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>
          
          {/* Grid Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
            {getDaysInMonthGrid(currentDate).map((day, idx) => {
              const dateStr = formatDateString(day);
              const dayApps = filterAppointmentsForDate(dateStr);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = formatDateString(new Date()) === dateStr;

              return (
                <div
                  key={idx}
                  className={`p-0.5 sm:p-1.5 flex flex-col group min-h-[60px] sm:min-h-[110px] transition-colors relative cursor-pointer hover:bg-slate-50/50 ${
                    isCurrentMonth ? "bg-white" : "bg-slate-50/50"
                  } ${isToday ? "bg-cyan-50/20 ring-2 ring-inset ring-cyan-400" : ""}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, dateStr)}
                  onClick={() => { setCurrentDate(day); setView("day"); }}
                >
                  {/* Cell Header */}
                  <div className="flex items-center justify-between p-0.5 sm:p-1">
                    <span className={`text-[10px] sm:text-xs font-black rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center ${
                      isToday ? "bg-cyan-600 text-white" : isCurrentMonth ? "text-slate-700" : "text-slate-400"
                    }`}>
                      {day.getDate()}
                    </span>
                    
                    {dayApps.length > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPopupDate(dateStr);
                        }}
                        className="flex gap-0.5 p-1 rounded hover:bg-slate-100 transition-colors shrink-0 z-10"
                        title="Günlük detayları gör"
                      >
                        {dayApps.slice(0, 4).map(app => {
                          const statusColorsMap: Record<string, string> = {
                            "Planlandı": "bg-slate-400",
                            "Müşteri Arandı": "bg-blue-500",
                            "Yola Çıkıldı": "bg-indigo-500",
                            "İşlem Başladı": "bg-cyan-500",
                            "Malzeme Bekleniyor": "bg-amber-500",
                            "İşlem Tamamlandı": "bg-emerald-500",
                            "İptal Edildi": "bg-red-500",
                            "Ertelendi": "bg-purple-500",
                            "Tahsilat Bekleniyor": "bg-rose-500"
                          };
                          const dotColor = statusColorsMap[app.status] || "bg-slate-400";
                          return (
                            <span
                              key={app.id}
                              className={`h-1.5 w-1.5 rounded-full ${dotColor} inline-block shrink-0`}
                            />
                          );
                        })}
                        {dayApps.length > 4 && (
                          <span className="text-[8px] leading-none text-slate-500 font-black">+</span>
                        )}
                      </button>
                    )}

                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenAddModal(dateStr); }}
                      className="hidden group-hover:inline-flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 z-10"
                      title="Yeni Randevu"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* List of cards */}
                  <div className="hidden sm:block flex-1 overflow-y-auto space-y-0.5 sm:space-y-1 mt-0.5 sm:mt-1 max-h-[80px] sm:max-h-[140px] scrollbar-thin">
                    {dayApps.map(app => {
                      const color = STATUS_COLORS[app.status] || { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-300" };
                      return (
                        <div
                          key={app.id}
                          draggable
                          onDragStart={(e) => { e.stopPropagation(); handleDragStart(e, app.id); }}
                          onClick={(e) => { e.stopPropagation(); handleOpenEditModal(app); }}
                          className="p-1 sm:p-1.5 rounded-lg border text-[9px] sm:text-[11px] font-semibold cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform bg-white text-slate-700 border-slate-200"
                          title={`${app.customer?.name} - ${app.service_type}`}
                        >
                          <div className="flex justify-between font-black">
                            <span className="truncate max-w-[40px] sm:max-w-[80px]">{app.customer?.name || "Müşteri"}</span>
                            <span className="hidden sm:inline">{app.start_time.substring(0, 5)}</span>
                          </div>
                          <p className="truncate mt-0.5 opacity-80 hidden sm:block">{app.service_type}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          Haftalık Görünüm (WEEK VIEW)
         ------------------------------------------------------------- */}
      {view === 'week' && (
        <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto scrollbar-thin">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center min-w-[700px]">
            {getWeekDays(currentDate).map((day, idx) => {
              const dateStr = formatDateString(day);
              const isToday = formatDateString(new Date()) === dateStr;
              return (
                <div key={idx} className={`py-3 border-r border-slate-200 last:border-0 ${isToday ? "bg-cyan-50/50" : ""}`}>
                  <p className="text-xs font-black text-slate-400 uppercase">{TURKISH_DAYS_SHORT[idx]}</p>
                  <p className={`mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-black ${
                    isToday ? "bg-cyan-600 text-white" : "text-slate-800"
                  }`}>{day.getDate()}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-7 divide-x divide-slate-100 min-h-[450px] min-w-[700px]">
            {getWeekDays(currentDate).map((day, idx) => {
              const dateStr = formatDateString(day);
              const dayApps = filterAppointmentsForDate(dateStr);
              return (
                <div
                  key={idx}
                  className="p-2 space-y-2 bg-slate-50/10 min-h-[400px]"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, dateStr)}
                >
                  {dayApps.map(app => {
                    const color = STATUS_COLORS[app.status] || { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-300" };
                    return (
                      <div
                        key={app.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, app.id)}
                        onClick={() => handleOpenEditModal(app)}
                        className={`p-2 rounded-xl border text-xs font-semibold cursor-pointer shadow-sm hover:scale-[1.01] transition-transform ${color.bg} ${color.text} ${color.border}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-black text-slate-800 truncate max-w-[80px]">{app.customer?.name || "Müşteri"}</span>
                          <span className="text-[10px] bg-white/60 px-1 py-0.5 rounded">{app.start_time.substring(0, 5)}</span>
                        </div>
                        <p className="font-extrabold opacity-95 truncate">{app.service_type}</p>
                        <p className="text-[10px] mt-1 opacity-70 flex items-center gap-1"><MapPin className="h-3 w-3 shrink-0" /> {app.district || app.customer?.district || 'Belirtilmemiş'}</p>
                      </div>
                    );
                  })}
                  
                  <button
                    onClick={() => handleOpenAddModal(dateStr)}
                    className="w-full py-3 border-2 border-dashed border-slate-200 hover:border-cyan-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-cyan-600 transition-colors text-xs font-bold"
                  >
                    <Plus className="h-4 w-4 mb-1" /> Yeni
                  </button>
                </div>
              );
            })}
          </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          Günlük Görünüm (DAY VIEW)
         ------------------------------------------------------------- */}
      {view === 'day' && (
        <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden p-5 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-800">
              {currentDate.getDate()} {TURKISH_MONTHS[currentDate.getMonth()]} Programı
            </h3>
            <button
              onClick={() => handleOpenAddModal(formatDateString(currentDate))}
              className="inline-flex h-9 px-4 rounded-xl bg-cyan-600 text-white text-xs font-black hover:bg-cyan-700 transition-colors items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Bugün Yeni Plan
            </button>
          </div>

          {filterAppointmentsForDate(formatDateString(currentDate)).length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm font-semibold">
              Bugün için planlanmış bir randevu bulunmamaktadır.
            </div>
          ) : (
            <div className="space-y-3">
              {filterAppointmentsForDate(formatDateString(currentDate)).map(app => {
                const color = STATUS_COLORS[app.status] || { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-300" };
                return (
                  <div
                    key={app.id}
                    onClick={() => handleOpenEditModal(app)}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:scale-[1.01] transition-transform ${color.bg} ${color.text} ${color.border}`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base text-slate-800">{app.customer?.name}</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white/60">{app.status}</span>
                      </div>
                      <p className="font-extrabold text-sm">{app.service_type}</p>
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-1">
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {app.start_time.substring(0, 5)} - {app.end_time.substring(0, 5)}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {app.customer?.address || app.address}</span>
                        {app.employee && <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {app.employee.full_name}</span>}
                      </div>
                    </div>

                    <span className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-black ${
                      app.priority === 'acil' ? 'bg-red-100 text-red-700 border border-red-200' :
                      app.priority === 'önemli' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {app.priority.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------
          Liste Görünümü (LIST VIEW)
         ------------------------------------------------------------- */}
      {view === 'list' && (
        <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-black text-slate-800">Gelecek Randevu Listesi</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-black text-xs uppercase">
                  <th className="p-3">Müşteri</th>
                  <th className="p-3">Tarih / Saat</th>
                  <th className="p-3">Hizmet Türü</th>
                  <th className="p-3">Personel</th>
                  <th className="p-3">Öncelik</th>
                  <th className="p-3">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {appointments
                  .filter(app => isDateKeyOnOrAfter(app.appointment_date, formatDateString(new Date())))
                  .sort((a,b) => a.appointment_date.localeCompare(b.appointment_date))
                  .map(app => {
                    const color = STATUS_COLORS[app.status] || { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-300" };
                    return (
                      <tr
                        key={app.id}
                        onClick={() => handleOpenEditModal(app)}
                        className="hover:bg-slate-50 cursor-pointer"
                      >
                        <td className="p-3 font-extrabold text-slate-800">{app.customer?.name}</td>
                        <td className="p-3 text-slate-600">
                          {app.appointment_date} <span className="text-slate-400 font-bold ml-1">{app.start_time.substring(0, 5)}</span>
                        </td>
                        <td className="p-3 font-bold text-slate-700">{app.service_type}</td>
                        <td className="p-3 text-slate-500">{app.employee?.full_name || "Atanmamış"}</td>
                        <td className="p-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${
                            app.priority === 'acil' ? 'bg-red-50 text-red-600 border border-red-200' :
                            app.priority === 'önemli' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                            'bg-slate-50 text-slate-600 border border-slate-200'
                          }`}>
                            {app.priority}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${color.bg} ${color.text} border ${color.border}`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          RANDUVU EKLE / DÜZENLE MODALI
         ------------------------------------------------------------- */}
      {isModalOpen && editingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-800">
                {editingApp.id ? "🗓️ Randevu Düzenle" : "🗓️ Yeni Randevu Planla"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Quick validation error inside modal */}
            {errorMsg && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-bold text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveAppointment} className="mt-6 space-y-4">
              
              {/* Müşteri Seçimi / Ekleme */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-black text-slate-700">Müşteri Seçin *</label>
                  <button
                    type="button"
                    onClick={() => setIsQuickCustomerOpen(true)}
                    className="text-xs font-black text-cyan-600 hover:text-cyan-700"
                  >
                    + Hızlı Müşteri Oluştur
                  </button>
                </div>
                <select
                  required
                  value={editingApp.customer_id || ""}
                  onChange={(e) => {
                    const c = customers.find(x => x.id === e.target.value);
                    setEditingApp(prev => prev ? { 
                      ...prev, 
                      customer_id: e.target.value,
                      address: c?.address || prev.address,
                      city: c?.city || prev.city,
                      district: c?.district || prev.district
                    } : null);
                  }}
                  className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
                >
                  <option value="">-- Müşteri Seçin --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                  ))}
                </select>
              </div>

              {/* Randevu Tarihi ve Zamanı */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-black text-slate-700">Randevu Tarihi *</label>
                  <input
                    type="date"
                    required
                    value={editingApp.appointment_date || ""}
                    onChange={(e) => setEditingApp(prev => prev ? { ...prev, appointment_date: e.target.value } : null)}
                    className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700">Başlangıç Saati *</label>
                  <input
                    type="time"
                    required
                    value={editingApp.start_time?.substring(0, 5) || ""}
                    onChange={(e) => setEditingApp(prev => prev ? { ...prev, start_time: e.target.value } : null)}
                    className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700">Tahmini Bitiş Saati *</label>
                  <input
                    type="time"
                    required
                    value={editingApp.end_time?.substring(0, 5) || ""}
                    onChange={(e) => setEditingApp(prev => prev ? { ...prev, end_time: e.target.value } : null)}
                    className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
                  />
                </div>
              </div>

              {/* Yapılacak Hizmet ve Sorun */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-black text-slate-700">Yapılacak Hizmet *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: CCTV Kamera Kurulumu"
                    value={editingApp.service_type || ""}
                    onChange={(e) => setEditingApp(prev => prev ? { ...prev, service_type: e.target.value } : null)}
                    className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700">Müşterinin Bildirdiği Sorun (Varsa)</label>
                  <input
                    type="text"
                    placeholder="Örn: Kameralarda gece görüşü çalışmıyor"
                    value={editingApp.customer_issue || ""}
                    onChange={(e) => setEditingApp(prev => prev ? { ...prev, customer_issue: e.target.value } : null)}
                    className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
                  />
                </div>
              </div>

              {/* Personel Atamaları */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-black text-slate-700">Görevli Personel (Usta)</label>
                  <select
                    value={editingApp.employee_id || ""}
                    onChange={(e) => setEditingApp(prev => prev ? { ...prev, employee_id: e.target.value || undefined } : null)}
                    className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
                  >
                    <option value="">Seçilmedi</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.role_title || 'Usta'})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700">Yardımcı Personel</label>
                  <select
                    value={editingApp.assistant_employee_id || ""}
                    onChange={(e) => setEditingApp(prev => prev ? { ...prev, assistant_employee_id: e.target.value || undefined } : null)}
                    className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
                  >
                    <option value="">Seçilmedi</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Öncelik & Randevu Durumu */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-black text-slate-700">Öncelik Seviyesi</label>
                  <select
                    value={editingApp.priority || "normal"}
                    onChange={(e) => setEditingApp(prev => prev ? { ...prev, priority: e.target.value as any } : null)}
                    className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
                  >
                    <option value="normal">Normal</option>
                    <option value="önemli">Önemli</option>
                    <option value="acil">Acil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700">Randevu Durumu</label>
                  <select
                    value={editingApp.status || "Planlandı"}
                    onChange={(e) => setEditingApp(prev => prev ? { ...prev, status: e.target.value } : null)}
                    className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
                  >
                    {Object.keys(STATUS_COLORS).map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700">Hatırlatma</label>
                  <select
                    value={editingApp.reminder_time || "30_min"}
                    onChange={(e) => setEditingApp(prev => prev ? { ...prev, reminder_time: e.target.value } : null)}
                    className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
                  >
                    <option value="15_min">15 Dakika Önce</option>
                    <option value="30_min">30 Dakika Önce</option>
                    <option value="1_hour">1 Saat Önce</option>
                    <option value="1_day">1 Gün Önce</option>
                  </select>
                </div>
              </div>

              {/* Adres Bilgileri */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-black text-slate-700">Hizmet Adresi</label>
                  <input
                    type="text"
                    value={editingApp.address || ""}
                    onChange={(e) => setEditingApp(prev => prev ? { ...prev, address: e.target.value } : null)}
                    className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700">İlçe</label>
                  <input
                    type="text"
                    value={editingApp.district || ""}
                    onChange={(e) => setEditingApp(prev => prev ? { ...prev, district: e.target.value } : null)}
                    className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
                  />
                </div>
              </div>

              {/* Konum Bağlantısı */}
              <div>
                <label className="block text-sm font-black text-slate-700">Harita Konum Bağlantısı (URL)</label>
                <input
                  type="text"
                  placeholder="https://maps.google.com/..."
                  value={editingApp.location_link || ""}
                  onChange={(e) => setEditingApp(prev => prev ? { ...prev, location_link: e.target.value } : null)}
                  className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
                />
              </div>

              {/* Notlar */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-black text-slate-700">İç Yönetici Notu</label>
                  <textarea
                    value={editingApp.internal_notes || ""}
                    onChange={(e) => setEditingApp(prev => prev ? { ...prev, internal_notes: e.target.value } : null)}
                    rows={2}
                    className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white p-3 text-sm outline-none focus:border-cyan-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700">Müşteriye İletilecek Not</label>
                  <textarea
                    value={editingApp.customer_notes || ""}
                    onChange={(e) => setEditingApp(prev => prev ? { ...prev, customer_notes: e.target.value } : null)}
                    rows={2}
                    className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white p-3 text-sm outline-none focus:border-cyan-500 font-semibold"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-slate-100 mt-6">
                {editingApp.id && (
                  <button
                    type="button"
                    onClick={() => handleDelete(editingApp.id!)}
                    className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl border-2 border-red-200 bg-red-50 px-5 text-sm font-black text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" /> Randevuyu Sil (İptal Et)
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-5 text-sm font-black text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-cyan-600 border-2 border-cyan-700 px-6 text-sm font-black text-white hover:bg-cyan-700 transition-colors"
                >
                  {loading ? "Kaydediliyor..." : "Randevuyu Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── GÜNLÜK DETAY POPUP MODALI ──────────────────────────────── */}
      {popupDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white border-2 border-slate-200 rounded-3xl shadow-2xl flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-lg font-black text-slate-800">
                  📅 {new Date(popupDate + "T12:00:00").getDate()} {TURKISH_MONTHS[new Date(popupDate + "T12:00:00").getMonth()]} {new Date(popupDate + "T12:00:00").getFullYear()}
                </h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">O günün randevu detayları ve iş yerleri</p>
              </div>
              <button
                type="button"
                onClick={() => setPopupDate(null)}
                className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 p-6 space-y-3 scrollbar-thin">
              {filterAppointmentsForDate(popupDate).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 font-semibold text-sm">Bu tarihte randevu bulunmuyor.</p>
                </div>
              ) : (
                filterAppointmentsForDate(popupDate).map(app => {
                  const color = STATUS_COLORS[app.status] || { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-300" };
                  return (
                    <div key={app.id} className={`p-4 rounded-2xl border-2 ${color.border} ${color.bg} space-y-3 text-left`}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-black text-slate-800">{app.start_time.substring(0, 5)} - {app.end_time.substring(0, 5)}</span>
                            {app.priority !== "normal" && (
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-black ${app.priority === "acil" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                                {app.priority.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <h4 className="font-extrabold text-slate-800 text-sm mt-1">{app.customer?.name || "Bilinmeyen Müşteri"}</h4>
                          <p className={`text-xs font-bold mt-0.5 ${color.text}`}>{app.service_type}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black border ${color.border} ${color.bg} ${color.text}`}>
                          {app.status}
                        </span>
                      </div>

                      {app.address && (
                        <div className="flex items-start gap-1.5 text-xs text-slate-600 bg-white/50 p-2.5 rounded-xl border border-white/60">
                          <MapPin className="h-3.5 w-3.5 text-cyan-600 shrink-0 mt-0.5" />
                          <span>{app.address} {app.district ? `(${app.district})` : ""}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2 border-t border-white/40">
                        {app.customer?.phone && (
                          <a
                            href={phoneCallUrl(app.customer.phone)}
                            className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-white border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Phone className="h-3.5 w-3.5 text-emerald-600" /> Ara
                          </a>
                        )}
                        {app.customer?.phone && (
                          <a
                            href={customerWhatsappUrl(app.customer.phone, app.customer.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-[#25D366] text-xs font-black text-white hover:bg-[#20ba59] transition-colors"
                          >
                            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                          </a>
                        )}
                        {app.location_link && (
                          <a
                            href={app.location_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 h-9 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 transition-colors"
                          >
                            <Navigation className="h-3.5 w-3.5" /> Yol Tarifi
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setPopupDate(null);
                            handleOpenEditModal(app);
                          }}
                          className="flex-1 h-9 rounded-xl bg-cyan-600 text-white text-xs font-black hover:bg-cyan-700 transition-colors"
                        >
                          Düzenle
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl shrink-0">
              <button
                type="button"
                onClick={() => setPopupDate(null)}
                className="flex-1 inline-flex h-11 items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-sm font-black text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Kapat
              </button>
              <button
                type="button"
                onClick={() => {
                  setPopupDate(null);
                  handleOpenAddModal(popupDate);
                }}
                className="flex-1 inline-flex h-11 items-center justify-center rounded-xl bg-cyan-600 border-2 border-cyan-700 text-sm font-black text-white hover:bg-cyan-700 transition-colors"
              >
                Yeni Randevu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          HIZLI MÜŞTERİ EKLEME ALT MODALI
         ------------------------------------------------------------- */}
      {isQuickCustomerOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white border-2 border-slate-200 rounded-3xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-lg font-black text-slate-800">👤 Hızlı Müşteri Kaydı</h4>
              <button onClick={() => setIsQuickCustomerOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleQuickCustomerSave} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider">Müşteri Tipi</label>
                <div className="mt-2 flex gap-4">
                  <label className="inline-flex items-center font-bold text-sm">
                    <input
                      type="radio"
                      name="quick_type"
                      checked={quickType === 'bireysel'}
                      onChange={() => setQuickType('bireysel')}
                      className="mr-2"
                    />
                    Bireysel
                  </label>
                  <label className="inline-flex items-center font-bold text-sm">
                    <input
                      type="radio"
                      name="quick_type"
                      checked={quickType === 'kurumsal'}
                      onChange={() => setQuickType('kurumsal')}
                      className="mr-2"
                    />
                    Kurumsal
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider">Ad Soyad / Firma Adı *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Ahmet Yılmaz veya ABC Ltd. Şti."
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-11 text-sm outline-none focus:border-cyan-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider">Telefon Numarası *</label>
                <input
                  type="tel"
                  required
                  placeholder="Örn: 05321234567"
                  value={quickPhone}
                  onChange={(e) => setQuickPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-11 text-sm outline-none focus:border-cyan-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider">Adres</label>
                <input
                  type="text"
                  placeholder="Açık adres..."
                  value={quickAddress}
                  onChange={(e) => setQuickAddress(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-11 text-sm outline-none focus:border-cyan-500 font-semibold"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 mt-5">
                <button
                  type="button"
                  onClick={() => setIsQuickCustomerOpen(false)}
                  className="h-10 px-4 rounded-xl border-2 border-slate-200 bg-white text-xs font-black text-slate-600"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-cyan-600 border-2 border-cyan-700 text-xs font-black text-white hover:bg-cyan-700"
                >
                  Müşteriyi Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
