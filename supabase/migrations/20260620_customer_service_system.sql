-- 1. Alter admin_profiles table to support 'viewer' and 'service_staff' roles
ALTER TABLE public.admin_profiles DROP CONSTRAINT IF EXISTS admin_profiles_role_check;
ALTER TABLE public.admin_profiles ADD CONSTRAINT admin_profiles_role_check 
  CHECK (role IN ('super_admin', 'editor', 'support', 'viewer', 'service_staff'));

-- 2. Create Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('bireysel', 'kurumsal')),
  contact_person text,
  phone text UNIQUE NOT NULL,
  phone_secondary text,
  email text,
  tax_number text,
  tax_office text,
  address text,
  city text,
  district text,
  location_link text,
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

-- 3. Create Employees Table
CREATE TABLE IF NOT EXISTS public.employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text,
  email text,
  role_title text,
  is_active boolean NOT NULL DEFAULT true,
  working_days text[] DEFAULT ARRAY['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'],
  working_hours_start text DEFAULT '09:00',
  working_hours_end text DEFAULT '18:00',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

-- 4. Create Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  appointment_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  service_type text NOT NULL,
  description text,
  customer_issue text,
  address text,
  city text,
  district text,
  location_link text,
  employee_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  assistant_employee_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  priority text NOT NULL CHECK (priority IN ('normal', 'önemli', 'acil')),
  status text NOT NULL CHECK (status IN ('Planlandı', 'Müşteri Arandı', 'Yola Çıkıldı', 'İşlem Başladı', 'Malzeme Bekleniyor', 'İşlem Tamamlandı', 'İptal Edildi', 'Ertelendi', 'Tahsilat Bekleniyor')),
  internal_notes text,
  customer_notes text,
  reminder_time text DEFAULT '30_min',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

-- 5. Create Service Orders Table
CREATE TABLE IF NOT EXISTS public.service_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  started_at timestamptz,
  finished_at timestamptz,
  labor_hours decimal(10,2) NOT NULL DEFAULT 0.00,
  labor_cost decimal(10,2) NOT NULL DEFAULT 0.00,
  labor_price decimal(10,2) NOT NULL DEFAULT 0.00,
  transportation_cost decimal(10,2) NOT NULL DEFAULT 0.00,
  employee_cost decimal(10,2) NOT NULL DEFAULT 0.00,
  other_costs decimal(10,2) NOT NULL DEFAULT 0.00,
  discount decimal(10,2) NOT NULL DEFAULT 0.00,
  tax_rate decimal(5,2) NOT NULL DEFAULT 0.00,
  tax_amount decimal(10,2) NOT NULL DEFAULT 0.00,
  total_cost decimal(10,2) NOT NULL DEFAULT 0.00,
  grand_total decimal(10,2) NOT NULL DEFAULT 0.00,
  paid_amount decimal(10,2) NOT NULL DEFAULT 0.00,
  net_profit decimal(10,2) NOT NULL DEFAULT 0.00,
  status text NOT NULL CHECK (status IN ('Taslak', 'İşlem Başladı', 'Malzeme Bekleniyor', 'Tamamlandı', 'İptal Edildi')),
  personnel_notes text,
  customer_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

-- 6. Create Materials Table (Stok)
CREATE TABLE IF NOT EXISTS public.materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  brand text,
  model text,
  barcode text UNIQUE,
  sku text UNIQUE,
  stock_quantity decimal(10,2) NOT NULL DEFAULT 0.00,
  min_stock_level decimal(10,2) NOT NULL DEFAULT 0.00,
  buying_price decimal(10,2) NOT NULL DEFAULT 0.00,
  selling_price decimal(10,2) NOT NULL DEFAULT 0.00,
  supplier text,
  location text,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

-- 7. Create Service Order Materials Table
CREATE TABLE IF NOT EXISTS public.service_order_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id uuid NOT NULL REFERENCES public.service_orders(id) ON DELETE CASCADE,
  material_id uuid REFERENCES public.materials(id) ON DELETE SET NULL,
  name text NOT NULL,
  category text,
  brand text,
  model text,
  serial_number text,
  unit text NOT NULL CHECK (unit IN ('Adet', 'Metre', 'Paket', 'Kutu', 'Kilogram', 'Litre', 'Set')),
  quantity decimal(10,2) NOT NULL DEFAULT 1.00,
  buying_price decimal(10,2) NOT NULL DEFAULT 0.00,
  total_buying_cost decimal(10,2) NOT NULL DEFAULT 0.00,
  selling_price decimal(10,2) NOT NULL DEFAULT 0.00,
  total_selling_price decimal(10,2) NOT NULL DEFAULT 0.00,
  profit decimal(10,2) NOT NULL DEFAULT 0.00,
  warranty_months integer DEFAULT 0,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 8. Create Stock Movements Table
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id uuid NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('in', 'out', 'adjustment')),
  quantity decimal(10,2) NOT NULL,
  reference_table text,
  reference_id uuid,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 9. Create Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  service_order_id uuid REFERENCES public.service_orders(id) ON DELETE SET NULL,
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  amount decimal(10,2) NOT NULL CHECK (amount > 0),
  method text NOT NULL CHECK (method IN ('Nakit', 'Kredi Kartı', 'Banka Havalesi', 'EFT', 'Çek', 'Diğer')),
  transaction_number text,
  received_by_employee_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 10. Create Customer Notes Table
CREATE TABLE IF NOT EXISTS public.customer_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  note text NOT NULL,
  created_by_profile_id uuid REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 11. Create Service Files Table
