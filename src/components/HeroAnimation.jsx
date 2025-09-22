import React, { useMemo } from "react";

export default function HeroAnimation({ className = "" }) {
  const GOLD = "#D1A799";
  const OLIVE = "#50553C";
  const WINE = "#683730";
  const palette = [OLIVE, GOLD, WINE];

  // SVG not musik ringan
  const Note = ({ style, color = OLIVE }) => (
    <svg
      className="note"
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* eighth note */}
      <path d="M10 17a3 3 0 1 1-2-2.83V6l8-2v8" />
      <circle cx="8" cy="17" r="2.6" fill="currentColor" opacity=".07" />
      <circle cx="16" cy="13" r="2.4" fill="currentColor" opacity=".06" />
    </svg>
  );

  // Random yang stabil per mount
  const notes = useMemo(() => {
    const N = 6; // jumlah not
    const rand = (min, max) => Math.random() * (max - min) + min;
    return Array.from({ length: N }).map((_, i) => {
      const left = rand(8, 85);          // % posisi horizontal awal
      const bottom = rand(6, 20);        // % posisi vertical awal
      const delay = rand(0, 2);        // s
      const duration = rand(6.2, 7.8);   // s
      const dx = rand(8, 18);            // px drift ke kanan
      const scale = rand(1.02, 1.08);    // skala akhir
      const color = palette[i % palette.length];
      return { left, bottom, delay, duration, dx, scale, color };
    });
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* vignette lembut */}
      <div className="hero-orb" />

      {/* badge/brand bulat tipis */}
      <div
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: 180,
          height: 180,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle at 40% 40%, rgba(209,167,153,.22), transparent 60%)",
          boxShadow: "0 20px 50px rgba(39,41,37,.12)",
          border: "1px solid rgba(80,85,60,.12)",
          animation: "drift 8s ease-in-out infinite",
        }}
      />

      {/* not musik acak */}
      <div className="notes">
        {notes.map((n, idx) => (
          <Note
            key={idx}
            color={n.color}
            style={{
              left: `${n.left}%`,
              bottom: `${n.bottom}%`,
              // variable CSS untuk keyframes
              ["--d"]: `${n.duration}s`,
              ["--delay"]: `${n.delay}s`,
              ["--dx"]: `${n.dx}px`,
              ["--scale"]: n.scale,
            }}
          />
        ))}
      </div>

      {/* spacer tinggi */}
      <div style={{ paddingTop: 220 }} />
    </div>
  );
}
