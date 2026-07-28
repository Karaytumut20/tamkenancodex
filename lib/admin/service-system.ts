import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isCriticalStock } from "@/lib/admin/stock";
import { toTurkeyDateKey } from "@/lib/admin/calendar-date";
import { getUsdTryRate } from "@/lib/admin/exchange-rate";

// -------------------------------------------------------------
// TYPES
// -------------------------------------------------------------

export type Customer = {
  id: string;
  name: string;
  type: 'bireysel' | 'kurumsal';
  contact_person: string | null;
  phone: string;
  phone_secondary: string | null;
  email: string | null;
  tax_number: string | null;
  tax_office: string | null;
  address: string | null;
  city: string | null;
  district: string | null;
  location_link: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
};

export type Employee = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  role_title: string | null;
  is_active: boolean;
  working_days: string[] | null;
  working_hours_start: string | null;
  working_hours_end: string | null;
  notes: string | null;
  created_at: string;
};

export type Appointment = {
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
  status: 'Planlandı' | 'Müşteri Arandı' | 'Yola Çıkıldı' | 'İşlem Başladı' | 'Malzeme Bekleniyor' | 'İşlem Tamamlandı' | 'İptal Edildi' | 'Ertelendi' | 'Tahsilat Bekleniyor';
  internal_notes: string | null;
  customer_notes: string | null;
  reminder_time: string;
  created_at: string;
  customer?: { name: string; phone: string; city: string; district: string };
  employee?: { full_name: string };
  assistant?: { full_name: string };
};

export type ServiceOrder = {
  id: string;
  order_number: string;
  appointment_id: string | null;
  customer_id: string;
  started_at: string | null;
  finished_at: string | null;
  labor_hours: number;
  labor_cost: number;
  labor_price: number;
  transportation_cost: number;
  employee_cost: number;
  other_costs: number;
  discount: number;
  tax_rate: number;
  tax_amount: number;
  total_cost: number;
  grand_total: number;
  paid_amount: number;
  net_profit: number;
  status: 'Taslak' | 'İşlem Başladı' | 'Malzeme Bekleniyor' | 'Tamamlandı' | 'İptal Edildi';
  personnel_notes: string | null;
  customer_notes: string | null;
  created_at: string;
  customer?: { name: string; phone: string; type: string; address: string; city: string; district: string };
  appointment?: { appointment_date: string; start_time: string; service_type: string };
};

export type Material = {
  id: string;
  name: string;
  category: string | null;
  brand: string | null;
  model: string | null;
  barcode: string | null;
  sku: string | null;
  stock_quantity: number;
  min_stock_level: number;
  buying_price: number;
  selling_price: number;
  supplier: string | null;
  purchase_date: string | null;
  purchase_invoice_number: string | null;
  warranty_months: number;
  location: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
};

// -------------------------------------------------------------
// DATABASE UTILS
// -------------------------------------------------------------

// Log user activity manually
export async function logActivity(
  actionType: 'INSERT' | 'UPDATE' | 'DELETE',
  targetTable: string,
  recordId: string,
  oldValues: any,
  newValues: any
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    let fullname = 'Sistem';
    if (user) {
      const { data: profile } = await supabase
        .from('admin_profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle();
      if (profile) fullname = profile.full_name || user.email || 'Yönetici';
    }

    await supabase.from('activity_logs').insert({
      user_id: user?.id || null,
      user_fullname: fullname,
      action_type: actionType,
      target_table: targetTable,
      record_id: recordId,
      old_values: oldValues,
      new_values: newValues,
    });
  } catch (err) {
    console.error("Activity logging failed:", err);
  }
}

// Check double-booking conflicts
export async function checkEmployeeConflict(
  employeeId: string | null,
  date: string,
  startTime: string,
  endTime: string,
  excludeAppointmentId?: string
): Promise<Appointment | null> {
  if (!employeeId) return null;
  const supabase = await createSupabaseServerClient();
  
  // Find appointments on same day for the employee
  let query = supabase
    .from('appointments')
    .select('*, customer:customer_id(name)')
    .eq('appointment_date', date)
    .or(`employee_id.eq.${employeeId},assistant_employee_id.eq.${employeeId}`);
    
  if (excludeAppointmentId) {
    query = query.neq('id', excludeAppointmentId);
  }

  const { data } = await query;
  if (!data) return null;

  // Simple time overlap check
  // Format: "HH:MM:SS" or "HH:MM"
  const tToMin = (t: string) => {
    const parts = t.split(':');
    return Number(parts[0]) * 60 + Number(parts[1]);
  };

  const newStart = tToMin(startTime);
  const newEnd = tToMin(endTime);

  for (const app of data) {
    const appStart = tToMin(app.start_time);
    const appEnd = tToMin(app.end_time);

    // Overlap condition: startA < endB AND endA > startB
    if (newStart < appEnd && newEnd > appStart) {
      return app as unknown as Appointment;
    }
  }

  return null;
}

