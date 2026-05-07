-- =============================================================
-- Migration: Fix RLS Policy tabel teachers
-- MASALAH: Policy "Admins can manage teachers" saat ini mengizinkan
--          SEMUA user authenticated untuk INSERT/UPDATE/DELETE.
-- FIX:     Batasi hanya untuk role 'admin' dan 'owner'.
-- Jalankan di Supabase: Dashboard → SQL Editor → New query
-- =============================================================

-- STEP 1 — Hapus policy lama yang terlalu permisif
DROP POLICY IF EXISTS "Admins can manage teachers" ON public.teachers;

-- STEP 2 — Buat policy baru yang hanya izinkan admin & owner
CREATE POLICY "Admins can manage teachers"
  ON public.teachers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'owner')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'owner')
    )
  );

-- STEP 3 — Verifikasi: lihat semua policy pada tabel teachers
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'teachers';
