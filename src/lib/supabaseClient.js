// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Awal dari trik kita: Buat custom storage adapter
const customStorageAdapter = {
  getItem: (key) => {
    // Cek apakah 'rememberMe' di localStorage diset ke 'true'
    // Jika ya, gunakan localStorage. Jika tidak, gunakan sessionStorage.
    const remember = window.localStorage.getItem("rememberMe") === "true";
    const primary   = remember ? window.localStorage : window.sessionStorage;
    const secondary = remember ? window.sessionStorage : window.localStorage;

    // Coba baca dari storage yang sesuai preferensi saat ini
    const value = primary.getItem(key);
    if (value !== null) return value;

    // Jika tidak ada, cek storage lama (migrasi saat preferensi berubah)
    const migrated = secondary.getItem(key);
    if (migrated !== null) {
      // Pindahkan token ke storage yang sekarang aktif, hapus dari yang lama
      primary.setItem(key, migrated);
      secondary.removeItem(key);
    }
    return migrated;
  },
  setItem: (key, value) => {
    // Logika yang sama saat menyimpan item
    const remember = window.localStorage.getItem("rememberMe") === "true";
    const storage = remember ? window.localStorage : window.sessionStorage;
    storage.setItem(key, value);
  },
  removeItem: (key) => {
    // Hapus dari kedua storage untuk memastikan logout bersih
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
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
