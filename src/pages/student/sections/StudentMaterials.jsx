// src/pages/student/sections/StudentMaterials.jsx
import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../../lib/supabaseClient";

const TYPE_CONFIG = {
  document: {
    icon: "📄",
    label: "Document",
    color: "#1e40af",
    bg: "rgba(59,130,246,0.08)",
  },
  video: {
    icon: "🎬",
    label: "Video",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.08)",
  },
  audio: {
    icon: "🎵",
    label: "Audio",
    color: "#15803d",
    bg: "rgba(22,163,74,0.08)",
  },
  link: {
    icon: "🔗",
    label: "Link",
    color: "#92400e",
    bg: "rgba(234,179,8,0.08)",
  },
  image: {
    icon: "🖼️",
    label: "Image",
    color: "#DC2626",
    bg: "rgba(220,38,38,0.08)",
  },
};

export default function StudentMaterials({ student }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [selectedTeacherId, setSelectedTeacherId] = useState("all");

  useEffect(() => {
    fetchMaterials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);

    // Step 1: ambil SEMUA teacher_id aktif
    const { data: stData, error: stError } = await supabase
      .from("student_teachers")
      .select("teacher_id")
      .eq("student_id", student.id)
      .eq("is_active", true);

    if (stError) console.error("fetch student_teachers error:", stError);

    const teacherIds = stData?.map((r) => r.teacher_id) ?? [];

    // Step 2: build query
    // Tampilkan materi yang:
    // - assigned khusus ke student ini (student_id = student.id), ATAU
    // - publik dari salah satu teacher aktif (is_public = true AND teacher_id IN [...])
    let query = supabase
      .from("learning_materials")
      .select("*, teacher:teachers(id, name, photo_url)")
      .order("created_at", { ascending: false });

    if (teacherIds.length > 0) {
      // pakai filter manual karena .or() dengan IN agak tricky di postgrest
      query = query.or(
        `student_id.eq.${student.id},and(is_public.eq.true,teacher_id.in.(${teacherIds.join(",")}))`,
      );
    } else {
      query = query.eq("student_id", student.id);
    }

    const { data, error } = await query;
    if (error) console.error("fetch materials error:", error);
    setMaterials(data || []);
    setLoading(false);
  };

  // Extract unique teachers dari materials
  const teachers = useMemo(() => {
    const map = new Map();
    materials.forEach((m) => {
      if (m.teacher?.id) map.set(m.teacher.id, m.teacher);
    });
    return Array.from(map.values());
  }, [materials]);

  // Filter by guru dulu, baru by type
  const filtered = useMemo(() => {
    let result = materials;
    if (selectedTeacherId !== "all")
      result = result.filter((m) => m.teacher?.id === selectedTeacherId);
    if (filterType !== "all")
      result = result.filter((m) => m.material_type === filterType);
    return result;
  }, [materials, selectedTeacherId, filterType]);

  // Count per type (dari filtered by guru, sebelum filter type)
  const typeCounts = useMemo(() => {
    const base =
      selectedTeacherId === "all"
        ? materials
        : materials.filter((m) => m.teacher?.id === selectedTeacherId);
    return base.reduce((acc, m) => {
      acc[m.material_type] = (acc[m.material_type] || 0) + 1;
      return acc;
    }, {});
  }, [materials, selectedTeacherId]);

  const handleOpen = (material) => {
    const url = material.file_url || material.external_url;
    if (url) window.open(url, "_blank", "noopener noreferrer");
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
          Materi Belajar
        </p>
        <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748B" }}>
          Materi yang diberikan teacher untukmu. Klik untuk membuka atau
          mengunduh.
        </p>
      </div>

      {/* Filter guru — muncul kalau 2+ guru */}
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
            Guru:
          </span>
          {[{ id: "all", name: "Semua" }, ...teachers].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTeacherId(t.id);
                setFilterType("all");
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

      {/* Filter type */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button
          onClick={() => setFilterType("all")}
          style={{
            padding: "0.4rem 1rem",
            borderRadius: "999px",
            fontSize: "0.75rem",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            background: filterType === "all" ? "#272925" : "#F1F5F9",
            color: filterType === "all" ? "#F8F6ED" : "#64748B",
            transition: "all 0.2s",
          }}
        >
          Semua (
          {selectedTeacherId === "all"
            ? materials.length
            : materials.filter((m) => m.teacher?.id === selectedTeacherId)
                .length}
          )
        </button>
        {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
          const count = typeCounts[key] || 0;
          if (count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setFilterType(key)}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                background: filterType === key ? cfg.color : "#F1F5F9",
                color: filterType === key ? "#fff" : "#64748B",
                transition: "all 0.2s",
              }}
            >
              {cfg.icon} {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Materials grid */}
      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "#94A3B8" }}>
          Memuat materi…
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            padding: "3rem",
            textAlign: "center",
            background: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(39,41,37,0.07)",
          }}
        >
          <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📚</p>
          <p style={{ color: "#94A3B8", margin: 0 }}>
            {materials.length === 0
              ? "Belum ada materi dari teacher."
              : "Tidak ada materi dengan filter ini."}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {filtered.map((material) => {
            const cfg =
              TYPE_CONFIG[material.material_type] || TYPE_CONFIG.document;
            const hasLink = material.file_url || material.external_url;

            return (
              <div
                key={material.id}
                onClick={() => hasLink && handleOpen(material)}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: "1.25rem",
                  border: "1px solid rgba(39,41,37,0.07)",
                  boxShadow: "0 2px 8px rgba(39,41,37,0.05)",
                  cursor: hasLink ? "pointer" : "default",
                  transition: "all 0.2s",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  if (hasLink) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(39,41,37,0.12)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(39,41,37,0.05)";
                }}
              >
                {material.is_public && (
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      padding: "2px 8px",
                      borderRadius: "999px",
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      background: "rgba(80,85,60,0.08)",
                      color: "#50553C",
                    }}
                  >
                    Semua Murid
                  </span>
                )}

                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: cfg.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    marginBottom: "0.85rem",
                  }}
                >
                  {cfg.icon}
                </div>

                <p
                  style={{
                    margin: "0 0 0.35rem",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "#272925",
                    lineHeight: 1.3,
                  }}
                >
                  {material.title}
                </p>
                {material.description && (
                  <p
                    style={{
                      margin: "0 0 0.75rem",
                      fontSize: "0.8rem",
                      color: "#64748B",
                      lineHeight: 1.6,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {material.description}
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "0.75rem",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid #F1F5F9",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    {material.teacher?.photo_url ? (
                      <img
                        src={material.teacher.photo_url}
                        alt={material.teacher.name}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "#272925",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.6rem",
                        }}
                      >
                        👩‍🏫
                      </div>
                    )}
                    <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
                      {material.teacher?.name}
                    </span>
                  </div>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "999px",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      background: cfg.bg,
                      color: cfg.color,
                    }}
                  >
                    {cfg.label}
                  </span>
                </div>

                {hasLink && (
                  <div
                    style={{
                      marginTop: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      color: "#50553C",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    <span>Buka materi</span>
                    <span>↗</span>
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
