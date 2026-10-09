export interface StudentFeatures {
  Attendance: number;
  Hours_Studied: number;
  Previous_Scores: number;
  Access_to_Resources: "Low" | "Medium" | "High";
  Parental_Involvement: "Low" | "Medium" | "High";
  Tutoring_Sessions: number;
  Parental_Education_Level: "High School" | "College" | "Postgraduate";
  Peer_Influence: "Negative" | "Neutral" | "Positive";
  Distance_from_Home: "Near" | "Moderate" | "Far";
  Motivation_Level: "Low" | "Medium" | "High";
  Teacher_Quality: "Low" | "Medium" | "High";
  Extracurricular_Activities: "No" | "Yes";
  Internet_Access: "No" | "Yes";
}

export interface FeatureImpact {
  feature: keyof StudentFeatures;
  label: string;
  value: string | number;
  points_impact: number;
  direction: "positive" | "negative" | "neutral";
  description: string;
}

export interface Recommendation {
  category: string;
  feature: keyof StudentFeatures;
  suggestion: string;
  potential_gain: number;
}

export interface PredictionResult {
  predicted_score: number;
  raw_score: number;
  letter_grade: "A" | "B" | "C" | "D" | "F";
  performance_band: string;
  percentile_estimate: number;
  feature_impacts: FeatureImpact[];
  recommendations: Recommendation[];
  baseline_comparison: {
    cohort_average_score: number;
    delta_from_cohort_average: number;
    predicted_ranking: string;
  };
}

export const FEATURE_METADATA: Record<
  keyof StudentFeatures,
  {
    label: string;
    description: string;
    type: "numeric" | "categorical";
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    options?: string[];
    default: any;
    weight: number;
    rank: number;
  }
> = {
  Attendance: {
    label: "Attendance Rate",
    description: "Percentage of class sessions attended across the academic term.",
    type: "numeric",
    min: 0,
    max: 100,
    step: 1,
    unit: "%",
    default: 80,
    weight: 2.284,
    rank: 1,
  },
  Hours_Studied: {
    label: "Weekly Study Hours",
    description: "Hours spent in structured independent study outside the lecture hall.",
    type: "numeric",
    min: 0,
    max: 45,
    step: 1,
    unit: "hrs/wk",
    default: 20,
    weight: 1.736,
    rank: 2,
  },
  Previous_Scores: {
    label: "Previous Exam Score",
    description: "Standardized performance score achieved on previous semester assessments.",
    type: "numeric",
    min: 0,
    max: 100,
    step: 1,
    unit: "pts",
    default: 75,
    weight: 0.677,
    rank: 5,
  },
  Access_to_Resources: {
    label: "Resource Access",
    description: "Availability of academic literature, syllabus textbooks, and technical facilities.",
    type: "categorical",
    options: ["Low", "Medium", "High"],
    default: "Medium",
    weight: 0.731,
    rank: 3,
  },
  Parental_Involvement: {
    label: "Parental Engagement",
    description: "Active oversight, guidance, and institutional interaction by guardians.",
    type: "categorical",
    options: ["Low", "Medium", "High"],
    default: "Medium",
    weight: 0.676,
    rank: 6,
  },
  Tutoring_Sessions: {
    label: "Monthly Tutoring",
    description: "Attended one-on-one or small-group academic coaching sessions per month.",
    type: "numeric",
    min: 0,
    max: 10,
    step: 1,
    unit: "sessions",
    default: 2,
    weight: 0.587,
    rank: 7,
  },
  Parental_Education_Level: {
    label: "Guardian Education",
    description: "Highest academic credential completed by primary household guardian.",
    type: "categorical",
    options: ["High School", "College", "Postgraduate"],
    default: "High School",
    weight: 0.38,
    rank: 9,
  },
  Peer_Influence: {
    label: "Peer Study Environment",
    description: "Scholastic orientation, mutual study habits, and academic encouragement within peer group.",
    type: "categorical",
    options: ["Negative", "Neutral", "Positive"],
    default: "Neutral",
    weight: 0.391,
    rank: 8,
  },
  Distance_from_Home: {
    label: "Campus Proximity",
    description: "Commute distance and transit duration between residence and campus.",
    type: "categorical",
    options: ["Near", "Moderate", "Far"],
    default: "Near",
    weight: -0.32,
    rank: 11,
  },
  Motivation_Level: {
    label: "Scholastic Motivation",
    description: "Student self-drive, academic goals, and commitment to learning objectives.",
    type: "categorical",
    options: ["Low", "Medium", "High"],
    default: "Medium",
    weight: 0.368,
    rank: 10,
  },
  Teacher_Quality: {
    label: "Faculty Quality",
    description: "Evaluation of instructor pedagogy, subject mastery, and feedback clarity.",
    type: "categorical",
    options: ["Low", "Medium", "High"],
    default: "Medium",
    weight: 0.308,
    rank: 12,
  },
  Extracurricular_Activities: {
    label: "Extracurriculars",
    description: "Participation in collegiate societies, sports teams, or academic clubs.",
    type: "categorical",
    options: ["No", "Yes"],
    default: "Yes",
    weight: 0.282,
    rank: 13,
  },
  Internet_Access: {
    label: "Broadband Connectivity",
    description: "Reliable internet access at home for research, portal submissions, and learning materials.",
    type: "categorical",
    options: ["No", "Yes"],
    default: "Yes",
    weight: 0.249,
    rank: 14,
  },
};

