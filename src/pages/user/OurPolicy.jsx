// src/pages/user/OurPolicy.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

const POLICY_KEY = "gurunada_policy_accepted";

const POLICIES = [
  {
    section: "01",
    title: "Trial & Registration",
    icon: "♩",
    items: [
      "A trial class is required before full enrollment to ensure the program is a good fit.",
      "Registration is completed by filling out the student questionnaire and uploading proof of payment.",
      "Enrollment is confirmed only after admin verification of the payment.",
      "Each student is registered individually; siblings require separate registration forms.",
    ],
  },
  {
    section: "02",
    title: "Scheduling & Attendance",
    icon: "◷",
    items: [
      "Lessons are scheduled on a weekly, fixed-day basis (Monday–Friday 13:00–18:00; Saturday 09:00–14:00).",
      "Students are expected to attend every scheduled lesson consistently.",
      "Please arrive on time. Late arrivals will not receive extended lesson time.",
      "If a student is absent without prior notice, the lesson will be considered completed.",
    ],
  },
  {
    section: "03",
    title: "Rescheduling & Makeup Classes",
    icon: "↺",
    items: [
      "Reschedule requests must be submitted at least 24 hours in advance via WhatsApp.",
      "Makeup classes are available subject to teacher and slot availability.",
      "A maximum of 2 makeup classes per month is allowed.",
      "Last-minute cancellations (under 2 hours notice) are not eligible for makeup.",
    ],
  },
  {
    section: "04",
    title: "Payment",
    icon: "◈",
    items: [
      "Monthly tuition is due in advance at the beginning of each month.",
      "Payment is made via bank transfer; proof of payment must be uploaded through the website.",
      "A late payment fee may apply after a grace period of 5 days.",
      "No refund will be issued for missed lessons without prior notice.",
    ],
  },
  {
    section: "05",
    title: "Student Conduct",
    icon: "✦",
    items: [
      "Students are expected to practice regularly between lessons as guided by their teacher.",
      "Respectful conduct toward teachers and studio staff is required at all times.",
      "Students should bring their own books and materials unless otherwise arranged.",
      "GuruNada reserves the right to discontinue lessons if conduct is repeatedly disruptive.",
    ],
  },
  {
    section: "06",
    title: "Communication",
    icon: "◎",
    items: [
      "All official communication is conducted via WhatsApp with the admin number.",
      "Feedback, concerns, or special requests should be communicated promptly.",
      "Changes to class schedules will be announced at least 3 days in advance when possible.",
      "Parents of student minors are encouraged to stay informed of lesson progress.",
    ],
  },
];

