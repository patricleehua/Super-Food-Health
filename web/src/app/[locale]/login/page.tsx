"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const t = useTranslations("login");
  const { login: authLogin, register: authRegister } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (activeTab === "login") {
        await authLogin(email, password);
      } else {
        await authRegister(email, password);
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.detail || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full">
      {/* Left Side: Hero / Feature Section */}
      <div className="hidden lg:flex relative flex-1 flex-col justify-between bg-black p-12 text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-10"></div>
          <div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAFnuSzfESndferr43k8MZgLvmZEfElBcvuZOUu6BMWSp5rQJGVmlOKob_mgx5oYQwBrLxCQU29q3yL6aD19lN3x2vDHtWVy8MWajL0M_1zmyaJl0pHYTfKepwx53zcH75mjoA280k3RnYZMiJLbg_w2P6teL_NdBhWvcTkJTkRwAODLfMaBE3HUKArw8lf09vZUdx-tb6pkH4q9KgXZWveosHfwx8EBJrGVWG3TpSLm7VWv-vj8OfzqaMMBsOgpUgZH6rnOZwTfg")',
            }}
          ></div>
        </div>

        {/* Logo on Visual Side */}
        <div className="relative z-20 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/90 text-white">
            <span className="material-symbols-outlined text-2xl">
              monitoring
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-wide">HealthTrack</h2>
        </div>

        {/* Feature Content */}
        <div className="relative z-20 max-w-lg">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mb-8 text-lg font-medium text-white/90 leading-relaxed">
            {t("heroDescription")}
          </p>

          {/* Mini Feature Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-md border border-white/10">
              <span className="material-symbols-outlined mb-2 text-primary text-3xl">
                analytics
              </span>
              <p className="font-bold">{t("featureAnalysisTitle")}</p>
              <p className="text-sm text-white/70">
                {t("featureAnalysisDesc")}
              </p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-md border border-white/10">
              <span className="material-symbols-outlined mb-2 text-green-400 text-3xl">
                lock
              </span>
              <p className="font-bold">{t("featureSecureTitle")}</p>
              <p className="text-sm text-white/70">{t("featureSecureDesc")}</p>
            </div>
          </div>
        </div>

        {/* Legal/Footer on Visual Side */}
        <div className="relative z-20 text-sm text-white/60">
          {t("copyright")}
        </div>
      </div>

      {/* Right Side: Form Section */}
      <div className="flex flex-1 flex-col justify-center items-center bg-white dark:bg-[#101822] px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-[400px]">
          {/* Mobile Logo (visible only on small screens) */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center text-[#111418] dark:text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined text-xl">
                monitoring
              </span>
            </div>
            <h2 className="text-lg font-bold">HealthTrack</h2>
          </div>

          {/* Header Text */}
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-[#111418] dark:text-white">
              {t("welcomeBack")}
            </h2>
            <p className="mt-2 text-sm text-[#617289] dark:text-gray-400">
              {t("welcomeDescription")}
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-8 border-b border-[#dbe0e6] dark:border-gray-700">
            <nav aria-label="Tabs" className="-mb-px flex space-x-8">
              <button
                className={`whitespace-nowrap border-b-[3px] py-4 px-1 text-sm font-bold w-1/2 text-center transition-colors ${
                  activeTab === "login"
                    ? "border-primary text-primary"
                    : "border-transparent text-[#617289] dark:text-gray-400 hover:text-[#111418] dark:hover:text-gray-200 hover:border-gray-300"
                }`}
                onClick={() => {
                  setActiveTab("login");
                  setError(null);
                }}
              >
                {t("loginTab")}
              </button>
              <button
                className={`whitespace-nowrap border-b-[3px] py-4 px-1 text-sm font-bold w-1/2 text-center transition-colors ${
                  activeTab === "signup"
                    ? "border-primary text-primary"
                    : "border-transparent text-[#617289] dark:text-gray-400 hover:text-[#111418] dark:hover:text-gray-200 hover:border-gray-300"
                }`}
                onClick={() => {
                  setActiveTab("signup");
                  setError(null);
                }}
              >
                {t("signupTab")}
              </button>
            </nav>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" method="POST">
            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
                <div className="flex">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400 mr-3">
                    error
                  </span>
                  <div className="text-sm text-red-800 dark:text-red-300">
                    {error}
                  </div>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                className="block text-sm font-medium text-[#111418] dark:text-gray-200 mb-2"
                htmlFor="email"
              >
                {t("emailLabel")}
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-symbols-outlined text-[#617289] text-[20px]">
                    mail
                  </span>
                </div>
                <input
                  className="block w-full rounded-lg border-[#dbe0e6] dark:border-gray-600 pl-10 h-12 text-[#111418] dark:text-white dark:bg-[#1A2633] placeholder-[#617289] focus:border-primary focus:ring-primary sm:text-sm"
                  id="email"
                  name="email"
                  placeholder={t("emailPlaceholder")}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  className="block text-sm font-medium text-[#111418] dark:text-gray-200"
                  htmlFor="password"
                >
                  {t("passwordLabel")}
                </label>
              </div>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-symbols-outlined text-[#617289] text-[20px]">
                    lock
                  </span>
                </div>
                <input
                  className="block w-full rounded-lg border-[#dbe0e6] dark:border-gray-600 pl-10 pr-10 h-12 text-[#111418] dark:text-white dark:bg-[#1A2633] placeholder-[#617289] focus:border-primary focus:ring-primary sm:text-sm"
                  id="password"
                  name="password"
                  placeholder={t("passwordPlaceholder")}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <div
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer hover:text-[#111418] text-[#617289]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <a
                  className="text-sm font-medium text-primary hover:text-primary/80"
                  href="#"
                >
                  {t("forgotPassword")}
                </a>
              </div>
            </div>

            {/* Main Button */}
            <div>
              <button
                className="flex w-full justify-center items-center rounded-lg bg-primary h-12 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin mr-2">
                      progress_activity
                    </span>
                    {activeTab === "login" ? "Logging in..." : "Signing up..."}
                  </>
                ) : (
                  t("loginButton")
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative mt-8">
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center"
            >
              <div className="w-full border-t border-[#dbe0e6] dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-[#101822] px-2 text-sm text-[#617289]">
                {t("orContinueWith")}
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-white dark:bg-[#1A2633] border border-[#dbe0e6] dark:border-gray-600 px-3 py-2.5 text-sm font-semibold text-[#111418] dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
              type="button"
              aria-label={t("googleAlt")}
            >
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M12.0003 20.45c4.6667 0 8.5833-3.25 9.9167-7.7167h-9.9167v-3.8666h16.25c.1666.95.25 1.95.25 3.0333 0 8.7-6.55 14.9-15.5 14.9-8.95 0-16.2-7.25-16.2-16.2s7.25-16.2 16.2-16.2c4.1333 0 7.8667 1.5167 10.7667 4.0167l-3.6667 3.5333c-1.8-1.5667-4.1667-2.3833-6.5-2.3833-5.25 0-9.6167 3.5167-11.2333 8.35l4.8 3.7167c1.3833-3.5 4.8333-5.9667 8.8333-5.9667z"
                  fill="currentColor"
                  fillOpacity="0"
                ></path>
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.347.533 12s5.333 12 11.947 12c3.507 0 6.187-1.16 8.207-3.28 2.053-2.053 2.68-4.94 2.68-7.28 0-.72-.053-1.387-.16-2.053H12.48z"
                  fill="currentColor"
                ></path>
              </svg>
              <span className="sr-only">{t("googleAlt")}</span>
            </button>
            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-white dark:bg-[#1A2633] border border-[#dbe0e6] dark:border-gray-600 px-3 py-2.5 text-sm font-semibold text-[#111418] dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
              type="button"
              aria-label={t("appleAlt")}
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M13.2 0c.133 2.213-1.68 4.293-3.693 4.493-1.027.093-2.227-.493-2.827-2.4C6.187.947 8.053.053 9.493 0c.04 0 .093.013.133.013.88.013 2.32.013 3.573-.013zM16.8 17.027c-.827 1.2-2.24 3.427-4.173 3.453-1.08.013-1.893-.72-2.92-.72-1.013 0-2.12.72-2.96.747-1.92.053-3.48-2.08-4.413-4.507-1.893-4.933 1.253-7.533 4.627-7.56 1.053-.013 2.08.707 2.693.707.6 0 1.933-.827 3.32-.707 3.307.133 4.96 2.6 4.96 2.653-.04.027-2.6 1.48-2.56 5.093.013 3.653 3.253 4.88 3.293 4.907-.027.08-.507 1.76-1.867 3.867z"></path>
              </svg>
              <span className="sr-only">{t("appleAlt")}</span>
            </button>
            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-white dark:bg-[#1A2633] border border-[#dbe0e6] dark:border-gray-600 px-3 py-2.5 text-sm font-semibold text-[#111418] dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
              type="button"
              aria-label={t("wechatAlt")}
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5 text-[#07C160]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8.694 15.58c0 3.344 3.197 6.056 7.14 6.056.402 0 .794-.028 1.176-.083.18-.026.375.025.508.134l2.193 1.785a.517.517 0 0 0 .84-.396v-2.074c.002-.128.06-.25.158-.33 1.99-1.616 2.91-3.453 2.91-5.093 0-3.344-3.197-6.056-7.14-6.056-3.943 0-7.14 2.712-7.14 6.057h-.647zm-8.16-3.237c0 3.125 2.78 5.66 6.21 5.66.35 0 .69-.026 1.022-.077.165-.024.333.023.45.126l1.908 1.666c.307.268.79.05.79-.356v-1.938c0-.12.054-.233.146-.308 1.83-1.503 2.68-3.21 2.68-4.773 0-3.125-2.78-5.66-6.21-5.66-3.43 0-6.21 2.535-6.21 5.66h-.786z"></path>
              </svg>
              <span className="sr-only">{t("wechatAlt")}</span>
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-[#617289] dark:text-gray-400">
            {t("termsPrefix")}{" "}
            <a
              className="font-semibold text-primary hover:text-primary/80"
              href="#"
            >
              {t("termsOfService")}
            </a>{" "}
            {t("termsAnd")}{" "}
            <a
              className="font-semibold text-primary hover:text-primary/80"
              href="#"
            >
              {t("privacyPolicy")}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
