// src/pages/user/Media.jsx
import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import Footer from "../../components/Footer";

// ─── LIGHTBOX COMPONENT ───────────────────────────────────────────────────────
function Lightbox({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        background: "rgba(15,17,16,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "20px",
          right: "24px",
          background: "rgba(248,246,237,0.12)",
          border: "1px solid rgba(248,246,237,0.2)",
          color: "#F8F6ED",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          fontSize: "18px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(248,246,237,0.22)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(248,246,237,0.12)")
        }
      >
        ✕
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "90vw",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {item.type === "photo" ? (
          <img
            src={item.url}
            alt={item.title || ""}
            style={{
              maxWidth: "90vw",
              maxHeight: "80vh",
              objectFit: "contain",
              borderRadius: "12px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            }}
          />
        ) : (
          <video
            src={item.url}
            controls
            autoPlay
            style={{
              maxWidth: "90vw",
              maxHeight: "80vh",
              borderRadius: "12px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            }}
          />
        )}
        {item.title && (
          <p
            style={{
              color: "rgba(248,246,237,0.75)",
              fontSize: "14px",
              textAlign: "center",
              margin: 0,
            }}
          >
            {item.title}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── MEDIA CARD ───────────────────────────────────────────────────────────────
function MediaCard({ item, onClick }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => onClick(item)}
      style={{
        borderRadius: "14px",
        overflow: "hidden",
        background: "#FFFFFF",
        border: "1px solid #E8E0CC",
        boxShadow: "0 2px 12px rgba(39,41,37,0.07)",
        cursor: "pointer",
        transition: "transform 0.25s, box-shadow 0.25s",
        aspectRatio: "4/3",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(39,41,37,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(39,41,37,0.07)";
      }}
    >
      {item.type === "photo" ? (
        !imgError ? (
          <img
            src={item.url}
            alt={item.title || ""}
            onError={() => setImgError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#F0EDE4",
              color: "#94A3B8",
              fontSize: "13px",
            }}
          >
            Image unavailable
          </div>
        )
      ) : (
        /* Video thumbnail */
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            background: "#1a1b1a",
          }}
        >
          {item.thumbnail_url ? (
            <img
              src={item.thumbnail_url}
              alt={item.title || ""}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                opacity: 0.8,
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, #272925, #50553C)",
              }}
            />
          )}
          {/* Play button overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "rgba(248,246,237,0.92)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="#272925"
                style={{ width: "22px", height: "22px", marginLeft: "3px" }}
              >
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Overlay on hover showing title */}
      {item.title && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "28px 12px 12px",
            background:
              "linear-gradient(to top, rgba(15,17,16,0.7), transparent)",
            opacity: 0,
            transition: "opacity 0.2s",
          }}
          className="card-overlay"
        >
          <p
            style={{
              color: "#F8F6ED",
              fontSize: "12px",
              fontWeight: "600",
              margin: 0,
            }}
          >
            {item.title}
          </p>
        </div>
      )}

      {/* Type badge */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          padding: "3px 8px",
          borderRadius: "999px",
          fontSize: "10px",
          fontWeight: "700",
          letterSpacing: "0.08em",
          background: "rgba(39,41,37,0.75)",
          color: "#F8F6ED",
          backdropFilter: "blur(6px)",
          textTransform: "uppercase",
        }}
      >
        {item.type === "photo" ? "📷" : "🎥"}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Media() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all" | "photo" | "video"
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("media")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) console.error("media fetch error:", error);
    setItems(data || []);
    setLoading(false);
  };

  const filtered = items.filter((item) =>
    filter === "all" ? true : item.type === filter,
  );

  const photoCount = items.filter((i) => i.type === "photo").length;
  const videoCount = items.filter((i) => i.type === "video").length;

  const handleClose = useCallback(() => setSelected(null), []);

  return (
    <div
      className="-mt-[6.5rem] md:-mt-28 lg:-mt-[7.5rem]"
      style={{
        fontFamily:
          '"Creato Display", system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
        background: "#F8F6ED",
        color: "#272925",
      }}
    >
      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: "#0F1110",
          minHeight: "420px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(125deg, rgba(39,41,37,0) 0%, rgba(48,51,41,0.9) 45%, rgba(48,51,41,0.6) 100%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 60% at 85% 15%, rgba(209,167,153,0.14) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 55% 40% at 30% 100%, rgba(80,85,60,0.3) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 40% 40% at 0% 100%, rgba(8,9,8,0.55) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="max-w-7xl mx-auto px-6"
          style={{
            paddingTop: "160px",
            paddingBottom: "64px",
            position: "relative",
            zIndex: 10,
          }}
        >
          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 56px)",
              fontWeight: "700",
              lineHeight: 1.15,
              color: "#F8F6ED",
              margin: 0,
            }}
          >
            Our <br />
            <span style={{ color: "#F8F6ED", opacity: 0.9 }}>Gallery</span>
          </h1>
          <p
            style={{
              marginTop: "20px",
              fontSize: "17px",
              maxWidth: "520px",
              lineHeight: 1.65,
              color: "rgba(248,246,237,0.72)",
            }}
          >
            Photos and videos from our classes, events, and memorable musical
            moments.
          </p>

          {/* Stats */}
          <div
            style={{
              marginTop: "30px",
              display: "flex",
              flexWrap: "wrap",
              gap: "32px",
            }}
          >
            {[
              { num: items.length, label: "Total Media" },
              { num: photoCount, label: "Photos" },
              { num: videoCount, label: "Videos" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#F8F6ED",
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    marginTop: "2px",
                    color: "rgba(248,246,237,0.55)",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FILTER TABS ──────────────────────────────────────────────────── */}
      <section style={{ padding: "40px 0 0" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[
              { key: "all", label: `All (${items.length})` },
              { key: "photo", label: `Photos (${photoCount})` },
              { key: "video", label: `Videos (${videoCount})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                style={{
                  padding: "8px 20px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: "600",
                  border: "1.5px solid",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  ...(filter === tab.key
                    ? {
                        background: "#272925",
                        color: "#F8F6ED",
                        borderColor: "#272925",
                      }
                    : {
                        background: "transparent",
                        color: "#272925",
                        borderColor: "rgba(39,41,37,0.25)",
                      }),
                }}
                onMouseEnter={(e) => {
                  if (filter !== tab.key) {
                    e.currentTarget.style.borderColor = "#272925";
                    e.currentTarget.style.background = "rgba(39,41,37,0.06)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (filter !== tab.key) {
                    e.currentTarget.style.borderColor = "rgba(39,41,37,0.25)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GALLERY GRID ─────────────────────────────────────────────────── */}
      <section style={{ padding: "32px 0 80px" }}>
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 0",
                color: "#94A3B8",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
              <p>Loading gallery...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 0",
                color: "#94A3B8",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
              <p style={{ fontSize: "15px" }}>
                {items.length === 0
                  ? "No media uploaded yet. Check back soon!"
                  : "No items in this category."}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "20px",
              }}
            >
              {filtered.map((item) => (
                <MediaCard key={item.id} item={item} onClick={setSelected} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selected && <Lightbox item={selected} onClose={handleClose} />}

      <Footer />

      {/* Hover overlay style */}
      <style>{`
        div:hover .card-overlay { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
