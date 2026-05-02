import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const resolvedRef = useRef(false);

  // Fetch role dari DB — dipanggil sekali per session
  const fetchRole = async (user) => {
    if (!user) { setRole(null); return; }
    const { data } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    setRole(data?.role ?? null);
  };

  const resolve = (sess) => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    setSession(sess);
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      resolve(sess);
      fetchRole(sess?.user ?? null);
    });

    const fallback = setTimeout(() => {
      console.warn("[AuthProvider] getSession timeout – treating as guest");
      resolve(null);
    }, 4000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      clearTimeout(fallback);
      resolve(sess);
      setSession(sess);
      fetchRole(sess?.user ?? null); // ← update role saat login/logout
    });

    return () => {
      clearTimeout(fallback);
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    session,
    user: session?.user ?? null,
    role, // ← expose role ke seluruh app
    signOut: () => supabase.auth.signOut(),
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F6ED" }}>
        <p style={{ color: "#94A3B8", fontSize: "14px", fontFamily: "system-ui" }}>Memuat sesi…</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}