export default function OurPolicy() {
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [accepted, setAccepted] = useState(false);

  // Tidak ada redirect otomatis — user boleh membaca policy kapan saja.
  // Gating ke /Questionnaire ditangani oleh Questionnaire.jsx itu sendiri.

  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= docHeight - 120) setScrolledToBottom(true);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAccept = () => {
    sessionStorage.setItem(POLICY_KEY, "true");
    navigate("/Questionnaire");
  };

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
            <span style={{ color: "#F8F6ED", opacity: 0.9 }}>Policy</span>
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
            Please read all policies carefully. You must acknowledge these
            guidelines before proceeding to registration.
          </p>

          {/* step indicator */}
          <div
            style={{
              marginTop: "30px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "13px",
              color: "rgba(248,246,237,0.55)",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "#F8F6ED",
                color: "#272925",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: "700",
                flexShrink: 0,
              }}
            >
              1
            </div>
            <span style={{ color: "#F8F6ED", fontWeight: "600" }}>
              Read Our Policy
            </span>
            <span style={{ margin: "0 4px" }}>→</span>
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                flexShrink: 0,
              }}
            >
              2
            </div>
            <span>Fill Registration</span>
          </div>
        </div>

        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          style={{ display: "block" }}
        ></svg>
      </section>

      {/* ─── POLICY CONTENT ───────────────────────────────────────────────── */}
      <section style={{ padding: "64px 0 32px" }}>
        <div
          className="max-w-4xl mx-auto px-6"
          style={{ display: "flex", flexDirection: "column", gap: "24px" }}
        >
          {/* intro note — charcoal border kiri */}
          <div
            style={{
              borderRadius: "16px",
              padding: "20px 24px",
              background: "#FFFFFF",
              border: "1px solid #E8E0CC",
              borderLeft: "4px solid #272925",
              display: "flex",
              gap: "16px",
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: "20px", marginTop: "2px" }}>📋</span>
            <div>
              <p
                style={{
                  fontWeight: "600",
                  color: "#272925",
                  margin: "0 0 4px",
                }}
              >
                Please read this document in full.
              </p>
              <p style={{ fontSize: "13px", color: "#64748B", margin: 0 }}>
                By clicking "I Have Read & Agree" at the bottom, you confirm
                that you understand and agree to all of GuruNada's studio
                policies listed below.
              </p>
            </div>
          </div>

          {/* policy sections */}
          {POLICIES.map((pol, i) => (
            <div
              key={i}
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid #E8E0CC",
                background: "#FFFFFF",
                boxShadow: "0 2px 12px rgba(39,41,37,0.05)",
              }}
            >
              {/* header — charcoal */}
              <div
                style={{
                  padding: "16px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  background:
                    "linear-gradient(90deg, #272925 0%, #50553C 100%)",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#F8F6ED",
                    opacity: 0.5,
                    letterSpacing: "0.1em",
                  }}
                >
                  {pol.section}
                </span>
                <span style={{ fontSize: "16px", color: "#D1A799" }}>
                  {pol.icon}
                </span>
                <h2
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#F8F6ED",
                    margin: 0,
                  }}
                >
                  {pol.title}
                </h2>
              </div>

              {/* items */}
              <div>
                {pol.items.map((item, j) => (
                  <div
                    key={j}
                    style={{
                      padding: "14px 24px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "14px",
                      borderTop: j > 0 ? "1px solid #F1F5F9" : "none",
                    }}
                  >
                    <span
                      style={{
                        marginTop: "7px",
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "#50553C",
                        flexShrink: 0,
                      }}
                    />
                    <p
                      style={{
                        fontSize: "13px",
                        lineHeight: 1.65,
                        color: "#475569",
                        margin: 0,
                      }}
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>
      </section>

      {/* ─── ACCEPT SECTION ───────────────────────────────────────────────── */}
      <section style={{ padding: "32px 0 80px" }}>
        <div className="max-w-4xl mx-auto px-6">
          <div
            style={{
              borderRadius: "24px",
              padding: "48px 40px",
              textAlign: "center",
              background: "#272925",
              boxShadow: "0 16px 48px rgba(39,41,37,0.18)",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "rgba(248,246,237,0.6)",
                marginBottom: "24px",
                maxWidth: "480px",
                margin: "0 auto 24px",
              }}
            >
              By clicking the button below, you confirm that you have read and
              understood all of GuruNada's studio policies and agree to abide by
              them.
            </p>

            {/* checkbox */}
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                marginBottom: "32px",
                color: "rgba(248,246,237,0.85)",
                fontSize: "14px",
                userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                style={{
                  width: "18px",
                  height: "18px",
                  cursor: "pointer",
                  accentColor: "#F8F6ED",
                }}
              />
              I have read and agree to all studio policies above.
            </label>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}
            >
              {/* TOMBOL CREAM */}
              <button
                onClick={handleAccept}
                disabled={!accepted || !scrolledToBottom}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 40px",
                  borderRadius: "999px",
                  fontWeight: "700",
                  fontSize: "15px",
                  border: "none",
                  cursor:
                    accepted && scrolledToBottom ? "pointer" : "not-allowed",
                  background:
                    accepted && scrolledToBottom
                      ? "#F8F6ED"
                      : "rgba(248,246,237,0.12)",
                  color:
                    accepted && scrolledToBottom
                      ? "#272925"
                      : "rgba(248,246,237,0.25)",
                  boxShadow:
                    accepted && scrolledToBottom
                      ? "0 4px 20px rgba(0,0,0,0.2)"
                      : "none",
                  transition: "all 0.3s ease",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  if (accepted && scrolledToBottom) {
                    e.currentTarget.style.background = "#FFFFFF";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (accepted && scrolledToBottom) {
                    e.currentTarget.style.background = "#F8F6ED";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                I Have Read & Agree
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: "16px", height: "16px" }}
                >
                  <polyline points="9,18 15,12 9,6" />
                </svg>
              </button>

              <button
                onClick={() => navigate(-1)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "rgba(248,246,237,0.35)",
                  padding: "8px 16px",
                }}
              >
                ← Go Back
              </button>
            </div>

            {!scrolledToBottom && (
              <p
                style={{
                  marginTop: "16px",
                  fontSize: "12px",
                  color: "rgba(248,246,237,0.3)",
                }}
              >
                ↓ Scroll to the bottom of the page to enable the button
              </p>
            )}
            {scrolledToBottom && !accepted && (
              <p
                style={{
                  marginTop: "16px",
                  fontSize: "12px",
                  color: "rgba(248,246,237,0.3)",
                }}
              >
                Please check the box above to continue
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
