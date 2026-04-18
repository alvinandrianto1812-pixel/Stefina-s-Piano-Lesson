// src/components/ScrollFloat.jsx
import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollFloat.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollFloat — animates text character-by-character as the user scrolls.
 *
 * If `children` is a string → split into chars and animate each one.
 * If `children` is a ReactNode (JSX) → wraps the whole block and fades/slides it in.
 *
 * Props:
 *  as            – HTML tag for the wrapper (default: 'h2')
 *  className     – classes applied to the wrapper element
 *  animationDuration, ease, scrollStart, scrollEnd, stagger — GSAP options
 */
const ScrollFloat = ({
  children,
  as: Tag = 'h2',
  className = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03,
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
      // Animate each character
      targets = el.querySelectorAll('.scroll-float-char');
    } else {
      // Animate the whole wrapper as a single element
      targets = [el];
    }

    if (!targets.length) return;

    const anim = gsap.fromTo(
      targets,
      {
        willChange: 'opacity, transform',
        opacity: 0,
        yPercent: isString ? 120 : 30,
        scaleY: isString ? 2.3 : 1,
        scaleX: isString ? 0.7 : 1,
        transformOrigin: '50% 0%',
      },
      {
        duration: animationDuration,
        ease,
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        stagger: isString ? stagger : 0,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: true,
        },
      }
    );

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [
    isString,
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
