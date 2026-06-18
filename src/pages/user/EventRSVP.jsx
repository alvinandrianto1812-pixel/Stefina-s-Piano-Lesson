// src/pages/user/EventRSVP.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import Footer from "../../components/Footer";

function fmtDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const EMPTY_FORM = {
  full_name: "",
  phone: "",
  email: "",
  social_media: "",
  payment_proof_url: "",
};

export default function EventRSVP() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [evLoading, setEvLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [proofFile, setProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // Fetch event detail
  useEffect(() => {
    if (!id) return;
    supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .eq("is_published", true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          setError("Event tidak ditemukan.");
        } else {
          setEvent(data);
        }
        setEvLoading(false);
      });
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB.");
      return;
    }
    setProofFile(file);
    setError(null);
  };

  const uploadProof = async () => {
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
    if (!proofFile) return null;
    const ext = proofFile.name.split(".").pop();
    const fileName = `event_${id}_${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("payment-proofs")
      .upload(fileName, proofFile, { upsert: false });
    if (upErr) throw new Error("Gagal upload bukti: " + upErr.message);
    const { data } = supabase.storage
      .from("payment-proofs")
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // Validasi: event berbayar wajib upload bukti
      if (event.is_paid && !proofFile) {
        setError("Event ini berbayar. Harap upload bukti pembayaran.");
        setSubmitting(false);
        return;
      }

      // Cek kapasitas
      if (event.max_capacity) {
        const { count } = await supabase
          .from("event_registrations")
          .select("*", { count: "exact", head: true })
          .eq("event_id", id)
          .eq("status", "verified");
        if (count >= event.max_capacity) {
          setError("Maaf, kapasitas event ini sudah penuh.");
          setSubmitting(false);
          return;
        }
      }

      const { data: existing } = await supabase
        .from("event_registrations")
        .select("id")
        .eq("event_id", id)
        .eq("phone", form.phone.trim())
        .maybeSingle();

      if (existing) {
        setError("Nomor WhatsApp ini sudah terdaftar untuk event ini.");
        setSubmitting(false);
        return;
      }

      // Upload bukti jika ada
      let proofUrl = null;
      if (proofFile) proofUrl = await uploadProof();

      // Insert registrasi
      const { error: insertErr } = await supabase
        .from("event_registrations")
        .insert([
          {
            event_id: id,
            full_name: form.full_name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim() || null,
            social_media: form.social_media.trim() || null,
            payment_proof_url: proofUrl,
            status: "pending",
          },
        ]);

      if (insertErr) throw new Error(insertErr.message);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading state ──
  if (evLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F8F6ED",
        }}
      >
        <p style={{ color: "#94A3B8", fontSize: "14px" }}>Memuat event…</p>
      </div>
    );
  }

  // ── Event tidak ditemukan ──
  if (error && !event) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F8F6ED",
          gap: "1rem",
        }}
      >
        <p style={{ fontSize: "3rem" }}>🎵</p>
        <p style={{ color: "#64748B" }}>{error}</p>
        <Link
          to="/events"
          style={{
            color: "#50553C",
            fontWeight: 600,
            textDecoration: "underline",
          }}
        >
          ← Kembali ke Events
        </Link>
      </div>
    );
  }

  // ── Success state ──
  if (submitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F8F6ED",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            width: "100%",
            background: "#fff",
            borderRadius: "24px",
            padding: "3rem 2rem",
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(39,41,37,0.1)",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
          <h2
            style={{
              fontFamily: '"Rockdale FREE", serif',
              fontSize: "1.8rem",
              color: "#272925",
              marginBottom: "0.75rem",
            }}
          >
            Pendaftaran Terkirim!
          </h2>
          <p
            style={{
              color: "#64748B",
              fontSize: "0.9rem",
              lineHeight: 1.7,
              marginBottom: "0.5rem",
            }}
          >
            Terima kasih, <strong>{form.full_name}</strong>! Pendaftaran kamu
            untuk
          </p>
          <p
            style={{ color: "#272925", fontWeight: 700, marginBottom: "1rem" }}
          >
            "{event.title}"
          </p>
          <p
            style={{
              color: "#64748B",
              fontSize: "0.85rem",
              lineHeight: 1.7,
              marginBottom: "2rem",
            }}
          >
            {event.is_paid
              ? "sudah kami terima. Admin akan memverifikasi bukti pembayaran kamu dan mengirimkan konfirmasi segera."
              : "sudah kami terima. Admin akan segera mengkonfirmasi pendaftaran kamu."}
          </p>
          <Link
            to="/events"
            style={{
              display: "inline-block",
              padding: "0.75rem 2rem",
              borderRadius: "999px",
              background: "#272925",
              color: "#F8F6ED",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            Lihat Events Lainnya
          </Link>
        </div>
      </div>
    );
  }

  // ── Main Form ──
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8F6ED",
        fontFamily: '"Creato Display", sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: "580px",
          margin: "0 auto",
          padding: "6rem 1.5rem 4rem",
        }}
      >
        {/* Back link */}
        <Link
          to="/events"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "#64748B",
            fontSize: "0.85rem",
            textDecoration: "none",
            marginBottom: "2rem",
          }}
        >
          ← Kembali ke Events
        </Link>

        {/* Event info card */}
        <div
          style={{
            background: "#272925",
            borderRadius: "20px",
            padding: "1.75rem 2rem",
            marginBottom: "2rem",
            color: "#F8F6ED",
          }}
        >
          <p
            style={{
              fontSize: "0.65rem",
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(248,246,237,0.5)",
              marginBottom: "0.5rem",
            }}
          >
            Daftar Event
          </p>
          <h1
            style={{
              fontFamily: '"Rockdale FREE", serif',
              fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
              margin: "0 0 0.5rem",
              lineHeight: 1.3,
            }}
          >
            {event.title}
          </h1>
          {event.subtitle && (
            <p
              style={{
                fontSize: "0.85rem",
                color: "rgba(248,246,237,0.6)",
                marginBottom: "0.75rem",
                fontStyle: "italic",
              }}
            >
              {event.subtitle}
            </p>
          )}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              fontSize: "0.8rem",
              color: "rgba(248,246,237,0.7)",
              marginTop: "0.75rem",
            }}
          >
            {event.event_date && <span>📅 {fmtDate(event.event_date)}</span>}
            {event.time_start && (
              <span>
                🕐 {event.time_start}
                {event.time_end && ` – ${event.time_end}`}
              </span>
            )}
            {event.location && (
              <span>
                📍 {event.location}
                {event.city && `, ${event.city}`}
              </span>
            )}
          </div>
          {event.is_paid && (
            <div
              style={{
                marginTop: "1rem",
                paddingTop: "1rem",
                borderTop: "1px solid rgba(248,246,237,0.15)",
              }}
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#F8F6ED",
                }}
              >
                💳 Biaya Pendaftaran: Rp{" "}
                {Number(event.price).toLocaleString("id-ID")}
              </span>
            </div>
          )}
        </div>

        {/* Form */}
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "2rem",
            boxShadow: "0 4px 20px rgba(39,41,37,0.06)",
          }}
        >
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "#272925",
              marginBottom: "1.5rem",
            }}
          >
            Formulir Pendaftaran
          </h2>

          {error && (
            <div
              style={{
                padding: "0.85rem 1rem",
                borderRadius: "12px",
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                color: "#DC2626",
                fontSize: "0.85rem",
                marginBottom: "1.25rem",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* Nama */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.4rem",
                }}
              >
                Nama Lengkap <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <input
                required
                value={form.full_name}
                onChange={(e) =>
                  setForm((s) => ({ ...s, full_name: e.target.value }))
                }
                placeholder="Masukkan nama lengkap"
                style={{
                  width: "100%",
                  padding: "0.65rem 0.9rem",
                  borderRadius: "12px",
                  border: "2px solid #E2E8F0",
                  fontSize: "0.9rem",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#272925")}
                onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
              />
            </div>

            {/* No HP */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.4rem",
                }}
              >
                Nomor WhatsApp <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((s) => ({ ...s, phone: e.target.value }))
                }
                placeholder="08xxxxxxxxxx"
                style={{
                  width: "100%",
                  padding: "0.65rem 0.9rem",
                  borderRadius: "12px",
                  border: "2px solid #E2E8F0",
                  fontSize: "0.9rem",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#272925")}
                onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
              />
            </div>

            {/* Email */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.4rem",
                }}
              >
                Email{" "}
                <span style={{ color: "#94A3B8", fontWeight: 400 }}>
                  (opsional)
                </span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((s) => ({ ...s, email: e.target.value }))
                }
                placeholder="nama@email.com"
                style={{
                  width: "100%",
                  padding: "0.65rem 0.9rem",
                  borderRadius: "12px",
                  border: "2px solid #E2E8F0",
                  fontSize: "0.9rem",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#272925")}
                onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
              />
            </div>

            {/* Sosmed */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.4rem",
                }}
              >
                Instagram / Sosial Media{" "}
                <span style={{ color: "#94A3B8", fontWeight: 400 }}>
                  (opsional)
                </span>
              </label>
              <input
                value={form.social_media}
                onChange={(e) =>
                  setForm((s) => ({ ...s, social_media: e.target.value }))
                }
                placeholder="@username"
                style={{
                  width: "100%",
                  padding: "0.65rem 0.9rem",
                  borderRadius: "12px",
                  border: "2px solid #E2E8F0",
                  fontSize: "0.9rem",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#272925")}
                onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
              />
            </div>

            {/* Upload bukti — hanya muncul kalau event berbayar */}
            {event.is_paid && (
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "0.4rem",
                  }}
                >
                  Bukti Pembayaran <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#94A3B8",
                    marginBottom: "0.6rem",
                  }}
                >
                  Transfer ke rekening BCA 1234567890 a/n Gurunada · Nominal: Rp{" "}
                  {Number(event.price).toLocaleString("id-ID")}
                </p>
                <div
                  style={{
                    border: "2px dashed #CBD5E1",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    textAlign: "center",
                    cursor: "pointer",
                    background: proofFile ? "#F0FDF4" : "#F8FAFC",
                    transition: "all 0.2s",
                  }}
                  onClick={() =>
                    document.getElementById("proof-upload").click()
                  }
                >
                  <input
                    id="proof-upload"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  {proofFile ? (
                    <div>
                      <p
                        style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}
                      >
                        ✅
                      </p>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "#16A34A",
                        }}
                      >
                        {proofFile.name}
                      </p>
                      <p
                        style={{
                          fontSize: "0.72rem",
                          color: "#94A3B8",
                          marginTop: "0.25rem",
                        }}
                      >
                        Klik untuk ganti file
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p
                        style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}
                      >
                        📎
                      </p>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "#374151",
                        }}
                      >
                        Klik untuk upload bukti
                      </p>
                      <p
                        style={{
                          fontSize: "0.72rem",
                          color: "#94A3B8",
                          marginTop: "0.25rem",
                        }}
                      >
                        JPG, PNG, atau PDF · Maks 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: "0.5rem",
                padding: "0.85rem",
                borderRadius: "999px",
                background: submitting ? "#94A3B8" : "#272925",
                color: "#F8F6ED",
                fontWeight: 700,
                fontSize: "0.95rem",
                border: "none",
                cursor: submitting ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
            >
              {submitting ? "Mengirim…" : "Kirim Pendaftaran →"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
