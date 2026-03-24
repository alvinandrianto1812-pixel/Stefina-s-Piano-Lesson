// src/pages/user/OurServices.jsx
import React from "react";
import Footer from "../../components/Footer";

const INSTRUMENTS = [
  { name: "Piano", icon: "♩", color: "#50553C" },
  { name: "Violin", icon: "♪", color: "#50553C" },
  { name: "Cello", icon: "♫", color: "#50553C" },
  { name: "Vocal", icon: "♬", color: "#50553C" },
  { name: "Trumpet", icon: "♩", color: "#50553C" },
];

const LESSON_TYPES = [
  {
    title: "Trial Class",
    freq: "1× (one-time)",
    duration: "60 minutes",
    desc: "A single introductory session to experience our teaching style before committing to a full program.",
    highlight: false,
    badge: "Start Here",
  },
  {
    title: "Regular Private Lesson",
    freq: "1× per week",
    duration: "60 minutes / session",
    desc: "Our standard program — one dedicated session per week with your assigned teacher, following a structured and personalized curriculum.",
    highlight: true,
    badge: "Most Popular",
  },
  {
    title: "Intensive Program",
    freq: "2× per week",
    duration: "60 minutes / session",
    desc: "For students who want to accelerate progress, prepare for exams, or build consistency faster with two lessons per week.",
    highlight: false,
    badge: "Accelerated",
  },
];

const SCHEDULE = [
  { day: "Monday – Friday", time: "13:00 – 18:00" },
  { day: "Saturday", time: "09:00 – 14:00" },
  { day: "Sunday", time: "Closed" },
];

const NOTES = [
  "All lessons are conducted one-on-one (private) with a dedicated teacher.",
  "Lesson duration is fixed at 60 minutes per session.",
  "Schedule is arranged on a weekly, fixed-day basis upon enrollment.",
  "Home visit options are available for select teachers (subject to availability).",
  "Makeup classes are available (max 2× per month, 24h notice required).",
];

