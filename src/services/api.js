/**
 * api.js
 * ──────
 * Axios service layer for EduAnalytics FastAPI backend.
 * Exports a single `predictStudent` function that POSTs all 32 fields.
 */
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 20_000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

// ── Request interceptor: log every outgoing payload ───────────────────────────
api.interceptors.request.use((config) => {
  if (config.data) {
    console.log(`[api] → POST ${config.baseURL}${config.url}`, config.data)
  }
  return config
})

// ── Response interceptor: normalise errors ────────────────────────────────────
api.interceptors.response.use(
  (res) => { console.log(`[api] ← ${res.status}`, res.data); return res },
  (err) => {
    if (err.response) {
      const detail =
        err.response.data?.detail ??
        err.response.data?.message ??
        err.response.statusText ??
        'Unknown server error'
      console.error(`[api] ← ${err.response.status}`, err.response.data)
      return Promise.reject(new Error(`Server error ${err.response.status}: ${detail}`))
    }
    if (err.request) {
      return Promise.reject(new Error(
        'Cannot reach the backend. Make sure FastAPI is running on http://127.0.0.1:8000'
      ))
    }
    return Promise.reject(err)
  },
)

/**
 * POST /predict
 * Sends all 32 student features; returns predicted G3 score + performance level.
 *
 * @param {Record<string, string|number>} formData — full 32-field form state
 * @returns {Promise<{ predicted_score: number, performance_level: string, grade_band: string, model_used: string }>}
 */
export const predictStudent = (formData) => {
  // Coerce numeric strings → numbers; leave string fields as-is
  const numericKeys = new Set([
    'age','G1','G2','studytime','failures','absences',
    'Medu','Fedu','traveltime','famrel','freetime','goout',
    'Dalc','Walc','health',
  ])

  const payload = Object.fromEntries(
    Object.entries(formData).map(([k, v]) => [
      k,
      numericKeys.has(k) ? Number(v) : v,
    ])
  )

  console.log('📤 predictStudent payload (all 32 fields):', payload)
  return api.post('/predict', payload)
}

export default api
