// src/pages/user/OurTeachers.jsx
import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import ScrollFloat from '../../components/ScrollFloat';
import useScrollReveal from '../../hooks/useScrollReveal';
import use3DTilt from '../../hooks/use3DTilt';
import { supabase } from '../../lib/supabaseClient';

/* ─── Philosophy Values ─────────────────────────────────── */
const VALUES = [
  { icon: '♩', title: 'Personalized Learning',  desc: 'Each student receives a curriculum tailored to their goals, pace, and musical taste.' },
  { icon: '♪', title: 'Performance Mindset',    desc: 'We train students not just to play, but to perform — with presence and confidence.' },
  { icon: '◈', title: 'Strong Fundamentals',    desc: 'Solid technique and theory from day one, building a foundation that lasts a lifetime.' },
  { icon: '↑', title: 'Progress Tracking',      desc: 'Measurable milestones and lesson notes after every session keep growth visible.' },
  { icon: '♫', title: 'Creative Exploration',   desc: 'Beyond the syllabus — improvisation, composition, and musical curiosity are always welcome.' },
  { icon: '◉', title: 'Supportive Community',   desc: 'An inclusive environment where every student feels seen, heard, and inspired.' },
];

/* ─── 3D Flip Teacher Card ──────────────────────────────── */
function TeacherCard({ t }) {
  const [flipped, setFlipped] = useState(false);
  const tilt = use3DTilt({ max: 7, scale: 1.02, speed: 600 });

  const handleMouseMove = (e) => { if (!flipped) tilt.onMouseMove(e); };
  const handleMouseLeave = (e) => { tilt.onMouseLeave(e); };

  return (
    <div
      ref={tilt.ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => setFlipped(f => !f)}
      style={{
        perspective: '1200px',
        cursor: 'pointer',
        userSelect: 'none',
        willChange: 'transform',
      }}
    >
      {/* Flip inner */}
      <div style={{
        position: 'relative',
        height: '480px',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.65s cubic-bezier(0.4,0,0.2,1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        borderRadius: '20px',
      }}>

        {/* ── FRONT ── */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          borderRadius: '20px', overflow: 'hidden',
          background: '#fff',
          border: '1px solid rgba(209,167,153,0.3)',
          boxShadow: '0 8px 32px rgba(39,41,37,0.09)',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Photo */}
          <div style={{ position: 'relative', flex: '0 0 66%', background: '#E8E4D8', overflow: 'hidden' }}>
            {t.photo_url ? (
              <img
                src={t.photo_url}
                alt={t.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', transition: 'transform 0.5s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
              />
            ) : null}
            {/* Fallback initial */}
            <div style={{
              display: t.photo_url ? 'none' : 'flex',
              position: 'absolute', inset: 0,
              alignItems: 'center', justifyContent: 'center',
              fontSize: '64px', fontWeight: 700,
              background: 'linear-gradient(135deg, var(--olive), var(--charcoal))',
              color: 'var(--cream)',
            }}>
              {t.name?.charAt(0)}
            </div>
            {/* Gradient overlay */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, rgba(39,41,37,0.5) 0%, transparent 100%)' }} />
            {/* Instrument badge */}
            <div style={{
              position: 'absolute', top: 12, right: 12,
              padding: '4px 12px', borderRadius: '999px',
              fontSize: '10px', fontWeight: 700,
              background: 'rgba(39,41,37,0.82)',
              color: 'var(--cream)', backdropFilter: 'blur(8px)',
              letterSpacing: '0.04em',
            }}>
              {t.instrument}
            </div>
          </div>
          {/* Info */}
          <div style={{ padding: '1.25rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--charcoal)', margin: '0 0 2px' }}>{t.name}</h3>
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--olive)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{t.title}</p>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--blush)', fontWeight: 600, margin: 0 }}>Tap to read quote →</p>
          </div>
        </div>

        {/* ── BACK ── */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: '20px', overflow: 'hidden',
          background: 'var(--charcoal)',
          border: '1px solid rgba(209,167,153,0.18)',
          boxShadow: '0 8px 32px rgba(39,41,37,0.18)',
          display: 'flex', flexDirection: 'column',
          padding: '2rem',
        }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--blush)', margin: '0 0 0.4rem' }}>{t.title}</p>
            <h3 style={{ fontFamily: '"Rockdale FREE", serif', fontSize: '1.35rem', color: 'var(--cream)', margin: 0 }}>{t.name}</h3>
          </div>

          <blockquote style={{
            flex: 1, fontSize: '0.9rem', lineHeight: 1.75,
            fontStyle: 'italic', color: 'rgba(248,246,237,0.82)',
            borderLeft: '2px solid var(--blush)', paddingLeft: '1rem', margin: '0 0 1.25rem',
          }}>
            "{t.quote}"
          </blockquote>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '1rem' }}>
            {(t.credentials || []).map((c, i) => (
              <p key={i} style={{ fontSize: '0.75rem', color: 'rgba(248,246,237,0.5)', margin: 0 }}>{c}</p>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {(t.tags || []).map(tag => (
              <span key={tag} style={{
                padding: '3px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 600,
                background: 'rgba(209,167,153,0.12)', color: 'var(--blush)',
                border: '1px solid rgba(209,167,153,0.2)',
              }}>{tag}</span>
            ))}
          </div>

          {(t.notes || []).length > 0 && (
            <div style={{ marginTop: '0.75rem' }}>
              {t.notes.map((n, i) => <p key={i} style={{ fontSize: '10px', color: 'rgba(248,246,237,0.3)', margin: '2px 0' }}>* {n}</p>)}
            </div>
          )}
          <p style={{ fontSize: '0.7rem', color: 'rgba(209,167,153,0.5)', marginTop: '1rem' }}>↩ Tap to flip back</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Values Tilt Card ──────────────────────────────────── */
function ValueCard({ icon, title, desc }) {
  const tilt = use3DTilt({ max: 10, scale: 1.03 });
  return (
    <div ref={tilt.ref} onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}
      style={{
        borderRadius: '16px', padding: '1.75rem',
        background: '#fff', border: '1px solid rgba(209,167,153,0.25)',
        boxShadow: '0 4px 16px rgba(39,41,37,0.06)', willChange: 'transform',
      }}
    >
      <div style={{ fontSize: '1.5rem', color: 'var(--blush)', marginBottom: '0.85rem' }}>{icon}</div>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: '#5a5a4a', margin: 0 }}>{desc}</p>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function OurTeachers() {
  const [teachers, setTeachers]       = useState([]);
  const [teachersLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });
      if (error) console.error('Failed to fetch teachers:', error);
      setTeachers(data || []);
      setLoading(false);
    })();
  }, []);

  const gridRef   = useScrollReveal({ from: { opacity: 0, y: 40, scale: 0.97 }, stagger: 0.1, duration: 0.7, ease: 'power3.out' });
  const valuesRef = useScrollReveal({ from: { opacity: 0, y: 30 }, stagger: 0.08, duration: 0.65, ease: 'power3.out' });

  return (
    <div
      className="-mt-[6.5rem] md:-mt-28 lg:-mt-[7.5rem]"
      style={{ fontFamily: '"Creato Display", sans-serif', background: 'var(--cream)', color: 'var(--charcoal)' }}
    >
      {/* ── 1. HERO ── */}
      <PageHero
        eyebrow="Our Educators"
        title="Meet the Teachers"
        subtitle="A curated team of professional musicians — each bringing their own expertise, warmth, and dedication to every lesson."
        stats={[
          { num: '6',    label: 'Expert Teachers' },
          { num: '4+',   label: 'Instruments' },
          { num: 'All',  label: 'Ages Welcome' },
        ]}
      />

      {/* ── 2. TEACHER GRID ── */}
      <section style={{ padding: '5rem 0 5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <ScrollFloat animationDuration={0.85} ease="back.out(1.7)" stagger={0.03} className="about-section-heading">
            Our Team
          </ScrollFloat>
          <p style={{ color: '#7a7a60', marginBottom: '3rem', marginTop: '0.5rem', fontSize: '0.88rem' }}>
            Click any card to read their personal teaching philosophy.
          </p>

          {teachersLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '1.75rem' }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ height: '480px', borderRadius: '20px', background: 'rgba(209,167,153,0.08)', border: '1px solid rgba(209,167,153,0.15)' }} />
              ))}
            </div>
          ) : teachers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94A3B8' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👩‍🏫</div>
              <p>Belum ada teacher yang dipublikasikan.</p>
            </div>
          ) : (
            <div ref={gridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '1.75rem', alignItems: 'stretch' }}>
              {teachers.map((t, i) => <TeacherCard key={t.id || i} t={t} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── 3. VALUES ── */}
      <section style={{ padding: '4rem 0 5rem', background: 'linear-gradient(180deg, var(--cream) 0%, rgba(80,85,60,0.05) 100%)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--olive)', marginBottom: '0.75rem' }}>Our Philosophy</p>
            <ScrollFloat animationDuration={0.85} ease="back.out(1.7)" stagger={0.03} className="about-section-heading">
              What We Stand For
            </ScrollFloat>
          </div>
          <div ref={valuesRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px,1fr))', gap: '1.25rem' }}>
            {VALUES.map(v => <ValueCard key={v.title} {...v} />)}
          </div>
        </div>
      </section>

      {/* ── 4. CTA ── */}
      <section style={{ padding: '5rem 0', textAlign: 'center', background: 'var(--charcoal)' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ width: 40, height: 2, background: 'var(--blush)', opacity: 0.5, margin: '0 auto 1.5rem', borderRadius: 2 }} />
          <h3 style={{ fontFamily: '"Rockdale FREE", serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--cream)', marginBottom: '0.75rem' }}>
            Ready to learn from the best?
          </h3>
          <p style={{ color: 'rgba(248,246,237,0.55)', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Book a trial class and we'll match you with the right teacher.
          </p>
          <a href="/OurPolicy" style={{
            display: 'inline-block', padding: '0.85rem 2.25rem',
            borderRadius: '999px', fontWeight: 700, fontSize: '0.95rem',
            background: 'var(--cream)', color: 'var(--charcoal)',
            textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(0,0,0,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.2)'; }}
          >
            Book a Trial Class
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
