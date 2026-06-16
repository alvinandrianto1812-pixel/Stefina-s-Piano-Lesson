// src/pages/teacher/sections/TeacherDashboard.jsx
export default function TeacherDashboard({ teacher, students }) {
  const activeCount = students.length;
  const instruments = [
    ...new Set(students.map((s) => s.instrument).filter(Boolean)),
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "1rem",
        }}
      >
        <StatCard label="Total Murid Aktif" value={activeCount} icon="👨‍🎓" />
        <StatCard
          label="Instrumen Diajar"
          value={instruments.join(", ") || "-"}
          icon="🎸"
          small
        />
      </div>

      {/* Student list */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          boxShadow: "0 2px 10px rgba(39,41,37,0.07)",
          border: "1px solid rgba(39,41,37,0.07)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "1rem 1.25rem",
            borderBottom: "1px solid rgba(39,41,37,0.07)",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "#272925",
            }}
          >
            Daftar Murid
          </h3>
        </div>

        {students.length === 0 ? (
          <div
            style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}
          >
            Belum ada murid yang assigned.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8F6ED" }}>
                {["Nama", "Instrumen", "Level", "Billing"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "0.6rem 1.25rem",
                      textAlign: "left",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: "#50553C",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr
                  key={s.id}
                  style={{
                    borderTop: "1px solid rgba(39,41,37,0.05)",
                    background: i % 2 === 0 ? "#fff" : "#FAFAF8",
                  }}
                >
                  <td
                    style={{
                      padding: "0.75rem 1.25rem",
                      fontSize: "0.84rem",
                      fontWeight: 600,
                      color: "#272925",
                    }}
                  >
                    {s.full_name}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem 1.25rem",
                      fontSize: "0.84rem",
                      color: "#50553C",
                    }}
                  >
                    {s.instrument ?? "-"}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem 1.25rem",
                      fontSize: "0.84rem",
                      color: "#50553C",
                    }}
                  >
                    {s.level ?? "-"}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem 1.25rem",
                      fontSize: "0.84rem",
                      color: "#50553C",
                    }}
                  >
                    Tgl {s.billing_date ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, small }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: "1.25rem",
        boxShadow: "0 2px 10px rgba(39,41,37,0.07)",
        border: "1px solid rgba(39,41,37,0.07)",
      }}
    >
      <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{icon}</div>
      <p
        style={{
          margin: 0,
          fontSize: "0.72rem",
          color: "#94A3B8",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: "0.25rem 0 0",
          fontSize: small ? "0.9rem" : "1.8rem",
          fontWeight: 700,
          color: "#272925",
        }}
      >
        {value}
      </p>
    </div>
  );
}
