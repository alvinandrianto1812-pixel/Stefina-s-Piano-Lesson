// src/components/TestimonialSlider.jsx
import { useState } from 'react';
import './TestimonialSlider.css';

const TESTIMONIALS = [
  {
    quote: "My daughter was shy performing in public — after 3 months with GuruNada, she played confidently at the school recital. The mentors are patient and genuinely care about progress.",
    name: 'Mrs. Rina Santoso',
    role: 'Parent of a 10-year-old student',
    initial: 'R',
  },
  {
    quote: "The flexible schedule is a lifesaver. We rescheduled twice last month without any hassle — and my son never missed a beat in his learning. Highly recommended for busy families.",
    name: 'Mr. Andi Wijaya',
    role: 'Parent of a 13-year-old student',
    initial: 'A',
  },
  {
    quote: "Professional teachers, warm approach. My child actually looks forward to lessons every week — and that says everything. The progress notes keep us informed after every session.",
    name: 'Michelle Hartono',
    role: 'Parent of a 9-year-old student',
    initial: 'M',
  },
];

export default function TestimonialSlider() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => Math.max(0, a - 1));
  const next = () => setActive((a) => Math.min(TESTIMONIALS.length - 1, a + 1));

  return (
    <section className="ts-section" id="testimonials">
      <div className="ts-inner">
        <h2 className="ts-heading">What Parents Say</h2>
        <p className="ts-sub">Real stories from families who trust GuruNada</p>

        {/* Track */}
        <div className="ts-track-wrap">
          <div
            className="ts-track"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="ts-slide">
                {/* Stars */}
                <div className="ts-stars">{'★★★★★'}</div>

                <span className="ts-quote-mark">"</span>
                <p className="ts-quote">{t.quote}</p>

                <div className="ts-author">
                  <div className="ts-author__avatar">{t.initial}</div>
                  <div>
                    <div className="ts-author__name">{t.name}</div>
                    <div className="ts-author__role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="ts-controls">
          <button className="ts-btn" onClick={prev} disabled={active === 0} aria-label="Previous">
            ←
          </button>
          <div className="ts-pips">
            {TESTIMONIALS.map((_, i) => (
              <div
                key={i}
                className={`ts-pip ${i === active ? 'active' : ''}`}
                onClick={() => setActive(i)}
                role="button"
                tabIndex={0}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
          <button className="ts-btn" onClick={next} disabled={active === TESTIMONIALS.length - 1} aria-label="Next">
            →
          </button>
        </div>
      </div>
    </section>
  );
}
