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
    const [{ data: pmt }, { data: qst }] = await Promise.all([
      supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false }),
      // ambil semua field yg dibutuhkan dari questionnaire
      supabase.from("questionnaire").select("*"),
    ]);
    setPayments(pmt || []);
    setQuestionnaires(qst || []);
    setLoading(false);
  };

  // Ambil questionnaire TERBARU per user (biar konsisten)
  const questionnaireByUser = useMemo(() => {
    const map = new Map();
    [...questionnaires]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .forEach((q) => {
        if (!map.has(q.user_id)) map.set(q.user_id, q);
      });
    return map;
  }, [questionnaires]);

  // Format prefered_day + prefered_time
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
    if (time) parts.push(time); // contoh: "13:00–14:00"
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

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Dashboard Admin</h1>

      {/* Pembayaran */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Pembayaran</h2>
          <button
            onClick={fetchAll}
            className="px-3 py-1.5 rounded border hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2 border">Tanggal</th>
                <th className="p-2 border">Orang Tua</th>
                <th className="p-2 border">Anak</th>
                <th className="p-2 border">Instrumen</th>
                <th className="p-2 border">Jadwal</th>
                <th className="p-2 border">Nominal</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Bukti</th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-4 text-center text-slate-500">
                    Belum ada pembayaran.
                  </td>
                </tr>
              ) : (
                payments.map((p) => {
                  const q = questionnaireByUser.get(p.user_id); // langsung dari questionnaire
                  const parentName =
                    [q?.father_name, q?.mother_name]
                      .filter(Boolean)
                      .join(" & ") || "-";
                  const preferred = q
                    ? fmtPreferredSchedule(q.preferred_day, q.preferred_time)
                    : "";

                  return (
                    <tr key={p.id} className="odd:bg-white even:bg-slate-50">
                      {/* Tanggal dari payments.created_at */}
                      <td className="p-2 border align-top">
                        {new Date(p.created_at).toLocaleString("id-ID")}
                      </td>

                      {/* Orang tua */}
                      <td className="p-2 border align-top">{parentName}</td>

                      {/* Anak */}
                      <td className="p-2 border align-top">
                        {q?.student_full_name || "-"}
                      </td>

                      {/* Instrumen */}
                      <td className="p-2 border align-top">
                        {q?.instrument || "-"}
                      </td>

                      {/* Jadwal dari questionnaire.prefered_day + prefered_time */}
                      <td className="p-2 border align-top">
                        {preferred || "-"}
                      </td>

                      {/* Nominal dari payments.amount */}
                      <td className="p-2 border align-top">
                        Rp {Number(p.amount || 0).toLocaleString("id-ID")}
                      </td>

                      {/* Status pembayaran */}
                      <td className="p-2 border align-top">
                        <span
                          className={
                            "inline-block px-2 py-0.5 rounded text-xs " +
                            (p.status === "verified"
                              ? "bg-green-100 text-green-700"
                              : p.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700")
                          }
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* Bukti */}
                      <td className="p-2 border align-top">
                        {p.proof_url ? (
                          <a
                            href={p.proof_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline"
                          >
                            Lihat Bukti
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="p-2 border align-top space-x-2">
                        <button
                          disabled={p.status === "verified"}
                          onClick={() => verifyPayment(p.id)}
                          className={`px-2 py-1 rounded ${
                            p.status === "verified"
                              ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                              : "bg-green-500 text-white hover:bg-green-600"
                          }`}
                        >
                          Verifikasi
                        </button>
                        <button
                          disabled={p.status !== "pending"}
                          onClick={() => rejectPayment(p.id)}
                          className={`px-2 py-1 rounded ${
                            p.status !== "pending"
                              ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                              : "bg-red-500 text-white hover:bg-red-600"
                          }`}
                        >
                          Tolak
                        </button>
                        {/* Tidak ada tombol Batalkan karena tidak pakai bookings/slots */}
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
