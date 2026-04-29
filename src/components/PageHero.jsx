// src/components/PageHero.jsx
import MagicRings from './MagicRings';
import ScrollFloat from './ScrollFloat';
import './PageHero.css';

/**
 * PageHero — shared premium hero section for all About sub-pages.
 *
 * Props:
 *   eyebrow   string   — small uppercase label above title
 *   title     string   — main heading (run through ScrollFloat per-char)
 *   subtitle  string   — paragraph below title
 *   stats     Array<{ num, label }> — optional stat row
 *   children  ReactNode — extra content between subtitle and stats
 *   waveColor string   — fill colour of the wave SVG (default cream)
 */
export default function PageHero({
  eyebrow,
  title,
  subtitle,
  stats = [],
  waveColor = '#F8F6ED',
  children,
}) {
  return (
    <section className="page-hero">
      {/* Ambient gradient layers */}
      <div className="page-hero__bg" aria-hidden="true" />

      {/* WebGL MagicRings ambient */}
      <div className="page-hero__rings" aria-hidden="true">
        <MagicRings
          color="#D1A799"
          colorTwo="#50553C"
          ringCount={4}
          speed={0.4}
          opacity={0.55}
          attenuation={8}
          lineThickness={1.5}
          baseRadius={0.28}
          radiusStep={0.1}
          noiseAmount={0.015}
          followMouse={true}
          mouseInfluence={0.1}
          parallax={0.04}
          hoverScale={1.05}
        />
      </div>

      {/* Content */}
      <div className="page-hero__content">
        {eyebrow && <p className="page-hero__eyebrow">{eyebrow}</p>}
        <div className="page-hero__rule" />

        <ScrollFloat
          as="h1"
          animationDuration={0.85}
          ease="back.out(1.7)"
          stagger={0.028}
          scrollStart="top 90%"
        >
          {title}
        </ScrollFloat>

        {subtitle && <p className="page-hero__subtitle">{subtitle}</p>}

        {children}

        {stats.length > 0 && (
          <div className="page-hero__stats">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="page-hero__stat-num">{s.num}</div>
                <div className="page-hero__stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Wave divider */}
      <svg
        className="page-hero__wave"
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill={waveColor}
          d="M0,32 C360,72 1080,-8 1440,32 L1440,64 L0,64 Z"
        />
      </svg>
    </section>
  );
}
