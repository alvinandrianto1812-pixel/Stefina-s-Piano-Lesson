import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../../../lib/supabaseClient";
import Modal from "../../../components/Modal";

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

const MATERIAL_TYPES = [
  { value: "document", label: "📄 PDF / Dokumen", accept: ".pdf,.doc,.docx" },
  { value: "video", label: "🎬 Video", accept: "video/*" },
  { value: "audio", label: "🎵 Audio", accept: "audio/*" },
  { value: "image", label: "🖼️ Gambar", accept: "image/*" },
  { value: "link", label: "🔗 Link Eksternal", accept: null },
];

const TYPE_ICON = {
  document: "📄",
  video: "🎬",
  audio: "🎵",
  image: "🖼️",
  link: "🔗",
};

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
];

const TYPE_ALLOWED_MIME = {
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  video: ["video/mp4", "video/webm", "video/ogg"],
  audio: ["audio/mpeg", "audio/mp4", "audio/wav", "audio/ogg"],
  image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
};

const MAX_SIZE = 50 * 1024 * 1024;

export default function TeacherMaterials({ teacher, students }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStudent, setFilterStudent] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const fileRef = useRef(null);

  // ── EDIT state ──
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const editFileRef = useRef(null);

  const emptyForm = {
    student_id: "",
    title: "",
    description: "",
    material_type: "document",
    is_public: false,
    external_url: "",
    file: null,
  };
  const [form, setForm] = useState(emptyForm);

  const isLinkType = form.material_type === "link";
  const currentTypeConfig = MATERIAL_TYPES.find(
    (t) => t.value === form.material_type,
  );

  const fetchMaterials = useCallback(async () => {
    if (!teacher?.id) return;
    setLoading(true);
    setError(null);

    let q = supabase
      .from("learning_materials")
      .select("*, students(full_name)")
      .eq("teacher_id", teacher.id)
      .order("created_at", { ascending: false });

    if (filterStudent === "public") {
      q = q.eq("is_public", true).is("student_id", null);
    } else if (filterStudent !== "all") {
      q = q.eq("student_id", filterStudent);
    }
    if (filterType !== "all") q = q.eq("material_type", filterType);

    const { data, error: err } = await q;
    if (err) setError(err.message);
    else setMaterials(data ?? []);
    setLoading(false);
  }, [teacher?.id, filterStudent, filterType]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  function openNew() {
    setForm(emptyForm);
    if (fileRef.current) fileRef.current.value = "";
    setShowForm(true);
  }

  function openEdit(material) {
    setEditItem(material);
    setEditForm({
      title: material.title,
      description: material.description || "",
      student_id: material.student_id || "",
      external_url: material.external_url || "",
      file: null,
    });
    if (editFileRef.current) editFileRef.current.value = "";
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    if (isLinkType && !form.external_url.trim()) return;
    if (!isLinkType && !form.file) return;

    setSaving(true);
    setUploadProgress(null);

    let file_url = null;

    if (!isLinkType && form.file) {
      // handleSave — pakai form dan ALLOWED_TYPES biasa
      if (!ALLOWED_TYPES.includes(form.file.type)) {
        setError(
          "Tipe file tidak didukung. Gunakan PDF, gambar, video MP4, atau audio.",
        );
        setSaving(false);
        setUploadProgress(null);
        return;
      }
      if (form.file.size > MAX_SIZE) {
        setError("Ukuran file maksimal 50MB.");
        setSaving(false);
        setUploadProgress(null);
        return;
      }
      const ext = form.file.name.split(".").pop();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const fileName = `${user.id}/${Date.now()}.${ext}`;

      setUploadProgress("Mengupload file…");
      const { error: uploadErr } = await supabase.storage
        .from("learning-materials")
        .upload(fileName, form.file, { upsert: false });

      if (uploadErr) {
        setError(`Upload gagal: ${uploadErr.message}`);
        setSaving(false);
        setUploadProgress(null);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("learning-materials")
        .getPublicUrl(fileName);
      file_url = urlData?.publicUrl ?? null;
    }

    setUploadProgress("Menyimpan data…");

    const payload = {
      teacher_id: teacher.id,
      student_id: form.student_id || null,
      title: form.title.trim(),
      description: form.description.trim() || null,
      material_type: form.material_type,
      is_public: form.student_id === "" ? true : false,
      file_url,
      external_url: isLinkType ? form.external_url.trim() : null,
    };

    const { error: insertErr } = await supabase
      .from("learning_materials")
      .insert(payload);
    if (insertErr) setError(insertErr.message);
    else {
      setShowForm(false);
      fetchMaterials();
    }

    setSaving(false);
    setUploadProgress(null);
  }

  async function handleEditSave() {
    if (!editForm.title.trim()) return;
    if (editItem.material_type === "link" && !editForm.external_url.trim())
      return;

    setSaving(true);
    setUploadProgress(null);

    let file_url = editItem.file_url; // default pakai file lama

    if (editForm.file) {
      const allowedForType = TYPE_ALLOWED_MIME[editItem.material_type] ?? [];
      if (!allowedForType.includes(editForm.file.type)) {
        setError(
          `File tidak sesuai tipe materi. Materi ini hanya menerima tipe ${editItem.material_type}.`,
        );
        setSaving(false);
        return;
      }
      if (editForm.file.size > MAX_SIZE) {
        setError("Ukuran file maksimal 50MB.");
        setSaving(false);
        return;
      }

      // Hapus file lama dari storage
      if (editItem.file_url) {
        const oldPath = editItem.file_url.split("/learning-materials/")[1];
        if (oldPath)
          await supabase.storage.from("learning-materials").remove([oldPath]);
      }

      const ext = editForm.file.name.split(".").pop();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const fileName = `${user.id}/${Date.now()}.${ext}`;

      setUploadProgress("Mengupload file baru…");
      const { error: uploadErr } = await supabase.storage
        .from("learning-materials")
        .upload(fileName, editForm.file, { upsert: false });

      if (uploadErr) {
        setError(`Upload gagal: ${uploadErr.message}`);
        setSaving(false);
        setUploadProgress(null);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("learning-materials")
        .getPublicUrl(fileName);
      file_url = urlData?.publicUrl ?? null;
    }

    setUploadProgress("Menyimpan perubahan…");

    const payload = {
      title: editForm.title.trim(),
      description: editForm.description.trim() || null,
      student_id: editForm.student_id || null,
      is_public: editForm.student_id === "" ? true : false,
      external_url:
        editItem.material_type === "link" ? editForm.external_url.trim() : null,
      file_url,
    };

    const { error: updateErr } = await supabase
      .from("learning_materials")
      .update(payload)
      .eq("id", editItem.id);

    if (updateErr) setError(updateErr.message);
    else {
      setEditItem(null);
      setEditForm(null);
      fetchMaterials();
    }

    setSaving(false);
    setUploadProgress(null);
  }

  async function handleDelete(id, fileUrl) {
    if (fileUrl) {
      const path = fileUrl.split("/learning-materials/")[1];
      if (path)
        await supabase.storage.from("learning-materials").remove([path]);
    }
    const { error: err } = await supabase
      .from("learning_materials")
      .delete()
      .eq("id", id);
    if (err) setError(err.message);
    else {
      setDeleteId(null);
      fetchMaterials();
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
            Materi Belajar
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: P.muted }}>
            Upload file atau link untuk murid
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <select
            value={filterStudent}
            onChange={(e) => setFilterStudent(e.target.value)}
            style={selectStyle}
          >
            <option value="all">Semua Murid</option>
            <option value="public">Publik (semua)</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name}
              </option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={selectStyle}
          >
            <option value="all">Semua Tipe</option>
            {MATERIAL_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <button onClick={openNew} style={btnPrimary}>
            + Upload Materi
          </button>
        </div>
      </div>

      {error && <ErrorBanner msg={error} onClose={() => setError(null)} />}

      {/* FORM MODAL — upload baru */}
      {showForm && (
        <Modal maxWidth={500} onClose={() => setShowForm(false)}>
          <h3 style={{ margin: "0 0 1rem", fontSize: 16, fontWeight: 700 }}>
            Upload Materi Baru
          </h3>

          <label style={labelStyle}>Judul Materi *</label>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="mis. Scale C Mayor - Sheet Music"
            style={{ ...inputStyle, marginBottom: 12 }}
          />

          <label style={labelStyle}>Tipe Materi *</label>
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            {MATERIAL_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    material_type: t.value,
                    file: null,
                    external_url: "",
                  }))
                }
                style={{
                  padding: "5px 10px",
                  borderRadius: 8,
                  fontSize: 12,
                  border: "1.5px solid",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  borderColor:
                    form.material_type === t.value ? P.olive : P.border,
                  background:
                    form.material_type === t.value ? P.surface : P.white,
                  color: form.material_type === t.value ? P.olive : P.muted,
                  fontWeight: form.material_type === t.value ? 700 : 500,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {isLinkType ? (
            <>
              <label style={labelStyle}>URL Eksternal *</label>
              <input
                value={form.external_url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, external_url: e.target.value }))
                }
                placeholder="https://youtube.com/..."
                style={{ ...inputStyle, marginBottom: 12 }}
              />
            </>
          ) : (
            <>
              <label style={labelStyle}>Upload File *</label>
              <input
                ref={fileRef}
                type="file"
                accept={currentTypeConfig?.accept ?? "*"}
                onChange={(e) =>
                  setForm((f) => ({ ...f, file: e.target.files[0] ?? null }))
                }
                style={{ ...inputStyle, padding: "8px", marginBottom: 12 }}
              />
              {form.file && (
                <p
                  style={{
                    margin: "-8px 0 12px",
                    fontSize: 12,
                    color: P.muted,
                  }}
                >
                  📎 {form.file.name}
                </p>
              )}
            </>
          )}

          <label style={labelStyle}>Deskripsi (opsional)</label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            rows={2}
            placeholder="Keterangan singkat materi ini..."
            style={{ ...inputStyle, resize: "vertical", marginBottom: 12 }}
          />

          <label style={labelStyle}>Untuk Murid</label>
          <select
            value={form.student_id}
            onChange={(e) =>
              setForm((f) => ({ ...f, student_id: e.target.value }))
            }
            style={{ ...selectStyle, width: "100%", marginBottom: 16 }}
          >
            <option value="">Semua murid saya (publik)</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name}
              </option>
            ))}
          </select>

          {uploadProgress && (
            <p
              style={{
                margin: "0 0 12px",
                fontSize: 13,
                color: P.olive,
                fontWeight: 600,
              }}
            >
              ⏳ {uploadProgress}
            </p>
          )}

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              onClick={() => setShowForm(false)}
              disabled={saving}
              style={btnSecondary}
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={
                saving ||
                !form.title.trim() ||
                (isLinkType ? !form.external_url.trim() : !form.file)
              }
              style={btnPrimary}
            >
              {saving ? "Memproses…" : "Upload & Simpan"}
            </button>
          </div>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {editItem && editForm && (
        <Modal
          maxWidth={500}
          onClose={() => {
            setEditItem(null);
            setEditForm(null);
          }}
        >
          <h3 style={{ margin: "0 0 1rem", fontSize: 16, fontWeight: 700 }}>
            Edit Materi
          </h3>

          <label style={labelStyle}>Judul Materi *</label>
          <input
            value={editForm.title}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, title: e.target.value }))
            }
            style={{ ...inputStyle, marginBottom: 12 }}
          />

          <label style={labelStyle}>Deskripsi (opsional)</label>
          <textarea
            value={editForm.description}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, description: e.target.value }))
            }
            rows={2}
            style={{ ...inputStyle, resize: "vertical", marginBottom: 12 }}
          />

          <label style={labelStyle}>Untuk Murid</label>
          <select
            value={editForm.student_id}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, student_id: e.target.value }))
            }
            style={{ ...selectStyle, width: "100%", marginBottom: 12 }}
          >
            <option value="">Semua murid saya (publik)</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name}
              </option>
            ))}
          </select>

          {editItem.material_type === "link" ? (
            <>
              <label style={labelStyle}>URL Eksternal *</label>
              <input
                value={editForm.external_url}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, external_url: e.target.value }))
                }
                placeholder="https://..."
                style={{ ...inputStyle, marginBottom: 12 }}
              />
            </>
          ) : (
            <>
              <label style={labelStyle}>Ganti File (opsional)</label>
              <input
                ref={editFileRef}
                type="file"
                accept={
                  MATERIAL_TYPES.find((t) => t.value === editItem.material_type)
                    ?.accept ?? "*"
                }
                onChange={(e) =>
                  setEditForm((f) => ({
                    ...f,
                    file: e.target.files[0] ?? null,
                  }))
                }
                style={{ ...inputStyle, padding: "8px", marginBottom: 4 }}
              />
              <p style={{ margin: "0 0 12px", fontSize: 11, color: P.muted }}>
                {editForm.file
                  ? `📎 File baru: ${editForm.file.name}`
                  : "Kosongkan jika tidak ingin mengganti file"}
              </p>
            </>
          )}

          {uploadProgress && (
            <p
              style={{
                margin: "0 0 12px",
                fontSize: 13,
                color: P.olive,
                fontWeight: 600,
              }}
            >
              ⏳ {uploadProgress}
            </p>
          )}

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              onClick={() => {
                setEditItem(null);
                setEditForm(null);
              }}
              disabled={saving}
              style={btnSecondary}
            >
              Batal
            </button>
            <button
              onClick={handleEditSave}
              disabled={saving || !editForm.title.trim()}
              style={btnPrimary}
            >
              {saving ? "Memproses…" : "Simpan Perubahan"}
            </button>
          </div>
        </Modal>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <Modal maxWidth={360} onClose={() => setDeleteId(null)}>
          <p style={{ margin: "0 0 1rem", fontWeight: 600 }}>
            Hapus materi ini? File di storage juga ikut terhapus.
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setDeleteId(null)} style={btnSecondary}>
              Batal
            </button>
            <button
              onClick={() => handleDelete(deleteId.id, deleteId.fileUrl)}
              style={{ ...btnPrimary, background: P.danger }}
            >
              Hapus
            </button>
          </div>
        </Modal>
      )}

      {loading ? (
        <Loader />
      ) : materials.length === 0 ? (
        <Empty label="Belum ada materi." />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 14,
          }}
        >
          {materials.map((m) => (
            <div
              key={m.id}
              style={{
                ...cardStyle,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 22 }}>
                    {TYPE_ICON[m.material_type] ?? "📎"}
                  </span>
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        fontSize: 14,
                        color: P.dark,
                      }}
                    >
                      {m.title}
                    </p>
                    <p style={{ margin: 0, fontSize: 11, color: P.muted }}>
                      {m.students?.full_name ?? "Semua murid"}
                      {m.is_public && " · 🌐 Publik"}
                    </p>
                  </div>
                </div>
                {/* Tombol edit & delete */}
                <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                  <button
                    onClick={() => openEdit(m)}
                    style={{ ...btnIcon, color: P.olive }}
                    title="Edit materi"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() =>
                      setDeleteId({ id: m.id, fileUrl: m.file_url })
                    }
                    style={{ ...btnIcon, color: P.danger }}
                    title="Hapus materi"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {m.description && (
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: P.muted,
                    lineHeight: 1.5,
                  }}
                >
                  {m.description}
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                  marginTop: "auto",
                }}
              >
                {(m.file_url || m.external_url) && (
                  <a
                    href={m.file_url ?? m.external_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      ...btnPrimary,
                      textDecoration: "none",
                      fontSize: 12,
                      padding: "5px 14px",
                    }}
                  >
                    {m.material_type === "link" ? "Buka Link" : "Buka File"}
                  </a>
                )}
                <span
                  style={{ ...badge(P.surface, P.olive), alignSelf: "center" }}
                >
                  {new Date(m.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
