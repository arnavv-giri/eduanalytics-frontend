/**
 * FormSection.jsx
 * ────────────────
 * Renders one section of the form from config.
 * Picks the right field component based on field.type.
 */
import NumericField from './NumericField'
import SelectField  from './SelectField'
import ToggleField  from './ToggleField'
import { SECTION_COLORS } from '../config/formFields'

export default function FormSection({ section, form, onChange, disabled }) {
  const colors = SECTION_COLORS[section.color]

  return (
    <div
      className="section-panel"
      style={{
        '--section-bg':     colors.bg,
        '--section-border': colors.border,
        '--section-text':   colors.text,
        '--section-dot':    colors.dot,
      }}
      role="group"
      aria-labelledby={`section-title-${section.id}`}
    >
      {/* Section header */}
      <div className="section-header">
        <div className="section-icon-wrap">
          <span className="section-icon">{section.icon}</span>
        </div>
        <div>
          <h2 id={`section-title-${section.id}`} className="section-title">
            {section.title}
          </h2>
          <p className="section-subtitle">{section.subtitle}</p>
        </div>
      </div>

      {/* Fields grid */}
      <div className="fields-grid">
        {section.fields.map((field) => {
          const fieldProps = {
            key:         field.key,
            id:          field.key,
            label:       field.label,
            value:       form[field.key],
            onChange:    (v) => onChange(field.key, v),
            description: field.description,
            disabled,
          }

          if (field.type === 'toggle') {
            return <ToggleField key={field.key} {...fieldProps} />
          }

          if (field.type === 'select') {
            return <SelectField key={field.key} {...fieldProps} options={field.options} />
          }

          // number
          return (
            <NumericField
              key={field.key}
              {...fieldProps}
              min={field.min}
              max={field.max}
              step={field.step}
              unit={field.unit}
              weight={field.weight}
            />
          )
        })}
      </div>
    </div>
  )
}
