// src/pages/user/ContactUs.jsx
import { useState } from 'react';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import ScrollFloat from '../../components/ScrollFloat';
import useScrollReveal from '../../hooks/useScrollReveal';
import use3DTilt from '../../hooks/use3DTilt';
import { WA_TRIAL } from '../../lib/waLinks';

/* ─── Contact info ──────────────────────────────────── */
const CONTACTS = [
  {
    icon: '💬',
    label: 'WhatsApp',
    value: '0818-359-580',
    sub: 'Fastest response — usually within a few hours',
    href: WA_TRIAL,
    cta: 'Chat on WhatsApp',
    accent: 'var(--olive)',
    accentLight: 'rgba(80,85,60,0.08)',
  },
  {
    icon: '✉️',
    label: 'Email',
    value: 'hello@gurunada.id',
    sub: 'For formal inquiries & documents',
    href: 'mailto:hello@gurunada.id',
    cta: 'Send an Email',
    accent: 'var(--blush)',
    accentLight: 'rgba(209,167,153,0.1)',
  },
  {
    icon: '◷',
    label: 'Operating Hours',
    value: 'Mon–Fri · 13:00–18:00\nSat · 09:00–14:00',
    sub: 'Sunday — Closed',
    href: null,
    cta: null,
    accent: 'var(--charcoal)',
    accentLight: 'rgba(39,41,37,0.05)',
  },
  {
    icon: '◎',
    label: 'Location',
    value: 'Jakarta, Indonesia',
    sub: 'Home visit available for select teachers',
    href: null,
    cta: null,
    accent: 'var(--brick)',
    accentLight: 'rgba(104,55,48,0.07)',
  },
];

const FAQS = [
  { q: 'How fast do you reply?', a: 'We typically reply via WhatsApp within a few hours on business days (Mon–Fri 13:00–18:00, Sat 09:00–14:00).' },
  { q: 'Can I ask about scheduling via WhatsApp?', a: 'Absolutely! WhatsApp is our preferred channel for quick questions about schedules, availability, and anything else.' },
  { q: 'Do you offer trial classes?', a: 'Yes — and it starts with a conversation. Tap "Chat on WhatsApp" above and we\'ll arrange a trial session that fits your schedule.' },
  { q: 'Is there a home visit option?', a: 'Home visits are available for select teachers and locations. Ask us on WhatsApp to check availability.' },
];

