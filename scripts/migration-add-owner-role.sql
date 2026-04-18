-- =============================================================
-- Migration: tambah CHECK constraint role 'owner' ke tabel users
-- Jalankan di Supabase: Dashboard → SQL Editor → New query
-- =============================================================
-- Pendekatan: TEXT + CHECK constraint
-- Alasan: kolom role digunakan oleh RLS policy, sehingga ALTER TYPE
-- ke ENUM tidak diizinkan PostgreSQL tanpa drop-recreate semua policy.
-- TEXT + CHECK memberikan validasi yang sama secara fungsional.
-- =============================================================

-- STEP 1 — Drop constraint lama jika ada, lalu tambah yang baru
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE public.users
  ADD CONSTRAINT users_role_check
  CHECK (role IN ('user', 'admin', 'owner'));

-- STEP 2 — Pastikan default tetap 'user'
ALTER TABLE public.users
  ALTER COLUMN role SET DEFAULT 'user';

-- STEP 3 — Fix row dengan nilai NULL / tidak valid (jaga-jaga)
UPDATE public.users
SET    role = 'user'
WHERE  role IS NULL
   OR  role NOT IN ('user', 'admin', 'owner');

-- STEP 4 — Verifikasi constraint terpasang
SELECT conname, pg_get_constraintdef(oid) AS definition
FROM   pg_constraint
WHERE  conrelid = 'public.users'::regclass
  AND  contype  = 'c';

-- STEP 5 — Distribusi role saat ini
SELECT role, COUNT(*) AS total
FROM   public.users
GROUP  BY role
ORDER  BY role;

-- =============================================================
-- SETELAH MIGRATION — Set role owner pada akun Anda:
--
  -- UPDATE public.users
  -- SET    role = 'owner'
  -- WHERE  email = 'email-anda@example.com';
--
-- =============================================================
