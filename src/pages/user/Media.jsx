// src/pages/user/Media.jsx
import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import Footer from "../../components/Footer";

// ─── LIGHTBOX ──────────────────────────────────────────────────────────────────
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
        background: "rgba(10,11,10,0.96)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Decorative corner accents */}
      <div
        style={{
          position: "absolute",
          top: "28px",
          left: "28px",
          width: "32px",
          height: "32px",
          borderTop: "1.5px solid rgba(209,167,153,0.4)",
          borderLeft: "1.5px solid rgba(209,167,153,0.4)",
          borderRadius: "2px 0 0 0",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "28px",
          right: "72px",
          width: "32px",
          height: "32px",
          borderTop: "1.5px solid rgba(209,167,153,0.4)",
          borderRight: "1.5px solid rgba(209,167,153,0.4)",
          borderRadius: "0 2px 0 0",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "28px",
          left: "28px",
          width: "32px",
          height: "32px",
          borderBottom: "1.5px solid rgba(209,167,153,0.4)",
          borderLeft: "1.5px solid rgba(209,167,153,0.4)",
          borderRadius: "0 0 0 2px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "28px",
          right: "28px",
          width: "32px",
          height: "32px",
          borderBottom: "1.5px solid rgba(209,167,153,0.4)",
          borderRight: "1.5px solid rgba(209,167,153,0.4)",
          borderRadius: "0 0 2px 0",
          pointerEvents: "none",
        }}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "20px",
          right: "24px",
          background: "rgba(248,246,237,0.08)",
          border: "1px solid rgba(209,167,153,0.25)",
          color: "#F8F6ED",
          borderRadius: "50%",
          width: "44px",
          height: "44px",
          fontSize: "16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
          letterSpacing: "0.02em",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(209,167,153,0.2)";
          e.currentTarget.style.borderColor = "rgba(209,167,153,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(248,246,237,0.08)";
          e.currentTarget.style.borderColor = "rgba(209,167,153,0.25)";
        }}
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
          gap: "14px",
          alignItems: "center",
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
              borderRadius: "4px",
              boxShadow:
                "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(209,167,153,0.15)",
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
              borderRadius: "4px",
              boxShadow:
                "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(209,167,153,0.15)",
            }}
          />
        )}
        {item.title && (
          <p
            style={{
              color: "rgba(209,167,153,0.85)",
              fontSize: "13px",
              textAlign: "center",
              margin: 0,
              letterSpacing: "0.06em",
              fontStyle: "italic",
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
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onClick(item)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: "3px",
        overflow: "hidden",
        cursor: "pointer",
        aspectRatio: "4/3",
        position: "relative",
        // Elegant double-border frame
        boxShadow: hovered
          ? "0 0 0 1px rgba(209,167,153,0.6), 0 0 0 4px rgba(209,167,153,0.08), 0 24px 48px rgba(15,17,16,0.35)"
          : "0 0 0 1px rgba(39,41,37,0.12), 0 0 0 4px rgba(39,41,37,0.03), 0 8px 24px rgba(15,17,16,0.12)",
        transform: hovered
          ? "translateY(-6px) scale(1.01)"
          : "translateY(0) scale(1)",
        transition:
          "transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s cubic-bezier(0.22,1,0.36,1)",
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
              transition:
                "transform 0.5s cubic-bezier(0.22,1,0.36,1), filter 0.35s",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              filter: hovered ? "brightness(0.82)" : "brightness(1)",
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
        /* ── VIDEO CARD — premium treatment ── */
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            background: "#0a0b0a",
            overflow: "hidden",
          }}
        >
          {/* Film grain texture overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              opacity: 0.035,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "180px 180px",
              pointerEvents: "none",
            }}
          />

          {/* Thumbnail or gradient background */}
          {item.thumbnail_url ? (
            <img
              src={item.thumbnail_url}
              alt={item.title || ""}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                opacity: hovered ? 0.65 : 0.75,
                transition:
                  "opacity 0.35s, transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                transform: hovered ? "scale(1.06)" : "scale(1)",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: hovered
                  ? "linear-gradient(145deg, #1a1c1a 0%, #272925 45%, #1e2019 100%)"
                  : "linear-gradient(145deg, #141514 0%, #1f2117 45%, #171816 100%)",
                transition: "background 0.4s",
              }}
            />
          )}

          {/* Cinematic letterbox lines (top & bottom) */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "18px",
              background: "rgba(8,9,8,0.7)",
              zIndex: 3,
              transition: "opacity 0.3s",
              opacity: hovered ? 0 : 1,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "18px",
              background: "rgba(8,9,8,0.7)",
              zIndex: 3,
              transition: "opacity 0.3s",
              opacity: hovered ? 0 : 1,
            }}
          />

          {/* Vignette overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(8,9,8,0.6) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Play button — golden ring treatment */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 4,
            }}
          >
            {/* Outer glow ring */}
            <div
              style={{
                position: "absolute",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(209,167,153,0.2) 0%, transparent 70%)",
                transform: hovered ? "scale(1.4)" : "scale(1)",
                opacity: hovered ? 1 : 0,
                transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
                pointerEvents: "none",
              }}
            />
            {/* Mid ring */}
            <div
              style={{
                position: "absolute",
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                border: `1px solid ${hovered ? "rgba(209,167,153,0.5)" : "rgba(248,246,237,0.2)"}`,
                transform: hovered ? "scale(1.15)" : "scale(1)",
                transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
                pointerEvents: "none",
              }}
            />
            {/* Main play circle */}
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: hovered
                  ? "linear-gradient(145deg, rgba(209,167,153,0.95), rgba(248,246,237,0.9))"
                  : "rgba(248,246,237,0.88)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: hovered
                  ? "0 8px 32px rgba(209,167,153,0.5), 0 2px 8px rgba(0,0,0,0.4)"
                  : "0 4px 16px rgba(0,0,0,0.5)",
                transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
                transform: hovered ? "scale(1.08)" : "scale(1)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill={hovered ? "#272925" : "#272925"}
                style={{ width: "20px", height: "20px", marginLeft: "3px" }}
              >
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </div>

          {/* Duration indicator style label */}
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              right: "12px",
              zIndex: 5,
              background: "rgba(8,9,8,0.7)",
              border: "1px solid rgba(209,167,153,0.2)",
              backdropFilter: "blur(8px)",
              borderRadius: "3px",
              padding: "3px 8px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(209,167,153,0.8)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: "10px", height: "10px" }}
            >
              <polygon
                points="5,3 19,12 5,21"
                fill="rgba(209,167,153,0.8)"
                stroke="none"
              />
            </svg>
            <span
              style={{
                fontSize: "10px",
                fontWeight: "600",
                color: "rgba(209,167,153,0.9)",
                letterSpacing: "0.06em",
              }}
            >
              VIDEO
            </span>
          </div>
        </div>
      )}

      {/* Hover title overlay — for photos */}
      {item.type === "photo" && item.title && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "40px 16px 16px",
            background:
              "linear-gradient(to top, rgba(10,11,10,0.82), transparent)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s",
            zIndex: 5,
          }}
        >
          <p
            style={{
              color: "#F8F6ED",
              fontSize: "12px",
              fontWeight: "600",
              margin: 0,
              letterSpacing: "0.04em",
            }}
          >
            {item.title}
          </p>
        </div>
      )}

      {/* Title overlay for video (always slightly visible) */}
      {item.type === "video" && item.title && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "40px 16px 14px",
            background:
              "linear-gradient(to top, rgba(10,11,10,0.9) 0%, transparent 100%)",
            zIndex: 5,
          }}
        >
          <p
            style={{
              color: "rgba(248,246,237,0.82)",
              fontSize: "11px",
              fontWeight: "600",
              margin: 0,
              letterSpacing: "0.05em",
              fontStyle: "italic",
            }}
          >
            {item.title}
          </p>
        </div>
      )}

      {/* Photo badge — top left, minimal */}
      {item.type === "photo" && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            padding: "3px 9px",
            borderRadius: "2px",
            fontSize: "9px",
            fontWeight: "700",
            letterSpacing: "0.14em",
            background: "rgba(39,41,37,0.72)",
            color: "rgba(248,246,237,0.85)",
            backdropFilter: "blur(6px)",
            textTransform: "uppercase",
            border: "1px solid rgba(248,246,237,0.1)",
            zIndex: 5,
          }}
        >
          PHOTO
        </div>
      )}
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
      <section style={{ padding: "48px 0 0" }}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Decorative rule */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                height: "1px",
                flex: 1,
                background:
                  "linear-gradient(to right, transparent, rgba(39,41,37,0.12))",
              }}
            />
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.2em",
                color: "#94A3B8",
                textTransform: "uppercase",
                fontWeight: "600",
              }}
            >
              Browse Collection
            </span>
            <div
              style={{
                height: "1px",
                flex: 1,
                background:
                  "linear-gradient(to left, transparent, rgba(39,41,37,0.12))",
              }}
            />
          </div>

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
                  borderRadius: "2px",
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "0.06em",
                  border: "1px solid",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textTransform: "uppercase",
                  ...(filter === tab.key
                    ? {
                        background: "#272925",
                        color: "#F8F6ED",
                        borderColor: "#272925",
                      }
                    : {
                        background: "transparent",
                        color: "#64748B",
                        borderColor: "rgba(39,41,37,0.2)",
                      }),
                }}
                onMouseEnter={(e) => {
                  if (filter !== tab.key) {
                    e.currentTarget.style.borderColor = "#272925";
                    e.currentTarget.style.color = "#272925";
                  }
                }}
                onMouseLeave={(e) => {
                  if (filter !== tab.key) {
                    e.currentTarget.style.borderColor = "rgba(39,41,37,0.2)";
                    e.currentTarget.style.color = "#64748B";
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
      <section style={{ padding: "32px 0 100px" }}>
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "100px 0",
                color: "#94A3B8",
              }}
            >
              {/* Elegant loading indicator */}
              <div
                style={{
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: "1.5px solid rgba(39,41,37,0.12)",
                    borderTop: "1.5px solid #272925",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <p
                  style={{
                    fontSize: "13px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#94A3B8",
                  }}
                >
                  Loading gallery
                </p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "100px 24px",
                color: "#94A3B8",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "1px",
                  background: "rgba(39,41,37,0.15)",
                  margin: "0 auto 24px",
                }}
              />
              <p style={{ fontSize: "14px", letterSpacing: "0.06em" }}>
                {items.length === 0
                  ? "No media published yet. Check back soon."
                  : "No items in this category."}
              </p>
              <div
                style={{
                  width: "48px",
                  height: "1px",
                  background: "rgba(39,41,37,0.15)",
                  margin: "24px auto 0",
                }}
              />
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "24px",
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

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
