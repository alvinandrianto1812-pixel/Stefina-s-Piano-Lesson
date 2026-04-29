// src/components/ScrollFloat.jsx
import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollFloat.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollFloat — animates text character-by-character when it enters the viewport.
 *
 * If `children` is a string → split into chars and animate each one with stagger.
 * If `children` is a ReactNode (JSX) → fades/slides the whole block in.
 *
 * Props:
 *  as            – HTML tag for the wrapper (default: 'h2')
 *  className     – classes applied to the wrapper element
 *  animationDuration, ease, scrollStart, stagger — GSAP options
 *  scrub         – if true, ties animation to scroll position (legacy). Default: false.
 */
const ScrollFloat = ({
  children,
  as: Tag = 'h2',
  className = '',
  animationDuration = 0.8,
  ease = 'back.out(1.7)',
  scrollStart = 'top 88%',
  scrollEnd = 'bottom 20%',   // only used when scrub=true
  stagger = 0.025,
  scrub = false,
  scrollContainerRef,
}) => {
  const containerRef = useRef(null);
  const isString = typeof children === 'string';

  // Split string into chars only if children is a plain string
  const splitText = useMemo(() => {
    if (!isString) return null;

    return children.split('').map((char, index) => {
      if (char === ' ') {
        return (
          <span key={index} className="scroll-float-char scroll-float-char--space">
            {'\u00A0'}
          </span>
        );
      }
      // Wrap each char in an overflow:hidden container so the slide-up clips nicely
      return (
        <span
          key={index}
          style={{ display: 'inline-block', overflow: 'hidden', lineHeight: 'inherit' }}
        >
          <span className="scroll-float-char" style={{ display: 'inline-block' }}>
            {char}
          </span>
        </span>
      );
    });
  }, [children, isString]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller =
      scrollContainerRef && scrollContainerRef.current
        ? scrollContainerRef.current
        : window;

    let targets;

    if (isString) {
      targets = el.querySelectorAll('.scroll-float-char');
    } else {
      targets = [el];
    }

    if (!targets.length) return;

    // Set initial hidden state immediately (avoids flash of visible text)
    gsap.set(targets, {
      opacity: 0,
      yPercent: isString ? 110 : 28,
      scaleY: isString ? 2.0 : 1,
      scaleX: isString ? 0.75 : 1,
      transformOrigin: '50% 100%',
    });

    const anim = gsap.to(targets, {
      duration: animationDuration,
      ease,
      opacity: 1,
      yPercent: 0,
      scaleY: 1,
      scaleX: 1,
      stagger: isString ? stagger : 0,
      ...(scrub
        ? {
            scrollTrigger: {
              trigger: el,
              scroller,
              start: scrollStart,
              end: scrollEnd,
              scrub: 1.2,
            },
          }
        : {
            scrollTrigger: {
              trigger: el,
              scroller,
              start: scrollStart,
              toggleActions: 'play none none none',
              once: true,
            },
          }),
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [
    isString,
    scrub,
    scrollContainerRef,
    animationDuration,
    ease,
    scrollStart,
    scrollEnd,
    stagger,
  ]);

  return (
    <Tag ref={containerRef} className={`scroll-float ${className}`}>
      {isString ? (
        <span className="scroll-float-text">{splitText}</span>
      ) : (
        children
      )}
    </Tag>
  );
};

export default ScrollFloat;
