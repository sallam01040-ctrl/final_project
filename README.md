# EduScore Analytics — Student Performance Diagnostic Web Platform

A production-grade, full-stack web application for forecasting student examination performance, conducting what-if scenario simulations, analyzing feature attribution, and identifying academic intervention opportunities.

Built to replace legacy Gradio interfaces with an **Impeccable**, accessible, high-performance web experience.

---

## Architecture Overview

The project is structured into two dedicated services inside `student-web/`:

```
student-web/
├── frontend/                   # Next.js 14 (App Router, TypeScript, Tailwind CSS)
│   ├── src/
│   │   ├── app/                # App router pages, layouts, and API routes
│   │   ├── components/         # Clean UI components (strictly zero AI icons)
│   │   └── lib/                # Standalone mathematical inference engine
│   ├── package.json
│   ├── tailwind.config.ts
│   └── vercel.json             # Vercel deployment configuration
│
├── backend/                    # FastAPI (Python, Pydantic, Linear Regression)
│   ├── main.py                 # FastAPI application & REST endpoints
│   ├── model_service.py        # Model inference & recommendation service
│   ├── schemas.py              # Pydantic request/response schemas
│   ├── model_parameters.json   # Extracted model weights, scaler, and metrics
│   ├── student_score_model.pkl # Model pickle artifact
│   ├── requirements.txt        # Production Python dependencies
│   ├── Dockerfile              # Container deployment
│   └── api/index.py            # Vercel serverless Python adapter
│
├── vercel.json                 # Monorepo Vercel configuration
└── README.md
```

---

## Key Features

1. **Diagnostic Predictor**:
   - Interactive sliders and numeric inputs for all 13 validated academic, institutional, and environmental drivers.
   - Real-time score projection with letter grade classification (`A`, `B`, `C`, `D`, `F`), cohort percentile estimate, and delta vs. benchmark mean (`67.2 pts`).
   - One-click loading of calibrated student archetypes (*Honor Roll Candidate*, *Cohort Average*, *Intervention Required*, *High Effort Improver*).

2. **Factor Attribution Breakdown**:
   - Visual bidirectional waterfall showing exact point contributions added or subtracted by each factor relative to the average student baseline.

3. **Targeted Academic Interventions**:
   - Algorithmic recommendations tailored to each student profile, indicating potential point gains (e.g. *+2.4 pts from increasing attendance to 95%*).

4. **Hypothesis & Scenario Simulator ("What-If")**:
   - Side-by-side comparison between a baseline profile and an intervention scenario with live delta tracking.

5. **Cohort Evaluation & Batch Diagnostics**:
   - Interactive table for batch scoring student sections.
   - Pass rate calculation, score range distribution, and client-side CSV report export.

6. **Model Architecture & Transparency**:
   - Exact mathematical linear regression formulation.
   - Comprehensive validation metrics: **$R^2 = 0.829$**, **$\text{MAE} = 0.598$**, **$\text{RMSE} = 1.516$**.
   - Explanation of ethical exclusions (`Family_Income` and `Learning_Disabilities` removed for bias prevention).

---

## Design Principles (`/impeccable` Applied)

- **English Only**: All labels, metrics, guidance, and descriptions are strictly in English.
- **Strictly Zero AI Icons**: No magic wands, sparkles, robots, glowing orbs, or brains. Only clean, authoritative academic and statistical symbols (`GraduationCap`, `Sliders`, `BarChart`, `TrendingUp`, `Clock`, `BookOpen`, `Users`, `Target`).
- **Restrained Academic Palette**: Slate neutrals, deep navy, subtle borders, and semantic accents (emerald for pass/gain, rose for deficit).
- **Tabular Numerals**: Numeric metrics, scores, and percentages are rendered with `tabular-nums` and monospace styling for precise readability.
- **Zero-Flicker Native Typography**: Fast system font stack ensures instantaneous render with zero network blocking.

---

## Local Development Quickstart

### 1. Run the FastAPI Backend

```bash
cd student-web/backend

# Using Python virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload --port 8000
```

- API Documentation: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/health`

### 2. Run the Next.js Frontend

```bash
cd student-web/frontend

# Install dependencies (already completed)
npm install

# Start development server
npm run dev
```

- Open `http://localhost:3000` in your browser.

---

## Deploying to Vercel

### Option A: Direct Frontend Deployment (Recommended & Instant)
The Next.js frontend contains a built-in mathematical inference engine that mirrors the model weights identically. It can be deployed directly to Vercel in seconds with **zero external server dependencies**:

1. Push this repository to GitHub / GitLab / Bitbucket.
2. In the [Vercel Dashboard](https://vercel.com):
   - Click **Add New Project**.
   - Import your repository.
   - Set **Root Directory** to `student-web/frontend`.
   - Click **Deploy**.
3. Your web app is immediately live with instant sub-millisecond predictions!

### Option B: Full-Stack with External FastAPI Backend
If you host your FastAPI backend on Render, Railway, Fly.io, or AWS:

1. Deploy the backend and obtain the public URL (e.g. `https://my-student-api.onrender.com`).
2. In Vercel, navigate to **Project Settings → Environment Variables**.
3. Add:
   ```
   NEXT_PUBLIC_API_URL=https://my-student-api.onrender.com
   ```
4. Redeploy the frontend. Next.js will automatically proxy and route requests to your FastAPI server with local fallback!

---

## Statistical Model Summary

| Metric | Holdout Evaluation | Description |
|---|---|---|
| **Algorithm** | StandardScaler + Multiple Linear Regression | Normalized parametric estimator |
| **$R^2$ Score** | **0.829** | Explains 82.9% of exam score variance |
| **MAE** | **0.598 pts** | Average absolute deviation on unseen test set |
| **RMSE** | **1.516 pts** | Penalization of large forecast errors |
| **Training Records** | **5,285** | 80% train partition from 6,607 total records |
| **Holdout Records** | **1,322** | 20% test partition (`random_state = 20`) |
