/**
 * NumericField.jsx
 * ─────────────────
 * Slider + number input in sync. Free-typing allowed without mid-value blocking.
 * Clamps to [min, max] on blur. Supports highlight styling for high-weight fields.
 */
import { useState, useEffect } from 'react'

export default function NumericField({
  id,
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit,
  description,
  weight,      // 'high' | undefined
  disabled = false,
}) {
  const [display, setDisplay] = useState(value === '' ? '' : String(value))

  useEffect(() => {
    setDisplay(value === '' ? '' : String(value))
  }, [value])

  const pct = Math.round(((Number(display) - min) / (max - min)) * 100)

  const handleInput = (e) => {
    const raw = e.target.value
    setDisplay(raw)
    if (raw === '') { onChange(''); return }
    const n = Number(raw)
    if (!isNaN(n) && n <= max) onChange(n)
  }

  const handleSlider = (e) => {
    const n = Number(e.target.value)
    setDisplay(String(n))
    onChange(n)
  }

  const handleBlur = () => {
    const n = Number(display)
    if (display === '' || isNaN(n)) {
      setDisplay(String(value))
      return
    }
    const clamped = Math.min(max, Math.max(min, n))
    setDisplay(String(clamped))
    onChange(clamped)
  }

  const isHigh = weight === 'high'

  return (
    <div className={`field-wrap${isHigh ? ' field-high' : ''}`}>
      {/* Label row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <label htmlFor={id} className={`field-label${isHigh ? ' field-label-high' : ''}`}>
          {isHigh && <span className="high-badge">KEY</span>}
          {label}
        </label>
        {unit && <span className="field-unit">{unit}</span>}
      </div>

      {/* Number input */}
      <input
        id={id}
        type="number"
        className={`num-input${isHigh ? ' num-input-high' : ''}`}
        value={display}
        onChange={handleInput}
        onBlur={handleBlur}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        autoComplete="off"
      />

      {/* Slider */}
      <div className="slider-track-wrap">
        <input
          type="range"
          className="slider"
          min={min}
          max={max}
          step={step}
          value={isNaN(Number(display)) ? min : Math.min(max, Math.max(min, Number(display)))}
          onChange={handleSlider}
          disabled={disabled}
          aria-hidden="true"
          tabIndex={-1}
          style={{ '--pct': `${isNaN(pct) ? 0 : Math.max(0, Math.min(100, pct))}%` }}
        />
      </div>

      {/* Range labels */}
      <div className="flex justify-between mt-1">
        <span className="range-label">{min}</span>
        {description && <span className="field-desc">{description}</span>}
        <span className="range-label">{max}</span>
      </div>
    </div>
  )
}
