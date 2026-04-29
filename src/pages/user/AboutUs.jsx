// src/pages/user/AboutUs.jsx
import { useState, useEffect, useRef } from 'react';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import ScrollFloat from '../../components/ScrollFloat';
import useScrollReveal from '../../hooks/useScrollReveal';
import use3DTilt from '../../hooks/use3DTilt';

/* ─── Data ──────────────────────────────────────────────── */
const STATS = [
  { num: '6',    label: 'Expert Teachers' },
  { num: '4+',   label: 'Instruments' },
  { num: '5+',   label: 'Years of Experience' },
  { num: 'All',  label: 'Ages Welcome' },
];

const PILLARS = [
  {
    icon: '♩',
    title: 'Our Story',
    text: 'Started as a small private piano class, GuruNada has grown into a multi-instrument platform trusted by families across Jakarta — guided by the same intimate, personal approach since day one.',
  },
  {
    icon: '♪',
    title: 'Our Approach',
    text: 'A blend of technique, music theory, and performance practice — delivered in weekly measurable milestones so students and parents always know exactly where they stand.',
  },
  {
    icon: '♫',
    title: 'Commitment to Quality',
    text: 'Curated teachers, regular curriculum reviews, and updated materials ensure every lesson is worth your time, every single week.',
  },
];

const FAQ_ITEMS = [
  {
    q: 'What makes GuruNada different?',
    a: 'A progressive, measurable curriculum combined with a handpicked team of professional educators and regular performance opportunities.',
  },
  {
    q: 'Do you offer online and offline classes?',
    a: 'Yes. Both formats are available depending on the instrument and your preferred schedule. Home visits are also available for select teachers.',
  },
  {
    q: 'What age groups do you teach?',
    a: 'We welcome students of all ages — from young children (5+) to adults returning to music after a long break.',
  },
  {
    q: 'How do I get started?',
    a: 'Fill out the student questionnaire, choose a trial slot, and upload your payment. Our admin will confirm your spot via WhatsApp within 24 hours.',
  },
];

/* ─── Sub-components ─────────────────────────────────────── */

/** 3D tilt + flip card for Mission & Vision */
function FlipCard({ icon, front, back, accent }) {
  const [flipped, setFlipped] = useState(false);
  const tilt = use3DTilt({ max: 8, scale: 1.02, speed: 600 });

  return (
    <div
      ref={tilt.ref}
      onMouseMove={!flipped ? tilt.onMouseMove : undefined}
      onMouseLeave={() => { tilt.onMouseLeave(); }}
      onClick={() => setFlipped(f => !f)}
      style={{
        perspective: '1200px',
        cursor: 'pointer',
        userSelect: 'none',
        willChange: 'transform',
      }}
      role="button"
      tabIndex={0}
      aria-label={`${front} card — click to flip`}
      onKeyDown={e => e.key === 'Enter' && setFlipped(f => !f)}
    >
      <div
        style={{
          position: 'relative',
          height: '280px',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.65s cubic-bezier(0.4,0,0.2,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          borderRadius: '20px',
        }}
      >
        {/* Front */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          borderRadius: '20px', overflow: 'hidden',
          background: '#fff',
          border: '1px solid rgba(209,167,153,0.3)',
          boxShadow: '0 8px 32px rgba(39,41,37,0.09)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end', padding: '2rem',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: accent }}>{icon}</div>
          <h3 style={{ fontFamily: '"Rockdale FREE", serif', fontSize: '1.6rem', color: 'var(--charcoal)', margin: '0 0 0.5rem' }}>{front}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--blush)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Click to read →</p>
        </div>

        {/* Back */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: '20px', overflow: 'hidden',
          background: 'var(--charcoal)',
          border: '1px solid rgba(209,167,153,0.2)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '2rem',
        }}>
          <p style={{
            fontFamily: '"Creato Display", sans-serif',
            fontSize: '0.95rem', lineHeight: 1.8,
            color: 'rgba(248,246,237,0.85)', margin: 0,
          }}>{back}</p>
          <p style={{ fontSize: '0.72rem', color: 'var(--blush)', marginTop: '1.5rem', fontWeight: 700 }}>↩ Click to flip back</p>
        </div>
      </div>
    </div>
  );
}

