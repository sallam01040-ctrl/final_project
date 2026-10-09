import React from "react";
import { StudentFeatures, FEATURE_METADATA, SAMPLE_STUDENTS } from "@/lib/modelEngine";
import { SlidersIcon, RefreshCwIcon, UserIcon } from "./Icons";

interface FeatureInputFormProps {
  values: StudentFeatures;
  onChange: (newValues: StudentFeatures) => void;
  onReset: () => void;
}

export const FeatureInputForm: React.FC<FeatureInputFormProps> = ({
  values,
  onChange,
  onReset,
}) => {
  const updateField = (field: keyof StudentFeatures, val: any) => {
    onChange({
      ...values,
      [field]: val,
    });
  };

  const loadPreset = (presetFeatures: StudentFeatures) => {
    onChange({ ...presetFeatures });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-6">
      {/* Header and Presets */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersIcon className="w-5 h-5 text-slate-800" />
            <div>
              <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                Student Profile Parameters
              </h2>
              <p className="text-xs text-slate-500">
                Adjust features to observe real-time examination forecast shifts
              </p>
            </div>
          </div>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-md transition-colors w-fit"
          >
            <RefreshCwIcon className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div className="pt-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Load Calibrated Sample Profiles
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SAMPLE_STUDENTS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => loadPreset(preset.features)}
                className="text-left p-2.5 rounded-lg border border-slate-200/80 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-100/70 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-900">
                    {preset.name}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block truncate">
                  {preset.badge}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Group 1: Core Academic Metrics */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            1. Core Academic Drivers (Highest Impact)
          </span>
        </div>

        {/* Attendance Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="font-medium text-slate-800 flex items-center gap-1">
              {FEATURE_METADATA.Attendance.label}
              <span className="text-[11px] text-slate-400 font-normal">
                (Linear weight: +2.28)
              </span>
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={100}
                value={values.Attendance}
                onChange={(e) => updateField("Attendance", Number(e.target.value))}
                className="w-16 px-2 py-0.5 text-right font-mono text-xs font-bold border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <span className="text-xs text-slate-500 font-mono">%</span>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={values.Attendance}
            onChange={(e) => updateField("Attendance", Number(e.target.value))}
            className="w-full accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
          <p className="text-[11px] text-slate-500">
            {FEATURE_METADATA.Attendance.description}
          </p>
        </div>

        {/* Study Hours Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="font-medium text-slate-800 flex items-center gap-1">
              {FEATURE_METADATA.Hours_Studied.label}
              <span className="text-[11px] text-slate-400 font-normal">
                (Linear weight: +1.74)
              </span>
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={45}
                value={values.Hours_Studied}
                onChange={(e) => updateField("Hours_Studied", Number(e.target.value))}
                className="w-16 px-2 py-0.5 text-right font-mono text-xs font-bold border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <span className="text-xs text-slate-500 font-mono">hrs</span>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={45}
            step={1}
            value={values.Hours_Studied}
            onChange={(e) => updateField("Hours_Studied", Number(e.target.value))}
            className="w-full accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
          <p className="text-[11px] text-slate-500">
            {FEATURE_METADATA.Hours_Studied.description}
          </p>
        </div>

        {/* Previous Score Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="font-medium text-slate-800 flex items-center gap-1">
              {FEATURE_METADATA.Previous_Scores.label}
              <span className="text-[11px] text-slate-400 font-normal">
                (Linear weight: +0.68)
              </span>
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={100}
                value={values.Previous_Scores}
                onChange={(e) => updateField("Previous_Scores", Number(e.target.value))}
                className="w-16 px-2 py-0.5 text-right font-mono text-xs font-bold border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <span className="text-xs text-slate-500 font-mono">pts</span>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={values.Previous_Scores}
            onChange={(e) => updateField("Previous_Scores", Number(e.target.value))}
            className="w-full accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
          <p className="text-[11px] text-slate-500">
            {FEATURE_METADATA.Previous_Scores.description}
          </p>
        </div>
      </div>

      {/* Group 2: Institutional & Support Context */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            2. Academic Support & Instruction
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Tutoring Sessions */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="font-medium text-slate-800">
                {FEATURE_METADATA.Tutoring_Sessions.label}
              </label>
              <span className="font-mono text-xs font-bold text-slate-900">
                {values.Tutoring_Sessions} sessions/mo
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={values.Tutoring_Sessions}
              onChange={(e) => updateField("Tutoring_Sessions", Number(e.target.value))}
              className="w-full accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Access to Resources */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-800 block">
              {FEATURE_METADATA.Access_to_Resources.label}
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(["Low", "Medium", "High"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateField("Access_to_Resources", opt)}
                  className={`py-1.5 px-2 text-xs font-medium rounded border transition-all ${
                    values.Access_to_Resources === opt
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Teacher Quality */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-800 block">
              {FEATURE_METADATA.Teacher_Quality.label}
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(["Low", "Medium", "High"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateField("Teacher_Quality", opt)}
                  className={`py-1.5 px-2 text-xs font-medium rounded border transition-all ${
                    values.Teacher_Quality === opt
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Parental Involvement */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-800 block">
              {FEATURE_METADATA.Parental_Involvement.label}
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(["Low", "Medium", "High"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateField("Parental_Involvement", opt)}
                  className={`py-1.5 px-2 text-xs font-medium rounded border transition-all ${
                    values.Parental_Involvement === opt
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Group 3: Environment, Peer & Household Dynamics */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            3. Environmental & Household Dynamics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Motivation Level */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-800 block">
              {FEATURE_METADATA.Motivation_Level.label}
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(["Low", "Medium", "High"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateField("Motivation_Level", opt)}
                  className={`py-1.5 px-2 text-xs font-medium rounded border transition-all ${
                    values.Motivation_Level === opt
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Peer Influence */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-800 block">
              {FEATURE_METADATA.Peer_Influence.label}
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(["Negative", "Neutral", "Positive"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateField("Peer_Influence", opt)}
                  className={`py-1.5 px-2 text-xs font-medium rounded border transition-all ${
                    values.Peer_Influence === opt
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Campus Distance */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-800 block">
              {FEATURE_METADATA.Distance_from_Home.label}
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(["Near", "Moderate", "Far"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateField("Distance_from_Home", opt)}
                  className={`py-1.5 px-2 text-xs font-medium rounded border transition-all ${
                    values.Distance_from_Home === opt
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Parental Education */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-800 block">
              {FEATURE_METADATA.Parental_Education_Level.label}
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(["High School", "College", "Postgraduate"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateField("Parental_Education_Level", opt)}
                  className={`py-1.5 px-1.5 text-[11px] font-medium rounded border truncate transition-all ${
                    values.Parental_Education_Level === opt
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Extracurriculars */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-800 block">
              {FEATURE_METADATA.Extracurricular_Activities.label}
            </label>
            <div className="grid grid-cols-2 gap-1">
              {(["No", "Yes"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateField("Extracurricular_Activities", opt)}
                  className={`py-1.5 px-2 text-xs font-medium rounded border transition-all ${
                    values.Extracurricular_Activities === opt
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Internet Access */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-800 block">
              {FEATURE_METADATA.Internet_Access.label}
            </label>
            <div className="grid grid-cols-2 gap-1">
              {(["No", "Yes"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateField("Internet_Access", opt)}
                  className={`py-1.5 px-2 text-xs font-medium rounded border transition-all ${
                    values.Internet_Access === opt
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
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
