import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import AdminFinance from "./AdminFinance";
import AdminEvents from "./sections/AdminEvents";
import AdminMedia from "./sections/AdminMedia";
import AdminPayments from "./sections/AdminPayments";
import AdminTeachers from "./sections/AdminTeachers";
import toast from "react-hot-toast";

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("payments");
  const [navH, setNavH] = useState(64);
  const [paymentStats, setPaymentStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
  });
  const [eventCount, setEventCount] = useState(0);

  // Measure actual navbar height so sub-header sticks flush below it
  useEffect(() => {
    const nav = document.querySelector("nav");
    if (!nav) return;
    setNavH(nav.getBoundingClientRect().height);
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setNavH(e.contentRect.height);
    });
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setLoading(false);
    })();
  }, [navigate]);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          background: "var(--cream)",
          fontFamily: '"Creato Display", sans-serif',
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>♩</div>
          <p style={{ color: "var(--olive)", fontWeight: 600 }}>
            Loading dashboard…
          </p>
        </div>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #ECEAE0 0%, #F0EDE4 100%)",
        fontFamily: '"Creato Display", system-ui, sans-serif',
      }}
    >
      {/* Global styles */}
      <style>{`
        .admin-tabs::-webkit-scrollbar { display: none; }
        .admin-tabs { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes adminFadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .admin-fade-up { animation: adminFadeUp 0.35s ease both; }
        .admin-row { transition: background 0.15s; }
        .admin-row:hover { background: rgba(80,85,60,0.04); }
        .stat-card { transition: transform 0.22s ease, box-shadow 0.22s ease; cursor: default; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(39,41,37,0.12); }
        .tab-btn { transition: all 0.2s ease; }
        .tab-btn:hover:not(.tab-active) { background: rgba(80,85,60,0.07) !important; color: #50553C !important; }
      `}</style>

      {/* Admin Sub-bar: sticky flush below main navbar */}
      <div
        style={{
          position: "sticky",
          top: navH,
          zIndex: 40,
          background:
            "linear-gradient(105deg, #1a1c18 0%, #2d3126 45%, #414737 100%)",
          padding: "0 1.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "46px",
          boxShadow: "0 4px 24px rgba(39,41,37,0.28)",
          borderBottom: "1px solid rgba(209,167,153,0.1)",
        }}
      >
        {/* Left accent line */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: "linear-gradient(180deg, #D1A799, rgba(209,167,153,0))",
            borderRadius: "0 2px 2px 0",
          }}
        />

        {/* Identity */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(135deg, #D1A799 0%, #b8897e 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.9rem",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(209,167,153,0.3)",
            }}
          >
            ♩
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}
          >
            <span
              style={{
                fontSize: "0.55rem",
                fontWeight: 800,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(209,167,153,0.6)",
              }}
            >
              Guru Nada
            </span>
            <span
              style={{ color: "rgba(248,246,237,0.15)", fontSize: "0.85rem" }}
            >
              |
            </span>
            <span
              style={{
                fontSize: "0.84rem",
                fontWeight: 700,
                color: "#F8F6ED",
                letterSpacing: "0.01em",
              }}
            >
              Admin Dashboard
            </span>
          </div>
        </div>

        {/* Date */}
        <span
          style={{
            fontSize: "0.67rem",
            color: "rgba(248,246,237,0.38)",
            letterSpacing: "0.04em",
          }}
        >
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Main content */}
      <div
        style={{
          maxWidth: 1360,
          margin: "0 auto",
          padding: "1.75rem 1.5rem 5rem",
        }}
        className="admin-fade-up"
      >
        {/* Summary stat cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "0.9rem",
            marginBottom: "1.75rem",
          }}
        >
          {[
            {
              label: "Total Payments",
              value: paymentStats.total,
              icon: "💳",
              accent: "#50553C",
              bg: "rgba(80,85,60,0.07)",
              border: "rgba(80,85,60,0.12)",
            },
            {
              label: "Pending Review",
              value: paymentStats.pending,
              icon: "⏳",
              accent: "#92400e",
              bg: "rgba(234,179,8,0.07)",
              border: "rgba(7,7,6,0.18)",
            },
            {
              label: "Verified",
              value: paymentStats.verified,
              icon: "✅",
              accent: "#15803d",
              bg: "rgba(22,163,74,0.07)",
              border: "rgba(22,163,74,0.18)",
            },
            {
              label: "Total Events",
              value: eventCount,
              icon: "📅",
              accent: "#1e40af",
              bg: "rgba(59,130,246,0.06)",
              border: "rgba(59,130,246,0.15)",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="stat-card"
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "1rem 1.25rem",
                border: `1px solid ${s.border}`,
                boxShadow: "0 2px 8px rgba(39,41,37,0.05)",
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 11,
                  background: s.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.15rem",
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    color: "#94A3B8",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {s.label}
                </p>
                <p
                  style={{
                    margin: "0.05rem 0 0",
                    fontSize: "1.55rem",
                    fontWeight: 800,
                    color: s.accent,
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Premium pill tab switcher */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            className="admin-tabs"
            style={{
              display: "flex",
              width: "100%",
              background: "#fff",
              borderRadius: 14,
              padding: "0.28rem",
              gap: "0.15rem",
              boxShadow: "0 2px 10px rgba(39,41,37,0.07)",
              border: "1px solid rgba(39,41,37,0.07)",
              overflowX: "auto",
            }}
          >
            {[
              { key: "payments", label: "Payments", icon: "💳" },
              { key: "events", label: "Events", icon: "📅" },
              { key: "media", label: "Media", icon: "🖼️" },
              { key: "teachers", label: "Teachers", icon: "👩‍🏫" },
              { key: "finance", label: "Finance", icon: "💰" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`tab-btn${activeTab === tab.key ? " tab-active" : ""}`}
                style={{
                  padding: "0.48rem 1rem",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  fontFamily: "inherit",
                  background:
                    activeTab === tab.key
                      ? "linear-gradient(135deg, #272925, #50553C)"
                      : "transparent",
                  color: activeTab === tab.key ? "#F8F6ED" : "#94A3B8",
                  boxShadow:
                    activeTab === tab.key
                      ? "0 3px 10px rgba(39,41,37,0.22)"
                      : "none",
                }}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "payments" && (
          <AdminPayments onStatsUpdate={setPaymentStats} />
        )}

        {activeTab === "events" && (
          <AdminEvents onCountUpdate={setEventCount} />
        )}

        {activeTab === "media" && <AdminMedia />}

        {activeTab === "teachers" && <AdminTeachers />}

        {activeTab === "finance" && <AdminFinance />}
      </div>
    </div>
  );
}
