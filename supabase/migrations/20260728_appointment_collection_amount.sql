-- Store the amount agreed while planning an appointment.
-- This value is synchronized to the linked service order so it appears
-- automatically in accounting as an expected collection.
ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS collection_amount decimal(12,2) NOT NULL DEFAULT 0.00;

ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS collection_currency text NOT NULL DEFAULT 'TRY';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'appointments_collection_amount_nonnegative'
  ) THEN
    ALTER TABLE public.appointments
      ADD CONSTRAINT appointments_collection_amount_nonnegative
      CHECK (collection_amount >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'appointments_collection_currency_check'
  ) THEN
    ALTER TABLE public.appointments
      ADD CONSTRAINT appointments_collection_currency_check
      CHECK (collection_currency IN ('TRY', 'USD'));
  END IF;
END
$$;
