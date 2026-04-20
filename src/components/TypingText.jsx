// src/components/TypingText.jsx
import React, { useEffect, useState } from "react";

/**
 * Props:
 *  - words: string[]                 // kata/frasanya
 *  - speed?: number (default 100)    // kecepatan ketik (ms/char)
 *  - deleteSpeed?: number (50)       // kecepatan hapus (ms/char)
 *  - pause?: number (1200)           // jeda saat kata selesai (ms)
 *  - className?: string              // styling tambahan
 */
export default function TypingText({
  words = ["Elegan", "Terstruktur", "Profesional"],
  speed = 100,
  deleteSpeed = 50,
  pause = 1200,
  className = "",
}) {
  const [index, setIndex] = useState(0);  // index kata
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = words[index % words.length];
    let t;

    if (!deleting) {
      // sedang mengetik
      if (text.length < full.length) {
        t = setTimeout(() => setText(full.slice(0, text.length + 1)), speed);
      } else {
        t = setTimeout(() => setDeleting(true), pause);
      }
    } else {
      // sedang menghapus
      if (text.length > 0) {
        t = setTimeout(() => setText(full.slice(0, text.length - 1)), deleteSpeed);
      } else {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      }
    }
    return () => clearTimeout(t);
  }, [text, deleting, index, words, speed, deleteSpeed, pause]);

  return (
    <span className={`relative ${className}`} aria-live="polite">
      {/* teks dengan warna brand brick */}
      <span style={{ color: 'var(--brick)' }}>
        {text}
      </span>
      {/* kursor berkedip — warna blush */}
      <span
        style={{
          display: 'inline-block',
          width: '2px',
          height: '0.9em',
          verticalAlign: '-0.1em',
          marginLeft: '2px',
          background: 'var(--blush)',
          animation: 'typing-blink 0.9s step-end infinite',
        }}
      />
    </span>
  );
}
