"use client";

import { Sidebar } from "@/components/sidebar";
import { User, Bell, Lock, Palette, Globe } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SettingsPage() {
  const t = useTranslations("settings");
  return (
    <div className="min-h-screen bg-[#f6f8f7] dark:bg-[#102219]">
      <Sidebar />
      <main className="flex flex-col">
        <div className="px-8 py-8">
          <div className="max-w-[1200px] mx-auto w-full">
            <h1 className="text-[#111814] dark:text-white text-3xl font-black mb-2">
              {t("title")}
            </h1>
            <p className="text-[#618975] text-sm mb-8">{t("subtitle")}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: User,
                  title: "Profile Settings",
                  desc: "Update your personal information",
                },
                {
                  icon: Bell,
                  title: "Notifications",
                  desc: "Configure notification preferences",
                },
                {
                  icon: Lock,
                  title: "Security",
                  desc: "Manage password and authentication",
                },
                {
                  icon: Palette,
                  title: "Appearance",
                  desc: "Customize theme and display",
                },
                {
                  icon: Globe,
                  title: "Language",
                  desc: "Change language and region",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-white dark:bg-[#1a2c24] rounded-xl p-6 border border-[#dbe6e0] dark:border-[#2a3c34] shadow-sm hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <Icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-[#111814] dark:text-white text-lg font-bold mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[#618975] text-sm">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
