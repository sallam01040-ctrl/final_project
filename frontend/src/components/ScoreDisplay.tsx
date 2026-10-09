import React from "react";
import { PredictionResult } from "@/lib/modelEngine";
import { AwardIcon, TrendingUpIcon, TrendingDownIcon, TargetIcon, ShieldCheckIcon } from "./Icons";

interface ScoreDisplayProps {
  result: PredictionResult;
  isLoading?: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ result, isLoading }) => {
  const {
    predicted_score,
    raw_score,
    letter_grade,
    performance_band,
    percentile_estimate,
    baseline_comparison,
  } = result;

  const isAboveAverage = baseline_comparison.delta_from_cohort_average >= 0;

  // Grade color map
  const gradeStyles: Record<string, { bg: string; text: string; border: string }> = {
    A: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    B: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    C: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    D: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
    F: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  };

  const style = gradeStyles[letter_grade] || gradeStyles.C;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-500">
            Performance Forecast
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistical regression estimate with 95% confidence bounds
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
          <ShieldCheckIcon className="w-3.5 h-3.5 text-slate-600" />
          <span>Model Validated (R² = 0.83)</span>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-5 rounded-lg bg-slate-50/80 border border-slate-100">
        <div className="flex items-center gap-5">
          {/* Letter Grade Token */}
          <div
            className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center border font-mono font-bold text-2xl shadow-sm ${style.bg} ${style.text} ${style.border}`}
          >
            {letter_grade}
            <span className="text-[10px] uppercase font-sans font-medium tracking-wider opacity-75">
              Grade
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-mono font-extrabold tracking-tight text-slate-900 tabular-nums">
                {predicted_score.toFixed(1)}
              </span>
              <span className="text-lg font-mono text-slate-400 font-medium">/ 100</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200/70 text-slate-800">
                {performance_band}
              </span>
              {raw_score !== predicted_score && (
                <span className="text-[11px] text-slate-500">
                  (clamped from {raw_score.toFixed(1)})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Delta vs Cohort Benchmarks */}
        <div className="flex flex-row sm:flex-col items-end gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Delta from Average</span>
            <div
              className={`inline-flex items-center gap-1 text-sm font-mono font-bold tabular-nums ${
                isAboveAverage ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              {isAboveAverage ? (
                <TrendingUpIcon className="w-4 h-4" />
              ) : (
                <TrendingDownIcon className="w-4 h-4" />
              )}
              {isAboveAverage ? "+" : ""}
              {baseline_comparison.delta_from_cohort_average.toFixed(1)} pts
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 block">Cohort Percentile</span>
            <span className="text-sm font-mono font-semibold text-slate-800 tabular-nums">
              {percentile_estimate}th %ile
            </span>
          </div>
        </div>
      </div>

      {/* Metric Breakdown Progress Line */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
          <span>Passing Threshold (60)</span>
          <span>Cohort Average (67.2)</span>
          <span>Honors Threshold (85)</span>
        </div>
        <div className="relative h-3 w-full bg-slate-200 rounded-full overflow-hidden">
          {/* Passing Marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
            style={{ left: "60%" }}
            title="Passing mark (60%)"
          />
          {/* Average Marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-600 z-10"
            style={{ left: "67.2%" }}
            title="Cohort mean (67.2%)"
          />
          {/* Honors Marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-500 z-10"
            style={{ left: "85%" }}
            title="Honors mark (85%)"
          />
          {/* Student Progress Fill */}
          <div
            className={`h-full transition-all duration-500 ${
              predicted_score >= 85
                ? "bg-emerald-600"
                : predicted_score >= 70
                ? "bg-blue-600"
                : predicted_score >= 60
                ? "bg-amber-600"
                : "bg-rose-600"
            }`}
            style={{ width: `${Math.min(100, Math.max(0, predicted_score))}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
};