const ORDINAL_MAP: Record<string, number> = {
  Low: 0,
  Medium: 1,
  High: 2,
  No: 0,
  Yes: 1,
  Negative: 0,
  Neutral: 1,
  Positive: 2,
  Near: 0,
  Moderate: 1,
  Far: 2,
  "High School": 0,
  College: 1,
  Postgraduate: 2,
};

const FEATURES_ORDER: (keyof StudentFeatures)[] = [
  "Attendance",
  "Hours_Studied",
  "Previous_Scores",
  "Access_to_Resources",
  "Parental_Involvement",
  "Tutoring_Sessions",
  "Parental_Education_Level",
  "Peer_Influence",
  "Distance_from_Home",
  "Motivation_Level",
  "Teacher_Quality",
  "Extracurricular_Activities",
  "Internet_Access",
];

const SCALER_MEAN: number[] = [
  79.91937925813778,
  19.934897804693414,
  74.99791824375473,
  1.0967070401211203,
  1.0874337623012869,
  1.4909159727479182,
  0.6905753217259651,
  1.1858440575321727,
  0.5073807721423165,
  0.9082134746404239,
  1.1905753217259651,
  0.5940575321725965,
  0.9244890234670704,
];

const SCALER_SCALE: number[] = [
  11.540925889823221,
  5.891293901929581,
  14.421765352350302,
  0.7005976013081716,
  0.6938146757457955,
  1.219523551396003,
  0.7766329346493427,
  0.7546852314332215,
  0.6723578887478024,
  0.6947520831764996,
  0.5976060383771535,
  0.4910734982073467,
  0.26421405896729444,
];

const COEFFICIENTS: number[] = [
  2.284026824784382,
  1.735575738028145,
  0.6770424014810719,
  0.7306534592240488,
  0.676059242843587,
  0.5868926276712603,
  0.37998468322541773,
  0.39124423498287736,
  -0.3197133712625435,
  0.3681299926113023,
  0.3077623074445223,
  0.28214434026719704,
  0.24877934469308932,
];

const INTERCEPT = 67.21347464042393;

function encodeVal(val: any): number {
  if (typeof val === "number") return val;
  if (typeof val === "string" && val in ORDINAL_MAP) {
    return ORDINAL_MAP[val];
  }
  return 0;
}

// Approximation of standard normal error function
function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const t = 1.0 / (1.0 + p * absX);
  const y =
    1.0 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
  return sign * y;
}