CREATE TABLE IF NOT EXISTS public.service_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id uuid NOT NULL REFERENCES public.service_orders(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_type text CHECK (file_type IN ('before_photo', 'after_photo', 'document')),
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

-- 12. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  link text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 13. Create Activity Logs Table (Audit Trail)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  user_fullname text,
  action_type text NOT NULL CHECK (action_type IN ('INSERT', 'UPDATE', 'DELETE')),
  target_table text NOT NULL,
  record_id uuid NOT NULL,
  old_values jsonb,
  new_values jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 14. Add Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON public.appointments(appointment_date, start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_employee ON public.appointments(employee_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_number ON public.service_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_service_orders_customer ON public.service_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_materials_barcode ON public.materials(barcode);
CREATE INDEX IF NOT EXISTS idx_materials_sku ON public.materials(sku);
CREATE INDEX IF NOT EXISTS idx_service_order_materials_order ON public.service_order_materials(service_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(service_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer ON public.payments(customer_id);

-- 15. Create Auto Stock Update Trigger Functions
CREATE OR REPLACE FUNCTION public.fn_handle_service_material_insert()
RETURNS trigger AS $$
BEGIN
  -- Deduct stock quantity
  IF NEW.material_id IS NOT NULL THEN
    UPDATE public.materials
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE id = NEW.material_id;
    
    -- Insert stock movement
    INSERT INTO public.stock_movements (material_id, type, quantity, reference_table, reference_id, description)
    VALUES (NEW.material_id, 'out', NEW.quantity, 'service_order_materials', NEW.id, 'İş Emrinde Kullanıldı: ' || NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.fn_handle_service_material_delete()
RETURNS trigger AS $$
BEGIN
  -- Return stock quantity
  IF OLD.material_id IS NOT NULL THEN
    UPDATE public.materials
    SET stock_quantity = stock_quantity + OLD.quantity
    WHERE id = OLD.material_id;
    
    -- Insert stock movement
    INSERT INTO public.stock_movements (material_id, type, quantity, reference_table, reference_id, description)
    VALUES (OLD.material_id, 'in', OLD.quantity, 'service_order_materials', OLD.id, 'İş Emrinden Kaldırıldı / İade: ' || OLD.name);
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.fn_handle_service_material_update()
RETURNS trigger AS $$
DECLARE
  diff decimal(10,2);
BEGIN
  IF NEW.material_id = OLD.material_id THEN
    diff := NEW.quantity - OLD.quantity;
    IF diff <> 0 THEN
      UPDATE public.materials
      SET stock_quantity = stock_quantity - diff
      WHERE id = NEW.material_id;
      
      INSERT INTO public.stock_movements (material_id, type, quantity, reference_table, reference_id, description)
      VALUES (NEW.material_id, CASE WHEN diff > 0 THEN 'out'::text ELSE 'in'::text END, abs(diff), 'service_order_materials', NEW.id, 'Miktar Güncellendi (' || OLD.quantity || ' -> ' || NEW.quantity || ')');
    END IF;
  ELSE
    -- Revert old material stock
    IF OLD.material_id IS NOT NULL THEN
      UPDATE public.materials
      SET stock_quantity = stock_quantity + OLD.quantity
      WHERE id = OLD.material_id;
      
      INSERT INTO public.stock_movements (material_id, type, quantity, reference_table, reference_id, description)
      VALUES (OLD.material_id, 'in', OLD.quantity, 'service_order_materials', OLD.id, 'Malzeme Değiştirildi (Eski İade)');
    END IF;
    -- Deduct new material stock
    IF NEW.material_id IS NOT NULL THEN
      UPDATE public.materials
      SET stock_quantity = stock_quantity - NEW.quantity
      WHERE id = NEW.material_id;
      
      INSERT INTO public.stock_movements (material_id, type, quantity, reference_table, reference_id, description)
      VALUES (NEW.material_id, 'out', NEW.quantity, 'service_order_materials', NEW.id, 'Malzeme Değiştirildi (Yeni Kullanım)');
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Register Stock Triggers
CREATE TRIGGER trg_service_material_insert
  AFTER INSERT ON public.service_order_materials
  FOR EACH ROW EXECUTE FUNCTION public.fn_handle_service_material_insert();

CREATE TRIGGER trg_service_material_delete
  AFTER DELETE ON public.service_order_materials
  FOR EACH ROW EXECUTE FUNCTION public.fn_handle_service_material_delete();

CREATE TRIGGER trg_service_material_update
  AFTER UPDATE ON public.service_order_materials
  FOR EACH ROW EXECUTE FUNCTION public.fn_handle_service_material_update();

-- 16. Enable RLS on all tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_order_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 17. Create Simple RLS Policies for Authenticated Admin Users
CREATE POLICY "Allow all actions for authenticated admin users on customers"
  ON public.customers TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all actions for authenticated admin users on employees"
  ON public.employees TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all actions for authenticated admin users on appointments"
  ON public.appointments TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all actions for authenticated admin users on service_orders"
  ON public.service_orders TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all actions for authenticated admin users on materials"
  ON public.materials TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all actions for authenticated admin users on service_order_materials"
  ON public.service_order_materials TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all actions for authenticated admin users on stock_movements"
  ON public.stock_movements TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all actions for authenticated admin users on payments"
  ON public.payments TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all actions for authenticated admin users on customer_notes"
  ON public.customer_notes TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all actions for authenticated admin users on service_files"
  ON public.service_files TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all actions for authenticated admin users on notifications"
  ON public.notifications TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all actions for authenticated admin users on activity_logs"
  ON public.activity_logs TO authenticated USING (true) WITH CHECK (true);
