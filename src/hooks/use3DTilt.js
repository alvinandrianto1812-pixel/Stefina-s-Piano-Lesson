// src/hooks/use3DTilt.js
import { useRef, useCallback } from 'react';

/**
 * use3DTilt — real-time 3D mouse-track tilt.
 * Spread the returned props onto the target element.
 */
export default function use3DTilt({ max = 10, scale = 1.03, speed = 500, perspective = 1000 } = {}) {
  const ref = useRef(null);

  const handleMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    el.style.transform = `perspective(${perspective}px) rotateX(${-y * max}deg) rotateY(${x * max}deg) scale(${scale})`;
    el.style.transition = 'transform 0.08s linear';
  }, [max, scale, perspective]);

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
    el.style.transition = `transform ${speed}ms cubic-bezier(0.23,1,0.32,1)`;
  }, [perspective, speed]);

  return { ref, onMouseMove: handleMove, onMouseLeave: handleLeave };
}
