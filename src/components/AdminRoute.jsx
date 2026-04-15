// src/components/AdminRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthProvider";

export default function AdminRoute({ children }) {
  const { user } = useAuth(); // AuthProvider handle loading secara global
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let active = true;

    const checkRole = async () => {
      if (!user) {
        if (active) {
          setAllowed(false);
          setLoading(false);
        }
        return;
      }

      let role = null;
      // Cek role lewat email (utama)
      if (user.email) {
        const { data: row } = await supabase
          .from("users")
          .select("role")
          .eq("email", user.email)
          .maybeSingle();
        role = row?.role ?? null;
      }
      // Fallback lewat id
      if (!role) {
        const { data: row } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        role = row?.role ?? null;
      }

      if (!active) return;
      setAllowed(role === "admin");
      setLoading(false);
    };

    checkRole();

    return () => {
      active = false;
    };
  }, [user]);

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#94A3B8", fontSize: "14px", fontFamily: "system-ui" }}>Memverifikasi akses…</p>
      </div>
    );
  }

  if (!allowed) return <Navigate to="/" replace />;
  return children;
}
