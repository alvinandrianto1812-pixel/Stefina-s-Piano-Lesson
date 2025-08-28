// src/pages/OurTeachers.jsx
import React from "react";

const TEACHERS = [
  {
    name: "Alya Pramudita",
    role: "Piano (Classical)",
    exp: "10+ tahun",
    blurb: "Spesialis teknik dasar & interpretasi era Romantik.",
  },
  {
    name: "Rizky Mahendra",
    role: "Guitar (Acoustic/Pop)",
    exp: "7+ tahun",
    blurb: "Fokus pada chord voicing & improvisasi pemula-menengah.",
  },
  {
    name: "Nadine Salsabila",
    role: "Vocal (Pop/Jazz)",
    exp: "8+ tahun",
    blurb: "Latihan pernapasan, range building, dan stage presence.",
  },
  {
    name: "Fajar Wicaksono",
    role: "Drums (Rock/Funk)",
    exp: "9+ tahun",
    blurb: "Groove, rudiment, dan koordinasi untuk perform live.",
  },
  {
    name: "Keisha Putri",
    role: "Violin (Beginner–Intermediate)",
    exp: "6+ tahun",
    blurb: "Intonasi, bowing, dan reading untuk orkestra sekolah.",
  },
  {
    name: "Arka Setiadi",
    role: "Music Theory",
    exp: "10+ tahun",
    blurb: "Harmoni, ear training, dan persiapan ujian teori.",
  },
];

export default function OurTeachers() {
  return (
    <div className="font-sans text-brand-dark">
      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-soft to-white" />
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            background:
              "radial-gradient(900px 340px at 20% 10%, rgba(212,175,55,0.22), transparent 60%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-12 text-center">
          <h1 className="font-display text-4xl md:text-5xl leading-tight">
            Kenali <span className="font-bold">Pengajar</span> Kami
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            Tim musisi berpengalaman yang siap menginspirasi perjalanan
            belajarmu.
          </p>
        </div>
      </section>

      {/* GRID TEACHERS */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEACHERS.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 border bg-white hover:shadow-luxe transition"
              >
                <div className="text-brand-gold text-2xl mb-2">★</div>
                <div className="font-semibold text-lg">{t.name}</div>
                <div className="text-sm text-slate-600 mt-1">{t.role}</div>
                <div className="text-sm text-slate-600">
                  Pengalaman: {t.exp}
                </div>
                <p className="text-sm text-slate-700 mt-3">{t.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NILAI PENGAJARAN */}
      <section className="py-16 bg-gradient-to-b from-white to-brand-soft/40">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center mb-10">
            Nilai Pengajaran
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                t: "Personalized Learning",
                d: "Materi disesuaikan target dan gaya belajar tiap siswa.",
              },
              {
                t: "Performance Mindset",
                d: "Latihan berorientasi panggung & kepercayaan diri.",
              },
              {
                t: "Solid Fundamentals",
                d: "Teknik & teori dasar ditanamkan sejak awal.",
              },
              {
                t: "Progress Tracking",
                d: "Catatan perkembangan tiap pertemuan yang terukur.",
              },
              {
                t: "Creative Exploration",
                d: "Dorongan untuk berimprovisasi dan bereksperimen.",
              },
              {
                t: "Community",
                d: "Lingkungan inklusif yang saling mendukung.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 border bg-white hover:shadow-luxe transition"
              >
                <div className="text-brand-gold text-2xl mb-2">★</div>
                <div className="font-semibold">{f.t}</div>
                <p className="text-sm text-slate-600 mt-1">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
