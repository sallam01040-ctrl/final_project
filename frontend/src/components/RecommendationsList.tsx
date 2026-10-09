import React from "react";
import { Recommendation } from "@/lib/modelEngine";
import { TargetIcon, TrendingUpIcon } from "./Icons";

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({
  recommendations,
}) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
          <TargetIcon className="w-4 h-4 text-emerald-600" />
          Academic Guidance
        </h3>
        <p className="text-xs text-slate-600">
          This student profile demonstrates optimal metrics across all primary model drivers. Maintain current routine and syllabus milestone reviews.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <TargetIcon className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
            Targeted Academic Interventions
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          Prioritized by potential score gain
        </span>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200/70 text-slate-700">
                {rec.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-700 tabular-nums bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                <TrendingUpIcon className="w-3.5 h-3.5" />
                +{rec.potential_gain.toFixed(1)} pts
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {rec.suggestion}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