/* ─── Contact Card ──────────────────────────────────── */
function ContactCard({ item }) {
  const tilt = use3DTilt({ max: 8, scale: 1.02, speed: 600 });
  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={{
        borderRadius: '20px', overflow: 'hidden',
        background: '#fff',
        border: '1px solid rgba(209,167,153,0.22)',
        boxShadow: '0 4px 20px rgba(39,41,37,0.07)',
        display: 'flex', flexDirection: 'column',
        willChange: 'transform',
      }}
    >
      {/* Accent top stripe */}
      <div style={{ height: 4, background: item.accent, opacity: 0.7 }} />

      <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Icon + label row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: item.accentLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.25rem',
          }}>{item.icon}</div>
          <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: item.accent, margin: 0 }}>
            {item.label}
          </p>
        </div>

        {/* Value */}
        <p style={{ fontFamily: '"Rockdale FREE", serif', fontSize: '1rem', color: 'var(--charcoal)', margin: 0, whiteSpace: 'pre-line', fontWeight: 700 }}>
          {item.value}
        </p>

        {/* Sub */}
        <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: 0 }}>{item.sub}</p>

        {/* CTA */}
        {item.cta && item.href && (
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginTop: 'auto',
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.65rem 1.25rem', borderRadius: '999px',
              background: item.accentLight,
              border: `1px solid ${item.accent}30`,
              color: item.accent, textDecoration: 'none',
              fontSize: '0.82rem', fontWeight: 700,
              transition: 'background 0.2s ease, transform 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = item.accent; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = item.accentLight; e.currentTarget.style.color = item.accent; e.currentTarget.style.transform = ''; }}
          >
            {item.cta}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

/* ─── FAQ Item ──────────────────────────────────────── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(209,167,153,0.18)', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--charcoal)' }}>{q}</span>
        <span style={{ color: 'var(--blush)', fontSize: '1.3rem', flexShrink: 0, marginLeft: '1rem', transform: open ? 'rotate(45deg)' : '', display: 'inline-block', transition: 'transform 0.3s ease' }}>+</span>
      </button>
      <div style={{ maxHeight: open ? '200px' : '0', overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
        <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.75, paddingBottom: '1.2rem', margin: 0 }}>{a}</p>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────── */
export default function ContactUs() {
  const cardsRef = useScrollReveal({ from: { opacity: 0, y: 35, scale: 0.97 }, stagger: 0.1, duration: 0.7, ease: 'power3.out' });
  const faqRef   = useScrollReveal({ from: { opacity: 0, y: 28 }, duration: 0.65, ease: 'power3.out' });

  return (
    <div
      className="-mt-[6.5rem] md:-mt-28 lg:-mt-[7.5rem]"
      style={{ fontFamily: '"Creato Display", sans-serif', background: 'var(--cream)', color: 'var(--charcoal)' }}
    >
      {/* ── 1. HERO ── */}
      <PageHero
        eyebrow="Get In Touch"
        title="Contact Us"
        subtitle="Questions about classes, schedules, or events? We'd love to hear from you — just reach out on WhatsApp."
      />

      {/* ── 2. CONTACT CARDS ── */}
      <section style={{ padding: '5rem 0 4rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div ref={cardsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: '1.25rem' }}>
            {CONTACTS.map(item => <ContactCard key={item.label} item={item} />)}
          </div>
        </div>
      </section>

      {/* ── 3. PRIMARY CTA ── */}
      <section style={{ padding: '0 0 4rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{
            borderRadius: '24px', overflow: 'hidden',
            background: 'linear-gradient(135deg, var(--charcoal) 0%, var(--olive) 100%)',
            boxShadow: '0 16px 48px rgba(39,41,37,0.2)',
            padding: '3.5rem 2.5rem', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
            position: 'relative',
          }}>
            {/* Decorative diagonal lines */}
            <div aria-hidden="true" style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              backgroundImage: 'repeating-linear-gradient(-14deg, transparent 0px, transparent 28px, rgba(209,167,153,0.05) 28px, rgba(209,167,153,0.05) 29px)',
            }} />

            <div style={{ width: 56, height: 56, borderRadius: 16, background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
              <svg viewBox="0 0 24 24" fill="white" style={{ width: 28, height: 28 }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontFamily: '"Rockdale FREE", serif', fontSize: 'clamp(1.5rem,3vw,2rem)', color: 'var(--cream)', margin: '0 0 0.5rem' }}>
                Have a question? Chat with us.
              </h2>
              <p style={{ color: 'rgba(248,246,237,0.6)', fontSize: '0.9rem', maxWidth: '42ch', margin: '0 auto 1.75rem' }}>
                The fastest way to reach us is via WhatsApp. We're happy to help with class inquiries, scheduling, or anything else.
              </p>
              <a
                href={WA_TRIAL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.9rem 2.25rem', borderRadius: '999px',
                  background: 'var(--cream)', color: 'var(--charcoal)',
                  fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.28)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
              >
                Chat on WhatsApp
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
                  <polyline points="9,18 15,12 9,6" />
                </svg>
              </a>
              <p style={{ color: 'rgba(248,246,237,0.28)', fontSize: '0.75rem', marginTop: '1rem' }}>+62 0818-359-580</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. FAQ ── */}
      <section style={{ padding: '1rem 0 5rem' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--olive)', marginBottom: '0.75rem' }}>Quick Answers</p>
            <ScrollFloat animationDuration={0.85} ease="back.out(1.7)" stagger={0.03} className="about-section-heading">
              Frequently Asked
            </ScrollFloat>
          </div>
          <div ref={faqRef} style={{ background: '#fff', borderRadius: '20px', padding: '0.5rem 2rem', border: '1px solid rgba(209,167,153,0.2)', boxShadow: '0 4px 20px rgba(39,41,37,0.06)' }}>
            {FAQS.map(item => <FaqItem key={item.q} {...item} />)}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
