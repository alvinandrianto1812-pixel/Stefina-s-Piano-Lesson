// src/pages/user/OurTeachers.jsx
import React from "react";
import Footer from "../../components/Footer";

const TEACHERS = [
  {
    name: "Stefina Wibisono",
    title: "Principal Teacher",
    instrument: "Piano",
    credentials: [
      "Master's in Classical Piano Performance",
      "Carnegie Mellon University",
    ],
    quote:
      "It warms my heart to see students learning music as a language to express themselves, deliver ideas, and be empathetic to their surroundings, without words.",
    photo: "/teachers/StefinaWibisono.jpg",
    tags: ["Classical Piano", "Advanced Repertoire", "Performance"],
    notes: ["Limited slots only", "Unavailable for home visit"],
  },
  {
    name: "Vivian Rubin",
    title: "Senior Teacher",
    instrument: "Piano",
    credentials: ["Bachelor's Degree in Music Education"],
    quote:
      "I enjoy watching students play piano. I love to witness their growth to overcome their challenges. For example, when they finally master songs with various difficulty levels.",
    photo: "/teachers/VivianRubin.png",
    tags: ["Piano", "Student Growth", "All Levels"],
    notes: [],
  },
  {
    name: "Genessa Anggasta",
    title: "Senior Teacher",
    instrument: "Piano",
    credentials: [
      "Certified Music Therapist",
      "Bachelor's Degree in Music Therapy",
    ],
    quote:
      "I love playing piano and I'd also love to help students with my skill. My hope is that the students will enjoy practicing piano so I can help them be a better pianist than myself.",
    photo: "/teachers/GenessaAnggasta.jpg",
    tags: ["Piano", "Music Therapy", "Young Learners"],
    notes: [],
  },
  {
    name: "Victoria Kezia",
    title: "Senior Teacher",
    instrument: "Cello & Piano",
    credentials: ["Bachelor's Degree in Music Education"],
    quote:
      "My goal is to help students to make music as a safe space to grow and express themselves, as well as to guide them to find their own identity through every notes they play — not only to gain skill, but to actually feel it by heart.",
    photo: "/teachers/VictoryKezia.jpg",
    tags: ["Cello", "Piano", "Expressive Learning"],
    notes: [],
  },
  {
    name: "Jennifer Susanto",
    title: "Senior Teacher",
    instrument: "Violin, Trumpet & Piano",
    credentials: [
      "Bachelor's Degree in Music Composition",
      "Master's Degree in Science Psychology",
    ],
    quote:
      "I strive to educate my student about music and also to guide them with life values that they can apply through playing music.",
    photo: "/teachers/JenniferSusanto.jpg",
    tags: ["Violin", "Trumpet", "Piano", "Life Values"],
    notes: [],
  },
  {
    name: "Angelique Kristeva",
    title: "Junior Teacher",
    instrument: "Piano",
    credentials: ["Bachelor's Degree in Music Education"],
    quote:
      "Teaching music allows me to pass on the joy that music has given me. Seeing children connect with sound, express themselves, and find happiness through music is deeply fulfilling.",
    photo: "/teachers/Angelique.jpg",
    tags: ["Piano", "Children", "Joy of Music"],
    notes: [],
  },
];

const VALUES = [
  {
    icon: "♩",
    title: "Personalized Learning",
    desc: "Each student receives a curriculum tailored to their goals, pace, and musical taste.",
  },
  {
    icon: "★",
    title: "Performance Mindset",
    desc: "We train students not just to play, but to perform — with presence and confidence.",
  },
  {
    icon: "◈",
    title: "Strong Fundamentals",
    desc: "Solid technique and theory from day one, building a foundation that lasts a lifetime.",
  },
  {
    icon: "↑",
    title: "Progress Tracking",
    desc: "Measurable milestones and lesson notes after every session keep growth visible.",
  },
  {
    icon: "✦",
    title: "Creative Exploration",
    desc: "Beyond the syllabus — we encourage improvisation, composition, and musical curiosity.",
  },
  {
    icon: "◉",
    title: "Supportive Community",
    desc: "An inclusive environment where every student feels seen, heard, and inspired.",
  },
];

