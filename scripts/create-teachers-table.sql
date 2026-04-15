-- ============================================================
-- Jalankan SQL ini di: Supabase Dashboard → SQL Editor → New query
-- https://supabase.com/dashboard/project/grgkfcgvzawoyyztagbz/sql/new
-- ============================================================

CREATE TABLE IF NOT EXISTS public.teachers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  title         text,                          -- "Principal Teacher", "Senior Teacher", dll
  instrument    text,                          -- "Piano", "Cello & Piano", dll
  credentials   text[]  DEFAULT '{}',          -- array of strings
  quote         text,
  photo_url     text,                          -- URL dari Supabase Storage
  tags          text[]  DEFAULT '{}',          -- array of tag strings
  notes         text[]  DEFAULT '{}',          -- catatan kecil, misal "Limited slots only"
  sort_order    integer DEFAULT 99,            -- urutan tampil, makin kecil makin atas
  is_published  boolean DEFAULT true,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- Auto-update updated_at saat row diupdate
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER teachers_updated_at
  BEFORE UPDATE ON public.teachers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS: baca publik, tulis hanya authenticated
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers visible to everyone"
  ON public.teachers FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage teachers"
  ON public.teachers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Seed data awal (6 teacher dari halaman OurTeachers)
INSERT INTO public.teachers (name, title, instrument, credentials, quote, photo_url, tags, notes, sort_order) VALUES
(
  'Stefina Wibisono',
  'Principal Teacher',
  'Piano',
  ARRAY['Master''s in Classical Piano Performance', 'Carnegie Mellon University'],
  'It warms my heart to see students learning music as a language to express themselves, deliver ideas, and be empathetic to their surroundings, without words.',
  NULL,
  ARRAY['Classical Piano', 'Advanced Repertoire', 'Performance'],
  ARRAY['Limited slots only', 'Unavailable for home visit'],
  1
),
(
  'Vivian Rubin',
  'Senior Teacher',
  'Piano',
  ARRAY['Bachelor''s Degree in Music Education'],
  'I enjoy watching students play piano. I love to witness their growth to overcome their challenges. For example, when they finally master songs with various difficulty levels.',
  NULL,
  ARRAY['Piano', 'Student Growth', 'All Levels'],
  ARRAY[]::text[],
  2
),
(
  'Genessa Anggasta',
  'Senior Teacher',
  'Piano',
  ARRAY['Certified Music Therapist', 'Bachelor''s Degree in Music Therapy'],
  'I love playing piano and I''d also love to help students with my skill. My hope is that the students will enjoy practicing piano so I can help them be a better pianist than myself.',
  NULL,
  ARRAY['Piano', 'Music Therapy', 'Young Learners'],
  ARRAY[]::text[],
  3
),
(
  'Victoria Kezia',
  'Senior Teacher',
  'Cello & Piano',
  ARRAY['Bachelor''s Degree in Music Education'],
  'My goal is to help students to make music as a safe space to grow and express themselves, as well as to guide them to find their own identity through every notes they play — not only to gain skill, but to actually feel it by heart.',
  NULL,
  ARRAY['Cello', 'Piano', 'Expressive Learning'],
  ARRAY[]::text[],
  4
),
(
  'Jennifer Susanto',
  'Senior Teacher',
  'Violin, Trumpet & Piano',
  ARRAY['Bachelor''s Degree in Music Composition', 'Master''s Degree in Science Psychology'],
  'I strive to educate my student about music and also to guide them with life values that they can apply through playing music.',
  NULL,
  ARRAY['Violin', 'Trumpet', 'Piano', 'Life Values'],
  ARRAY[]::text[],
  5
),
(
  'Angelique Kristeva',
  'Junior Teacher',
  'Piano',
  ARRAY['Bachelor''s Degree in Music Education'],
  'Teaching music allows me to pass on the joy that music has given me. Seeing children connect with sound, express themselves, and find happiness through music is deeply fulfilling.',
  NULL,
  ARRAY['Piano', 'Children', 'Joy of Music'],
  ARRAY[]::text[],
  6
);