// Generate automatic Service Order Code (SRV-2026-00001)
export async function generateServiceOrderNumber(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const year = new Date().getFullYear();

  const { data, error } = await supabase
    .from('service_orders')
    .select('order_number')
    .like('order_number', `SRV-${year}-%`)
    .order('order_number', { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) {
    return `SRV-${year}-00001`;
  }

  const lastNumStr = data[0].order_number.split('-')[2];
  const nextNum = parseInt(lastNumStr, 10) + 1;
  const paddedNum = String(nextNum).padStart(5, '0');
  
  return `SRV-${year}-${paddedNum}`;
}

// Check stock alert
export async function getLowStockAlerts() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('materials')
    .select('*')
    .eq('is_active', true)
    .order('name');
    
  if (!data) return [];
  return data.filter((m) => isCriticalStock(m.stock_quantity));
}

// Get dashboard summaries
export async function getServiceDashboardStatsSequential() {
  const supabase = await createSupabaseServerClient();
  const todayStr = toTurkeyDateKey();
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = toTurkeyDateKey(tomorrow);

  // Week limits
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
  startOfWeek.setHours(0,0,0,0);

  // Queries
  const { count: todayAppointments } = await supabase
    .from('appointments')
    .select('id', { count: 'exact', head: true })
    .eq('appointment_date', todayStr);

  const { count: tomorrowAppointments } = await supabase
    .from('appointments')
    .select('id', { count: 'exact', head: true })
    .eq('appointment_date', tomorrowStr);

  const { count: weeklyCompleted } = await supabase
    .from('service_orders')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'Tamamlandı')
    .gte('finished_at', startOfWeek.toISOString());

  const { count: totalOrders } = await supabase
    .from('service_orders')
    .select('id', { count: 'exact', head: true })
    .is('deleted_at', null);

  const { count: collectionPending } = await supabase
    .from('appointments')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'Tahsilat Bekleniyor');

  const { count: totalCustomers } = await supabase
    .from('customers')
    .select('id', { count: 'exact', head: true })
    .eq('is_active', true);

  // Financial aggregates for all active orders (matching accounting screen)
  const { data: activeOrders } = await supabase
    .from('service_orders')
    .select('grand_total, paid_amount, total_cost, net_profit, labor_price_currency')
    .is('deleted_at', null);

  let trySales = 0, tryCollected = 0, tryCost = 0, tryProfit = 0;
  let usdSales = 0, usdCollected = 0, usdCost = 0, usdProfit = 0;

  if (activeOrders) {
    activeOrders.forEach((row) => {
      const currency = row.labor_price_currency || 'TRY';
      const grandTotal = Number(row.grand_total || 0);
      const paidAmount = Number(row.paid_amount || 0);
      const totalCost = Number(row.total_cost || 0);
      const profit = Number(row.net_profit || 0);

      if (currency === 'USD') {
        usdSales += grandTotal;
        usdCollected += paidAmount;
        usdCost += totalCost / 34;
        usdProfit += profit;
      } else {
        trySales += grandTotal;
        tryCollected += paidAmount;
        tryCost += totalCost;
        tryProfit += profit;
      }
    });
  }

  const tryReceivable = Math.max(0, trySales - tryCollected);
  const usdReceivable = Math.max(0, usdSales - usdCollected);

  // Low stock materials count
  const allMaterials = await supabase.from('materials').select('stock_quantity, min_stock_level').eq('is_active', true);
  const lowStockCount = (allMaterials.data ?? []).filter(m => isCriticalStock(m.stock_quantity)).length;

  return {
    todayAppointments: todayAppointments || 0,
    tomorrowAppointments: tomorrowAppointments || 0,
    weeklyCompleted: weeklyCompleted || 0,
    totalOrders: totalOrders || 0,
    collectionPending: collectionPending || 0,
    totalCustomers: totalCustomers || 0,
    monthlyCiro: trySales + (usdSales * 34),
    monthlyCost: tryCost + (usdCost * 34),
    monthlyProfit: tryProfit + (usdProfit * 34),
    trySales,
    tryCollected,
    tryReceivable,
    tryCost,
    usdSales,
    usdCollected,
    usdReceivable,
    usdCost,
    lowStockCount,
  };
}

