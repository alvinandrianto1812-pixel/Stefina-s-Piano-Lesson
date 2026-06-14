// src/pages/admin/sections/AdminEventRegistrations.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import toast from "react-hot-toast";

const STATUS_STYLES = {
  pending: { bg: "rgba(234,179,8,0.1)", color: "#92400e", label: "⏳ Pending" },
  verified: {
    bg: "rgba(22,163,74,0.08)",
    color: "#15803d",
    label: "✅ Verified",
  },
  rejected: {
    bg: "rgba(220,38,38,0.08)",
    color: "#DC2626",
    label: "❌ Rejected",
  },
};

export default function AdminEventRegistrations({ onCountUpdate }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [proofModal, setProofModal] = useState(null);

  useEffect(() => {
    supabase
      .from("events")
      .select("id, title, is_paid, event_date")
      .order("event_date", { ascending: false })
      .then(({ data }) => setEvents(data || []));
  }, []);

  useEffect(() => {
    fetchRegistrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEvent, filterStatus]);

  const fetchRegistrations = async () => {
    setLoading(true);
    let query = supabase
      .from("event_registrations")
      .select(
        `
        *,
        event:events(id, title, is_paid, price, event_date)
      `,
      )
      .order("created_at", { ascending: false });

    if (selectedEvent !== "all") query = query.eq("event_id", selectedEvent);
    if (filterStatus !== "all") query = query.eq("status", filterStatus);

    const { data, error } = await query;
    if (error) console.error("fetch registrations error:", error);
    setRegistrations(data || []);
    if (onCountUpdate) onCountUpdate(data?.length || 0);
    setLoading(false);
  };

  const updateStatus = async (id, newStatus) => {
    const label = newStatus === "verified" ? "Verifikasi" : "Tolak";
    if (!window.confirm(`${label} pendaftaran ini?`)) return;

    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("event_registrations")
      .update({
        status: newStatus,
        verified_by: userData.user?.id,
        verified_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      toast.error("Gagal update status: " + error.message);
      return;
    }
    toast.success(
      newStatus === "verified"
        ? "✅ Berhasil diverifikasi!"
        : "❌ Pendaftaran ditolak.",
    );
    fetchRegistrations();
  };

  const pendingCount = registrations.filter(
    (r) => r.status === "pending",
  ).length;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Event Registrations
          </h2>
          {pendingCount > 0 && (
            <p className="text-xs text-amber-600 font-medium mt-0.5">
              ⏳ {pendingCount} pendaftaran menunggu verifikasi
            </p>
          )}
        </div>
        <button
          onClick={fetchRegistrations}
          className="px-3 py-1.5 rounded border bg-slate-50 hover:bg-slate-100 text-xs font-medium transition"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition bg-white"
        >
          <option value="all">Semua Event</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.title} {ev.is_paid ? "💳" : "🎟️"}
            </option>
          ))}
        </select>

        <div className="flex gap-1.5">
          {["all", "pending", "verified", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition"
              style={{
                background: filterStatus === s ? "#272925" : "#F1F5F9",
                color: filterStatus === s ? "#F8F6ED" : "#64748B",
              }}
            >
              {s === "all" ? "Semua" : STATUS_STYLES[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-500">Memuat data…</div>
      ) : registrations.length === 0 ? (
        <div className="p-12 text-center text-slate-400">
          <div className="text-4xl mb-3">📋</div>
          <p>
            Belum ada pendaftaran
            {filterStatus !== "all" ? " dengan status ini" : ""}.
          </p>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table
              className="w-full text-sm text-left"
              style={{ minWidth: "700px" }}
            >
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-3 font-semibold text-slate-700">
                    Pendaftar
                  </th>
                  <th className="p-3 font-semibold text-slate-700">Event</th>
                  <th className="p-3 font-semibold text-slate-700">Kontak</th>
                  <th className="p-3 font-semibold text-slate-700">Bukti</th>
                  <th className="p-3 font-semibold text-slate-700">Status</th>
                  <th className="p-3 font-semibold text-slate-700">Daftar</th>
                  <th className="p-3 font-semibold text-slate-700 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/50">
                    <td className="p-3 align-top">
                      <p className="font-semibold text-slate-800">
                        {reg.full_name}
                      </p>
                      {reg.social_media && (
                        <p className="text-xs text-slate-400">
                          {reg.social_media}
                        </p>
                      )}
                    </td>

                    <td className="p-3 align-top">
                      <p className="text-xs font-medium text-slate-700">
                        {reg.event?.title || "—"}
                      </p>
                      {reg.event?.is_paid && (
                        <span className="text-[10px] text-blue-600 font-semibold">
                          💳 Rp{" "}
                          {Number(reg.event.price).toLocaleString("id-ID")}
                        </span>
                      )}
                    </td>

                    <td className="p-3 align-top">
                      <p className="text-xs text-slate-600">{reg.phone}</p>
                      {reg.email && (
                        <p className="text-xs text-slate-400">{reg.email}</p>
                      )}
                    </td>

                    <td className="p-3 align-top">
                      {reg.payment_proof_url ? (
                        <button
                          onClick={() => setProofModal(reg.payment_proof_url)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                        >
                          Lihat Bukti
                        </button>
                      ) : (
                        <span className="text-xs text-slate-300">
                          {reg.event?.is_paid ? "Belum upload" : "—"}
                        </span>
                      )}
                    </td>

                    <td className="p-3 align-top">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: STATUS_STYLES[reg.status]?.bg,
                          color: STATUS_STYLES[reg.status]?.color,
                        }}
                      >
                        {STATUS_STYLES[reg.status]?.label || reg.status}
                      </span>
                    </td>

                    <td className="p-3 align-top text-xs text-slate-500 whitespace-nowrap">
                      {new Date(reg.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="p-3 align-top text-center">
                      {reg.status === "pending" ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => updateStatus(reg.id, "verified")}
                            className="px-3 py-1.5 rounded text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 transition"
                          >
                            ✓ Verify
                          </button>
                          <button
                            onClick={() => updateStatus(reg.id, "rejected")}
                            className="px-3 py-1.5 rounded text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition"
                          >
                            ✕ Tolak
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          {reg.verified_at
                            ? new Date(reg.verified_at).toLocaleDateString(
                                "id-ID",
                                { day: "numeric", month: "short" },
                              )
                            : "—"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal bukti bayar */}
      {proofModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setProofModal(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-semibold text-slate-800">Bukti Pembayaran</h3>
              <button
                onClick={() => setProofModal(null)}
                className="text-slate-400 hover:text-slate-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              {proofModal.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img
                  src={proofModal}
                  alt="Bukti pembayaran"
                  className="w-full rounded-xl"
                  style={{ maxHeight: "70vh", objectFit: "contain" }}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-4xl mb-3">📄</p>
                  <p className="text-slate-600 text-sm mb-4">
                    File PDF tidak bisa dipreview langsung.
                  </p>
                  <a
                    href={proofModal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-[#272925] text-[#F8F6ED] text-sm font-semibold"
                  >
                    Buka PDF →
                  </a>
                </div>
              )}
            </div>

            <div className="px-4 pb-4 flex justify-end">
              <a
                href={proofModal}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                Buka di tab baru ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
