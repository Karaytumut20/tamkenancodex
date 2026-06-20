-- Admin modüllerinin ortak sorguları için birleşik indeksler.
-- Eski CMS activity_logs şemasını yeni servis modülüyle geriye dönük uyumlu yap.
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS user_fullname text;
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS action_type text;
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS target_table text;
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS record_id uuid;
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS old_values jsonb;
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS new_values jsonb;

UPDATE public.activity_logs
SET
  user_id = COALESCE(user_id, admin_id),
  user_fullname = COALESCE(user_fullname, 'Yönetici'),
  action_type = COALESCE(action_type, upper(action)),
  target_table = COALESCE(target_table, entity_type),
  record_id = COALESCE(record_id, entity_id),
  old_values = COALESCE(old_values, old_data),
  new_values = COALESCE(new_values, new_data)
WHERE record_id IS NULL OR action_type IS NULL OR target_table IS NULL;

CREATE OR REPLACE FUNCTION public.sync_activity_log_columns()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.user_id := COALESCE(NEW.user_id, NEW.admin_id);
  NEW.admin_id := COALESCE(NEW.admin_id, NEW.user_id);
  NEW.action_type := COALESCE(NEW.action_type, upper(NEW.action));
  NEW.action := COALESCE(NEW.action, NEW.action_type);
  NEW.target_table := COALESCE(NEW.target_table, NEW.entity_type);
  NEW.entity_type := COALESCE(NEW.entity_type, NEW.target_table);
  NEW.record_id := COALESCE(NEW.record_id, NEW.entity_id);
  NEW.entity_id := COALESCE(NEW.entity_id, NEW.record_id);
  NEW.old_values := COALESCE(NEW.old_values, NEW.old_data);
  NEW.old_data := COALESCE(NEW.old_data, NEW.old_values);
  NEW.new_values := COALESCE(NEW.new_values, NEW.new_data);
  NEW.new_data := COALESCE(NEW.new_data, NEW.new_values);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_activity_log_columns ON public.activity_logs;
CREATE TRIGGER trg_sync_activity_log_columns
  BEFORE INSERT OR UPDATE ON public.activity_logs
  FOR EACH ROW EXECUTE FUNCTION public.sync_activity_log_columns();

CREATE INDEX IF NOT EXISTS idx_appointments_active_date
  ON public.appointments (appointment_date, start_time)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_appointments_active_employee
  ON public.appointments (employee_id, appointment_date)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_service_orders_active_created
  ON public.service_orders (created_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_service_orders_active_status
  ON public.service_orders (status, created_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_service_orders_appointment
  ON public.service_orders (appointment_id);

CREATE INDEX IF NOT EXISTS idx_materials_active_name
  ON public.materials (name)
  WHERE deleted_at IS NULL AND is_active = true;

CREATE INDEX IF NOT EXISTS idx_payments_date
  ON public.payments (payment_date DESC);

CREATE INDEX IF NOT EXISTS idx_stock_movements_created
  ON public.stock_movements (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_activity_logs_record_created
  ON public.activity_logs (record_id, created_at DESC);
