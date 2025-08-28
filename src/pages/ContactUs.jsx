// src/pages/ContactUs.jsx
import React, { useState } from "react";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

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
            Hubungi <span className="font-bold">Kami</span>
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            Ada pertanyaan soal kelas, jadwal, atau event? Kami siap membantu.
          </p>
        </div>
      </section>

      {/* INFO & FORM */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-6">
          {/* Kartu kontak */}
          <div className="rounded-2xl p-6 border bg-white">
            <div className="text-brand-gold text-2xl mb-2">★</div>
            <h2 className="font-semibold text-xl mb-2">Informasi Kontak</h2>
            <ul className="text-sm text-slate-700 space-y-2">
              <li>
                <span className="font-semibold">Email:</span> hello@gurunada.id
              </li>
              <li>
                <span className="font-semibold">Telepon:</span> +62
                812-0000-0000
              </li>
              <li>
                <span className="font-semibold">Alamat:</span> Jl. Harmoni No.
                88, Jakarta
              </li>
              <li>
                <span className="font-semibold">Jam Operasional:</span>{" "}
                Senin–Sabtu, 09.00–18.00
              </li>
            </ul>
            <a
              href="mailto:hello@gurunada.id"
              className="inline-flex mt-6 px-5 py-3 rounded-full bg-brand-gold text-white hover:opacity-90 shadow-luxe"
            >
              Kirim Email
            </a>
          </div>

          {/* Form (tampilan saja, tanpa perubahan style) */}
          <form
            className="rounded-2xl p-6 border bg-white"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Terima kasih! Pesanmu telah direkam (dummy).");
            }}
          >
            <div className="text-brand-gold text-2xl mb-2">★</div>
            <h2 className="font-semibold text-xl mb-4">Formulir Pesan</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <input
                required
                placeholder="Nama Lengkap"
                className="rounded-xl border px-3 h-12"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                required
                type="email"
                placeholder="Email"
                className="rounded-xl border px-3 h-12"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <input
              required
              placeholder="Subjek"
              className="rounded-xl border px-3 h-12 w-full mt-4"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />

            <textarea
              required
              placeholder="Tulis pesanmu..."
              className="rounded-xl border px-3 py-3 w-full h-36 mt-4"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />

            <button
              type="submit"
              className="inline-flex mt-6 px-5 py-3 rounded-full bg-brand-gold text-white hover:opacity-90 shadow-luxe"
            >
              Kirim Pesan
            </button>
          </form>
        </div>
      </section>

      {/* FAQ pendek */}
      <section className="py-12 bg-gradient-to-b from-white to-brand-soft/40">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <details className="rounded-xl border bg-white p-4">
            <summary className="font-medium cursor-pointer">
              Berapa lama respons email?
            </summary>
            <p className="mt-2 text-slate-600 text-sm">
              Biasanya dalam 1×24 jam pada hari kerja.
            </p>
          </details>
          <details className="rounded-xl border bg-white p-4">
            <summary className="font-medium cursor-pointer">
              Apakah bisa trial class?
            </summary>
            <p className="mt-2 text-slate-600 text-sm">
              Bisa, hubungi kami untuk jadwal dan ketersediaan.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
