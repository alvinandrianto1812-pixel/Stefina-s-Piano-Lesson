// src/components/FeatureExplorer.jsx
import { useState, useEffect, useRef } from "react";
import "./FeatureExplorer.css";

/* ─────────────────────────────────────────
   Visual cards — pure JSX/CSS, no images
───────────────────────────────────────── */

function CurriculumCard() {
  const steps = [
    { label: "Beginner", fill: 100, state: "done" },
    { label: "Intermediate", fill: 65, state: "current" },
    { label: "Advanced", fill: 0, state: "" },
  ];
  return (
    <div className="vis-card">
      <div className="vis-card__label">Your Learning Path</div>
      <div className="vis-timeline">
        {steps.map((s, i) => (
          <div key={i} className={`vis-tl-item ${s.state}`}>
            <div className="vis-tl-item__label">
              <span className="vis-tl-item__dot" />
              {s.label}
            </div>
            <div className="vis-tl-bar-track">
              <div
                className="vis-tl-bar-fill"
                style={{ width: `${s.fill}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p
        style={{
          marginTop: "1.5rem",
          fontSize: "0.8rem",
          color: "#888",
          fontStyle: "italic",
        }}
      >
        "Tailored to your pace, not a fixed syllabus."
      </p>
    </div>
  );
}

function ScheduleCard() {
  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  const slots = [
    ["available", "booked", "available", "selected", "available"],
    ["booked", "available", "booked", "available", "available"],
    ["available", "available", "available", "booked", "available"],
  ];
  const times = ["09:00", "14:00", "17:00"];
  return (
    <div className="vis-card">
      <div className="vis-card__label">Pick Your Slot</div>
      <div className="vis-schedule">
        <div className="vis-schedule__days">
          {days.map((d, di) => (
            <div key={d} className="vis-day">
              <div className="vis-day__label">{d}</div>
              <div className="vis-day__slots">
                {slots.map((row, ri) => (
                  <div key={ri} className={`vis-slot ${row[di]}`}>
                    {times[ri]}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: "1rem",
            fontSize: "0.72rem",
            color: "var(--blush)",
            fontWeight: 700,
          }}
        >
          ● Selected — Thu 14:00 &nbsp;|&nbsp; Easy to reschedule anytime
        </div>
      </div>
    </div>
  );
}

function RecitalCard() {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const pct = 0.78;
  const skills = [
    { label: "Scales & Arpeggios", pct: 90 },
    { label: "Sight-reading", pct: 74 },
    { label: "Repertoire", pct: 82 },
  ];
  return (
    <div className="vis-card">
      <div className="vis-card__label">Exam Preparation</div>
      <div className="vis-ring-wrap">
        <div className="vis-ring">
          <svg viewBox="0 0 88 88">
            <circle
              cx="44"
              cy="44"
              r={r}
              fill="none"
              stroke="rgba(80,85,60,0.1)"
              strokeWidth="7"
            />
            <circle
              cx="44"
              cy="44"
              r={r}
              fill="none"
              stroke="var(--blush)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={`${circ * pct} ${circ * (1 - pct)}`}
            />
          </svg>
          <div className="vis-ring__label">
            <span style={{ fontSize: "1rem", fontWeight: 800 }}>78%</span>
            <span className="vis-ring__badge">Ready</span>
          </div>
        </div>
        <div className="vis-ring-info">
          <div className="vis-ring-info__title">ABRSM Grade 4</div>
          <div className="vis-ring-info__sub">Exam in 6 weeks</div>
        </div>
      </div>
      <div className="vis-skills">
        {skills.map((s) => (
          <div key={s.label} className="vis-skill">
            <div className="vis-skill__label">
              <span>{s.label}</span>
              <span className="vis-skill__pct">{s.pct}%</span>
            </div>
            <div className="vis-skill-track">
              <div className="vis-skill-fill" style={{ width: `${s.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressCard() {
  const milestones = [
    { text: "Week 1 — Scales & hands separately", state: "done" },
    { text: "Week 2 — Sight-reading basics", state: "done" },
    { text: "Week 3 — Chopin Op. 9, bars 1–16", state: "done" },
    { text: "Week 4 — Cadenza & dynamics", state: "current" },
  ];
  return (
    <div className="vis-card">
      <div className="vis-card__label">Session Notes</div>
      <div className="vis-milestones">
        {milestones.map((m, i) => (
          <div key={i} className={`vis-milestone ${m.state}`}>
            <span className="vis-milestone__icon">
              {m.state === "done" ? "✓" : "→"}
            </span>
            <span className="vis-milestone__text">{m.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Feature data
───────────────────────────────────────── */
const FEATURES = [
  {
    num: "01",
    title: "Personalized Curriculum",
    desc: "Every student gets a learning path built around their goals, level, and interests — from beginner scales to advanced repertoire. No two journeys are the same.",
    visual: <CurriculumCard />,
  },
  {
    num: "02",
    title: "Flexible Scheduling",
    desc: "Pick any open slot that fits your week. Need to reschedule? Simply choose another available time — hassle-free, no penalty.",
    visual: <ScheduleCard />,
  },
  {
    num: "03",
    title: "Recital & Graded Prep",
    desc: "Preparing for ABRSM, Trinity, or a school recital? Your mentor coaches you specifically toward the exam — technique, sight-reading, and performance confidence.",
    visual: <RecitalCard />,
  },
  {
    num: "04",
    title: "Track Your Progress",
    desc: "After each session, your mentor logs notes and milestones so both you and your parents always know where you stand and what comes next.",
    visual: <ProgressCard />,
  },
];

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export default function FeatureExplorer() {
  const [active, setActive] = useState(0);
  const outerRef = useRef(null);

  useEffect(() => {
    // Di mobile: disable scroll-based navigation
    const isMobile = () => window.innerWidth <= 768;

    const handleScroll = () => {
      if (isMobile()) return; // mobile pakai tap, bukan scroll
      const el = outerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrolled = -rect.top;
      const range = rect.height - window.innerHeight;
      if (scrolled < 0 || range <= 0) return;
      const progress = Math.min(scrolled / range, 0.9999);
      setActive(Math.floor(progress * FEATURES.length));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="fe-outer" ref={outerRef} id="features">
      {/* Sticky panel */}
      <div className="fe-sticky">
        {/* LEFT — text */}
        <div className="fe-left">
          {FEATURES.map((f, i) => (
            <div key={i} className={`fe-copy ${i === active ? "active" : ""}`}>
              <span className="fe-copy__num">{f.num} / 04</span>
              <h3 className="fe-copy__title">{f.title}</h3>
              <p className="fe-copy__desc">{f.desc}</p>
              <div className="fe-dots">
                {FEATURES.map((_, di) => (
                  <div
                    key={di}
                    className={`fe-dot ${di === active ? "active" : ""}`}
                  />
                ))}
              </div>
              {/* Mobile nav buttons — only visible on mobile */}
              <div
                style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}
                className="fe-mobile-nav"
              >
                <button
                  onClick={() => setActive((a) => Math.max(0, a - 1))}
                  disabled={i === 0}
                  style={{
                    padding: "0.5rem 1.25rem",
                    borderRadius: "99px",
                    border: "1.5px solid rgba(80,85,60,0.3)",
                    background: "transparent",
                    color: "var(--olive)",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    opacity: i === 0 ? 0.3 : 1,
                  }}
                >
                  ← Prev
                </button>
                <button
                  onClick={() =>
                    setActive((a) => Math.min(FEATURES.length - 1, a + 1))
                  }
                  disabled={i === FEATURES.length - 1}
                  style={{
                    padding: "0.5rem 1.25rem",
                    borderRadius: "99px",
                    background: "var(--olive)",
                    color: "var(--cream)",
                    border: "none",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    opacity: i === FEATURES.length - 1 ? 0.3 : 1,
                  }}
                >
                  Next →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT — visual */}
        <div className="fe-right">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className={`fe-visual ${i === active ? "active" : ""}`}
            >
              {f.visual}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
