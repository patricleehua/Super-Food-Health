"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { consentLogData, thirdPartyAppsData } from "@/lib/mock-data";
import { useTranslations } from "next-intl";
import {
  Download,
  Link as LinkIcon,
  Shield,
  Calendar,
  ChevronDown,
  Trash2,
  Info,
  ExternalLink,
  Clock,
} from "lucide-react";

export default function PrivacyPage() {
  const [fileFormat, setFileFormat] = useState("csv");
  const [dateRange, setDateRange] = useState("all");
  const t = useTranslations("privacy");

  return (
    <div className="min-h-screen bg-[#f6f8f7] dark:bg-[#102219]">
      <Sidebar />
      <main className="flex flex-col">
        {/* Main Content */}
        <div className="w-full max-w-[1200px] mx-auto px-4 md:px-10 py-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-[#111418] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                {t("title")}
              </h1>
              <p className="text-[#617289] dark:text-gray-400 text-base font-normal max-w-2xl">
                {t("subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm font-medium border border-green-100 dark:border-green-900/30">
              <Shield className="w-4 h-4" />
              Data Encrypted
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Left Column: Actions */}
            <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">
              {/* Data Export Section */}
              <section className="bg-white dark:bg-[#1a2634] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2a3848] overflow-hidden">
                <div className="px-6 py-5 border-b border-[#f0f2f4] dark:border-[#2a3848] flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Download className="text-primary w-5 h-5" />
                    <h2 className="text-[#111418] dark:text-white text-lg font-bold">
                      Data Export
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-[#617289] dark:text-gray-300 text-sm mb-6">
                    Download a copy of your complete health records including
                    logs, analytics, and uploaded documents.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-semibold text-[#617289] dark:text-gray-400 uppercase tracking-wider mb-2">
                        File Format
                      </label>
                      <div className="relative">
                        <select
                          value={fileFormat}
                          onChange={(e) => setFileFormat(e.target.value)}
                          className="w-full h-12 rounded-lg border border-[#dbe0e6] dark:border-[#4b5563] bg-white dark:bg-[#101822] text-[#111418] dark:text-white px-4 focus:ring-2 focus:ring-primary focus:border-primary appearance-none cursor-pointer"
                        >
                          <option value="csv">CSV (Spreadsheet)</option>
                          <option value="json">JSON (Developer)</option>
                          <option value="pdf">PDF (Document)</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#617289]">
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-semibold text-[#617289] dark:text-gray-400 uppercase tracking-wider mb-2">
                        Date Range
                      </label>
                      <div className="relative">
                        <select
                          value={dateRange}
                          onChange={(e) => setDateRange(e.target.value)}
                          className="w-full h-12 rounded-lg border border-[#dbe0e6] dark:border-[#4b5563] bg-white dark:bg-[#101822] text-[#111418] dark:text-white px-4 focus:ring-2 focus:ring-primary focus:border-primary appearance-none cursor-pointer"
                        >
                          <option value="all">All Time</option>
                          <option value="year">Last 12 Months</option>
                          <option value="month">Last 30 Days</option>
                          <option value="custom">Custom Range</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#617289]">
                          <Calendar className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Request Archive
                    </button>
                  </div>
                </div>
              </section>

              {/* Third Party Access */}
              <section className="bg-white dark:bg-[#1a2634] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2a3848] overflow-hidden">
                <div className="px-6 py-5 border-b border-[#f0f2f4] dark:border-[#2a3848]">
                  <div className="flex items-center gap-3">
                    <LinkIcon className="text-primary w-5 h-5" />
                    <h2 className="text-[#111418] dark:text-white text-lg font-bold">
                      Third-Party Access
                    </h2>
                  </div>
                </div>
                <div className="divide-y divide-[#f0f2f4] dark:divide-[#2a3848]">
                  {thirdPartyAppsData.map((app) => (
                    <div
                      key={app.name}
                      className="p-6 flex items-center justify-between flex-wrap gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl">
                          {app.logo}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#111418] dark:text-white">
                            {app.name}
                          </h3>
                          <p className="text-sm text-[#617289] dark:text-gray-400">
                            {app.access}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                          {app.status}
                        </span>
                        <button className="text-[#617289] hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 font-medium text-sm transition-colors">
                          Revoke
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Consent Log */}
              <section className="bg-white dark:bg-[#1a2634] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2a3848] overflow-hidden">
                <div className="px-6 py-5 border-b border-[#f0f2f4] dark:border-[#2a3848]">
                  <div className="flex items-center gap-3">
                    <Clock className="text-primary w-5 h-5" />
                    <h2 className="text-[#111418] dark:text-white text-lg font-bold">
                      Consent Log
                    </h2>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#fcfdfd] dark:bg-[#15202b] border-b border-[#e5e7eb] dark:border-[#2a3848]">
                        <th className="py-3 px-6 text-xs font-semibold text-[#617289] dark:text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="py-3 px-6 text-xs font-semibold text-[#617289] dark:text-gray-400 uppercase tracking-wider">
                          Action
                        </th>
                        <th className="py-3 px-6 text-xs font-semibold text-[#617289] dark:text-gray-400 uppercase tracking-wider">
                          Device/IP
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f2f4] dark:divide-[#2a3848]">
                      {consentLogData.map((log, index) => (
                        <tr key={index}>
                          <td className="py-4 px-6 text-sm font-medium text-[#111418] dark:text-white">
                            {log.date}
                          </td>
                          <td className="py-4 px-6 text-sm text-[#617289] dark:text-gray-300">
                            {log.action}
                          </td>
                          <td className="py-4 px-6 text-sm text-[#617289] dark:text-gray-300">
                            {log.device}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 bg-[#fcfdfd] dark:bg-[#15202b] border-t border-[#e5e7eb] dark:border-[#2a3848] text-center">
                  <button className="text-sm text-primary font-medium hover:underline">
                    View All Records
                  </button>
                </div>
              </section>
            </div>

            {/* Right Column: Danger Zone / Info */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {/* Danger Zone */}
              <div className="bg-white dark:bg-[#1a2634] rounded-xl shadow-sm border border-red-100 dark:border-red-900/30 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4 text-red-600 dark:text-red-400">
                    <Info className="w-5 h-5" />
                    <h2 className="text-lg font-bold">Danger Zone</h2>
                  </div>
                  <p className="text-sm text-[#617289] dark:text-gray-400 mb-6">
                    Actions here cannot be undone. Please proceed with caution.
                  </p>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-semibold text-[#111418] dark:text-white mb-2">
                        Delete specific period
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="date"
                          className="flex-1 rounded-lg border border-[#dbe0e6] dark:border-[#4b5563] bg-white dark:bg-[#101822] text-[#111418] dark:text-white px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500"
                        />
                        <button className="bg-white dark:bg-transparent border border-[#dbe0e6] dark:border-[#4b5563] hover:bg-red-50 dark:hover:bg-red-900/20 text-[#111418] dark:text-white hover:text-red-600 dark:hover:text-red-400 px-3 py-2 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <hr className="border-[#f0f2f4] dark:border-[#2a3848]" />
                    <div>
                      <h3 className="text-sm font-bold text-[#111418] dark:text-white mb-1">
                        Delete Account
                      </h3>
                      <p className="text-xs text-[#617289] dark:text-gray-400 mb-3">
                        Permanently remove your account and all associated data.
                      </p>
                      <button className="w-full border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-bold py-2.5 px-4 rounded-lg transition-colors text-sm">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy Resources */}
              <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 border border-primary/10 dark:border-primary/20">
                <h3 className="font-bold text-[#111418] dark:text-white mb-4 flex items-center gap-2">
                  <Info className="text-primary w-5 h-5" />
                  Resources
                </h3>
                <ul className="space-y-3">
                  {[
                    "Privacy Policy",
                    "Terms of Service",
                    "GDPR Compliance",
                  ].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="flex items-center justify-between text-sm text-[#111418] dark:text-gray-200 hover:text-primary transition-colors group"
                      >
                        <span>{item}</span>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
