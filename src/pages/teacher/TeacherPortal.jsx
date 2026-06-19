// src/pages/teacher/TeacherPortal.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../contexts/AuthProvider";
import Footer from "../../components/Footer";

import TeacherDashboard from "./sections/TeacherDashboard";
import TeacherAttendance from "./sections/TeacherAttendance";
import TeacherMaterials from "./sections/TeacherMaterials";
import TeacherNotes from "./sections/TeacherNotes";
import TeacherLessonNotes from "./sections/TeacherLessonNotes";

const TABS = [
  { key: "dashboard", label: "Dashboard", icon: "🏠" },
  { key: "attendance", label: "Absensi", icon: "📅" },
  { key: "materials", label: "Materi", icon: "📚" },
  { key: "notes", label: "Teacher Notes", icon: "📝" },
  { key: "lesson-notes", label: "Lesson Notes", icon: "🎵" },
];

export default function TeacherPortal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [teacher, setTeacher] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [navH, setNavH] = useState(64);

  // Sync navbar height (sama persis dengan StudentPortal)
  useEffect(() => {
    const nav = document.querySelector("nav");
    if (!nav) return;
    setNavH(nav.getBoundingClientRect().height);
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setNavH(e.contentRect.height);
    });
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);

  // Fetch teacher profile + students dalam 1 useEffect
  useEffect(() => {
    if (!user) return;

    async function fetchTeacherData() {
      try {
        // 1. Ambil profil teacher berdasarkan auth.uid()
        const { data: teacherData, error: teacherErr } = await supabase
          .from("teachers")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (teacherErr) throw teacherErr;
        if (!teacherData) {
          setLoading(false);
          return;
        }

        setTeacher(teacherData);

        // 2. Ambil semua murid yang assigned ke teacher ini
        const { data: studentData, error: studentErr } = await supabase
          .from("students")
          .select(
            "id, full_name, email, instrument, level, is_active, billing_date, monthly_fee",
          )
          .eq("teacher_id", teacherData.id)
          .eq("is_active", true)
          .order("full_name");

        if (studentErr) throw studentErr;
        setStudents(studentData ?? []);
      } catch (err) {
        console.error("fetchTeacherData error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTeacherData();
  }, [user]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F8F6ED",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🎵</div>
          <p style={{ color: "#50553C", fontWeight: 600 }}>Memuat portal…</p>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F8F6ED",
          gap: "1rem",
        }}
      >
        <p style={{ fontSize: "3rem" }}>🎵</p>
        <h2 style={{ color: "#272925", margin: 0 }}>
          Akun Guru Tidak Ditemukan
        </h2>
        <p style={{ color: "#64748B", textAlign: "center", maxWidth: "380px" }}>
          Profil teacher kamu belum terdaftar di sistem. Hubungi admin Gurunada.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #ECEAE0 0%, #F0EDE4 100%)",
        fontFamily: '"Creato Display", system-ui, sans-serif',
      }}
    >
      <style>{`
        .teacher-tabs::-webkit-scrollbar { display: none; }
        .teacher-tabs { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes teacherFadeUp {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .teacher-fade-up { animation: teacherFadeUp 0.35s ease forwards; }
        .ttab-btn { transition: all 0.2s ease; }
        .ttab-btn:hover:not(.ttab-active) {
          background: rgba(80,85,60,0.07) !important;
          color: #50553C !important;
        }
      `}</style>

      {/* Sub-header */}
      <div
        style={{
          position: "sticky",
          top: navH,
          zIndex: 40,
          background:
            "linear-gradient(105deg, #1a1c18 0%, #2d3126 45%, #414737 100%)",
          padding: "0 1.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "46px",
          boxShadow: "0 4px 24px rgba(39,41,37,0.28)",
          borderBottom: "1px solid rgba(209,167,153,0.1)",
        }}
      >
        {/* accent bar kiri */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: "linear-gradient(180deg, #D1A799, rgba(209,167,153,0))",
            borderRadius: "0 2px 2px 0",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(135deg, #D1A799 0%, #b8897e 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.9rem",
              flexShrink: 0,
            }}
          >
            🎓
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}
          >
            <span
              style={{
                fontSize: "0.55rem",
                fontWeight: 800,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(209,167,153,0.6)",
              }}
            >
              Guru Nada
            </span>
            <span
              style={{ color: "rgba(248,246,237,0.15)", fontSize: "0.85rem" }}
            >
              |
            </span>
            <span
              style={{ fontSize: "0.84rem", fontWeight: 700, color: "#F8F6ED" }}
            >
              Teacher Portal
            </span>
          </div>
        </div>

        <span
          style={{
            fontSize: "0.67rem",
            color: "rgba(248,246,237,0.38)",
            letterSpacing: "0.04em",
          }}
        >
          Halo, {teacher.name} 👋
        </span>
      </div>

      {/* Main content */}
      <div
        style={{
          maxWidth: 1360,
          margin: "0 auto",
          padding: "1.75rem 1.5rem 5rem",
        }}
        className="teacher-fade-up"
      >
        {/* Tab switcher */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            className="teacher-tabs"
            style={{
              display: "flex",
              width: "100%",
              background: "#fff",
              borderRadius: 14,
              padding: "0.28rem",
              gap: "0.15rem",
              boxShadow: "0 2px 10px rgba(39,41,37,0.07)",
              border: "1px solid rgba(39,41,37,0.07)",
              overflowX: "auto",
            }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`ttab-btn${activeTab === tab.key ? " ttab-active" : ""}`}
                style={{
                  padding: "0.48rem 1rem",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  fontFamily: "inherit",
                  background:
                    activeTab === tab.key
                      ? "linear-gradient(135deg, #272925, #50553C)"
                      : "transparent",
                  color: activeTab === tab.key ? "#F8F6ED" : "#94A3B8",
                  boxShadow:
                    activeTab === tab.key
                      ? "0 3px 10px rgba(39,41,37,0.22)"
                      : "none",
                }}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content — semua section dapat teacher + students sebagai prop */}
        {activeTab === "dashboard" && (
          <TeacherDashboard teacher={teacher} students={students} />
        )}
        {activeTab === "attendance" && (
          <TeacherAttendance teacher={teacher} students={students} />
        )}
        {activeTab === "materials" && (
          <TeacherMaterials teacher={teacher} students={students} />
        )}
        {activeTab === "notes" && (
          <TeacherNotes teacher={teacher} students={students} />
        )}
        {activeTab === "lesson-notes" && (
          <TeacherLessonNotes teacher={teacher} students={students} />
        )}
      </div>

      <Footer />
    </div>
  );
}
