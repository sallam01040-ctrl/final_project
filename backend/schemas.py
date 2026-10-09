from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field

class StudentFeatures(BaseModel):
    Attendance: float = Field(..., ge=0.0, le=100.0, description="Attendance percentage (0-100%)", example=85.0)
    Hours_Studied: float = Field(..., ge=0.0, le=60.0, description="Weekly self-study hours", example=22.0)
    Previous_Scores: float = Field(..., ge=0.0, le=100.0, description="Prior qualification exam score (0-100)", example=78.0)
    Access_to_Resources: str = Field(..., description="Access to books and learning materials (Low, Medium, High)", example="Medium")
    Parental_Involvement: str = Field(..., description="Guardian involvement level (Low, Medium, High)", example="Medium")
    Tutoring_Sessions: float = Field(..., ge=0.0, le=20.0, description="Tutoring sessions attended monthly", example=2.0)
    Parental_Education_Level: str = Field(..., description="Guardian education (High School, College, Postgraduate)", example="College")
    Peer_Influence: str = Field(..., description="Peer academic influence (Negative, Neutral, Positive)", example="Positive")
    Distance_from_Home: str = Field(..., description="Commute distance from campus (Near, Moderate, Far)", example="Near")
    Motivation_Level: str = Field(..., description="Student motivation level (Low, Medium, High)", example="High")
    Teacher_Quality: str = Field(..., description="Instruction quality rating (Low, Medium, High)", example="High")
    Extracurricular_Activities: str = Field(..., description="Participation in student clubs (No, Yes)", example="Yes")
    Internet_Access: str = Field(..., description="High-speed home internet access (No, Yes)", example="Yes")

    model_config = {
        "json_schema_extra": {
            "example": {
                "Attendance": 85.0,
                "Hours_Studied": 22.0,
                "Previous_Scores": 78.0,
                "Access_to_Resources": "Medium",
                "Parental_Involvement": "Medium",
                "Tutoring_Sessions": 2.0,
                "Parental_Education_Level": "College",
                "Peer_Influence": "Positive",
                "Distance_from_Home": "Near",
                "Motivation_Level": "High",
                "Teacher_Quality": "High",
                "Extracurricular_Activities": "Yes",
                "Internet_Access": "Yes"
            }
        }
    }

class FeatureImpact(BaseModel):
    feature: str
    label: str
    value: Any
    points_impact: float
    direction: str  # "positive", "negative", "neutral"
    description: str

class Recommendation(BaseModel):
    category: str
    feature: str
    suggestion: str
    potential_gain: float

class PredictionResponse(BaseModel):
    predicted_score: float
    raw_score: float
    letter_grade: str
    performance_band: str
    percentile_estimate: float
    feature_impacts: List[FeatureImpact]
    recommendations: List[Recommendation]
    baseline_comparison: Dict[str, Any]

class SimulationRequest(BaseModel):
    baseline: StudentFeatures
    modified: StudentFeatures

class SimulationResponse(BaseModel):
    baseline_score: float
    modified_score: float
    score_delta: float
    improved: bool
    feature_changes: List[Dict[str, Any]]

class BatchPredictRequest(BaseModel):
    students: List[StudentFeatures]

class BatchPredictResponse(BaseModel):
    results: List[PredictionResponse]
    cohort_summary: Dict[str, Any]

class FeatureMeta(BaseModel):
    name: str
    label: str
    type: str
    description: str
    unit: Optional[str] = None
    min: Optional[float] = None
    max: Optional[float] = None
    default: Any
    options: Optional[List[str]] = None
    importance_rank: int
    coefficient_weight: float

class ModelInfoResponse(BaseModel):
    model_name: str
    algorithm: str
    features_count: int
    metrics: Dict[str, Any]
    intercept: float
    features: List[FeatureMeta]
