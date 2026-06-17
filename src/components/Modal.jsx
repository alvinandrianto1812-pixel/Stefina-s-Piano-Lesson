import { createPortal } from "react-dom";

export default function Modal({ children, maxWidth = 480, onClose }) {
  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(39,41,37,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000, // di atas sticky header (z-40) & navbar manapun
        padding: "1rem",
      }}
      onClick={(e) => {
        // klik di area overlay (bukan box) → close
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "1.5rem",
          width: "100%",
          maxWidth,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(39,41,37,0.25)",
        }}
      >
        {children}
      </div>
    </div>,
    document.body, // ← inti fix: escape dari containing block & stacking context ancestor
  );
}
