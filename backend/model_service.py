import json
import math
from pathlib import Path
from typing import Dict, List, Any, Tuple, Optional
from schemas import StudentFeatures, FeatureImpact, Recommendation, PredictionResponse, FeatureMeta

class ModelService:
    def __init__(self, config_path: Optional[Path] = None):
        if config_path is None:
            candidates = [
                Path(__file__).resolve().parent / "model_parameters.json",
                Path.cwd() / "model_parameters.json",
                Path(__file__).resolve().parent.parent / "model_parameters.json",
                Path(__file__).resolve().parent / "backend" / "model_parameters.json",
            ]
            for c in candidates:
                if c.exists():
                    config_path = c
                    break
            if config_path is None or not Path(config_path).exists():
                config_path = Path(__file__).resolve().parent / "model_parameters.json"
        
        with open(config_path, "r", encoding="utf-8") as f:
            self.config = json.load(f)
            
        self.features: List[str] = self.config["selected_features"]
        self.ordinal_map: Dict[str, int] = self.config["ordinal_map"]
        self.modes: Dict[str, str] = self.config["modes"]
        self.scaler_mean: List[float] = self.config["scaler_mean"]
        self.scaler_scale: List[float] = self.config["scaler_scale"]
        self.coef: List[float] = self.config["coef"]
        self.intercept: float = self.config["intercept"]
        self.metrics: Dict[str, Any] = self.config.get("metrics", {})
        self.feature_metadata: Dict[str, Any] = self.config.get("feature_metadata", {})

    def encode_feature(self, feature_name: str, value: Any) -> float:
        if isinstance(value, (int, float)):
            return float(value)
        str_val = str(value).strip()
        if str_val in self.ordinal_map:
            return float(self.ordinal_map[str_val])
        # If missing or unexpected, fallback to mode or default
        if feature_name in self.modes:
            mode_val = self.modes[feature_name]
            return float(self.ordinal_map.get(mode_val, 0))
        return 0.0

    def predict_raw(self, student_dict: Dict[str, Any]) -> Tuple[float, float, List[float], List[float]]:
        """Returns (clamped_score, raw_score, standardized_values, point_contributions)"""
        encoded_vals: List[float] = []
        for feat in self.features:
            val = student_dict.get(feat)
            if val is None:
                default_val = self.feature_metadata.get(feat, {}).get("default")
                encoded_vals.append(self.encode_feature(feat, default_val))
            else:
                encoded_vals.append(self.encode_feature(feat, val))

        z_scores: List[float] = []
        contributions: List[float] = []
        raw_score = self.intercept

        for i in range(len(self.features)):
            z = (encoded_vals[i] - self.scaler_mean[i]) / self.scaler_scale[i]
            contrib = self.coef[i] * z
            z_scores.append(z)
            contributions.append(contrib)
            raw_score += contrib

        clamped = max(0.0, min(100.0, raw_score))
        return round(clamped, 2), round(raw_score, 2), z_scores, contributions

    def predict(self, student: StudentFeatures) -> PredictionResponse:
        student_dict = student.model_dump()
        score, raw_score, z_scores, contributions = self.predict_raw(student_dict)

        # Grade classification
        if score >= 90.0:
            letter_grade = "A"
            band = "Exceptional Mastery"
        elif score >= 80.0:
            letter_grade = "B"
            band = "Proficient"
        elif score >= 70.0:
            letter_grade = "C"
            band = "Satisfactory"
        elif score >= 60.0:
            letter_grade = "D"
            band = "Marginal Pass"
        else:
            letter_grade = "F"
            band = "Needs Targeted Intervention"

        # Cohort percentile estimate using empirical CDF approximation
        # Dataset Exam_Score mean is ~67.2, standard deviation ~4.1
        mean_score = 67.21
        std_score = 4.10
        norm_z = (score - mean_score) / std_score
        percentile = round(0.5 * (1.0 + math.erf(norm_z / math.sqrt(2.0))) * 100, 1)
        percentile = max(0.1, min(99.9, percentile))

        # Build feature impacts
        impacts: List[FeatureImpact] = []
        for i, feat in enumerate(self.features):
            meta = self.feature_metadata.get(feat, {})
            label = meta.get("label", feat)
            pts = round(contributions[i], 2)
            direction = "positive" if pts > 0.05 else ("negative" if pts < -0.05 else "neutral")
            
            unit = meta.get("unit", "")
            raw_val = student_dict.get(feat)
            val_display = f"{raw_val} {unit}".strip() if unit else str(raw_val)

            desc = f"{val_display} contributes {pts:+.2f} pts relative to student average"
            impacts.append(
                FeatureImpact(
                    feature=feat,
                    label=label,
                    value=student_dict.get(feat),
                    points_impact=pts,
                    direction=direction,
                    description=desc
                )
            )

        # Sort impacts by magnitude
        impacts.sort(key=lambda x: abs(x.points_impact), reverse=True)

        # Generate targeted recommendations
        recommendations: List[Recommendation] = []
        
        # Attendance recommendation (coef / scale ~ +0.198 pts per 1%)
        att = student.Attendance
        if att < 95.0:
            gain = round((95.0 - att) * (self.coef[0] / self.scaler_scale[0]), 2)
            if gain > 0.3:
                recommendations.append(
                    Recommendation(
                        category="Classroom Engagement",
                        feature="Attendance",
                        suggestion=f"Target 95% attendance (current: {att:.0f}%). Consistent participation provides structured revision.",
                        potential_gain=gain
                    )
                )

        # Study hours recommendation (coef / scale ~ +0.295 pts per 1 hr)
        hrs = student.Hours_Studied
        if hrs < 28.0:
            additional_hrs = min(10.0, 30.0 - hrs)
            gain = round(additional_hrs * (self.coef[1] / self.scaler_scale[1]), 2)
            if gain > 0.3:
                recommendations.append(
                    Recommendation(
                        category="Dedicated Study Time",
                        feature="Hours_Studied",
                        suggestion=f"Increase weekly study by {additional_hrs:.0f} hours (reach {hrs + additional_hrs:.0f} hrs/wk) to solidify mastery.",
                        potential_gain=gain
                    )
                )

        # Tutoring sessions recommendation (coef / scale ~ +0.481 pts per session)
        tutor = student.Tutoring_Sessions
        if tutor < 4.0:
            add_tutor = 4.0 - tutor
            gain = round(add_tutor * (self.coef[5] / self.scaler_scale[5]), 2)
            if gain > 0.3:
                recommendations.append(
                    Recommendation(
                        category="Academic Tutoring",
                        feature="Tutoring_Sessions",
                        suggestion=f"Schedule {add_tutor:.0f} additional monthly mentoring sessions to troubleshoot difficult syllabus units.",
                        potential_gain=gain
                    )
                )

        # Resource access recommendation
        if student.Access_to_Resources in ["Low", "Medium"]:
            curr_code = self.ordinal_map.get(student.Access_to_Resources, 1)
            gain = round((2 - curr_code) * (self.coef[3] / self.scaler_scale[3]), 2)
            recommendations.append(
                Recommendation(
                    category="Learning Resources",
                    feature="Access_to_Resources",
                    suggestion="Utilize campus library archives, digital textbooks, and lab repositories to access high-quality materials.",
                    potential_gain=gain
                )
            )

        # Peer influence recommendation
        if student.Peer_Influence in ["Negative", "Neutral"]:
            curr_code = self.ordinal_map.get(student.Peer_Influence, 1)
            gain = round((2 - curr_code) * (self.coef[7] / self.scaler_scale[7]), 2)
            recommendations.append(
                Recommendation(
                    category="Peer Environment",
                    feature="Peer_Influence",
                    suggestion="Form or join focused collegiate study circles with students sharing high academic milestones.",
                    potential_gain=gain
                )
            )

        # Baseline comparison
        baseline_comp = {
            "cohort_average_score": mean_score,
            "delta_from_cohort_average": round(score - mean_score, 2),
            "predicted_ranking": "Above Average" if score > mean_score else "Below Average"
        }

        return PredictionResponse(
            predicted_score=score,
            raw_score=raw_score,
            letter_grade=letter_grade,
            performance_band=band,
            percentile_estimate=percentile,
            feature_impacts=impacts,
            recommendations=recommendations,
            baseline_comparison=baseline_comp
        )

    def get_features_metadata(self) -> List[FeatureMeta]:
        # Sort features by absolute coefficient weight
        pairs = list(zip(self.features, self.coef))
        pairs.sort(key=lambda p: abs(p[1]), reverse=True)
        ranks = {p[0]: idx + 1 for idx, p in enumerate(pairs)}

        result: List[FeatureMeta] = []
        for feat in self.features:
            meta = self.feature_metadata.get(feat, {})
            idx = self.features.index(feat)
            result.append(
                FeatureMeta(
                    name=feat,
                    label=meta.get("label", feat),
                    type=meta.get("type", "numeric"),
                    description=meta.get("description", ""),
                    unit=meta.get("unit"),
                    min=meta.get("min"),
                    max=meta.get("max"),
                    default=meta.get("default"),
                    options=meta.get("options"),
                    importance_rank=ranks.get(feat, 99),
                    coefficient_weight=round(self.coef[idx], 4)
                )
            )
        return result
