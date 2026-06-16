import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";

// ─── Konstanta ────────────────────────────────────────────────
const PALETTE = {
  bg: "#F8F6ED",
  dark: "#272925",
  olive: "#50553C",
  blush: "#D1A799",
  white: "#FFFFFF",
  surface: "#EEEADE",
  border: "#D5D0C0",
  success: "#4CAF50",
  warning: "#FF9800",
  danger: "#F44336",
  muted: "#888880",
};

const STATUS_OPTIONS = ["hadir", "izin", "sakit", "alpha"];

const STATUS_CONFIG = {
  hadir: { label: "Hadir", color: PALETTE.success, bg: "#E8F5E9" },
  izin: { label: "Izin", color: PALETTE.warning, bg: "#FFF3E0" },
  sakit: { label: "Sakit", color: "#2196F3", bg: "#E3F2FD" },
  alpha: { label: "Alpha", color: PALETTE.danger, bg: "#FFEBEE" },
};

// ─── Helper ────────────────────────────────────────────────────
function toLocalDateString(date = new Date()) {
  // Hindari timezone shift — gunakan local date bukan UTC
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isLockWindowPassed(lessonDateStr) {
  // Lock: lesson_date + 1 hari jam 23:59:59 (local time)
  const [y, m, d] = lessonDateStr.split("-").map(Number);
  const lockTime = new Date(y, m - 1, d + 1, 23, 59, 59, 999);
  return new Date() > lockTime;
}

// ─── Component ─────────────────────────────────────────────────
export default function TeacherAttendance() {
  const [teacherId, setTeacherId] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { student_id: row }
  const [selectedDate, setSelectedDate] = useState(toLocalDateString());
  const [saving, setSaving] = useState({}); // { student_id: bool }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch teacher_id dari auth user ───────────────────────────
  useEffect(() => {
    async function fetchTeacher() {
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser();
      if (authErr || !user) {
        setError("Auth gagal.");
        setLoading(false);
        return;
      }

      const { data, error: tErr } = await supabase
        .from("teachers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (tErr || !data) {
        setError("Profil teacher tidak ditemukan.");
        setLoading(false);
        return;
      }
      setTeacherId(data.id);
    }
    fetchTeacher();
  }, []);

  // ── Fetch students milik teacher ──────────────────────────────
  useEffect(() => {
    if (!teacherId) return;
    async function fetchStudents() {
      const { data, error: sErr } = await supabase
        .from("students")
        .select("id, full_name, instrument, level")
        .eq("teacher_id", teacherId)
        .eq("is_active", true)
        .order("full_name");

      if (sErr) {
        setError("Gagal load data murid.");
        return;
      }
      setStudents(data || []);
    }
    fetchStudents();
  }, [teacherId]);

  // ── Fetch attendance untuk tanggal yang dipilih ───────────────
  const fetchAttendance = useCallback(async () => {
    if (!teacherId || !selectedDate) return;
    setLoading(true);
    setError(null);

    const { data, error: aErr } = await supabase
      .from("student_attendance")
      .select("*")
      .eq("teacher_id", teacherId)
      .eq("lesson_date", selectedDate);

    if (aErr) {
      setError("Gagal load data absensi.");
      setLoading(false);
      return;
    }

    // Index by student_id untuk O(1) lookup
    const indexed = {};
    (data || []).forEach((row) => {
      indexed[row.student_id] = row;
    });
    setAttendance(indexed);
    setLoading(false);
  }, [teacherId, selectedDate]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // ── Upsert attendance (INSERT atau UPDATE) ────────────────────
  async function handleStatusChange(studentId, newStatus) {
    if (!teacherId) return;

    // Guard: cek lock window di client (UX only — DB juga guard)
    if (isLockWindowPassed(selectedDate)) return;

    setSaving((prev) => ({ ...prev, [studentId]: true }));

    const payload = {
      student_id: studentId,
      teacher_id: teacherId,
      lesson_date: selectedDate,
      status: newStatus,
      checked_in_by: "teacher",
      is_locked: false,
      locked_at: null,
    };

    // Atomic upsert — conflict pada (student_id, lesson_date)
    const { error: upsertErr } = await supabase
      .from("student_attendance")
      .upsert(payload, {
        onConflict: "student_id,lesson_date",
        // ignoreDuplicates: false — pastikan UPDATE tetap jalan
      });

    if (upsertErr) {
      // RLS rejection akan return error code 42501 atau "violates row-level security"
      const msg = upsertErr.message.includes("row-level security")
        ? "Absensi sudah terkunci atau bukan murid Anda."
        : `Gagal simpan: ${upsertErr.message}`;
      setError(msg);
    } else {
      // Update local state tanpa re-fetch — optimistic UI
      setAttendance((prev) => ({
        ...prev,
        [studentId]: { ...prev[studentId], ...payload },
      }));
    }

    setSaving((prev) => ({ ...prev, [studentId]: false }));
  }

  // ─── Derived state ─────────────────────────────────────────────
  const lockPassed = isLockWindowPassed(selectedDate);
  const isToday = selectedDate === toLocalDateString();
  const tomorrow = (() => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    return toLocalDateString(new Date(y, m - 1, d + 1));
  })();

  // Summary stats
  const summary = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = Object.values(attendance).filter((r) => r.status === s).length;
    return acc;
  }, {});
  const totalFilled = Object.keys(attendance).length;

  // ─── Render ────────────────────────────────────────────────────
  return (
    <div
      style={{
        fontFamily: "'Creato Display', sans-serif",
        color: PALETTE.dark,
      }}
    >
      {/* Header + Date Picker */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
            Input Absensi
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: PALETTE.muted }}>
            Override check-in murid · Lock H+1 jam 23:59
          </p>
        </div>
        <input
          type="date"
          value={selectedDate}
          max={toLocalDateString()} // Tidak bisa input absensi masa depan
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: `1px solid ${PALETTE.border}`,
            background: PALETTE.white,
            fontSize: 14,
            color: PALETTE.dark,
            fontFamily: "inherit",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Lock Warning Banner */}
      {lockPassed && (
        <div
          style={{
            background: "#FFF3E0",
            border: `1px solid ${PALETTE.warning}`,
            borderRadius: 10,
            padding: "10px 16px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
          }}
        >
          <span>🔒</span>
          <span style={{ color: "#E65100", fontWeight: 600 }}>
            Absensi tanggal ini sudah terkunci (melewati {tomorrow} jam 23:59).
            Read-only.
          </span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div
          style={{
            background: "#FFEBEE",
            border: `1px solid ${PALETTE.danger}`,
            borderRadius: 10,
            padding: "10px 16px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            fontSize: 13,
          }}
        >
          <span style={{ color: PALETTE.danger }}>⚠️ {error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: PALETTE.danger,
              fontSize: 16,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Summary Cards */}
      {students.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
            gap: 10,
            marginBottom: 20,
          }}
        >
          {STATUS_OPTIONS.map((s) => (
            <div
              key={s}
              style={{
                background: STATUS_CONFIG[s].bg,
                borderRadius: 10,
                padding: "10px 14px",
                textAlign: "center",
                border: `1px solid ${STATUS_CONFIG[s].color}22`,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: STATUS_CONFIG[s].color,
                }}
              >
                {summary[s]}
              </div>
              <div style={{ fontSize: 12, color: PALETTE.muted, marginTop: 2 }}>
                {STATUS_CONFIG[s].label}
              </div>
            </div>
          ))}
          <div
            style={{
              background: PALETTE.surface,
              borderRadius: 10,
              padding: "10px 14px",
              textAlign: "center",
              border: `1px solid ${PALETTE.border}`,
            }}
          >
            <div
              style={{ fontSize: 22, fontWeight: 700, color: PALETTE.olive }}
            >
              {students.length - totalFilled}
            </div>
            <div style={{ fontSize: 12, color: PALETTE.muted, marginTop: 2 }}>
              Belum
            </div>
          </div>
        </div>
      )}

      {/* Student List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: PALETTE.muted }}>
          Memuat data...
        </div>
      ) : students.length === 0 ? (
        <div
          style={{
            background: PALETTE.surface,
            borderRadius: 12,
            padding: 32,
            textAlign: "center",
            color: PALETTE.muted,
          }}
        >
          Belum ada murid aktif terdaftar.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {students.map((student) => {
            const row = attendance[student.id];
            const currentStatus = row?.status || null;
            const byStudent = row?.checked_in_by === "student";
            const isRowLocked = row?.is_locked || lockPassed;
            const isSaving = saving[student.id];

            return (
              <div
                key={student.id}
                style={{
                  background: PALETTE.white,
                  borderRadius: 12,
                  padding: "14px 16px",
                  border: `1px solid ${PALETTE.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                  opacity: isRowLocked ? 0.75 : 1,
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: PALETTE.blush,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 700,
                    color: PALETTE.white,
                    flexShrink: 0,
                  }}
                >
                  {student.full_name?.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {student.full_name}
                  </div>
                  <div style={{ fontSize: 12, color: PALETTE.muted }}>
                    {student.instrument} · {student.level}
                    {byStudent && (
                      <span
                        style={{
                          marginLeft: 6,
                          fontSize: 11,
                          color: "#2196F3",
                          background: "#E3F2FD",
                          padding: "1px 6px",
                          borderRadius: 4,
                        }}
                      >
                        self check-in
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Buttons */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {STATUS_OPTIONS.map((status) => {
                    const isActive = currentStatus === status;
                    const cfg = STATUS_CONFIG[status];
                    return (
                      <button
                        key={status}
                        disabled={isRowLocked || isSaving}
                        onClick={() =>
                          !isRowLocked && handleStatusChange(student.id, status)
                        }
                        style={{
                          padding: "5px 12px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontFamily: "inherit",
                          fontWeight: isActive ? 700 : 500,
                          cursor: isRowLocked ? "not-allowed" : "pointer",
                          border: `1.5px solid ${isActive ? cfg.color : PALETTE.border}`,
                          background: isActive ? cfg.bg : PALETTE.white,
                          color: isActive ? cfg.color : PALETTE.muted,
                          transition: "all 0.15s ease",
                        }}
                      >
                        {isSaving && isActive ? "..." : cfg.label}
                      </button>
                    );
                  })}
                </div>

                {/* Lock indicator */}
                {isRowLocked && (
                  <span
                    style={{ fontSize: 16, flexShrink: 0 }}
                    title="Terkunci"
                  >
                    🔒
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
