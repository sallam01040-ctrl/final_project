import React from "react";
import { FEATURE_METADATA } from "@/lib/modelEngine";
import { ShieldCheckIcon, BarChartIcon, BookOpenIcon } from "./Icons";

export const ModelArchitectureView: React.FC = () => {
  const featureList = Object.entries(FEATURE_METADATA)
    .map(([key, val]) => ({
      key,
      ...val,
    }))
    .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <BookOpenIcon className="w-5 h-5 text-slate-800" />
          <div>
            <h2 className="text-base font-semibold text-slate-900 tracking-tight">
              Statistical Model Specifications & Validation
            </h2>
            <p className="text-xs text-slate-500">
              Complete documentation of model weights, normalization coefficients, and feature selection methodology
            </p>
          </div>
        </div>

        {/* Model Metrics Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Coefficient of Determination
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-mono font-extrabold text-slate-900">
                0.829
              </span>
              <span className="text-xs font-mono text-slate-500">(R²)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Explains 82.9% of total exam score variance
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Mean Absolute Error
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-mono font-extrabold text-slate-900">
                0.598
              </span>
              <span className="text-xs font-mono text-slate-500">pts</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Average prediction divergence on holdout test set
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Root Mean Squared Error
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-mono font-extrabold text-slate-900">
                1.516
              </span>
              <span className="text-xs font-mono text-slate-500">pts</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Penalizes large deviations on unseen test cohort
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Sample Cohort Size
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-mono font-extrabold text-slate-900">
                6,607
              </span>
              <span className="text-xs font-mono text-slate-500">rows</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              5,285 training / 1,322 test records (80/20 split)
            </p>
          </div>
        </div>
      </div>

      {/* Regression Equation Formula Box */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
          Mathematical Formulation
        </h3>

        <div className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
          <p className="text-slate-400 text-[11px] mb-2 font-sans font-semibold uppercase tracking-wider">
            Standardized Multiple Linear Regression Equation:
          </p>
          <code>
            Exam_Score = 67.213 + [2.284 × z(Attendance)] + [1.736 × z(Study_Hours)] +
            [0.677 × z(Previous_Score)] + [0.731 × z(Resources)] + [0.676 × z(Parent_Involve)] +
            [0.587 × z(Tutoring)] + ... - [0.320 × z(Distance)]
          </code>
          <p className="text-slate-400 text-[11px] mt-2">
            Where z(x) = (x - μ) / σ represents the standardized z-score normalized by training set mean and standard deviation.
          </p>
        </div>
      </div>

      {/* Coefficients and Feature Weights Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 pb-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">
            Ranked Feature Importance & Normalization Parameters
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked by magnitude of standardized regression coefficient (points per 1 standard deviation)
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-3">Feature Name</th>
                <th className="py-3 px-3">Input Type</th>
                <th className="py-3 px-3">Standardized Weight (β)</th>
                <th className="py-3 px-3">Direction</th>
                <th className="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {featureList.map((f, idx) => {
                const isPos = f.weight >= 0;
                return (
                  <tr key={f.key} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">
                      #{idx + 1}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {f.label}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 capitalize">
                      {f.type}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 tabular-nums">
                      {isPos ? "+" : ""}
                      {f.weight.toFixed(3)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block font-mono font-semibold px-2 py-0.5 rounded text-[11px] ${
                          isPos
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : "bg-rose-50 text-rose-700 border border-rose-200/60"
                        }`}
                      >
                        {isPos ? "Positive" : "Inverse (Deficit)"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {f.description}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Selection Governance Callout */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Governance & Feature Selection Methodology
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="font-semibold text-slate-900 block mb-1">
              Ethical & Sensitive Attribute Exclusion
            </span>
            <p className="leading-relaxed">
              Features such as <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">Family_Income</code> and <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">Learning_Disabilities</code> were explicitly purged from model inputs to enforce fairness, eliminate socioeconomic penalization, and comply with academic equity benchmarks.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="font-semibold text-slate-900 block mb-1">
              Statistical Significance Threshold
            </span>
            <p className="leading-relaxed">
              A correlation threshold filter (<code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">|r| ≥ 0.05</code>) was applied to eliminate high-variance noise, preserving 13 robust, statistically validated predictive factors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
