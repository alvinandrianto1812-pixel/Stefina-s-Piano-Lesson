// src/pages/admin/AdminFinance.jsx
// Tab keuangan: presensi_guru + pengeluaran (via finance_records).
// Controller insert hanya return { message: "success" } — tanpa data kalkulasi.
import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

// ─────────────────────────────────────────────────────────────
// Controllers — return HANYA { message: "success" }
// ─────────────────────────────────────────────────────────────

async function insertPresensi(payload) {
  const { error } = await supabase.from("presensi_guru").insert([payload]);
  if (error) throw error;
  return { message: "success" };
}

async function deletePresensi(id) {
  const { error } = await supabase.from("presensi_guru").delete().eq("id", id);
  if (error) throw error;
  return { message: "success" };
}

// finance_records: type IN ('income','outcome','salary')
async function insertFinanceRecord(payload) {
  const { error } = await supabase.from("finance_records").insert([payload]);
  if (error) throw error;
  return { message: "success" };
}

async function deleteFinanceRecord(id) {
  const { error } = await supabase.from("finance_records").delete().eq("id", id);
  if (error) throw error;
  return { message: "success" };
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const fmtRupiah = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");
const fmtTgl = (d) =>
  d ? new Date(d).toLocaleDateString("id-ID", { dateStyle: "medium" }) : "—";

// Kategori pengeluaran → tipe finance_records
const PENGELUARAN_TYPES = [
  { value: "outcome", label: "💸 Pengeluaran Umum" },
  { value: "salary", label: "💰 Gaji Guru" },
];

const EMPTY_PRESENSI = { teacher_id: "", tanggal: "", hadir: true, keterangan: "" };
const EMPTY_PENGELUARAN = { tanggal: "", type: "outcome", description: "", amount: "" };

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────
export default function AdminFinance() {
  const [teachers, setTeachers] = useState([]);
  const [filterBulan, setFilterBulan] = useState(
    () => new Date().toISOString().slice(0, 7)  // "YYYY-MM"
  );

  // Presensi
  const [presensiList, setPresensiList] = useState([]);
  const [presensiLoading, setPresensiLoading] = useState(false);
  const [presensiForm, setPresensiForm] = useState(EMPTY_PRESENSI);
  const [presensiBusy, setPresensiBusy] = useState(false);
  const [presensiMsg, setPresensiMsg] = useState(null); // {ok, text}

  // Pengeluaran (finance_records type outcome/salary)
  const [pengeluaranList, setPengeluaranList] = useState([]);
  const [pengeluaranLoading, setPengeluaranLoading] = useState(false);
  const [pengeluaranForm, setPengeluaranForm] = useState(EMPTY_PENGELUARAN);
  const [pengeluaranBusy, setPengeluaranBusy] = useState(false);
  const [pengeluaranMsg, setPengeluaranMsg] = useState(null);

  const timers = useRef({});

  // ── fetch on mount & bulan change ─────────────────────────
  useEffect(() => {
    fetchTeachers();
    fetchPresensi();
    fetchPengeluaran();
  }, [filterBulan]); // eslint-disable-line react-hooks/exhaustive-deps

  const [year, month] = filterBulan.split("-");
  const dateFrom = `${year}-${month}-01`;
  const dateTo = new Date(+year, +month, 0).toISOString().slice(0, 10); // last day

  async function fetchTeachers() {
    const { data } = await supabase
      .from("teachers")
      .select("id, name")
      .order("sort_order");
    setTeachers(data || []);
  }

  async function fetchPresensi() {
    setPresensiLoading(true);
    const { data, error } = await supabase
      .from("presensi_guru")
      .select("*, teachers(name)")
      .gte("tanggal", dateFrom)
      .lte("tanggal", dateTo)
      .order("tanggal", { ascending: false });
    if (error) console.error("fetch presensi:", error);
    setPresensiList(data || []);
    setPresensiLoading(false);
  }

  async function fetchPengeluaran() {
    setPengeluaranLoading(true);
    const { data, error } = await supabase
      .from("finance_records")
      .select("id, type, description, amount, record_date, created_at")
      .in("type", ["outcome", "salary"])
      .gte("record_date", dateFrom)
      .lte("record_date", dateTo)
      .order("record_date", { ascending: false });
    if (error) console.error("fetch pengeluaran:", error);
    setPengeluaranList(data || []);
    setPengeluaranLoading(false);
  }

  function flash(key, ok, text) {
    const setter = key === "presensi" ? setPresensiMsg : setPengeluaranMsg;
    setter({ ok, text });
    clearTimeout(timers.current[key]);
    timers.current[key] = setTimeout(() => setter(null), 4000);
  }

  // ── Submit presensi ────────────────────────────────────────
  async function handlePresensiSubmit(e) {
    e.preventDefault();
    if (!presensiForm.teacher_id) return flash("presensi", false, "Pilih guru terlebih dahulu.");
    setPresensiBusy(true);
    try {
      const res = await insertPresensi({
        teacher_id: presensiForm.teacher_id,
        tanggal: presensiForm.tanggal,
        hadir: presensiForm.hadir,
        keterangan: presensiForm.keterangan.trim() || null,
      });
      flash("presensi", true, res.message === "success" ? "Presensi disimpan." : res.message);
      setPresensiForm(EMPTY_PRESENSI);
      await fetchPresensi();
    } catch (err) {
      flash("presensi", false, err.message || "Gagal menyimpan.");
    } finally {
      setPresensiBusy(false);
    }
  }

  async function handleDeletePresensi(id) {
    if (!confirm("Hapus data presensi ini?")) return;
    try {
      await deletePresensi(id);
      await fetchPresensi();
    } catch (err) {
      flash("presensi", false, err.message);
    }
  }

  // ── Submit pengeluaran ─────────────────────────────────────
  async function handlePengeluaranSubmit(e) {
    e.preventDefault();
    const amount = parseFloat(pengeluaranForm.amount);
    if (!pengeluaranForm.tanggal) return flash("pengeluaran", false, "Tanggal wajib diisi.");
    if (!pengeluaranForm.description.trim()) return flash("pengeluaran", false, "Deskripsi wajib diisi.");
    if (!amount || amount <= 0) return flash("pengeluaran", false, "Jumlah harus lebih dari 0.");

    setPengeluaranBusy(true);
    try {
      const res = await insertFinanceRecord({
        type: pengeluaranForm.type,
        description: pengeluaranForm.description.trim(),
        amount,
        record_date: pengeluaranForm.tanggal,
        // reference_id: null — tidak ada kalkulasi/referensi otomatis
      });
      flash("pengeluaran", true, res.message === "success" ? "Pengeluaran disimpan." : res.message);
      setPengeluaranForm(EMPTY_PENGELUARAN);
      await fetchPengeluaran();
    } catch (err) {
      flash("pengeluaran", false, err.message || "Gagal menyimpan.");
    } finally {
      setPengeluaranBusy(false);
    }
  }

  async function handleDeletePengeluaran(id) {
    if (!confirm("Hapus data pengeluaran ini?")) return;
    try {
      await deleteFinanceRecord(id);
      await fetchPengeluaran();
    } catch (err) {
      flash("pengeluaran", false, err.message);
    }
  }

  // ── Shared UI ──────────────────────────────────────────────
  const inp = "w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition bg-white";
  const lbl = "block text-sm font-medium text-slate-700 mb-1";
  const btn = "px-5 py-2 rounded-full bg-[#272925] text-[#F8F6ED] text-sm font-semibold hover:bg-[#50553C] transition disabled:opacity-60 disabled:cursor-not-allowed";

  function Msg({ state }) {
    if (!state) return null;
    return (
      <span className={`text-sm font-medium ${state.ok ? "text-green-700" : "text-red-600"}`}>
        {state.ok ? "✓ " : "✕ "}{state.text}
      </span>
    );
  }

  const typeLabel = (v) => PENGELUARAN_TYPES.find((t) => t.value === v)?.label ?? v;

  // ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-10">

      {/* Filter bulan */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-600">Bulan:</span>
        <input
          type="month"
          value={filterBulan}
          onChange={(e) => setFilterBulan(e.target.value)}
          className="px-3 py-1.5 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#272925] transition"
        />
      </div>

      {/* ════════════ PRESENSI GURU ════════════ */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">📋 Presensi Guru</h2>

        {/* Form */}
        <div className="bg-white border rounded-xl shadow-sm p-5">
          <form onSubmit={handlePresensiSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Guru *</label>
              <select
                className={inp}
                value={presensiForm.teacher_id}
                onChange={(e) => setPresensiForm((s) => ({ ...s, teacher_id: e.target.value }))}
                required
              >
                <option value="">— Pilih Guru —</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={lbl}>Tanggal *</label>
              <input
                type="date"
                className={inp}
                value={presensiForm.tanggal}
                onChange={(e) => setPresensiForm((s) => ({ ...s, tanggal: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className={lbl}>Status Kehadiran</label>
              <div className="flex gap-5 mt-2">
                {[{ v: true, label: "✅ Hadir" }, { v: false, label: "❌ Tidak Hadir" }].map(({ v, label }) => (
                  <label key={String(v)} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
                    <input type="radio" checked={presensiForm.hadir === v} onChange={() => setPresensiForm((s) => ({ ...s, hadir: v }))} />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={lbl}>Keterangan <span className="text-slate-400 font-normal">(opsional)</span></label>
              <input
                type="text"
                className={inp}
                value={presensiForm.keterangan}
                onChange={(e) => setPresensiForm((s) => ({ ...s, keterangan: e.target.value }))}
                placeholder="Sakit, izin, libur nasional…"
              />
            </div>

            <div className="md:col-span-2 flex items-center justify-between gap-4 pt-1">
              <Msg state={presensiMsg} />
              <button type="submit" disabled={presensiBusy} className={`ml-auto ${btn}`}>
                {presensiBusy ? "Menyimpan…" : "Simpan Presensi"}
              </button>
            </div>
          </form>
        </div>

        {/* Tabel */}
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b">
            <span className="text-sm font-semibold text-slate-700">
              Rekap {filterBulan} <span className="text-slate-400 font-normal">({presensiList.length} entri)</span>
            </span>
            <button onClick={fetchPresensi} className="px-3 py-1 rounded border bg-slate-50 hover:bg-slate-100 text-xs font-medium">Refresh</button>
          </div>

          {presensiLoading ? (
            <p className="p-8 text-center text-sm text-slate-400">Memuat…</p>
          ) : presensiList.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-400">Belum ada data presensi bulan ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b text-xs text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Guru</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Keterangan</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {presensiList.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600">{fmtTgl(p.tanggal)}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{p.teachers?.name ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.hadir ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                          {p.hadir ? "✓ Hadir" : "✕ Tidak Hadir"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{p.keterangan || "—"}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => handleDeletePresensi(p.id)} className="px-3 py-1.5 rounded text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition">
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* ════════════ PENGELUARAN ════════════ */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">💸 Pengeluaran</h2>
        <p className="text-xs text-slate-400 -mt-2">Data disimpan ke tabel <code className="bg-slate-100 px-1 rounded">finance_records</code> (type: outcome / salary).</p>

        {/* Form */}
        <div className="bg-white border rounded-xl shadow-sm p-5">
          <form onSubmit={handlePengeluaranSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Tanggal *</label>
              <input
                type="date"
                className={inp}
                value={pengeluaranForm.tanggal}
                onChange={(e) => setPengeluaranForm((s) => ({ ...s, tanggal: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className={lbl}>Jenis *</label>
              <select
                className={inp}
                value={pengeluaranForm.type}
                onChange={(e) => setPengeluaranForm((s) => ({ ...s, type: e.target.value }))}
                required
              >
                {PENGELUARAN_TYPES.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className={lbl}>Deskripsi *</label>
              <input
                type="text"
                className={inp}
                value={pengeluaranForm.description}
                onChange={(e) => setPengeluaranForm((s) => ({ ...s, description: e.target.value }))}
                placeholder="Contoh: Listrik April, Gaji Stefina, Print materi"
                required
              />
            </div>

            <div>
              <label className={lbl}>Jumlah (Rp) *</label>
              <input
                type="number"
                min="0"
                className={inp}
                value={pengeluaranForm.amount}
                onChange={(e) => setPengeluaranForm((s) => ({ ...s, amount: e.target.value }))}
                placeholder="500000"
                required
              />
            </div>

            <div className="flex items-end">
              <div className="md:col-span-2 flex items-center justify-between gap-4 w-full">
                <Msg state={pengeluaranMsg} />
                <button type="submit" disabled={pengeluaranBusy} className={`ml-auto ${btn}`}>
                  {pengeluaranBusy ? "Menyimpan…" : "Simpan Pengeluaran"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Tabel */}
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b">
            <span className="text-sm font-semibold text-slate-700">
              Rekap {filterBulan} <span className="text-slate-400 font-normal">({pengeluaranList.length} entri)</span>
            </span>
            <button onClick={fetchPengeluaran} className="px-3 py-1 rounded border bg-slate-50 hover:bg-slate-100 text-xs font-medium">Refresh</button>
          </div>

          {pengeluaranLoading ? (
            <p className="p-8 text-center text-sm text-slate-400">Memuat…</p>
          ) : pengeluaranList.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-400">Belum ada data pengeluaran bulan ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b text-xs text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Jenis</th>
                    <th className="px-4 py-3">Deskripsi</th>
                    <th className="px-4 py-3 text-right">Jumlah</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {pengeluaranList.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600">{fmtTgl(p.record_date)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.type === "salary" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                          {typeLabel(p.type)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-800">{p.description}</td>
                      <td className="px-4 py-3 text-right font-medium text-slate-800 whitespace-nowrap">{fmtRupiah(p.amount)}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => handleDeletePengeluaran(p.id)} className="px-3 py-1.5 rounded text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition">
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
