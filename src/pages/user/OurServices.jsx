// src/pages/user/OurServices.jsx
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import ScrollFloat from '../../components/ScrollFloat';
import MagicRings from '../../components/MagicRings';
import useScrollReveal from '../../hooks/useScrollReveal';
import use3DTilt from '../../hooks/use3DTilt';

/* ─── Data ──────────────────────────────────────────────── */
const INSTRUMENTS = [
  { name: 'Piano',   icon: '♩' },
  { name: 'Violin',  icon: '♪' },
  { name: 'Cello',   icon: '♫' },
  { name: 'Vocal',   icon: '♬' },
  { name: 'Trumpet', icon: '𝄞' },
  { name: 'Piano',   icon: '♩' },
  { name: 'Violin',  icon: '♪' },
  { name: 'Cello',   icon: '♫' },
  { name: 'Vocal',   icon: '♬' },
  { name: 'Trumpet', icon: '𝄞' },
];

const LESSON_TYPES = [
  {
    title: 'Trial Class',
    freq: '1× (one-time)',
    duration: '60 minutes',
    desc: 'A single introductory session to experience our teaching style before committing to a full program.',
    highlight: false,
    badge: 'Start Here',
  },
  {
    title: 'Regular Private Lesson',
    freq: '1× per week',
    duration: '60 minutes / session',
    desc: 'Our standard program — one dedicated session per week with your assigned teacher, following a structured and personalized curriculum.',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    title: 'Intensive Program',
    freq: '2× per week',
    duration: '60 minutes / session',
    desc: 'For students who want to accelerate progress, prepare for exams, or build consistency faster with two lessons per week.',
    highlight: false,
    badge: 'Accelerated',
  },
];

const SCHEDULE = [
  { day: 'Monday – Friday', time: '13:00 – 18:00' },
  { day: 'Saturday',        time: '09:00 – 14:00' },
  { day: 'Sunday',          time: 'Closed' },
];

const NOTES = [
  'All lessons are conducted one-on-one (private) with a dedicated teacher.',
  'Lesson duration is fixed at 60 minutes per session.',
  'Schedule is arranged on a weekly, fixed-day basis upon enrollment.',
  'Home visit options are available for select teachers (subject to availability).',
  'Makeup classes are available (max 2× per month, 24h notice required).',
];

/* ─── Sub-components ─────────────────────────────────────── */

