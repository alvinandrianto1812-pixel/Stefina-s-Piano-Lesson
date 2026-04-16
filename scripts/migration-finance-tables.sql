-- =============================================================
-- Migration (REVISED): Hanya buat tabel presensi_guru
-- Tabel pengeluaran TIDAK dibuat — gunakan finance_records yang sudah ada
--   (type: 'outcome' = pengeluaran umum, 'salary' = gaji guru)
-- Jalankan di Supabase: Dashboard → SQL Editor → New query
-- =============================================================

CREATE TABLE IF NOT EXISTS public.presensi_guru (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id  uuid        NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  tanggal     date        NOT NULL,
  hadir       boolean     NOT NULL DEFAULT true,
  keterangan  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_presensi_guru_teacher ON public.presensi_guru(teacher_id);
CREATE INDEX IF NOT EXISTS idx_presensi_guru_tanggal ON public.presensi_guru(tanggal DESC);

-- RLS: hanya admin & owner bisa akses
ALTER TABLE public.presensi_guru ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_owner_presensi_guru"
  ON public.presensi_guru
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'owner')
    )
  );

-- Verifikasi
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'presensi_guru';
