# i18n Implementation Guide

## Overview

This project implements internationalization (i18n) using `next-intl` library with support for:

- **English (en)** - Default language
- **Simplified Chinese (zh)** - Secondary language

The implementation follows Next.js App Router conventions with automatic locale detection and seamless language switching.

---

## Architecture

### Request Flow

```
User visits URL → Middleware → Locale Detection → Load Translation File → Render Page
```

### Directory Structure

```
/src/
├── app/
│   ├── layout.tsx                  # Root layout (html/body wrapper)
│   ├── page.tsx                    # Root redirect page
│   └── [locale]/                   # Locale-specific routes
│       ├── layout.tsx              # Locale layout (translation provider)
│       ├── dashboard/
│       │   └── page.tsx
│       ├── goal-simulation/
│       │   └── page.tsx
│       └── ...
├── components/
│   ├── sidebar.tsx                 # Global navigation
│   └── language-switcher.tsx      # Language selector dropdown
├── i18n/
│   ├── routing.ts                  # Routing configuration
│   └── request.ts                  # Translation loader
├── middleware.ts                   # Locale detection middleware
└── ...

/messages/
├── en.json                         # English translations
└── zh.json                         # Chinese translations
```

---

## Core Components

### 1. Middleware (`/src/middleware.ts`)

Intercepts all requests to detect and handle locale routing.

```typescript
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for:
  // - API routes, Next.js internals, static files
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

**Behavior:**

- Detects locale from URL or browser settings
- Redirects if necessary
- Handles both prefixed (`/zh/dashboard`) and non-prefixed (`/dashboard`) URLs

---

### 2. Routing Configuration (`/src/i18n/routing.ts`)

Defines supported locales and routing behavior.

```typescript
import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "zh"], // Supported languages
  defaultLocale: "en", // Default language
  localePrefix: "as-needed", // English: no prefix, Chinese: /zh/
});

// i18n-aware navigation utilities
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

**Locale Prefix Modes:**

- `as-needed`: Default locale has no prefix, others do
  - English: `/dashboard`
  - Chinese: `/zh/dashboard`
- `always`: All locales have prefix
  - English: `/en/dashboard`
  - Chinese: `/zh/dashboard`
- `never`: No locale prefix (not recommended)

---

### 3. Request Configuration (`/src/i18n/request.ts`)

Loads translation files based on detected locale.

```typescript
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate locale
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

**Process:**

1. Receives locale from middleware
2. Validates against supported locales
3. Dynamically imports corresponding JSON file
4. Provides messages to components

---

### 4. Translation Files

#### English (`/messages/en.json`)

```json
{
  "common": {
    "appName": "HealthTrack Pro",
    "appTagline": "Your Health Journey",
    "logout": "Log Out"
  },
  "navigation": {
    "dashboard": "Dashboard",
    "diary": "Diary",
    "reports": "Reports",
    "goalSimulation": "Goal Simulation",
    "privacy": "Privacy",
    "settings": "Settings"
  },
  "dashboard": {
    "title": "Data Dashboard",
    "subtitle": "Review your historical trends and performance metrics.",
    "timePeriod": {
      "7days": "7 Days",
      "30days": "30 Days",
      "90days": "90 Days"
    }
  }
}
```

#### Chinese (`/messages/zh.json`)

```json
{
  "common": {
    "appName": "健康追踪专家",
    "appTagline": "您的健康之旅",
    "logout": "退出登录"
  },
  "navigation": {
    "dashboard": "数据仪表盘",
    "diary": "日记",
    "reports": "报告",
    "goalSimulation": "目标模拟",
    "privacy": "隐私",
    "settings": "设置"
  },
  "dashboard": {
    "title": "数据仪表盘",
    "subtitle": "查看您的历史趋势和性能指标。",
    "timePeriod": {
      "7days": "7 天",
      "30days": "30 天",
      "90days": "90 天"
    }
  }
}
```

---

### 5. Language Switcher Component (`/src/components/language-switcher.tsx`)

Provides UI for language selection.

```typescript
"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Languages } from 'lucide-react';
import { useState, useTransition } from 'react';

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === locale);

  function onSelectChange(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
      setIsOpen(false);
    });
  }

  return (
    // Dropdown UI implementation
    // ...
  );
}
```

**Features:**

- Shows current language with flag emoji
- Dropdown selection menu
- Smooth transition between languages
- Maintains current page path

---

## Usage in Components

### Basic Usage

```typescript
"use client";