/** Smooth GSAP-free accordion FAQ */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);

  return (
    <div style={{
      borderBottom: '1px solid rgba(209,167,153,0.2)',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '1.25rem 0',
          background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--charcoal)' }}>{q}</span>
        <span style={{
          color: 'var(--blush)', fontWeight: 300, fontSize: '1.4rem',
          flexShrink: 0, marginLeft: '1rem',
          transform: open ? 'rotate(45deg)' : 'rotate(0)',
          transition: 'transform 0.3s ease',
          display: 'inline-block',
        }}>+</span>
      </button>
      <div
        ref={bodyRef}
        style={{
          maxHeight: open ? (bodyRef.current?.scrollHeight ?? 400) + 'px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.75, paddingBottom: '1.25rem', margin: 0 }}>{a}</p>
      </div>
    </div>
  );
}

/** 3D tilt pillar card */
function PillarCard({ icon, title, text }) {
  const tilt = use3DTilt({ max: 10, scale: 1.03 });
  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={{
        background: '#fff',
        border: '1px solid rgba(209,167,153,0.25)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(39,41,37,0.07)',
        willChange: 'transform',
      }}
    >
      <div style={{ fontSize: '2rem', color: 'var(--blush)', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ fontFamily: '"Rockdale FREE", serif', fontSize: '1.25rem', color: 'var(--olive)', marginBottom: '0.75rem' }}>{title}</h3>
      <p style={{ fontSize: '0.9rem', color: '#5a5a4a', lineHeight: 1.75 }}>{text}</p>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function AboutUs() {
  const pillarsRef = useScrollReveal({ from: { opacity: 0, y: 40, scale: 0.97 }, stagger: 0.12, duration: 0.7, ease: 'power3.out' });
  const faqRef     = useScrollReveal({ from: { opacity: 0, y: 30 }, duration: 0.7, ease: 'power3.out', start: 'top 88%' });
  const flipRef    = useScrollReveal({ from: { opacity: 0, y: 40 }, stagger: 0.15, duration: 0.7, ease: 'power3.out' });

  return (
    <div style={{ fontFamily: '"Creato Display", sans-serif', background: 'var(--cream)' }}>

      {/* ── 1. HERO ── */}
      <PageHero
        eyebrow="About GuruNada"
        title="Our Story, Our Mission"
        subtitle="We believe every student deserves a music education that is personal, measurable, and genuinely enjoyable — taught by professionals who care."
        stats={STATS}
      />

      {/* ── 2. MISSION & VISION — flip cards ── */}
      <section style={{ padding: '5rem 0 4rem', background: 'var(--cream)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <ScrollFloat animationDuration={0.85} ease="back.out(1.7)" stagger={0.03} className="about-section-heading">
            Mission &amp; Vision
          </ScrollFloat>

          <div ref={flipRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2.5rem' }}>
            <FlipCard
              icon="♩"
              front="Our Mission"
              accent="var(--blush)"
              back="To create a learning ecosystem focused on solid technique, theoretical understanding, and performance confidence — guided by a clear, trackable curriculum tailored to each student."
            />
            <FlipCard
              icon="♫"
              front="Our Vision"
              accent="var(--olive)"
              back="To become the most trusted music education partner for families in Indonesia — supported by modern teaching standards, thoughtful technology, and a warm, nurturing community."
            />
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--blush)', textAlign: 'center', fontWeight: 600 }}>Click a card to read more ↑</p>
        </div>
      </section>

      {/* ── 3. PILLARS ── */}
      <section style={{ padding: '3rem 0 5rem', background: 'linear-gradient(180deg, var(--cream) 0%, rgba(80,85,60,0.05) 100%)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <ScrollFloat animationDuration={0.85} ease="back.out(1.7)" stagger={0.03} className="about-section-heading">
            What Drives Us
          </ScrollFloat>
          <div ref={pillarsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '2.5rem' }}>
            {PILLARS.map(p => <PillarCard key={p.title} {...p} />)}
          </div>
        </div>
      </section>

      {/* ── 4. FAQ ── */}
      <section style={{ padding: '3rem 0 5rem', background: 'var(--cream)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 1.5rem' }}>
          <ScrollFloat animationDuration={0.85} ease="back.out(1.7)" stagger={0.03} className="about-section-heading">
            Frequently Asked
          </ScrollFloat>
          <div ref={faqRef} style={{ marginTop: '2.5rem', background: '#fff', borderRadius: '20px', padding: '0.5rem 2rem', border: '1px solid rgba(209,167,153,0.2)', boxShadow: '0 4px 20px rgba(39,41,37,0.06)' }}>
            {FAQ_ITEMS.map(item => <FaqItem key={item.q} {...item} />)}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
