"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { useTranslations } from "next-intl";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { goalSimulationData, projectionPathData } from "@/lib/mock-data";
import {
  Settings,
  CheckCircle,
  Calendar,
  TrendingDown,
  Dumbbell,
  Footprints,
  UtensilsCrossed,
  Lightbulb,
  Save,
  RotateCcw,
} from "lucide-react";

export default function GoalSimulationPage() {
  const [params, setParams] = useState(goalSimulationData);
  const [mode, setMode] = useState<"sustainable" | "strict">("sustainable");
  const t = useTranslations("goalSimulation");

  const updateParam = (key: string, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-[#f6f8f7] dark:bg-[#102219]">
      <Sidebar />
      <main className="flex flex-col">
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center py-8 px-4 md:px-10 lg:px-20">
          <div className="w-full max-w-7xl flex flex-col gap-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-[#111814] dark:text-white">
                  {t("title")}
                </h1>
                <p className="text-[#618975] dark:text-gray-400 text-base font-normal leading-normal max-w-2xl">
                  {t("subtitle")}
                </p>
              </div>
              {/* Mode Toggle */}
              <div className="bg-[#f3f4f6] dark:bg-[#1f352b] p-1 rounded-xl inline-flex">
                <button
                  onClick={() => setMode("strict")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    mode === "strict"
                      ? "bg-white dark:bg-[#2f4538] text-[#111814] dark:text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  Strict Mode
                </button>
                <button
                  onClick={() => setMode("sustainable")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    mode === "sustainable"
                      ? "bg-white dark:bg-[#2f4538] text-[#111814] dark:text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  Sustainable
                </button>
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              {/* Left Column - Parameters */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white dark:bg-[#1a2c24] rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 mb-6 text-[#111814] dark:text-white pb-4 border-b border-gray-100 dark:border-gray-800">
                    <Settings className="text-primary w-5 h-5" />
                    <h2 className="text-lg font-bold">Simulation Parameters</h2>
                  </div>

                  {/* Weight Inputs */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                        Starting Weight
                      </span>
                      <div className="relative">
                        <input
                          type="number"
                          value={params.startingWeight}
                          onChange={(e) =>
                            updateParam(
                              "startingWeight",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full h-12 px-4 pr-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#102219] text-lg font-bold focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                        <span className="absolute right-3 top-3.5 text-xs font-bold text-gray-400">
                          kg
                        </span>
                      </div>
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                        Target Goal
                      </span>
                      <div className="relative">
                        <input
                          type="number"
                          value={params.targetWeight}
                          onChange={(e) =>
                            updateParam(
                              "targetWeight",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full h-12 px-4 pr-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#102219] text-lg font-bold focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                        <span className="absolute right-3 top-3.5 text-xs font-bold text-gray-400">
                          kg
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Projection Period */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                        Projection Period
                      </span>
                      <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {params.projectionWeeks} Weeks
                      </span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="52"
                      value={params.projectionWeeks}
                      onChange={(e) =>
                        updateParam("projectionWeeks", parseInt(e.target.value))
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                      <span>1 mo</span>
                      <span>6 mo</span>
                      <span>12 mo</span>
                    </div>
                  </div>

                  {/* Daily Variables */}
                  <div className="flex items-center gap-2 mb-4 mt-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Daily Variables
                    </span>
                    <div className="h-px bg-gray-100 dark:bg-gray-800 flex-1" />
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                        <Dumbbell className="w-4 h-4" />
                        Workouts/Week
                      </span>
                      <span className="text-sm font-bold text-[#111814] dark:text-white">
                        {params.workoutsPerWeek} sessions
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="7"
                      value={params.workoutsPerWeek}
                      onChange={(e) =>
                        updateParam("workoutsPerWeek", parseInt(e.target.value))
                      }
                      className="w-full"
                    />
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                        <Footprints className="w-4 h-4" />
                        Daily Steps
                      </span>
                      <span className="text-sm font-bold text-[#111814] dark:text-white">
                        {params.dailySteps.toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2000"
                      max="20000"
                      step="500"
                      value={params.dailySteps}
                      onChange={(e) =>
                        updateParam("dailySteps", parseInt(e.target.value))
                      }
                      className="w-full"
                    />
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                        <UtensilsCrossed className="w-4 h-4" />
                        Takeaways/Week
                      </span>
                      <span className="text-sm font-bold text-[#111814] dark:text-white">
                        {params.takeawaysPerWeek} meal
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={params.takeawaysPerWeek}
                      onChange={(e) =>
                        updateParam(
                          "takeawaysPerWeek",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Insight Card */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 flex gap-3 items-start">
                  <Lightbulb className="text-blue-600 dark:text-blue-400 w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-1">
                      Simulated Insight
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                      Increasing steps to <strong>10k</strong> changes your
                      projected date by -2 weeks.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Results */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-[#1a2c24] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between hover:border-primary/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Plan Feasibility
                      </h3>
                      <CheckCircle className="text-primary w-5 h-5" />
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-black text-[#111814] dark:text-white">
                        {params.planFeasibility}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mt-3 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{ width: `${params.planFeasibility}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#1a2c24] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Projected Date
                      </h3>
                      <Calendar className="text-gray-400 w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-[#111814] dark:text-white">
                        {params.projectedDate}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">
                        In exactly {params.projectionWeeks} weeks
                      </span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#1a2c24] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Projected Weekly Loss
                      </h3>
                      <TrendingDown className="text-gray-400 w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-[#111814] dark:text-white">
                        {params.weeklyLoss}{" "}
                        <span className="text-lg font-bold text-gray-400">
                          kg
                        </span>
                      </span>
                      <span className="text-sm text-green-600 font-bold">
                        Optimal Pace
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trajectory Chart */}
                <div className="bg-white dark:bg-[#1a2c24] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 h-[360px] flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-[#111814] dark:text-white flex items-center gap-2">
                      <span>📈</span>
                      Projected Trajectory
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-bold">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 bg-primary" />
                        <span className="text-gray-600 dark:text-gray-300">
                          Projected Path
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 border-t border-dashed border-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">
                          Target Goal
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={projectionPathData}
                        margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                      >
                        <XAxis
                          dataKey="week"
                          tickFormatter={(value) => `+${value} Wks`}
                          style={{ fontSize: "10px", fontWeight: "bold" }}
                        />
                        <YAxis
                          domain={[72, 86]}
                          style={{ fontSize: "10px" }}
                          tickFormatter={(value) => `${value}kg`}
                        />
                        <ReferenceLine
                          y={params.targetWeight}
                          stroke="#9ca3af"
                          strokeDasharray="4 4"
                          label={{
                            value: "Target",
                            position: "right",
                            fill: "#9ca3af",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="weight"
                          stroke="#13ec80"
                          strokeWidth={3}
                          dot={{
                            fill: "white",
                            stroke: "#13ec80",
                            strokeWidth: 3,
                            r: 5,
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Targets */}
                  <div className="bg-white dark:bg-[#1a2c24] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span>🎯</span>
                      Recommended Daily Targets
                    </h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                            🔥
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Calorie Range
                            </p>
                            <p className="text-xl font-bold text-[#111814] dark:text-white">
                              2,100 - 2,300
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-300">
                          kcal
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                            🥚
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Protein Goal
                            </p>
                            <p className="text-xl font-bold text-[#111814] dark:text-white">
                              140g - 160g
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-300">
                          grams
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Advice */}
                  <div className="bg-gradient-to-br from-[#13ec80]/10 via-[#13ec80]/5 to-transparent rounded-2xl p-6 border border-primary/20 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#111814] dark:text-white mb-3 flex items-center gap-2">
                        <Lightbulb className="text-primary w-5 h-5" />
                        Sustainability Advice
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        To achieve this projection safely, focus on{" "}
                        <strong>protein distribution</strong> throughout the
                        day. Your input parameters are aggressive but
                        sustainable if step counts are maintained strictly.
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-primary/10">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                        Projected Impact
                      </p>
                      <div className="flex items-center gap-2 text-sm font-bold text-[#111814] dark:text-white">
                        <TrendingDown className="text-green-500 w-5 h-5" />
                        <span>+15% Success Probability</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button className="flex-1 h-14 bg-[#13ec80] hover:bg-[#0fd673] active:scale-[0.99] text-[#111814] font-bold rounded-xl shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2 text-lg">
                    <Save className="w-5 h-5" />
                    Commit to this Plan
                  </button>
                  <button className="flex-1 h-14 bg-white dark:bg-[#1a2c24] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2">
                    <RotateCcw className="w-5 h-5" />
                    Reset Parameters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
