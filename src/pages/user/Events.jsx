// src/pages/user/Events.jsx
import React, { useState } from "react";
import Footer from "../../components/Footer";

// ─── EVENT DATA ────────────────────────────────────────────────────────────────
const EVENTS = [
  {
    id: 1,
    title: "GuruNada Year-End Concert 2025",
    subtitle: "An Evening of Young Pianists",
    month: "DEC",
    day: "20",
    year: "2025",
    time_start: "7:00 PM",
    time_end: "9:30 PM",
    location: "Jakarta Music Hall",
    location_detail: "Ballroom A, 3rd Floor",
    city: "Jakarta, Indonesia",
    description:
      "A special year-end performance by our students, teachers, and guest musicians. An intimate evening celebrating a full year of musical growth and dedication.",
    tags: ["Recital", "Free for Students' Families"],
    highlight: true,
  },
  {
    id: 2,
    title: "Piano Workshop: Technique & Interpretation",
    subtitle: null,
    month: "NOV",
    day: "08",
    year: "2025",
    time_start: "9:00 AM",
    time_end: "1:00 PM",
    location: "GuruNada Studio",
    location_detail: null,
    city: "Jakarta, Indonesia",
    description:
      "An intensive workshop for intermediate to advanced students focusing on tone production, phrasing, and expressive interpretation. Led by Stefina Wibisono.",
    tags: ["Workshop", "Intermediate–Advanced"],
    highlight: false,
  },
  {
    id: 3,
    title: "Student Recital — Semester 2",
    subtitle: "Mid-Year Performance",
    month: "JUL",
    day: "19",
    year: "2025",
    time_start: "4:00 PM",
    time_end: "6:00 PM",
    location: "Erasmus Huis",
    location_detail: null,
    city: "Jakarta, Indonesia",
    description:
      "Students from all levels present their semester repertoire in a warm and supportive recital setting. Families and friends are welcome.",
    tags: ["Recital", "All Levels"],
    highlight: false,
  },
  {
    id: 4,
    title: "Piano Masterclass — Young Pianists",
    subtitle: null,
    month: "MAY",
    day: "03",
    year: "2025",
    time_start: "10:00 AM",
    time_end: "5:00 PM",
    location: "GuruNada Studio",
    location_detail: null,
    city: "Jakarta, Indonesia",
    description:
      "Individual coaching sessions with our Principal Teacher for students preparing for competitions, grade exams, or performance milestones.",
    tags: ["Masterclass", "By Invitation"],
    highlight: false,
  },
];

const MONTH_MAP = {
  JAN: "01",
  FEB: "02",
  MAR: "03",
  APR: "04",
  MAY: "05",
  JUN: "06",
  JUL: "07",
  AUG: "08",
  SEP: "09",
  OCT: "10",
  NOV: "11",
  DEC: "12",
};

