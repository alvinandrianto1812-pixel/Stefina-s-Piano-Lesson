// src/contexts/SmoothScrollProvider.jsx
// Initialises Lenis smooth scroll and keeps GSAP ScrollTrigger in sync.
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,          // scroll duration (seconds) — higher = slower/smoother
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
      smoothWheel: true,
      smoothTouch: false,     // keep native on touch devices
      touchMultiplier: 2,
    });

    // Tell GSAP ScrollTrigger to use Lenis scroll position
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis via GSAP ticker so they stay in perfect sync
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return children;
}
