// src/pages/student/sections/StudentDashboard.jsx
import { useAuth } from "../../../contexts/AuthProvider";

const LEVEL_LABEL = {
  beginner: { label: "Beginner", color: "#15803d", bg: "rgba(22,163,74,0.08)" },
  intermediate: {
    label: "Intermediate",
    color: "#1e40af",
    bg: "rgba(59,130,246,0.08)",
  },
  advanced: {
    label: "Advanced",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.08)",
  },
};

function InfoCard({ icon, label, value, accent = "#272925" }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "1.25rem 1.5rem",
        border: "1px solid rgba(39,41,37,0.07)",
        boxShadow: "0 2px 8px rgba(39,41,37,0.05)",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          flexShrink: 0,
          background: `${accent}12`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.3rem",
        }}
      >
        {icon}
      </div>
      <div>
        <p
          style={{
            margin: 0,
            fontSize: "0.65rem",
            fontWeight: 700,
            color: "#94A3B8",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {label}
        </p>
        <p
          style={{
            margin: "0.15rem 0 0",
            fontSize: "1rem",
            fontWeight: 700,
            color: accent,
            lineHeight: 1.3,
          }}
        >
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default function StudentDashboard({ student }) {
  const { signOut } = useAuth();
  const level = LEVEL_LABEL[student.level] || LEVEL_LABEL.beginner;

  const billingText = student.billing_date
    ? `Setiap tanggal ${student.billing_date}`
    : "Belum diset";

  const feeText = student.monthly_fee
    ? `Rp ${Number(student.monthly_fee).toLocaleString("id-ID")}/bulan`
    : "Belum diset";

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <div
        style={{
          background: "linear-gradient(135deg, #272925 0%, #50553C 100%)",
          borderRadius: 20,
          padding: "2rem",
          boxShadow: "0 8px 32px rgba(39,41,37,0.2)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background pattern */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(-14deg, transparent 0px, transparent 28px, rgba(209,167,153,0.04) 28px, rgba(209,167,153,0.04) 29px)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p
            style={{
              margin: "0 0 0.25rem",
              fontSize: "0.65rem",
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(209,167,153,0.6)",
            }}
          >
            Selamat Datang
          </p>
          <h1
            style={{
              margin: "0 0 0.5rem",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontFamily: '"Rockdale FREE", serif',
              color: "#F8F6ED",
              lineHeight: 1.2,
            }}
          >
            {student.full_name}
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                padding: "3px 12px",
                borderRadius: "999px",
                fontSize: "0.72rem",
                fontWeight: 700,
                background: level.bg,
                color: level.label === "Beginner" ? "#F8F6ED" : level.color,
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(4px)",
              }}
            >
              {level.label}
            </span>
            {student.instrument && (
              <span
                style={{ fontSize: "0.8rem", color: "rgba(248,246,237,0.6)" }}
              >
                🎹 {student.instrument}
              </span>
            )}
            {student.is_active ? (
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "rgba(34,197,94,0.9)",
                }}
              >
                ● Active
              </span>
            ) : (
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "rgba(239,68,68,0.9)",
                }}
              >
                ● Inactive
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "0.9rem",
        }}
      >
        <InfoCard
          icon="🎹"
          label="Instrumen"
          value={student.instrument}
          accent="#272925"
        />
        <InfoCard
          icon="📊"
          label="Level"
          value={level.label}
          accent={level.color}
        />
        <InfoCard
          icon="💳"
          label="Tagihan Bulanan"
          value={feeText}
          accent="#1e40af"
        />
        <InfoCard
          icon="📅"
          label="Tanggal Billing"
          value={billingText}
          accent="#7c3aed"
        />
      </div>

      {/* Teacher card */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "1.5rem",
          border: "1px solid rgba(39,41,37,0.07)",
          boxShadow: "0 2px 8px rgba(39,41,37,0.05)",
        }}
      >
        <p
          style={{
            margin: "0 0 1rem",
            fontSize: "0.65rem",
            fontWeight: 800,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#94A3B8",
          }}
        >
          Teacher Assigned
        </p>
        {student.teacher ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {student.teacher.photo_url ? (
              <img
                src={student.teacher.photo_url}
                alt={student.teacher.name}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                  border: "2px solid #E2E8F0",
                }}
              />
            ) : (
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #272925, #50553C)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem",
                  flexShrink: 0,
                }}
              >
                👩‍🏫
              </div>
            )}
            <div>
              <p
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#272925",
                }}
              >
                {student.teacher.name}
              </p>
              {student.teacher.instrument && (
                <p
                  style={{
                    margin: "0.2rem 0 0",
                    fontSize: "0.8rem",
                    color: "#64748B",
                  }}
                >
                  🎵 {student.teacher.instrument}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: "1rem",
              borderRadius: 12,
              background: "#F8FAFC",
              border: "1px dashed #CBD5E1",
              textAlign: "center",
            }}
          >
            <p style={{ margin: 0, color: "#94A3B8", fontSize: "0.85rem" }}>
              Belum ada teacher yang di-assign. Hubungi admin untuk informasi
              lebih lanjut.
            </p>
          </div>
        )}
      </div>

      {/* Profile detail */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "1.5rem",
          border: "1px solid rgba(39,41,37,0.07)",
          boxShadow: "0 2px 8px rgba(39,41,37,0.05)",
        }}
      >
        <p
          style={{
            margin: "0 0 1rem",
            fontSize: "0.65rem",
            fontWeight: 800,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#94A3B8",
          }}
        >
          Data Profil
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            { label: "Email", value: student.email },
            { label: "No. WhatsApp", value: student.phone },
            { label: "Nama Orang Tua", value: student.parent_name },
            { label: "No. WA Orang Tua", value: student.parent_phone },
            {
              label: "Bergabung",
              value: student.joined_at
                ? new Date(student.joined_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : null,
            },
          ].map((item) => (
            <div key={item.label}>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: "#94A3B8",
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  margin: "0.2rem 0 0",
                  fontSize: "0.9rem",
                  color: item.value ? "#272925" : "#CBD5E1",
                  fontWeight: item.value ? 500 : 400,
                }}
              >
                {item.value || "Belum diisi"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Notes dari admin */}
      {student.notes && (
        <div
          style={{
            background: "rgba(234,179,8,0.06)",
            borderRadius: 16,
            padding: "1.25rem 1.5rem",
            border: "1px solid rgba(234,179,8,0.2)",
          }}
        >
          <p
            style={{
              margin: "0 0 0.5rem",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "#92400e",
            }}
          >
            📌 Catatan dari Admin
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              color: "#272925",
              lineHeight: 1.7,
            }}
          >
            {student.notes}
          </p>
        </div>
      )}
    </div>
  );
}
