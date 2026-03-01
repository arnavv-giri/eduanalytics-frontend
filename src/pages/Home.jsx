/**
 * Home.jsx
 * ────────
 * Full 32-feature prediction form for EduAnalytics.
 *
 * Layout:
 *   • Sticky header with app title + model badge
 *   • Section tabs (Academic / Habits / Lifestyle / Background)
 *   • Active section's fields rendered in a responsive 2-col grid
 *   • Sticky footer with validation status + submit button
 *   • Result panel slides in below the card after submission
 *
 * All 32 fields are tracked in form state. On submit:
 *   1. User-entered fields from the 4 visible sections (24 fields)
 *   2. HIDDEN_FIELDS constants (8 low-impact fields) merged in
 *   Full 32-field payload POSTed to /predict via predictStudent()
 */
import { useState, useMemo } from 'react'
import { FORM_SECTIONS, HIDDEN_FIELDS, buildInitialForm, SECTION_COLORS } from '../config/formFields'
import FormSection      from '../components/FormSection'
import PredictionResult from '../components/PredictionResult'
import { predictStudent } from '../services/api'

// Validate all numeric fields are present and valid
function validateForm(form) {
  const errors = {}
  const numericKeys = ['age','G1','G2','studytime','failures','absences',
    'Medu','Fedu','traveltime','famrel','freetime','goout','Dalc','Walc','health']

  for (const key of numericKeys) {
    const v = form[key]
    if (v === '' || v === null || v === undefined || isNaN(Number(v))) {
      errors[key] = 'Required'
    }
  }
  return errors
}

export default function Home() {
  const [form,          setForm]         = useState(buildInitialForm)
  const [activeSection, setActiveSection] = useState(0)
  const [result,        setResult]        = useState(null)
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState(null)
  const [submitted,     setSubmitted]     = useState(false)

  const errors  = useMemo(() => validateForm(form), [form])
  const isValid = Object.keys(errors).length === 0
  const section = FORM_SECTIONS[activeSection]
  const colors  = SECTION_COLORS[section.color]

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (result) setResult(null)
    if (error)  setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (!isValid || loading) return

    // Merge user-entered fields with silent hidden defaults → full 32 fields
    const payload = { ...HIDDEN_FIELDS, ...form }
    console.log('📤 Sending full 32-field payload:', payload)

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const { data } = await predictStudent(payload)
      console.log('📥 Response:', data)
      setResult(data)
      setTimeout(() => {
        document.getElementById('result-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      console.error('❌ Error:', err)
      setError(err.message ?? 'Unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setForm(buildInitialForm())
    setResult(null)
    setError(null)
    setSubmitted(false)
    setActiveSection(0)
  }

  // Error count per section tab
  const sectionErrorCounts = FORM_SECTIONS.map(s =>
    s.fields.filter(f => submitted && errors[f.key]).length
  )

  return (
    <div className="page-root">
      <div className="page-bg"       aria-hidden="true" />
      <div className="page-grid"     aria-hidden="true" />
      <div className="page-vignette" aria-hidden="true" />

      <main className="page-main">

        {/* ══════════════════════════════════════════════════
            HEADER
        ══════════════════════════════════════════════════ */}
        <header className="app-header animate-slide-down">
          <div className="app-header-inner">
            <div className="app-logo-group">
              <div className="app-logo-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L2 6v8l8 4 8-4V6l-8-4z" stroke="#fbbf24" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M2 6l8 4 8-4M10 10v8" stroke="#fbbf24" strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <h1 className="app-title">EduAnalytics</h1>
                <p className="app-subtitle">Student Performance Predictor</p>
              </div>
            </div>
            <div className="app-model-badge">
              <span className="app-model-dot" />
              <span>Random Forest · v2.0</span>
            </div>
          </div>
        </header>

        {/* ══════════════════════════════════════════════════
            FORM CARD
        ══════════════════════════════════════════════════ */}
        <div className="form-card animate-fade-up">

          {/* Section tab bar */}
          <nav className="tab-bar" role="tablist" aria-label="Form sections">
            {FORM_SECTIONS.map((s, i) => {
              const c      = SECTION_COLORS[s.color]
              const active = i === activeSection
              const errs   = sectionErrorCounts[i]
              return (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={active}
                  className={`tab-btn${active ? ' tab-btn-active' : ''}`}
                  style={active ? {
                    '--tab-color':  c.tab,
                    '--tab-bg':     c.bg,
                    '--tab-border': c.border,
                    '--tab-text':   c.text,
                  } : {}}
                  onClick={() => setActiveSection(i)}
                  type="button"
                >
                  <span className="tab-icon">{s.icon}</span>
                  <span className="tab-label">{s.title}</span>
                  {errs > 0 && (
                    <span className="tab-error-badge">{errs}</span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Active section */}
          <form onSubmit={handleSubmit} noValidate className="form-body">
            <FormSection
              key={section.id}
              section={section}
              form={form}
              onChange={handleChange}
              disabled={loading}
            />

            {/* Footer: nav + submit */}
            <div className="form-footer">
              <div className="section-nav">
                <button
                  type="button"
                  className="nav-btn"
                  onClick={() => setActiveSection(i => Math.max(0, i - 1))}
                  disabled={activeSection === 0}
                >
                  ← Previous
                </button>

                <div className="step-dots">
                  {FORM_SECTIONS.map((_, i) => {
                    const c = SECTION_COLORS[FORM_SECTIONS[i].color]
                    return (
                      <button
                        key={i}
                        type="button"
                        className={`step-dot${i === activeSection ? ' step-dot-active' : ''}`}
                        style={i === activeSection ? { background: c.tab } : {}}
                        onClick={() => setActiveSection(i)}
                        aria-label={`Go to section ${i + 1}`}
                      />
                    )
                  })}
                </div>

                <button
                  type="button"
                  className="nav-btn"
                  onClick={() => setActiveSection(i => Math.min(FORM_SECTIONS.length - 1, i + 1))}
                  disabled={activeSection === FORM_SECTIONS.length - 1}
                >
                  Next →
                </button>
              </div>

              {submitted && !isValid && (
                <div className="validation-banner" role="alert">
                  <span>⚠</span>
                  <span>
                    {Object.keys(errors).length} field{Object.keys(errors).length > 1 ? 's' : ''} need
                    attention — check all sections before submitting.
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <span className="submit-spinner" aria-hidden="true" />
                    Analysing…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Predict Final Score
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ══════════════════════════════════════════════════
            RESULT / ERROR
        ══════════════════════════════════════════════════ */}
        <div id="result-anchor" />

        {error && !loading && (
          <div className="error-card animate-fade-up" role="alert">
            <div className="error-icon">⚠</div>
            <div>
              <p className="error-title">Connection Error</p>
              <p className="error-body">{error}</p>
            </div>
          </div>
        )}

        {result && !loading && (
          <div className="animate-fade-up">
            <PredictionResult result={result} submittedForm={form} />
          </div>
        )}

        {(result || error) && !loading && (
          <div className="reset-row">
            <button onClick={handleReset} className="reset-btn" type="button">
              ↺ Reset &amp; start over
            </button>
          </div>
        )}

        <footer className="page-footer">
          EduAnalytics · UCI student-mat.csv · scikit-learn Random Forest · FastAPI
        </footer>
      </main>
    </div>
  )
}
