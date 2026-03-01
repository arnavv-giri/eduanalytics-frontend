/**
 * ToggleField.jsx
 * ────────────────
 * Yes / No pill toggle for boolean features (schoolsup, internet, romantic, etc.)
 * Value is always the string "yes" or "no" to match FastAPI schema.
 */
export default function ToggleField({
  id,
  label,
  value,
  onChange,
  description,
  disabled = false,
}) {
  const isYes = value === 'yes'

  return (
    <div className="field-wrap">
      <label className="field-label mb-2 block">{label}</label>

      <div className="toggle-pair">
        <button
          type="button"
          className={`toggle-btn${isYes ? '' : ' toggle-active-no'}`}
          onClick={() => !disabled && onChange('no')}
          disabled={disabled}
          aria-pressed={!isYes}
        >
          No
        </button>
        <button
          type="button"
          className={`toggle-btn${isYes ? ' toggle-active-yes' : ''}`}
          onClick={() => !disabled && onChange('yes')}
          disabled={disabled}
          aria-pressed={isYes}
        >
          Yes
        </button>
      </div>

      {description && <p className="field-desc mt-1.5">{description}</p>}
    </div>
  )
}
