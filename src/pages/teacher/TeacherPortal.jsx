import { useAuth } from "../../contexts/AuthProvider";

export default function TeacherPortal() {
  const { user } = useAuth();
  return (
    <div style={{ minHeight: "100vh", padding: "2rem" }}>
      <h1>Teacher Portal</h1>
      <p>Welcome, {user?.email}</p>
      <p style={{ color: "#94A3B8" }}>🚧 Portal teacher sedang dibangun — Fase 6</p>
    </div>
  );
}