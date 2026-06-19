// src/pages/student/sections/StudentInvoices.jsx
import { useEffect, useState, useRef } from "react";
import { supabase } from "../../../lib/supabaseClient";
import Modal from "../../../components/Modal";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  unpaid: {
    label: "Belum Bayar",
    color: "#DC2626",
    bg: "rgba(220,38,38,0.08)",
    icon: "⏳",
  },
  pending_verification: {
    label: "Menunggu Verifikasi",
    color: "#92400e",
    bg: "rgba(234,179,8,0.08)",
    icon: "🔍",
  },
  paid: {
    label: "Lunas",
    color: "#15803d",
    bg: "rgba(22,163,74,0.08)",
    icon: "✅",
  },
  overdue: {
    label: "Terlambat",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.08)",
    icon: "⚠️",
  },
};

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function StudentInvoices({ student }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null); // invoice id yang sedang diupload
  const [proofModal, setProofModal] = useState(null);
  const fileInputRef = useRef(null);
  const [activeUploadId, setActiveUploadId] = useState(null);

  useEffect(() => {
    fetchInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("student_id", student.id)
      .order("period_year", { ascending: false })
      .order("period_month", { ascending: false });

    if (error) console.error("fetch invoices error:", error);
    setInvoices(data || []);
    setLoading(false);
  };

  const handleUploadClick = (invoiceId) => {
    setActiveUploadId(invoiceId);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadId) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB.");
      return;
    }

    setUploading(activeUploadId);

    try {
      // Upload file ke storage
      const ALLOWED_TYPES = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
      ];
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB

      if (!ALLOWED_TYPES.includes(file.type)) {
        setError("Format tidak didukung. Gunakan JPG, PNG, WEBP, atau PDF.");
        return;
      }
      if (file.size > MAX_SIZE) {
        setError("Ukuran file maksimal 5MB.");
        return;
      }
      const ext = file.name.split(".").pop();
      const fileName = `invoice_${activeUploadId}_${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("payment-proofs")
        .upload(fileName, file, { upsert: false });

      if (upErr) throw new Error("Gagal upload: " + upErr.message);

      const { data: urlData } = supabase.storage
        .from("payment-proofs")
        .getPublicUrl(fileName);

      // Update invoice dengan proof URL & ubah status
      const { error: updateErr } = await supabase
        .from("invoices")
        .update({
          proof_url: urlData.publicUrl,
          status: "pending_verification",
          paid_at: new Date().toISOString(),
        })
        .eq("id", activeUploadId);

      if (updateErr) throw new Error(updateErr.message);

      toast.success("✅ Bukti pembayaran berhasil diupload!");
      fetchInvoices();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(null);
      setActiveUploadId(null);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Hitung summary
  const totalUnpaid = invoices
    .filter((i) => i.status === "unpaid" || i.status === "overdue")
    .reduce((sum, i) => sum + Number(i.amount), 0);

  const unpaidCount = invoices.filter(
    (i) => i.status === "unpaid" || i.status === "overdue",
  ).length;

  const pendingCount = invoices.filter(
    (i) => i.status === "pending_verification",
  ).length;

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Summary banner */}
      {unpaidCount > 0 ? (
        // Banner merah — existing code, tidak berubah
        <div
          style={{
            background: "linear-gradient(135deg, #7f1d1d, #DC2626)",
            borderRadius: 20,
            padding: "1.5rem 2rem",
            boxShadow: "0 8px 32px rgba(220,38,38,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 0.25rem",
                fontSize: "0.65rem",
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(248,246,237,0.6)",
              }}
            >
              Tagihan Belum Lunas
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "1.6rem",
                fontWeight: 800,
                color: "#F8F6ED",
                lineHeight: 1.2,
              }}
            >
              Rp {totalUnpaid.toLocaleString("id-ID")}
            </p>
            <p
              style={{
                margin: "0.25rem 0 0",
                fontSize: "0.8rem",
                color: "rgba(248,246,237,0.6)",
              }}
            >
              {unpaidCount} tagihan menunggu pembayaran
            </p>
          </div>
          <div style={{ fontSize: "3rem" }}>💳</div>
        </div>
      ) : pendingCount > 0 ? (
        // Banner kuning — menunggu konfirmasi
        <div
          style={{
            background: "linear-gradient(135deg, #78350f, #d97706)",
            borderRadius: 20,
            padding: "1.5rem 2rem",
            boxShadow: "0 8px 32px rgba(217,119,6,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 0.25rem",
                fontSize: "0.65rem",
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(248,246,237,0.6)",
              }}
            >
              Menunggu Konfirmasi
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "#F8F6ED",
              }}
            >
              Bukti pembayaran sedang diverifikasi 🔍
            </p>
            <p
              style={{
                margin: "0.25rem 0 0",
                fontSize: "0.8rem",
                color: "rgba(248,246,237,0.6)",
              }}
            >
              {pendingCount} tagihan menunggu konfirmasi admin
            </p>
          </div>
          <div style={{ fontSize: "3rem" }}>⏳</div>
        </div>
      ) : (
        // Banner hijau — semua lunas
        <div
          style={{
            background: "linear-gradient(135deg, #14532d, #15803d)",
            borderRadius: 20,
            padding: "1.5rem 2rem",
            boxShadow: "0 8px 32px rgba(22,163,74,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 0.25rem",
                fontSize: "0.65rem",
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(248,246,237,0.6)",
              }}
            >
              Status Pembayaran
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "#F8F6ED",
              }}
            >
              Semua tagihan lunas! 🎉
            </p>
          </div>
          <div style={{ fontSize: "3rem" }}>✅</div>
        </div>
      )}

      {/* Invoice list */}
      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "#94A3B8" }}>
          Memuat tagihan…
        </div>
      ) : invoices.length === 0 ? (
        <div
          style={{
            padding: "3rem",
            textAlign: "center",
            background: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(39,41,37,0.07)",
          }}
        >
          <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🧾</p>
          <p style={{ color: "#94A3B8", margin: 0 }}>Belum ada tagihan.</p>
        </div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {invoices.map((invoice) => {
            const cfg = STATUS_CONFIG[invoice.status] || STATUS_CONFIG.unpaid;
            const canUpload =
              invoice.status === "unpaid" || invoice.status === "overdue";
            const isUploading = uploading === invoice.id;
            const dueDate = new Date(invoice.due_date + "T00:00:00");
            const isOverdue =
              invoice.status === "unpaid" && dueDate < new Date();

            return (
              <div
                key={invoice.id}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: `1px solid ${isOverdue ? "rgba(220,38,38,0.2)" : "rgba(39,41,37,0.07)"}`,
                  boxShadow: "0 2px 8px rgba(39,41,37,0.05)",
                  overflow: "hidden",
                }}
              >
                {/* Invoice header */}
                <div
                  style={{
                    padding: "1.1rem 1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: "#272925",
                      }}
                    >
                      {MONTH_NAMES[invoice.period_month - 1]}{" "}
                      {invoice.period_year}
                    </p>
                    {invoice.description && (
                      <p
                        style={{
                          margin: "0.15rem 0 0",
                          fontSize: "0.78rem",
                          color: "#64748B",
                        }}
                      >
                        {invoice.description}
                      </p>
                    )}
                    <p
                      style={{
                        margin: "0.15rem 0 0",
                        fontSize: "0.72rem",
                        color: isOverdue ? "#DC2626" : "#94A3B8",
                      }}
                    >
                      Jatuh tempo:{" "}
                      {dueDate.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                      {isOverdue && " · Terlambat!"}
                    </p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        margin: "0 0 0.25rem",
                        fontSize: "1.2rem",
                        fontWeight: 800,
                        color: "#272925",
                      }}
                    >
                      Rp {Number(invoice.amount).toLocaleString("id-ID")}
                    </p>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "999px",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        background: cfg.bg,
                        color: cfg.color,
                      }}
                    >
                      {cfg.icon} {cfg.label}
                    </span>
                  </div>
                </div>

                {/* Action area */}
                {(canUpload || invoice.proof_url || invoice.notes) && (
                  <div
                    style={{
                      padding: "0.85rem 1.25rem",
                      borderTop: "1px solid #F1F5F9",
                      background: "#FAFAFA",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "0.75rem",
                    }}
                  >
                    {/* Notes dari admin */}
                    {invoice.notes && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.78rem",
                          color: "#64748B",
                          flex: 1,
                        }}
                      >
                        💬 {invoice.notes}
                      </p>
                    )}

                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        marginLeft: "auto",
                      }}
                    >
                      {/* Lihat bukti yang sudah diupload */}
                      {invoice.proof_url && (
                        <button
                          onClick={() => setProofModal(invoice.proof_url)}
                          style={{
                            padding: "0.5rem 1rem",
                            borderRadius: 10,
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            background: "rgba(59,130,246,0.08)",
                            color: "#1e40af",
                            border: "1px solid rgba(59,130,246,0.2)",
                            cursor: "pointer",
                          }}
                        >
                          Lihat Bukti
                        </button>
                      )}

                      {/* Upload bukti */}
                      {canUpload && (
                        <button
                          onClick={() => handleUploadClick(invoice.id)}
                          disabled={isUploading}
                          style={{
                            padding: "0.5rem 1.25rem",
                            borderRadius: 10,
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            background: isUploading ? "#94A3B8" : "#272925",
                            color: "#F8F6ED",
                            border: "none",
                            cursor: isUploading ? "not-allowed" : "pointer",
                            transition: "background 0.2s",
                          }}
                        >
                          {isUploading
                            ? "Mengupload…"
                            : invoice.proof_url
                              ? "Ganti Bukti"
                              : "Upload Bukti Bayar"}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal bukti bayar */}
      {proofModal && (
        <Modal maxWidth={520} onClose={() => setProofModal(null)}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "#272925",
              }}
            >
              Bukti Pembayaran
            </h3>
          </div>
          <div>
            {proofModal.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img
                src={proofModal}
                alt="Bukti pembayaran"
                style={{
                  width: "100%",
                  borderRadius: 12,
                  maxHeight: "65vh",
                  objectFit: "contain",
                }}
              />
            ) : (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <p style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
                  📄
                </p>
                <p
                  style={{
                    color: "#64748B",
                    fontSize: "0.85rem",
                    marginBottom: "1rem",
                  }}
                >
                  File tidak bisa dipreview langsung.
                </p>
                <a
                  href={proofModal}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "0.5rem 1.25rem",
                    borderRadius: 999,
                    background: "#272925",
                    color: "#F8F6ED",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Buka File →
                </a>
              </div>
            )}
          </div>
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <a
              href={proofModal}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.8rem",
                color: "#64748B",
                textDecoration: "none",
              }}
            >
              Buka di tab baru ↗
            </a>
          </div>
        </Modal>
      )}
    </div>
  );
}
