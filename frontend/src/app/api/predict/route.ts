import { NextRequest, NextResponse } from "next/server";
import { calculatePrediction, StudentFeatures } from "@/lib/modelEngine";

export async function POST(req: NextRequest) {
  try {
    const body: StudentFeatures = await req.json();

    const fastapiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.FASTAPI_URL;
    if (fastapiUrl) {
      try {
        const response = await fetch(`${fastapiUrl}/api/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (response.ok) {
          const data = await response.json();
          return NextResponse.json(data);
        }
      } catch (err) {
        // Fallback to internal engine
      }
    }

    const result = calculatePrediction(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Invalid prediction request payload", details: error?.message },
      { status: 400 }
    );
  }
}