// Keep the dashboard's independent aggregates concurrent. The previous
// implementation paid one network round trip after another.
export async function getServiceDashboardStats() {
  const supabase = await createSupabaseServerClient();
  const usdTryRateData = await getUsdTryRate();
  const usdTryRate = usdTryRateData?.rate ?? 34;
  const today = new Date();
  const todayStr = toTurkeyDateKey(today);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [year, month, day] = todayStr.split("-").map(Number);
  const turkeyCalendarDay = new Date(Date.UTC(year, month - 1, day));
  const daysSinceMonday = (turkeyCalendarDay.getUTCDay() + 6) % 7;
  const weekStartDay = new Date(turkeyCalendarDay);
  weekStartDay.setUTCDate(weekStartDay.getUTCDate() - daysSinceMonday);
  const nextWeekStartDay = new Date(weekStartDay);
  nextWeekStartDay.setUTCDate(nextWeekStartDay.getUTCDate() + 7);
  const toDateKey = (value: Date) =>
    `${value.getUTCFullYear()}-${String(value.getUTCMonth() + 1).padStart(2, "0")}-${String(value.getUTCDate()).padStart(2, "0")}`;
  const weekStart = `${toDateKey(weekStartDay)}T00:00:00+03:00`;
  const nextWeekStart = `${toDateKey(nextWeekStartDay)}T00:00:00+03:00`;

  const [todayRes, tomorrowRes, weeklyRes, totalOrdersRes, customersRes, activeOrdersRes, materialsRes] =
    await Promise.all([
      supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('appointment_date', todayStr).is('deleted_at', null),
      supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('appointment_date', toTurkeyDateKey(tomorrow)).is('deleted_at', null),
      supabase.from('service_orders').select('id', { count: 'exact', head: true }).eq('status', 'Tamamlandı').gte('finished_at', weekStart).lt('finished_at', nextWeekStart).is('deleted_at', null),
      supabase.from('service_orders').select('id', { count: 'exact', head: true }).is('deleted_at', null),
      supabase.from('customers').select('id', { count: 'exact', head: true }).is('deleted_at', null),
      supabase.from('service_orders').select('grand_total, paid_amount, total_cost, net_profit, labor_price_currency').is('deleted_at', null),
      supabase.from('materials').select('stock_quantity, min_stock_level').eq('is_active', true).is('deleted_at', null),
    ]);

  const queryError = [
    todayRes,
    tomorrowRes,
    weeklyRes,
    totalOrdersRes,
    customersRes,
    activeOrdersRes,
    materialsRes,
  ].find((result) => result.error)?.error;
  if (queryError) {
    throw new Error(`Dashboard istatistikleri alınamadı: ${queryError.message}`);
  }

  let trySales = 0, tryCollected = 0, tryCost = 0, tryProfit = 0;
  let usdSales = 0, usdCollected = 0, usdCost = 0, usdProfit = 0;

  (activeOrdersRes.data ?? []).forEach((row) => {
    const currency = row.labor_price_currency || 'TRY';
    const grandTotal = Number(row.grand_total || 0);
    const paidAmount = Number(row.paid_amount || 0);
    const totalCost = Number(row.total_cost || 0);
    const profit = Number(row.net_profit || 0);

    if (currency === 'USD') {
      usdSales += grandTotal;
      usdCollected += paidAmount;
      usdCost += totalCost / usdTryRate;
      usdProfit += profit;
    } else {
      trySales += grandTotal;
      tryCollected += paidAmount;
      tryCost += totalCost;
      tryProfit += profit;
    }
  });

  const tryReceivable = Math.max(0, trySales - tryCollected);
  const usdReceivable = Math.max(0, usdSales - usdCollected);
  const collectionPending = (activeOrdersRes.data ?? []).filter(
    (row) => Number(row.grand_total || 0) - Number(row.paid_amount || 0) > 0.01
  ).length;

  return {
    todayAppointments: todayRes.count ?? 0,
    tomorrowAppointments: tomorrowRes.count ?? 0,
    weeklyCompleted: weeklyRes.count ?? 0,
    totalOrders: totalOrdersRes.count ?? 0,
    collectionPending,
    totalCustomers: customersRes.count ?? 0,
    monthlyCiro: trySales + (usdSales * usdTryRate),
    monthlyCost: tryCost + (usdCost * usdTryRate),
    monthlyProfit: tryProfit + (usdProfit * usdTryRate),
    trySales,
    tryCollected,
    tryReceivable,
    tryCost,
    usdSales,
    usdCollected,
    usdReceivable,
    usdCost,
    usdTryRate,
    usdTryRateDate: usdTryRateData?.date ?? null,
    lowStockCount: (materialsRes.data ?? []).filter((row) => isCriticalStock(row.stock_quantity)).length,
  };
}
