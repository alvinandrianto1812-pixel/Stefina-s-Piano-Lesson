// src/pages/Events.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Events() {
  return (
    <div className="font-sans text-brand-dark">
      {/* HERO */}
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
            Discover Music Events with{" "}
            <img
              src="/brand/gurunada_final_green-03.png"
              alt="GuruNada"
              className="h-10 md:h-12 lg:h-24 inline-block"
              draggable={false}
            />
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            Join concerts, workshops, and recitals —{" "}
            <span className="font-semibold">
              be part of our special moments
            </span>
            .
          </p>
        </div>
      </section>

      {/* MAIN EVENT CARD */}
      <section className="relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-2xl bg-white/90 backdrop-blur border border-white/60 shadow-luxe p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="text-left">
                <div className="text-3xl md:text-4xl font-bold">
                  Year-End Concert 2025
                </div>
                <div className="text-slate-600">
                  Saturday, December 20, 2025
                </div>
                <div className="mt-3 text-slate-600 text-sm">
                  Venue: Jakarta Music Hall
                </div>

                <Link
                  to="/questionnaire"
                  className="inline-flex mt-6 px-5 py-3 rounded-full bg-brand-gold text-white hover:opacity-90 shadow-luxe"
                >
                  Register Now
                </Link>
              </div>

              <div className="text-left md:text-right">
                <label className="block text-sm text-slate-600 mb-2">
                  Theme:
                </label>
                <div className="text-xl font-semibold">
                  "Melodies for the Nation"
                </div>
                <p className="mt-3 text-slate-700">
                  A special performance by our students, teachers, and guest
                  stars in one night of harmony.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EVENT LINEUP */}
      <section className="py-16 bg-gradient-to-b from-white to-brand-soft/40">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center mb-10">
            Event Highlights
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                t: "Piano Workshop",
                d: "Learn techniques & improvisation from experienced instructors.",
              },
              {
                t: "Student Recital",
                d: "Special performances by gurunada students.",
              },
              {
                t: "Main Concert",
                d: "A collaboration between teachers and guest stars.",
              },
              {
                t: "Meet & Greet",
                d: "A chance to meet the musicians in person.",
              },
              {
                t: "Photo Session",
                d: "Capture the moments with family and friends.",
              },
              { t: "Closing Ceremony", d: "A finale full of surprises." },
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

      {/* FAQ */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <details className="rounded-xl border bg-white p-4">
            <summary className="font-medium cursor-pointer">
              Is this event open to the public?
            </summary>
            <p className="mt-2 text-slate-600 text-sm">
              Yes, everyone is welcome by registering first.
            </p>
          </details>
          <details className="rounded-xl border bg-white p-4">
            <summary className="font-medium cursor-pointer">
              Is there a ticket fee?
            </summary>
            <p className="mt-2 text-slate-600 text-sm">
              Workshops require a registration fee, while recitals and the main
              concert are free for students' families.
            </p>
          </details>
          <details className="rounded-xl border bg-white p-4">
            <summary className="font-medium cursor-pointer">
              How do I register?
            </summary>
            <p className="mt-2 text-slate-600 text-sm">
              Click the “Register Now” button and fill out the form.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
