import React, { useState } from "react";
import { FeatureImpact } from "@/lib/modelEngine";
import { BarChartIcon, InfoIcon } from "./Icons";

interface FeatureAttributionProps {
  impacts: FeatureImpact[];
}

export const FeatureAttribution: React.FC<FeatureAttributionProps> = ({ impacts }) => {
  const [showAll, setShowAll] = useState(false);

  const displayedImpacts = showAll ? impacts : impacts.slice(0, 7);
  const maxAbs = Math.max(...impacts.map((i) => Math.abs(i.points_impact)), 1);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <BarChartIcon className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
            Factor Attribution Breakdown
          </h3>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          {showAll ? "Show Top 7 Only" : `View All ${impacts.length} Factors`}
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Estimated points added or subtracted relative to the typical baseline student profile (intercept: 67.2 pts).
      </p>

      <div className="space-y-3 pt-2">
        {displayedImpacts.map((item) => {
          const isPositive = item.points_impact >= 0;
          const percentWidth = Math.min(100, (Math.abs(item.points_impact) / maxAbs) * 100);

          return (
            <div key={item.feature} className="text-xs group">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-slate-800 flex items-center gap-1.5">
                  {item.label}
                  <span className="text-slate-400 font-normal">
                    ({String(item.value)})
                  </span>
                </span>
                <span
                  className={`font-mono font-semibold tabular-nums ${
                    isPositive ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {item.points_impact.toFixed(2)} pts
                </span>
              </div>

              {/* Bidirectional visual bar */}
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div className="w-1/2 flex justify-end">
                  {!isPositive && (
                    <div
                      className="h-full bg-rose-500/80 rounded-l-full transition-all duration-300"
                      style={{ width: `${percentWidth}%` }}
                    />
                  )}
                </div>
                <div className="w-0.5 bg-slate-300 h-full" />
                <div className="w-1/2 flex justify-start">
                  {isPositive && (
                    <div
                      className="h-full bg-emerald-600/85 rounded-r-full transition-all duration-300"
                      style={{ width: `${percentWidth}%` }}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100">
        <span className="text-rose-600 font-medium">← Negative Deficit</span>
        <span className="text-slate-400">Cohort Average Baseline (0.0)</span>
        <span className="text-emerald-600 font-medium">Positive Gain →</span>
      </div>
    </div>
  );
};