function TeacherCard({ t }) {
  return (
    <article
      className="rounded-2xl overflow-hidden border flex flex-col"
      style={{
        background: "#FFFFFF",
        borderColor: "#E8E0CC",
        boxShadow: "0 2px 16px rgba(39,41,37,0.07)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        height: "100%",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 14px 36px rgba(39,41,37,0.13)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 16px rgba(39,41,37,0.07)";
      }}
    >
      {/* ── FOTO: kotak 1:1, object-cover object-top ── */}
      <div
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          overflow: "hidden",
          background: "#E8E4D8",
          flexShrink: 0,
          position: "relative",
        }}
      >
        <img
          src={t.photo}
          alt={t.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
            transition: "transform 0.5s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.04)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const fb =
              e.currentTarget.parentNode.querySelector(".photo-fallback");
            if (fb) fb.style.display = "flex";
          }}
        />
        {/* fallback inisial */}
        <div
          className="photo-fallback"
          style={{
            display: "none",
            position: "absolute",
            inset: 0,
            alignItems: "center",
            justifyContent: "center",
            fontSize: "56px",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #50553C, #272925)",
            color: "#D4AF37",
          }}
        >
          {t.name.charAt(0)}
        </div>

        {/* instrument badge */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            padding: "4px 10px",
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: "600",
            background: "rgba(39,41,37,0.75)",
            color: "#D4AF37",
            backdropFilter: "blur(8px)",
          }}
        >
          {t.instrument}
        </div>
      </div>

      {/* ── INFO ── */}
      <div
        className="flex flex-col gap-3"
        style={{ padding: "20px 22px 22px", flex: 1 }}
      >
        {/* nama & title */}
        <div>
          <h3
            style={{
              fontSize: "17px",
              fontWeight: "700",
              color: "#272925",
              margin: 0,
            }}
          >
            {t.name}
          </h3>
          <p
            style={{
              fontSize: "11px",
              fontWeight: "600",
              color: "#B8912A",
              marginTop: "2px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {t.title}
          </p>
        </div>

        {/* credentials */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {t.credentials.map((c, i) => (
            <p
              key={i}
              style={{ fontSize: "12px", color: "#64748B", margin: 0 }}
            >
              {c}
            </p>
          ))}
        </div>

        {/* divider tipis */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, #D4AF37 0%, transparent 100%)",
            opacity: 0.4,
          }}
        />

        {/* quote */}
        <blockquote
          style={{
            fontSize: "13px",
            lineHeight: "1.65",
            fontStyle: "italic",
            color: "#475569",
            borderLeft: "2px solid #D4AF37",
            paddingLeft: "12px",
            margin: 0,
            flex: 1,
          }}
        >
          "{t.quote}"
        </blockquote>

        {/* tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {t.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: "4px 10px",
                borderRadius: "8px",
                fontSize: "11px",
                fontWeight: "500",
                background: "#F5EDD6",
                color: "#50553C",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* notes */}
        {t.notes.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {t.notes.map((note, i) => (
              <p
                key={i}
                style={{ fontSize: "11px", color: "#94A3B8", margin: 0 }}
              >
                * {note}
              </p>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function OurTeachers() {
  return (
    <div
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
          background:
            "linear-gradient(160deg, #272925 0%, #50553C 55%, #F8F6ED 100%)",
          minHeight: "48vh",
        }}
      >
        {[15, 28, 41, 54, 67].map((top, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${top}%`,
              height: "1px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 20%, rgba(255,255,255,0.07) 80%, transparent 100%)",
              pointerEvents: "none",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            right: "-80px",
            top: "-40px",
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(209,167,153,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="max-w-7xl mx-auto px-6"
          style={{
            paddingTop: "112px",
            paddingBottom: "64px",
            position: "relative",
            zIndex: 10,
          }}
        >
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#D1A799",
              marginBottom: "16px",
            }}
          >
            Our Educators
          </p>
          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 56px)",
              fontWeight: "700",
              lineHeight: 1.15,
              color: "#F8F6ED",
              margin: 0,
            }}
          >
            Meet the <br />
            <span style={{ color: "#D4AF37" }}>Teachers</span>
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
            A curated team of professional musicians — each bringing their own
            expertise, warmth, and dedication to every lesson.
          </p>

          <div
            style={{
              marginTop: "40px",
              display: "flex",
              flexWrap: "wrap",
              gap: "32px",
            }}
          >
            {[
              { num: "6", label: "Expert Teachers" },
              { num: "4+", label: "Instruments" },
              { num: "All Ages", label: "Welcome" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#D4AF37",
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    marginTop: "2px",
                    color: "rgba(248,246,237,0.6)",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <svg
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            display: "block",
          }}
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
        >
          <path
            fill="#F8F6ED"
            d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z"
          />
        </svg>
      </section>

      {/* ─── TEACHER GRID ─────────────────────────────────────────────────── */}
      <section style={{ padding: "72px 0 80px" }}>
        <div className="max-w-7xl mx-auto px-6">
          {/* 
            Grid: 3 kolom di desktop, 2 di tablet, 1 di mobile.
            Semua kartu sama tinggi karena pakai align-items: stretch (default grid).
            Foto pakai aspect-ratio: 1/1 sehingga otomatis kotak & seragam.
          */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "28px",
              alignItems: "stretch",
            }}
          >
            {TEACHERS.map((t, i) => (
              <TeacherCard key={i} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── TEACHING VALUES ──────────────────────────────────────────────── */}
      <section
        style={{
          padding: "72px 0",
          background:
            "linear-gradient(180deg, #F8F6ED 0%, rgba(80,85,60,0.07) 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#B8912A",
                marginBottom: "12px",
              }}
            >
              Our Philosophy
            </p>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 36px)",
                fontWeight: "700",
                color: "#272925",
                margin: 0,
              }}
            >
              What We Stand For
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "20px",
            }}
          >
            {VALUES.map((v, i) => (
              <div
                key={i}
                style={{
                  borderRadius: "16px",
                  padding: "28px",
                  background: "#FFFFFF",
                  border: "1px solid #E8E0CC",
                  transition: "box-shadow 0.25s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 8px 28px rgba(39,41,37,0.1)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div
                  style={{
                    fontSize: "28px",
                    color: "#D4AF37",
                    marginBottom: "14px",
                  }}
                >
                  {v.icon}
                </div>
                <h3
                  style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "#272925",
                    marginBottom: "8px",
                  }}
                >
                  {v.title}
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    lineHeight: 1.65,
                    color: "#64748B",
                    margin: 0,
                  }}
                >
                  {v.desc}
                </p>
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
          <h3
            style={{
              fontSize: "clamp(22px, 3vw, 28px)",
              fontWeight: "700",
              color: "#F8F6ED",
              marginBottom: "12px",
            }}
          >
            Ready to learn from the best?
          </h3>
          <p
            style={{
              marginBottom: "32px",
              color: "rgba(248,246,237,0.6)",
              fontSize: "15px",
            }}
          >
            Book a trial class and we'll match you with the right teacher.
          </p>
          <a
            href="/StudioPolicy"
            style={{
              display: "inline-block",
              padding: "12px 32px",
              borderRadius: "999px",
              fontWeight: "600",
              fontSize: "15px",
              background: "linear-gradient(135deg, #D4AF37, #B8912A)",
              color: "#FFFFFF",
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(212,175,55,0.3)",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Book a Trial Class
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
