-- =============================================================
-- Migration: Enforce payment amount di database level
-- MASALAH: Amount 500000 hanya di-set di client (Questionnaire.jsx).
--          User bisa memanipulasi request dan kirim amount berbeda.
-- FIX:     Database trigger yang memaksa amount = 500000
--          untuk setiap payment yang terkait questionnaire.
-- Jalankan di Supabase: Dashboard → SQL Editor → New query
-- =============================================================

-- STEP 1 — Buat function trigger
CREATE OR REPLACE FUNCTION enforce_payment_amount()
RETURNS TRIGGER AS $$
BEGIN
  -- Jika payment ini terkait questionnaire, paksa amount = 500000
  IF NEW.questionnaire_id IS NOT NULL THEN
    NEW.amount := 500000;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEP 2 — Pasang trigger pada INSERT dan UPDATE
DROP TRIGGER IF EXISTS trg_enforce_payment_amount ON public.payments;

CREATE TRIGGER trg_enforce_payment_amount
  BEFORE INSERT OR UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION enforce_payment_amount();

-- STEP 3 — Verifikasi trigger terpasang
SELECT trigger_name, event_manipulation, action_timing
FROM information_schema.triggers
WHERE event_object_table = 'payments';
