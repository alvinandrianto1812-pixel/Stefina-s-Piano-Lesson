// src/pages/user/LandingPage.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

import TypingText        from '../../components/TypingText';
import Footer            from '../../components/Footer';
import ScrollFloat       from '../../components/ScrollFloat';
import MagicRings        from '../../components/MagicRings';
import BounceIcons       from '../../components/BounceIcons';
import FeatureExplorer   from '../../components/FeatureExplorer';
import TestimonialSlider from '../../components/TestimonialSlider';
import useScrollReveal   from '../../hooks/useScrollReveal';

/* ─── WhatsApp link ─────────────────────────────── */
const WA_LINK =
  'https://wa.me/6287848441575?text=' +
  encodeURIComponent(
    "Hello! I'd like to try a trial piano class. Is there any slot available this week?"
  );

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  /* Scroll-reveal refs */
  const heroLeftRef  = useScrollReveal({ from: { opacity: 0, y: 40 }, duration: 0.9, ease: 'power3.out', stagger: 0.12, start: 'top 82%' });
  const heroCardRef  = useScrollReveal({ from: { opacity: 0, x: 40, scale: 0.96 }, duration: 0.9, ease: 'power3.out', delay: 0.2 });
  const faqRef       = useScrollReveal({ from: { opacity: 0, y: 32 }, duration: 0.75, ease: 'power3.out', start: 'top 88%' });
  const ctaPanelsRef = useScrollReveal({ from: { opacity: 0, y: 40, scale: 0.97 }, duration: 0.8, ease: 'power3.out', stagger: 0.15, start: 'top 88%' });

  /* Scroll to hash anchor from URL */
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location]);

  const handleBook = () => navigate('/Questionnaire');

  return (
    <div
      className="text-brand-dark"
      style={{
        fontFamily: '"Creato Display", system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        background: 'var(--cream)',
      }}
    >
      {/* ══════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════ */}
      <section
        className="relative min-h-[92vh] flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #F8F6ED 60%, #EDE8DC 100%)' }}
      >
        {/* Radial blush glow — top-left */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            background:
              'radial-gradient(900px 500px at 10% 0%, rgba(209,167,153,0.18) 0%, transparent 60%),' +
              'radial-gradient(600px 400px at 95% 80%, rgba(104,55,48,0.07) 0%, transparent 60%)',
          }}
        />

        {/* MagicRings — very subtle on cream */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          }}
        >
          <MagicRings
            color="#D1A799"
            colorTwo="#50553C"
            ringCount={4}
            speed={0.5}
            opacity={0.55}
            attenuation={7}
            lineThickness={1.6}
            baseRadius={0.32}
            radiusStep={0.09}
            noiseAmount={0.015}
            followMouse={true}
            mouseInfluence={0.10}
            parallax={0.03}
            hoverScale={1.05}
            clickBurst={true}
          />
        </div>

        {/* Content grid */}
        <div
          className="relative max-w-7xl mx-auto px-4 w-full"
          style={{ paddingTop: '7rem', paddingBottom: '5rem', zIndex: 1 }}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* ── Left: headline + CTAs ── */}
            <div ref={heroLeftRef}>
              {/* Eyebrow label */}
              <div
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  marginBottom: '1.25rem', padding: '0.35rem 0.85rem',
                  borderRadius: '99px',
                  background: 'rgba(209,167,153,0.15)',
                  border: '1px solid rgba(209,167,153,0.35)',
                  fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.15em',
                  textTransform: 'uppercase', color: 'var(--brick)',
                }}
              >
                <span style={{ fontSize: '1em' }}>♪</span>
                Private Piano Lessons · Jakarta
              </div>

              <h1
                className="headline"
                style={{
                  fontFamily: '"Rockdale FREE", serif',
                  fontSize: 'clamp(2.4rem, 5vw, 3.75rem)',
                  lineHeight: 1.1,
                  color: 'var(--olive)',
                  marginBottom: '1rem',
                }}
              >
                Lessons Crafted
                <br />
                for{' '}
                <span style={{ color: 'var(--brick)', fontStyle: 'italic' }}>
                  <TypingText
                    words={['You', 'Growth', 'Excellence']}
                    speed={80}
                    deleteSpeed={40}
                    pause={1600}
                  />
                </span>
              </h1>

              <p
                style={{
                  fontSize: '1.05rem', lineHeight: 1.8,
                  color: '#5c5c4a', maxWidth: '42ch', marginBottom: '2rem',
                }}
              >
                From beginner scales to advanced repertoire — personalized
                curriculum, flexible scheduling, and mentors with 10+ years
                of teaching experience.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2.5rem' }}>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.85rem 1.75rem',
                    borderRadius: '99px',
                    background: 'var(--blush)',
                    color: '#fff',
                    fontWeight: 700, fontSize: '0.95rem',
                    boxShadow: '0 4px 16px rgba(209,167,153,0.4)',
                    textDecoration: 'none',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(209,167,153,0.5)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(209,167,153,0.4)'; }}
                >
                  ♪ &nbsp; Try a Trial Class
                </a>
                <a
                  href="#features"
                  style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '0.85rem 1.75rem',
                    borderRadius: '99px',
                    border: '1.5px solid rgba(80,85,60,0.3)',
                    color: 'var(--olive)',
                    fontWeight: 600, fontSize: '0.95rem',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--olive)'; e.currentTarget.style.background = 'rgba(80,85,60,0.05)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(80,85,60,0.3)'; e.currentTarget.style.background = ''; }}
                >
                  See How It Works
                </a>
              </div>

              {/* Trust badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.82rem', color: '#7a7a60' }}>
                {[
                  { icon: '★', text: 'Mentors 10+ yrs exp.' },
                  { icon: '♫', text: 'Fun & engaging method' },
                  { icon: '✓', text: 'Flexible schedule' },
                ].map((b) => (
                  <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span style={{ color: 'var(--blush)' }}>{b.icon}</span>
                    {b.text}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: booking card ── */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div
                ref={heroCardRef}
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(209,167,153,0.3)',
                  borderRadius: '24px',
                  padding: '2.25rem',
                  width: '100%',
                  maxWidth: '380px',
                  boxShadow: '0 16px 48px rgba(39,41,37,0.10)',
                }}
              >
                {/* Card header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div>
                    <div
                      style={{
                        fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em',
                        textTransform: 'uppercase', color: 'var(--blush)', marginBottom: '0.4rem',
                      }}
                    >
                      New Enrollment
                    </div>
                    <h3 style={{ fontFamily: '"Rockdale FREE", serif', fontSize: '1.3rem', color: 'var(--olive)', margin: 0 }}>
                      Private Piano Class
                    </h3>
                  </div>
                  <span
                    style={{
                      padding: '0.25rem 0.7rem', borderRadius: '99px',
                      background: 'rgba(104,55,48,0.1)',
                      color: 'var(--brick)', fontSize: '0.7rem', fontWeight: 700,
                    }}
                  >
                    Open
                  </span>
                </div>

                <p style={{ fontSize: '0.87rem', color: '#666', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                  Basic technique, sight-reading, music theory, and your favourite repertoire — all in one session.
                </p>

                {/* Tag pills */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  {['Technique', 'Theory', 'Repertoire'].map((t) => (
                    <span
                      key={t}
                      style={{
                        padding: '0.35rem 0.9rem', borderRadius: '99px',
                        background: 'rgba(80,85,60,0.07)',
                        border: '1px solid rgba(80,85,60,0.15)',
                        fontSize: '0.75rem', fontWeight: 600, color: 'var(--olive)',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Mini info row */}
                <div
                  style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem', marginBottom: '1.5rem',
                    padding: '0.85rem', borderRadius: '12px',
                    background: 'rgba(248,246,237,0.8)',
                    border: '1px solid rgba(209,167,153,0.2)',
                  }}
                >
                  {[
                    { label: 'Duration', val: '60 min/session' },
                    { label: 'Format', val: 'Private 1-on-1' },
                    { label: 'Level', val: 'All levels' },
                    { label: 'Start', val: 'Any week' },
                  ].map((r) => (
                    <div key={r.label}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--blush)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{r.label}</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--charcoal)', marginTop: '0.15rem' }}>{r.val}</div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleBook}
                  style={{
                    width: '100%', padding: '0.9rem',
                    borderRadius: '12px',
                    background: 'var(--blush)',
                    color: '#fff', border: 'none',
                    fontWeight: 700, fontSize: '0.95rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(209,167,153,0.35)',
                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                  }}
                  onMouseOver={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseOut={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = ''; }}
                >
                  Book a Trial →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. BOUNCE ICONS — musical symbol divider
      ══════════════════════════════════════════════ */}
      <BounceIcons />

      {/* ══════════════════════════════════════════════
          3. FEATURE EXPLORER — sticky scroll
          (heading rendered ABOVE the sticky area via
           a small intro section)
      ══════════════════════════════════════════════ */}
      <div
        style={{
          background: 'var(--cream)',
          paddingTop: '5rem',
          paddingBottom: '0',
          textAlign: 'center',
        }}
      >
        <ScrollFloat
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="center bottom+=50%"
          scrollEnd="bottom bottom-=30%"
          stagger={0.04}
          className="fe-section-heading"
        >
          Why Choose GuruNada?
        </ScrollFloat>
        <p
          style={{
            marginTop: '0.75rem',
            marginBottom: '2.5rem',
            color: '#7a7a60',
            fontSize: '1rem',
            maxWidth: '48ch',
            margin: '0.75rem auto 0',
          }}
        >
          Scroll to explore everything that makes our approach different.
        </p>
      </div>
      <FeatureExplorer />

      {/* ══════════════════════════════════════════════
          4. TESTIMONIALS — dark slider
      ══════════════════════════════════════════════ */}
      <TestimonialSlider />

      {/* ══════════════════════════════════════════════
          5. FAQ
      ══════════════════════════════════════════════ */}
      <section
        id="faq"
        className="scroll-mt-24"
        style={{
          background: 'linear-gradient(180deg, rgba(80,85,60,0.05) 0%, rgba(80,85,60,0.02) 100%)',
          padding: '6rem 0',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 1.5rem' }}>
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=30%"
            stagger={0.03}
            className="faq-heading"
          >
            Frequently Asked Questions
          </ScrollFloat>

          <div
            ref={faqRef}
            style={{
              borderRadius: '20px',
              border: '1px solid rgba(209,167,153,0.25)',
              background: '#fff',
              overflow: 'hidden',
            }}
          >
            {[
              {
                q: 'Can I try a class first?',
                a: 'Yes. Fill out the questionnaire & choose a trial slot, then upload your payment proof. Our admin will verify and confirm via WhatsApp.',
              },
              {
                q: 'Can I reschedule a session?',
                a: 'Yes, as long as another slot is available. Simply pick any open time — no penalty, no hassle.',
              },
              {
                q: 'What payment methods are accepted?',
                a: 'Bank transfer. Upload your transfer proof (jpg / png / webp / pdf, max 5 MB) when submitting the questionnaire.',
              },
              {
                q: 'Is this for beginners or advanced students?',
                a: 'Both! We welcome students of all levels, from absolute beginners to those preparing for ABRSM or Trinity exams.',
              },
            ].map((item, i) => (
              <details
                key={i}
                style={{ borderBottom: i < 3 ? '1px solid rgba(209,167,153,0.2)' : 'none' }}
              >
                <summary
                  style={{
                    cursor: 'pointer',
                    padding: '1.25rem 1.5rem',
                    fontWeight: 600, fontSize: '0.95rem',
                    color: 'var(--charcoal)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    listStyle: 'none',
                    userSelect: 'none',
                  }}
                >
                  {item.q}
                  <span style={{ color: 'var(--blush)', fontWeight: 300, fontSize: '1.3rem', flexShrink: 0, marginLeft: '1rem' }}>+</span>
                </summary>
                <p
                  style={{
                    margin: 0, padding: '0 1.5rem 1.25rem',
                    fontSize: '0.9rem', color: '#666', lineHeight: 1.75,
                  }}
                >
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          6. CTA — two-panel
      ══════════════════════════════════════════════ */}
      <section
        style={{
          background: 'var(--cream)',
          padding: '6rem 0',
          borderTop: '1px solid rgba(209,167,153,0.2)',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=30%"
            stagger={0.03}
            className="cta-heading"
          >
            Ready to Begin?
          </ScrollFloat>
          <p style={{ textAlign: 'center', color: '#7a7a60', marginBottom: '3rem', fontSize: '1rem' }}>
            Choose the path that fits you best.
          </p>

          <div
            ref={ctaPanelsRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* Panel A — Trial */}
            <div
              style={{
                borderRadius: '24px', overflow: 'hidden',
                position: 'relative', minHeight: '360px',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                background: 'var(--charcoal)',
              }}
            >
              {/* MagicRings background */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <MagicRings
                  color="#D1A799"
                  colorTwo="#683730"
                  ringCount={4}
                  speed={0.6}
                  opacity={0.85}
                  attenuation={6}
                  lineThickness={2}
                  baseRadius={0.3}
                  radiusStep={0.1}
                  noiseAmount={0.02}
                  followMouse={true}
                  mouseInfluence={0.15}
                  parallax={0.05}
                  hoverScale={1.1}
                  clickBurst={true}
                />
              </div>
              {/* Gradient overlay for text legibility */}
              <div
                style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
                  background: 'linear-gradient(to top, rgba(39,41,37,0.95) 0%, transparent 100%)',
                  zIndex: 1,
                }}
              />
              {/* Content */}
              <div style={{ position: 'relative', zIndex: 2, padding: '2rem' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--blush)', marginBottom: '0.5rem' }}>
                  Available at no charge
                </div>
                <h3 style={{ fontFamily: '"Rockdale FREE", serif', fontSize: '1.6rem', color: 'var(--cream)', marginBottom: '0.5rem' }}>
                  Try a Trial Class
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(248,246,237,0.65)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                  Fill out a short questionnaire and experience a full session — no commitment.
                </p>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '99px',
                    background: 'var(--blush)',
                    color: '#fff',
                    fontWeight: 700, fontSize: '0.9rem',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s',
                  }}
                >
                  Book via WhatsApp →
                </a>
              </div>
            </div>

            {/* Panel B — Regular */}
            <div
              style={{
                borderRadius: '24px', overflow: 'hidden',
                position: 'relative', minHeight: '360px',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                background: 'var(--olive)',
              }}
            >
              {/* MagicRings background */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <MagicRings
                  color="#F8F6ED"
                  colorTwo="#D1A799"
                  ringCount={4}
                  speed={0.5}
                  opacity={0.7}
                  attenuation={7}
                  lineThickness={1.8}
                  baseRadius={0.28}
                  radiusStep={0.11}
                  noiseAmount={0.02}
                  followMouse={true}
                  mouseInfluence={0.15}
                  parallax={0.05}
                  hoverScale={1.1}
                  clickBurst={true}
                />
              </div>
              {/* Gradient overlay */}
              <div
                style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
                  background: 'linear-gradient(to top, rgba(80,85,60,0.97) 0%, transparent 100%)',
                  zIndex: 1,
                }}
              />
              {/* Content */}
              <div style={{ position: 'relative', zIndex: 2, padding: '2rem' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(248,246,237,0.6)', marginBottom: '0.5rem' }}>
                  Regular enrollment
                </div>
                <h3 style={{ fontFamily: '"Rockdale FREE", serif', fontSize: '1.6rem', color: 'var(--cream)', marginBottom: '0.5rem' }}>
                  Join Regular Classes
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(248,246,237,0.65)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                  Choose your weekly schedule and start your musical journey with a dedicated mentor.
                </p>
                <button
                  onClick={handleBook}
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '99px',
                    background: 'var(--cream)',
                    color: 'var(--olive)',
                    fontWeight: 700, fontSize: '0.9rem',
                    border: 'none', cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                >
                  Enroll Now →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          7. FOOTER
      ══════════════════════════════════════════════ */}
      <Footer />
    </div>
  );
}
