// src/components/PageHero.jsx
import ScrollFloat from './ScrollFloat';
import './PageHero.css';

/**
 * PageHero — shared premium hero section for all About sub-pages.
 *
 * Background uses pure CSS layers (no WebGL):
 *   1. Radial gradient ambience
 *   2. Soft breathing glow animation
 *   3. Diagonal music-staff lines (brand thematic, very faint)
 *
 * Props:
 *   eyebrow   string              — small uppercase label above title
 *   title     string              — main heading (per-char ScrollFloat)
 *   subtitle  string              — paragraph below title
 *   stats     Array<{num,label}>  — optional stat row
 *   children  ReactNode           — extra content between subtitle and stats
 *   waveColor string              — fill colour of the wave SVG (default cream)
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
      {/* Layer 1: ambient radial gradients */}
      <div className="page-hero__bg" aria-hidden="true" />

      {/* Layer 2: soft breathing glow */}
      <div className="page-hero__glow" aria-hidden="true" />

      {/* Layer 3: diagonal music-staff lines */}
      <div className="page-hero__staff" aria-hidden="true" />

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
