import { NextResponse } from "next/server";
import { FEATURE_METADATA } from "@/lib/modelEngine";

export async function GET() {
  const fastapiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.FASTAPI_URL;
  if (fastapiUrl) {
    try {
      const response = await fetch(`${fastapiUrl}/api/model/info`);
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (e) {
      // Fallback
    }
  }

  return NextResponse.json({
    model_name: "Student Exam Score Predictor",
    algorithm: "StandardScaler + Multiple Linear Regression",
    features_count: 13,
    intercept: 67.21347464042393,
    metrics: {
      mae: 0.598,
      rmse: 1.516,
      r2: 0.829,
      training_samples: 5285,
      test_samples: 1322,
      total_records: 6607,
    },
    features: FEATURE_METADATA,
  });
}
