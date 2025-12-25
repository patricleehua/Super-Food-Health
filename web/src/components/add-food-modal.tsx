"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  serving: string;
  servingSize: number;
  image?: string;
  category?: string;
  verified?: boolean;
}

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMeal: string;
  onAddFood: (
    food: FoodItem,
    servingAmount: number,
    servingUnit: string,
    meal: string
  ) => void;
}

export default function AddFoodModal({
  isOpen,
  onClose,
  selectedMeal,
  onAddFood,
}: AddFoodModalProps) {
  const t = useTranslations("diary");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "favorites" | "recent" | "myFoods"
  >("all");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [servingAmount, setServingAmount] = useState(1.0);
  const [servingUnit, setServingUnit] = useState("Medium (150g)");
  const [mealType, setMealType] = useState(selectedMeal);

  // Mock food database
  const mockFoods: FoodItem[] = [
    {
      id: "1",
      name: "Avocado, Fresh",
      calories: 240,
      protein: 3,
      carbs: 12,
      fat: 22,
      fiber: 9,
      serving: "1 medium",
      servingSize: 150,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAzjZ8HhgjSE3-IP9SLp2ohwTGwhMAGsdRO9W0gR2PFzCR3UCC-hphvSnH6YSLI0Tc2g-4GWNqNAy2d6J37XenMEGokVZIX0Urh_MYbj3Z2RDbBiw9aF_GCpRWMk0tXYgg7smQL5s24-ROawyAK9L_-eaw8LTkLllD8oY5W4Lcq7c_7r0DYkOhGDJan5R430_fK4cQsUfbt-OypHBH6QnBU-gLiZXYhlEAVC8EZ2q-f8eFmfesTjnZsZfAGYFvz280eh-W8gGF5pg",
      category: "Healthy Fat",
      verified: true,
    },
    {
      id: "2",
      name: "Chicken Breast, Grilled",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      serving: "100g",
      servingSize: 100,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCiK_x4aBvykLDzLwktJjzeEPqcswPmkMwPli0YEOgbh87LKJhFax8cCoInrXZLvje3yzPQgFBroiRKCx9reVXGTE4LwR5ISr_oVSuGwegvQZWd0W3ZHp7NBaGOzi6qI6El6jzI9gniLwwTq8dnMhPuSrZy_Z20t639V8OJVe0dLRoVsyKamMo0hphsLVzOBFpkEY8CvkYg-auEyaEVWpCPwevM8ngoDRSJ7_qKm7zwJUrc7-DEvDOSiq3Ild4cdFW-cr3DRiuyfQ",
      verified: true,
    },
    {
      id: "3",
      name: "Oatmeal with Berries",
      calories: 280,
      protein: 8,
      carbs: 48,
      fat: 6,
      fiber: 8,
      serving: "1 bowl",
      servingSize: 200,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCxsfR7Q8YPLczaJxg4ktNfNKKhW3cSg-7iJBvT10fewIqg741s1xi3Q3zOcsjLaH6qpCcTwkgLKcOnf2iagQDmhg1YIgk3PYx7STRyyxXWsMAKTDKgaTzYfW0ll361m3fe5Cqh_1RA0hQ_bejZ55BM9WOXr6Tx7z71pBykjY6JyuOzO_Voh0vYZm_tMroUmrjmR45P0MHI2K3BzgmY3WIxNiqcoVbUj-IrnKFLjTB0L0LTrCuZohi0LNckKAnjYFSk-wWsuXbjCA",
      verified: true,
    },
    {
      id: "4",
      name: "Caesar Salad",
      calories: 450,
      protein: 12,
      carbs: 24,
      fat: 35,
      serving: "1 serving",
      servingSize: 250,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCEBMxXZwNea656eU4VXLRrgTy4IvHA-I-mKet7v_n1iul7e5VM3S-LOzA3872slUCOTPnJNHZ_mv_qEMlKRmIsXx7YWnXmF0zCkpJeNSFLjSRqTHpiMX_S7JysgfRpsftl7Z9VJOXMXKS9WuSrkX03-4_KP5yuLQDWviCffF8jk8uzEkQwqi29ISLPzwb3Tea363ZO7eLKOz6e4Emc8z2d-p-AnkwNEstERGvSw-xN01kkP0jDywv9xSDQyUAdLPNGvMrNFIhncg",
      verified: true,
    },
    {
      id: "5",
      name: "Stir Fry Veggies",
      calories: 180,
      protein: 5,
      carbs: 20,
      fat: 9,
      fiber: 6,
      serving: "200g",
      servingSize: 200,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDJJTqOoYBBa4Y3B4w8H0ulHpvD1dTIlDyQkpFgPWAXJUCXDuseoQ93CN9xlMn4QfQsdjBVVBU2c6xsuFBKj0S4zWbjIrfa3ge0RsFJlToUYNledBR1TQk22B67gqGHqoIX33lLXhM3RKFkApj2A10YHMvdrCoMzWkxa6MSNoTT0Gyz_ChiGNplGVuPofueJjmRNYSsBtTSUfR-FsOdyGU2zP2ZLnDwn5kx_1MQLwGnZYeuxJugtCkm5V_P4UaIK4Gx2idih3adww",
    },
  ];

  const filteredFoods = mockFoods.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setServingUnit(`${food.serving} (${food.servingSize}g)`);
  };

  const handleAddToDiary = () => {
    if (selectedFood) {
      onAddFood(selectedFood, servingAmount, servingUnit, mealType);
      handleClose();
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setSelectedFood(null);
    setServingAmount(1.0);
    setActiveTab("all");
    onClose();
  };

  const incrementServing = () =>
    setServingAmount((prev) => Math.round((prev + 0.5) * 10) / 10);
  const decrementServing = () =>
    setServingAmount((prev) =>
      Math.max(0.5, Math.round((prev - 0.5) * 10) / 10)
    );

  const calculateTotalCalories = () => {
    if (!selectedFood) return 0;
    return Math.round(selectedFood.calories * servingAmount);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      <div className="relative w-full max-w-5xl bg-white dark:bg-[#1a2c24] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[700px] transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Left Panel - Food Search */}
        <div className="w-full md:w-5/12 lg:w-4/12 flex flex-col border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a2c24] z-10">
          <div className="p-5 pb-2">
            <h2
              id="modal-title"
              className="text-xl font-bold mb-4 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[#13ec80]">
                lunch_dining
              </span>
              {t("addFood")}
            </h2>

            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#13ec80] transition-colors">
                search
              </span>
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black/20 border-transparent rounded-xl focus:ring-2 focus:ring-[#13ec80]/50 focus:border-[#13ec80]/20 text-sm font-medium transition-all"
                placeholder={t("searchPlaceholder")}
                type="text"
              />
            </div>

            <div className="flex gap-4 mt-4 text-sm font-medium text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-px overflow-x-auto hide-scrollbar">
              <button
                onClick={() => setActiveTab("all")}
                className={`pb-2 whitespace-nowrap transition-colors ${
                  activeTab === "all"
                    ? "text-[#13ec80] border-b-2 border-[#13ec80]"
                    : "hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                {t("allResults")}
              </button>
              <button
                onClick={() => setActiveTab("favorites")}
                className={`pb-2 whitespace-nowrap transition-colors ${
                  activeTab === "favorites"
                    ? "text-[#13ec80] border-b-2 border-[#13ec80]"
                    : "hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                {t("favorites")}
              </button>
              <button
                onClick={() => setActiveTab("recent")}
                className={`pb-2 whitespace-nowrap transition-colors ${
                  activeTab === "recent"
                    ? "text-[#13ec80] border-b-2 border-[#13ec80]"
                    : "hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                {t("recent")}
              </button>
              <button
                onClick={() => setActiveTab("myFoods")}
                className={`pb-2 whitespace-nowrap transition-colors ${
                  activeTab === "myFoods"
                    ? "text-[#13ec80] border-b-2 border-[#13ec80]"
                    : "hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                {t("myFoods")}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredFoods.map((food) => (
              <button
                key={food.id}
                onClick={() => handleSelectFood(food)}
                className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors relative overflow-hidden ${
                  selectedFood?.id === food.id
                    ? "bg-[#13ec80]/5 border border-[#13ec80]/20"
                    : "hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent"
                }`}
              >
                {selectedFood?.id === food.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#13ec80]"></div>
                )}
                <div
                  className="size-12 rounded-lg bg-cover bg-center shrink-0 border border-gray-100 dark:border-gray-700"
                  style={{ backgroundImage: `url("${food.image}")` }}
                ></div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 dark:text-white truncate">
                    {food.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {food.serving} • {food.calories} {t("kcal")}
                  </p>
                </div>
                {selectedFood?.id === food.id && (
                  <span className="material-symbols-outlined text-[#13ec80]">
                    chevron_right
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            <button className="w-full py-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-500 hover:border-[#13ec80] hover:text-[#13ec80] hover:bg-[#13ec80]/5 transition-all flex items-center justify-center gap-2 font-bold text-sm">
              <span className="material-symbols-outlined">edit_square</span>
              {t("createCustomFood")}
            </button>
          </div>
        </div>

        {/* Right Panel - Food Details */}
        <div className="w-full md:w-7/12 lg:w-8/12 bg-gray-50/50 dark:bg-[#15231d] flex flex-col relative">
          {selectedFood ? (
            <>
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
                  <div
                    className="size-24 sm:size-32 rounded-2xl bg-cover bg-center shadow-lg ring-4 ring-white dark:ring-white/5"
                    style={{ backgroundImage: `url("${selectedFood.image}")` }}
                  ></div>
                  <div className="flex-1 pt-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-1">
                          {selectedFood.name}
                        </h1>
                        {selectedFood.verified && (
                          <p className="text-gray-500 font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">
                              verified
                            </span>
                            Generic Foods Database
                          </p>
                        )}
                      </div>
                      {selectedFood.category && (
                        <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">
                          {selectedFood.category}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4">
                      <button className="text-xs text-red-500 font-bold hover:text-red-600 transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          flag
                        </span>
                        {t("reportCorrection")}
                      </button>
                      <button className="text-xs text-[#0fb662] dark:text-[#13ec80] font-bold hover:underline transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          share
                        </span>
                        {t("shareFood")}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white dark:bg-[#1a2c24] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm text-center flex flex-col items-center justify-center">
                    <div className="size-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-2">
                      <span className="material-symbols-outlined text-lg">
                        local_fire_department
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                      {t("calories")}
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                      {Math.round(selectedFood.calories * servingAmount)}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-[#1a2c24] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm text-center relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-100 dark:bg-gray-700">
                      <div
                        className="h-full bg-blue-500 rounded-r-full"
                        style={{
                          width: `${(selectedFood.protein / 60) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                      {t("protein")}
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                      {Math.round(selectedFood.protein * servingAmount)}g
                    </p>
                  </div>
                  <div className="bg-white dark:bg-[#1a2c24] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm text-center relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-100 dark:bg-gray-700">
                      <div
                        className="h-full bg-green-500 rounded-r-full"
                        style={{
                          width: `${(selectedFood.carbs / 100) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                      {t("carbs")}
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                      {Math.round(selectedFood.carbs * servingAmount)}g
                    </p>
                    {selectedFood.fiber && (
                      <p className="text-[10px] text-gray-400 mt-1">
                        Fiber: {Math.round(selectedFood.fiber * servingAmount)}g
                      </p>
                    )}
                  </div>
                  <div className="bg-white dark:bg-[#1a2c24] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm text-center relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-100 dark:bg-gray-700">
                      <div
                        className="h-full bg-yellow-500 rounded-r-full"
                        style={{ width: `${(selectedFood.fat / 30) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                      {t("fat")}
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                      {Math.round(selectedFood.fat * servingAmount)}g
                    </p>
                  </div>
                </div>

                <div className="space-y-6 bg-white dark:bg-[#1a2c24] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex justify-between">
                      {t("servingAmount")}
                      <span className="text-xs font-normal text-gray-400">
                        {t("required")}
                      </span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="relative sm:col-span-1">
                        <button
                          onClick={decrementServing}
                          className="absolute left-3 top-1/2 -translate-y-1/2 size-6 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-colors"
                        >
                          -
                        </button>
                        <input
                          value={servingAmount}
                          onChange={(e) =>
                            setServingAmount(parseFloat(e.target.value) || 0)
                          }
                          className="w-full text-center bg-gray-50 dark:bg-black/20 border-transparent rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-[#13ec80]/50 focus:bg-white transition-colors"
                          type="number"
                          step="0.5"
                          min="0.5"
                        />
                        <button
                          onClick={incrementServing}
                          className="absolute right-3 top-1/2 -translate-y-1/2 size-6 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <div className="relative sm:col-span-2">
                        <select
                          value={servingUnit}
                          onChange={(e) => setServingUnit(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-black/20 border-transparent rounded-xl px-4 py-3 font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-[#13ec80]/50 focus:bg-white appearance-none transition-colors cursor-pointer"
                        >
                          <option>
                            {selectedFood.serving} ({selectedFood.servingSize}g)
                          </option>
                          <option>Small (100g)</option>
                          <option>Large (200g)</option>
                          <option>Grams (1g)</option>
                          <option>Ounces (1oz)</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          unfold_more
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                      {t("addToMeal")}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {["breakfast", "lunch", "dinner", "snacks"].map(
                        (meal) => (
                          <label key={meal} className="cursor-pointer group">
                            <input
                              type="radio"
                              name="meal"
                              checked={mealType === meal}
                              onChange={() => setMealType(meal)}
                              className="peer sr-only"
                            />
                            <div className="px-2 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2c24] text-center transition-all peer-checked:border-[#13ec80] peer-checked:bg-[#13ec80]/10 peer-checked:text-[#0fb662] dark:peer-checked:text-[#13ec80] group-hover:border-[#13ec80]/50">
                              <span className="material-symbols-outlined text-lg mb-1 block">
                                {meal === "breakfast" && "light_mode"}
                                {meal === "lunch" && "wb_twilight"}
                                {meal === "dinner" && "dark_mode"}
                                {meal === "snacks" && "cookie"}
                              </span>
                              <span className="text-xs font-bold capitalize">
                                {t(meal)}
                              </span>
                            </div>
                          </label>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a2c24] flex flex-col sm:flex-row justify-between items-center gap-4 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
                <div className="text-left w-full sm:w-auto">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    {t("totalLogged")}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-black text-[#0fb662] dark:text-[#13ec80]">
                      {calculateTotalCalories()}
                    </p>
                    <span className="text-sm font-bold text-gray-500">
                      {t("kcal")}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleClose}
                    className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    onClick={handleAddToDiary}
                    className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl bg-[#111814] text-white dark:bg-[#13ec80] dark:text-[#111814] font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">
                      check_circle
                    </span>
                    {t("addToDiary")}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">
                restaurant_menu
              </span>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                Select a Food Item
              </h3>
              <p className="text-sm text-gray-500">
                Search and select a food from the list to view details and add
                to your diary
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
