import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../lib/supabaseClient";
import Modal from "../../../components/Modal";

const P = {
  bg: "#F8F6ED",
  dark: "#272925",
  olive: "#50553C",
  blush: "#D1A799",
  white: "#FFFFFF",
  surface: "#EEEADE",
  border: "#D5D0C0",
  muted: "#888880",
  danger: "#F44336",
  success: "#4CAF50",
};

const selectStyle = {
  padding: "7px 12px",
  borderRadius: 8,
  border: `1px solid #D5D0C0`,
  background: "#fff",
  fontSize: 13,
  color: "#272925",
  fontFamily: "inherit",
  cursor: "pointer",
};
const inputStyle = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: 8,
  border: `1px solid #D5D0C0`,
  background: "#fff",
  fontSize: 13,
  color: "#272925",
  fontFamily: "inherit",
  boxSizing: "border-box",
  outline: "none",
};
const btnPrimary = {
  padding: "7px 18px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  background: "linear-gradient(135deg, #272925, #50553C)",
  color: "#F8F6ED",
  fontSize: 13,
  fontWeight: 700,
  fontFamily: "inherit",
};
const btnSecondary = {
  padding: "7px 18px",
  borderRadius: 8,
  border: `1px solid #D5D0C0`,
  background: "#fff",
  color: "#272925",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
};
const btnIcon = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: 16,
  padding: "4px 6px",
  borderRadius: 6,
  lineHeight: 1,
};
const cardStyle = {
  background: "#fff",
  borderRadius: 12,
  padding: "14px 16px",
  border: "1px solid #D5D0C0",
  boxShadow: "0 2px 8px rgba(39,41,37,0.05)",
};
const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "#50553C",
  marginBottom: 4,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};
const badge = (bg, color) => ({
  fontSize: 11,
  fontWeight: 600,
  padding: "2px 8px",
  borderRadius: 20,
  background: bg,
  color,
});

function ErrorBanner({ msg, onClose }) {
  return (
    <div
      style={{
        background: "#FFEBEE",
        border: "1px solid #F44336",
        borderRadius: 10,
        padding: "10px 16px",
        marginBottom: 16,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 13,
      }}
    >
      <span style={{ color: "#F44336" }}>⚠️ {msg}</span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#F44336",
          fontSize: 16,
        }}
      >
        ×
      </button>
    </div>
  );
}
function Loader() {
  return (
    <div style={{ textAlign: "center", padding: 40, color: "#888880" }}>
      Memuat data...
    </div>
  );
}
function Empty({ label }) {
  return (
    <div
      style={{
        background: "#EEEADE",
        borderRadius: 12,
        padding: 32,
        textAlign: "center",
        color: "#888880",
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: 8 }}>📭</div>
      <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
    </div>
  );
}

const MOOD_OPTIONS = [
  { value: "great", label: "😄 Semangat" },
  { value: "good", label: "🙂 Baik" },
  { value: "neutral", label: "😐 Biasa" },
  { value: "tired", label: "😴 Lelah" },
  { value: "struggling", label: "😓 Kesulitan" },
];

function toLocalDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function TeacherLessonNotes({ teacher, students }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const emptyForm = {
    student_id: students[0]?.id ?? "",
    lesson_date: toLocalDateString(),
    duration_minutes: 60,
    instrument: students[0]?.instrument ?? "",
    material_covered: "",
    homework: "",
    notes: "",
    mood: "",
  };
  const [form, setForm] = useState(emptyForm);

  const fetchNotes = useCallback(async () => {
    if (!teacher?.id) return;
    setLoading(true);
    setError(null);

    let q = supabase
      .from("lesson_notes")
      .select("*, students(full_name, instrument)")
      .eq("teacher_id", teacher.id)
      .order("lesson_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (selectedStudent !== "all") q = q.eq("student_id", selectedStudent);

    const { data, error: err } = await q;
    if (err) setError(err.message);
    else setNotes(data ?? []);
    setLoading(false);
  }, [teacher?.id, selectedStudent]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  function openNew() {
    const firstStudent = students[0];
    setForm({
      ...emptyForm,
      student_id: firstStudent?.id ?? "",
      instrument: firstStudent?.instrument ?? "",
    });
    setEditTarget(null);
    setShowForm(true);
  }

  function openEdit(note) {
    setForm({
      student_id: note.student_id,
      lesson_date: note.lesson_date,
      duration_minutes: note.duration_minutes ?? 60,
      instrument: note.instrument ?? "",
      material_covered: note.material_covered ?? "",
      homework: note.homework ?? "",
      notes: note.notes ?? "",
      mood: note.mood ?? "",
    });
    setEditTarget(note.id);
    setShowForm(true);
  }

  function handleStudentChange(studentId) {
    const s = students.find((st) => st.id === studentId);
    setForm((f) => ({
      ...f,
      student_id: studentId,
      instrument: s?.instrument ?? "",
    }));
  }

  async function handleSave() {
    if (!form.student_id || !form.lesson_date) return;
    setSaving(true);
    const payload = {
      teacher_id: teacher.id,
      student_id: form.student_id,
      lesson_date: form.lesson_date,
      duration_minutes: Number(form.duration_minutes) || null,
      instrument: form.instrument.trim() || null,
      material_covered: form.material_covered.trim() || null,
      homework: form.homework.trim() || null,
      notes: form.notes.trim() || null,
      mood: form.mood || null,
    };

    const { error: err } = editTarget
      ? await supabase
          .from("lesson_notes")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", editTarget)
      : await supabase.from("lesson_notes").insert(payload);

    if (err) setError(err.message);
    else {
      setShowForm(false);
      fetchNotes();
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    const { error: err } = await supabase
      .from("lesson_notes")
      .delete()
      .eq("id", id);
    if (err) setError(err.message);
    else {
      setDeleteId(null);
      fetchNotes();
    }
  }

  return (
    <div style={{ fontFamily: "'Creato Display', sans-serif", color: P.dark }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
            Lesson Notes
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: P.muted }}>
            Rekap sesi les per murid per tanggal
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            style={selectStyle}
          >
            <option value="all">Semua Murid</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name}
              </option>
            ))}
          </select>
          <button onClick={openNew} style={btnPrimary}>
            + Lesson Baru
          </button>
        </div>
      </div>

      {error && <ErrorBanner msg={error} onClose={() => setError(null)} />}

      {showForm && (
        <Modal maxWidth={520} onClose={() => setShowForm(false)}>
          <h3 style={{ margin: "0 0 1rem", fontSize: 16, fontWeight: 700 }}>
            {editTarget ? "Edit Lesson Note" : "Lesson Note Baru"}
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div>
              <label style={labelStyle}>Murid *</label>
              <select
                value={form.student_id}
                onChange={(e) => handleStudentChange(e.target.value)}
                style={{ ...selectStyle, width: "100%" }}
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Tanggal Les *</label>
              <input
                type="date"
                value={form.lesson_date}
                max={toLocalDateString()}
                onChange={(e) =>
                  setForm((f) => ({ ...f, lesson_date: e.target.value }))
                }
                style={{
                  ...inputStyle,
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label style={labelStyle}>Durasi (menit)</label>
              <input
                type="number"
                value={form.duration_minutes}
                min={15}
                max={240}
                step={15}
                onChange={(e) =>
                  setForm((f) => ({ ...f, duration_minutes: e.target.value }))
                }
                style={{
                  ...inputStyle,
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label style={labelStyle}>Instrumen</label>
              <input
                value={form.instrument}
                onChange={(e) =>
                  setForm((f) => ({ ...f, instrument: e.target.value }))
                }
                style={{
                  ...inputStyle,
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <label style={labelStyle}>Materi yang Diajarkan</label>
          <textarea
            value={form.material_covered}
            onChange={(e) =>
              setForm((f) => ({ ...f, material_covered: e.target.value }))
            }
            rows={3}
            placeholder="mis. Scale C mayor, chord progression I-IV-V..."
            style={{ ...inputStyle, resize: "vertical", marginBottom: 12 }}
          />

          <label style={labelStyle}>PR / Tugas</label>
          <textarea
            value={form.homework}
            onChange={(e) =>
              setForm((f) => ({ ...f, homework: e.target.value }))
            }
            rows={2}
            placeholder="mis. Latihan scale 10 menit/hari..."
            style={{ ...inputStyle, resize: "vertical", marginBottom: 12 }}
          />

          <label style={labelStyle}>Catatan Tambahan</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            rows={2}
            placeholder="Observasi, progress, hal perlu diperhatikan..."
            style={{ ...inputStyle, resize: "vertical", marginBottom: 12 }}
          />

          <label style={labelStyle}>Mood Murid</label>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            {MOOD_OPTIONS.map((m) => (
              <button
                key={m.value}
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    mood: f.mood === m.value ? "" : m.value,
                  }))
                }
                style={{
                  padding: "5px 12px",
                  borderRadius: 20,
                  fontSize: 12,
                  border: "1.5px solid",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                  borderColor: form.mood === m.value ? P.olive : P.border,
                  background: form.mood === m.value ? P.surface : P.white,
                  color: form.mood === m.value ? P.olive : P.muted,
                  fontWeight: form.mood === m.value ? 700 : 500,
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setShowForm(false)} style={btnSecondary}>
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.student_id || !form.lesson_date}
              style={btnPrimary}
            >
              {saving ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        </Modal>
      )}

      {deleteId && (
        <Modal maxWidth={360} onClose={() => setDeleteId(null)}>
          <p style={{ margin: "0 0 1rem", fontWeight: 600 }}>
            Hapus lesson note ini?
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setDeleteId(null)} style={btnSecondary}>
              Batal
            </button>
            <button
              onClick={() => handleDelete(deleteId)}
              style={{ ...btnPrimary, background: P.danger }}
            >
              Hapus
            </button>
          </div>
        </Modal>
      )}

      {loading ? (
        <Loader />
      ) : notes.length === 0 ? (
        <Empty label="Belum ada lesson note." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {notes.map((n) => {
            const isExpanded = expandedId === n.id;
            const moodLabel = MOOD_OPTIONS.find(
              (m) => m.value === n.mood,
            )?.label;
            return (
              <div key={n.id} style={cardStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <div
                    style={{ flex: 1, cursor: "pointer" }}
                    onClick={() => setExpandedId(isExpanded ? null : n.id)}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: 14 }}>
                        {n.students?.full_name ?? "-"}
                      </span>
                      <span style={badge("#EEF2FF", "#4F46E5")}>
                        {new Date(
                          n.lesson_date + "T00:00:00",
                        ).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {n.instrument && (
                        <span style={badge(P.surface, P.olive)}>
                          {n.instrument}
                        </span>
                      )}
                      {n.duration_minutes && (
                        <span style={{ fontSize: 11, color: P.muted }}>
                          ⏱ {n.duration_minutes} mnt
                        </span>
                      )}
                      {moodLabel && (
                        <span style={{ fontSize: 12 }}>{moodLabel}</span>
                      )}
                    </div>
                    {!isExpanded && n.material_covered && (
                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: 12,
                          color: P.muted,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: 400,
                        }}
                      >
                        {n.material_covered}
                      </p>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      flexShrink: 0,
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : n.id)}
                      style={{ ...btnIcon, fontSize: 12 }}
                    >
                      {isExpanded ? "▲" : "▼"}
                    </button>
                    <button onClick={() => openEdit(n)} style={btnIcon}>
                      ✏️
                    </button>
                    <button
                      onClick={() => setDeleteId(n.id)}
                      style={{ ...btnIcon, color: P.danger }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div
                    style={{
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: `1px solid ${P.border}`,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {n.material_covered && (
                      <DetailRow label="Materi" value={n.material_covered} />
                    )}
                    {n.homework && (
                      <DetailRow label="PR / Tugas" value={n.homework} />
                    )}
                    {n.notes && <DetailRow label="Catatan" value={n.notes} />}
                    <p style={{ margin: 0, fontSize: 11, color: P.muted }}>
                      Dibuat{" "}
                      {new Date(n.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div>
      <p
        style={{
          margin: "0 0 2px",
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "#94A3B8",
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: 13,
          color: "#272925",
          whiteSpace: "pre-wrap",
          lineHeight: 1.6,
        }}
      >
        {value}
      </p>
    </div>
  );
}
