// src/pages/student/sections/StudentNotes.jsx
import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function StudentNotes({ student }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [activeTab, setActiveTab] = useState("teacher");
  const [selectedTeacherId, setSelectedTeacherId] = useState("all");

  useEffect(() => {
    fetchNotes();
    setExpanded(null);
    setSelectedTeacherId("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchNotes = async () => {
    setLoading(true);

    if (activeTab === "teacher") {
      const { data, error } = await supabase
        .from("teacher_notes")
        .select("*, teacher:teachers(id, name, photo_url)")
        .eq("student_id", student.id)
        .eq("is_private", false)
        .order("created_at", { ascending: false });

      if (error) console.error("fetch teacher notes error:", error);
      setNotes(data || []);
    } else {
      const { data, error } = await supabase
        .from("lesson_notes")
        .select("*, teacher:teachers(id, name, photo_url)")
        .eq("student_id", student.id)
        .order("lesson_date", { ascending: false });

      if (error) console.error("fetch lesson notes error:", error);
      setNotes(data || []);
    }

    setLoading(false);
  };

  // Extract unique teachers dari notes yang ada
  const teachers = useMemo(() => {
    const map = new Map();
    notes.forEach((n) => {
      if (n.teacher?.id) map.set(n.teacher.id, n.teacher);
    });
    return Array.from(map.values());
  }, [notes]);

  // Filter notes by selected teacher
  const filteredNotes = useMemo(() => {
    if (selectedTeacherId === "all") return notes;
    return notes.filter((n) => n.teacher?.id === selectedTeacherId);
  }, [notes, selectedTeacherId]);

  const MOOD_CONFIG = {
    great: { label: "Great! 🔥", color: "#15803d", bg: "rgba(22,163,74,0.08)" },
    good: { label: "Good 😊", color: "#1e40af", bg: "rgba(59,130,246,0.08)" },
    neutral: {
      label: "Neutral 😐",
      color: "#92400e",
      bg: "rgba(234,179,8,0.08)",
    },
    struggling: {
      label: "Struggling 💪",
      color: "#DC2626",
      bg: "rgba(220,38,38,0.08)",
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "1.25rem 1.5rem",
          border: "1px solid rgba(39,41,37,0.07)",
          boxShadow: "0 2px 8px rgba(39,41,37,0.05)",
        }}
      >
        <p
          style={{
            margin: "0 0 0.25rem",
            fontSize: "0.65rem",
            fontWeight: 800,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#94A3B8",
          }}
        >
          Catatan dari Teacher
        </p>
        <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748B" }}>
          Baca catatan perkembangan dan rekap sesi belajar kamu. Catatan
          bersifat read-only.
        </p>
      </div>

      {/* Tab switcher */}
      <div
        style={{
          display: "flex",
          background: "#fff",
          borderRadius: 12,
          padding: "0.25rem",
          gap: "0.15rem",
          border: "1px solid rgba(39,41,37,0.07)",
          boxShadow: "0 2px 8px rgba(39,41,37,0.05)",
        }}
      >
        {[
          { key: "teacher", label: "📌 General Notes" },
          { key: "lesson", label: "📖 Lesson Notes" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setActiveTab(t.key);
              setExpanded(null);
            }}
            style={{
              flex: 1,
              padding: "0.5rem 1rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              borderRadius: 9,
              fontFamily: "inherit",
              background:
                activeTab === t.key
                  ? "linear-gradient(135deg, #272925, #50553C)"
                  : "transparent",
              color: activeTab === t.key ? "#F8F6ED" : "#94A3B8",
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filter guru — muncul kalau ada 2+ guru */}
      {!loading && teachers.length > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#94A3B8",
            }}
          >
            Filter:
          </span>
          {[{ id: "all", name: "Semua Guru" }, ...teachers].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTeacherId(t.id);
                setExpanded(null);
              }}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: "999px",
                border: "2px solid",
                borderColor: selectedTeacherId === t.id ? "#50553C" : "#E2E8F0",
                background: selectedTeacherId === t.id ? "#50553C" : "#fff",
                color: selectedTeacherId === t.id ? "#F8F6ED" : "#64748B",
                fontWeight: 700,
                fontSize: "0.78rem",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "#94A3B8" }}>
          Memuat catatan…
        </div>
      ) : filteredNotes.length === 0 ? (
        <div
          style={{
            padding: "3rem",
            textAlign: "center",
            background: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(39,41,37,0.07)",
          }}
        >
          <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📝</p>
          <p style={{ color: "#94A3B8", margin: 0 }}>
            Belum ada{" "}
            {activeTab === "teacher" ? "catatan umum" : "catatan sesi"} dari
            teacher.
          </p>
        </div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {filteredNotes.map((note) => {
            const isExpanded = expanded === note.id;

            return (
              <div
                key={note.id}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: "1px solid rgba(39,41,37,0.07)",
                  boxShadow: "0 2px 8px rgba(39,41,37,0.05)",
                  overflow: "hidden",
                  transition: "box-shadow 0.2s",
                }}
              >
                {/* Note header */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : note.id)}
                  style={{
                    width: "100%",
                    padding: "1.1rem 1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {/* Teacher avatar */}
                    {note.teacher?.photo_url ? (
                      <img
                        src={note.teacher.photo_url}
                        alt={note.teacher.name}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          objectFit: "cover",
                          flexShrink: 0,
                          border: "2px solid #E2E8F0",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #272925, #50553C)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.9rem",
                          flexShrink: 0,
                        }}
                      >
                        👩‍🏫
                      </div>
                    )}

                    <div style={{ minWidth: 0 }}>
                      {activeTab === "teacher" ? (
                        <p
                          style={{
                            margin: 0,
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            color: "#272925",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {note.title || "Catatan dari Teacher"}
                        </p>
                      ) : (
                        <p
                          style={{
                            margin: 0,
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            color: "#272925",
                          }}
                        >
                          {new Date(
                            note.lesson_date + "T00:00:00",
                          ).toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      )}
                      <p
                        style={{
                          margin: "0.1rem 0 0",
                          fontSize: "0.72rem",
                          color: "#94A3B8",
                        }}
                      >
                        {note.teacher?.name || "Teacher"}
                        {activeTab === "lesson" &&
                          note.duration_minutes &&
                          ` · ${note.duration_minutes} menit`}
                        {activeTab === "lesson" &&
                          note.instrument &&
                          ` · ${note.instrument}`}
                      </p>
                    </div>
                  </div>

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      width: 14,
                      height: 14,
                      color: "#94A3B8",
                      transition: "transform 0.2s",
                      transform: isExpanded ? "rotate(180deg)" : "",
                      flexShrink: 0,
                    }}
                  >
                    <polyline points="6,9 12,15 18,9" />
                  </svg>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div
                    style={{
                      padding: "0 1.25rem 1.25rem",
                      borderTop: "1px solid #F1F5F9",
                    }}
                  >
                    {activeTab === "teacher" ? (
                      <p
                        style={{
                          margin: "1rem 0 0",
                          fontSize: "0.9rem",
                          color: "#475569",
                          lineHeight: 1.8,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {note.content}
                      </p>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.75rem",
                          marginTop: "1rem",
                        }}
                      >
                        {note.material_covered && (
                          <div
                            style={{
                              padding: "0.75rem 1rem",
                              borderRadius: 10,
                              background: "#F8FAFC",
                              border: "1px solid #E2E8F0",
                            }}
                          >
                            <p
                              style={{
                                margin: "0 0 0.35rem",
                                fontSize: "0.65rem",
                                fontWeight: 800,
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                color: "#94A3B8",
                              }}
                            >
                              Materi
                            </p>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "0.88rem",
                                color: "#272925",
                                lineHeight: 1.7,
                              }}
                            >
                              {note.material_covered}
                            </p>
                          </div>
                        )}
                        {note.homework && (
                          <div
                            style={{
                              padding: "0.75rem 1rem",
                              borderRadius: 10,
                              background: "rgba(234,179,8,0.05)",
                              border: "1px solid rgba(234,179,8,0.2)",
                            }}
                          >
                            <p
                              style={{
                                margin: "0 0 0.35rem",
                                fontSize: "0.65rem",
                                fontWeight: 800,
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                color: "#92400e",
                              }}
                            >
                              📌 PR / Latihan
                            </p>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "0.88rem",
                                color: "#272925",
                                lineHeight: 1.7,
                              }}
                            >
                              {note.homework}
                            </p>
                          </div>
                        )}
                        {note.notes && (
                          <div
                            style={{
                              padding: "0.75rem 1rem",
                              borderRadius: 10,
                              background: "#F8FAFC",
                              border: "1px solid #E2E8F0",
                            }}
                          >
                            <p
                              style={{
                                margin: "0 0 0.35rem",
                                fontSize: "0.65rem",
                                fontWeight: 800,
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                color: "#94A3B8",
                              }}
                            >
                              Catatan Tambahan
                            </p>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "0.88rem",
                                color: "#272925",
                                lineHeight: 1.7,
                              }}
                            >
                              {note.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    <p
                      style={{
                        margin: "0.75rem 0 0",
                        fontSize: "0.7rem",
                        color: "#CBD5E1",
                      }}
                    >
                      {new Date(note.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
