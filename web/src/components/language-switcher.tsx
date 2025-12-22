"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Languages } from "lucide-react";
import { useState, useTransition } from "react";

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find((lang) => lang.code === locale);

  function onSelectChange(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
      setIsOpen(false);
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#f6f8f7] dark:hover:bg-[#23352d] transition-colors"
        disabled={isPending}
      >
        <Languages className="w-4 h-4 text-[#618975]" />
        <span className="text-sm font-medium text-[#618975]">
          {currentLanguage?.flag} {currentLanguage?.label}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a2c24] rounded-lg shadow-lg border border-[#dbe6e0] dark:border-[#2a3c34] z-20 overflow-hidden">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => onSelectChange(language.code)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#f6f8f7] dark:hover:bg-[#23352d] transition-colors ${
                  locale === language.code
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-[#111814] dark:text-white"
                }`}
              >
                <span className="text-xl">{language.flag}</span>
                <span className="text-sm">{language.label}</span>
                {locale === language.code && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
