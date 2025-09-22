// src/pages/LandingPage.jsx
import TypingText from "../../components/TypingText";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../../components/Footer";

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const waLink =
    "https://wa.me/6287848441575?text=" +
    encodeURIComponent(
      "Hello! I'd like to try a trial piano class. Is there any slot available this week?"
    );

  // Auto-scroll when URL has #hash (/#features, /#schedule, /#testimonials)
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location]);

  const handleBook = () => navigate("/Questionnaire");

  return (
    // Base page: cream (so it doesn't clash with the navbar)
    <div
      className="text-brand-dark bg-[#F8F6ED]"
      style={{
        fontFamily:
          '"Creato Display", system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
      }}
    >
      {/* HERO — cream → white gradient + subtle blush highlight */}
      <section
        className="relative min-h-[68vh] flex items-center"
        style={{
          background: "linear-gradient(180deg, #F8F6ED 0%, #FFFFFF 100%)",
        }}
      >
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(800px 300px at 20% 10%, rgba(209,167,153,0.22), transparent 60%)" /* #D1A799 */,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 pt-28 pb-10 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="headline text-4xl md:text-5xl leading-tight text-[#50553C]">
              Private Piano Lessons,{" "}
              <TypingText
                words={["Elegant", "Structured", "Professional"]}
                speed={90}
                deleteSpeed={45}
                pause={1200}
              />
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              From beginner to advanced—personalized curriculum, flexible
              scheduling, and professional guidance.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-full bg-brand-gold text-white shadow-luxe hover:opacity-90"
              >
                Try a Trial Class
              </a>
              <a
                href="#features"
                className="px-5 py-3 rounded-full border border-brand-gold hover:bg-brand-gold hover:text-white transition"
              >
                See Features
              </a>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span>★</span>
                <span>Mentors with 10+ years</span>
              </div>
              <div className="flex items-center gap-2">
                <span>♪</span>
                <span>Fun & engaging methods</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>Flexible schedule</span>
              </div>
            </div>
          </div>

          {/* “Mockup” class card */}
          <div className="md:justify-self-end w-full">
            <div className="rounded-2xl bg-white/90 backdrop-blur shadow-luxe border border-white/60 p-6">
              <div className="flex items-center justify-between">
                <h3
                  className="font-semibold"
                  style={{ fontFamily: '"Rockdale FREE", serif' }}
                >
                  Private Piano Class
                </h3>
                <span className="text-brand-gold font-semibold">New</span>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Basic technique, sight-reading, music theory, and your favorite
                repertoire.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {["Technique", "Theory", "Repertoire"].map((t) => (
                  <div key={t} className="rounded-xl border bg-white p-3">
                    <div className="text-sm font-medium">{t}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleBook}
                className="mt-6 w-full px-4 py-3 rounded-xl bg-brand-gold text-white hover:opacity-90"
              >
                Book a Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-16 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="headline text-3xl text-center mb-10 text-[#50553C]">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                title: "Personalized Curriculum",
                desc: "Tailored to your goals and learning pace.",
              },
              {
                title: "Flexible Scheduling",
                desc: "Pick a slot that fits; easy to reschedule.",
              },
              {
                title: "Recital/Graded Prep",
                desc: "Coaching toward exams or performances.",
              },
              {
                title: "Track Your Progress",
                desc: "Practice notes & milestones every session.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 border bg-white hover:shadow-luxe transition"
              >
                <div className="text-brand-gold text-2xl mb-3">★</div>
                <div className="font-semibold">{f.title}</div>
                <p className="text-sm text-slate-600 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-16 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="headline text-3xl text-center mb-10 text-[#50553C]">
            What Parents Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                q: "My child is more confident performing at school.",
                n: "— Mrs. Rina",
              },
              {
                q: "The method is fun—now my kid practices consistently.",
                n: "— Mr. Andi",
              },
              {
                q: "Patient and professional teachers. Highly recommended.",
                n: "— Michelle",
              },
            ].map((t, i) => (
              <figure key={i} className="rounded-2xl border bg-white p-6">
                <blockquote className="italic text-slate-700">
                  “{t.q}”
                </blockquote>
                <figcaption className="mt-3 text-sm text-slate-600">
                  {t.n}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — subtle olive wash */}
      <section
        id="faq"
        className="py-16 scroll-mt-24"
        style={{
          background:
            "linear-gradient(180deg, rgba(80,85,60,0.06) 0%, rgba(80,85,60,0.03) 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="headline text-3xl text-center mb-10 text-[#50553C]">
            Frequently Asked Questions
          </h2>
          <div className="divide-y rounded-2xl border bg-white">
            {[
              {
                q: "Can I try a class first?",
                a: "Yes. Fill out the questionnaire & choose a trial slot, then upload your payment proof. Our admin will verify and confirm via WhatsApp.",
              },
              {
                q: "Can I reschedule?",
                a: 'Yes, as long as a slot is available. You can pick another slot that isn’t marked as "Booked".',
              },
              {
                q: "What payment methods are available?",
                a: "Bank transfer. Upload the transfer proof (jpg/png/webp/pdf, max 5MB) when you submit the questionnaire.",
              },
            ].map((item, i) => (
              <details key={i} className="group p-4">
                <summary className="cursor-pointer font-medium flex items-center justify-between">
                  {item.q}
                  <span className="text-brand-gold ml-4 group-open:rotate-45 transition">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — charcoal solid from palette */}
      <section
        className="py-14 text-white"
        style={{ backgroundColor: "#272925" }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="headline text-3xl text-[#F8F6ED]">
            Ready to Start Your Musical Journey?
          </h3>
          <p className="mt-2 text-slate-300">
            Book a trial, fill out a short questionnaire, and choose a suitable
            schedule.
          </p>
          <button
            onClick={handleBook}
            className="mt-6 px-6 py-3 rounded-full bg-brand-gold text-white hover:opacity-90"
          >
            Book a Trial Now
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
