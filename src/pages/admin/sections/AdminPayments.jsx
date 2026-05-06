import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import toast from "react-hot-toast";

export default function AdminPayments({ onStatsUpdate }) {
  const [payments, setPayments] = useState([]);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

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
    if (onStatsUpdate) {
      onStatsUpdate({
        total: pmt?.length || 0,
        pending: pmt?.filter((p) => p.status === "pending").length || 0,
        verified: pmt?.filter((p) => p.status === "verified").length || 0,
      });
    }
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
    if (!window.confirm("Verifikasi pembayaran ini?")) return;
    const { error } = await supabase
      .from("payments")
      .update({ status: "verified" })
      .eq("id", paymentId);
    if (error) toast.error("Gagal verifikasi: " + error.message);
    else {
      await fetchAll();
      toast.success("Pembayaran terverifikasi.");
    }
  };

  const rejectPayment = async (paymentId) => {
    if (!window.confirm("Tolak pembayaran ini?")) return;
    const { error } = await supabase
      .from("payments")
      .update({ status: "rejected" })
      .eq("id", paymentId);
    if (error) toast.error("Gagal menolak: " + error.message);
    else {
      await fetchAll();
      toast.success("Pembayaran ditolak.");
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
      toast.error("Tidak ada data untuk diekspor");
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

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Filter bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          background: "#fff",
          padding: "1rem 1.25rem",
          borderRadius: 14,
          border: "1px solid rgba(39,41,37,0.1)",
          boxShadow: "0 1px 4px rgba(39,41,37,0.06)",
        }}
      >
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", flex: 1 }}
        >
          <input
            type="text"
            placeholder="Cari nama, instrumen…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "0.5rem 0.9rem",
              border: "1.5px solid rgba(39,41,37,0.15)",
              borderRadius: 10,
              fontSize: "0.82rem",
              fontFamily: "inherit",
              outline: "none",
              width: 220,
              color: "var(--charcoal)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--olive)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(39,41,37,0.15)")}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: "0.5rem 0.9rem",
              border: "1.5px solid rgba(39,41,37,0.15)",
              borderRadius: 10,
              fontSize: "0.82rem",
              fontFamily: "inherit",
              background: "#fff",
              color: "var(--charcoal)",
              cursor: "pointer",
            }}
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={exportToCSV}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: 10,
              border: "1px solid rgba(22,163,74,0.3)",
              background: "rgba(22,163,74,0.07)",
              color: "#15803d",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Export CSV
          </button>
          <button
            onClick={fetchAll}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: 10,
              border: "1px solid rgba(39,41,37,0.15)",
              background: "rgba(39,41,37,0.04)",
              color: "var(--charcoal)",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          overflowX: "auto",
          borderRadius: 14,
          border: "1px solid rgba(39,41,37,0.1)",
          background: "#fff",
          boxShadow: "0 1px 4px rgba(39,41,37,0.06)",
        }}
      >
        <table
          style={{
            width: "100%",
            fontSize: "0.82rem",
            borderCollapse: "collapse",
            minWidth: "620px",
          }}
        >
          <thead>
            <tr
              style={{
                background: "rgba(80,85,60,0.05)",
                borderBottom: "1px solid rgba(39,41,37,0.1)",
              }}
            >
              {[
                "Tanggal",
                "Orang Tua",
                "Anak",
                "Instrumen",
                "Jadwal",
                "Nominal",
                "Status",
                "Bukti",
                "Aksi",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "0.75rem 0.9rem",
                    fontWeight: 700,
                    color: "var(--olive)",
                    textAlign: h === "Aksi" ? "center" : "left",
                    fontSize: "0.72rem",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    padding: "3rem",
                    textAlign: "center",
                    color: "#94A3B8",
                    fontSize: "0.85rem",
                  }}
                >
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
                const statusColor =
                  p.status === "verified"
                    ? {
                        bg: "rgba(22,163,74,0.1)",
                        color: "#15803d",
                        border: "rgba(22,163,74,0.25)",
                      }
                    : p.status === "rejected"
                      ? {
                          bg: "rgba(220,38,38,0.08)",
                          color: "#b91c1c",
                          border: "rgba(220,38,38,0.2)",
                        }
                      : {
                          bg: "rgba(234,179,8,0.1)",
                          color: "#92400e",
                          border: "rgba(234,179,8,0.3)",
                        };
                return (
                  <tr
                    key={p.id}
                    style={{ borderBottom: "1px solid rgba(39,41,37,0.07)" }}
                  >
                    <td
                      style={{
                        padding: "0.7rem 0.9rem",
                        verticalAlign: "top",
                        whiteSpace: "nowrap",
                        color: "#64748B",
                        fontSize: "0.78rem",
                      }}
                    >
                      {new Date(p.created_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td
                      style={{
                        padding: "0.7rem 0.9rem",
                        verticalAlign: "top",
                        color: "var(--charcoal)",
                      }}
                    >
                      {parentName}
                      {!p.questionnaire_id && (
                        <div
                          style={{
                            fontSize: "0.68rem",
                            color: "#94A3B8",
                            marginTop: 2,
                          }}
                        >
                          (not linked)
                        </div>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "0.7rem 0.9rem",
                        verticalAlign: "top",
                        fontWeight: 600,
                        color: "var(--charcoal)",
                      }}
                    >
                      {q?.student_full_name || "-"}
                    </td>
                    <td
                      style={{
                        padding: "0.7rem 0.9rem",
                        verticalAlign: "top",
                        color: "var(--olive)",
                        fontWeight: 600,
                      }}
                    >
                      {q?.instrument || "-"}
                    </td>
                    <td
                      style={{
                        padding: "0.7rem 0.9rem",
                        verticalAlign: "top",
                        color: "#64748B",
                      }}
                    >
                      {preferred || "-"}
                    </td>
                    <td
                      style={{
                        padding: "0.7rem 0.9rem",
                        verticalAlign: "top",
                        whiteSpace: "nowrap",
                        fontWeight: 600,
                        color: "var(--charcoal)",
                      }}
                    >
                      Rp {Number(p.amount || 0).toLocaleString("id-ID")}
                    </td>
                    <td
                      style={{ padding: "0.7rem 0.9rem", verticalAlign: "top" }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.2rem 0.65rem",
                          borderRadius: 999,
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          background: statusColor.bg,
                          color: statusColor.color,
                          border: `1px solid ${statusColor.border}`,
                        }}
                      >
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                    </td>
                    <td
                      style={{ padding: "0.7rem 0.9rem", verticalAlign: "top" }}
                    >
                      {p.proof_url ? (
                        <a
                          href={p.proof_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: "var(--olive)",
                            textDecoration: "underline",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                          }}
                        >
                          Lihat Bukti
                        </a>
                      ) : (
                        <span style={{ color: "#CBD5E1", fontSize: "0.78rem" }}>
                          —
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "0.7rem 0.9rem",
                        verticalAlign: "top",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <button
                          disabled={p.status === "verified"}
                          onClick={() => verifyPayment(p.id)}
                          style={{
                            padding: "0.3rem 0.7rem",
                            borderRadius: 7,
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            border: "none",
                            cursor:
                              p.status === "verified"
                                ? "not-allowed"
                                : "pointer",
                            background:
                              p.status === "verified" ? "#F1F5F9" : "#16a34a",
                            color: p.status === "verified" ? "#94A3B8" : "#fff",
                            fontFamily: "inherit",
                          }}
                        >
                          Verifikasi
                        </button>
                        <button
                          disabled={p.status !== "pending"}
                          onClick={() => rejectPayment(p.id)}
                          style={{
                            padding: "0.3rem 0.7rem",
                            borderRadius: 7,
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            border: "none",
                            cursor:
                              p.status !== "pending"
                                ? "not-allowed"
                                : "pointer",
                            background:
                              p.status !== "pending" ? "#F1F5F9" : "#dc2626",
                            color: p.status !== "pending" ? "#94A3B8" : "#fff",
                            fontFamily: "inherit",
                          }}
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
  );
}
