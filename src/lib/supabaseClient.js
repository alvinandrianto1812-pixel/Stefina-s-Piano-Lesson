// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Awal dari trik kita: Buat custom storage adapter
// In-memory fallback untuk browser yang memblokir storage (misal: Firefox strict mode / private tab)
const memoryStorage = {};

const customStorageAdapter = {
  getItem: (key) => {
    if (typeof window === "undefined") return null;
    let remember = false;
    try {
      remember = window.localStorage.getItem("rememberMe") === "true";
    } catch (e) {
      // Ignored: Storage blocked
    }

    try {
      const primary = remember ? window.localStorage : window.sessionStorage;
      const secondary = remember ? window.sessionStorage : window.localStorage;

      // Coba baca dari storage utama
      let value = null;
      try { value = primary.getItem(key); } catch (e) {}
      if (value !== null) return value;

      // Cek migrasi dari storage sekunder
      let migrated = null;
      try { migrated = secondary.getItem(key); } catch (e) {}
      if (migrated !== null) {
        try { primary.setItem(key, migrated); } catch (e) {}
        try { secondary.removeItem(key); } catch (e) {}
      }
      return migrated;
    } catch (err) {
      return memoryStorage[key] || null;
    }
  },
  setItem: (key, value) => {
    if (typeof window === "undefined") return;
    try {
      const remember = window.localStorage.getItem("rememberMe") === "true";
      const storage = remember ? window.localStorage : window.sessionStorage;
      storage.setItem(key, value);
    } catch (e) {
      memoryStorage[key] = value;
    }
  },
  removeItem: (key) => {
    if (typeof window === "undefined") return;
    try { window.localStorage.removeItem(key); } catch (e) {}
    try { window.sessionStorage.removeItem(key); } catch (e) {}
    delete memoryStorage[key];
  },
};

// Gunakan adapter kita di dalam createClient
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // persistSession sekarang dikontrol oleh adapter kita
    storage: customStorageAdapter,
    autoRefreshToken: true, // Sebaiknya true untuk sesi yang lebih lama
    detectSessionInUrl: true,
  },
});
