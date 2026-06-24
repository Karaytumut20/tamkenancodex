import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isCriticalStock } from "@/lib/admin/stock";
import { toTurkeyDateKey } from "@/lib/admin/calendar-date";

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

  // Month limits
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0,0,0,0);

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

  const { count: pendingOrders } = await supabase
    .from('service_orders')
    .select('id', { count: 'exact', head: true })
    .in('status', ['Taslak', 'İşlem Başladı', 'Malzeme Bekleniyor']);

  const { count: collectionPending } = await supabase
    .from('appointments')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'Tahsilat Bekleniyor');

  const { count: totalCustomers } = await supabase
    .from('customers')
    .select('id', { count: 'exact', head: true })
    .eq('is_active', true);

  // Financial aggregates for this month
  const { data: monthOrders } = await supabase
    .from('service_orders')
    .select('grand_total, total_cost, net_profit, labor_price_currency')
    .eq('status', 'Tamamlandı')
    .gte('finished_at', startOfMonth.toISOString());

  let monthlyCiro = 0;
  let monthlyCost = 0;
  let monthlyProfit = 0;

  if (monthOrders) {
    monthOrders.forEach((o) => {
      const currency = o.labor_price_currency || 'TRY';
      const ciro = Number(o.grand_total || 0);
      const cost = Number(o.total_cost || 0);
      const profit = Number(o.net_profit || 0);

      monthlyCiro += currency === 'USD' ? ciro * 34 : ciro;
      monthlyCost += cost;
      monthlyProfit += currency === 'USD' ? profit * 34 : profit;
    });
  }

  // Low stock materials count
  const allMaterials = await supabase.from('materials').select('stock_quantity, min_stock_level').eq('is_active', true);
  const lowStockCount = (allMaterials.data ?? []).filter(m => isCriticalStock(m.stock_quantity)).length;

  return {
    todayAppointments: todayAppointments || 0,
    tomorrowAppointments: tomorrowAppointments || 0,
    weeklyCompleted: weeklyCompleted || 0,
    pendingOrders: pendingOrders || 0,
    collectionPending: collectionPending || 0,
    totalCustomers: totalCustomers || 0,
    monthlyCiro,
    monthlyCost,
    monthlyProfit,
    lowStockCount,
  };
}

// Keep the dashboard's independent aggregates concurrent. The previous
// implementation paid one network round trip after another.
export async function getServiceDashboardStats() {
  const supabase = await createSupabaseServerClient();
  const today = new Date();
  const todayStr = toTurkeyDateKey(today);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [todayRes, tomorrowRes, weeklyRes, pendingRes, collectionRes, customersRes, monthRes, materialsRes] =
    await Promise.all([
      supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('appointment_date', todayStr),
      supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('appointment_date', toTurkeyDateKey(tomorrow)),
      supabase.from('service_orders').select('id', { count: 'exact', head: true }).eq('status', 'Tamamlandı').gte('finished_at', startOfWeek.toISOString()),
      supabase.from('service_orders').select('id', { count: 'exact', head: true }).in('status', ['Taslak', 'İşlem Başladı', 'Malzeme Bekleniyor']),
      supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('status', 'Tahsilat Bekleniyor'),
      supabase.from('customers').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('service_orders').select('grand_total, total_cost, net_profit, labor_price_currency').eq('status', 'Tamamlandı').gte('finished_at', startOfMonth.toISOString()),
      supabase.from('materials').select('stock_quantity, min_stock_level').eq('is_active', true),
    ]);

  const totals = (monthRes.data ?? []).reduce(
    (sum, row) => {
      const currency = row.labor_price_currency || 'TRY';
      const ciro = Number(row.grand_total || 0);
      const cost = Number(row.total_cost || 0);
      const profit = Number(row.net_profit || 0);

      return {
        ciro: sum.ciro + (currency === 'USD' ? ciro * 34 : ciro),
        cost: sum.cost + cost,
        profit: sum.profit + (currency === 'USD' ? profit * 34 : profit),
      };
    },
    { ciro: 0, cost: 0, profit: 0 },
  );

  return {
    todayAppointments: todayRes.count ?? 0,
    tomorrowAppointments: tomorrowRes.count ?? 0,
    weeklyCompleted: weeklyRes.count ?? 0,
    pendingOrders: pendingRes.count ?? 0,
    collectionPending: collectionRes.count ?? 0,
    totalCustomers: customersRes.count ?? 0,
    monthlyCiro: totals.ciro,
    monthlyCost: totals.cost,
    monthlyProfit: totals.profit,
    lowStockCount: (materialsRes.data ?? []).filter((row) => isCriticalStock(row.stock_quantity)).length,
  };
}
