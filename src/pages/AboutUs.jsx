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
            About{" "}
            <img
              src="/brand/gurunada_final_green-03.png"
              alt="GuruNada"
              className="h-10 md:h-12 lg:h-24 inline-block"
              draggable={false}
            />
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            Our mission: to make music learning structured, elegant, and
            enjoyable.
          </p>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl p-6 border bg-white">
            <div className="text-brand-gold text-2xl mb-2">★</div>
            <h2 className="font-semibold text-xl mb-2">Mission</h2>
            <p className="text-slate-700 text-sm">
              To create a learning ecosystem focused on solid technique,
              theoretical understanding, and performance confidence — all guided
              by a clear and trackable curriculum.
            </p>
          </div>
          <div className="rounded-2xl p-6 border bg-white">
            <div className="text-brand-gold text-2xl mb-2">★</div>
            <h2 className="font-semibold text-xl mb-2">Vision</h2>
            <p className="text-slate-700 text-sm">
              To become the trusted partner for families in Indonesia on their
              music journey — supported by modern teaching standards, helpful
              technology, and a nurturing community.
            </p>
          </div>
        </div>
      </section>

      {/* STORY & APPROACH */}
      <section className="py-16 bg-gradient-to-b from-white to-brand-soft/40">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-6">
          {[
            {
              t: "Our Story",
              d: "Started as a small private class, growing into a platform with teachers across instruments.",
            },
            {
              t: "Our Approach",
              d: "A mix of technique, theory, and performance — packaged into weekly measurable goals.",
            },
            {
              t: "Commitment to Quality",
              d: "Curated teachers, regular reviews, and constantly updated materials.",
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

      {/* FAQ */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <details className="rounded-xl border bg-white p-4">
            <summary className="font-medium cursor-pointer">
              What makes gurunada different?
            </summary>
            <p className="mt-2 text-slate-600 text-sm">
              A progressive curriculum, measurable tracking, and regular
              performance opportunities.
            </p>
          </details>
          <details className="rounded-xl border bg-white p-4">
            <summary className="font-medium cursor-pointer">
              Do you offer both online and offline classes?
            </summary>
            <p className="mt-2 text-slate-600 text-sm">
              Yes, both options are available depending on the instrument and
              schedule.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
