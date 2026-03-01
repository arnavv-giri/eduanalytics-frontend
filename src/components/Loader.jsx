/**
 * Loader.jsx
 * ──────────
 * "Scientific instrument scanning" loader — evokes a spectrometer sweep.
 * Pure CSS animation, no external dependencies.
 */

const Loader = ({ message = 'Analysing student profile…' }) => {
  // Random dot positions for scanner ambiance
  const dots = [
    { left: '18%', top: '35%', delay: '0ms' },
    { left: '42%', top: '65%', delay: '400ms' },
    { left: '67%', top: '30%', delay: '200ms' },
    { left: '82%', top: '70%', delay: '600ms' },
    { left: '30%', top: '55%', delay: '800ms' },
    { left: '55%', top: '20%', delay: '1000ms' },
  ]

  return (
    <div className="loader-wrap animate-fade-up" role="status" aria-live="polite">
      {/* Scanner instrument */}
      <div className="scanner-frame" aria-hidden="true">
        {/* Scanning beam */}
        <div className="scanner-bar" />

        {/* Static dot markers */}
        {dots.map((d, i) => (
          <div
            key={i}
            className="scanner-dot"
            style={{
              left: d.left,
              top: d.top,
              animationDelay: d.delay,
            }}
          />
        ))}

        {/* Decorative grid lines inside scanner */}
        {[25, 50, 75].map((pct) => (
          <div
            key={pct}
            className="scanner-line"
            style={{ bottom: `${pct}%`, opacity: 0.08 }}
          />
        ))}
        {[33, 66].map((pct) => (
          <div
            key={pct}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${pct}%`,
              width: '1px',
              background: 'rgba(251,191,36,0.06)',
            }}
          />
        ))}

        {/* Corner tick marks */}
        {[
          { top: 4, left: 4, borderTop: true, borderLeft: true },
          { top: 4, right: 4, borderTop: true, borderRight: true },
          { bottom: 4, left: 4, borderBottom: true, borderLeft: true },
          { bottom: 4, right: 4, borderBottom: true, borderRight: true },
        ].map((corner, i) => (
          <div
            key={i}
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: 8,
              height: 8,
              top: corner.top,
              left: corner.left,
              right: corner.right,
              bottom: corner.bottom,
              borderTop: corner.borderTop ? '1px solid rgba(251,191,36,0.35)' : 'none',
              borderLeft: corner.borderLeft ? '1px solid rgba(251,191,36,0.35)' : 'none',
              borderRight: corner.borderRight ? '1px solid rgba(251,191,36,0.35)' : 'none',
              borderBottom: corner.borderBottom ? '1px solid rgba(251,191,36,0.35)' : 'none',
            }}
          />
        ))}
      </div>

      {/* Pulsing label */}
      <div className="flex flex-col items-center gap-1">
        <span
          className="font-mono text-xs text-yellow-400/60 tracking-widest uppercase"
          style={{ animation: 'pulse 2s ease-in-out infinite' }}
        >
          Processing
        </span>
        <span className="text-slate-400 text-sm font-body">{message}</span>
      </div>

      {/* Bouncing dots */}
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1 h-1 rounded-full bg-yellow-400/50"
            style={{
              animation: 'bounceDot 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.18}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes bounceDot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default Loader