export function calculatePrediction(student: StudentFeatures): PredictionResult {
  let rawScore = INTERCEPT;
  const featureImpacts: FeatureImpact[] = [];

  FEATURES_ORDER.forEach((feat, i) => {
    const rawVal = student[feat];
    const encoded = encodeVal(rawVal);
    const z = (encoded - SCALER_MEAN[i]) / SCALER_SCALE[i];
    const impact = COEFFICIENTS[i] * z;
    rawScore += impact;

    const meta = FEATURE_METADATA[feat];
    const displayVal = meta.unit ? `${rawVal} ${meta.unit}` : `${rawVal}`;
    const pts = Math.round(impact * 100) / 100;

    featureImpacts.push({
      feature: feat,
      label: meta.label,
      value: rawVal,
      points_impact: pts,
      direction: pts > 0.05 ? "positive" : pts < -0.05 ? "negative" : "neutral",
      description: `${displayVal} contributes ${pts >= 0 ? "+" : ""}${pts.toFixed(
        2
      )} pts relative to average student.`,
    });
  });

  const clampedScore = Math.max(0, Math.min(100, Math.round(rawScore * 100) / 100));

  let letterGrade: "A" | "B" | "C" | "D" | "F" = "F";
  let performanceBand = "Needs Targeted Intervention";
  if (clampedScore >= 90) {
    letterGrade = "A";
    performanceBand = "Exceptional Mastery";
  } else if (clampedScore >= 80) {
    letterGrade = "B";
    performanceBand = "Proficient";
  } else if (clampedScore >= 70) {
    letterGrade = "C";
    performanceBand = "Satisfactory";
  } else if (clampedScore >= 60) {
    letterGrade = "D";
    performanceBand = "Marginal Pass";
  }

  // Percentile estimate (mean ~67.21, std ~4.10)
  const normZ = (clampedScore - 67.21) / 4.1;
  let percentile = Math.round(0.5 * (1 + erf(normZ / Math.SQRT2)) * 1000) / 10;
  percentile = Math.max(0.1, Math.min(99.9, percentile));

  // Sort impacts by absolute points
  featureImpacts.sort((a, b) => Math.abs(b.points_impact) - Math.abs(a.points_impact));

  // Recommendations
  const recommendations: Recommendation[] = [];

  if (student.Attendance < 95) {
    const gain = Math.round((95 - student.Attendance) * (COEFFICIENTS[0] / SCALER_SCALE[0]) * 10) / 10;
    if (gain > 0.3) {
      recommendations.append?.({
        category: "Classroom Engagement",
        feature: "Attendance",
        suggestion: `Target 95% attendance (current: ${student.Attendance}%). Structured lecture attendance is the strongest driver of syllabus comprehension.`,
        potential_gain: gain,
      }) ||
        recommendations.push({
          category: "Classroom Engagement",
          feature: "Attendance",
          suggestion: `Target 95% attendance (current: ${student.Attendance}%). Structured lecture attendance is the strongest driver of syllabus comprehension.`,
          potential_gain: gain,
        });
    }
  }

  if (student.Hours_Studied < 28) {
    const extraHours = Math.min(10, 30 - student.Hours_Studied);
    const gain = Math.round(extraHours * (COEFFICIENTS[1] / SCALER_SCALE[1]) * 10) / 10;
    if (gain > 0.3) {
      recommendations.push({
        category: "Study Regimen",
        feature: "Hours_Studied",
        suggestion: `Increase weekly independent study by ${extraHours} hrs (reaching ${
          student.Hours_Studied + extraHours
        } hrs/wk) to reinforce problem sets.`,
        potential_gain: gain,
      });
    }
  }

  if (student.Tutoring_Sessions < 4) {
    const addSessions = 4 - student.Tutoring_Sessions;
    const gain = Math.round(addSessions * (COEFFICIENTS[5] / SCALER_SCALE[5]) * 10) / 10;
    if (gain > 0.3) {
      recommendations.push({
        category: "Mentorship & Tutoring",
        feature: "Tutoring_Sessions",
        suggestion: `Attend ${addSessions} additional mentoring sessions monthly for targeted review of challenging topics.`,
        potential_gain: gain,
      });
    }
  }

  if (student.Access_to_Resources !== "High") {
    const currentCode = ORDINAL_MAP[student.Access_to_Resources];
    const gain = Math.round((2 - currentCode) * (COEFFICIENTS[3] / SCALER_SCALE[3]) * 10) / 10;
    recommendations.push({
      category: "Academic Resources",
      feature: "Access_to_Resources",
      suggestion:
        "Leverage institutional library digital databases, reference manuals, and laboratory repositories to access high-quality study materials.",
      potential_gain: gain,
    });
  }

  if (student.Peer_Influence !== "Positive") {
    const currentCode = ORDINAL_MAP[student.Peer_Influence];
    const gain = Math.round((2 - currentCode) * (COEFFICIENTS[7] / SCALER_SCALE[7]) * 10) / 10;
    recommendations.push({
      category: "Peer Study Dynamics",
      feature: "Peer_Influence",
      suggestion:
        "Join an active peer study group focused on structured exam prep and milestone accountability.",
      potential_gain: gain,
    });
  }

  return {
    predicted_score: clampedScore,
    raw_score: Math.round(rawScore * 100) / 100,
    letter_grade: letterGrade,
    performance_band: performanceBand,
    percentile_estimate: percentile,
    feature_impacts: featureImpacts,
    recommendations,
    baseline_comparison: {
      cohort_average_score: 67.21,
      delta_from_cohort_average: Math.round((clampedScore - 67.21) * 100) / 100,
      predicted_ranking: clampedScore >= 67.21 ? "Above Cohort Average" : "Below Cohort Average",
    },
  };
}

