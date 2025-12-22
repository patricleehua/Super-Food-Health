"use client";

import { Link, usePathname } from "@/i18n/routing";
import { BarChart3, Heart, Book, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations();

  const navigationItems = [
    { name: t("navigation.dashboard"), href: "/dashboard", icon: BarChart3 },
    { name: t("navigation.diary"), href: "/diary", icon: Book },
    { name: t("navigation.reports"), href: "/reports", icon: Heart },
    {
      name: t("navigation.goalSimulation"),
      href: "/goal-simulation",
      icon: Heart,
    },
    { name: t("navigation.privacy"), href: "/privacy", icon: User },
    { name: t("navigation.settings"), href: "/settings", icon: Settings },
  ];

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#dbe6e0] dark:border-[#2a3c34] px-4 md:px-10 py-3 bg-white dark:bg-[#1a2c24] sticky top-0 z-50">
      <div className="flex items-center gap-4 text-[#111814] dark:text-white">
        <div className="w-8 h-8 text-primary">
          <Heart className="w-full h-full" />
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
          {t("common.appName")}
        </h2>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <div className="hidden md:flex items-center gap-9">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium leading-normal transition-colors hover:text-primary dark:hover:text-primary",
                  isActive
                    ? "text-primary font-bold border-b-2 border-primary pb-0.5"
                    : "text-[#111814] dark:text-gray-300"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <button className="hidden md:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary/10 text-[#111814] dark:text-primary hover:bg-primary hover:text-[#111814] transition-all text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">{t("common.logout")}</span>
          </button>
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full w-10 h-10 border-2 border-primary"
            style={{
              backgroundImage:
                'url("https://api.dicebear.com/7.x/avataaars/svg?seed=sarah")',
            }}
          />
        </div>
      </div>
    </header>
  );
}
