-- =============================================================
-- Migration: Add 'owner' access to all core tables
-- Alasan: RLS (Row Level Security) lama hanya mengizinkan 'admin'
-- Sehingga saat login pakai 'owner', data payment dsb kosong.
-- Jalankan di Supabase: Dashboard → SQL Editor → New query
-- =============================================================

-- =============================================================
-- 1. Tabel Payments & Questionnaire
-- =============================================================
CREATE POLICY "owner_all_payments" ON public.payments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'owner')
  );

CREATE POLICY "owner_all_questionnaire" ON public.questionnaire
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'owner')
  );

-- =============================================================
-- 2. Tabel Events & Media
-- =============================================================
CREATE POLICY "owner_all_events" ON public.events
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'owner')
  );

CREATE POLICY "owner_all_media" ON public.media
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'owner')
  );

-- =============================================================
-- 3. Tabel Finance Records & Teachers
-- =============================================================
CREATE POLICY "owner_all_finance_records" ON public.finance_records
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'owner')
  );

CREATE POLICY "owner_all_teachers" ON public.teachers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'owner')
  );

-- =============================================================
-- (Optional) Tambahan bila ada tabel pendamping
-- =============================================================
DO $$
BEGIN
    -- Attendance
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'attendance') THEN
        EXECUTE 'CREATE POLICY "owner_all_attendance" ON public.attendance FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = ''owner''))';
    END IF;

    -- Lesson Reports
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'lesson_reports') THEN
        EXECUTE 'CREATE POLICY "owner_all_lesson_reports" ON public.lesson_reports FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = ''owner''))';
    END IF;

    -- Supply Orders
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'supply_orders') THEN
        EXECUTE 'CREATE POLICY "owner_all_supply_orders" ON public.supply_orders FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = ''owner''))';
    END IF;
EXCEPTION WHEN duplicate_object THEN
    -- Abaikan jika policy sudah ada
END $$;
