import React, { useState } from "react";
import {
  StudentFeatures,
  calculatePrediction,
  SAMPLE_STUDENTS,
} from "@/lib/modelEngine";
import { UsersIcon, DownloadIcon, CheckCircleIcon, AlertCircleIcon } from "./Icons";

interface StudentRecord {
  id: string;
  name: string;
  features: StudentFeatures;
}

const DEFAULT_COHORT: StudentRecord[] = [
  ...SAMPLE_STUDENTS.map((s) => ({ id: s.id, name: s.name, features: s.features })),
  {
    id: "std_05",
    name: "Elena Vance",
    features: {
      Attendance: 94,
      Hours_Studied: 30,
      Previous_Scores: 88,
      Access_to_Resources: "High",
      Parental_Involvement: "High",
      Tutoring_Sessions: 3,
      Parental_Education_Level: "College",
      Peer_Influence: "Positive",
      Distance_from_Home: "Near",
      Motivation_Level: "High",
      Teacher_Quality: "High",
      Extracurricular_Activities: "Yes",
      Internet_Access: "Yes",
    },
  },
  {
    id: "std_06",
    name: "Marcus Holloway",
    features: {
      Attendance: 76,
      Hours_Studied: 18,
      Previous_Scores: 72,
      Access_to_Resources: "Medium",
      Parental_Involvement: "Medium",
      Tutoring_Sessions: 1,
      Parental_Education_Level: "High School",
      Peer_Influence: "Neutral",
      Distance_from_Home: "Moderate",
      Motivation_Level: "Medium",
      Teacher_Quality: "Medium",
      Extracurricular_Activities: "Yes",
      Internet_Access: "Yes",
    },
  },
  {
    id: "std_07",
    name: "Sophia Chen",
    features: {
      Attendance: 88,
      Hours_Studied: 26,
      Previous_Scores: 81,
      Access_to_Resources: "High",
      Parental_Involvement: "High",
      Tutoring_Sessions: 2,
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
    id: "std_08",
    name: "Tariq Al-Mansoor",
    features: {
      Attendance: 68,
      Hours_Studied: 14,
      Previous_Scores: 65,
      Access_to_Resources: "Medium",
      Parental_Involvement: "Low",
      Tutoring_Sessions: 0,
      Parental_Education_Level: "High School",
      Peer_Influence: "Negative",
      Distance_from_Home: "Far",
      Motivation_Level: "Medium",
      Teacher_Quality: "Medium",
      Extracurricular_Activities: "No",
      Internet_Access: "Yes",
    },
  },
  {
    id: "std_09",
    name: "Zoe Washington",
    features: {
      Attendance: 83,
      Hours_Studied: 22,
      Previous_Scores: 76,
      Access_to_Resources: "Medium",
      Parental_Involvement: "Medium",
      Tutoring_Sessions: 2,
      Parental_Education_Level: "College",
      Peer_Influence: "Neutral",
      Distance_from_Home: "Near",
      Motivation_Level: "Medium",
      Teacher_Quality: "High",
      Extracurricular_Activities: "Yes",
      Internet_Access: "Yes",
    },
  },
  {
    id: "std_10",
    name: "Liam O'Connor",
    features: {
      Attendance: 61,
      Hours_Studied: 10,
      Previous_Scores: 60,
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
];

export const CohortAnalyzer: React.FC = () => {
  const [gradeFilter, setGradeFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const scoredStudents = DEFAULT_COHORT.map((s) => {
    const result = calculatePrediction(s.features);
    return {
      ...s,
      predicted_score: result.predicted_score,
      letter_grade: result.letter_grade,
      performance_band: result.performance_band,
      percentile: result.percentile_estimate,
    };
  });

  const filteredStudents = scoredStudents.filter((s) => {
    const matchesGrade = gradeFilter === "ALL" || s.letter_grade === gradeFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  // Calculate cohort summaries
  const scores = scoredStudents.map((s) => s.predicted_score);
  const meanScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  const minScore = Math.min(...scores).toFixed(1);
  const maxScore = Math.max(...scores).toFixed(1);
  const passCount = scoredStudents.filter((s) => s.predicted_score >= 60).length;
  const passRate = ((passCount / scoredStudents.length) * 100).toFixed(0);

  const exportCSV = () => {
    const headers = [
      "Student Name",
      "Predicted Score",
      "Grade",
      "Percentile",
      "Attendance %",
      "Study Hours",
      "Previous Score",
      "Tutoring",
      "Resource Access",
      "Peer Influence",
    ];
    const rows = scoredStudents.map((s) => [
      `"${s.name}"`,
      s.predicted_score,
      s.letter_grade,
      s.percentile,
      s.features.Attendance,
      s.features.Hours_Studied,
      s.features.Previous_Scores,
      s.features.Tutoring_Sessions,
      s.features.Access_to_Resources,
      s.features.Peer_Influence,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_cohort_predictions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-slate-800" />
            <div>
              <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                Cohort Evaluation & Batch Diagnostics
              </h2>
              <p className="text-xs text-slate-500">
                Score complete student sections simultaneously and detect academic risk factors
              </p>
            </div>
          </div>

          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors w-fit"
          >
            <DownloadIcon className="w-3.5 h-3.5" />
            Export CSV Report
          </button>
        </div>

        {/* Aggregate Cohort Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
              Cohort Size
            </span>
            <span className="text-xl font-mono font-bold text-slate-900">
              {scoredStudents.length} Students
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
              Mean Score
            </span>
            <span className="text-xl font-mono font-bold text-slate-900 tabular-nums">
              {meanScore} pts
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
              Score Range
            </span>
            <span className="text-xl font-mono font-bold text-slate-900 tabular-nums">
              {minScore} - {maxScore}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
              Passing Rate (≥60)
            </span>
            <span className="text-xl font-mono font-bold text-emerald-700 tabular-nums">
              {passRate}%
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
              Intervention Required
            </span>
            <span className="text-xl font-mono font-bold text-rose-700 tabular-nums">
              {scoredStudents.length - passCount} Students
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 mr-2 font-medium">Filter Grade:</span>
          {["ALL", "A", "B", "C", "D", "F"].map((grade) => (
            <button
              key={grade}
              onClick={() => setGradeFilter(grade)}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
                gradeFilter === grade
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {grade}
            </button>
          ))}
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3">Predicted Score</th>
                <th className="py-3 px-3">Grade</th>
                <th className="py-3 px-3">Percentile</th>
                <th className="py-3 px-3">Attendance</th>
                <th className="py-3 px-3">Study Hrs</th>
                <th className="py-3 px-3">Tutoring</th>
                <th className="py-3 px-3">Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((st) => {
                const isPassing = st.predicted_score >= 60;
                return (
                  <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {st.name}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 tabular-nums">
                      {st.predicted_score.toFixed(1)} / 100
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                          st.letter_grade === "A"
                            ? "bg-emerald-100 text-emerald-800"
                            : st.letter_grade === "B"
                            ? "bg-blue-100 text-blue-800"
                            : st.letter_grade === "C"
                            ? "bg-amber-100 text-amber-800"
                            : st.letter_grade === "D"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {st.letter_grade}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 tabular-nums">
                      {st.percentile}th %ile
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700 tabular-nums">
                      {st.features.Attendance}%
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700 tabular-nums">
                      {st.features.Hours_Studied} hrs
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700 tabular-nums">
                      {st.features.Tutoring_Sessions} mo
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded ${
                          isPassing
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {isPassing ? (
                          <CheckCircleIcon className="w-3 h-3" />
                        ) : (
                          <AlertCircleIcon className="w-3 h-3" />
                        )}
                        {isPassing ? "On Track" : "Intervene"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
