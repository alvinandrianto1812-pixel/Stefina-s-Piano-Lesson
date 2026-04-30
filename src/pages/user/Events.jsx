// src/pages/user/Events.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import ScrollFloat from '../../components/ScrollFloat';
import useScrollReveal from '../../hooks/useScrollReveal';
import use3DTilt from '../../hooks/use3DTilt';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthProvider';
import { WA_TRIAL } from '../../lib/waLinks';

/* ─── Helpers ───────────────────────────────────────── */
function isPast(ev) {
  if (!ev.event_date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(ev.event_date) < today;
}

function fmtDate(dateStr) {
  if (!dateStr) return { month: '---', day: '--', year: '----' };
  const d = new Date(dateStr + 'T00:00:00');
  return {
    month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    day: String(d.getDate()).padStart(2, '0'),
    year: String(d.getFullYear()),
  };
}

/* ─── Event Card ────────────────────────────────────── */
function EventCard({ ev, isLast, user }) {
  const [expanded, setExpanded] = useState(false);
  const tilt = use3DTilt({ max: 5, scale: 1.01, speed: 600 });
  const past = isPast(ev);
  const { month, day, year } = fmtDate(ev.event_date);
  const gcalDate = ev.event_date ? ev.event_date.replace(/-/g, '') : '';
  const gcalUrl  = `https://www.google.com/calendar/event?action=TEMPLATE&text=${encodeURIComponent(ev.title)}&dates=${gcalDate}&location=${encodeURIComponent(ev.city || ev.location || '')}`;

  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={{
        borderRadius: '20px', overflow: 'hidden',
        border: ev.highlight ? '2px solid var(--charcoal)' : '1px solid rgba(209,167,153,0.2)',
        background: '#fff',
        boxShadow: ev.highlight ? '0 8px 32px rgba(39,41,37,0.14)' : '0 4px 16px rgba(39,41,37,0.06)',
        marginBottom: '1.25rem',
        opacity: past ? 0.62 : 1,
        willChange: 'transform',
      }}
    >
      <div style={{ display: 'flex', gap: 0 }}>
        {/* DATE column */}
        <div style={{
          flexShrink: 0, width: 80, display: 'flex', flexDirection: 'column',
          background: ev.highlight ? 'var(--charcoal)' : 'var(--cream)',
          borderRight: '1px solid rgba(209,167,153,0.15)',
        }}>
          <div style={{
            padding: '0.9rem 0.5rem 0.4rem',
            textAlign: 'center',
            fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.18em',
            color: ev.highlight ? 'var(--blush)' : 'var(--blush)',
          }}>{month}</div>
          <div style={{
            textAlign: 'center', fontSize: '2.2rem', fontWeight: 800, lineHeight: 1,
            fontFamily: '"Rockdale FREE", serif',
            color: ev.highlight ? 'var(--cream)' : 'var(--charcoal)',
            padding: '0 0.5rem 0.5rem',
          }}>{day}</div>
          <div style={{ textAlign: 'center', fontSize: '0.6rem', color: ev.highlight ? 'rgba(248,246,237,0.4)' : '#94A3B8', paddingBottom: '0.75rem' }}>{year}</div>
        </div>

        {/* CONTENT */}
        <div style={{ padding: '1.25rem 1.5rem', flex: 1, minWidth: 0 }}>
          {/* Tags */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
            {past && (
              <span style={{ padding: '2px 10px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, background: 'rgba(148,163,184,0.12)', color: '#94A3B8', border: '1px solid rgba(148,163,184,0.2)' }}>Past</span>
            )}
            {(ev.tags || []).map(tag => (
              <span key={tag} style={{
                padding: '2px 10px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em',
                background: ev.highlight ? 'rgba(39,41,37,0.07)' : 'rgba(80,85,60,0.07)',
                color: ev.highlight ? 'var(--charcoal)' : 'var(--olive)',
                border: '1px solid rgba(80,85,60,0.12)',
              }}>{tag}</span>
            ))}
          </div>

          {/* Title */}
          <h2 style={{ fontFamily: '"Rockdale FREE", serif', fontSize: 'clamp(1.05rem,2.2vw,1.3rem)', color: 'var(--charcoal)', margin: '0 0 4px', lineHeight: 1.3 }}>
            {ev.title}
          </h2>
          {ev.subtitle && <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: '0 0 0.75rem', fontStyle: 'italic' }}>{ev.subtitle}</p>}

          {/* Meta row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
            {(ev.time_start || ev.time_end) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--blush)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>
                <span style={{ fontSize: '0.78rem', color: '#475569' }}>{ev.time_start}{ev.time_end && ` – ${ev.time_end}`}</span>
              </div>
            )}
            {ev.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--blush)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span style={{ fontSize: '0.78rem', color: '#475569' }}>{ev.location}{ev.city && ` · ${ev.city}`}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: '#475569', margin: 0, maxWidth: '60ch' }}>{ev.description}</p>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              marginTop: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px',
              fontSize: '0.78rem', fontWeight: 700, color: 'var(--olive)',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            {expanded ? 'Hide Details' : 'View Details'}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              style={{ width: 12, height: 12, transform: expanded ? 'rotate(90deg)' : '', transition: 'transform 0.2s' }}>
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </button>

          {/* Expanded panel */}
          {expanded && (
            <div style={{
              marginTop: '1rem', padding: '1rem 1.25rem', borderRadius: '14px',
              background: 'var(--cream)', border: '1px solid rgba(209,167,153,0.2)',
              boxShadow: '0 2px 12px rgba(39,41,37,0.06)',
            }}>
              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0 0 0.75rem' }}>
                📅 <strong style={{ color: 'var(--charcoal)' }}>{month} {day}, {year}</strong>
                {ev.time_start && ` · ${ev.time_start}`}{ev.time_end && ` – ${ev.time_end}`}
              </p>
              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0 0 1rem' }}>
                📍 {ev.location}{ev.location_detail && `, ${ev.location_detail}`}{ev.city && ` · ${ev.city}`}
              </p>
              {past ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, background: 'rgba(148,163,184,0.1)', color: '#94A3B8', border: '1px solid rgba(148,163,184,0.2)', cursor: 'not-allowed' }}>
                  🗓 Event has passed
                </span>
              ) : user ? (
                <a href={gcalUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, background: 'var(--charcoal)', color: 'var(--cream)', textDecoration: 'none', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--olive)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--charcoal)'}
                >+ Add to Google Calendar</a>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8' }}>🔒 Login to save to Calendar —</span>
                  <Link to="/auth" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--olive)', textDecoration: 'underline' }}>Login here →</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────── */
export default function Events() {
  const { user } = useAuth();
  const [events, setEvents]     = useState([]);
  const [evLoading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('events').select('*').eq('is_published', true)
      .order('event_date', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('events fetch error:', error);
        setEvents(data || []);
        setLoading(false);
      });
  }, []);

  const listRef = useScrollReveal({ from: { opacity: 0, y: 30 }, stagger: 0.08, duration: 0.65, ease: 'power3.out' });

  const upcoming = events.filter(e => !isPast(e));
  const past     = events.filter(e => isPast(e));

  return (
    <div
      className="-mt-[6.5rem] md:-mt-28 lg:-mt-[7.5rem]"
      style={{ fontFamily: '"Creato Display", sans-serif', background: 'var(--cream)', color: 'var(--charcoal)' }}
    >
      {/* ── 1. HERO ── */}
      <PageHero
        eyebrow="What's On"
        title="Our Events"
        subtitle="Concerts, workshops, recitals, and masterclasses — be part of our musical milestones."
        stats={[
          { num: upcoming.length > 0 ? String(upcoming.length) : '—', label: 'Upcoming Events' },
          { num: past.length > 0     ? String(past.length)     : '—', label: 'Past Events' },
        ]}
      />

      {/* ── 2. EVENTS LIST ── */}
      <section style={{ padding: '5rem 0 3rem' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 1.5rem' }}>
          {evLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ height: 130, borderRadius: '20px', background: 'rgba(209,167,153,0.08)', border: '1px solid rgba(209,167,153,0.15)' }} />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>♩</div>
              <p style={{ color: '#94A3B8' }}>No events scheduled at the moment. Check back soon!</p>
            </div>
          ) : (
            <>
              {upcoming.length > 0 && (
                <div>
                  <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--olive)', marginBottom: '1.5rem' }}>Upcoming</p>
                  <div ref={listRef}>
                    {upcoming.map((ev, i) => <EventCard key={ev.id} ev={ev} isLast={i === upcoming.length - 1} user={user} />)}
                  </div>
                </div>
              )}
              {past.length > 0 && (
                <div style={{ marginTop: '3rem' }}>
                  <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '1.5rem' }}>Past Events</p>
                  {past.map((ev, i) => <EventCard key={ev.id} ev={ev} isLast={i === past.length - 1} user={user} />)}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── 3. CTA ── */}
      <section style={{ padding: '1rem 0 5rem' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{
            borderRadius: '24px', padding: '3rem 2.5rem', textAlign: 'center',
            background: 'var(--charcoal)', boxShadow: '0 16px 48px rgba(39,41,37,0.2)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(-14deg, transparent 0px, transparent 28px, rgba(209,167,153,0.04) 28px, rgba(209,167,153,0.04) 29px)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ width: 36, height: 2, background: 'var(--blush)', opacity: 0.5, margin: '0 auto 1.5rem', borderRadius: 2 }} />
              <ScrollFloat animationDuration={0.85} ease="back.out(1.7)" stagger={0.03} className="policy-cta-heading">
                Start Your Journey
              </ScrollFloat>
              <p style={{ color: 'rgba(248,246,237,0.55)', fontSize: '0.9rem', marginBottom: '2rem', marginTop: '0.5rem' }}>
                Contact us on WhatsApp to schedule a trial lesson.
              </p>
              <a
                href={WA_TRIAL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.85rem 2.25rem', borderRadius: '999px',
                  background: 'var(--cream)', color: 'var(--charcoal)',
                  fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(0,0,0,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.2)'; }}
              >
                Schedule a Trial Lesson
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