import { useTranslations } from "next-intl";

export default function MyPage() {
  const t = useTranslations("myPage");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("subtitle")}</p>
    </div>
  );
}
```

### Nested Translations

```typescript
// In JSON
{
  "dashboard": {
    "weightTrend": {
      "title": "Weight Trend",
      "unit": "kg"
    }
  }
}

// In component
const t = useTranslations('dashboard');
<h3>{t('weightTrend.title')}</h3>
<span>{t('weightTrend.unit')}</span>
```

### Dynamic Values

```typescript
// In JSON
{
  "greeting": "Hello, {name}!"
}

// In component
t('greeting', { name: 'John' })  // → "Hello, John!"
```

### Using i18n-aware Navigation

```typescript
import { Link } from "@/i18n/routing";

// Automatically handles locale prefix
<Link href="/dashboard">Go to Dashboard</Link>;
```

---

## Adding a New Page

### Step 1: Create Page File

Create in `/src/app/[locale]/your-page/page.tsx`:

```typescript
"use client";

import { Sidebar } from "@/components/sidebar";
import { useTranslations } from "next-intl";

export default function YourPage() {
  const t = useTranslations("yourPage");

  return (
    <div className="min-h-screen bg-[#f6f8f7]">
      <Sidebar />
      <main className="px-8 py-8">
        <h1 className="text-3xl font-black">{t("title")}</h1>
        <p className="text-sm mt-2">{t("subtitle")}</p>
      </main>
    </div>
  );
}
```

### Step 2: Add Translations

**English (`/messages/en.json`):**

```json
{
  "navigation": {
    "yourPage": "Your Page"
  },
  "yourPage": {
    "title": "Your Page Title",
    "subtitle": "Your page description"
  }
}
```

**Chinese (`/messages/zh.json`):**

```json
{
  "navigation": {
    "yourPage": "你的页面"
  },
  "yourPage": {
    "title": "你的页面标题",
    "subtitle": "你的页面描述"
  }
}
```

### Step 3: Add to Navigation (Optional)

Update `/src/components/sidebar.tsx`:

```typescript
const navigationItems = [
  // ... existing items
  { name: t("navigation.yourPage"), href: "/your-page", icon: YourIcon },
];
```

---

## URL Routing

### Supported URL Patterns

| URL             | Language | Description                        |
| --------------- | -------- | ---------------------------------- |
| `/dashboard`    | English  | Default locale, no prefix          |
| `/zh/dashboard` | Chinese  | Explicit Chinese prefix            |
| `/en/dashboard` | English  | Explicit English prefix (optional) |
| `/settings`     | English  | Default locale                     |
| `/zh/settings`  | Chinese  | Chinese version                    |

### Automatic Redirects

The middleware handles automatic locale detection:

1. User visits `/dashboard`
2. Middleware checks:
   - URL has locale? → Use it
   - Browser language Chinese? → Redirect to `/zh/dashboard`
   - Otherwise → Serve as English (no redirect needed)

---

## Best Practices

### 1. Namespace Organization

```json
{
  "common": {}, // Shared across all pages
  "navigation": {}, // Navigation items
  "pageName": {}, // Page-specific translations
  "components": {} // Reusable component translations
}
```

### 2. Consistent Key Naming

- Use camelCase: `userName`, not `user_name`
- Be descriptive: `submitButton`, not `btn1`
- Group related items: `form.email`, `form.password`

### 3. Handle Missing Translations

next-intl will show the key name if translation is missing:

```typescript
t("nonExistent"); // → "nonExistent" (fallback)
```

Always ensure both language files have the same keys.

### 4. Use TypeScript for Safety

Create type-safe translations:

```typescript
type Messages = typeof import("../messages/en.json");

