/**
 * SelectField.jsx
 * ────────────────
 * Styled dropdown for categorical features (sex, studytime, education levels, etc.)
 */
export default function SelectField({
  id,
  label,
  value,
  onChange,
  options = [],
  description,
  disabled = false,
}) {
  return (
    <div className="field-wrap">
      <div className="flex items-start justify-between gap-2 mb-2">
        <label htmlFor={id} className="field-label">{label}</label>
      </div>

      <div className="select-wrap">
        <select
          id={id}
          className="sel-input"
          value={value}
          onChange={(e) => {
            const raw = e.target.value
            // Coerce to number if the option values are numeric
            const parsed = !isNaN(Number(raw)) && raw !== '' ? Number(raw) : raw
            onChange(parsed)
          }}
          disabled={disabled}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom chevron */}
        <span className="sel-chevron" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>

      {description && <p className="field-desc mt-1.5">{description}</p>}
    </div>
  )
}
