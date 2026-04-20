// src/components/BounceIcons.jsx
import './BounceIcons.css';

// Musical notation symbols from the brand guide PDF
const SYMBOLS = [
  { sym: '♩', size: 20, color: 'var(--olive)' },
  { sym: '♪', size: 24, color: 'var(--blush)' },
  { sym: '♫', size: 22, color: 'var(--brick)' },
  { sym: '♬', size: 26, color: 'var(--olive)' },
  { sym: '𝄞', size: 28, color: 'var(--blush)' },
  { sym: '♭', size: 22, color: 'var(--brick)' },
  { sym: '♮', size: 20, color: 'var(--olive)' },
  { sym: '♯', size: 20, color: 'var(--blush)' },
  { sym: '𝄢', size: 24, color: 'var(--brick)' },
  { sym: '♩', size: 18, color: 'var(--blush)' },
  { sym: '♪', size: 22, color: 'var(--olive)' },
  { sym: '♫', size: 24, color: 'var(--brick)' },
  { sym: '♬', size: 20, color: 'var(--blush)' },
  { sym: '𝄞', size: 26, color: 'var(--olive)' },
  { sym: '♭', size: 18, color: 'var(--brick)' },
  { sym: '♮', size: 22, color: 'var(--blush)' },
  { sym: '♯', size: 24, color: 'var(--olive)' },
  { sym: '𝄢', size: 20, color: 'var(--brick)' },
];

export default function BounceIcons() {
  return (
    <div className="bounce-icons" aria-hidden="true">
      <div className="bounce-icons__track">
        {SYMBOLS.map((item, i) => (
          <span
            key={i}
            className="bounce-icons__sym"
            style={{
              fontSize: `${item.size}px`,
              color: item.color,
              animationDelay: `${(i * 0.17) % 1.6}s`,
              animationDuration: `${1.3 + (i % 4) * 0.2}s`,
            }}
          >
            {item.sym}
          </span>
        ))}
      </div>
    </div>
  );
}