export default function OurServices() {
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
      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: "#0F1110",
          minHeight: "420px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(125deg, rgba(39,41,37,0) 0%, rgba(48,51,41,0.9) 45%, rgba(48,51,41,0.6) 100%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 60% at 85% 15%, rgba(209,167,153,0.14) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 55% 40% at 30% 100%, rgba(80,85,60,0.3) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
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
            <span style={{ color: "#F8F6ED", opacity: 0.9 }}>Services</span>
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
            Private music lessons tailored to your pace, schedule, and goals —
            for all ages and levels.
          </p>

          {/* stats */}
          <div
            style={{
              marginTop: "30px",
              display: "flex",
              flexWrap: "wrap",
              gap: "32px",
            }}
          >
            {[
              { num: "60 min", label: "Per Session" },
              { num: "1-on-1", label: "Private Only" },
              { num: "5+", label: "Instruments" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#F8F6ED",
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    marginTop: "2px",
                    color: "rgba(248,246,237,0.55)",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          style={{ display: "block" }}
        ></svg>
      </section>

      {/* ─── LESSON TYPES ─────────────────────────────────────────────────── */}
      <section style={{ padding: "72px 0 80px" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#50553C",
                marginBottom: "12px",
              }}
            >
              Lesson Programs
            </p>
            <h2
              style={{
                fontSize: "clamp(26px, 4vw, 34px)",
                fontWeight: "700",
                color: "#272925",
                margin: 0,
              }}
            >
              Frequency & Duration
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
              gap: "24px",
            }}
          >
            {LESSON_TYPES.map((lt, i) => (
              <div
                key={i}
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: lt.highlight
                    ? "2px solid #272925"
                    : "1px solid #E8E0CC",
                  background: "#FFFFFF",
                  boxShadow: lt.highlight
                    ? "0 8px 32px rgba(39,41,37,0.14)"
                    : "0 2px 16px rgba(39,41,37,0.06)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 14px 36px rgba(39,41,37,0.13)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = lt.highlight
                    ? "0 8px 32px rgba(39,41,37,0.14)"
                    : "0 2px 16px rgba(39,41,37,0.06)";
                }}
              >
                {/* header strip */}
                <div
                  style={{
                    padding: "18px 24px 16px",
                    background: lt.highlight
                      ? "linear-gradient(90deg, #272925 0%, #50553C 100%)"
                      : "#F8F6ED",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: "700",
                      color: lt.highlight ? "#F8F6ED" : "#272925",
                      margin: 0,
                    }}
                  >
                    {lt.title}
                  </h3>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      letterSpacing: "0.08em",
                      padding: "3px 10px",
                      borderRadius: "999px",
                      background: lt.highlight
                        ? "rgba(248,246,237,0.15)"
                        : "rgba(39,41,37,0.08)",
                      color: lt.highlight ? "#F8F6ED" : "#50553C",
                      border: lt.highlight
                        ? "1px solid rgba(248,246,237,0.25)"
                        : "1px solid rgba(80,85,60,0.2)",
                    }}
                  >
                    {lt.badge}
                  </span>
                </div>

                {/* body */}
                <div
                  style={{
                    padding: "24px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {/* freq + duration */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background:
                            "linear-gradient(135deg, #272925, #50553C)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#F8F6ED"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ width: "16px", height: "16px" }}
                        >
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: "10px",
                            color: "#94A3B8",
                            margin: 0,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                          }}
                        >
                          Frequency
                        </p>
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#272925",
                            margin: 0,
                          }}
                        >
                          {lt.freq}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background:
                            "linear-gradient(135deg, #272925, #50553C)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#F8F6ED"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ width: "16px", height: "16px" }}
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12,6 12,12 16,14" />
                        </svg>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: "10px",
                            color: "#94A3B8",
                            margin: 0,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                          }}
                        >
                          Duration
                        </p>
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#272925",
                            margin: 0,
                          }}
                        >
                          {lt.duration}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* divider */}
                  <div
                    style={{
                      height: "1px",
                      background:
                        "linear-gradient(90deg, #272925, transparent)",
                      opacity: 0.1,
                    }}
                  />

                  {/* desc */}
                  <p
                    style={{
                      fontSize: "13px",
                      lineHeight: 1.7,
                      color: "#475569",
                      margin: 0,
                      flex: 1,
                    }}
                  >
                    {lt.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SCHEDULE ─────────────────────────────────────────────────────── */}
      <section style={{ padding: "0 0 80px" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
            }}
            className="lg:grid-cols-2"
          >
            {/* Operating Hours */}
            <div
              style={{
                borderRadius: "20px",
                background: "#FFFFFF",
                border: "1px solid #E8E0CC",
                padding: "32px",
                boxShadow: "0 2px 16px rgba(39,41,37,0.06)",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#50553C",
                  marginBottom: "12px",
                }}
              >
                Available Hours
              </p>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#272925",
                  marginBottom: "24px",
                }}
              >
                Schedule
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {SCHEDULE.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      background:
                        s.day === "Sunday"
                          ? "rgba(148,163,184,0.06)"
                          : "#F8F6ED",
                      border: "1px solid",
                      borderColor:
                        s.day === "Sunday"
                          ? "rgba(148,163,184,0.15)"
                          : "#E8E0CC",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: s.day === "Sunday" ? "#94A3B8" : "#272925",
                      }}
                    >
                      {s.day}
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        color: s.day === "Sunday" ? "#94A3B8" : "#50553C",
                        fontWeight: "500",
                      }}
                    >
                      {s.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div
              style={{
                borderRadius: "20px",
                background: "linear-gradient(135deg, #272925 0%, #50553C 100%)",
                padding: "32px",
                boxShadow: "0 8px 32px rgba(39,41,37,0.18)",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#D1A799",
                  marginBottom: "12px",
                }}
              >
                Good To Know
              </p>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#F8F6ED",
                  marginBottom: "24px",
                }}
              >
                General Notes
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {NOTES.map((note, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#D1A799",
                        flexShrink: 0,
                        marginTop: "7px",
                      }}
                    />
                    <p
                      style={{
                        fontSize: "13px",
                        lineHeight: 1.65,
                        color: "rgba(248,246,237,0.78)",
                        margin: 0,
                      }}
                    >
                      {note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INSTRUMENTS ──────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "72px 0",
          background:
            "linear-gradient(180deg, #F8F6ED 0%, rgba(39,41,37,0.04) 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#50553C",
                marginBottom: "12px",
              }}
            >
              Available For
            </p>
            <h2
              style={{
                fontSize: "clamp(26px, 4vw, 34px)",
                fontWeight: "700",
                color: "#272925",
                margin: 0,
              }}
            >
              Instruments We Teach
            </h2>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            {INSTRUMENTS.map((inst, i) => (
              <div
                key={i}
                style={{
                  padding: "16px 28px",
                  borderRadius: "14px",
                  background: "#FFFFFF",
                  border: "1px solid #E8E0CC",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#272925",
                  boxShadow: "0 2px 12px rgba(39,41,37,0.06)",
                  transition:
                    "box-shadow 0.2s, border-color 0.2s, transform 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(39,41,37,0.12)";
                  e.currentTarget.style.borderColor = "rgba(39,41,37,0.3)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 2px 12px rgba(39,41,37,0.06)";
                  e.currentTarget.style.borderColor = "#E8E0CC";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span style={{ fontSize: "20px", color: inst.color }}>
                  {inst.icon}
                </span>
                {inst.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "64px 0",
          textAlign: "center",
          background: "#272925",
        }}
      >
        <div className="max-w-2xl mx-auto px-6">
          <div
            style={{
              width: "40px",
              height: "2px",
              background: "#F8F6ED",
              opacity: 0.3,
              margin: "0 auto 24px",
              borderRadius: "2px",
            }}
          />
          <h3
            style={{
              fontSize: "clamp(22px, 3vw, 28px)",
              fontWeight: "700",
              color: "#F8F6ED",
              marginBottom: "12px",
            }}
          >
            Ready to start your lesson?
          </h3>
          <p
            style={{
              marginBottom: "32px",
              color: "rgba(248,246,237,0.55)",
              fontSize: "15px",
            }}
          >
            Book a trial class and experience our teaching style first-hand.
          </p>
          <a
            href="/OurPolicy"
            style={{
              display: "inline-block",
              padding: "13px 36px",
              borderRadius: "999px",
              fontWeight: "600",
              fontSize: "15px",
              background: "#F8F6ED",
              color: "#272925",
              textDecoration: "none",
              border: "1px solid rgba(248,246,237,0.3)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              transition: "background 0.2s, transform 0.15s",
              letterSpacing: "0.01em",
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
            Book a Trial Class
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
