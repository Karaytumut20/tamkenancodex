-- Add currency support to payments table
ALTER TABLE public.payments 
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'TRY';

-- Add constraint after column creation (safer)
ALTER TABLE public.payments 
  ADD CONSTRAINT payments_currency_check CHECK (currency IN ('TRY', 'USD'));

-- Also add currency support to service_orders (for labor_price currency tracking)
ALTER TABLE public.service_orders
  ADD COLUMN IF NOT EXISTS labor_price_currency text NOT NULL DEFAULT 'TRY';

ALTER TABLE public.service_orders
  ADD CONSTRAINT service_orders_currency_check CHECK (labor_price_currency IN ('TRY', 'USD'));
