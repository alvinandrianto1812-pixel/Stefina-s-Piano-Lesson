// src/pages/admin/Admin.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import AdminFinance from "./AdminFinance";

const BUCKET = "media-gallery";
const TEACHERS_FOLDER = "teachers";

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("payments");
  const [navH, setNavH] = useState(64); // dynamic navbar height

  // Measure actual navbar height so sub-header sticks flush below it
  useEffect(() => {
    const nav = document.querySelector('nav');
    if (!nav) return;
    setNavH(nav.getBoundingClientRect().height);
    const ro = new ResizeObserver(entries => {
      for (const e of entries) setNavH(e.contentRect.height);
    });
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);

  // ── Payments state ──
  const [payments, setPayments] = useState([]);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // ── Events state ──
  const [eventsData, setEventsData] = useState([]);
  const [evLoading, setEvLoading] = useState(false);
  const [evModal, setEvModal] = useState(false);
  const [evEditing, setEvEditing] = useState(null); // null = add, object = edit
  const EMPTY_EV = { title: "", subtitle: "", event_date: "", time_start: "", time_end: "", location: "", location_detail: "", city: "Jakarta, Indonesia", description: "", tags: "", highlight: false, is_published: true };
  const [evForm, setEvForm] = useState(EMPTY_EV);

  // ── Media state ──
  const [mediaItems, setMediaItems] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: "", type: "photo" });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadThumb, setUploadThumb] = useState(null);
  const fileRef = useRef(null);
  const thumbRef = useRef(null);

  // ── Teachers state ──
  const EMPTY_TEACHER = { name: "", title: "", instrument: "", credentials: "", quote: "", tags: "", notes: "", sort_order: 99, is_published: true };
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
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      await fetchAll();
      await fetchMedia();
      await fetchEvents();
      await fetchTeachers();
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
  // EVENTS
  // ════════════════════════════════════════════════════════
  const fetchEvents = async () => {
    setEvLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false });
    if (error) console.error("events fetch error:", error);
    setEventsData(data || []);
    setEvLoading(false);
  };

  const openAddEvent = () => {
    setEvEditing(null);
    setEvForm(EMPTY_EV);
    setEvModal(true);
  };

  const openEditEvent = (ev) => {
    setEvEditing(ev);
    setEvForm({
      title: ev.title || "",
      subtitle: ev.subtitle || "",
      event_date: ev.event_date || "",
      time_start: ev.time_start || "",
      time_end: ev.time_end || "",
      location: ev.location || "",
      location_detail: ev.location_detail || "",
      city: ev.city || "Jakarta, Indonesia",
      description: ev.description || "",
      tags: (ev.tags || []).join(", "),
      highlight: ev.highlight || false,
      is_published: ev.is_published !== false,
    });
    setEvModal(true);
  };

  const saveEvent = async (e) => {
    e.preventDefault();
    const payload = {
      title: evForm.title.trim(),
      subtitle: evForm.subtitle.trim() || null,
      event_date: evForm.event_date || null,
      time_start: evForm.time_start.trim() || null,
      time_end: evForm.time_end.trim() || null,
      location: evForm.location.trim() || null,
      location_detail: evForm.location_detail.trim() || null,
      city: evForm.city.trim() || null,
      description: evForm.description.trim() || null,
      tags: evForm.tags ? evForm.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      highlight: evForm.highlight,
      is_published: evForm.is_published,
    };
    let error;
    if (evEditing) {
      ({ error } = await supabase.from("events").update(payload).eq("id", evEditing.id));
    } else {
      ({ error } = await supabase.from("events").insert([payload]));
    }
    if (error) { alert("Gagal simpan: " + error.message); return; }
    setEvModal(false);
    await fetchEvents();
  };

  const deleteEvent = async (ev) => {
    if (!confirm(`Hapus event "${ev.title}"? Tidak bisa dibatalkan.`)) return;
    const { error } = await supabase.from("events").delete().eq("id", ev.id);
    if (error) alert("Gagal hapus: " + error.message);
    else await fetchEvents();
  };

  const toggleEventPublish = async (ev) => {
    const actionDesc = ev.is_published ? "sembunyikan" : "publikasikan";
    if (!confirm(`Apakah Anda yakin ingin ${actionDesc} event "${ev.title}"?`)) return;

    // Optimistic update
    setEvents(prev => prev.map(item => item.id === ev.id ? { ...item, is_published: !ev.is_published } : item));

    const { error } = await supabase.from("events").update({ is_published: !ev.is_published }).eq("id", ev.id);
    if (error) {
      alert("Gagal memperbarui status: " + error.message);
      // Revert if error
      setEvents(prev => prev.map(item => item.id === ev.id ? { ...item, is_published: ev.is_published } : item));
    }
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
    const actionDesc = item.is_published ? "sembunyikan" : "publikasikan";
    if (!confirm(`Apakah Anda yakin ingin ${actionDesc} media "${item.title}"?`)) return;

    // Optimistic update
    setMediaItems(prev => prev.map(m => m.id === item.id ? { ...m, is_published: !item.is_published } : m));

    const { error } = await supabase
      .from("media")
      .update({ is_published: !item.is_published })
      .eq("id", item.id);

    if (error) {
      alert("Gagal memperbarui status: " + error.message);
      // Revert if error
      setMediaItems(prev => prev.map(m => m.id === item.id ? { ...m, is_published: item.is_published } : m));
    }
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
  // TEACHERS
  // ════════════════════════════════════════════════════════
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
    // Hitung sort_order berikutnya: max yang ada + 1
    const nextOrder = teachersData.length > 0
      ? Math.max(...teachersData.map(t => t.sort_order ?? 0)) + 1
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

      // Upload foto baru jika ada
      if (teacherPhotoFile) {
        const ext = teacherPhotoFile.name.split(".").pop();
        const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const storagePath = `${TEACHERS_FOLDER}/${filename}`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(storagePath, teacherPhotoFile, { contentType: teacherPhotoFile.type, upsert: false });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
        photoUrl = pub.publicUrl;
      }

      const payload = {
        name: teacherForm.name.trim(),
        title: teacherForm.title.trim() || null,
        instrument: teacherForm.instrument.trim() || null,
        credentials: teacherForm.credentials.split("\n").map(s => s.trim()).filter(Boolean),
        quote: teacherForm.quote.trim() || null,
        photo_url: photoUrl,
        tags: teacherForm.tags.split(",").map(s => s.trim()).filter(Boolean),
        notes: teacherForm.notes.split("\n").map(s => s.trim()).filter(Boolean),
        sort_order: Number(teacherForm.sort_order) || 99,
        is_published: teacherForm.is_published,
      };

      let error;
      if (teacherEditing) {
        ({ error } = await supabase.from("teachers").update(payload).eq("id", teacherEditing.id));
      } else {
        ({ error } = await supabase.from("teachers").insert([payload]));
      }
      if (error) throw error;

      setTeacherModal(false);
      setTeacherPhotoFile(null);
      setTeacherPhotoPreview(null);
      if (teacherPhotoRef.current) teacherPhotoRef.current.value = "";
      await fetchTeachers();
    } catch (err) {
      console.error(err);
      alert("Gagal simpan: " + err.message);
    } finally {
      setTeacherUploading(false);
    }
  };

  const deleteTeacher = async (t) => {
    if (!confirm(`Hapus teacher "${t.name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      // Hapus foto dari storage jika ada
      if (t.photo_url) {
        const urlParts = t.photo_url.split(`/${BUCKET}/`);
        if (urlParts.length > 1) {
          await supabase.storage.from(BUCKET).remove([urlParts[1]]);
        }
      }
      const { error } = await supabase.from("teachers").delete().eq("id", t.id);
      if (error) throw error;
      await fetchTeachers();
    } catch (err) {
      alert("Gagal hapus: " + err.message);
    }
  };

  const toggleTeacherPublish = async (t) => {
    const actionDesc = t.is_published ? "sembunyikan" : "publikasikan";
    if (!confirm(`Apakah Anda yakin ingin ${actionDesc} teacher "${t.name}"?`)) return;

    // Optimistic update
    setTeachersData(prev => prev.map(item => item.id === t.id ? { ...item, is_published: !t.is_published } : item));

    const { error } = await supabase.from("teachers").update({ is_published: !t.is_published }).eq("id", t.id);

    if (error) {
      alert("Gagal memperbarui status: " + error.message);
      // Revert if error
      setTeachersData(prev => prev.map(item => item.id === t.id ? { ...item, is_published: t.is_published } : item));
    }
  };

  // ════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', background: 'var(--cream)', fontFamily: '"Creato Display", sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>♩</div>
        <p style={{ color: 'var(--olive)', fontWeight: 600 }}>Loading dashboard…</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #ECEAE0 0%, #F0EDE4 100%)', fontFamily: '"Creato Display", system-ui, sans-serif' }}>
      {/* Global styles */}
      <style>{`
        .admin-tabs::-webkit-scrollbar { display: none; }
        .admin-tabs { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes adminFadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .admin-fade-up { animation: adminFadeUp 0.35s ease both; }
        .admin-row { transition: background 0.15s; }
        .admin-row:hover { background: rgba(80,85,60,0.04); }
        .stat-card { transition: transform 0.22s ease, box-shadow 0.22s ease; cursor: default; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(39,41,37,0.12); }
        .tab-btn { transition: all 0.2s ease; }
        .tab-btn:hover:not(.tab-active) { background: rgba(80,85,60,0.07) !important; color: #50553C !important; }
      `}</style>

      {/* Admin Sub-bar: sticky flush below main navbar */}
      <div style={{
        position: 'sticky',
        top: navH,
        zIndex: 40,
        background: 'linear-gradient(105deg, #1a1c18 0%, #2d3126 45%, #414737 100%)',
        padding: '0 1.75rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '46px',
        boxShadow: '0 4px 24px rgba(39,41,37,0.28)',
        borderBottom: '1px solid rgba(209,167,153,0.1)',
      }}>
        {/* Left accent line */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'linear-gradient(180deg, #D1A799, rgba(209,167,153,0))', borderRadius: '0 2px 2px 0' }} />

        {/* Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #D1A799 0%, #b8897e 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.9rem', flexShrink: 0,
            boxShadow: '0 2px 8px rgba(209,167,153,0.3)',
          }}>♩</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(209,167,153,0.6)' }}>Guru Nada</span>
            <span style={{ color: 'rgba(248,246,237,0.15)', fontSize: '0.85rem' }}>|</span>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#F8F6ED', letterSpacing: '0.01em' }}>Admin Dashboard</span>
          </div>
        </div>

        {/* Date only — no Sign Out (already in main Navbar) */}
        <span style={{ fontSize: '0.67rem', color: 'rgba(248,246,237,0.38)', letterSpacing: '0.04em' }}>
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '1.75rem 1.5rem 5rem' }} className="admin-fade-up">

        {/* Summary stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.9rem', marginBottom: '1.75rem' }}>
          {[
            { label: 'Total Pembayaran', value: payments.length,                                  icon: '💳', accent: '#50553C', bg: 'rgba(80,85,60,0.07)',  border: 'rgba(80,85,60,0.12)' },
            { label: 'Pending Review',   value: payments.filter(p=>p.status==='pending').length,   icon: '⏳', accent: '#92400e', bg: 'rgba(234,179,8,0.07)', border: 'rgba(234,179,8,0.18)' },
            { label: 'Terverifikasi',    value: payments.filter(p=>p.status==='verified').length,  icon: '✅', accent: '#15803d', bg: 'rgba(22,163,74,0.07)', border: 'rgba(22,163,74,0.18)' },
            { label: 'Total Events',     value: eventsData.length,                                 icon: '📅', accent: '#1e40af', bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.15)' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ background: '#fff', borderRadius: 16, padding: '1rem 1.25rem', border: `1px solid ${s.border}`, boxShadow: '0 2px 8px rgba(39,41,37,0.05)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', flexShrink: 0 }}>{s.icon}</div>
              <div>
                <p style={{ margin: 0, fontSize: '0.62rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</p>
                <p style={{ margin: '0.05rem 0 0', fontSize: '1.55rem', fontWeight: 800, color: s.accent, lineHeight: 1 }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Premium pill tab switcher */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="admin-tabs" style={{ display: 'inline-flex', background: '#fff', borderRadius: 14, padding: '0.28rem', gap: '0.15rem', boxShadow: '0 2px 10px rgba(39,41,37,0.07)', border: '1px solid rgba(39,41,37,0.07)', overflowX: 'auto' }}>
            {[
              { key: 'payments', label: 'Pembayaran', icon: '💳' },
              { key: 'events',   label: 'Events',     icon: '📅' },
              { key: 'media',    label: 'Media',      icon: '🖼️' },
              { key: 'teachers', label: 'Teachers',   icon: '👩‍🏫' },
              { key: 'finance',  label: 'Keuangan',   icon: '💰' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`tab-btn${activeTab === tab.key ? ' tab-active' : ''}`}
                style={{
                  padding: '0.48rem 1rem',
                  fontSize: '0.78rem', fontWeight: 700,
                  border: 'none', cursor: 'pointer',
                  whiteSpace: 'nowrap', borderRadius: 10,
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  fontFamily: 'inherit',
                  background: activeTab === tab.key ? 'linear-gradient(135deg, #272925, #50553C)' : 'transparent',
                  color: activeTab === tab.key ? '#F8F6ED' : '#94A3B8',
                  boxShadow: activeTab === tab.key ? '0 3px 10px rgba(39,41,37,0.22)' : 'none',
                }}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
        </div>

      {/* ── PAYMENTS TAB ── */}
      {activeTab === "payments" && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Filter bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', background: '#fff', padding: '1rem 1.25rem', borderRadius: 14, border: '1px solid rgba(39,41,37,0.1)', boxShadow: '0 1px 4px rgba(39,41,37,0.06)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', flex: 1 }}>
              <input
                type="text"
                placeholder="Cari nama, instrumen…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '0.5rem 0.9rem', border: '1.5px solid rgba(39,41,37,0.15)', borderRadius: 10, fontSize: '0.82rem', fontFamily: 'inherit', outline: 'none', width: 220, color: 'var(--charcoal)' }}
                onFocus={e => e.target.style.borderColor = 'var(--olive)'}
                onBlur={e => e.target.style.borderColor = 'rgba(39,41,37,0.15)'}
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ padding: '0.5rem 0.9rem', border: '1.5px solid rgba(39,41,37,0.15)', borderRadius: 10, fontSize: '0.82rem', fontFamily: 'inherit', background: '#fff', color: 'var(--charcoal)', cursor: 'pointer' }}
              >
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={exportToCSV}
                style={{ padding: '0.5rem 1rem', borderRadius: 10, border: '1px solid rgba(22,163,74,0.3)', background: 'rgba(22,163,74,0.07)', color: '#15803d', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(22,163,74,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(22,163,74,0.07)'}
              >
                Export CSV
              </button>
              <button
                onClick={fetchAll}
                style={{ padding: '0.5rem 1rem', borderRadius: 10, border: '1px solid rgba(39,41,37,0.15)', background: 'rgba(39,41,37,0.04)', color: 'var(--charcoal)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(39,41,37,0.09)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(39,41,37,0.04)'}
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto', borderRadius: 14, border: '1px solid rgba(39,41,37,0.1)', background: '#fff', boxShadow: '0 1px 4px rgba(39,41,37,0.06)' }}>
            <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(80,85,60,0.05)', borderBottom: '1px solid rgba(39,41,37,0.1)' }}>
                  {['Tanggal','Orang Tua','Anak','Instrumen','Jadwal','Nominal','Status','Bukti','Aksi'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 0.9rem', fontWeight: 700, color: 'var(--olive)', textAlign: h === 'Aksi' ? 'center' : 'left', fontSize: '0.72rem', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
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
                    const statusColor = p.status === 'verified'
                      ? { bg: 'rgba(22,163,74,0.1)', color: '#15803d', border: 'rgba(22,163,74,0.25)' }
                      : p.status === 'rejected'
                        ? { bg: 'rgba(220,38,38,0.08)', color: '#b91c1c', border: 'rgba(220,38,38,0.2)' }
                        : { bg: 'rgba(234,179,8,0.1)', color: '#92400e', border: 'rgba(234,179,8,0.3)' };
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid rgba(39,41,37,0.07)', transition: 'background 0.12s' }}>
                        <td style={{ padding: '0.7rem 0.9rem', verticalAlign: 'top', whiteSpace: 'nowrap', color: '#64748B', fontSize: '0.78rem' }}>
                          {new Date(p.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                        </td>
                        <td style={{ padding: '0.7rem 0.9rem', verticalAlign: 'top', color: 'var(--charcoal)' }}>
                          {parentName}
                          {!p.questionnaire_id && (
                            <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: 2 }}>(not linked)</div>
                          )}
                        </td>
                        <td style={{ padding: '0.7rem 0.9rem', verticalAlign: 'top', fontWeight: 600, color: 'var(--charcoal)' }}>
                          {q?.student_full_name || '-'}
                        </td>
                        <td style={{ padding: '0.7rem 0.9rem', verticalAlign: 'top', color: 'var(--olive)', fontWeight: 600 }}>
                          {q?.instrument || '-'}
                        </td>
                        <td style={{ padding: '0.7rem 0.9rem', verticalAlign: 'top', color: '#64748B' }}>{preferred || '-'}</td>
                        <td style={{ padding: '0.7rem 0.9rem', verticalAlign: 'top', whiteSpace: 'nowrap', fontWeight: 600, color: 'var(--charcoal)' }}>
                          Rp {Number(p.amount || 0).toLocaleString('id-ID')}
                        </td>
                        <td style={{ padding: '0.7rem 0.9rem', verticalAlign: 'top' }}>
                          <span style={{ display: 'inline-block', padding: '0.2rem 0.65rem', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: statusColor.bg, color: statusColor.color, border: `1px solid ${statusColor.border}` }}>
                            {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                          </span>
                        </td>
                        <td style={{ padding: '0.7rem 0.9rem', verticalAlign: 'top' }}>
                          {p.proof_url ? (
                            <a href={p.proof_url} target="_blank" rel="noreferrer"
                              style={{ color: 'var(--olive)', textDecoration: 'underline', fontSize: '0.78rem', fontWeight: 600 }}>
                              Lihat Bukti
                            </a>
                          ) : (
                            <span style={{ color: '#CBD5E1', fontSize: '0.78rem' }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: '0.7rem 0.9rem', verticalAlign: 'top', textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem' }}>
                            <button
                              disabled={p.status === 'verified'}
                              onClick={() => verifyPayment(p.id)}
                              style={{ padding: '0.3rem 0.7rem', borderRadius: 7, fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: p.status === 'verified' ? 'not-allowed' : 'pointer', background: p.status === 'verified' ? '#F1F5F9' : '#16a34a', color: p.status === 'verified' ? '#94A3B8' : '#fff', transition: 'opacity 0.15s', fontFamily: 'inherit' }}
                            >
                              Verifikasi
                            </button>
                            <button
                              disabled={p.status !== 'pending'}
                              onClick={() => rejectPayment(p.id)}
                              style={{ padding: '0.3rem 0.7rem', borderRadius: 7, fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: p.status !== 'pending' ? 'not-allowed' : 'pointer', background: p.status !== 'pending' ? '#F1F5F9' : '#dc2626', color: p.status !== 'pending' ? '#94A3B8' : '#fff', transition: 'opacity 0.15s', fontFamily: 'inherit' }}
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

      {/* ── EVENTS TAB ── */}
      {activeTab === "events" && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Daftar Events</h2>
            <div className="flex gap-2">
              <button onClick={fetchEvents} className="px-3 py-1.5 rounded border bg-slate-50 hover:bg-slate-100 text-xs font-medium transition">Refresh</button>
              <button onClick={openAddEvent} className="px-4 py-1.5 rounded-full bg-[#272925] text-[#F8F6ED] text-xs font-semibold hover:bg-[#50553C] transition">+ Tambah Event</button>
            </div>
          </div>

          {evLoading ? (
            <div className="p-12 text-center text-slate-500">Memuat events…</div>
          ) : eventsData.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <div className="text-4xl mb-3">📅</div>
              <p>Belum ada event. Tambahkan yang pertama!</p>
            </div>
          ) : (
            <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-3 font-semibold text-slate-700">Tanggal</th>
                    <th className="p-3 font-semibold text-slate-700">Judul</th>
                    <th className="p-3 font-semibold text-slate-700">Lokasi</th>
                    <th className="p-3 font-semibold text-slate-700">Status</th>
                    <th className="p-3 font-semibold text-slate-700 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {eventsData.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-50/50">
                      <td className="p-3 align-top whitespace-nowrap text-slate-600 text-xs">{ev.event_date || "—"}</td>
                      <td className="p-3 align-top">
                        <p className="font-semibold text-slate-800">{ev.title}</p>
                        {ev.subtitle && <p className="text-xs text-slate-400 italic">{ev.subtitle}</p>}
                        {(ev.tags || []).length > 0 && (
                          <div className="flex gap-1 flex-wrap mt-1">
                            {ev.tags.map((t) => (
                              <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500">{t}</span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-3 align-top text-xs text-slate-600">{ev.location || "—"}{ev.city && <span className="text-slate-400"> · {ev.city}</span>}</td>
                      <td className="p-3 align-top">
                        <button onClick={() => toggleEventPublish(ev)} className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${ev.is_published ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                          {ev.is_published ? "Published" : "Draft"}
                        </button>
                        {ev.highlight && <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-yellow-100 text-yellow-700">★ Featured</span>}
                      </td>
                      <td className="p-3 align-top text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => openEditEvent(ev)} className="px-3 py-1.5 rounded text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition">Edit</button>
                          <button onClick={() => deleteEvent(ev)} className="px-3 py-1.5 rounded text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal Add/Edit Event */}
          {evModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => { if (e.target === e.currentTarget) setEvModal(false); }}>
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-slate-800">{evEditing ? "Edit Event" : "Tambah Event Baru"}</h3>
                  <button onClick={() => setEvModal(false)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">✕</button>
                </div>
                <form onSubmit={saveEvent} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Judul *</label>
                    <input required value={evForm.title} onChange={(e) => setEvForm(s => ({ ...s, title: e.target.value }))} className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition" placeholder="Nama event" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
                    <input value={evForm.subtitle} onChange={(e) => setEvForm(s => ({ ...s, subtitle: e.target.value }))} className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition" placeholder="Contoh: An Evening of Young Pianists" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
                    <input type="date" value={evForm.event_date} onChange={(e) => setEvForm(s => ({ ...s, event_date: e.target.value }))} className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition" />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Mulai</label>
                      <input value={evForm.time_start} onChange={(e) => setEvForm(s => ({ ...s, time_start: e.target.value }))} placeholder="7:00 PM" className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Selesai</label>
                      <input value={evForm.time_end} onChange={(e) => setEvForm(s => ({ ...s, time_end: e.target.value }))} placeholder="9:30 PM" className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Lokasi</label>
                    <input value={evForm.location} onChange={(e) => setEvForm(s => ({ ...s, location: e.target.value }))} placeholder="Jakarta Music Hall" className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Detail Lokasi</label>
                    <input value={evForm.location_detail} onChange={(e) => setEvForm(s => ({ ...s, location_detail: e.target.value }))} placeholder="Ballroom A, 3rd Floor" className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kota</label>
                    <input value={evForm.city} onChange={(e) => setEvForm(s => ({ ...s, city: e.target.value }))} className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                    <textarea rows={3} value={evForm.description} onChange={(e) => setEvForm(s => ({ ...s, description: e.target.value }))} className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition resize-none" placeholder="Deskripsi singkat event" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tags <span className="text-slate-400 font-normal">(pisahkan dengan koma)</span></label>
                    <input value={evForm.tags} onChange={(e) => setEvForm(s => ({ ...s, tags: e.target.value }))} placeholder="Recital, All Levels, Free Entry" className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition" />
                  </div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer select-none">
                      <input type="checkbox" checked={evForm.is_published} onChange={(e) => setEvForm(s => ({ ...s, is_published: e.target.checked }))} className="rounded" />
                      Published
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer select-none">
                      <input type="checkbox" checked={evForm.highlight} onChange={(e) => setEvForm(s => ({ ...s, highlight: e.target.checked }))} className="rounded" />
                      ★ Featured
                    </label>
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-3 pt-2 border-t">
                    <button type="button" onClick={() => setEvModal(false)} className="px-5 py-2 rounded-full border text-sm font-medium text-slate-600 hover:bg-slate-50 transition">Batal</button>
                    <button type="submit" className="px-6 py-2 rounded-full bg-[#272925] text-[#F8F6ED] text-sm font-semibold hover:bg-[#50553C] transition">{evEditing ? "Simpan Perubahan" : "Tambah Event"}</button>
                  </div>
                </form>
              </div>
            </div>
          )}
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
                          className={`mt-1.5 w-full py-1 rounded text-xs font-medium transition ${item.is_published
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
                      className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.is_published
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

      {/* ── TEACHERS TAB ── */}
      {activeTab === "teachers" && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Daftar Teachers</h2>
            <div className="flex gap-2">
              <button onClick={fetchTeachers} className="px-3 py-1.5 rounded border bg-slate-50 hover:bg-slate-100 text-xs font-medium transition">Refresh</button>
              <button onClick={openAddTeacher} className="px-4 py-1.5 rounded-full bg-[#272925] text-[#F8F6ED] text-xs font-semibold hover:bg-[#50553C] transition">+ Tambah Teacher</button>
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
                <div key={t.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                  {/* Foto */}
                  <div className="relative w-full aspect-square bg-slate-100 overflow-hidden">
                    {t.photo_url ? (
                      <img src={t.photo_url} alt={t.name} className="w-full h-full object-cover object-top" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-slate-300" style={{ background: "linear-gradient(135deg, #50553C, #272925)", color: "#F8F6ED" }}>
                        {t.name.charAt(0)}
                      </div>
                    )}
                    {/* Sort order badge */}
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/60 text-white text-[10px] font-bold flex items-center justify-center">
                      {t.sort_order}
                    </div>
                    {/* Published badge */}
                    <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${t.is_published ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"
                      }`}>
                      {t.is_published ? "Publik" : "Draft"}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                      <p className="text-[11px] text-[#50553C] font-medium uppercase tracking-wider mt-0.5">{t.title}</p>
                      {t.instrument && <p className="text-xs text-slate-500 mt-0.5">🎹 {t.instrument}</p>}
                    </div>
                    {(t.tags || []).length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {t.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">{tag}</span>
                        ))}
                      </div>
                    )}
                    {/* Aksi */}
                    <div className="flex gap-2 mt-auto pt-3 border-t border-slate-100">
                      <button
                        onClick={() => toggleTeacherPublish(t)}
                        className={`flex-1 py-1.5 rounded text-xs font-medium transition ${t.is_published ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100" : "bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                      >
                        {t.is_published ? "Sembunyikan" : "Publikasikan"}
                      </button>
                      <button onClick={() => openEditTeacher(t)} className="px-3 py-1.5 rounded text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition">Edit</button>
                      <button onClick={() => deleteTeacher(t)} className="px-3 py-1.5 rounded text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition">Hapus</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal Add/Edit Teacher */}
          {teacherModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => { if (e.target === e.currentTarget) setTeacherModal(false); }}>
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-slate-800">{teacherEditing ? "Edit Teacher" : "Tambah Teacher Baru"}</h3>
                  <button onClick={() => setTeacherModal(false)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">✕</button>
                </div>

                <form onSubmit={saveTeacher} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Preview foto */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Foto Teacher</label>
                    <div className="flex gap-4 items-start">
                      <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0 flex items-center justify-center">
                        {teacherPhotoPreview ? (
                          <img src={teacherPhotoPreview} alt="preview" className="w-full h-full object-cover object-top" />
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
                            if (file) setTeacherPhotoPreview(URL.createObjectURL(file));
                          }}
                          className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-[#272925] file:text-[#F8F6ED] hover:file:bg-[#50553C] cursor-pointer"
                        />
                        <p className="text-xs text-slate-400 mt-1.5">JPG, PNG, WebP. Akan disimpan ke folder <code className="bg-slate-100 px-1 rounded">teachers/</code> di Storage.</p>
                        {teacherEditing?.photo_url && !teacherPhotoFile && (
                          <p className="text-xs text-slate-400 mt-1">Biarkan kosong untuk mempertahankan foto lama.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Nama */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama *</label>
                    <input required value={teacherForm.name} onChange={(e) => setTeacherForm(s => ({ ...s, name: e.target.value }))} className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition" placeholder="Contoh: Stefina Wibisono" />
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title / Jabatan</label>
                    <input value={teacherForm.title} onChange={(e) => setTeacherForm(s => ({ ...s, title: e.target.value }))} className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition" placeholder="Principal Teacher" />
                  </div>

                  {/* Instrument */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Instrumen</label>
                    <input value={teacherForm.instrument} onChange={(e) => setTeacherForm(s => ({ ...s, instrument: e.target.value }))} className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition" placeholder="Piano, Violin & Cello" />
                  </div>

                  {/* Credentials */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Credentials <span className="text-slate-400 font-normal">(1 baris = 1 credential)</span></label>
                    <textarea rows={3} value={teacherForm.credentials} onChange={(e) => setTeacherForm(s => ({ ...s, credentials: e.target.value }))} className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition resize-none" placeholder={"Master's in Classical Piano Performance\nCarnegie Mellon University"} />
                  </div>

                  {/* Quote */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Quote / Filosofi</label>
                    <textarea rows={3} value={teacherForm.quote} onChange={(e) => setTeacherForm(s => ({ ...s, quote: e.target.value }))} className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition resize-none" placeholder="Kata-kata inspiratif dari teacher..." />
                  </div>

                  {/* Tags */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tags <span className="text-slate-400 font-normal">(pisahkan dengan koma)</span></label>
                    <input value={teacherForm.tags} onChange={(e) => setTeacherForm(s => ({ ...s, tags: e.target.value }))} className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition" placeholder="Piano, Classical, Young Learners" />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Notes <span className="text-slate-400 font-normal">(1 baris = 1 note)</span></label>
                    <textarea rows={2} value={teacherForm.notes} onChange={(e) => setTeacherForm(s => ({ ...s, notes: e.target.value }))} className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition resize-none" placeholder={"Limited slots only\nUnavailable for home visit"} />
                  </div>

                  {/* Sort Order + Published */}
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Urutan Tampil
                        {!teacherEditing && <span className="ml-1 text-xs text-green-600 font-normal">(otomatis)</span>}
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={teacherForm.sort_order}
                        readOnly={!teacherEditing}
                        onChange={(e) => setTeacherForm(s => ({ ...s, sort_order: e.target.value }))}
                        className={`w-full px-3 py-2 border-2 rounded-xl text-sm transition ${teacherEditing
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
                      <input type="checkbox" checked={teacherForm.is_published} onChange={(e) => setTeacherForm(s => ({ ...s, is_published: e.target.checked }))} className="rounded" />
                      Published (tampil di website)
                    </label>
                  </div>

                  {/* Buttons */}
                  <div className="md:col-span-2 flex justify-end gap-3 pt-2 border-t">
                    <button type="button" onClick={() => setTeacherModal(false)} className="px-5 py-2 rounded-full border text-sm font-medium text-slate-600 hover:bg-slate-50 transition">Batal</button>
                    <button type="submit" disabled={teacherUploading} className="px-6 py-2 rounded-full bg-[#272925] text-[#F8F6ED] text-sm font-semibold hover:bg-[#50553C] transition disabled:opacity-60 disabled:cursor-not-allowed">
                      {teacherUploading ? "Menyimpan…" : teacherEditing ? "Simpan Perubahan" : "Tambah Teacher"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── FINANCE TAB ── */}
      {activeTab === "finance" && <AdminFinance />}

      </div>{/* end max-w inner */}
    </div>
  );
}