function EventItem({ ev, isLast }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        borderBottom: isLast ? "none" : "1px solid rgba(39,41,37,0.08)",
        paddingTop: "44px",
        paddingBottom: "44px",
        display: "flex",
        gap: "36px",
        alignItems: "flex-start",
      }}
    >
      {/* DATE BADGE */}
      <div style={{ flexShrink: 0, width: "68px" }}>
        <div
          style={{
            borderRadius: "10px 10px 0 0",
            background: ev.highlight ? "#272925" : "#50553C",
            color: "#F8F6ED",
            textAlign: "center",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.18em",
            padding: "7px 4px 5px",
          }}
        >
          {ev.month}
        </div>
        <div
          style={{
            borderRadius: "0 0 10px 10px",
            background: ev.highlight
              ? "rgba(39,41,37,0.07)"
              : "rgba(80,85,60,0.06)",
            border: `1px solid ${ev.highlight ? "rgba(39,41,37,0.15)" : "rgba(80,85,60,0.13)"}`,
            borderTop: "none",
            textAlign: "center",
            fontSize: "28px",
            fontWeight: "800",
            color: ev.highlight ? "#272925" : "#50553C",
            padding: "8px 4px 10px",
            lineHeight: 1,
          }}
        >
          {ev.day}
        </div>
        <div
          style={{
            marginTop: "6px",
            textAlign: "center",
            fontSize: "11px",
            color: "#94A3B8",
            letterSpacing: "0.05em",
          }}
        >
          {ev.year}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Tags */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            flexWrap: "wrap",
            marginBottom: "10px",
          }}
        >
          {ev.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: "3px 10px",
                borderRadius: "999px",
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "0.04em",
                background: ev.highlight ? "#272925" : "#F0EDE4",
                color: ev.highlight ? "#F8F6ED" : "#50553C",
                border: ev.highlight ? "none" : "1px solid rgba(80,85,60,0.15)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: "clamp(17px, 2.2vw, 21px)",
            fontWeight: "700",
            color: "#272925",
            margin: "0 0 4px",
            lineHeight: 1.3,
            fontFamily: '"Rockdale FREE", "Playfair Display", serif',
          }}
        >
          {ev.title}
        </h2>
        {ev.subtitle && (
          <p
            style={{
              fontSize: "13px",
              color: "#94A3B8",
              margin: "0 0 14px",
              fontStyle: "italic",
            }}
          >
            {ev.subtitle}
          </p>
        )}

        {/* Meta */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "18px",
            marginTop: ev.subtitle ? 0 : "12px",
            marginBottom: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D1A799"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: "14px", height: "14px", flexShrink: 0 }}
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
            <span style={{ fontSize: "13px", color: "#475569" }}>
              {ev.time_start}
              {ev.time_end && (
                <span style={{ color: "#94A3B8" }}> – {ev.time_end}</span>
              )}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D1A799"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: "14px", height: "14px", flexShrink: 0 }}
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span style={{ fontSize: "13px", color: "#475569" }}>
              {ev.location}
              {ev.location_detail && (
                <span style={{ color: "#94A3B8" }}>, {ev.location_detail}</span>
              )}
              <span style={{ color: "#94A3B8" }}> · {ev.city}</span>
            </span>
          </div>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.7,
            color: "#475569",
            margin: 0,
            maxWidth: "600px",
          }}
        >
          {ev.description}
        </p>

        {/* Toggle button */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            marginTop: "16px",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "13px",
            fontWeight: "600",
            color: "#272925",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#50553C")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#272925")}
        >
          {expanded ? "Hide Details" : "View Event"}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              width: "13px",
              height: "13px",
              transform: expanded ? "rotate(90deg)" : "none",
              transition: "transform 0.2s",
            }}
          >
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </button>

        {/* Expanded panel */}
        {expanded && (
          <div
            style={{
              marginTop: "18px",
              padding: "20px 22px",
              borderRadius: "14px",
              background: "#FFFFFF",
              border: "1px solid #E8E0CC",
              boxShadow: "0 2px 12px rgba(39,41,37,0.06)",
              maxWidth: "520px",
            }}
          >
            <p
              style={{ fontSize: "13px", color: "#64748B", margin: "0 0 10px" }}
            >
              📅{" "}
              <strong style={{ color: "#272925" }}>
                {ev.month} {ev.day}, {ev.year}
              </strong>{" "}
              · {ev.time_start}
              {ev.time_end && ` – ${ev.time_end}`}
            </p>
            <p
              style={{ fontSize: "13px", color: "#64748B", margin: "0 0 18px" }}
            >
              📍 {ev.location}
              {ev.location_detail && `, ${ev.location_detail}`} · {ev.city}
            </p>
            <a
              href={`https://www.google.com/calendar/event?action=TEMPLATE&text=${encodeURIComponent(ev.title)}&dates=${ev.year}${MONTH_MAP[ev.month]}${ev.day}&location=${encodeURIComponent(ev.city)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: "600",
                background: "#272925",
                color: "#F8F6ED",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#50553C")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#272925")
              }
            >
              + Add to Google Calendar
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Events() {
  return (
    <div
      className="-mt-[6.5rem] md:-mt-28 lg:-mt-[7.5rem]"
      style={{
        fontFamily:
          '"Creato Display", system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
        background: "#F8F6ED",
        color: "#272925",
      }}
    >
      {/* HERO */}
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
            Our <br />
            <span style={{ color: "#F8F6ED", opacity: 0.9 }}>Events</span>
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
            Concerts, workshops, recitals, and masterclasses — be part of our
            musical milestones.
          </p>
        </div>

        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          style={{ display: "block" }}
        ></svg>
      </section>

      {/* EVENTS LIST */}
      <section style={{ padding: "32px 0 72px" }}>
        <div className="max-w-4xl mx-auto px-6">
          {EVENTS.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 24px",
                color: "#94A3B8",
                fontSize: "15px",
              }}
            >
              No events scheduled at the moment. Check back soon!
            </div>
          ) : (
            EVENTS.map((ev, i) => (
              <EventItem key={ev.id} ev={ev} isLast={i === EVENTS.length - 1} />
            ))
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 0 80px" }}>
        <div className="max-w-4xl mx-auto px-6">
          <div
            style={{
              borderRadius: "20px",
              padding: "48px 40px",
              textAlign: "center",
              background: "#272925",
              boxShadow: "0 16px 48px rgba(39,41,37,0.18)",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#D1A799",
                marginBottom: "14px",
              }}
            >
              Stay Connected
            </p>
            <h3
              style={{
                fontSize: "clamp(20px, 3vw, 26px)",
                fontWeight: "700",
                color: "#F8F6ED",
                marginBottom: "10px",
                fontFamily: '"Rockdale FREE", "Playfair Display", serif',
              }}
            >
              Don't miss our next event.
            </h3>
            <p
              style={{
                marginBottom: "32px",
                color: "rgba(248,246,237,0.55)",
                fontSize: "14px",
                maxWidth: "400px",
                margin: "0 auto 32px",
              }}
            >
              Contact us on WhatsApp for event info, reservations, and updates.
            </p>
            <a
              href="https://wa.me/620818359580?text=Hi%20GuruNada!%20I'd%20like%20to%20know%20more%20about%20upcoming%20events."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "13px 32px",
                borderRadius: "999px",
                fontWeight: "600",
                fontSize: "14px",
                background: "#F8F6ED",
                color: "#272925",
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
                transition: "background 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#FFFFFF";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#F8F6ED";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="#25D366"
                style={{ width: "18px", height: "18px" }}
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Ask via WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
