/**
 * scripts/seed-teacher-photos.mjs
 * Upload foto dari public/teachers/ ke Supabase Storage
 * lalu update kolom photo_url di tabel teachers.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { join, extname, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

// Baca .env.local langsung dari file (bypass IDE env injector)
function loadEnvFile(filePath) {
  const env = {};
  try {
    const content = readFileSync(filePath, "utf-8");
    for (const rawLine of content.split("\n")) {
      const trimmed = rawLine.replace(/\r/g, "").trim(); // strip CRLF
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      env[key] = val;
    }
  } catch (e) {
    console.error("Gagal baca .env.local:", e.message);
  }
  return env;
}

const ENV = loadEnvFile(join(rootDir, ".env.local"));
const SUPABASE_URL = ENV["VITE_SUPABASE_URL"];
const SERVICE_ROLE_KEY = ENV["SUPABASE_SERVICE_ROLE_KEY"];

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || SERVICE_ROLE_KEY === "ISI_DENGAN_SERVICE_ROLE_KEY_ANDA_DISINI") {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY belum diisi di .env.local");
  console.error("   Nilai saat ini:", SERVICE_ROLE_KEY);
  process.exit(1);
}

console.log("✅ Key ditemukan, URL:", SUPABASE_URL);

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const BUCKET = "media-gallery";
const FOLDER = "teachers";
const TEACHERS_DIR = join(rootDir, "public", "teachers");

const MIME_MAP = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

// Pemetaan filename → pencocokan nama teacher di DB
// Key = substring dari nama file (huruf kecil), Value = pencocokan nama (ILIKE)
const FILE_TO_TEACHER = {
  "angelique":      "Angelique%",
  "genessa":        "Genessa%",
  "jennifer":       "Jennifer%",
  "stefina":        "Stefina%",
  "victory":        "Victor%",   // Victoria Kezia (filename: VictoryKezia)
  "vivian":         "Vivian%",
};

function matchTeacher(filename) {
  const lower = filename.toLowerCase();
  for (const [key, pattern] of Object.entries(FILE_TO_TEACHER)) {
    if (lower.includes(key)) return pattern;
  }
  return null;
}

async function run() {
  console.log("🚀 Memulai upload & update photo_url teachers...\n");

  const files = readdirSync(TEACHERS_DIR).filter(
    (f) => Object.keys(MIME_MAP).includes(extname(f).toLowerCase())
  );

  if (files.length === 0) {
    console.log("⚠️  Tidak ada file gambar ditemukan di public/teachers/");
    return;
  }

  console.log(`📁 Ditemukan ${files.length} file: ${files.join(", ")}\n`);

  let ok = 0, fail = 0;

  for (const filename of files) {
    const filePath = join(TEACHERS_DIR, filename);
    const ext = extname(filename).toLowerCase();
    const storagePath = `${FOLDER}/${filename}`;
    const contentType = MIME_MAP[ext];
    const pattern = matchTeacher(filename);

    process.stdout.write(`📤 ${filename} ...`);

    // 1. Upload ke Storage (upsert=true → timpa kalau sudah ada)
    const fileBuffer = readFileSync(filePath);
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, fileBuffer, { contentType, upsert: true });

    if (upErr) {
      console.log(` ❌ Upload gagal: ${upErr.message}`);
      fail++;
      continue;
    }

    // 2. Ambil public URL
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    const photoUrl = pub.publicUrl;

    // 3. Update tabel teachers
    if (!pattern) {
      console.log(` ⚠️  URL didapat tapi tidak tahu teacher mana (${photoUrl})`);
      ok++;
      continue;
    }

    const { error: dbErr, count } = await supabase
      .from("teachers")
      .update({ photo_url: photoUrl })
      .ilike("name", pattern);

    if (dbErr) {
      console.log(` ❌ DB update gagal: ${dbErr.message}`);
      fail++;
    } else {
      console.log(` ✅  → ${photoUrl}`);
      ok++;
    }
  }

  console.log("\n══════════════════════════════════════");
  console.log(`✅ Berhasil : ${ok} file`);
  console.log(`❌ Gagal    : ${fail} file`);
  console.log("══════════════════════════════════════");
  if (ok > 0) {
    console.log("\n🎉 Selesai! Cek di:");
    console.log("   Storage : https://supabase.com/dashboard/project/grgkfcgvzawoyyztagbz/storage/files/buckets/media-gallery");
    console.log("   Table   : https://supabase.com/dashboard/project/grgkfcgvzawoyyztagbz/editor");
  }
}

run();
