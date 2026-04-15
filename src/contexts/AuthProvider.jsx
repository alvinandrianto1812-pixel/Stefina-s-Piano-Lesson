// src/contexts/AuthProvider.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const resolvedRef = useRef(false);

  const resolve = (sess) => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    setSession(sess);
    setLoading(false);
  };

  useEffect(() => {
    // Panggil getSession segera berjaga-jaga jika INITIAL_SESSION sudah lewat
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      resolve(sess);
    });

    // Timeout fallback: jika Supabase tidak merespons dalam 4 detik,
    // anggap tidak ada sesi (guest) agar app tidak stuck loading.
    const fallback = setTimeout(() => {
      console.warn("[AuthProvider] getSession timeout – treating as guest");
      resolve(null);
    }, 4000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      clearTimeout(fallback);
      resolve(sess);              // initial resolve
      setSession(sess);           // update saat login/logout berikutnya
    });

    return () => {
      clearTimeout(fallback);
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    session,
    user: session?.user ?? null,
    signOut: () => supabase.auth.signOut(),
  };

  // Tampilkan loading screen ramping — pakai teks inline agar tidak block layout
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