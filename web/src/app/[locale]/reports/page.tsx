"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { coachAccessData } from "@/lib/mock-data";
import { useTranslations } from "next-intl";
import {
  Download,
  Link as LinkIcon,
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  X,
  Info,
  Shield,
} from "lucide-react";

type ReportPeriod = "Weekly" | "Monthly" | "Phase";

export default function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>("Monthly");
  const [desensitized, setDesensitized] = useState(false);
  const [metrics, setMetrics] = useState({
    sleep: true,
    vitals: true,
    activity: true,
    nutrition: false,
  });
  const t = useTranslations("reports");

  const toggleMetric = (key: keyof typeof metrics) => {
    setMetrics((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#f6f8f7] dark:bg-[#102219]">
      <Sidebar />

      <main className="flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-5 md:px-10">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex flex-col gap-1">
              <h1 className="text-[#111814] text-3xl md:text-4xl font-black tracking-tight">
                {t("title")}
              </h1>
              <p className="text-[#618975] text-base font-medium">
                {t("subtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 md:p-6 lg:p-10 bg-[#f6f8f7]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
            {/* LEFT COLUMN: CONFIGURATION & PREVIEW (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Configuration Card */}
              <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
                  <h2 className="text-[#111814] text-lg font-bold">
                    Report Configuration
                  </h2>
                  {/* Segmented Control */}
                  <div className="flex h-10 items-center justify-center rounded-lg bg-[#f6f8f7] p-1">
                    {(["Weekly", "Monthly", "Phase"] as ReportPeriod[]).map(
                      (p) => (
                        <label
                          key={p}
                          className="flex cursor-pointer h-full items-center justify-center rounded-md px-4 transition-all has-[:checked]:bg-white has-[:checked]:shadow-sm has-[:checked]:text-[#111814] text-[#618975] text-sm font-medium"
                        >
                          <span>{p}</span>
                          <input
                            className="hidden"
                            name="period"
                            type="radio"
                            value={p}
                            checked={period === p}
                            onChange={() => setPeriod(p)}
                          />
                        </label>
                      )
                    )}
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Calendar Mini */}
                  <div className="flex-1 min-w-[300px]">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold text-[#111814]">
                        Selected Range
                      </span>
                      <div className="flex gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#111814]">
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm font-bold self-center">
                          Oct 2023
                        </span>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#111814]">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    {/* Simplified Calendar Grid */}
                    <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-medium text-[#618975]">
                      {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                        <span key={i}>{d}</span>
                      ))}
                      {/* Days */}
                      <span className="py-2 text-gray-300">29</span>
                      <span className="py-2 text-gray-300">30</span>
                      {[1, 2, 3, 4].map((d) => (
                        <span
                          key={d}
                          className="py-2 text-[#111814] hover:bg-[#f6f8f7] rounded-full cursor-pointer"
                        >
                          {d}
                        </span>
                      ))}
                      <div className="col-span-7 grid grid-cols-7 gap-0">
                        {[5, 6, 7, 8, 9, 10, 11].map((d, i) => (
                          <span
                            key={d}
                            className={`py-2 bg-primary/20 text-[#111814] font-bold ${
                              i === 0
                                ? "rounded-l-full"
                                : i === 6
                                ? "rounded-r-full"
                                : ""
                            }`}
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                      {[12, 13, 14, 15, 16, 17, 18].map((d) => (
                        <span
                          key={d}
                          className="py-2 text-[#111814] hover:bg-[#f6f8f7] rounded-full cursor-pointer"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metrics Selection */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold text-[#111814]">
                        Include Metrics
                      </span>
                      <button
                        onClick={() =>
                          setMetrics({
                            sleep: true,
                            vitals: true,
                            activity: true,
                            nutrition: true,
                          })
                        }
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Select All
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        {
                          key: "sleep" as const,
                          icon: "😴",
                          label: "Sleep",
                          sub: "Hypnogram & Stages",
                        },
                        {
                          key: "vitals" as const,
                          icon: "❤️",
                          label: "Vitals",
                          sub: "HRV, RHR, SpO2",
                        },
                        {
                          key: "activity" as const,
                          icon: "🏃",
                          label: "Activity",
                          sub: "Workouts & Steps",
                        },
                        {
                          key: "nutrition" as const,
                          icon: "🍽️",
                          label: "Nutrition",
                          sub: "Macros & Logs",
                        },
                      ].map((item) => (
                        <label
                          key={item.key}
                          className="group flex flex-col p-3 border border-gray-200 rounded-lg cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-2xl">{item.icon}</span>
                            <input
                              checked={metrics[item.key]}
                              onChange={() => toggleMetric(item.key)}
                              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                              type="checkbox"
                            />
                          </div>
                          <span className="text-sm font-bold text-[#111814]">
                            {item.label}
                          </span>
                          <span className="text-xs text-[#618975]">
                            {item.sub}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="text-sm font-bold text-[#111814] flex items-center gap-2">
                    <Eye className="w-5 h-5 text-[#618975]" />
                    Report Preview
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-medium text-[#618975]">
                      Live Update
                    </span>
                  </div>
                </div>
                {/* Mock PDF Document */}
                <div className="p-8 bg-gray-100 flex justify-center min-h-[400px]">
                  <div className="w-full max-w-[600px] bg-white shadow-lg p-8 flex flex-col gap-6 scale-95 origin-top">
                    {/* PDF Header */}
                    <div className="flex justify-between items-end border-b pb-4 border-gray-100">
                      <div>
                        <div className="h-6 w-32 bg-gray-800 rounded mb-2" />
                        <div className="h-3 w-48 bg-gray-300 rounded" />
                      </div>
                      <div className="text-right">
                        <div className="h-4 w-24 bg-primary/40 rounded mb-1 ml-auto" />
                        <div className="h-3 w-20 bg-gray-200 rounded ml-auto" />
                      </div>
                    </div>
                    {/* PDF Chart Mock */}
                    <div className="flex flex-col gap-2">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                      <div className="h-32 w-full bg-gray-50 rounded-lg border border-gray-100 relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-full flex items-end justify-between px-4 pb-2 h-full gap-2">
                          {[40, 60, 30, 80, 50, 45, 55].map((h, i) => (
                            <div
                              key={i}
                              className="w-full bg-primary/20 rounded-t"
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* PDF Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="p-3 bg-gray-50 rounded border border-gray-100"
                        >
                          <div className="h-3 w-12 bg-gray-300 rounded mb-2" />
                          <div className="h-6 w-16 bg-gray-800 rounded" />
                        </div>
                      ))}
                    </div>
                    {/* Privacy Disclaimer in PDF */}
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-2 opacity-50">
                      <div className="w-4 h-4 bg-gray-300 rounded-full" />
                      <div className="h-2 w-full bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: ACTIONS & ACCESS (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Export Actions Card */}
              <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 flex flex-col gap-4 sticky top-6">
                <h2 className="text-[#111814] text-lg font-bold">
                  Export & Share
                </h2>
                {/* Privacy Toggle */}
                <div className="flex items-center justify-between p-3 bg-[#f6f8f7] rounded-lg">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#111814]">
                      Desensitized Mode
                    </span>
                    <span className="text-xs text-[#618975]">
                      Show trends, hide raw values
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={desensitized}
                      onChange={(e) => setDesensitized(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
                {/* Buttons */}
                <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-green-400 text-[#111814] font-bold py-3 px-4 rounded-lg transition-colors shadow-sm shadow-primary/20">
                  <Download className="w-5 h-5" />
                  Download PDF Report
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-[#111814] font-bold py-3 px-4 rounded-lg transition-colors">
                  <LinkIcon className="w-5 h-5 text-primary" />
                  Generate Web Link
                </button>
                <p className="text-center text-xs text-[#618975] mt-1">
                  Links expire after 7 days automatically.
                </p>
              </div>

              {/* Access Management Card */}
              <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-[#111814] text-lg font-bold">
                    Coach Access
                  </h2>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f6f8f7] hover:bg-gray-200 text-[#111814]">
                    <UserPlus className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-[#618975]">
                  Grant view-only access to nutritionists or coaches.
                </p>
                <div className="flex flex-col gap-3">
                  {coachAccessData.map((coach) => (
                    <div
                      key={coach.name}
                      className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${coach.avatar})` }}
                        />
                        <div>
                          <p className="text-sm font-bold text-[#111814]">
                            {coach.name}
                          </p>
                          <p className="text-xs text-[#618975]">{coach.role}</p>
                        </div>
                      </div>
                      <button
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Revoke Access"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100 flex gap-3">
                  <Info className="text-blue-500 w-5 h-5 flex-shrink-0" />
                  <p className="text-xs text-blue-800">
                    Coaches can only view data from the last 30 days unless
                    specified otherwise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
