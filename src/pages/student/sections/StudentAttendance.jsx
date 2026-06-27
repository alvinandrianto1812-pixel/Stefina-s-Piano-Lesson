// src/pages/student/sections/StudentAttendance.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  hadir: {
    label: "Hadir",
    color: "#15803d",
    bg: "rgba(22,163,74,0.08)",
    icon: "✅",
  },
  izin: {
    label: "Izin",
    color: "#1e40af",
    bg: "rgba(59,130,246,0.08)",
    icon: "📋",
  },
  sakit: {
    label: "Sakit",
    color: "#92400e",
    bg: "rgba(234,179,8,0.08)",
    icon: "🤒",
  },
  alpha: {
    label: "Alpha",
    color: "#DC2626",
    bg: "rgba(220,38,38,0.08)",
    icon: "❌",
  },
};

function isLocked(lessonDate) {
  const lesson = new Date(lessonDate + "T00:00:00");
  const lockTime = new Date(lesson);
  lockTime.setDate(lockTime.getDate() + 1);
  lockTime.setHours(23, 59, 59, 999);
  return new Date() > lockTime;
}

function isTodayCheckedIn(records) {
  const today = new Date().toISOString().split("T")[0];
  return records.find((r) => r.lesson_date === today);
}

export default function StudentAttendance({ student }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [teacherId, setTeacherId] = useState(null); // ← BARU: ambil dari student_teachers
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  // ← BARU: fetch teacher_id dari junction table
  useEffect(() => {
    const fetchTeacherId = async () => {
      const { data, error } = await supabase
        .from("student_teachers")
        .select("teacher_id")
        .eq("student_id", student.id)
        .eq("is_active", true)
        .maybeSingle();

      if (error) console.error("fetch teacher_id error:", error);
      setTeacherId(data?.teacher_id ?? null);
    };

    fetchTeacherId();
  }, [student.id]);

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  const fetchAttendance = async () => {
    setLoading(true);
    const [year, month] = selectedMonth.split("-");
    const from = `${year}-${month}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const to = `${year}-${month}-${lastDay}`;

    const { data, error } = await supabase
      .from("student_attendance")
      .select("*")
      .eq("student_id", student.id)
      .gte("lesson_date", from)
      .lte("lesson_date", to)
      .order("lesson_date", { ascending: false });

    if (error) console.error("fetch attendance error:", error);
    setRecords(data || []);
    setLoading(false);
  };

  const handleCheckIn = async () => {
    const today = new Date().toISOString().split("T")[0];
    const existing = isTodayCheckedIn(records);

    if (existing) {
      toast.error("Kamu sudah check-in hari ini!");
      return;
    }

    // ← BARU: guard jika teacher belum ke-fetch
    if (!teacherId) {
      toast.error("Data teacher belum tersedia. Coba lagi.");
      return;
    }

    setCheckingIn(true);
    const { error } = await supabase.from("student_attendance").insert([
      {
        student_id: student.id,
        teacher_id: teacherId, // ← GANTI: pakai state, bukan student.teacher_id
        lesson_date: today,
        status: "hadir",
        checked_in_by: "student",
        is_locked: false,
      },
    ]);

    if (error) {
      toast.error("Gagal check-in: " + error.message);
    } else {
      toast.success("✅ Check-in berhasil! Selamat belajar!");
      fetchAttendance();
    }
    setCheckingIn(false);
  };

  // Hitung statistik bulan ini
  const stats = {
    hadir: records.filter((r) => r.status === "hadir").length,
    izin: records.filter((r) => r.status === "izin").length,
    sakit: records.filter((r) => r.status === "sakit").length,
    alpha: records.filter((r) => r.status === "alpha").length,
  };

  const todayRecord = isTodayCheckedIn(records);
  const today = new Date().toISOString().split("T")[0];

  // Generate month options (6 bulan terakhir)
  const monthOptions = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
    return { val, label };
  });

  return (
    <div className="space-y-6">
      {/* Check-in card */}
      <div
        style={{
          background: todayRecord
            ? "linear-gradient(135deg, #14532d, #15803d)"
            : "linear-gradient(135deg, #272925, #50553C)",
          borderRadius: 20,
          padding: "2rem",
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(39,41,37,0.2)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(-14deg, transparent 0px, transparent 28px, rgba(255,255,255,0.02) 28px, rgba(255,255,255,0.02) 29px)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p
            style={{
              margin: "0 0 0.5rem",
              fontSize: "0.65rem",
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(248,246,237,0.5)",
            }}
          >
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          {todayRecord ? (
            <>
              <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>✅</div>
              <h2
                style={{
                  margin: "0 0 0.5rem",
                  color: "#F8F6ED",
                  fontFamily: '"Rockdale FREE", serif',
                  fontSize: "1.5rem",
                }}
              >
                Sudah Check-in!
              </h2>
              <p
                style={{
                  margin: 0,
                  color: "rgba(248,246,237,0.6)",
                  fontSize: "0.85rem",
                }}
              >
                Check-in oleh:{" "}
                {todayRecord.checked_in_by === "student"
                  ? "Kamu sendiri"
                  : "Teacher"}
              </p>
            </>
          ) : (
            <>
              <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎵</div>
              <h2
                style={{
                  margin: "0 0 0.5rem",
                  color: "#F8F6ED",
                  fontFamily: '"Rockdale FREE", serif',
                  fontSize: "1.5rem",
                }}
              >
                Belum Check-in
              </h2>
              <p
                style={{
                  margin: "0 0 1.5rem",
                  color: "rgba(248,246,237,0.6)",
                  fontSize: "0.85rem",
                }}
              >
                Klik tombol di bawah saat kamu tiba di studio
              </p>
              <button
                onClick={handleCheckIn}
                disabled={checkingIn || !teacherId}
                style={{
                  padding: "0.85rem 2.5rem",
                  borderRadius: "999px",
                  background:
                    checkingIn || !teacherId
                      ? "rgba(248,246,237,0.3)"
                      : "#F8F6ED",
                  color: "#272925",
                  fontWeight: 800,
                  fontSize: "1rem",
                  border: "none",
                  cursor: checkingIn || !teacherId ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}
                onMouseEnter={(e) => {
                  if (!checkingIn && teacherId)
                    e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                }}
              >
                {checkingIn ? "Memproses…" : "✋ Check-in Sekarang"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Statistik bulan ini */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0.75rem",
        }}
      >
        {Object.entries(stats).map(([key, val]) => (
          <div
            key={key}
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: "1rem",
              textAlign: "center",
              border: `1px solid ${STATUS_CONFIG[key].bg}`,
              boxShadow: "0 2px 8px rgba(39,41,37,0.05)",
            }}
          >
            <p style={{ margin: "0 0 0.25rem", fontSize: "1.5rem" }}>
              {STATUS_CONFIG[key].icon}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "1.4rem",
                fontWeight: 800,
                color: STATUS_CONFIG[key].color,
              }}
            >
              {val}
            </p>
            <p
              style={{
                margin: "0.1rem 0 0",
                fontSize: "0.65rem",
                fontWeight: 700,
                color: "#94A3B8",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {STATUS_CONFIG[key].label}
            </p>
          </div>
        ))}
      </div>

      {/* Filter bulan */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.65rem",
            fontWeight: 800,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#94A3B8",
          }}
        >
          Histori Absensi
        </p>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{
            padding: "0.5rem 0.75rem",
            borderRadius: 10,
            border: "2px solid #E2E8F0",
            fontSize: "0.8rem",
            background: "#fff",
            outline: "none",
            cursor: "pointer",
          }}
        >
          {monthOptions.map((m) => (
            <option key={m.val} value={m.val}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* Histori list */}
      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "#94A3B8" }}>
          Memuat absensi…
        </div>
      ) : records.length === 0 ? (
        <div
          style={{
            padding: "3rem",
            textAlign: "center",
            background: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(39,41,37,0.07)",
          }}
        >
          <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📅</p>
          <p style={{ color: "#94A3B8", margin: 0 }}>
            Belum ada data absensi bulan ini.
          </p>
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid rgba(39,41,37,0.07)",
            boxShadow: "0 2px 8px rgba(39,41,37,0.05)",
          }}
        >
          {records.map((rec, i) => {
            const locked = isLocked(rec.lesson_date);
            const cfg = STATUS_CONFIG[rec.status] || STATUS_CONFIG.hadir;
            return (
              <div
                key={rec.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.9rem 1.25rem",
                  borderBottom:
                    i < records.length - 1 ? "1px solid #F1F5F9" : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>{cfg.icon}</span>
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        color: "#272925",
                      }}
                    >
                      {new Date(
                        rec.lesson_date + "T00:00:00",
                      ).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                    <p
                      style={{
                        margin: "0.1rem 0 0",
                        fontSize: "0.72rem",
                        color: "#94A3B8",
                      }}
                    >
                      {rec.checked_in_by === "teacher"
                        ? "Diinput teacher"
                        : "Self check-in"}
                      {locked ? " · 🔒 Terkunci" : " · Bisa diubah teacher"}
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: "999px",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    background: cfg.bg,
                    color: cfg.color,
                  }}
                >
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
