import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import ScrollFloat from '../../components/ScrollFloat';
import useScrollReveal from '../../hooks/useScrollReveal';
import use3DTilt from '../../hooks/use3DTilt';

const POLICY_KEY = 'gurunada_policy_accepted';

const POLICIES = [
  {
    section: '01', title: 'Trial & Registration', icon: '♩',
    items: [
      'A trial class is required before full enrollment to ensure the program is a good fit.',
      'Registration is completed by filling out the student questionnaire and uploading proof of payment.',
      'Enrollment is confirmed only after admin verification of the payment.',
      'Each student is registered individually; siblings require separate registration forms.',
    ],
  },
  {
    section: '02', title: 'Scheduling & Attendance', icon: '◷',
    items: [
      'Lessons are scheduled on a weekly, fixed-day basis (Monday–Friday 13:00–18:00; Saturday 09:00–14:00).',
      'Students are expected to attend every scheduled lesson consistently.',
      'Please arrive on time. Late arrivals will not receive extended lesson time.',
      'If a student is absent without prior notice, the lesson will be considered completed.',
    ],
  },
  {
    section: '03', title: 'Rescheduling & Makeup Classes', icon: '↺',
    items: [
      'Reschedule requests must be submitted at least 24 hours in advance via WhatsApp.',
      'Makeup classes are available subject to teacher and slot availability.',
      'A maximum of 2 makeup classes per month is allowed.',
      'Last-minute cancellations (under 2 hours notice) are not eligible for makeup.',
    ],
  },
  {
    section: '04', title: 'Payment', icon: '◈',
    items: [
      'Monthly tuition is due in advance at the beginning of each month.',
      'Payment is made via bank transfer; proof of payment must be uploaded through the website.',
      'A late payment fee may apply after a grace period of 5 days.',
      'No refund will be issued for missed lessons without prior notice.',
    ],
  },
  {
    section: '05', title: 'Student Conduct', icon: '✦',
    items: [
      'Students are expected to practice regularly between lessons as guided by their teacher.',
      'Respectful conduct toward teachers and studio staff is required at all times.',
      'Students should bring their own books and materials unless otherwise arranged.',
      'GuruNada reserves the right to discontinue lessons if conduct is repeatedly disruptive.',
    ],
  },
  {
    section: '06', title: 'Communication', icon: '◎',
    items: [
      'All official communication is conducted via WhatsApp with the admin number.',
      'Feedback, concerns, or special requests should be communicated promptly.',
      'Changes to class schedules will be announced at least 3 days in advance when possible.',
      'Parents of student minors are encouraged to stay informed of lesson progress.',
    ],
  },
];

