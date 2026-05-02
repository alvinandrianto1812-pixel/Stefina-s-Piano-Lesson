// AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

export default function AdminRoute({ children }) {
  const { role } = useAuth();
  if (role === null) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#94A3B8", fontSize: "14px" }}>Memverifikasi akses…</p>
    </div>
  );
  if (role !== "admin" && role !== "owner") return <Navigate to="/" replace />;
  return children;
}