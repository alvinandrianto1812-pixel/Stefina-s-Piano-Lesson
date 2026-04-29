// src/hooks/useScrollReveal.js
/**
 * useScrollReveal — GSAP scroll-triggered reveal for any element.
 *
 * Usage:
 *   const ref = useScrollReveal();
 *   <div ref={ref}>...</div>
 *
 * Options:
 *   from       — GSAP fromTo 'from' vars (default: fade + slide up)
 *   duration   — animation duration (default: 0.7)
 *   ease       — GSAP ease (default: 'power3.out')
 *   delay      — animation delay in seconds (default: 0)
 *   start      — ScrollTrigger start (default: 'top 85%')
 *   stagger    — if ref is a list of children, stagger amount (default: 0)
 */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useScrollReveal({
  from = { opacity: 0, y: 36, scale: 0.97 },
  duration = 0.7,
  ease = 'power3.out',
  delay = 0,
  start = 'top 85%',
  stagger = 0,
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Determine targets — if stagger > 0, animate direct children
    const targets = stagger > 0 ? Array.from(el.children) : el;
    if (!targets || (Array.isArray(targets) && targets.length === 0)) return;

    gsap.set(targets, from);

    const anim = gsap.to(targets, {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      rotate: 0,
      duration,
      ease,
      delay,
      stagger: stagger || 0,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none none',
        once: true,
      },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, []); // run once on mount

  return ref;
}
