// src/components/NavAnimation.jsx
export default function NavAnimation({ className = "" }) {
  const OLIVE = "#50553C";
  const GOLD  = "#D1A799";

  const Note = ({ style, color = OLIVE }) => (
    <svg
      className="note"
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 17a3 3 0 1 1-2-2.83V6l8-2v8" />
      <circle cx="8" cy="17" r="2.4" fill="currentColor" opacity=".07" />
    </svg>
  );

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ height: 24, width: 140 }}>
      {/* beberapa not kecil melayang */}
      <Note style={{ left: "4%",  bottom: "2%",  ["--d"]: "6s", ["--delay"]: "0s"  }} />
      <Note style={{ left: "28%", bottom: "3%",  ["--d"]: "6.5s", ["--delay"]: ".5s",  color: GOLD }} />
      <Note style={{ left: "52%", bottom: "2%",  ["--d"]: "6.2s", ["--delay"]: "1.0s" }} />
      <Note style={{ left: "76%", bottom: "3%",  ["--d"]: "6.8s", ["--delay"]: ".2s" }} />
    </div>
  );
}