/* ─── Policy Card with 3D tilt ──────────────────────────── */
function PolicyCard({ pol, index }) {
  const tilt = use3DTilt({ max: 5, scale: 1.01, speed: 600 });
  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={{
        borderRadius: '16px', overflow: 'hidden',
        border: '1px solid rgba(209,167,153,0.2)',
        background: '#fff',
        boxShadow: '0 4px 16px rgba(39,41,37,0.06)',
        willChange: 'transform',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '1rem 1.5rem',
        display: 'flex', alignItems: 'center', gap: '1rem',
        background: 'linear-gradient(90deg, var(--charcoal) 0%, var(--olive) 100%)',
      }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--cream)', opacity: 0.45, letterSpacing: '0.1em' }}>{pol.section}</span>
        <span style={{ fontSize: '1rem', color: 'var(--blush)' }}>{pol.icon}</span>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--cream)', margin: 0 }}>{pol.title}</h2>
      </div>
      {/* Items */}
      <div>
        {pol.items.map((item, j) => (
          <div key={j} style={{
            padding: '0.85rem 1.5rem',
            display: 'flex', alignItems: 'flex-start', gap: '0.85rem',
            borderTop: j > 0 ? '1px solid rgba(209,167,153,0.12)' : 'none',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--olive)', flexShrink: 0, marginTop: 8 }} />
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: '#475569', margin: 0 }}>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function OurPolicy() {
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const [scrollProgress,    setScrollProgress]    = useState(0);
  const [scrolledToBottom,  setScrolledToBottom]  = useState(false);
  const [accepted,          setAccepted]          = useState(false);

  const cardsRef = useScrollReveal({ from: { opacity: 0, y: 35 }, stagger: 0.09, duration: 0.65, ease: 'power3.out' });

  /* Scroll progress + bottom detection */
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const progress   = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      setScrollProgress(progress);
      const scrollBottom = window.innerHeight + window.scrollY;
      if (scrollBottom >= document.documentElement.scrollHeight - 120) setScrolledToBottom(true);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAccept = () => {
    sessionStorage.setItem(POLICY_KEY, 'true');
    navigate('/Questionnaire');
  };

  const canProceed = accepted && scrolledToBottom;

  return (
    <div
      className="-mt-[6.5rem] md:-mt-28 lg:-mt-[7.5rem]"
      style={{ fontFamily: '"Creato Display", sans-serif', background: 'var(--cream)', color: 'var(--charcoal)' }}
    >
      {/* ── Scroll Progress Bar (fixed at very top) ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 9999, background: 'rgba(209,167,153,0.15)' }}>
        <div style={{
          height: '100%', background: 'linear-gradient(90deg, var(--blush), var(--brick))',
          width: `${scrollProgress * 100}%`,
          transition: 'width 0.1s linear',
          boxShadow: '0 0 8px rgba(209,167,153,0.5)',
        }} />
      </div>

      {/* ── 1. HERO ── */}
      <PageHero
        eyebrow="Before You Enroll"
        title="Our Policy"
        subtitle="Please read all policies carefully. You must acknowledge these guidelines before proceeding to registration."
      >
        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.75rem', fontSize: '0.82rem', color: 'rgba(248,246,237,0.5)' }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: 'var(--cream)', color: 'var(--charcoal)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', fontWeight: 800, flexShrink: 0,
          }}>1</div>
          <span style={{ color: 'var(--cream)', fontWeight: 600 }}>Read Our Policy</span>
          <span style={{ margin: '0 0.25rem' }}>→</span>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', flexShrink: 0,
          }}>2</div>
          <span>Fill Registration</span>
        </div>
      </PageHero>

      {/* ── 2. POLICY CONTENT ── */}
      <section style={{ padding: '4rem 0 2rem' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Intro note */}
          <div style={{
            borderRadius: '16px', padding: '1.25rem 1.5rem',
            background: '#fff', border: '1px solid rgba(209,167,153,0.2)',
            borderLeft: '4px solid var(--charcoal)',
            display: 'flex', gap: '1rem', alignItems: 'flex-start',
            boxShadow: '0 4px 16px rgba(39,41,37,0.06)',
          }}>
            <span style={{ fontSize: '1.25rem', marginTop: 2 }}>📋</span>
            <div>
              <p style={{ fontWeight: 700, color: 'var(--charcoal)', margin: '0 0 4px' }}>Please read this document in full.</p>
              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
                By clicking "I Have Read &amp; Agree" at the bottom, you confirm that you understand and agree to all of GuruNada's studio policies listed below.
              </p>
            </div>
          </div>

          {/* Scroll progress hint */}
          <p style={{ fontSize: '0.75rem', color: 'var(--blush)', textAlign: 'right', margin: 0 }}>
            {scrolledToBottom ? '✓ You have read all policies' : `${Math.round(scrollProgress * 100)}% read — scroll to the bottom to proceed`}
          </p>

          {/* Policy cards */}
          <div ref={cardsRef} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {POLICIES.map((pol, i) => <PolicyCard key={i} pol={pol} index={i} />)}
          </div>

          <div ref={bottomRef} />
        </div>
      </section>

      {/* ── 3. ACCEPT SECTION ── */}
      <section style={{ padding: '2rem 0 5rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{
            borderRadius: '24px', overflow: 'hidden',
            position: 'relative',
            background: 'var(--charcoal)',
            boxShadow: '0 16px 48px rgba(39,41,37,0.2)',
          }}>
            {/* CSS-only decoration — diagonal staff lines, consistent with PageHero */}
            <div aria-hidden="true" style={{
              position: 'absolute', inset: 0, zIndex: 0,
              backgroundImage: 'repeating-linear-gradient(-14deg, transparent 0px, transparent 28px, rgba(209,167,153,0.04) 28px, rgba(209,167,153,0.04) 29px)',
            }} />
            <div aria-hidden="true" style={{
              position: 'absolute', inset: 0, zIndex: 0,
              background: 'radial-gradient(ellipse 70% 60% at 80% 20%, rgba(209,167,153,0.1) 0%, transparent 60%)',
              animation: 'hero-breathe 6s ease-in-out infinite',
            }} />

            <div style={{ position: 'relative', zIndex: 1, padding: '3rem 2.5rem', textAlign: 'center' }}>
              <div style={{ width: 36, height: 2, background: 'var(--blush)', opacity: 0.5, margin: '0 auto 1.5rem', borderRadius: 2 }} />

              <ScrollFloat as="h3" animationDuration={0.85} ease="back.out(1.7)" stagger={0.03} className="policy-cta-heading">
                Almost There
              </ScrollFloat>

              <p style={{ fontSize: '0.9rem', color: 'rgba(248,246,237,0.65)', maxWidth: '440px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
                By clicking the button below, you confirm that you have read and understood all of GuruNada's studio policies and agree to abide by them.
              </p>

              {/* Checkbox */}
              <label style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
                cursor: 'pointer', marginBottom: '2rem',
                color: 'rgba(248,246,237,0.82)', fontSize: '0.9rem', userSelect: 'none',
              }}>
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={e => setAccepted(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--blush)' }}
                />
                I have read and agree to all studio policies above.
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <button
                  onClick={handleAccept}
                  disabled={!canProceed}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.9rem 2.5rem', borderRadius: '999px',
                    fontWeight: 700, fontSize: '0.95rem', border: 'none',
                    cursor: canProceed ? 'pointer' : 'not-allowed',
                    background: canProceed ? 'var(--cream)' : 'rgba(248,246,237,0.1)',
                    color: canProceed ? 'var(--charcoal)' : 'rgba(248,246,237,0.2)',
                    boxShadow: canProceed ? '0 4px 20px rgba(0,0,0,0.25)' : 'none',
                    transition: 'all 0.35s ease',
                  }}
                  onMouseEnter={e => { if (canProceed) { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(0,0,0,0.3)'; }}}
                  onMouseLeave={e => { if (canProceed) { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.25)'; }}}
                >
                  I Have Read &amp; Agree
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                </button>

                <button onClick={() => navigate(-1)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '0.82rem', color: 'rgba(248,246,237,0.3)', padding: '0.5rem 1rem',
                }}>
                  ← Go Back
                </button>

                {!scrolledToBottom && (
                  <p style={{ fontSize: '0.75rem', color: 'rgba(248,246,237,0.28)', marginTop: '0.25rem' }}>
                    ↓ Scroll to the bottom to enable the button
                  </p>
                )}
                {scrolledToBottom && !accepted && (
                  <p style={{ fontSize: '0.75rem', color: 'rgba(248,246,237,0.28)', marginTop: '0.25rem' }}>
                    Please check the box above to continue
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
