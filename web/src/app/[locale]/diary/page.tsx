"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import AddFoodModal from "@/components/add-food-modal";
import { Sidebar } from "@/components/sidebar";
import { ProtectedRoute } from "@/components/protected-route";

type ViewMode = "daily" | "weekly" | "monthly";

interface MealItem {
  id: string;
  name: string;
  portion: string;
  calories: number;
  image?: string;
}

interface DailySummary {
  caloriesConsumed: number;
  caloriesGoal: number;
  protein: { current: number; goal: number };
  carbs: { current: number; goal: number };
  fat: { current: number; goal: number };
}

export default function DiaryPage() {
  const t = useTranslations("diary");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<string>("");
  const [dailyNotes, setDailyNotes] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("daily");
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

  // Mock data
  const [meals, setMeals] = useState<Record<string, MealItem[]>>({
    breakfast: [
      {
        id: "1",
        name: "Avocado Toast",
        portion: "2 slices",
        calories: 320,
      },
      {
        id: "2",
        name: "Greek Yogurt Bowl",
        portion: "1 bowl",
        calories: 250,
      },
    ],
    lunch: [
      {
        id: "3",
        name: "Chicken Caesar Salad",
        portion: "1 serving",
        calories: 450,
      },
    ],
    dinner: [
      {
        id: "4",
        name: "Grilled Salmon",
        portion: "1 fillet (4oz)",
        calories: 300,
      },
      {
        id: "5",
        name: "Steamed Broccoli",
        portion: "1 cup",
        calories: 120,
      },
    ],
    snacks: [],
  });

  const summary: DailySummary = {
    caloriesConsumed: 1440,
    caloriesGoal: 2000,
    protein: { current: 95, goal: 140 },
    carbs: { current: 180, goal: 220 },
    fat: { current: 45, goal: 65 },
  };

  const handleAddFood = (mealType: string) => {
    setSelectedMeal(mealType);
    setShowFoodModal(true);
  };

  const handleFoodAdded = (
    food: any,
    servingAmount: number,
    servingUnit: string,
    meal: string
  ) => {
    const newItem: MealItem = {
      id: Date.now().toString(),
      name: food.name,
      portion: `${servingAmount} ${servingUnit}`,
      calories: Math.round(food.calories * servingAmount),
      image: food.image,
    };

    setMeals((prev) => ({
      ...prev,
      [meal]: [...prev[meal], newItem],
    }));
  };

  const handleDeleteItem = (mealType: string, itemId: string) => {
    setMeals((prev) => ({
      ...prev,
      [mealType]: prev[mealType].filter((item) => item.id !== itemId),
    }));
  };

  const getMealIcon = (mealType: string) => {
    const icons: Record<string, string> = {
      breakfast: "wb_sunny",
      lunch: "wb_twilight",
      dinner: "dark_mode",
      snacks: "cookie",
    };
    return icons[mealType] || "restaurant";
  };

  const getMealColor = (mealType: string) => {
    const colors: Record<string, string> = {
      breakfast: "text-orange-400",
      lunch: "text-blue-400",
      dinner: "text-indigo-400",
      snacks: "text-purple-400",
    };
    return colors[mealType] || "text-gray-400";
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f6f8f7] dark:bg-[#102219]">
        <Sidebar />
        <main className="flex flex-col">
          {/* Page Header */}
          <div className="max-w-[1600px] mx-auto w-full p-6 lg:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-[#111814] dark:text-white">
                  {t("title")}
                </h1>
                <p className="text-[#618975] dark:text-gray-400 font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">
                    calendar_today
                  </span>
                  {t("today")}, {formatDate(selectedDate)}
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 rounded-lg h-10 bg-white dark:bg-[#1a2c24] border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <button
                    onClick={() => setViewMode("daily")}
                    className={`px-3 h-full text-xs font-bold transition-colors ${
                      viewMode === "daily"
                        ? "bg-[#13ec80] text-white dark:bg-[#13ec80] dark:text-[#111814]"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {t("dailyView")}
                  </button>
                  <button
                    onClick={() => setViewMode("weekly")}
                    className={`px-3 h-full text-xs font-bold transition-colors ${
                      viewMode === "weekly"
                        ? "bg-[#13ec80] text-white dark:bg-[#13ec80] dark:text-[#111814]"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {t("weeklyView")}
                  </button>
                  <button
                    onClick={() => setViewMode("monthly")}
                    className={`px-3 h-full text-xs font-bold transition-colors ${
                      viewMode === "monthly"
                        ? "bg-[#13ec80] text-white dark:bg-[#13ec80] dark:text-[#111814]"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {t("monthlyView")}
                  </button>
                </div>
                <button
                  onClick={() => handleAddFood("breakfast")}
                  className="flex items-center gap-2 rounded-lg h-10 px-4 bg-[#111814] text-white dark:bg-[#13ec80] dark:text-[#111814] text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  <span className="material-symbols-outlined text-lg">
                    add_circle
                  </span>
                  {t("quickAdd")}
                </button>
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
              {viewMode === "daily" ? (
                <>
                  {/* Daily View */}
                  {/* Daily Summary Sidebar */}
                  <aside className="col-span-1 lg:col-span-3 xl:col-span-3 flex flex-col gap-4 bg-gradient-to-br from-[#dcfce7] via-[#f0fdf4] to-white dark:from-[#11291f] dark:to-[#1a2c24] rounded-xl border border-green-200 dark:border-gray-800 shadow-sm overflow-hidden h-fit lg:h-full">
                    <div className="p-5 border-b border-green-100 dark:border-gray-800 backdrop-blur-md">
                      <h3 className="text-lg font-bold mb-1 flex items-center gap-2 text-[#166534] dark:text-[#13ec80]">
                        <span className="material-symbols-outlined">
                          donut_small
                        </span>
                        {t("dailySummary")}
                      </h3>
                      <p className="text-xs text-green-700 dark:text-gray-400">
                        Goals based on your {summary.caloriesGoal} {t("kcal")}{" "}
                        plan
                      </p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-8">
                      {/* Calories Circle */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="relative w-40 h-40">
                          <svg
                            className="w-full h-full rotate-[-90deg]"
                            viewBox="0 0 36 36"
                          >
                            <path
                              className="text-green-200/50 dark:text-green-900/30"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3.8"
                            />
                            <path
                              className="text-[#13ec80] drop-shadow-md"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeDasharray={`${
                                (summary.caloriesConsumed /
                                  summary.caloriesGoal) *
                                100
                              }, 100`}
                              strokeLinecap="round"
                              strokeWidth="3.8"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-3xl font-black text-gray-800 dark:text-white">
                              {summary.caloriesGoal - summary.caloriesConsumed}
                            </span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                              {t("left")}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-center">
                          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            {summary.caloriesConsumed} / {summary.caloriesGoal}{" "}
                            {t("kcal")}
                          </p>
                        </div>
                      </div>

                      {/* Macros Progress */}
                      <div className="space-y-4">
                        {/* Protein */}
                        <div>
                          <div className="flex justify-between items-end mb-1">
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                              {t("protein")}
                            </span>
                            <span className="text-xs font-medium text-gray-500">
                              {summary.protein.current} / {summary.protein.goal}
                              g
                            </span>
                          </div>
                          <div className="h-2 w-full bg-white dark:bg-black/20 rounded-full overflow-hidden border border-green-100 dark:border-gray-700">
                            <div
                              className="h-full bg-[#13ec80] rounded-full"
                              style={{
                                width: `${
                                  (summary.protein.current /
                                    summary.protein.goal) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Carbs */}
                        <div>
                          <div className="flex justify-between items-end mb-1">
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                              {t("carbs")}
                            </span>
                            <span className="text-xs font-medium text-gray-500">
                              {summary.carbs.current} / {summary.carbs.goal}g
                            </span>
                          </div>
                          <div className="h-2 w-full bg-white dark:bg-black/20 rounded-full overflow-hidden border border-green-100 dark:border-gray-700">
                            <div
                              className="h-full bg-sky-400 rounded-full"
                              style={{
                                width: `${
                                  (summary.carbs.current / summary.carbs.goal) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Fat */}
                        <div>
                          <div className="flex justify-between items-end mb-1">
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                              {t("fat")}
                            </span>
                            <span className="text-xs font-medium text-gray-500">
                              {summary.fat.current} / {summary.fat.goal}g
                            </span>
                          </div>
                          <div className="h-2 w-full bg-white dark:bg-black/20 rounded-full overflow-hidden border border-green-100 dark:border-gray-700">
                            <div
                              className="h-full bg-yellow-400 rounded-full"
                              style={{
                                width: `${
                                  (summary.fat.current / summary.fat.goal) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Motivational Message */}
                      <div className="bg-white/60 dark:bg-black/20 p-4 rounded-lg border border-green-100 dark:border-gray-700">
                        <div className="flex gap-3 items-start">
                          <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-sm">
                              thumb_up
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                              {t("greatJob")}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                              {t("goalMessage")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </aside>

                  {/* Meals Section */}
                  <section className="col-span-1 lg:col-span-9 xl:col-span-6 bg-white dark:bg-[#1a2c24] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a2c24] sticky top-0 z-20">
                      <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                        <span className="material-symbols-outlined">
                          chevron_left
                        </span>
                      </button>
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {t("today")}
                        </span>
                        <span className="text-xs font-medium text-gray-500">
                          {formatDate(selectedDate)}
                        </span>
                      </div>
                      <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                        <span className="material-symbols-outlined">
                          chevron_right
                        </span>
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-black/10 p-4 lg:p-6 space-y-6">
                      {Object.entries(meals).map(([mealType, items]) => (
                        <div
                          key={mealType}
                          className="bg-white dark:bg-[#1a2c24] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                        >
                          <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h4 className="text-base font-bold flex items-center gap-2">
                              <span
                                className={`material-symbols-outlined ${getMealColor(
                                  mealType
                                )}`}
                              >
                                {getMealIcon(mealType)}
                              </span>
                              {t(mealType)}
                            </h4>
                            <span className="text-sm font-bold text-gray-500">
                              {items.reduce(
                                (sum, item) => sum + item.calories,
                                0
                              )}{" "}
                              {t("kcal")}
                            </span>
                          </div>

                          {items.length > 0 ? (
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                              {items.map((item) => (
                                <div
                                  key={item.id}
                                  className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0"></div>
                                    <div>
                                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                        {item.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {item.portion}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-6">
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                      {item.calories}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleDeleteItem(mealType, item.id)
                                      }
                                      className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                      <span className="material-symbols-outlined text-lg">
                                        delete
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                              <span className="material-symbols-outlined text-gray-300 text-4xl mb-2">
                                no_food
                              </span>
                              <p className="text-sm text-gray-400 font-medium">
                                {t("noFoodLogged", { meal: t(mealType) })}
                              </p>
                            </div>
                          )}

                          <div className="p-2 bg-gray-50/30 dark:bg-gray-800/20 border-t border-gray-100 dark:border-gray-700">
                            <button
                              onClick={() => handleAddFood(mealType)}
                              className="w-full py-2.5 rounded-lg border border-dashed border-[#13ec80] text-[#13ec80] hover:bg-[#13ec80]/5 transition-colors text-sm font-bold flex items-center justify-center gap-2 group"
                            >
                              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                                add
                              </span>
                              {t("addFoodTo", { meal: t(mealType) })}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Right Sidebar */}
                  <aside className="col-span-1 lg:col-span-12 xl:col-span-3 flex flex-col gap-6">
                    {/* Water Intake */}
                    <div className="bg-white dark:bg-[#1a2c24] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          <span className="material-symbols-outlined text-blue-500">
                            water_drop
                          </span>
                          {t("waterIntake")}
                        </h3>
                        <span className="text-sm font-bold text-blue-500">
                          1.2L / 2.5L
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className="aspect-[1/1.5] bg-blue-100 dark:bg-blue-900/30 rounded-md relative overflow-hidden group cursor-pointer border border-blue-200 dark:border-blue-800"
                          >
                            <div
                              className={`absolute bottom-0 inset-x-0 bg-blue-400 transition-all group-hover:bg-blue-500 ${
                                i <= 3 ? "h-full" : i === 4 ? "h-[40%]" : "h-0"
                              }`}
                            ></div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Tip: Drink a glass before every meal.
                      </p>
                    </div>

                    {/* Daily Notes */}
                    <div className="bg-white dark:bg-[#1a2c24] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 flex flex-col gap-3 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold">{t("dailyNotes")}</h3>
                        <button className="text-xs font-bold text-[#13ec80] hover:underline">
                          {t("save")}
                        </button>
                      </div>
                      <textarea
                        value={dailyNotes}
                        onChange={(e) => setDailyNotes(e.target.value)}
                        className="w-full flex-1 bg-gray-50 dark:bg-black/20 rounded-lg border-0 resize-none p-3 text-sm focus:ring-2 focus:ring-[#13ec80]/50 placeholder-gray-400 dark:text-gray-200"
                        placeholder={t("notesPlaceholder")}
                      ></textarea>
                    </div>

                    {/* Food Database Search */}
                    <div className="bg-[#13ec80]/10 dark:bg-[#13ec80]/5 rounded-xl border border-[#13ec80]/20 shadow-sm p-5">
                      <div className="flex items-center gap-2 text-[#0fb662] dark:text-[#13ec80] mb-3">
                        <span className="material-symbols-outlined">
                          search
                        </span>
                        <h3 className="text-sm font-bold uppercase tracking-wide">
                          {t("foodDatabase")}
                        </h3>
                      </div>
                      <div className="relative">
                        <input
                          className="w-full rounded-md border-0 bg-white dark:bg-black/20 py-2 pl-3 pr-10 text-sm shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#13ec80]"
                          placeholder={t("searchFoods")}
                          type="text"
                        />
                        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                          <kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400">
                            ⌘K
                          </kbd>
                        </div>
                      </div>
                    </div>
                  </aside>
                </>
              ) : viewMode === "weekly" ? (
                <>
                  {/* Weekly View */}
                  <section className="col-span-1 lg:col-span-12 bg-white dark:bg-[#1a2c24] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col overflow-hidden">
                    {/* Week Header with Navigation */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a2c24]">
                      <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                        <span className="material-symbols-outlined">
                          chevron_left
                        </span>
                      </button>
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {t("weekOf")}{" "}
                          {selectedDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                        <span className="material-symbols-outlined">
                          chevron_right
                        </span>
                      </button>
                    </div>

                    {/* Weekly Grid Header */}
                    <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2c24] sticky top-0 z-20">
                      <div className="col-span-1 p-4 flex items-center justify-center border-r border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          {t("meal")}
                        </span>
                      </div>
                      <div className="col-span-7 grid grid-cols-7 divide-x divide-gray-100 dark:divide-gray-800">
                        {[24, 25, 26, 27, 28, 29, 30].map((day, idx) => {
                          const isToday = idx === 1;
                          return (
                            <div
                              key={day}
                              className={`text-center py-3 px-1 ${
                                isToday
                                  ? "bg-[#13ec80]/10 dark:bg-[#13ec80]/5 relative"
                                  : ""
                              }`}
                            >
                              {isToday && (
                                <div className="absolute top-0 inset-x-0 h-1 bg-[#13ec80]"></div>
                              )}
                              <p
                                className={`text-xs font-bold uppercase ${
                                  isToday ? "text-[#13ec80]" : "text-gray-400"
                                }`}
                              >
                                {
                                  [
                                    t("mon"),
                                    t("tue"),
                                    t("wed"),
                                    t("thu"),
                                    t("fri"),
                                    t("sat"),
                                    t("sun"),
                                  ][idx]
                                }
                              </p>
                              <p
                                className={`text-lg font-bold ${
                                  isToday
                                    ? "text-[#13ec80]"
                                    : "text-gray-900 dark:text-white"
                                }`}
                              >
                                {day}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Weekly Grid Content */}
                    <div className="overflow-y-auto flex-1 bg-white dark:bg-[#1a2c24]">
                      <div className="grid grid-cols-8 divide-y divide-gray-100 dark:divide-gray-800 min-h-full">
                        {/* Breakfast Row */}
                        <div className="col-span-1 p-4 border-r border-gray-100 dark:border-gray-800 flex flex-col justify-center items-center bg-gray-50/30 dark:bg-black/10">
                          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300 flex items-center justify-center mb-1">
                            <span className="material-symbols-outlined text-lg">
                              wb_sunny
                            </span>
                          </div>
                          <span className="text-xs font-bold text-gray-500">
                            {t("breakfast")}
                          </span>
                        </div>
                        <div className="col-span-7 grid grid-cols-7 divide-x divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#1a2c24]">
                          {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => (
                            <div
                              key={`breakfast-${dayIdx}`}
                              className="p-2 min-h-[140px] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group relative"
                            >
                              {dayIdx < 3 ? (
                                <div className="h-full rounded bg-gray-50 dark:bg-gray-800 p-2 border border-transparent group-hover:border-[#13ec80]/20 flex flex-col gap-2 cursor-pointer">
                                  <div
                                    className="h-20 w-full rounded bg-cover bg-center"
                                    style={{
                                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAzjZ8HhgjSE3-IP9SLp2ohwTGwhMAGsdRO9W0gR2PFzCR3UCC-hphvSnH6YSLI0Tc2g-4GWNqNAy2d6J37XenMEGokVZIX0Urh_MYbj3Z2RDbBiw9aF_GCpRWMk0tXYgg7smQL5s24-ROawyAK9L_-eaw8LTkLllD8oY5W4Lcq7c_7r0DYkOhGDJan5R430_fK4cQsUfbt-OypHBH6QnBU-gLiZXYhlEAVC8EZ2q-f8eFmfesTjnZsZfAGYFvz280eh-W8gGF5pg")`,
                                    }}
                                  ></div>
                                  <p className="text-xs font-bold leading-tight line-clamp-2">
                                    Avocado Toast
                                  </p>
                                  <span className="text-[10px] bg-white dark:bg-black/40 px-1.5 py-0.5 rounded self-start border border-gray-100 dark:border-gray-700">
                                    320 kcal
                                  </span>
                                </div>
                              ) : (
                                <div className="h-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded flex flex-col items-center justify-center text-gray-400 group-hover:border-[#13ec80] group-hover:text-[#13ec80] transition-colors cursor-pointer">
                                  <span className="material-symbols-outlined">
                                    add
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Lunch Row */}
                        <div className="col-span-1 p-4 border-r border-gray-100 dark:border-gray-800 flex flex-col justify-center items-center bg-gray-50/30 dark:bg-black/10">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 flex items-center justify-center mb-1">
                            <span className="material-symbols-outlined text-lg">
                              wb_twilight
                            </span>
                          </div>
                          <span className="text-xs font-bold text-gray-500">
                            {t("lunch")}
                          </span>
                        </div>
                        <div className="col-span-7 grid grid-cols-7 divide-x divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#1a2c24]">
                          {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => (
                            <div
                              key={`lunch-${dayIdx}`}
                              className="p-2 min-h-[140px] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group relative"
                            >
                              {dayIdx === 0 || dayIdx === 1 ? (
                                <div className="h-full rounded bg-gray-50 dark:bg-gray-800 p-2 border border-transparent group-hover:border-[#13ec80]/20 flex flex-col gap-2 cursor-pointer">
                                  <div
                                    className="h-20 w-full rounded bg-cover bg-center"
                                    style={{
                                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCEBMxXZwNea656eU4VXLRrgTy4IvHA-I-mKet7v_n1iul7e5VM3S-LOzA3872slUCOTPnJNHZ_mv_qEMlKRmIsXx7YWnXmF0zCkpJeNSFLjSRqTHpiMX_S7JysgfRpsftl7Z9VJOXMXKS9WuSrkX03-4_KP5yuLQDWviCffF8jk8uzEkQwqi29ISLPzwb3Tea363ZO7eLKOz6e4Emc8z2d-p-AnkwNEstERGvSw-xN01kkP0jDywv9xSDQyUAdLPNGvMrNFIhncg")`,
                                    }}
                                  ></div>
                                  <p className="text-xs font-bold leading-tight line-clamp-2">
                                    Chicken Caesar
                                  </p>
                                  <span className="text-[10px] bg-white dark:bg-black/40 px-1.5 py-0.5 rounded self-start border border-gray-100 dark:border-gray-700">
                                    450 kcal
                                  </span>
                                </div>
                              ) : (
                                <div className="h-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded flex flex-col items-center justify-center text-gray-400 group-hover:border-[#13ec80] group-hover:text-[#13ec80] transition-colors cursor-pointer">
                                  <span className="material-symbols-outlined">
                                    add
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Dinner Row */}
                        <div className="col-span-1 p-4 border-r border-gray-100 dark:border-gray-800 flex flex-col justify-center items-center bg-gray-50/30 dark:bg-black/10">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 flex items-center justify-center mb-1">
                            <span className="material-symbols-outlined text-lg">
                              dark_mode
                            </span>
                          </div>
                          <span className="text-xs font-bold text-gray-500">
                            {t("dinner")}
                          </span>
                        </div>
                        <div className="col-span-7 grid grid-cols-7 divide-x divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#1a2c24]">
                          {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => (
                            <div
                              key={`dinner-${dayIdx}`}
                              className="p-2 min-h-[140px] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group relative"
                            >
                              {dayIdx === 0 || dayIdx === 3 ? (
                                <div className="h-full rounded bg-gray-50 dark:bg-gray-800 p-2 border border-transparent group-hover:border-[#13ec80]/20 flex flex-col gap-2 cursor-pointer">
                                  <div
                                    className="h-20 w-full rounded bg-cover bg-center"
                                    style={{
                                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuC2Gu6ux5gDo5iX1SBj9n-MsMzKQ3SWBmYdh8pRJxAQyGVRMpkJ7uvPcv4K-9ml6iR-Pcu2VIur9V7ObfRABfthBrtQY6t2j-ofEvXUd47a_6LJImrdComnVIKcn7lk1mXXVJg5lBtcQ8r0e0YOzK_SQDuQ-sx8YbveZAtJKdv3J3rcAlSg_RedevUtLQDP_0UxYCI66DLEx_VtdPkCOfTowDrqcjrkw7BKuR_6CJDI1SVZxVh_sJTP4_lYhMwi-kBKyoBwBiqyxQ")`,
                                    }}
                                  ></div>
                                  <p className="text-xs font-bold leading-tight line-clamp-2">
                                    Grilled Salmon
                                  </p>
                                  <span className="text-[10px] bg-white dark:bg-black/40 px-1.5 py-0.5 rounded self-start border border-gray-100 dark:border-gray-700">
                                    550 kcal
                                  </span>
                                </div>
                              ) : (
                                <div className="h-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded flex flex-col items-center justify-center text-gray-400 group-hover:border-[#13ec80] group-hover:text-[#13ec80] transition-colors cursor-pointer">
                                  <span className="material-symbols-outlined">
                                    add
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Snacks Row */}
                        <div className="col-span-1 p-4 border-r border-gray-100 dark:border-gray-800 flex flex-col justify-center items-center bg-gray-50/30 dark:bg-black/10">
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 flex items-center justify-center mb-1">
                            <span className="material-symbols-outlined text-lg">
                              cookie
                            </span>
                          </div>
                          <span className="text-xs font-bold text-gray-500">
                            {t("snacks")}
                          </span>
                        </div>
                        <div className="col-span-7 grid grid-cols-7 divide-x divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#1a2c24]">
                          {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => (
                            <div
                              key={`snacks-${dayIdx}`}
                              className="p-2 min-h-[140px] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                            >
                              <div className="h-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded flex flex-col items-center justify-center text-gray-400 group-hover:border-[#13ec80] group-hover:text-[#13ec80] transition-colors cursor-pointer">
                                <span className="material-symbols-outlined">
                                  add
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                </>
              ) : (
                <>
                  {/* Monthly View */}
                  {/* Monthly View */}
                  <section className="col-span-1 lg:col-span-12 bg-white dark:bg-[#1a2c24] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col overflow-hidden">
                    {/* Month Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a2c24] sticky top-0 z-20">
                      <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                        <span className="material-symbols-outlined">
                          chevron_left
                        </span>
                      </button>
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {selectedDate.toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                        <span className="material-symbols-outlined">
                          chevron_right
                        </span>
                      </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="flex-1 overflow-auto p-4 bg-gray-50/50 dark:bg-black/10">
                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {[
                          t("sun"),
                          t("mon"),
                          t("tue"),
                          t("wed"),
                          t("thu"),
                          t("fri"),
                          t("sat"),
                        ].map((day) => (
                          <div key={day} className="text-center py-2">
                            <span className="text-xs font-bold text-gray-500 uppercase">
                              {day}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-2">
                        {/* Mock calendar days */}
                        {Array.from({ length: 35 }, (_, i) => {
                          const dayNum = i - 5 + 1;
                          const isCurrentMonth = dayNum > 0 && dayNum <= 31;
                          const isToday = dayNum === selectedDate.getDate();
                          const calories = isCurrentMonth
                            ? Math.floor(Math.random() * 500) + 1400
                            : 0;
                          const goal = 2000;
                          const percentage = Math.round(
                            (calories / goal) * 100
                          );

                          return (
                            <div
                              key={i}
                              className={`aspect-square rounded-xl border transition-all ${
                                !isCurrentMonth
                                  ? "bg-gray-50 dark:bg-gray-900/20 border-transparent"
                                  : isToday
                                  ? "bg-[#13ec80]/10 border-[#13ec80] shadow-md"
                                  : "bg-white dark:bg-[#1a2c24] border-gray-200 dark:border-gray-700 hover:border-[#13ec80]/50 hover:shadow-md cursor-pointer"
                              }`}
                              onClick={() =>
                                isCurrentMonth && setViewMode("daily")
                              }
                            >
                              {isCurrentMonth && (
                                <div className="h-full p-2 flex flex-col">
                                  <div className="flex items-center justify-between mb-1">
                                    <span
                                      className={`text-sm font-bold ${
                                        isToday
                                          ? "text-[#13ec80]"
                                          : "text-gray-700 dark:text-gray-300"
                                      }`}
                                    >
                                      {dayNum}
                                    </span>
                                    {percentage >= 100 && (
                                      <span className="material-symbols-outlined text-xs text-green-500">
                                        check_circle
                                      </span>
                                    )}
                                  </div>

                                  {/* Calorie Progress Circle */}
                                  <div className="flex-1 flex items-center justify-center">
                                    <div className="relative w-12 h-12">
                                      <svg
                                        className="w-full h-full rotate-[-90deg]"
                                        viewBox="0 0 36 36"
                                      >
                                        <path
                                          className="text-gray-200 dark:text-gray-700"
                                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="3"
                                        />
                                        <path
                                          className={
                                            percentage >= 90
                                              ? "text-[#13ec80]"
                                              : percentage >= 70
                                              ? "text-yellow-400"
                                              : "text-orange-400"
                                          }
                                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeDasharray={`${Math.min(
                                            percentage,
                                            100
                                          )}, 100`}
                                          strokeLinecap="round"
                                          strokeWidth="3"
                                        />
                                      </svg>
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-[9px] font-bold text-gray-700 dark:text-gray-300">
                                          {percentage}%
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Calorie Count */}
                                  <div className="text-center mt-1">
                                    <span className="text-[10px] font-medium text-gray-500">
                                      {calories}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Monthly Summary Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-white dark:bg-[#1a2c24] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-[#13ec80]/10 flex items-center justify-center">
                              <span className="material-symbols-outlined text-[#13ec80]">
                                local_fire_department
                              </span>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                {t("avgCalories")}
                              </p>
                              <p className="text-xl font-bold text-gray-900 dark:text-white">
                                1,650
                              </p>
                            </div>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#13ec80] rounded-full"
                              style={{ width: "83%" }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            83% of daily goal
                          </p>
                        </div>

                        <div className="bg-white dark:bg-[#1a2c24] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                              <span className="material-symbols-outlined text-blue-500">
                                fitness_center
                              </span>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                {t("avgProtein")}
                              </p>
                              <p className="text-xl font-bold text-gray-900 dark:text-white">
                                105g
                              </p>
                            </div>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: "75%" }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            75% of daily goal
                          </p>
                        </div>

                        <div className="bg-white dark:bg-[#1a2c24] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                              <span className="material-symbols-outlined text-green-500">
                                check_circle
                              </span>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                {t("daysOnTrack")}
                              </p>
                              <p className="text-xl font-bold text-gray-900 dark:text-white">
                                18/25
                              </p>
                            </div>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: "72%" }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            72% consistency
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Food Addition Modal */}
      <AddFoodModal
        isOpen={showFoodModal}
        onClose={() => setShowFoodModal(false)}
        selectedMeal={selectedMeal}
        onAddFood={handleFoodAdded}
      />
    </ProtectedRoute>
  );
}