export const SAMPLE_STUDENTS: {
  id: string;
  name: string;
  badge: string;
  description: string;
  features: StudentFeatures;
}[] = [
  {
    id: "high_achiever",
    name: "Honor Roll Candidate",
    badge: "Mastery Level",
    description: "Consistent high attendance, rigorous study routine, and positive peer mentorship.",
    features: {
      Attendance: 96,
      Hours_Studied: 36,
      Previous_Scores: 90,
      Access_to_Resources: "High",
      Parental_Involvement: "High",
      Tutoring_Sessions: 4,
      Parental_Education_Level: "Postgraduate",
      Peer_Influence: "Positive",
      Distance_from_Home: "Near",
      Motivation_Level: "High",
      Teacher_Quality: "High",
      Extracurricular_Activities: "Yes",
      Internet_Access: "Yes",
    },
  },
  {
    id: "typical_average",
    name: "Standard Cohort Average",
    badge: "Benchmark Median",
    description: "Represents the exact central tendencies observed in the 6,607 student qualification dataset.",
    features: {
      Attendance: 80,
      Hours_Studied: 20,
      Previous_Scores: 75,
      Access_to_Resources: "Medium",
      Parental_Involvement: "Medium",
      Tutoring_Sessions: 1,
      Parental_Education_Level: "High School",
      Peer_Influence: "Neutral",
      Distance_from_Home: "Near",
      Motivation_Level: "Medium",
      Teacher_Quality: "Medium",
      Extracurricular_Activities: "Yes",
      Internet_Access: "Yes",
    },
  },
  {
    id: "needs_support",
    name: "Targeted Intervention Profile",
    badge: "At Risk",
    description: "Low attendance and limited study hours indicating high risk of marginal academic standing.",
    features: {
      Attendance: 55,
      Hours_Studied: 8,
      Previous_Scores: 58,
      Access_to_Resources: "Low",
      Parental_Involvement: "Low",
      Tutoring_Sessions: 0,
      Parental_Education_Level: "High School",
      Peer_Influence: "Negative",
      Distance_from_Home: "Far",
      Motivation_Level: "Low",
      Teacher_Quality: "Low",
      Extracurricular_Activities: "No",
      Internet_Access: "No",
    },
  },
  {
    id: "diligent_riser",
    name: "High Effort Improver",
    badge: "Rising Growth",
    description: "Student with developing foundation achieving acceleration through dedicated study hours and tutoring.",
    features: {
      Attendance: 92,
      Hours_Studied: 32,
      Previous_Scores: 68,
      Access_to_Resources: "Medium",
      Parental_Involvement: "High",
      Tutoring_Sessions: 5,
      Parental_Education_Level: "College",
      Peer_Influence: "Positive",
      Distance_from_Home: "Moderate",
      Motivation_Level: "High",
      Teacher_Quality: "Medium",
      Extracurricular_Activities: "Yes",
      Internet_Access: "Yes",
    },
  },
];
