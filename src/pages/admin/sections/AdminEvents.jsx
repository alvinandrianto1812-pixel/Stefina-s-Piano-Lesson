import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import toast from "react-hot-toast";

const EMPTY_EV = {
  title: "",
  subtitle: "",
  event_date: "",
  time_start: "",
  time_end: "",
  location: "",
  location_detail: "",
  city: "Jakarta, Indonesia",
  description: "",
  tags: "",
  highlight: false,
  is_published: true,
};

export default function AdminEvents({ onCountUpdate }) {
  const [eventsData, setEventsData] = useState([]);
  const [evLoading, setEvLoading] = useState(false);
  const [evModal, setEvModal] = useState(false);
  const [evEditing, setEvEditing] = useState(null);
  const [evForm, setEvForm] = useState(EMPTY_EV);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setEvLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false });
    if (error) console.error("events fetch error:", error);
    setEventsData(data || []);
    if (onCountUpdate) onCountUpdate(data?.length || 0);
    setEvLoading(false);
  };

  const openAddEvent = () => {
    setEvEditing(null);
    setEvForm(EMPTY_EV);
    setEvModal(true);
  };

  const openEditEvent = (ev) => {
    setEvEditing(ev);
    setEvForm({
      title: ev.title || "",
      subtitle: ev.subtitle || "",
      event_date: ev.event_date || "",
      time_start: ev.time_start || "",
      time_end: ev.time_end || "",
      location: ev.location || "",
      location_detail: ev.location_detail || "",
      city: ev.city || "Jakarta, Indonesia",
      description: ev.description || "",
      tags: (ev.tags || []).join(", "),
      highlight: ev.highlight || false,
      is_published: ev.is_published !== false,
    });
    setEvModal(true);
  };

  const saveEvent = async (e) => {
    e.preventDefault();
    const payload = {
      title: evForm.title.trim(),
      subtitle: evForm.subtitle.trim() || null,
      event_date: evForm.event_date || null,
      time_start: evForm.time_start.trim() || null,
      time_end: evForm.time_end.trim() || null,
      location: evForm.location.trim() || null,
      location_detail: evForm.location_detail.trim() || null,
      city: evForm.city.trim() || null,
      description: evForm.description.trim() || null,
      tags: evForm.tags
        ? evForm.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      highlight: evForm.highlight,
      is_published: evForm.is_published,
    };
    let error;
    if (evEditing) {
      ({ error } = await supabase
        .from("events")
        .update(payload)
        .eq("id", evEditing.id));
    } else {
      ({ error } = await supabase.from("events").insert([payload]));
    }
    if (error) {
      toast.error("Gagal simpan: " + error.message);
      return;
    }
    setEvModal(false);
    await fetchEvents();
  };

  const deleteEvent = async (ev) => {
    if (!window.confirm(`Hapus event "${ev.title}"? Tidak bisa dibatalkan.`))
      return;
    const { error } = await supabase.from("events").delete().eq("id", ev.id);
    if (error) toast.error("Gagal hapus: " + error.message);
    else await fetchEvents();
  };

  const toggleEventPublish = async (ev) => {
    const actionDesc = ev.is_published ? "sembunyikan" : "publikasikan";
    if (
      !window.confirm(
        `Apakah Anda yakin ingin ${actionDesc} event "${ev.title}"?`,
      )
    )
      return;
    setEventsData((prev) =>
      prev.map((item) =>
        item.id === ev.id ? { ...item, is_published: !ev.is_published } : item,
      ),
    );
    const { error } = await supabase
      .from("events")
      .update({ is_published: !ev.is_published })
      .eq("id", ev.id);
    if (error) {
      toast.error("Gagal memperbarui status: " + error.message);
      setEventsData((prev) =>
        prev.map((item) =>
          item.id === ev.id ? { ...item, is_published: ev.is_published } : item,
        ),
      );
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Daftar Events</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchEvents}
            className="px-3 py-1.5 rounded border bg-slate-50 hover:bg-slate-100 text-xs font-medium transition"
          >
            Refresh
          </button>
          <button
            onClick={openAddEvent}
            className="px-4 py-1.5 rounded-full bg-[#272925] text-[#F8F6ED] text-xs font-semibold hover:bg-[#50553C] transition"
          >
            + Tambah Event
          </button>
        </div>
      </div>

      {evLoading ? (
        <div className="p-12 text-center text-slate-500">Memuat events…</div>
      ) : eventsData.length === 0 ? (
        <div className="p-12 text-center text-slate-400">
          <div className="text-4xl mb-3">📅</div>
          <p>Belum ada event. Tambahkan yang pertama!</p>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table
              className="w-full text-sm text-left"
              style={{ minWidth: "580px" }}
            >
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-3 font-semibold text-slate-700">Tanggal</th>
                  <th className="p-3 font-semibold text-slate-700">Judul</th>
                  <th className="p-3 font-semibold text-slate-700">Lokasi</th>
                  <th className="p-3 font-semibold text-slate-700">Status</th>
                  <th className="p-3 font-semibold text-slate-700 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {eventsData.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50/50">
                    <td className="p-3 align-top whitespace-nowrap text-slate-600 text-xs">
                      {ev.event_date || "—"}
                    </td>
                    <td className="p-3 align-top">
                      <p className="font-semibold text-slate-800">{ev.title}</p>
                      {ev.subtitle && (
                        <p className="text-xs text-slate-400 italic">
                          {ev.subtitle}
                        </p>
                      )}
                      {(ev.tags || []).length > 0 && (
                        <div className="flex gap-1 flex-wrap mt-1">
                          {ev.tags.map((t) => (
                            <span
                              key={t}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="p-3 align-top text-xs text-slate-600">
                      {ev.location || "—"}
                      {ev.city && (
                        <span className="text-slate-400"> · {ev.city}</span>
                      )}
                    </td>
                    <td className="p-3 align-top">
                      <button
                        onClick={() => toggleEventPublish(ev)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${ev.is_published ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                      >
                        {ev.is_published ? "Published" : "Draft"}
                      </button>
                      {ev.highlight && (
                        <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-yellow-100 text-yellow-700">
                          ★ Featured
                        </span>
                      )}
                    </td>
                    <td className="p-3 align-top text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditEvent(ev)}
                          className="px-3 py-1.5 rounded text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteEvent(ev)}
                          className="px-3 py-1.5 rounded text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {evModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEvModal(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-slate-800">
                {evEditing ? "Edit Event" : "Tambah Event Baru"}
              </h3>
              <button
                onClick={() => setEvModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl leading-none"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={saveEvent}
              className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Judul *
                </label>
                <input
                  required
                  value={evForm.title}
                  onChange={(e) =>
                    setEvForm((s) => ({ ...s, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition"
                  placeholder="Nama event"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Subtitle
                </label>
                <input
                  value={evForm.subtitle}
                  onChange={(e) =>
                    setEvForm((s) => ({ ...s, subtitle: e.target.value }))
                  }
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition"
                  placeholder="An Evening of Young Pianists"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={evForm.event_date}
                  onChange={(e) =>
                    setEvForm((s) => ({ ...s, event_date: e.target.value }))
                  }
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Mulai
                  </label>
                  <input
                    value={evForm.time_start}
                    onChange={(e) =>
                      setEvForm((s) => ({ ...s, time_start: e.target.value }))
                    }
                    placeholder="7:00 PM"
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Selesai
                  </label>
                  <input
                    value={evForm.time_end}
                    onChange={(e) =>
                      setEvForm((s) => ({ ...s, time_end: e.target.value }))
                    }
                    placeholder="9:30 PM"
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Lokasi
                </label>
                <input
                  value={evForm.location}
                  onChange={(e) =>
                    setEvForm((s) => ({ ...s, location: e.target.value }))
                  }
                  placeholder="Jakarta Music Hall"
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Detail Lokasi
                </label>
                <input
                  value={evForm.location_detail}
                  onChange={(e) =>
                    setEvForm((s) => ({
                      ...s,
                      location_detail: e.target.value,
                    }))
                  }
                  placeholder="Ballroom A, 3rd Floor"
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Kota
                </label>
                <input
                  value={evForm.city}
                  onChange={(e) =>
                    setEvForm((s) => ({ ...s, city: e.target.value }))
                  }
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={3}
                  value={evForm.description}
                  onChange={(e) =>
                    setEvForm((s) => ({ ...s, description: e.target.value }))
                  }
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition resize-none"
                  placeholder="Deskripsi singkat event"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tags{" "}
                  <span className="text-slate-400 font-normal">
                    (pisahkan dengan koma)
                  </span>
                </label>
                <input
                  value={evForm.tags}
                  onChange={(e) =>
                    setEvForm((s) => ({ ...s, tags: e.target.value }))
                  }
                  placeholder="Recital, All Levels, Free Entry"
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#272925] transition"
                />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={evForm.is_published}
                    onChange={(e) =>
                      setEvForm((s) => ({
                        ...s,
                        is_published: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  Published
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={evForm.highlight}
                    onChange={(e) =>
                      setEvForm((s) => ({ ...s, highlight: e.target.checked }))
                    }
                    className="rounded"
                  />
                  ★ Featured
                </label>
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setEvModal(false)}
                  className="px-5 py-2 rounded-full border text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#272925] text-[#F8F6ED] text-sm font-semibold hover:bg-[#50553C] transition"
                >
                  {evEditing ? "Simpan Perubahan" : "Tambah Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
