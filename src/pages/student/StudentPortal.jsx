import { useAuth } from "../../contexts/AuthProvider";

export default function StudentPortal() {
  const { user } = useAuth();
  return (
    <div style={{ minHeight: "100vh", padding: "2rem" }}>
      <h1>Student Portal</h1>
      <p>Welcome, {user?.email}</p>
      <p style={{ color: "#94A3B8" }}>🚧 Portal student sedang dibangun — Fase 5</p>
    </div>
  );
}