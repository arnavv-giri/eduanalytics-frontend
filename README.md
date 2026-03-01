# EduAnalytics Frontend

A production-ready React + Vite frontend for the EduAnalytics student performance predictor.

## Tech Stack

- **React 18** (JavaScript)
- **Vite 5** — build tool & dev server
- **Axios** — HTTP client
- **Tailwind CSS** — utility-first styling
- **Google Fonts** — Playfair Display · DM Sans · JetBrains Mono

## Prerequisites

- Node.js ≥ 18
- The EduAnalytics FastAPI backend running on `http://127.0.0.1:8000`

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

The app opens automatically at **http://localhost:5173**

## Build for Production

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build locally
```

## Project Structure

```
eduanalytics-frontend/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx               # Root component + backgrounds
    ├── index.css             # Global styles + Tailwind layers
    ├── components/
    │   ├── InputField.jsx    # Controlled numeric input
    │   ├── PredictionResult.jsx  # Score + grade display
    │   └── Loader.jsx        # Scientific scanner animation
    ├── pages/
    │   └── Home.jsx          # Main page with form & state
    └── services/
        └── api.js            # Axios instance + predictScore()
```

## API Contract

### POST `/predict`

**Request:**
```json
{
  "age": 17,
  "studytime": 2,
  "failures": 0,
  "absences": 4
}
```

**Response:**
```json
{
  "predicted_score": 13.5,
  "grade_band": "Average (C)",
  "model_used": "Random Forest",
  "status": "success"
}
```

> The frontend also handles the simplified `performance_level` response shape
> for maximum compatibility.

## Environment

To change the backend URL, edit `src/services/api.js`:

```js
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',  // ← change this
  ...
})
```
