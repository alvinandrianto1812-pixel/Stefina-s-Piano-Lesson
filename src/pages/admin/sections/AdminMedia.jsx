import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import toast from "react-hot-toast";

const BUCKET = "media-gallery";

export default function AdminMedia() {
  const [mediaItems, setMediaItems] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: "", type: "photo" });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadThumb, setUploadThumb] = useState(null);
  const fileRef = useRef(null);
  const thumbRef = useRef(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setMediaLoading(true);
    const { data, error } = await supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("media fetch error:", error);
    setMediaItems(data || []);
    setMediaLoading(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return toast.error("Pilih file terlebih dahulu.");
    if (!uploadForm.title.trim())
      return toast.error("Judul tidak boleh kosong.");

    setUploading(true);
    try {
      const ext = uploadFile.name.split(".").pop();
      const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, uploadFile, {
          contentType: uploadFile.type,
          upsert: false,
        });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const fileUrl = pub.publicUrl;

      let thumbUrl = null;
      if (uploadThumb) {
        const thumbExt = uploadThumb.name.split(".").pop();
        const thumbPath = `thumbs/${Date.now()}.${thumbExt}`;
        const { error: tErr } = await supabase.storage
          .from(BUCKET)
          .upload(thumbPath, uploadThumb, { contentType: uploadThumb.type });
        if (!tErr) {
          const { data: tPub } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(thumbPath);
          thumbUrl = tPub.publicUrl;
        }
      }

      const { error: insErr } = await supabase.from("media").insert([
        {
          title: uploadForm.title.trim(),
          type: uploadForm.type,
          url: fileUrl,
          thumbnail_url: thumbUrl,
          is_published: true,
        },
      ]);
      if (insErr) throw insErr;

      setUploadForm({ title: "", type: "photo" });
      setUploadFile(null);
      setUploadThumb(null);
      if (fileRef.current) fileRef.current.value = "";
      if (thumbRef.current) thumbRef.current.value = "";
      await fetchMedia();
      toast.success("Media berhasil diupload!");
    } catch (err) {
      console.error(err);
      toast.error("Upload gagal: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const togglePublish = async (item) => {
    const actionDesc = item.is_published ? "sembunyikan" : "publikasikan";
    if (
      !window.confirm(
        `Apakah Anda yakin ingin ${actionDesc} media "${item.title}"?`,
      )
    )
      return;

    // Optimistic update
    setMediaItems((prev) =>
      prev.map((m) =>
        m.id === item.id ? { ...m, is_published: !item.is_published } : m,
      ),
    );

    const { error } = await supabase
      .from("media")
      .update({ is_published: !item.is_published })
      .eq("id", item.id);

    if (error) {
      toast.error("Gagal memperbarui status: " + error.message);
      setMediaItems((prev) =>
        prev.map((m) =>
          m.id === item.id ? { ...m, is_published: item.is_published } : m,
        ),
      );
    }
  };

  const deleteMedia = async (item) => {
    if (
      !window.confirm(
        `Hapus media "${item.title || "ini"}"? Tindakan ini tidak bisa dibatalkan.`,
      )
    )
      return;
    try {
      const urlParts = item.url.split(`/${BUCKET}/`);
      if (urlParts.length > 1) {
        await supabase.storage.from(BUCKET).remove([urlParts[1]]);
      }
      if (item.thumbnail_url) {
        const tParts = item.thumbnail_url.split(`/${BUCKET}/`);
        if (tParts.length > 1)
          await supabase.storage.from(BUCKET).remove([tParts[1]]);
      }
      const { error } = await supabase.from("media").delete().eq("id", item.id);
      if (error) throw error;
      await fetchMedia();
      toast.success("Media berhasil dihapus.");
    } catch (err) {
      toast.error("Gagal hapus: " + err.message);
    }
  };

  return (
    <section className="space-y-6">
      {/* Upload Form */}
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Upload Media Baru
        </h2>
        <form onSubmit={handleUpload} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Judul *
            </label>
            <input
              type="text"
              placeholder="Contoh: Recital 2024"
              value={uploadForm.title}
              onChange={(e) =>
                setUploadForm((s) => ({ ...s, title: e.target.value }))
              }
              required
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tipe
            </label>
            <select
              value={uploadForm.type}
              onChange={(e) =>
                setUploadForm((s) => ({ ...s, type: e.target.value }))
              }
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition bg-white"
            >
              <option value="photo">📷 Foto</option>
              <option value="video">🎥 Video</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              File{" "}
              {uploadForm.type === "photo"
                ? "Foto (JPG/PNG/WEBP)"
                : "Video (MP4/MOV/WEBM)"}{" "}
              *
            </label>
            <input
              ref={fileRef}
              type="file"
              accept={uploadForm.type === "photo" ? "image/*" : "video/*"}
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              required
              className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-[#272925] file:text-[#F8F6ED] hover:file:bg-[#50553C] cursor-pointer"
            />
          </div>

          {uploadForm.type === "video" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Thumbnail Video (opsional, JPG/PNG)
              </label>
              <input
                ref={thumbRef}
                type="file"
                accept="image/*"
                onChange={(e) => setUploadThumb(e.target.files?.[0] || null)}
                className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
              />
            </div>
          )}

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2.5 rounded-full text-sm font-semibold bg-[#272925] text-[#F8F6ED] hover:bg-[#50553C] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploading ? "Mengupload…" : "Upload Media"}
            </button>
          </div>
        </form>
      </div>

      {/* Media Grid */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-slate-800">
            Semua Media
            <span className="ml-2 text-sm font-normal text-slate-500">
              ({mediaItems.length} item)
            </span>
          </h2>
          <button
            onClick={fetchMedia}
            className="px-3 py-1.5 rounded border bg-slate-50 hover:bg-slate-100 text-xs font-medium transition"
          >
            Refresh
          </button>
        </div>

        {mediaLoading ? (
          <div className="p-12 text-center text-slate-500">Memuat media…</div>
        ) : mediaItems.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <div className="text-4xl mb-3">🖼️</div>
            <p>Belum ada media. Upload yang pertama!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
            {mediaItems.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl overflow-hidden border border-slate-200"
                style={{ aspectRatio: "4/3" }}
              >
                {item.type === "photo" ? (
                  <img
                    src={item.url}
                    alt={item.title || ""}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full relative flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #272925, #50553C)",
                    }}
                  >
                    {item.thumbnail_url ? (
                      <img
                        src={item.thumbnail_url}
                        alt=""
                        className="w-full h-full object-cover opacity-70"
                      />
                    ) : (
                      <span className="text-4xl">🎥</span>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          fill="#272925"
                          className="w-4 h-4 ml-0.5"
                        >
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex justify-end">
                    <button
                      onClick={() => deleteMedia(item)}
                      className="w-7 h-7 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 transition"
                      title="Hapus"
                    >
                      ✕
                    </button>
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium truncate">
                      {item.title || "—"}
                    </p>
                    <button
                      onClick={() => togglePublish(item)}
                      className={`mt-1.5 w-full py-1 rounded text-xs font-medium transition ${
                        item.is_published
                          ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-500"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {item.is_published ? "Sembunyikan" : "Publikasikan"}
                    </button>
                  </div>
                </div>

                {/* Published badge */}
                <div
                  className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    item.is_published
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {item.is_published ? "Publik" : "Draft"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
