import { useAuth } from "../../contexts/AuthProvider";

export default function PendingApproval() {
  const { signOut } = useAuth();
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "#F8F6ED",
      }}
    >
      <h2 style={{ marginBottom: "1rem" }}>Pendaftaran Sedang Diproses</h2>
      <p style={{ color: "#64748B", textAlign: "center", maxWidth: "400px" }}>
        Terima kasih telah mendaftar! Admin kami sedang memverifikasi data kamu.
        Kamu akan mendapat notifikasi setelah akun diaktifkan.
      </p>
      <button
        onClick={signOut}
        style={{
          marginTop: "2rem",
          padding: "0.5rem 1.5rem",
          background: "#94A3B8",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}