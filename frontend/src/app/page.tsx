"use client";

import React, { useState } from "react";
import {
  StudentFeatures,
  PredictionResult,
  calculatePrediction,
  SAMPLE_STUDENTS,
} from "@/lib/modelEngine";
import {
  GraduationCapIcon,
  SlidersIcon,
  LayersIcon,
  UsersIcon,
  BookOpenIcon,
  ShieldCheckIcon,
} from "@/components/Icons";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { FeatureAttribution } from "@/components/FeatureAttribution";
import { RecommendationsList } from "@/components/RecommendationsList";
import { FeatureInputForm } from "@/components/FeatureInputForm";
import { ScenarioSimulator } from "@/components/ScenarioSimulator";
import { CohortAnalyzer } from "@/components/CohortAnalyzer";
import { ModelArchitectureView } from "@/components/ModelArchitectureView";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "PREDICTOR" | "SIMULATOR" | "COHORT" | "ARCHITECTURE"
  >("PREDICTOR");

  // Default student features initialized to dataset average baseline
  const [studentData, setStudentData] = useState<StudentFeatures>({
    ...SAMPLE_STUDENTS[1].features,
  });

  // Calculate live prediction immediately
  const prediction: PredictionResult = calculatePrediction(studentData);

  const handleReset = () => {
    setStudentData({ ...SAMPLE_STUDENTS[1].features });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <GraduationCapIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold tracking-tight text-slate-900">
                    EduScore Analytics
                  </h1>
                  <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/60">
                    v1.0
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Student Examination Performance Diagnostics Platform
                </p>
              </div>
            </div>

            {/* Status and Metric Badges */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium">Inference Engine Active</span>
                <span className="text-slate-400 font-mono text-[11px]">
                  (R² = 0.829)
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>Vercel Ready</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 sm:space-x-4 border-t border-slate-100 overflow-x-auto py-2">
            <button
              onClick={() => setActiveTab("PREDICTOR")}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "PREDICTOR"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <SlidersIcon className="w-4 h-4" />
              Diagnostic Predictor
            </button>

            <button
              onClick={() => setActiveTab("SIMULATOR")}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "SIMULATOR"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <LayersIcon className="w-4 h-4" />
              Scenario Simulator
            </button>

            <button
              onClick={() => setActiveTab("COHORT")}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "COHORT"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <UsersIcon className="w-4 h-4" />
              Cohort Diagnostics
            </button>

            <button
              onClick={() => setActiveTab("ARCHITECTURE")}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "ARCHITECTURE"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <BookOpenIcon className="w-4 h-4" />
              Model Architecture & Weights
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "PREDICTOR" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Interactive Inputs (7 columns) */}
            <div className="lg:col-span-7 space-y-6">
              <FeatureInputForm
                values={studentData}
                onChange={setStudentData}
                onReset={handleReset}
              />
            </div>

            {/* Right Column: Results & Diagnostic Attribution (5 columns) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
              <ScoreDisplay result={prediction} />
              <FeatureAttribution impacts={prediction.feature_impacts} />
              <RecommendationsList
                recommendations={prediction.recommendations}
              />
            </div>
          </div>
        )}

        {activeTab === "SIMULATOR" && <ScenarioSimulator />}

        {activeTab === "COHORT" && <CohortAnalyzer />}

        {activeTab === "ARCHITECTURE" && <ModelArchitectureView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <GraduationCapIcon className="w-4 h-4 text-slate-700" />
            <span>
              EduScore Analytics — Standardized Linear Regression Examination Forecaster
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>FastAPI Backend Ready</span>
            <span>•</span>
            <span>Next.js Frontend</span>
            <span>•</span>
            <span>Optimized for Vercel Deployment</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
