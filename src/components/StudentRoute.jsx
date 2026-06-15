// src/components/StudentRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

export default function StudentRoute({ children }) {
  const { user, role, loading, roleLoading } = useAuth();

  if (loading || roleLoading)
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#94A3B8", fontSize: "14px" }}>
          Memverifikasi akses…
        </p>
      </div>
    );

  if (!user) return <Navigate to="/auth" replace />;

  // 'user' role = belum approved, redirect ke halaman waiting
  if (role === "user") {
    return <Navigate to="/pending-approval" replace />;
  }

  if (role !== "student" && role !== "admin" && role !== "owner") {
    return <Navigate to="/" replace />;
  }

  return children;
}