declare global {
  interface IntlMessages extends Messages {}
}
```

### 5. Keep Translations Synchronized

When adding a key to `en.json`, immediately add it to `zh.json` to avoid missing translations.

---

## Common Patterns

### Conditional Text

```typescript
const status = 'active';
<span>{t(`status.${status}`)}</span>

// In JSON
{
  "status": {
    "active": "Active",
    "inactive": "Inactive"
  }
}
```

### Pluralization

```typescript
t('items', { count: 5 })

// In JSON
{
  "items": "{count, plural, =0 {No items} =1 {1 item} other {# items}}"
}
```

### Rich Text with HTML

```typescript
// In JSON
{
  "description": "Visit <strong>our website</strong> for more info"
}

// In component
<p dangerouslySetInnerHTML={{ __html: t('description') }} />
```

---

## Troubleshooting

### Issue: 404 on `/dashboard`

**Cause:** Middleware matcher not configured correctly.

**Solution:** Ensure matcher in `middleware.ts` includes all routes:

```typescript
matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"];
```

### Issue: Missing `<html>` and `<body>` tags error

**Cause:** Root layout doesn't have required tags.

**Solution:** Ensure `/src/app/layout.tsx` has:

```typescript
return (
  <html>
    <body>{children}</body>
  </html>
);
```

### Issue: Translations not updating

**Cause:** Next.js cache or dev server needs restart.

**Solution:**

1. Delete `.next` folder
2. Restart dev server: `npm run dev`

### Issue: Language switcher not working

**Cause:** Using Next.js `Link` instead of i18n `Link`.

**Solution:** Import from i18n routing:

```typescript
import { Link } from "@/i18n/routing"; // ✅ Correct
import Link from "next/link"; // ❌ Wrong
```

---

## Adding More Languages

### Step 1: Update Routing Config

```typescript
// /src/i18n/routing.ts
export const routing = defineRouting({
  locales: ["en", "zh", "es", "fr"], // Add new locales
  defaultLocale: "en",
});
```

### Step 2: Create Translation File

Create `/messages/es.json` (for Spanish):

```json
{
  "common": {
    "appName": "HealthTrack Pro",
    "logout": "Cerrar sesión"
  }
  // ... rest of translations
}
```

### Step 3: Update Language Switcher

```typescript
const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];
```

### Step 4: Test

Visit: `/es/dashboard` to see Spanish version.

---

## Performance Considerations

1. **Code Splitting:** Translation files are loaded per locale (not all at once)
2. **Caching:** Browser caches translation files
3. **SSR Support:** Translations work in Server Components (use `getTranslations`)
4. **Bundle Size:** Each JSON file is ~2-5KB gzipped

---

## References

- **next-intl Documentation:** https://next-intl-docs.vercel.app/
- **Next.js i18n Guide:** https://nextjs.org/docs/app/building-your-application/routing/internationalization
- **Project i18n Config:** `/src/i18n/`
- **Translation Files:** `/messages/`

---

## Quick Reference

| Task                | File to Edit                               |
| ------------------- | ------------------------------------------ |
| Add new page        | `/src/app/[locale]/page-name/page.tsx`     |
| Add translations    | `/messages/en.json` & `/messages/zh.json`  |
| Add navigation item | `/src/components/sidebar.tsx`              |
| Use translations    | `const t = useTranslations('namespace')`   |
| Create links        | `import { Link } from '@/i18n/routing'`    |
| Add language        | Update `routing.ts` + create new JSON file |
| Language switcher   | `/src/components/language-switcher.tsx`    |

---

_Last Updated: December 22, 2024_
