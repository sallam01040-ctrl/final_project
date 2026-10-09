import React, { useState } from "react";
import {
  StudentFeatures,
  FEATURE_METADATA,
  calculatePrediction,
  SAMPLE_STUDENTS,
} from "@/lib/modelEngine";
import { LayersIcon, TrendingUpIcon, TrendingDownIcon, RefreshCwIcon, ArrowRightIcon } from "./Icons";

export const ScenarioSimulator: React.FC = () => {
  // Baseline profile starts as standard cohort average
  const [baseline, setBaseline] = useState<StudentFeatures>({
    ...SAMPLE_STUDENTS[1].features,
  });

  // Scenario copy that user can modify
  const [scenario, setScenario] = useState<StudentFeatures>({
    ...SAMPLE_STUDENTS[1].features,
    Attendance: 92,
    Hours_Studied: 28,
    Tutoring_Sessions: 3,
  });

  const baseResult = calculatePrediction(baseline);
  const scenResult = calculatePrediction(scenario);

  const delta = Math.round((scenResult.predicted_score - baseResult.predicted_score) * 10) / 10;
  const isPositive = delta >= 0;

  const updateScenario = (key: keyof StudentFeatures, val: any) => {
    setScenario({ ...scenario, [key]: val });
  };

  const syncScenarioWithBase = () => {
    setScenario({ ...baseline });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <LayersIcon className="w-5 h-5 text-slate-800" />
            <div>
              <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                Hypothesis & Scenario Simulator
              </h2>
              <p className="text-xs text-slate-500">
                Simulate targeted intervention policies to calculate projected student outcome shifts
              </p>
            </div>
          </div>

          <button
            onClick={syncScenarioWithBase}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors w-fit"
          >
            <RefreshCwIcon className="w-3.5 h-3.5" />
            Reset to Baseline
          </button>
        </div>

        {/* Comparison Result Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          {/* Baseline Outcome */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Baseline Position
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-slate-800 tabular-nums">
                {baseResult.predicted_score.toFixed(1)}
              </span>
              <span className="text-sm font-mono text-slate-400">/ 100</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                Grade {baseResult.letter_grade}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {baseResult.percentile_estimate}th %ile
              </span>
            </div>
          </div>

          {/* Delta Indicator */}
          <div
            className={`p-4 rounded-lg border flex flex-col justify-center items-center text-center ${
              isPositive
                ? "bg-emerald-50/70 border-emerald-200/80"
                : "bg-rose-50/70 border-rose-200/80"
            }`}
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 block mb-1">
              Projected Outcome Shift
            </span>
            <div
              className={`inline-flex items-center gap-1.5 text-3xl font-mono font-extrabold tabular-nums ${
                isPositive ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              {isPositive ? (
                <TrendingUpIcon className="w-6 h-6" />
              ) : (
                <TrendingDownIcon className="w-6 h-6" />
              )}
              {isPositive ? "+" : ""}
              {delta.toFixed(1)} pts
            </div>
            <span className="text-xs text-slate-600 mt-1">
              {baseResult.letter_grade} → {scenResult.letter_grade} (
              {delta >= 0 ? "Accelerating" : "Regressing"})
            </span>
          </div>

          {/* Simulated Outcome */}
          <div className="p-4 rounded-lg bg-slate-900 text-white border border-slate-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Simulated Future State
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-white tabular-nums">
                {scenResult.predicted_score.toFixed(1)}
              </span>
              <span className="text-sm font-mono text-slate-400">/ 100</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-200">
                Grade {scenResult.letter_grade}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {scenResult.percentile_estimate}th %ile
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Scenario Adjustment Sliders */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-6">
        <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
          Adjust Intervention Knobs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Attendance Adjustment */}
          <div className="space-y-2 p-4 rounded-lg bg-slate-50/70 border border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-800">Attendance Rate</span>
              <span className="font-mono font-bold text-slate-900">
                {baseline.Attendance}% → {scenario.Attendance}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={scenario.Attendance}
              onChange={(e) => updateScenario("Attendance", Number(e.target.value))}
              className="w-full accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Baseline: {baseline.Attendance}%</span>
              <span
                className={
                  scenario.Attendance >= baseline.Attendance
                    ? "text-emerald-700 font-semibold"
                    : "text-rose-700 font-semibold"
                }
              >
                {scenario.Attendance - baseline.Attendance >= 0 ? "+" : ""}
                {scenario.Attendance - baseline.Attendance}% delta
              </span>
            </div>
          </div>

          {/* Study Hours Adjustment */}
          <div className="space-y-2 p-4 rounded-lg bg-slate-50/70 border border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-800">Weekly Study Hours</span>
              <span className="font-mono font-bold text-slate-900">
                {baseline.Hours_Studied} hrs → {scenario.Hours_Studied} hrs
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={45}
              step={1}
              value={scenario.Hours_Studied}
              onChange={(e) => updateScenario("Hours_Studied", Number(e.target.value))}
              className="w-full accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Baseline: {baseline.Hours_Studied} hrs</span>
              <span
                className={
                  scenario.Hours_Studied >= baseline.Hours_Studied
                    ? "text-emerald-700 font-semibold"
                    : "text-rose-700 font-semibold"
                }
              >
                {scenario.Hours_Studied - baseline.Hours_Studied >= 0 ? "+" : ""}
                {scenario.Hours_Studied - baseline.Hours_Studied} hrs delta
              </span>
            </div>
          </div>

          {/* Tutoring Sessions Adjustment */}
          <div className="space-y-2 p-4 rounded-lg bg-slate-50/70 border border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-800">Tutoring Sessions / Mo</span>
              <span className="font-mono font-bold text-slate-900">
                {baseline.Tutoring_Sessions} → {scenario.Tutoring_Sessions} sessions
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={scenario.Tutoring_Sessions}
              onChange={(e) => updateScenario("Tutoring_Sessions", Number(e.target.value))}
              className="w-full accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Baseline: {baseline.Tutoring_Sessions}</span>
              <span
                className={
                  scenario.Tutoring_Sessions >= baseline.Tutoring_Sessions
                    ? "text-emerald-700 font-semibold"
                    : "text-rose-700 font-semibold"
                }
              >
                {scenario.Tutoring_Sessions - baseline.Tutoring_Sessions >= 0 ? "+" : ""}
                {scenario.Tutoring_Sessions - baseline.Tutoring_Sessions} sessions delta
              </span>
            </div>
          </div>

          {/* Resource Access Adjustment */}
          <div className="space-y-2 p-4 rounded-lg bg-slate-50/70 border border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-800">Access to Resources</span>
              <span className="font-mono font-bold text-slate-900">
                {baseline.Access_to_Resources} → {scenario.Access_to_Resources}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1">
              {(["Low", "Medium", "High"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateScenario("Access_to_Resources", opt)}
                  className={`py-1.5 text-xs font-medium rounded border transition-all ${
                    scenario.Access_to_Resources === opt
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
