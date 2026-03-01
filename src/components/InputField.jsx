/**
 * InputField.jsx
 * ──────────────
 * Controlled numeric input with free-typing fix and optional highlight styling.
 *
 * Props:
 *   highlight  — renders the field with a gold accent border (used for G1, G2)
 *   All others — standard controlled input behaviour
 */
import { useState, useEffect } from 'react'

const InputField = ({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
  hint,
  icon,
  disabled  = false,
  error     = false,
  highlight = false,   // gold-accented border for high-impact fields
}) => {
  // Local display string — lets user type freely without mid-value blocking
  const [display, setDisplay] = useState(value === '' ? '' : String(value))

  // Sync when parent resets value externally (e.g. on form reset)
  useEffect(() => {
    setDisplay(value === '' ? '' : String(value))
  }, [value])

  const handleChange = (e) => {
    const raw = e.target.value
    setDisplay(raw)

    if (raw === '' || raw === '-') { onChange(''); return }

    const num = Number(raw)
    if (isNaN(num)) return
    // Only block hard-max while typing (prevents absurdly large values)
    if (max !== undefined && num > max) return

    onChange(num)
  }

  const handleBlur = () => {
    const num = Number(display)
    if (display === '' || isNaN(num)) {
      setDisplay(value === '' ? '' : String(value))
      return
    }
    let clamped = num
    if (min !== undefined && num < min) clamped = min
    if (max !== undefined && num > max) clamped = max
    setDisplay(String(clamped))
    onChange(clamped)
  }

  const hasError = error || (
    display !== '' && !isNaN(Number(display)) && (
      (min !== undefined && Number(display) < min) ||
      (max !== undefined && Number(display) > max)
    )
  )

  const inputClass = [
    'inp',
    hasError    ? 'inp-error'     : '',
    highlight   ? 'inp-highlight' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className="flex flex-col gap-1.5 group">

      {/* Label row */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className={`field-label flex items-center gap-1.5 cursor-pointer select-none${highlight ? ' field-label-highlight' : ''}`}
        >
          {icon && (
            <span
              className={`opacity-50 group-focus-within:opacity-90 transition-opacity duration-200 ${highlight ? 'text-yellow-300' : 'text-yellow-400'}`}
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
          {label}
        </label>

        {hint && (
          <span className="range-badge" aria-label={`Range: ${hint}`}>
            {hint}
          </span>
        )}
      </div>

      {/* Input */}
      <input
        id={id}
        name={id}
        type="number"
        className={inputClass}
        value={display}
        onChange={handleChange}
        onBlur={handleBlur}
        step={step}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={label}
        aria-invalid={hasError}
        autoComplete="off"
      />
    </div>
  )
}

export default InputField
