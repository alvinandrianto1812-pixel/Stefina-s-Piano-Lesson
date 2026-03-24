// src/pages/user/ContactUs.jsx
import React from "react";
import Footer from "../../components/Footer";

const WA_NUMBER = "620818359580"; // 0818359580 → format internasional tanpa +
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
  "Hello GuruNada! I'd like to ask about piano lessons.",
)}`;

const INFO = [
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
      </svg>
    ),
    label: "WhatsApp",
    value: "0818-359-580",
    href: WA_LINK,
    cta: "Chat on WhatsApp",
    bg: "#DCFCE7",
    color: "#166534",
    btnBg: "#16A34A",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: "Email",
    value: "hello@gurunada.id",
    href: "mailto:hello@gurunada.id",
    cta: "Send Email",
    bg: "#DBEAFE",
    color: "#1E3A8A",
    btnBg: "#2563EB",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
    ),
    label: "Operating Hours",
    value: "Mon–Fri 13:00–18:00\nSat 09:00–14:00",
    href: null,
    cta: null,
    bg: "#F5EDD6",
    color: "#713F12",
    btnBg: null,
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: "Location",
    value: "Jakarta, Indonesia",
    href: null,
    cta: null,
    bg: "#FCE7F3",
    color: "#831843",
    btnBg: null,
  },
];

const FAQS = [
  {
    q: "How fast do you reply?",
    a: "We typically reply via WhatsApp within a few hours on business days.",
  },
  {
    q: "Can I ask about scheduling via WhatsApp?",
    a: "Absolutely! WhatsApp is our preferred channel for quick questions about schedules and availability.",
  },
  {
    q: "Do you offer trial classes?",
    a: "Yes! Fill in the Registration form and we'll arrange a trial session for you.",
  },
];

export default function ContactUs() {
  const [open, setOpen] = React.useState(null);

  return (
    <div
      className="-mt-[6.5rem] md:-mt-28 lg:-mt-[7.5rem] text-brand-dark"
      style={{
        fontFamily:
          '"Creato Display", system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
        background: "#F8F6ED",
      }}
    >
      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: "#0F1110",
          minHeight: "420px",
        }}
      >
        {/* Layer 1: Warm charcoal sweep */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(125deg, rgba(39,41,37,0) 0%, rgba(48,51,41,0.9) 45%, rgba(48,51,41,0.6) 100%)",
            pointerEvents: "none",
          }}
        />
        {/* Layer 2: Blush shimmer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 60% at 85% 15%, rgba(209,167,153,0.14) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        {/* Layer 3: Olive warmth */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 55% 40% at 30% 100%, rgba(80,85,60,0.3) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        {/* Layer 4: Deep vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 40% 40% at 0% 100%, rgba(8,9,8,0.55) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="max-w-7xl mx-auto px-6"
          style={{
            paddingTop: "160px",
            paddingBottom: "64px",
            position: "relative",
            zIndex: 10,
          }}
        >
          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 56px)",
              fontWeight: "700",
              lineHeight: 1.15,
              color: "#F8F6ED",
              margin: 0,
            }}
          >
            Contact <br />
            <span style={{ color: "#F8F6ED", opacity: 0.9 }}>Us</span>
          </h1>
          <p
            style={{
              marginTop: "20px",
              fontSize: "17px",
              maxWidth: "520px",
              lineHeight: 1.65,
              color: "rgba(248,246,237,0.72)",
            }}
          >
            Questions about classes, schedules, or events? We'd love to hear
            from you.
          </p>
        </div>

        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          style={{ display: "block" }}
        ></svg>
      </section>

      {/* ─── CONTACT CARDS ────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {INFO.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl p-7 border flex flex-col gap-4"
                style={{
                  background: "#FFFFFF",
                  borderColor: "#E8E0CC",
                  boxShadow: "0 2px 12px rgba(39,41,37,0.06)",
                }}
              >
                {/* icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: item.bg, color: item.color }}
                >
                  {item.icon}
                </div>

                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-1"
                    style={{ color: "#94A3B8" }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="font-semibold text-lg whitespace-pre-line"
                    style={{ color: "#272925" }}
                  >
                    {item.value}
                  </p>
                </div>

                {item.cta && item.href && (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition hover:opacity-90 w-fit"
                    style={{
                      background: item.btnBg,
                      color: "#FFFFFF",
                      boxShadow: `0 4px 16px ${item.btnBg}55`,
                    }}
                  >
                    {item.cta}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7,7 17,7 17,17" />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRIMARY CTA — WhatsApp ────────────────────────────────────────── */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <div
            className="rounded-3xl p-10 text-center"
            style={{
              background: "linear-gradient(135deg, #272925 0%, #50553C 100%)",
              boxShadow: "0 16px 48px rgba(39,41,37,0.2)",
            }}
          >
            {/* WA icon */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: "#25D366" }}
            >
              <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>

            <h2
              className="text-2xl md:text-3xl font-bold mb-3"
              style={{ color: "#F8F6ED" }}
            >
              Have a question? Chat with us directly.
            </h2>
            <p
              className="mb-8 max-w-md mx-auto"
              style={{ color: "rgba(248,246,237,0.65)" }}
            >
              The fastest way to reach us is via WhatsApp. We're happy to help
              with class inquiries, scheduling, or anything else.
            </p>

            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition hover:opacity-90"
              style={{
                background: "#25D366",
                color: "#FFFFFF",
                boxShadow: "0 8px 28px rgba(37,211,102,0.35)",
              }}
            >
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>

            <p
              className="mt-4 text-sm"
              style={{ color: "rgba(248,246,237,0.4)" }}
            >
              +62 0818-359-580
            </p>
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2
            className="text-2xl font-bold text-center mb-10"
            style={{ color: "#272925" }}
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border overflow-hidden"
                style={{
                  background: "#FFFFFF",
                  borderColor: open === i ? "#D4AF37" : "#E8E0CC",
                  transition: "border-color 0.2s",
                }}
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold"
                  style={{ color: "#272925" }}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  {item.q}
                  <span
                    className="ml-4 text-xl transition-transform duration-200 flex-shrink-0"
                    style={{
                      color: "#D4AF37",
                      transform: open === i ? "rotate(45deg)" : "rotate(0)",
                    }}
                  >
                    +
                  </span>
                </button>
                {open === i && (
                  <div
                    className="px-6 pb-4 text-sm leading-relaxed"
                    style={{ color: "#64748B" }}
                  >
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
