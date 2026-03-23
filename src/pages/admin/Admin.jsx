// src/pages/Admin.jsx
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const [payments, setPayments] = useState([]);
  const [questionnaires, setQuestionnaires] = useState([]);

  // State untuk Fitur Tambahan (Filter & Pencarian)
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setMe(user);

      // cek role admin
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
      setLoading(false);
    })();
  }, [navigate]);

  const fetchAll = async () => {
    setLoading(true);
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
    setLoading(false);
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

  // --- LOGIKA FILTER & PENCARIAN ---
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      // Filter Status
      if (filterStatus !== "all" && p.status !== filterStatus) return false;

      // Filter Pencarian (Nama Anak, Orang Tua, Instrumen)
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
        ) {
          return false;
        }
      }

      return true;
    });
  }, [payments, filterStatus, searchQuery, questionnaireById]);

  // --- LOGIKA EXPORT CSV ---
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

      // Gunakan kutipan (quotes) agar data yang mengandung koma tidak merusak format CSV
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

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard Admin</h1>

      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            {/* Input Pencarian */}
            <input
              type="text"
              placeholder="Cari nama, instrumen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold w-full md:w-64 text-sm"
            />

            {/* Dropdown Filter Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold text-sm bg-white"
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
              Refresh Data
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-3 font-semibold text-slate-700">Tanggal</th>
                <th className="p-3 font-semibold text-slate-700">Orang Tua</th>
                <th className="p-3 font-semibold text-slate-700">Anak</th>
                <th className="p-3 font-semibold text-slate-700">Instrumen</th>
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
                      <td className="p-3 align-top">{q?.instrument || "-"}</td>
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
                          {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
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
                            className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                              p.status === "verified"
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-green-600 text-white hover:bg-green-700 shadow-sm"
                            }`}
                          >
                            Verifikasi
                          </button>
                          <button
                            disabled={p.status !== "pending"}
                            onClick={() => rejectPayment(p.id)}
                            className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                              p.status !== "pending"
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-red-600 text-white hover:bg-red-700 shadow-sm"
                            }`}
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
    </div>
  );
}