function LessonCard({ lt }) {
  const tilt = use3DTilt({ max: 9, scale: 1.03 });
  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={{
        borderRadius: '20px', overflow: 'hidden',
        border: lt.highlight ? '2px solid var(--charcoal)' : '1px solid rgba(209,167,153,0.3)',
        background: '#fff',
        boxShadow: lt.highlight ? '0 12px 40px rgba(39,41,37,0.16)' : '0 4px 20px rgba(39,41,37,0.07)',
        display: 'flex', flexDirection: 'column',
        willChange: 'transform',
        position: 'relative',
      }}
    >
      {/* Subtle CSS shimmer on highlighted card — no WebGL needed at this scale */}
      {lt.highlight && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          borderRadius: '20px', overflow: 'hidden',
          background: 'radial-gradient(ellipse 80% 70% at 50% 30%, rgba(209,167,153,0.08) 0%, transparent 70%)',
          animation: 'hero-breathe 5s ease-in-out infinite',
        }} />
      )}

      {/* Header strip */}
      <div style={{
        position: 'relative', zIndex: 1,
        padding: '1.1rem 1.5rem',
        background: lt.highlight ? 'linear-gradient(90deg, var(--charcoal) 0%, var(--olive) 100%)' : 'var(--cream)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: lt.highlight ? 'var(--cream)' : 'var(--charcoal)', margin: 0 }}>{lt.title}</h3>
        <span style={{
          fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.08em',
          padding: '3px 10px', borderRadius: '999px',
          background: lt.highlight ? 'rgba(248,246,237,0.15)' : 'rgba(39,41,37,0.07)',
          color: lt.highlight ? 'var(--cream)' : 'var(--olive)',
          border: lt.highlight ? '1px solid rgba(248,246,237,0.25)' : '1px solid rgba(80,85,60,0.2)',
        }}>{lt.badge}</span>
      </div>

      {/* Body */}
      <div style={{ position: 'relative', zIndex: 1, padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Freq + Duration rows */}
        {[
          { icon: '📅', label: 'Frequency', value: lt.freq },
          { icon: '⏱', label: 'Duration',  value: lt.duration },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg, var(--charcoal), var(--olive))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem',
            }}>{row.icon}</div>
            <div>
              <p style={{ fontSize: '0.62rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{row.label}</p>
              <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--charcoal)', margin: 0 }}>{row.value}</p>
            </div>
          </div>
        ))}
        <div style={{ height: 1, background: 'rgba(39,41,37,0.08)' }} />
        <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: '#475569', margin: 0, flex: 1 }}>{lt.desc}</p>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function OurServices() {
  const cardsRef    = useScrollReveal({ from: { opacity: 0, y: 40, scale: 0.97 }, stagger: 0.12, duration: 0.7, ease: 'power3.out' });
  const scheduleRef = useScrollReveal({ from: { opacity: 0, y: 30 }, stagger: 0.1, duration: 0.65, ease: 'power3.out' });

  return (
    <div
      className="-mt-[6.5rem] md:-mt-28 lg:-mt-[7.5rem]"
      style={{ fontFamily: '"Creato Display", sans-serif', background: 'var(--cream)', color: 'var(--charcoal)' }}
    >
      {/* ── 1. HERO ── */}
      <PageHero
        eyebrow="What We Offer"
        title="Our Services"
        subtitle="Private music lessons tailored to your pace, schedule, and goals — for all ages and levels."
        stats={[
          { num: '60 min', label: 'Per Session' },
          { num: '1-on-1', label: 'Private Only' },
          { num: '5+',     label: 'Instruments' },
        ]}
      />

      {/* ── 2. LESSON TYPES ── */}
      <section style={{ padding: '5rem 0 4rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
            <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--olive)', marginBottom: '0.75rem' }}>Lesson Programs</p>
            <ScrollFloat animationDuration={0.85} ease="back.out(1.7)" stagger={0.03} className="about-section-heading">
              Frequency &amp; Duration
            </ScrollFloat>
          </div>
          <div ref={cardsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '1.5rem' }}>
            {LESSON_TYPES.map((lt, i) => <LessonCard key={i} lt={lt} />)}
          </div>
        </div>
      </section>

      {/* ── 3. SCHEDULE + NOTES ── */}
      <section style={{ padding: '0 0 5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div ref={scheduleRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '1.5rem' }}>
            {/* Schedule card */}
            <div style={{
              borderRadius: '20px', background: '#fff',
              border: '1px solid rgba(209,167,153,0.25)',
              padding: '2rem', boxShadow: '0 4px 20px rgba(39,41,37,0.06)',
            }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--olive)', marginBottom: '0.5rem' }}>Available Hours</p>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '1.5rem' }}>Schedule</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {SCHEDULE.map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.75rem 1rem', borderRadius: '12px',
                    background: s.day === 'Sunday' ? 'rgba(148,163,184,0.06)' : 'var(--cream)',
                    border: '1px solid', borderColor: s.day === 'Sunday' ? 'rgba(148,163,184,0.15)' : 'rgba(209,167,153,0.2)',
                  }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: s.day === 'Sunday' ? '#94A3B8' : 'var(--charcoal)' }}>{s.day}</span>
                    <span style={{ fontSize: '0.85rem', color: s.day === 'Sunday' ? '#94A3B8' : 'var(--olive)', fontWeight: 500 }}>{s.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes card */}
            <div style={{
              borderRadius: '20px',
              background: 'linear-gradient(135deg, var(--charcoal) 0%, var(--olive) 100%)',
              padding: '2rem', boxShadow: '0 8px 32px rgba(39,41,37,0.18)',
            }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--blush)', marginBottom: '0.5rem' }}>Good To Know</p>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--cream)', marginBottom: '1.5rem' }}>General Notes</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {NOTES.map((note, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blush)', flexShrink: 0, marginTop: 7 }} />
                    <p style={{ fontSize: '0.85rem', lineHeight: 1.65, color: 'rgba(248,246,237,0.78)', margin: 0 }}>{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. INSTRUMENTS MARQUEE ── */}
      <section style={{ padding: '3rem 0', overflow: 'hidden', background: 'rgba(80,85,60,0.04)' }}>
        <p style={{ textAlign: 'center', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--olive)', marginBottom: '1.5rem' }}>Instruments We Teach</p>
        <div style={{
          display: 'flex', gap: '1.5rem',
          animation: 'marquee 18s linear infinite',
          width: 'max-content',
        }}>
          {INSTRUMENTS.map((inst, i) => (
            <div key={i} style={{
              padding: '0.85rem 1.75rem', borderRadius: '14px',
              background: '#fff', border: '1px solid rgba(209,167,153,0.25)',
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              fontSize: '0.95rem', fontWeight: 600, color: 'var(--charcoal)',
              boxShadow: '0 2px 12px rgba(39,41,37,0.06)',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: '1.2rem', color: 'var(--blush)' }}>{inst.icon}</span>
              {inst.name}
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. CTA ── */}
      <section style={{ padding: '5rem 0', textAlign: 'center', background: 'var(--charcoal)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <MagicRings color="#D1A799" colorTwo="#683730" ringCount={4} speed={0.5} opacity={0.5}
            attenuation={6} lineThickness={1.8} baseRadius={0.32} radiusStep={0.1}
            noiseAmount={0.02} followMouse={true} mouseInfluence={0.12} parallax={0.04} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ width: 40, height: 2, background: 'var(--blush)', opacity: 0.45, margin: '0 auto 1.5rem', borderRadius: 2 }} />
          <h3 style={{ fontFamily: '"Rockdale FREE", serif', fontSize: 'clamp(1.5rem,3vw,2rem)', color: 'var(--cream)', marginBottom: '0.75rem' }}>
            Ready to start your lesson?
          </h3>
          <p style={{ color: 'rgba(248,246,237,0.55)', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Book a trial class and experience our teaching style first-hand.
          </p>
          <a href="/OurPolicy" style={{
            display: 'inline-block', padding: '0.85rem 2.25rem',
            borderRadius: '999px', fontWeight: 700, fontSize: '0.95rem',
            background: 'var(--cream)', color: 'var(--charcoal)',
            textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(0,0,0,0.3)'; }}
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
