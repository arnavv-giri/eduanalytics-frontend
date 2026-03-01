/**
 * formFields.js
 * ─────────────
 * Single source of truth for all 32 student-mat.csv features.
 * The form is divided into 4 thematic sections for usability.
 *
 * Field types:
 *   "number"  → NumericField  (slider + text input)
 *   "select"  → SelectField   (dropdown)
 *   "toggle"  → ToggleField   (yes/no pill toggle)
 *
 * The `key` property must match the FastAPI StudentInput field name exactly.
 * `default` is the value pre-filled on mount (dataset median/mode).
 * `weight`  is "high" | "medium" | undefined — used to visually accent
 *            the most predictive features (G1, G2, failures).
 */

export const FORM_SECTIONS = [
  // ═══════════════════════════════════════════════════════════════
  //  SECTION 1 — Academic Record   (most predictive features)
  // ═══════════════════════════════════════════════════════════════
  {
    id:       'academic',
    title:    'Academic Record',
    subtitle: 'Prior grades and academic history — strongest predictors',
    icon:     '📊',
    color:    'blue',
    fields: [
      {
        key:     'G1',
        label:   'Period 1 Grade',
        type:    'number',
        min:     0,
        max:     20,
        step:    1,
        default: 11,
        unit:    '/ 20',
        weight:  'high',
        description: 'First period grade — highest correlation with final score',
      },
      {
        key:     'G2',
        label:   'Period 2 Grade',
        type:    'number',
        min:     0,
        max:     20,
        step:    1,
        default: 11,
        unit:    '/ 20',
        weight:  'high',
        description: 'Second period grade — second highest correlation',
      },
      {
        key:     'failures',
        label:   'Past Failures',
        type:    'number',
        min:     0,
        max:     4,
        step:    1,
        default: 0,
        weight:  'high',
        description: 'Number of past class failures',
      },
      {
        key:     'absences',
        label:   'Absences',
        type:    'number',
        min:     0,
        max:     93,
        step:    1,
        default: 4,
        unit:    'days',
        description: 'Number of school absences',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  //  SECTION 2 — Study Habits & Support
  // ═══════════════════════════════════════════════════════════════
  {
    id:       'habits',
    title:    'Study Habits & Support',
    subtitle: 'How the student spends time and who supports them',
    icon:     '📚',
    color:    'amber',
    fields: [
      {
        key:     'studytime',
        label:   'Weekly Study Time',
        type:    'select',
        default: 2,
        options: [
          { value: 1, label: '< 2 hours' },
          { value: 2, label: '2 – 5 hours' },
          { value: 3, label: '5 – 10 hours' },
          { value: 4, label: '> 10 hours' },
        ],
      },
      {
        key:     'traveltime',
        label:   'Travel Time to School',
        type:    'select',
        default: 1,
        options: [
          { value: 1, label: '< 15 min' },
          { value: 2, label: '15 – 30 min' },
          { value: 3, label: '30 min – 1 hr' },
          { value: 4, label: '> 1 hour' },
        ],
      },
      {
        key:     'schoolsup',
        label:   'Extra School Support',
        type:    'toggle',
        default: 'no',
        description: 'Extra educational support from school',
      },
      {
        key:     'famsup',
        label:   'Family Support',
        type:    'toggle',
        default: 'yes',
        description: 'Educational support from family',
      },
      {
        key:     'paid',
        label:   'Paid Extra Classes',
        type:    'toggle',
        default: 'no',
        description: 'Extra paid classes within the course subject',
      },
      {
        key:     'higher',
        label:   'Wants Higher Education',
        type:    'toggle',
        default: 'yes',
        description: 'Aspires to pursue higher education',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  //  SECTION 3 — Lifestyle & Social
  // ═══════════════════════════════════════════════════════════════
  {
    id:       'lifestyle',
    title:    'Lifestyle & Social',
    subtitle: 'Free time, social activity, and lifestyle choices',
    icon:     '🌐',
    color:    'teal',
    fields: [
      {
        key:     'freetime',
        label:   'Free Time After School',
        type:    'number',
        min:     1,
        max:     5,
        step:    1,
        default: 3,
        description: '1 = very low  →  5 = very high',
      },
      {
        key:     'goout',
        label:   'Going Out with Friends',
        type:    'number',
        min:     1,
        max:     5,
        step:    1,
        default: 3,
        description: '1 = very low  →  5 = very high',
      },
      {
        key:     'Dalc',
        label:   'Workday Alcohol',
        type:    'number',
        min:     1,
        max:     5,
        step:    1,
        default: 1,
        description: 'Workday alcohol consumption  1–5',
      },
      {
        key:     'Walc',
        label:   'Weekend Alcohol',
        type:    'number',
        min:     1,
        max:     5,
        step:    1,
        default: 1,
        description: 'Weekend alcohol consumption  1–5',
      },
      {
        key:     'activities',
        label:   'Extracurricular Activities',
        type:    'toggle',
        default: 'no',
      },
      {
        key:     'romantic',
        label:   'In a Relationship',
        type:    'toggle',
        default: 'no',
      },
      {
        key:     'internet',
        label:   'Internet at Home',
        type:    'toggle',
        default: 'yes',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  //  SECTION 4 — Personal & Family Background
  // ═══════════════════════════════════════════════════════════════
  {
    id:       'background',
    title:    'Personal & Family',
    subtitle: 'Demographics and family background',
    icon:     '👤',
    color:    'violet',
    fields: [
      {
        key:     'age',
        label:   'Age',
        type:    'number',
        min:     10,
        max:     22,
        step:    1,
        default: 17,
        unit:    'yrs',
      },
      {
        key:     'sex',
        label:   'Sex',
        type:    'select',
        default: 'M',
        options: [
          { value: 'M', label: 'Male' },
          { value: 'F', label: 'Female' },
        ],
      },
      {
        key:     'health',
        label:   'Health Status',
        type:    'number',
        min:     1,
        max:     5,
        step:    1,
        default: 3,
        description: '1 = very bad  →  5 = very good',
      },
      {
        key:     'famrel',
        label:   'Family Relationship Quality',
        type:    'number',
        min:     1,
        max:     5,
        step:    1,
        default: 4,
        description: '1 = very bad  →  5 = excellent',
      },
      {
        key:     'Medu',
        label:   "Mother's Education",
        type:    'select',
        default: 2,
        options: [
          { value: 0, label: 'None' },
          { value: 1, label: 'Primary (4th grade)' },
          { value: 2, label: 'Middle school' },
          { value: 3, label: 'Secondary school' },
          { value: 4, label: 'Higher education' },
        ],
      },
      {
        key:     'Fedu',
        label:   "Father's Education",
        type:    'select',
        default: 2,
        options: [
          { value: 0, label: 'None' },
          { value: 1, label: 'Primary (4th grade)' },
          { value: 2, label: 'Middle school' },
          { value: 3, label: 'Secondary school' },
          { value: 4, label: 'Higher education' },
        ],
      },
      {
        key:     'nursery',
        label:   'Attended Nursery School',
        type:    'toggle',
        default: 'yes',
      },
    ],
  },
]

// ─── Static fields sent silently (not shown in form) ─────────────────────────
// These are low-impact fields fixed to dataset-mode values.
export const HIDDEN_FIELDS = {
  school:   'GP',
  address:  'U',
  famsize:  'GT3',
  Pstatus:  'T',
  Mjob:     'other',
  Fjob:     'other',
  reason:   'course',
  guardian: 'mother',
}

// ─── Build flat initial form state from sections + hidden fields ──────────────
export function buildInitialForm() {
  const form = { ...HIDDEN_FIELDS }
  for (const section of FORM_SECTIONS) {
    for (const field of section.fields) {
      form[field.key] = field.default
    }
  }
  return form
}

// ─── Color palette per section ───────────────────────────────────────────────
export const SECTION_COLORS = {
  blue:   { tab: '#3b82f6', bg: 'rgba(59,130,246,0.06)',  border: 'rgba(59,130,246,0.15)',  text: '#93c5fd', dot: '#3b82f6' },
  amber:  { tab: '#f59e0b', bg: 'rgba(245,158,11,0.06)',  border: 'rgba(245,158,11,0.15)',  text: '#fcd34d', dot: '#f59e0b' },
  teal:   { tab: '#14b8a6', bg: 'rgba(20,184,166,0.06)',  border: 'rgba(20,184,166,0.15)',  text: '#5eead4', dot: '#14b8a6' },
  violet: { tab: '#8b5cf6', bg: 'rgba(139,92,246,0.06)',  border: 'rgba(139,92,246,0.15)',  text: '#c4b5fd', dot: '#8b5cf6' },
}
