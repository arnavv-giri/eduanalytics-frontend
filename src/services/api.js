/**
 * api.js
 * ──────
 * Axios service layer for EduAnalytics FastAPI backend.
 *
 * Base URL is read from the VITE_API_URL environment variable so the same
 * build works locally (via .env) and in production (via hosting env vars).
 *
 * Render free-tier instances cold-start in ~30 s — timeout set to 60 s.
 */
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60_000,   // 60 s — Render free tier cold-starts can take ~30 s
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

// ── Request interceptor: log every outgoing payload ───────────────────────────
api.interceptors.request.use((config) => {
  if (config.data) {
    console.log(`[api] → ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
  }
  return config
})

// ── Response interceptor: normalise errors ────────────────────────────────────
api.interceptors.response.use(
  (res) => {
    console.log(`[api] ← ${res.status}`, res.data)
    return res
  },
  (err) => {
    if (err.code === 'ECONNABORTED') {
      return Promise.reject(new Error(
        'Request timed out. The server may be waking up from sleep — please try again in a moment.'
      ))
    }
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
        'Cannot reach the backend. The server may be waking up — please wait a moment and try again.'
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
 * @returns {Promise<AxiosResponse<{
 *   predicted_score:   number,
 *   performance_level: string,
 *   grade_band:        string,
 *   model_used:        string,
 *   status:            string
 * }>>}
 */
export const predictStudent = (formData) => {
  const numericKeys = new Set([
    'age', 'G1', 'G2', 'studytime', 'failures', 'absences',
    'Medu', 'Fedu', 'traveltime', 'famrel', 'freetime', 'goout',
    'Dalc', 'Walc', 'health',
  ])

  const payload = Object.fromEntries(
    Object.entries(formData).map(([k, v]) => [
      k,
      numericKeys.has(k) ? Number(v) : String(v),
    ])
  )

  console.log('📤 predictStudent — sending 32 fields to', BASE_URL)
  return api.post('/predict', payload)
}

export default api
