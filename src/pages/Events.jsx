// src/pages/Event.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Events() {
  return (
    <div className="font-sans text-brand-dark">
      {/* HERO – samakan nuansa dengan LandingPage */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-soft to-white"></div>
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            background:
              "radial-gradient(900px 340px at 20% 10%, rgba(212,175,55,0.22), transparent 60%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-12 text-center">
          <h1 className="font-display text-4xl md:text-5xl leading-tight">
            Temukan <span className="font-bold">Event Musik</span> bersama
            GuruNada
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            Ikuti konser, workshop, dan recital spesial —{" "}
            <span className="font-semibold">
              jadilah bagian dari momen istimewa
            </span>
            .
          </p>
        </div>
      </section>

      {/* KARTU EVENT UTAMA */}
      <section className="relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-2xl bg-white/90 backdrop-blur border border-white/60 shadow-luxe p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              {/* Kolom kiri: info event */}
              <div className="text-left">
                <div className="text-3xl md:text-4xl font-bold">
                  Konser Akhir Tahun 2025
                </div>
                <div className="text-slate-600">Sabtu, 20 Desember 2025</div>
                <div className="mt-3 text-slate-600 text-sm">
                  Lokasi: Aula Musik Jakarta
                </div>

                <Link
                  to="/questionnaire"
                  className="inline-flex mt-6 px-5 py-3 rounded-full bg-brand-gold text-white hover:opacity-90 shadow-luxe"
                >
                  Daftar Sekarang
                </Link>
              </div>

              {/* Kolom kanan: highlight event */}
              <div className="text-left md:text-right">
                <label className="block text-sm text-slate-600 mb-2">
                  Tema Acara:
                </label>
                <div className="text-xl font-semibold">
                  "Melodi Untuk Negeri"
                </div>
                <p className="mt-3 text-slate-700">
                  Performa spesial dari siswa, pengajar, dan bintang tamu dalam
                  satu malam penuh harmoni.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RANGKAIAN EVENT */}
      <section className="py-16 bg-gradient-to-b from-white to-brand-soft/40">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center mb-10">
            Rangkaian Acara
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                t: "Workshop Piano",
                d: "Belajar teknik & improvisasi dari pengajar berpengalaman.",
              },
              {
                t: "Recital Siswa",
                d: "Penampilan spesial dari siswa GuruNada.",
              },
              {
                t: "Konser Utama",
                d: "Persembahan kolaborasi pengajar & bintang tamu.",
              },
              {
                t: "Meet & Greet",
                d: "Kesempatan bertemu langsung dengan musisi.",
              },
              {
                t: "Sesi Foto",
                d: "Abadikan momen bersama keluarga & sahabat.",
              },
              { t: "Closing Ceremony", d: "Penutup acara penuh kejutan." },
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

      {/* FAQ sederhana */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <details className="rounded-xl border bg-white p-4">
            <summary className="font-medium cursor-pointer">
              Apakah acara ini terbuka untuk umum?
            </summary>
            <p className="mt-2 text-slate-600 text-sm">
              Ya, semua bisa hadir dengan melakukan registrasi terlebih dahulu.
            </p>
          </details>
          <details className="rounded-xl border bg-white p-4">
            <summary className="font-medium cursor-pointer">
              Apakah ada biaya tiket?
            </summary>
            <p className="mt-2 text-slate-600 text-sm">
              Untuk workshop ada biaya pendaftaran, sedangkan recital & konser
              utama gratis bagi keluarga siswa.
            </p>
          </details>
          <details className="rounded-xl border bg-white p-4">
            <summary className="font-medium cursor-pointer">
              Bagaimana cara mendaftar?
            </summary>
            <p className="mt-2 text-slate-600 text-sm">
              Klik tombol “Daftar Sekarang” dan isi formulir yang tersedia.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
