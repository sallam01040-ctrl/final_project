import uvicorn
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Any

from schemas import (
    StudentFeatures,
    PredictionResponse,
    SimulationRequest,
    SimulationResponse,
    BatchPredictRequest,
    BatchPredictResponse,
    ModelInfoResponse,
    FeatureMeta,
)
from model_service import ModelService

app = FastAPI(
    title="Student Academic Performance Prediction API",
    description="Statistical linear regression model for predicting student exam scores with diagnostic feature attribution and academic recommendations.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for Next.js frontend (local development & Vercel deployment)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_service = ModelService()

@app.get("/", tags=["General"])
def root():
    return {
        "name": "Student Academic Performance Prediction API",
        "status": "online",
        "version": "1.0.0",
        "documentation": "/docs",
        "algorithm": model_service.metrics.get("algorithm", "StandardScaler + Linear Regression"),
        "r2_score": model_service.metrics.get("r2", 0.829)
    }

@app.get("/api/health", tags=["Monitoring"])
@app.get("/health", tags=["Monitoring"])
def health_check():
    return {
        "status": "healthy",
        "features_loaded": len(model_service.features),
        "model_ready": True
    }

@app.get("/api/model/info", response_model=ModelInfoResponse, tags=["Model"])
def get_model_info():
    return ModelInfoResponse(
        model_name="Student Exam Score Predictor",
        algorithm=model_service.metrics.get("algorithm", "StandardScaler + Linear Regression"),
        features_count=len(model_service.features),
        metrics=model_service.metrics,
        intercept=model_service.intercept,
        features=model_service.get_features_metadata()
    )

@app.get("/api/features", response_model=List[FeatureMeta], tags=["Model"])
def get_features():
    return model_service.get_features_metadata()

@app.get("/api/benchmarks", tags=["Model"])
def get_cohort_benchmarks():
    return {
        "total_records": 6607,
        "mean_exam_score": 67.21,
        "median_exam_score": 67.0,
        "std_exam_score": 4.10,
        "mean_attendance": 79.92,
        "mean_hours_studied": 19.93,
        "mean_previous_score": 75.0,
        "mean_tutoring_sessions": 1.49,
        "grade_distribution": {
            "A (90-100)": "0.1%",
            "B (80-89)": "0.6%",
            "C (70-79)": "24.5%",
            "D (60-69)": "71.2%",
            "F (<60)": "3.6%"
        }
    }

@app.get("/api/sample-students", tags=["Samples"])
def get_sample_students():
    return [
        {
            "id": "high_achiever",
            "name": "Honor Roll Candidate",
            "description": "Consistent high attendance, dedicated study routine, and positive peer support.",
            "data": {
                "Attendance": 98.0,
                "Hours_Studied": 38.0,
                "Previous_Scores": 92.0,
                "Access_to_Resources": "High",
                "Parental_Involvement": "High",
                "Tutoring_Sessions": 4.0,
                "Parental_Education_Level": "Postgraduate",
                "Peer_Influence": "Positive",
                "Distance_from_Home": "Near",
                "Motivation_Level": "High",
                "Teacher_Quality": "High",
                "Extracurricular_Activities": "Yes",
                "Internet_Access": "Yes"
            }
        },
        {
            "id": "average_student",
            "name": "Typical Cohort Average",
            "description": "Representative baseline reflecting the central tendencies of the 6,607 student dataset.",
            "data": {
                "Attendance": 80.0,
                "Hours_Studied": 20.0,
                "Previous_Scores": 75.0,
                "Access_to_Resources": "Medium",
                "Parental_Involvement": "Medium",
                "Tutoring_Sessions": 1.0,
                "Parental_Education_Level": "High School",
                "Peer_Influence": "Neutral",
                "Distance_from_Home": "Near",
                "Motivation_Level": "Medium",
                "Teacher_Quality": "Medium",
                "Extracurricular_Activities": "Yes",
                "Internet_Access": "Yes"
            }
        },
        {
            "id": "needs_support",
            "name": "Academic Intervention Required",
            "description": "Low attendance and study hours indicating risk of marginal performance.",
            "data": {
                "Attendance": 55.0,
                "Hours_Studied": 8.0,
                "Previous_Scores": 58.0,
                "Access_to_Resources": "Low",
                "Parental_Involvement": "Low",
                "Tutoring_Sessions": 0.0,
                "Parental_Education_Level": "High School",
                "Peer_Influence": "Negative",
                "Distance_from_Home": "Far",
                "Motivation_Level": "Low",
                "Teacher_Quality": "Low",
                "Extracurricular_Activities": "No",
                "Internet_Access": "No"
            }
        },
        {
            "id": "rising_student",
            "name": "High Effort / Developing Foundation",
            "description": "Diligent student making rapid gains through tutoring and dedicated study.",
            "data": {
                "Attendance": 90.0,
                "Hours_Studied": 32.0,
                "Previous_Scores": 68.0,
                "Access_to_Resources": "Medium",
                "Parental_Involvement": "High",
                "Tutoring_Sessions": 5.0,
                "Parental_Education_Level": "College",
                "Peer_Influence": "Positive",
                "Distance_from_Home": "Moderate",
                "Motivation_Level": "High",
                "Teacher_Quality": "Medium",
                "Extracurricular_Activities": "Yes",
                "Internet_Access": "Yes"
            }
        }
    ]

@app.post("/api/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict_score(student: StudentFeatures):
    try:
        return model_service.predict(student)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction calculation failed: {str(e)}"
        )

@app.post("/api/simulate", response_model=SimulationResponse, tags=["Simulation"])
def simulate_scenario(request: SimulationRequest):
    try:
        base_resp = model_service.predict(request.baseline)
        mod_resp = model_service.predict(request.modified)

        delta = round(mod_resp.predicted_score - base_resp.predicted_score, 2)
        
        # Calculate feature differences
        base_dict = request.baseline.model_dump()
        mod_dict = request.modified.model_dump()
        changes = []

        for feat in model_service.features:
            if base_dict.get(feat) != mod_dict.get(feat):
                meta = model_service.feature_metadata.get(feat, {})
                label = meta.get("label", feat)
                
                # Point contribution change
                b_idx = model_service.features.index(feat)
                b_val = model_service.encode_feature(feat, base_dict[feat])
                m_val = model_service.encode_feature(feat, mod_dict[feat])
                
                b_z = (b_val - model_service.scaler_mean[b_idx]) / model_service.scaler_scale[b_idx]
                m_z = (m_val - model_service.scaler_mean[b_idx]) / model_service.scaler_scale[b_idx]
                
                feat_delta = round((m_z - b_z) * model_service.coef[b_idx], 2)
                
                changes.append({
                    "feature": feat,
                    "label": label,
                    "from_value": base_dict[feat],
                    "to_value": mod_dict[feat],
                    "impact_delta": feat_delta
                })

        return SimulationResponse(
            baseline_score=base_resp.predicted_score,
            modified_score=mod_resp.predicted_score,
            score_delta=delta,
            improved=delta > 0,
            feature_changes=changes
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Simulation calculation failed: {str(e)}"
        )

@app.post("/api/batch-predict", response_model=BatchPredictResponse, tags=["Batch"])
def batch_predict(request: BatchPredictRequest):
    try:
        results = [model_service.predict(s) for s in request.students]
        scores = [r.predicted_score for r in results]
        
        grades_count = {"A": 0, "B": 0, "C": 0, "D": 0, "F": 0}
        for r in results:
            grades_count[r.letter_grade] = grades_count.get(r.letter_grade, 0) + 1

        summary = {
            "total_students": len(scores),
            "mean_score": round(sum(scores) / len(scores), 2) if scores else 0.0,
            "min_score": min(scores) if scores else 0.0,
            "max_score": max(scores) if scores else 0.0,
            "grade_distribution": grades_count
        }

        return BatchPredictResponse(
            results=results,
            cohort_summary=summary
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Batch prediction failed: {str(e)}"
        )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
