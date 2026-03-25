// src/pages/admin/Admin.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const BUCKET = "media-gallery";

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("payments"); // "payments" | "media"

  // ── Payments state ──
  const [payments, setPayments] = useState([]);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // ── Media state ──
  const [mediaItems, setMediaItems] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: "", type: "photo" });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadThumb, setUploadThumb] = useState(null);
  const fileRef = useRef(null);
  const thumbRef = useRef(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      let role = null;
      if (user.email) {
        const { data } = await supabase
          .from("users")
          .select("role")
          .eq("email", user.email)
          .maybeSingle();
        role = data?.role || null;
      }
      if (!role) {
        const { data } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        role = data?.role || null;
      }
      if (role !== "admin") {
        alert("Anda bukan admin.");
        navigate("/");
        return;
      }

      await fetchAll();
      await fetchMedia();
      setLoading(false);
    })();
  }, [navigate]);

  // ════════════════════════════════════════════════════════
  // PAYMENTS
  // ════════════════════════════════════════════════════════
  const fetchAll = async () => {
    const [{ data: pmt, error: e1 }, { data: qst, error: e2 }] =
      await Promise.all([
        supabase
          .from("payments")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("questionnaire").select("*"),
      ]);
    if (e1) console.error("payments error:", e1);
    if (e2) console.error("questionnaire error:", e2);
    setPayments(pmt || []);
    setQuestionnaires(qst || []);
  };

  const questionnaireById = useMemo(() => {
    const m = new Map();
    questionnaires.forEach((q) => m.set(q.id, q));
    return m;
  }, [questionnaires]);

  const questionnairesByUserSorted = useMemo(() => {
    const g = new Map();
    [...questionnaires]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .forEach((q) => {
        const arr = g.get(q.user_id) || [];
        arr.push(q);
        g.set(q.user_id, arr);
      });
    return g;
  }, [questionnaires]);

  const pickQAsOf = (userId, paidAt) => {
    const arr = questionnairesByUserSorted.get(userId);
    if (!arr) return null;
    const cutoff = new Date(paidAt);
    return arr.find((q) => new Date(q.created_at) <= cutoff) || arr[0] || null;
  };

  const fmtPreferredSchedule = (dayRaw, timeRaw) => {
    const day = (dayRaw ?? "").toString().trim();
    const time = (timeRaw ?? "").toString().trim();
    const mapHari = {
      mon: "Senin",
      monday: "Senin",
      senin: "Senin",
      tue: "Selasa",
      tuesday: "Selasa",
      selasa: "Selasa",
      wed: "Rabu",
      wednesday: "Rabu",
      rabu: "Rabu",
      thu: "Kamis",
      thursday: "Kamis",
      kamis: "Kamis",
      fri: "Jumat",
      friday: "Jumat",
      jumat: "Jumat",
      sat: "Sabtu",
      saturday: "Sabtu",
      sabtu: "Sabtu",
      sun: "Minggu",
      sunday: "Minggu",
      minggu: "Minggu",
    };
    const hari = mapHari[(day || "").toLowerCase()] || day || "";
    const parts = [];
    if (hari) parts.push(hari);
    if (time) parts.push(time);
    return parts.join(", ");
  };

  const verifyPayment = async (paymentId) => {
    if (!confirm("Verifikasi pembayaran ini?")) return;
    const { error } = await supabase
      .from("payments")
      .update({ status: "verified" })
      .eq("id", paymentId);
    if (error) alert("Gagal verifikasi: " + error.message);
    else {
      await fetchAll();
      alert("Pembayaran terverifikasi.");
    }
  };

  const rejectPayment = async (paymentId) => {
    if (!confirm("Tolak pembayaran ini?")) return;
    const { error } = await supabase
      .from("payments")
      .update({ status: "rejected" })
      .eq("id", paymentId);
    if (error) alert("Gagal menolak: " + error.message);
    else {
      await fetchAll();
      alert("Pembayaran ditolak.");
    }
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (filterStatus !== "all" && p.status !== filterStatus) return false;
      if (searchQuery) {
        let q = p.questionnaire_id
          ? questionnaireById.get(p.questionnaire_id)
          : pickQAsOf(p.user_id, p.created_at);
        const parentName = [q?.father_name, q?.mother_name]
          .filter(Boolean)
          .join(" & ")
          .toLowerCase();
        const studentName = (q?.student_full_name || "").toLowerCase();
        const instrument = (q?.instrument || "").toLowerCase();
        const query = searchQuery.toLowerCase();
        if (
          !parentName.includes(query) &&
          !studentName.includes(query) &&
          !instrument.includes(query)
        )
          return false;
      }
      return true;
    });
  }, [payments, filterStatus, searchQuery, questionnaireById]);

  const exportToCSV = () => {
    if (filteredPayments.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }
    const headers = [
      "Tanggal",
      "Orang Tua",
      "Anak",
      "Instrumen",
      "Jadwal",
      "Nominal",
      "Status",
    ];
    const rows = filteredPayments.map((p) => {
      let q = p.questionnaire_id
        ? questionnaireById.get(p.questionnaire_id)
        : pickQAsOf(p.user_id, p.created_at);
      const parentName =
        [q?.father_name, q?.mother_name].filter(Boolean).join(" & ") || "-";
      const studentName = q?.student_full_name || "-";
      const instrument = q?.instrument || "-";
      const schedule = q
        ? fmtPreferredSchedule(q.preferred_day, q.preferred_time)
        : "-";
      const date = new Date(p.created_at).toLocaleString("id-ID");
      return [
        `"${date}"`,
        `"${parentName}"`,
        `"${studentName}"`,
        `"${instrument}"`,
        `"${schedule}"`,
        p.amount || 0,
        p.status,
      ].join(",");
    });
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Data_Pembayaran_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ════════════════════════════════════════════════════════
  // MEDIA
  // ════════════════════════════════════════════════════════
  const fetchMedia = async () => {
    setMediaLoading(true);
    const { data, error } = await supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("media fetch error:", error);
    setMediaItems(data || []);
    setMediaLoading(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return alert("Pilih file terlebih dahulu.");
    if (!uploadForm.title.trim()) return alert("Judul tidak boleh kosong.");

    setUploading(true);
    try {
      const ext = uploadFile.name.split(".").pop();
      const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

      // Upload main file
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, uploadFile, {
          contentType: uploadFile.type,
          upsert: false,
        });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const fileUrl = pub.publicUrl;

      // Upload thumbnail (optional, for video)
      let thumbUrl = null;
      if (uploadThumb) {
        const thumbExt = uploadThumb.name.split(".").pop();
        const thumbPath = `thumbs/${Date.now()}.${thumbExt}`;
        const { error: tErr } = await supabase.storage
          .from(BUCKET)
          .upload(thumbPath, uploadThumb, { contentType: uploadThumb.type });
        if (!tErr) {
          const { data: tPub } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(thumbPath);
          thumbUrl = tPub.publicUrl;
        }
      }

      // Insert into media table
      const { error: insErr } = await supabase.from("media").insert([
        {
          title: uploadForm.title.trim(),
          type: uploadForm.type,
          url: fileUrl,
          thumbnail_url: thumbUrl,
          is_published: true,
        },
      ]);
      if (insErr) throw insErr;

      // Reset form
      setUploadForm({ title: "", type: "photo" });
      setUploadFile(null);
      setUploadThumb(null);
      if (fileRef.current) fileRef.current.value = "";
      if (thumbRef.current) thumbRef.current.value = "";
      await fetchMedia();
      alert("Media berhasil diupload!");
    } catch (err) {
      console.error(err);
      alert("Upload gagal: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const togglePublish = async (item) => {
    const { error } = await supabase
      .from("media")
      .update({ is_published: !item.is_published })
      .eq("id", item.id);
    if (error) alert("Gagal update: " + error.message);
    else await fetchMedia();
  };

  const deleteMedia = async (item) => {
    if (
      !confirm(
        `Hapus media "${item.title || "ini"}"? Tindakan ini tidak bisa dibatalkan.`,
      )
    )
      return;
    try {
      // Extract storage path from public URL
      const urlParts = item.url.split(`/${BUCKET}/`);
      if (urlParts.length > 1) {
        await supabase.storage.from(BUCKET).remove([urlParts[1]]);
      }
      if (item.thumbnail_url) {
        const tParts = item.thumbnail_url.split(`/${BUCKET}/`);
        if (tParts.length > 1)
          await supabase.storage.from(BUCKET).remove([tParts[1]]);
      }
      const { error } = await supabase.from("media").delete().eq("id", item.id);
      if (error) throw error;
      await fetchMedia();
    } catch (err) {
      alert("Gagal hapus: " + err.message);
    }
  };

  // ════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════
  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard Admin</h1>

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-slate-200">
        {[
          { key: "payments", label: "💳 Pembayaran" },
          { key: "media", label: "🖼️ Media Gallery" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 text-sm font-medium transition border-b-2 -mb-px ${
              activeTab === tab.key
                ? "border-[#272925] text-[#272925]"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── PAYMENTS TAB ── */}
      {activeTab === "payments" && (
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <input
                type="text"
                placeholder="Cari nama, instrumen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#272925] w-full md:w-64 text-sm"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#272925] text-sm bg-white"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="px-4 py-2 rounded border bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 text-sm font-medium transition"
              >
                Export CSV
              </button>
              <button
                onClick={fetchAll}
                className="px-4 py-2 rounded border bg-slate-50 hover:bg-slate-100 text-sm font-medium transition"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-3 font-semibold text-slate-700">Tanggal</th>
                  <th className="p-3 font-semibold text-slate-700">
                    Orang Tua
                  </th>
                  <th className="p-3 font-semibold text-slate-700">Anak</th>
                  <th className="p-3 font-semibold text-slate-700">
                    Instrumen
                  </th>
                  <th className="p-3 font-semibold text-slate-700">Jadwal</th>
                  <th className="p-3 font-semibold text-slate-700">Nominal</th>
                  <th className="p-3 font-semibold text-slate-700">Status</th>
                  <th className="p-3 font-semibold text-slate-700">Bukti</th>
                  <th className="p-3 font-semibold text-slate-700 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-500">
                      Tidak ada data pembayaran yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => {
                    let q = p.questionnaire_id
                      ? questionnaireById.get(p.questionnaire_id)
                      : null;
                    if (!q) q = pickQAsOf(p.user_id, p.created_at);
                    const parentName =
                      [q?.father_name, q?.mother_name]
                        .filter(Boolean)
                        .join(" & ") || "-";
                    const preferred = q
                      ? fmtPreferredSchedule(q.preferred_day, q.preferred_time)
                      : "";
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="p-3 align-top whitespace-nowrap">
                          {new Date(p.created_at).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="p-3 align-top">
                          {parentName}
                          {!p.questionnaire_id && (
                            <div className="text-[10px] text-slate-500 mt-1">
                              (not linked)
                            </div>
                          )}
                        </td>
                        <td className="p-3 align-top font-medium text-slate-900">
                          {q?.student_full_name || "-"}
                        </td>
                        <td className="p-3 align-top">
                          {q?.instrument || "-"}
                        </td>
                        <td className="p-3 align-top">{preferred || "-"}</td>
                        <td className="p-3 align-top whitespace-nowrap">
                          Rp {Number(p.amount || 0).toLocaleString("id-ID")}
                        </td>
                        <td className="p-3 align-top">
                          <span
                            className={
                              "inline-block px-2.5 py-1 rounded-full text-xs font-medium " +
                              (p.status === "verified"
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : p.status === "rejected"
                                  ? "bg-red-100 text-red-700 border border-red-200"
                                  : "bg-yellow-100 text-yellow-700 border border-yellow-200")
                            }
                          >
                            {p.status.charAt(0).toUpperCase() +
                              p.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-3 align-top">
                          {p.proof_url ? (
                            <a
                              href={p.proof_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline text-xs"
                            >
                              Lihat Bukti
                            </a>
                          ) : (
                            <span className="text-slate-400 text-xs">-</span>
                          )}
                        </td>
                        <td className="p-3 align-top text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              disabled={p.status === "verified"}
                              onClick={() => verifyPayment(p.id)}
                              className={`px-3 py-1.5 rounded text-xs font-medium transition ${p.status === "verified" ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700 shadow-sm"}`}
                            >
                              Verifikasi
                            </button>
                            <button
                              disabled={p.status !== "pending"}
                              onClick={() => rejectPayment(p.id)}
                              className={`px-3 py-1.5 rounded text-xs font-medium transition ${p.status !== "pending" ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700 shadow-sm"}`}
                            >
                              Tolak
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── MEDIA TAB ── */}
      {activeTab === "media" && (
        <section className="space-y-6">
          {/* Upload Form */}
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Upload Media Baru
            </h2>
            <form onSubmit={handleUpload} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Judul *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Recital 2024"
                  value={uploadForm.title}
                  onChange={(e) =>
                    setUploadForm((s) => ({ ...s, title: e.target.value }))
                  }
                  required
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tipe
                </label>
                <select
                  value={uploadForm.type}
                  onChange={(e) =>
                    setUploadForm((s) => ({ ...s, type: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition bg-white"
                >
                  <option value="photo">📷 Foto</option>
                  <option value="video">🎥 Video</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  File{" "}
                  {uploadForm.type === "photo"
                    ? "Foto (JPG/PNG/WEBP)"
                    : "Video (MP4/MOV/WEBM)"}{" "}
                  *
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept={uploadForm.type === "photo" ? "image/*" : "video/*"}
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  required
                  className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-[#272925] file:text-[#F8F6ED] hover:file:bg-[#50553C] cursor-pointer"
                />
              </div>

              {uploadForm.type === "video" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Thumbnail Video (opsional, JPG/PNG)
                  </label>
                  <input
                    ref={thumbRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setUploadThumb(e.target.files?.[0] || null)
                    }
                    className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                  />
                </div>
              )}

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 rounded-full text-sm font-semibold bg-[#272925] text-[#F8F6ED] hover:bg-[#50553C] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {uploading ? "Mengupload…" : "Upload Media"}
                </button>
              </div>
            </form>
          </div>

          {/* Media Grid */}
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-slate-800">
                Semua Media
                <span className="ml-2 text-sm font-normal text-slate-500">
                  ({mediaItems.length} item)
                </span>
              </h2>
              <button
                onClick={fetchMedia}
                className="px-3 py-1.5 rounded border bg-slate-50 hover:bg-slate-100 text-xs font-medium transition"
              >
                Refresh
              </button>
            </div>

            {mediaLoading ? (
              <div className="p-12 text-center text-slate-500">
                Memuat media…
              </div>
            ) : mediaItems.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <div className="text-4xl mb-3">🖼️</div>
                <p>Belum ada media. Upload yang pertama!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
                {mediaItems.map((item) => (
                  <div
                    key={item.id}
                    className="group relative rounded-xl overflow-hidden border border-slate-200"
                    style={{ aspectRatio: "4/3" }}
                  >
                    {/* Preview */}
                    {item.type === "photo" ? (
                      <img
                        src={item.url}
                        alt={item.title || ""}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full relative flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg, #272925, #50553C)",
                        }}
                      >
                        {item.thumbnail_url ? (
                          <img
                            src={item.thumbnail_url}
                            alt=""
                            className="w-full h-full object-cover opacity-70"
                          />
                        ) : (
                          <span className="text-4xl">🎥</span>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                            <svg
                              viewBox="0 0 24 24"
                              fill="#272925"
                              className="w-4 h-4 ml-0.5"
                            >
                              <polygon points="5,3 19,12 5,21" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                      <div className="flex justify-end">
                        <button
                          onClick={() => deleteMedia(item)}
                          className="w-7 h-7 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 transition"
                          title="Hapus"
                        >
                          ✕
                        </button>
                      </div>
                      <div>
                        <p className="text-white text-xs font-medium truncate">
                          {item.title || "—"}
                        </p>
                        <button
                          onClick={() => togglePublish(item)}
                          className={`mt-1.5 w-full py-1 rounded text-xs font-medium transition ${
                            item.is_published
                              ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-500"
                              : "bg-green-500 text-white hover:bg-green-600"
                          }`}
                        >
                          {item.is_published ? "Sembunyikan" : "Publikasikan"}
                        </button>
                      </div>
                    </div>

                    {/* Published badge */}
                    <div
                      className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        item.is_published
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {item.is_published ? "Publik" : "Draft"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
