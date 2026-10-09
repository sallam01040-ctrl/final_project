# Student Performance Prediction — FastAPI Backend Service

Production REST API service for student examination score forecasting, hypothesis simulation, and batch cohort analytics.

---

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API status and root service metadata |
| `GET` | `/api/health` | Service health status and model readiness |
| `GET` | `/api/model/info` | Complete model architecture, weights, and metrics ($R^2$, MAE, RMSE) |
| `GET` | `/api/features` | Metadata for all 13 validated features |
| `GET` | `/api/benchmarks` | Cohort benchmarks and score distribution |
| `GET` | `/api/sample-students` | Pre-calibrated sample student archetypes |
| `POST` | `/api/predict` | Predict single student score with factor attribution and guidance |
| `POST` | `/api/simulate` | Side-by-side what-if hypothesis comparison |
| `POST` | `/api/batch-predict` | Batch evaluation of multiple student records |

Interactive Swagger documentation is available at `/docs` and ReDoc at `/redoc`.

---

## Local Execution

```bash
# 1. Activate Python virtual environment
source ../.venv39/bin/activate

# 2. Start server with Uvicorn
uvicorn main:app --reload --port 8000
```

---

## Docker Deployment

```bash
# Build Docker image
docker build -t student-score-api .

# Run container on port 8000
docker run -p 8000:8000 student-score-api
```
