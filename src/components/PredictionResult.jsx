/**
 * PredictionResult.jsx
 * ─────────────────────
 * Displays predicted G3 score with:
 *   • Large animated score number inside a circular progress arc
 *   • Color-coded performance level (Poor/Average/Good/Excellent)
 *   • Animated linear progress bar
 *   • Input summary showing the 6 key fields that were sent
 *
 * Handles both API response shapes:
 *   Full:    { predicted_score, grade_band, performance_level, model_used, status }
 *   Simple:  { predicted_score, performance_level }
 */

const PERF_MAP = {
  // performance_level strings from new API
  'Excellent': { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.25)', label: 'Excellent', grade: 'A' },
  'Good':      { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)', label: 'Good',      grade: 'B' },
  'Average':   { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)', label: 'Average',   grade: 'C' },
  'Poor':      { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)',  label: 'Poor',      grade: 'D' },
  'Very Poor': { color: '#dc2626', bg: 'rgba(220,38,38,0.1)',   border: 'rgba(220,38,38,0.25)',  label: 'Very Poor', grade: 'F' },
  // grade_band strings from older API (fallback compat)
  'Excellent (A)': { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.25)', label: 'Excellent', grade: 'A' },
  'Good (B)':      { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)', label: 'Good',      grade: 'B' },
  'Average (C)':   { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)', label: 'Average',   grade: 'C' },
  'Passing (D)':   { color: '#f97316', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.25)', label: 'Passing',   grade: 'D' },
  'At Risk (F)':   { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)',  label: 'At Risk',   grade: 'F' },
}

const DEFAULT_PERF = { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', label: 'Result', grade: '—' }

function getPerf(result) {
  const key = result.performance_level ?? result.grade_band ?? ''
  if (PERF_MAP[key]) return PERF_MAP[key]
  const match = Object.keys(PERF_MAP).find(k =>
    k.toLowerCase().startsWith(key.toLowerCase().split(' ')[0])
  )
  return match ? PERF_MAP[match] : { ...DEFAULT_PERF, label: key || 'Result' }
}

// Circumference for circle r=52
const CIRC = 2 * Math.PI * 52

export default function PredictionResult({ result, submittedForm }) {
  if (!result) return null

  const raw = result.predicted_score ?? result.score ?? null
  if (raw === null || isNaN(Number(raw))) {
    return (
      <div className="result-error">
        <span>⚠</span>
        <span>Unexpected response — check console for details.</span>
      </div>
    )
  }

  const score   = Number(raw)
  const perf    = getPerf(result)
  const pct     = Math.min(100, Math.max(0, (score / 20) * 100))
  const model   = result.model_used ?? result.model ?? null
  const dashOff = CIRC * (1 - pct / 100)

  // 6 most meaningful fields to show in summary
  const summaryKeys = ['G1', 'G2', 'failures', 'absences', 'studytime', 'age']

  return (
    <div className="result-card animate-result-in" role="region" aria-label="Prediction result">

      {/* Top accent bar — color-coded by performance */}
      <div
        className="result-accent-bar"
        style={{ background: `linear-gradient(90deg, transparent, ${perf.color}, transparent)` }}
      />

      {/* Header */}
      <div className="result-header">
        <div className="result-status-dot-wrap">
          <span
            className="result-status-dot"
            style={{ background: perf.color, boxShadow: `0 0 8px ${perf.color}` }}
          />
          <span className="result-status-label">Analysis Complete</span>
        </div>
        {model && <span className="result-model-label">via {model}</span>}
      </div>

      {/* Main score area */}
      <div className="result-body">

        {/* Circular arc */}
        <div className="result-arc-wrap" aria-hidden="true">
          <svg width="128" height="128" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6"/>
            <circle
              cx="64" cy="64" r="52"
              fill="none"
              stroke={perf.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={dashOff}
              transform="rotate(-90 64 64)"
              style={{
                transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)',
                filter: `drop-shadow(0 0 6px ${perf.color}88)`,
              }}
            />
          </svg>
          <div className="result-arc-score">
            <span className="result-score-number" style={{ color: perf.color }}>
              {score.toFixed(1)}
            </span>
            <span className="result-score-denom">/ 20</span>
          </div>
        </div>

        {/* Details */}
        <div className="result-details">
          <div
            className="perf-pill"
            style={{ background: perf.bg, border: `1px solid ${perf.border}`, color: perf.color }}
          >
            <span className="perf-pill-dot" style={{ background: perf.color, boxShadow: `0 0 4px ${perf.color}` }} />
            {perf.label}
            <span className="perf-pill-grade">({perf.grade})</span>
          </div>

          <p className="result-score-desc">
            Predicted final exam score (G3) on the 0–20 Portuguese grading scale.
          </p>

          {/* Linear progress bar */}
          <div className="result-bar-wrap">
            <div className="result-bar-track">
              <div
                className="result-bar-fill"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${perf.color}88, ${perf.color})`,
                  boxShadow: `0 0 8px ${perf.color}44`,
                }}
              />
            </div>
            <div className="result-bar-labels">
              {[0, 5, 10, 15, 20].map(v => (
                <span key={v} className="result-bar-tick">{v}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Input summary */}
      {submittedForm && (
        <div className="result-summary">
          <p className="result-summary-title">Key inputs used</p>
          <div className="result-summary-grid">
            {summaryKeys.map(k => (
              submittedForm[k] !== undefined && (
                <div key={k} className="result-summary-cell">
                  <span className="result-summary-key">{k}</span>
                  <span className="result-summary-val">{submittedForm[k]}</span>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="result-footer">
        <div className="result-footer-line" />
        <span className="result-footer-label">G3 Final Grade · EduAnalytics ML</span>
        <div className="result-footer-line" />
      </div>
    </div>
  )
}
