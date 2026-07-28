-- Malzeme satın alma ve garanti takibi
-- Bu migration mevcut kayıtları silmez veya değiştirmez.
-- Yalnızca yeni, isteğe bağlı alanlar ekler ve tekrar çalıştırılabilir.

ALTER TABLE public.materials
  ADD COLUMN IF NOT EXISTS purchase_date date,
  ADD COLUMN IF NOT EXISTS purchase_invoice_number text,
  ADD COLUMN IF NOT EXISTS warranty_months integer NOT NULL DEFAULT 0;

ALTER TABLE public.materials
  DROP CONSTRAINT IF EXISTS materials_warranty_months_nonnegative;

ALTER TABLE public.materials
  ADD CONSTRAINT materials_warranty_months_nonnegative
  CHECK (warranty_months >= 0);

ALTER TABLE public.service_order_materials
  ADD COLUMN IF NOT EXISTS supplier text,
  ADD COLUMN IF NOT EXISTS purchase_date date,
  ADD COLUMN IF NOT EXISTS purchase_invoice_number text,
  ADD COLUMN IF NOT EXISTS warranty_start_date date,
  ADD COLUMN IF NOT EXISTS warranty_end_date date;

ALTER TABLE public.service_order_materials
  DROP CONSTRAINT IF EXISTS service_order_materials_warranty_dates_valid;

ALTER TABLE public.service_order_materials
  ADD CONSTRAINT service_order_materials_warranty_dates_valid
  CHECK (
    warranty_end_date IS NULL
    OR warranty_start_date IS NULL
    OR warranty_end_date >= warranty_start_date
  );

CREATE INDEX IF NOT EXISTS idx_service_order_materials_supplier
  ON public.service_order_materials (supplier);

CREATE INDEX IF NOT EXISTS idx_service_order_materials_warranty_end
  ON public.service_order_materials (warranty_end_date)
  WHERE warranty_end_date IS NOT NULL;
