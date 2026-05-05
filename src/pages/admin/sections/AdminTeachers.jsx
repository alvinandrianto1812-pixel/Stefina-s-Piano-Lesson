import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import toast from "react-hot-toast";

const BUCKET = "media-gallery";
const TEACHERS_FOLDER = "teachers";

const EMPTY_TEACHER = {
  name: "",
  title: "",
  instrument: "",
  credentials: "",
  quote: "",
  tags: "",
  notes: "",
  sort_order: 99,
  is_published: true,
};

export default function AdminTeachers() {
  const [teachersData, setTeachersData] = useState([]);
  const [teachersLoading, setTeachersLoading] = useState(false);
  const [teacherModal, setTeacherModal] = useState(false);
  const [teacherEditing, setTeacherEditing] = useState(null);
  const [teacherForm, setTeacherForm] = useState(EMPTY_TEACHER);
  const [teacherPhotoFile, setTeacherPhotoFile] = useState(null);
  const [teacherPhotoPreview, setTeacherPhotoPreview] = useState(null);
  const [teacherUploading, setTeacherUploading] = useState(false);
  const teacherPhotoRef = useRef(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setTeachersLoading(true);
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) console.error("teachers fetch error:", error);
    setTeachersData(data || []);
    setTeachersLoading(false);
  };

  const openAddTeacher = () => {
    const nextOrder =
      teachersData.length > 0
        ? Math.max(...teachersData.map((t) => t.sort_order ?? 0)) + 1
        : 1;
    setTeacherEditing(null);
    setTeacherForm({ ...EMPTY_TEACHER, sort_order: nextOrder });
    setTeacherPhotoFile(null);
    setTeacherPhotoPreview(null);
    setTeacherModal(true);
  };

  const openEditTeacher = (t) => {
    setTeacherEditing(t);
    setTeacherForm({
      name: t.name || "",
      title: t.title || "",
      instrument: t.instrument || "",
      credentials: (t.credentials || []).join("\n"),
      quote: t.quote || "",
      tags: (t.tags || []).join(", "),
      notes: (t.notes || []).join("\n"),
      sort_order: t.sort_order ?? 99,
      is_published: t.is_published !== false,
    });
    setTeacherPhotoFile(null);
    setTeacherPhotoPreview(t.photo_url || null);
    setTeacherModal(true);
  };

  const saveTeacher = async (e) => {
    e.preventDefault();
    setTeacherUploading(true);
    try {
      let photoUrl = teacherEditing?.photo_url || null;

      if (teacherPhotoFile) {
        const ext = teacherPhotoFile.name.split(".").pop();
        const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const storagePath = `${TEACHERS_FOLDER}/${filename}`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(storagePath, teacherPhotoFile, {
            contentType: teacherPhotoFile.type,
            upsert: false,
          });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(storagePath);
        photoUrl = pub.publicUrl;
      }

      const payload = {
        name: teacherForm.name.trim(),
        title: teacherForm.title.trim() || null,
        instrument: teacherForm.instrument.trim() || null,
        credentials: teacherForm.credentials
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        quote: teacherForm.quote.trim() || null,
        photo_url: photoUrl,
        tags: teacherForm.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        notes: teacherForm.notes
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        sort_order: Number(teacherForm.sort_order) || 99,
        is_published: teacherForm.is_published,
      };

      let error;
      if (teacherEditing) {
        ({ error } = await supabase
          .from("teachers")
          .update(payload)
          .eq("id", teacherEditing.id));
      } else {
        ({ error } = await supabase.from("teachers").insert([payload]));
      }
      if (error) throw error;

      setTeacherModal(false);
      setTeacherPhotoFile(null);
      setTeacherPhotoPreview(null);
      if (teacherPhotoRef.current) teacherPhotoRef.current.value = "";
      await fetchTeachers();
      toast.success(
        teacherEditing
          ? "Teacher berhasil diperbarui."
          : "Teacher berhasil ditambahkan.",
      );
    } catch (err) {
      console.error(err);
      toast.error("Gagal simpan: " + err.message);
    } finally {
      setTeacherUploading(false);
    }
  };

  const deleteTeacher = async (t) => {
    if (
      !window.confirm(
        `Hapus teacher "${t.name}"? Tindakan ini tidak bisa dibatalkan.`,
      )
    )
      return;
    try {
      if (t.photo_url) {
        const urlParts = t.photo_url.split(`/${BUCKET}/`);
        if (urlParts.length > 1) {
          await supabase.storage.from(BUCKET).remove([urlParts[1]]);
        }
      }
      const { error } = await supabase.from("teachers").delete().eq("id", t.id);
      if (error) throw error;
      await fetchTeachers();
      toast.success("Teacher berhasil dihapus.");
    } catch (err) {
      toast.error("Gagal hapus: " + err.message);
    }
  };

  const toggleTeacherPublish = async (t) => {
    const actionDesc = t.is_published ? "sembunyikan" : "publikasikan";
    if (
      !window.confirm(
        `Apakah Anda yakin ingin ${actionDesc} teacher "${t.name}"?`,
      )
    )
      return;

    // Optimistic update
    setTeachersData((prev) =>
      prev.map((item) =>
        item.id === t.id ? { ...item, is_published: !t.is_published } : item,
      ),
    );

    const { error } = await supabase
      .from("teachers")
      .update({ is_published: !t.is_published })
      .eq("id", t.id);

    if (error) {
      toast.error("Gagal memperbarui status: " + error.message);
      setTeachersData((prev) =>
        prev.map((item) =>
          item.id === t.id ? { ...item, is_published: t.is_published } : item,
        ),
      );
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          Daftar Teachers
        </h2>
        <div className="flex gap-2">
          <button
            onClick={fetchTeachers}
            className="px-3 py-1.5 rounded border bg-slate-50 hover:bg-slate-100 text-xs font-medium transition"
          >
            Refresh
          </button>
          <button
            onClick={openAddTeacher}
            className="px-4 py-1.5 rounded-full bg-[#272925] text-[#F8F6ED] text-xs font-semibold hover:bg-[#50553C] transition"
          >
            + Tambah Teacher
          </button>
        </div>
      </div>

      {teachersLoading ? (
        <div className="p-12 text-center text-slate-500">Memuat teachers…</div>
      ) : teachersData.length === 0 ? (
        <div className="p-12 text-center text-slate-400">
          <div className="text-4xl mb-3">👩‍🏫</div>
          <p>Belum ada teacher. Tambahkan yang pertama!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachersData.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col"
            >
              {/* Foto */}
              <div className="relative w-full aspect-square bg-slate-100 overflow-hidden">
                {t.photo_url ? (
                  <img
                    src={t.photo_url}
                    alt={t.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-5xl font-bold"
                    style={{
                      background: "linear-gradient(135deg, #50553C, #272925)",
                      color: "#F8F6ED",
                    }}
                  >
                    {t.name.charAt(0)}
                  </div>
                )}
                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/60 text-white text-[10px] font-bold flex items-center justify-center">
                  {t.sort_order}
                </div>
                <div
                  className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    t.is_published
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {t.is_published ? "Publik" : "Draft"}
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    {t.name}
                  </p>
                  <p className="text-[11px] text-[#50553C] font-medium uppercase tracking-wider mt-0.5">
                    {t.title}
                  </p>
                  {t.instrument && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      🎹 {t.instrument}
                    </p>
                  )}
                </div>
                {(t.tags || []).length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {t.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 mt-auto pt-3 border-t border-slate-100">
                  <button
                    onClick={() => toggleTeacherPublish(t)}
                    className={`flex-1 py-1.5 rounded text-xs font-medium transition ${
                      t.is_published
                        ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                        : "bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                  >
                    {t.is_published ? "Sembunyikan" : "Publikasikan"}
                  </button>
                  <button
                    onClick={() => openEditTeacher(t)}
                    className="px-3 py-1.5 rounded text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTeacher(t)}
                    className="px-3 py-1.5 rounded text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add/Edit Teacher */}
      {teacherModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setTeacherModal(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-slate-800">
                {teacherEditing ? "Edit Teacher" : "Tambah Teacher Baru"}
              </h3>
              <button
                onClick={() => setTeacherModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={saveTeacher}
              className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Foto */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Foto Teacher
                </label>
                <div className="flex gap-4 items-start">
                  <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0 flex items-center justify-center">
                    {teacherPhotoPreview ? (
                      <img
                        src={teacherPhotoPreview}
                        alt="preview"
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <span className="text-slate-400 text-2xl">📷</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      ref={teacherPhotoRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setTeacherPhotoFile(file);
                        if (file)
                          setTeacherPhotoPreview(URL.createObjectURL(file));
                      }}
                      className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-[#272925] file:text-[#F8F6ED] hover:file:bg-[#50553C] cursor-pointer"
                    />
                    <p className="text-xs text-slate-400 mt-1.5">
                      JPG, PNG, WebP. Disimpan ke folder{" "}
                      <code className="bg-slate-100 px-1 rounded">
                        teachers/
                      </code>{" "}
                      di Storage.
                    </p>
                    {teacherEditing?.photo_url && !teacherPhotoFile && (
                      <p className="text-xs text-slate-400 mt-1">
                        Biarkan kosong untuk mempertahankan foto lama.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Nama */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nama *
                </label>
                <input
                  required
                  value={teacherForm.name}
                  onChange={(e) =>
                    setTeacherForm((s) => ({ ...s, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition"
                  placeholder="Contoh: Stefina Wibisono"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title / Jabatan
                </label>
                <input
                  value={teacherForm.title}
                  onChange={(e) =>
                    setTeacherForm((s) => ({ ...s, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition"
                  placeholder="Principal Teacher"
                />
              </div>

              {/* Instrument */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Instrumen
                </label>
                <input
                  value={teacherForm.instrument}
                  onChange={(e) =>
                    setTeacherForm((s) => ({
                      ...s,
                      instrument: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition"
                  placeholder="Piano, Violin & Cello"
                />
              </div>

              {/* Credentials */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Credentials{" "}
                  <span className="text-slate-400 font-normal">
                    (1 baris = 1 credential)
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={teacherForm.credentials}
                  onChange={(e) =>
                    setTeacherForm((s) => ({
                      ...s,
                      credentials: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition resize-none"
                  placeholder={
                    "Master's in Classical Piano Performance\nCarnegie Mellon University"
                  }
                />
              </div>

              {/* Quote */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Quote / Filosofi
                </label>
                <textarea
                  rows={3}
                  value={teacherForm.quote}
                  onChange={(e) =>
                    setTeacherForm((s) => ({ ...s, quote: e.target.value }))
                  }
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition resize-none"
                  placeholder="Kata-kata inspiratif dari teacher..."
                />
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tags{" "}
                  <span className="text-slate-400 font-normal">
                    (pisahkan dengan koma)
                  </span>
                </label>
                <input
                  value={teacherForm.tags}
                  onChange={(e) =>
                    setTeacherForm((s) => ({ ...s, tags: e.target.value }))
                  }
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition"
                  placeholder="Piano, Classical, Young Learners"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes{" "}
                  <span className="text-slate-400 font-normal">
                    (1 baris = 1 note)
                  </span>
                </label>
                <textarea
                  rows={2}
                  value={teacherForm.notes}
                  onChange={(e) =>
                    setTeacherForm((s) => ({ ...s, notes: e.target.value }))
                  }
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition resize-none"
                  placeholder={"Limited slots only\nUnavailable for home visit"}
                />
              </div>

              {/* Sort Order + Published */}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Urutan Tampil
                    {!teacherEditing && (
                      <span className="ml-1 text-xs text-green-600 font-normal">
                        (otomatis)
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={teacherForm.sort_order}
                    readOnly={!teacherEditing}
                    onChange={(e) =>
                      setTeacherForm((s) => ({
                        ...s,
                        sort_order: e.target.value,
                      }))
                    }
                    className={`w-full px-3 py-2 border-2 rounded-xl text-sm transition ${
                      teacherEditing
                        ? "border-slate-200 focus:outline-none focus:border-[#272925]"
                        : "border-slate-100 bg-slate-50 text-slate-500 cursor-not-allowed"
                    }`}
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    {teacherEditing
                      ? "Ubah angka untuk mengatur urutan tampil. Angka kecil = tampil lebih awal."
                      : "Otomatis dilanjutkan dari teacher terakhir. Edit setelah disimpan jika perlu."}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={teacherForm.is_published}
                    onChange={(e) =>
                      setTeacherForm((s) => ({
                        ...s,
                        is_published: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  Published (tampil di website)
                </label>
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex justify-end gap-3 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setTeacherModal(false)}
                  className="px-5 py-2 rounded-full border text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={teacherUploading}
                  className="px-6 py-2 rounded-full bg-[#272925] text-[#F8F6ED] text-sm font-semibold hover:bg-[#50553C] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {teacherUploading
                    ? "Menyimpan…"
                    : teacherEditing
                      ? "Simpan Perubahan"
                      : "Tambah Teacher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
