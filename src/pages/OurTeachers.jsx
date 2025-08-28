// src/pages/OurTeachers.jsx
import React from "react";

const TEACHERS = [
  {
    name: "Alya Pramudita",
    role: "Piano (Classical)",
    exp: "10+ years",
    blurb: "Specialist in fundamentals & Romantic era interpretation.",
  },
  {
    name: "Rizky Mahendra",
    role: "Guitar (Acoustic/Pop)",
    exp: "7+ years",
    blurb: "Focus on chord voicing & beginner–intermediate improvisation.",
  },
  {
    name: "Nadine Salsabila",
    role: "Vocal (Pop/Jazz)",
    exp: "8+ years",
    blurb: "Breathing techniques, range building, and stage presence.",
  },
  {
    name: "Fajar Wicaksono",
    role: "Drums (Rock/Funk)",
    exp: "9+ years",
    blurb: "Groove, rudiments, and live performance coordination.",
  },
  {
    name: "Keisha Putri",
    role: "Violin (Beginner–Intermediate)",
    exp: "6+ years",
    blurb: "Intonation, bowing, and reading for school orchestra.",
  },
  {
    name: "Arka Setiadi",
    role: "Music Theory",
    exp: "10+ years",
    blurb: "Harmony, ear training, and exam preparation.",
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
            Meet Our <span className="font-bold">Teachers</span>
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            A team of experienced musicians ready to inspire your learning
            journey.
          </p>
        </div>
      </section>

      {/* TEACHER GRID */}
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
                  Experience: {t.exp}
                </div>
                <p className="text-sm text-slate-700 mt-3">{t.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEACHING VALUES */}
      <section className="py-16 bg-gradient-to-b from-white to-brand-soft/40">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center mb-10">
            Our Teaching Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                t: "Personalized Learning",
                d: "Tailored material for each student's goals and style.",
              },
              {
                t: "Performance Mindset",
                d: "Training focused on stage confidence.",
              },
              {
                t: "Strong Fundamentals",
                d: "Solid technique & theory from the start.",
              },
              {
                t: "Progress Tracking",
                d: "Measured development after every session.",
              },
              {
                t: "Creative Exploration",
                d: "Encouraging improvisation and experimentation.",
              },
              { t: "Community", d: "An inclusive and supportive environment." },
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
