// src/pages/AboutUs.jsx
import React from "react";

export default function AboutUs() {
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
            Tentang <span className="font-bold">Guru</span>Nada
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            Misi kami: membuat pembelajaran musik yang elegan, terstruktur, dan
            menyenangkan.
          </p>
        </div>
      </section>

      {/* MISI & VISI */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl p-6 border bg-white">
            <div className="text-brand-gold text-2xl mb-2">★</div>
            <h2 className="font-semibold text-xl mb-2">Misi</h2>
            <p className="text-slate-700 text-sm">
              Menghadirkan ekosistem belajar musik yang berfokus pada fondasi
              teknik, pemahaman teori, dan kepercayaan diri panggung—berbasis
              kurikulum yang dapat ditelusuri progresnya.
            </p>
          </div>
          <div className="rounded-2xl p-6 border bg-white">
            <div className="text-brand-gold text-2xl mb-2">★</div>
            <h2 className="font-semibold text-xl mb-2">Visi</h2>
            <p className="text-slate-700 text-sm">
              Menjadi partner perjalanan musik keluarga Indonesia dengan standar
              pengajaran modern, teknologi yang membantu, dan komunitas yang
              suportif.
            </p>
          </div>
        </div>
      </section>

      {/* CERITA & PENDekatan */}
      <section className="py-16 bg-gradient-to-b from-white to-brand-soft/40">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-6">
          {[
            {
              t: "Cerita Kami",
              d: "Berawal dari kelas privat kecil, berkembang menjadi platform pembelajaran dengan pengajar lintas instrumen.",
            },
            {
              t: "Pendekatan",
              d: "Kombinasi teknik, teori, dan perform—dibungkus target mingguan yang jelas dan terukur.",
            },
            {
              t: "Komitmen Kualitas",
              d: "Kurasi pengajar, review berkala, dan materi yang selalu diperbarui.",
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
      </section>

      {/* FAQ SINGKAT */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <details className="rounded-xl border bg-white p-4">
            <summary className="font-medium cursor-pointer">
              Apa yang membedakan GuruNada?
            </summary>
            <p className="mt-2 text-slate-600 text-sm">
              Kurikulum progresif, tracking perkembangan, dan kesempatan tampil
              rutin.
            </p>
          </details>
          <details className="rounded-xl border bg-white p-4">
            <summary className="font-medium cursor-pointer">
              Apakah tersedia kelas online dan offline?
            </summary>
            <p className="mt-2 text-slate-600 text-sm">
              Tersedia keduanya sesuai jadwal dan instrumen.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
