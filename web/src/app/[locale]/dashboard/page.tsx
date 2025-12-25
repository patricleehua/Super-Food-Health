"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { ProtectedRoute } from "@/components/protected-route";
import { useTranslations } from "next-intl";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  weightTrendData,
  greenScoreTrendData,
  nutritionHistoryData,
  triggerFoodsData,
  triggerTimesData,
} from "@/lib/mock-data";
import {
  TrendingDown,
  TrendingUp,
  Minus,
  AlertCircle,
  Clock,
} from "lucide-react";

type TimePeriod = "7" | "30" | "90";

export default function DashboardPage() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("30");
  const t = useTranslations("dashboard");

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f6f8f7] dark:bg-[#102219]">
        <Sidebar />
        <main className="flex flex-col">
          {/* Header */}
          <div className="bg-[#f6f8f7]/95 dark:bg-[#102219]/95 backdrop-blur-sm px-8 py-6 border-b border-[#dbe6e0] dark:border-[#2a3c34]">
            <div className="max-w-[1200px] mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-[#111814] dark:text-white text-3xl font-black tracking-tight">
                  {t("title")}
                </h2>
                <p className="text-[#618975] text-sm mt-1">{t("subtitle")}</p>
              </div>
              <div className="bg-white dark:bg-[#1a2c24] p-1 rounded-lg border border-[#dbe6e0] dark:border-[#2a3c34] flex items-center shadow-sm self-start md:self-auto">
                {(["7", "30", "90"] as TimePeriod[]).map((period) => (
                  <label key={period} className="cursor-pointer">
                    <input
                      type="radio"
                      name="time-period"
                      className="sr-only peer"
                      checked={timePeriod === period}
                      onChange={() => setTimePeriod(period)}
                    />
                    <span className="block px-4 py-1.5 rounded text-sm font-medium text-[#618975] peer-checked:bg-primary peer-checked:text-[#102219] transition-all hover:bg-[#f6f8f7] dark:hover:bg-[#23352d]">
                      {t(`timePeriod.${period}days`)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8 flex-1">
            <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8">
              {/* Top Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weight Trend Card */}
                <div className="bg-white dark:bg-[#1a2c24] rounded-xl p-6 border border-[#dbe6e0] dark:border-[#2a3c34] shadow-sm flex flex-col justify-between relative overflow-hidden group">
                  <div className="flex justify-between items-start z-10">
                    <div>
                      <h3 className="text-[#618975] text-sm font-bold uppercase tracking-wider">
                        {t("weightTrend.title")}
                      </h3>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-[#111814] dark:text-white text-4xl font-black">
                          78.4
                        </span>
                        <span className="text-base font-medium text-[#618975]">
                          {t("weightTrend.unit")}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full flex items-center gap-1">
                      <TrendingDown className="w-4 h-4" />
                      2.1 kg
                    </span>
                  </div>
                  <div className="h-32 w-full mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weightTrendData}>
                        <defs>
                          <linearGradient
                            id="weightGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#13ec80"
                              stopOpacity={0.2}
                            />
                            <stop
                              offset="100%"
                              stopColor="#13ec80"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="weight"
                          stroke="#13ec80"
                          strokeWidth={2}
                          fill="url(#weightGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-between text-xs text-[#618975] mt-2">
                    <span>{t("weightTrend.start")}</span>
                    <span>{t("weightTrend.current")}</span>
                  </div>
                </div>

                {/* Green Score Trend Card */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1a2c24] rounded-xl p-6 border border-[#dbe6e0] dark:border-[#2a3c34] shadow-sm flex flex-col md:flex-row gap-8">
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[#618975] text-sm font-bold uppercase tracking-wider">
                        {t("greenScore.title")}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-[#111814] dark:text-white">
                          85
                        </span>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {t("greenScore.average")}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-h-[120px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={greenScoreTrendData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#dbe6e0"
                            opacity={0.3}
                          />
                          <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                          <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#13ec80"
                            strokeWidth={2}
                            dot={{ fill: "#13ec80", r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="hidden md:block w-px bg-[#dbe6e0] dark:bg-[#2a3c34]" />
                  <div className="flex-1 flex flex-col justify-center gap-5">
                    <h4 className="text-[#111814] dark:text-white text-sm font-bold">
                      {t("greenScore.components")}
                    </h4>
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs font-medium text-[#618975]">
                          {t("greenScore.structure")}
                        </span>
                        <span className="text-xs font-bold text-primary">
                          {t("greenScore.high")} (92%)
                        </span>
                      </div>
                      <div className="w-full bg-[#f0f4f2] dark:bg-[#23352d] rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full shadow-[0_0_10px_rgba(19,236,128,0.3)]"
                          style={{ width: "92%" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs font-medium text-[#618975]">
                          {t("greenScore.excessControl")}
                        </span>
                        <span className="text-xs font-bold text-[#eab308]">
                          {t("greenScore.medium")} (65%)
                        </span>
                      </div>
                      <div className="w-full bg-[#f0f4f2] dark:bg-[#23352d] rounded-full h-2">
                        <div
                          className="bg-[#eab308] h-2 rounded-full"
                          style={{ width: "65%" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs font-medium text-[#618975]">
                          {t("greenScore.processing")}
                        </span>
                        <span className="text-xs font-bold text-primary">
                          {t("greenScore.good")} (80%)
                        </span>
                      </div>
                      <div className="w-full bg-[#f0f4f2] dark:bg-[#23352d] rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: "80%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nutritional Intake History */}
              <div>
                <div className="flex items-center gap-2 mb-4 px-1">
                  <span className="text-[#618975]">📊</span>
                  <h3 className="text-[#111814] dark:text-white text-lg font-bold">
                    {t("nutritionHistory.title")}
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {Object.entries(nutritionHistoryData).map(([key, data]) => (
                    <div
                      key={key}
                      className="bg-white dark:bg-[#1a2c24] rounded-xl p-4 border border-[#dbe6e0] dark:border-[#2a3c34] shadow-sm hover:border-primary/50 transition-colors"
                    >
                      <p className="text-[10px] text-[#618975] font-bold uppercase tracking-wide">
                        {t(`nutritionHistory.${key}`)}
                      </p>
                      <div className="flex items-end gap-2 mt-2">
                        <span className="text-xl font-bold text-[#111814] dark:text-white">
                          {typeof data.value === "number" &&
                          data.value % 1 !== 0
                            ? data.value.toFixed(1)
                            : data.value}
                          {key === "protein" ||
                          key === "fiber" ||
                          key === "sugar"
                            ? "g"
                            : ""}
                        </span>
                        <span
                          className={`text-[10px] font-bold mb-1 ${
                            data.change > 0
                              ? "text-primary"
                              : data.change < 0
                              ? "text-[#ef4444]"
                              : "text-[#618975]"
                          }`}
                        >
                          {data.change > 0 ? "▲" : data.change < 0 ? "▼" : "-"}{" "}
                          {Math.abs(data.change)}%
                        </span>
                      </div>
                      <svg
                        className="w-full h-10 mt-2 overflow-visible"
                        preserveAspectRatio="none"
                        viewBox="0 0 100 30"
                      >
                        <path
                          d={`M${data.trend
                            .map(
                              (v, i) =>
                                `${(i / (data.trend.length - 1)) * 100},${
                                  30 - v
                                }`
                            )
                            .join(" L")}`}
                          fill="none"
                          stroke={
                            data.change > 0
                              ? "#13ec80"
                              : data.change < 0
                              ? "#ef4444"
                              : "#618975"
                          }
                          strokeLinecap="round"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trigger Foods and Times */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Trigger Foods */}
                <div className="bg-white dark:bg-[#1a2c24] rounded-xl p-6 border border-[#dbe6e0] dark:border-[#2a3c34] shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <AlertCircle className="text-[#eab308] w-5 h-5" />
                    <h3 className="text-[#111814] dark:text-white text-lg font-bold">
                      {t("triggerFoods.title")}
                    </h3>
                  </div>
                  <div className="space-y-5">
                    {triggerFoodsData.map((food) => (
                      <div
                        key={food.name}
                        className="flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-[#f0f4f2] dark:bg-[#23352d] rounded-lg p-2.5 group-hover:bg-primary/10 transition-colors text-2xl">
                            {food.icon}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#111814] dark:text-white">
                              {food.name}
                            </p>
                            <p className="text-[10px] text-[#618975] uppercase tracking-wide font-bold">
                              {t(
                                `triggerFoods.${food.impact
                                  .toLowerCase()
                                  .replace(" ", "")}Impact`
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-sm font-bold block ${
                              food.percentage > 70
                                ? "text-[#ef4444]"
                                : food.percentage > 40
                                ? "text-[#eab308]"
                                : "text-[#eab308]"
                            }`}
                          >
                            {food.score} {t("triggerFoods.points")}
                          </span>
                          <div className="w-24 bg-[#dbe6e0] dark:bg-[#2a3c34] rounded-full h-1.5 mt-1 ml-auto">
                            <div
                              className={`h-1.5 rounded-full ${
                                food.percentage > 70
                                  ? "bg-[#ef4444]"
                                  : food.percentage > 40
                                  ? "bg-[#eab308]"
                                  : "bg-[#eab308]"
                              }`}
                              style={{ width: `${food.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trigger Times */}
                <div className="bg-white dark:bg-[#1a2c24] rounded-xl p-6 border border-[#dbe6e0] dark:border-[#2a3c34] shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                    <Clock className="text-primary w-5 h-5" />
                    <h3 className="text-[#111814] dark:text-white text-lg font-bold">
                      {t("triggerTimes.title")}
                    </h3>
                  </div>
                  <div className="flex-1 flex flex-col justify-end">
                    <p className="text-sm text-[#618975] mb-6 leading-relaxed">
                      {t("triggerTimes.description")}
                    </p>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={triggerTimesData}>
                          <Bar
                            dataKey="value"
                            fill="#13ec80"
                            opacity={0.6}
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between text-[10px] text-[#618975] font-bold uppercase tracking-wider pt-2 border-t border-[#dbe6e0] dark:border-[#2a3c34]">
                      <span>12pm</span>
                      <span>4pm</span>
                      <span>8pm</span>
                      <span>12am</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
