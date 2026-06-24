import Link from "next/link";
import { 
  ArrowRight, 
  Calendar, 
  Users, 
  Wrench, 
  AlertTriangle, 
  TrendingUp, 
  PiggyBank, 
  Receipt,
  Clock,
  UserPlus,
  History,
  MessageCircle,
  Package,
  CheckCircle2,
  DollarSign
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { AdminTable } from "@/components/admin/AdminTable";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { getLatestLeads } from "@/lib/admin/data";
import { getServiceDashboardStats } from "@/lib/admin/service-system";
import { adminResources } from "@/lib/admin/resources";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TodayProgramList, UpcomingAppointmentsList, DelayedJobsList } from "@/components/admin/dashboard/DashboardAppointmentsList";
import { DashboardStocksList } from "@/components/admin/dashboard/DashboardStocksList";
import { DashboardCustomersList } from "@/components/admin/dashboard/DashboardCustomersList";
import { isCriticalStock } from "@/lib/admin/stock";
import { toTurkeyDateKey } from "@/lib/admin/calendar-date";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const latestLeadsPromise = getLatestLeads();
  
  // Fetch service tracking stats
  let serviceStats = {
    todayAppointments: 0,
    tomorrowAppointments: 0,
    weeklyCompleted: 0,
    pendingOrders: 0,
    collectionPending: 0,
    totalCustomers: 0,
    monthlyCiro: 0,
    monthlyCost: 0,
    monthlyProfit: 0,
    lowStockCount: 0,
  };
  
  let upcomingAppointments: any[] = [];
  let todayProgram: any[] = [];
  let delayedJobs: any[] = [];
  let unpaidCustomers: any[] = [];
  let lowStockAlerts: any[] = [];
  let recentCustomers: any[] = [];
  let recentLogs: any[] = [];
  let allCustomers: any[] = [];
  let allEmployees: any[] = [];

  const todayStr = toTurkeyDateKey();

  try {
    serviceStats = await getServiceDashboardStats();
    
    // 1. Get upcoming appointments (excluding today)
    const { data: upcoming } = await supabase
      .from("appointments")
      .select("id, appointment_date, start_time, service_type, priority, status, customer:customer_id(name)")
      .gt("appointment_date", todayStr)
      .is("deleted_at", null)
      .order("appointment_date", { ascending: true })
      .order("start_time", { ascending: true })
      .limit(5);
    if (upcoming) upcomingAppointments = upcoming;

    // 2. Get today's program
    const { data: today } = await supabase
      .from("appointments")
      .select("id, appointment_date, start_time, end_time, service_type, status, priority, customer:customer_id(name)")
      .eq("appointment_date", todayStr)
      .is("deleted_at", null)
      .order("start_time", { ascending: true });
    if (today) todayProgram = today;

    // 3. Get delayed/overdue jobs (appointments past date and not completed/cancelled)
    const { data: delayed } = await supabase
      .from("appointments")
      .select("id, appointment_date, start_time, service_type, status, customer:customer_id(name)")
      .lt("appointment_date", todayStr)
      .is("deleted_at", null)
      .not("status", "in", '("İşlem Tamamlandı", "İptal Edildi", "Tahsilat Bekleniyor")')
      .order("appointment_date", { ascending: true });
    if (delayed) delayedJobs = delayed;

    // 4. Get collection pending customers
    const { data: unpaidOrders } = await supabase
      .from("service_orders")
      .select("id, order_number, grand_total, paid_amount, labor_price_currency, customer:customer_id(id, name, phone)")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });
    
    if (unpaidOrders) {
      // Aggregate unpaid by customer to get top debtor customers (Consolidated in TRY)
      const debtorsMap: { [key: string]: any } = {};
      unpaidOrders.forEach((o) => {
        const remaining = Number(o.grand_total) - Number(o.paid_amount);
        const currency = o.labor_price_currency || 'TRY';
        const remainingTRY = currency === 'USD' ? remaining * 34 : remaining;

        if (remainingTRY > 0.01 && o.customer) {
          const cust = (Array.isArray(o.customer) ? o.customer[0] : o.customer) as any;
          if (cust && cust.id) {
            const cid = cust.id;
            if (!debtorsMap[cid]) {
              debtorsMap[cid] = {
                name: cust.name,
                phone: cust.phone,
                remaining: 0,
              };
            }
            debtorsMap[cid].remaining += remainingTRY;
          }
        }
      });
      unpaidCustomers = Object.values(debtorsMap)
        .sort((a, b) => b.remaining - a.remaining)
        .slice(0, 5);
    }

    // 5. Get low stock materials
    const { data: mats } = await supabase
      .from("materials")
      .select("id, name, stock_quantity, min_stock_level, brand")
      .eq("is_active", true)
      .is("deleted_at", null);

    if (mats) {
      lowStockAlerts = mats.filter(m => isCriticalStock(m.stock_quantity)).slice(0, 5);
    }

    // 6. Get recently added customers
    const { data: recCustomers } = await supabase
      .from("customers")
      .select("id, name, phone, type, created_at")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(5);
    if (recCustomers) recentCustomers = recCustomers;

    // 7. Get recent activity logs
    const { data: logs } = await supabase
      .from("activity_logs")
      .select("id, user_fullname, action_type, target_table, created_at")
      .order("created_at", { ascending: false })
      .limit(5);
    if (logs) recentLogs = logs;

    // 8. Get all customers and employees for modals
    const { data: custs } = await supabase.from("customers").select("id, name, phone, address, city, district").is("deleted_at", null).order("name");
    if (custs) allCustomers = custs;

    const { data: emps } = await supabase.from("employees").select("id, full_name").eq("is_active", true).order("full_name");
    if (emps) allEmployees = emps;

  } catch (err) {
    console.error("Failed to load service tracking stats on dashboard:", err);
  }

  const latestLeads = await latestLeadsPromise;

  const actions = [
    {
      href: "/admin/calendar",
      title: "🗓️ Takvim & Planlama",
      desc: "Günlük, haftalık ve aylık randevuları planlayın",
      bg: "bg-cyan-50 border-cyan-200 text-cyan-900 hover:bg-cyan-100",
    },
    {
      href: "/admin/service-orders",
      title: "🔧 Servis & İş Emirleri",
      desc: "Malzeme düşüşü, maliyet ve iş emirlerini yönetin",
      bg: "bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100",
    },
    {
      href: "/admin/customers",
      title: "👥 Müşteri Yönetimi",
      desc: "Bireysel ve kurumsal detaylı müşteri rehberi",
      bg: "bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100",
    },
    {
      href: "/admin/stocks",
      title: "📦 Stok & Malzemeler",
      desc: "Seri no, min stok seviyeleri ve malzeme deposu",
      bg: "bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100",
    },
    {
      href: "/admin/employees",
      title: "👤 Personel Takibi",
      desc: "Çalışma saatleri ve ciro performans raporları",
      bg: "bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100",
    },
    {
      href: "/admin/reports",
      title: "📊 Finansal Raporlar",
      desc: "Gelir-gider, net kâr ve Excel/PDF raporlar",
      bg: "bg-rose-50 border-rose-200 text-rose-900 hover:bg-rose-100",
    },
  ];

  return (
    <ProtectedAdminPage>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <section className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl p-6 text-white shadow-md">
          <h2 className="text-2xl font-black md:text-3xl">Hoş Geldiniz! 👋</h2>
          <p className="mt-2 text-base font-medium text-cyan-100">
            Müşteri, randevu, servis ve stok süreçlerinizi tek bir panelden yönetin.
          </p>
        </section>

        {/* Quick Stats Grid */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-xl bg-white border-2 border-slate-200 p-4 text-center shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase">Bugün Randevu</p>
            <p className="text-2xl font-black text-cyan-600 mt-1">{serviceStats.todayAppointments}</p>
          </div>
          <div className="rounded-xl bg-white border-2 border-slate-200 p-4 text-center shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase">Yarın Randevu</p>
            <p className="text-2xl font-black text-blue-600 mt-1">{serviceStats.tomorrowAppointments}</p>
          </div>
          <div className="rounded-xl bg-white border-2 border-slate-200 p-4 text-center shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase">Haftalık Biten</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{serviceStats.weeklyCompleted}</p>
          </div>
          <div className="rounded-xl bg-white border-2 border-slate-200 p-4 text-center shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase">Bekleyen İş</p>
            <p className="text-2xl font-black text-amber-500 mt-1">{serviceStats.pendingOrders}</p>
          </div>
          <div className="rounded-xl bg-white border-2 border-slate-200 p-4 text-center shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase">Tahsilat Bekleyen</p>
            <p className="text-2xl font-black text-rose-500 mt-1">{serviceStats.collectionPending}</p>
          </div>
          <div className="rounded-xl bg-white border-2 border-slate-200 p-4 text-center shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase">Toplam Müşteri</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{serviceStats.totalCustomers}</p>
          </div>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-4 rounded-xl border-2 border-slate-200 bg-white p-5 shadow-sm">
            <div className="rounded-full bg-emerald-50 p-3 text-emerald-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase">Bu Ay Ciro</p>
              <p className="text-2xl font-black text-slate-800 mt-0.5">
                {serviceStats.monthlyCiro.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border-2 border-slate-200 bg-white p-5 shadow-sm">
            <div className="rounded-full bg-rose-50 p-3 text-rose-600">
              <Receipt className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase">Bu Ay Maliyet</p>
              <p className="text-2xl font-black text-slate-800 mt-0.5">
                {serviceStats.monthlyCost.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border-2 border-slate-200 bg-white p-5 shadow-sm">
            <div className="rounded-full bg-blue-50 p-3 text-blue-600">
              <PiggyBank className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase">Bu Ay Net Kâr</p>
              <p className="text-2xl font-black text-emerald-600 mt-0.5">
                {serviceStats.monthlyProfit.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
              </p>
            </div>
          </div>
        </div>

        {/* Low Stock Banner Alert */}
        {serviceStats.lowStockCount > 0 && (
          <div className="flex items-center gap-3 rounded-xl border-2 border-amber-200 bg-amber-50 p-4 text-amber-800">
            <AlertTriangle className="h-6 w-6 shrink-0 text-amber-600 animate-bounce" />
            <div className="min-w-0 flex-1">
              <p className="font-extrabold text-sm sm:text-base">Kritik Stok Uyarısı!</p>
              <p className="text-xs font-medium mt-0.5 truncate">
                Deponuzda limitlerin altına düşmüş <span className="font-black text-amber-900">{serviceStats.lowStockCount} farklı malzeme</span> bulunuyor.
              </p>
            </div>
            <Link
              href="/admin/stocks"
              className="ml-auto inline-flex h-9 items-center justify-center rounded-lg bg-amber-600 px-4 text-xs font-bold text-white hover:bg-amber-700 transition-colors shrink-0"
            >
              Stokları Gör
            </Link>
          </div>
        )}

        {/* Action Grid */}
        <section>
          <h3 className="text-lg font-black text-slate-800 mb-3">🛠️ Servis ve Randevu İşlemleri</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {actions.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className={`flex items-center justify-between rounded-2xl border-2 p-5 shadow-sm transition-all hover:scale-[1.01] ${a.bg}`}
              >
                <div>
                  <span className="text-lg font-black">{a.title}</span>
                  <span className="block text-sm font-medium mt-1 opacity-80">{a.desc}</span>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* Double Column Program Panels */}
        <div className="grid gap-6 md:grid-cols-2">
          <TodayProgramList todayProgram={todayProgram} customers={allCustomers} employees={allEmployees} />
          <UpcomingAppointmentsList upcomingAppointments={upcomingAppointments} customers={allCustomers} employees={allEmployees} />
        </div>

        {/* Double Column Alerts Panels */}
        <div className="grid gap-6 md:grid-cols-2">
          <DelayedJobsList delayedJobs={delayedJobs} customers={allCustomers} employees={allEmployees} />
          <DashboardStocksList lowStockAlerts={lowStockAlerts} />
        </div>

        {/* Double Column Customer/Debtors Panels */}
        <div className="grid gap-6 md:grid-cols-2">
          <DashboardCustomersList recentCustomers={recentCustomers} unpaidCustomers={unpaidCustomers} />
        </div>

        {/* 7. Son Yapılan İşlemler (Activity Logs) */}
        <section className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <History className="h-5 w-5 text-cyan-600" /> Son Yapılan Değişiklikler (Sistem Günlüğü)
            </h3>
          </div>

          {recentLogs.length === 0 ? (
            <div className="py-8 text-center text-sm font-semibold text-slate-400">
              Herhangi bir işlem geçmişi kaydı bulunmuyor.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 text-xs sm:text-sm">
              {recentLogs.map((log) => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-black text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10px] uppercase">
                      {log.action_type === 'INSERT' ? 'Yeni' : log.action_type === 'DELETE' ? 'Silme' : 'Güncelleme'}
                    </span>
                    <p className="font-semibold text-slate-600">
                      <span className="font-extrabold text-slate-800">{log.user_fullname}</span>,{" "}
                      <span className="font-extrabold text-slate-800 uppercase">{log.target_table}</span> tablosunu güncelledi.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 text-right">
                    {new Date(log.created_at).toLocaleString("tr-TR")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Existing Latest leads (Web Mesajları) */}
        <section className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-cyan-600" /> Son Gelen Web İletişim Mesajları
            </h3>
            <Link href="/admin/leads" className="text-xs font-black text-cyan-600 hover:text-cyan-700">Tüm Mesajlar →</Link>
          </div>
          <AdminTable
            resource={{ ...adminResources.leads, canCreate: false, canEdit: true, canDelete: false }}
            rows={latestLeads}
          />
        </section>
      </div>
    </ProtectedAdminPage>
  );
}
