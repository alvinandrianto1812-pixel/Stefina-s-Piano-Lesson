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

export default function TeacherNotes({ teacher, students }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const emptyForm = {
    student_id: students[0]?.id ?? "",
    title: "",
    content: "",
    is_private: false,
  };
  const [form, setForm] = useState(emptyForm);

  const fetchNotes = useCallback(async () => {
    if (!teacher?.id) return;
    setLoading(true);
    setError(null);

    let q = supabase
      .from("teacher_notes")
      .select("*, students(full_name)")
      .eq("teacher_id", teacher.id)
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
    setForm({ ...emptyForm, student_id: students[0]?.id ?? "" });
    setEditTarget(null);
    setShowForm(true);
  }

  function openEdit(note) {
    setForm({
      student_id: note.student_id,
      title: note.title ?? "",
      content: note.content,
      is_private: note.is_private,
    });
    setEditTarget(note.id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.content.trim() || !form.student_id) return;
    setSaving(true);
    const payload = {
      teacher_id: teacher.id,
      student_id: form.student_id,
      title: form.title.trim() || null,
      content: form.content.trim(),
      is_private: form.is_private,
    };

    const { error: err } = editTarget
      ? await supabase
          .from("teacher_notes")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", editTarget)
      : await supabase.from("teacher_notes").insert(payload);

    if (err) setError(err.message);
    else {
      setShowForm(false);
      fetchNotes();
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    const { error: err } = await supabase
      .from("teacher_notes")
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
            Teacher Notes
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: P.muted }}>
            Catatan perkembangan per murid
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
            + Catatan Baru
          </button>
        </div>
      </div>

      {error && <ErrorBanner msg={error} onClose={() => setError(null)} />}

      {showForm && (
        <Modal maxWidth={480} onClose={() => setShowForm(false)}>
          <h3 style={{ margin: "0 0 1rem", fontSize: 16, fontWeight: 700 }}>
            {editTarget ? "Edit Catatan" : "Catatan Baru"}
          </h3>

          <label style={labelStyle}>Murid *</label>
          <select
            value={form.student_id}
            onChange={(e) =>
              setForm((f) => ({ ...f, student_id: e.target.value }))
            }
            style={{ ...selectStyle, width: "100%", marginBottom: 12 }}
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name}
              </option>
            ))}
          </select>

          <label style={labelStyle}>Judul (opsional)</label>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="mis. Perkembangan Minggu Ini"
            style={{ ...inputStyle, marginBottom: 12 }}
          />

          <label style={labelStyle}>Isi Catatan *</label>
          <textarea
            value={form.content}
            onChange={(e) =>
              setForm((f) => ({ ...f, content: e.target.value }))
            }
            rows={5}
            placeholder="Tulis catatan di sini..."
            style={{ ...inputStyle, resize: "vertical", marginBottom: 12 }}
          />

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: P.dark,
              marginBottom: 16,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={form.is_private}
              onChange={(e) =>
                setForm((f) => ({ ...f, is_private: e.target.checked }))
              }
            />
            🔒 Private (tidak terlihat oleh murid)
          </label>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setShowForm(false)} style={btnSecondary}>
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.content.trim()}
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
            Hapus catatan ini?
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
        <Empty label="Belum ada catatan." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {notes.map((n) => (
            <div key={n.id} style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 14 }}>
                      {n.students?.full_name ?? "-"}
                    </span>
                    {n.title && (
                      <span
                        style={{
                          fontSize: 13,
                          color: P.olive,
                          fontWeight: 600,
                        }}
                      >
                        — {n.title}
                      </span>
                    )}
                    {n.is_private && (
                      <span style={badge("#FFF3E0", "#E65100")}>
                        🔒 Private
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: P.dark,
                      lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {n.content}
                  </p>
                  <p
                    style={{ margin: "6px 0 0", fontSize: 11, color: P.muted }}
                  >
                    {new Date(n.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    {n.updated_at &&
                      n.updated_at !== n.created_at &&
                      " · diedit"}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
