/**
 * Deterministic Nutrition Calculation Engine
 *
 * Core principle: same input → same output, always.
 * AI is used only for food detection; all calculations are rule-based.
 */

import { type FoodEntry } from "./food-database";

// ═══════════════════════════════════════
// SOURCE / STYLE CODES & MULTIPLIERS
// ═══════════════════════════════════════

export type SourceCode =
  | "SOURCE_HOME"
  | "SOURCE_RESTAURANT"
  | "SOURCE_LOW_OIL"
  | "SOURCE_NORMAL"
  | "SOURCE_OILY"
  | "SOURCE_GHEE_RICH";

export interface StyleMultiplier {
  label: string;
  code: SourceCode;
  calMultiplier: number;
  fatMultiplier: number;
  icon: string;
}

export const STYLE_MULTIPLIERS: StyleMultiplier[] = [
  { label: "Home", code: "SOURCE_HOME", calMultiplier: 1.0, fatMultiplier: 1.0, icon: "🏠" },
  { label: "Restaurant", code: "SOURCE_RESTAURANT", calMultiplier: 1.25, fatMultiplier: 1.4, icon: "🍽️" },
  { label: "Low Oil", code: "SOURCE_LOW_OIL", calMultiplier: 0.85, fatMultiplier: 0.65, icon: "💧" },
  { label: "Normal", code: "SOURCE_NORMAL", calMultiplier: 1.0, fatMultiplier: 1.0, icon: "⚖️" },
  { label: "Oily", code: "SOURCE_OILY", calMultiplier: 1.30, fatMultiplier: 1.6, icon: "🛢️" },
  { label: "Ghee Rich", code: "SOURCE_GHEE_RICH", calMultiplier: 1.35, fatMultiplier: 1.7, icon: "🧈" },
];

// ═══════════════════════════════════════
// MEAL SIZE SCALING
// ═══════════════════════════════════════

// Slider goes 0–100, mapped to 0.5x–1.5x portion
export function getMealSizeMultiplier(sliderValue: number): number {
  // 0 → 0.5, 50 → 1.0, 100 → 1.5
  return 0.5 + (sliderValue / 100);
}

export function getMealSizeLabel(sliderValue: number): string {
  if (sliderValue <= 20) return "Light";
  if (sliderValue <= 40) return "Small";
  if (sliderValue <= 60) return "Regular";
  if (sliderValue <= 80) return "Large";
  return "Heavy";
}

// ═══════════════════════════════════════
// NUTRITION RESULT
// ═══════════════════════════════════════

export interface NutritionResult {
  foodCode: string;
  foodName: string;
  cuisine: string;
  category: string;
  isVeg: boolean;

  // Source input
  sourceCode: SourceCode;
  servingGrams: number;
  mealSizeSlider: number;

  // Final calculated values (deterministic)
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;

  // Range & confidence
  calorieRangeLow: number;
  calorieRangeHigh: number;
  confidence: "High" | "Medium" | "Low";

  // Health analysis
  healthScore: number;
  healthTags: HealthTag[];
  aiInsight: string;
  suggestions: string[];
  alternatives: Alternative[];
}

export interface HealthTag {
  label: string;
  type: "positive" | "warning" | "neutral";
}

export interface Alternative {
  name: string;
  calories: number;
  reason: string;
}

// ═══════════════════════════════════════
// DETERMINISTIC CALCULATION
// ═══════════════════════════════════════

export function calculateNutrition(
  food: FoodEntry,
  servingGrams: number,
  sourceCode: SourceCode,
  mealSizeSlider: number = 50
): NutritionResult {
  const style = STYLE_MULTIPLIERS.find(s => s.code === sourceCode) ?? STYLE_MULTIPLIERS[0];
  const mealMultiplier = getMealSizeMultiplier(mealSizeSlider);
  const effectiveGrams = servingGrams * mealMultiplier;
  const portionFactor = effectiveGrams / 100;

  // Base nutrition scaled by portion
  const baseCal = food.calories * portionFactor;
  const baseProtein = food.protein * portionFactor;
  const baseCarbs = food.carbs * portionFactor;
  const baseFat = food.fat * portionFactor;
  const baseFiber = food.fiber * portionFactor;
  const baseSugar = food.sugar * portionFactor;
  const baseSodium = food.sodium * portionFactor;

  // Apply style multipliers
  const calories = Math.round(baseCal * style.calMultiplier);
  const protein = Math.round(baseProtein * 10) / 10;
  const carbs = Math.round(baseCarbs * style.calMultiplier * 10) / 10;
  const fat = Math.round(baseFat * style.fatMultiplier * 10) / 10;
  const fiber = Math.round(baseFiber * 10) / 10;
  const sugar = Math.round(baseSugar * 10) / 10;
  const sodium = Math.round(baseSodium * style.calMultiplier);

  // Confidence based on food category complexity
  const confidence = getConfidence(food);

  // Calorie range
  const rangeFactor = confidence === "High" ? 0.08 : confidence === "Medium" ? 0.15 : 0.22;
  const calorieRangeLow = Math.round(calories * (1 - rangeFactor));
  const calorieRangeHigh = Math.round(calories * (1 + rangeFactor));

  // Health analysis
  const healthScore = computeHealthScore(calories, protein, carbs, fat, fiber, sugar, sodium, effectiveGrams);
  const healthTags = computeHealthTags(calories, protein, carbs, fat, fiber, sugar, sodium, effectiveGrams);
  const aiInsight = generateInsight(food, calories, protein, carbs, fat, style);
  const suggestions = generateSuggestions(food, calories, protein, carbs, fat, fiber, sugar, sodium, style);
  const alternatives = generateAlternatives(food);

  return {
    foodCode: food.code,
    foodName: food.name,
    cuisine: food.cuisine,
    category: food.category,
    isVeg: food.isVeg,
    sourceCode,
    servingGrams: Math.round(effectiveGrams),
    mealSizeSlider,
    calories,
    protein,
    carbs,
    fat,
    fiber,
    sugar,
    sodium,
    calorieRangeLow,
    calorieRangeHigh,
    confidence,
    healthScore,
    healthTags,
    aiInsight,
    suggestions,
    alternatives,
  };
}

// ═══════════════════════════════════════
// CONFIDENCE LOGIC
// ═══════════════════════════════════════

function getConfidence(food: FoodEntry): "High" | "Medium" | "Low" {
  // Simple items → high confidence
  const highConfidence = ["Breakfast", "Bread", "Side", "Drink"];
  if (highConfidence.includes(food.category)) return "High";

  // Complex mixed dishes → medium
  const mediumConfidence = ["Rice", "Curry", "Noodles", "Main"];
  if (mediumConfidence.includes(food.category)) return "Medium";

  // Everything else
  return "Medium";
}

// ═══════════════════════════════════════
// HEALTH SCORE (1-10)
// ═══════════════════════════════════════

function computeHealthScore(
  cal: number, protein: number, carbs: number, fat: number,
  fiber: number, sugar: number, sodium: number, grams: number
): number {
  let score = 5;

  // Protein is good
  const proteinPer100 = (protein / grams) * 100;
  if (proteinPer100 > 12) score += 1.5;
  else if (proteinPer100 > 8) score += 0.5;
  else if (proteinPer100 < 3) score -= 0.5;

  // Fiber is good
  const fiberPer100 = (fiber / grams) * 100;
  if (fiberPer100 > 3) score += 1;
  else if (fiberPer100 > 1.5) score += 0.5;

  // High sugar is bad
  const sugarPer100 = (sugar / grams) * 100;
  if (sugarPer100 > 15) score -= 2;
  else if (sugarPer100 > 8) score -= 1;

  // High sodium is bad
  const sodiumPer100 = (sodium / grams) * 100;
  if (sodiumPer100 > 600) score -= 1.5;
  else if (sodiumPer100 > 400) score -= 0.5;

  // High fat ratio
  const fatCals = fat * 9;
  if (cal > 0 && fatCals / cal > 0.45) score -= 1;

  // Very high calorie density
  const calPer100 = (cal / grams) * 100;
  if (calPer100 > 350) score -= 1;
  else if (calPer100 < 150) score += 0.5;

  return Math.max(1, Math.min(10, Math.round(score)));
}

// ═══════════════════════════════════════
// HEALTH TAGS
// ═══════════════════════════════════════

function computeHealthTags(
  cal: number, protein: number, carbs: number, fat: number,
  fiber: number, sugar: number, sodium: number, grams: number
): HealthTag[] {
  const tags: HealthTag[] = [];

  const proteinCals = protein * 4;
  const carbCals = carbs * 4;
  const fatCals = fat * 9;
  const totalMacroCals = proteinCals + carbCals + fatCals || 1;

  if (carbCals / totalMacroCals > 0.55) tags.push({ label: "High Carb", type: "warning" });
  if (fatCals / totalMacroCals > 0.40) tags.push({ label: "High Fat", type: "warning" });
  if (proteinCals / totalMacroCals > 0.25) tags.push({ label: "Good Protein", type: "positive" });
  else if (proteinCals / totalMacroCals < 0.12) tags.push({ label: "Low Protein", type: "warning" });

  if (fiber > 4) tags.push({ label: "Fiber Rich", type: "positive" });
  if (sugar > 15) tags.push({ label: "High Sugar", type: "warning" });
  if (sodium > 600) tags.push({ label: "High Sodium", type: "warning" });
  else if (sodium > 400) tags.push({ label: "Moderate Sodium", type: "neutral" });

  if (cal < 300) tags.push({ label: "Low Calorie", type: "positive" });

  return tags.slice(0, 4);
}

// ═══════════════════════════════════════
// AI INSIGHT (deterministic template)
// ═══════════════════════════════════════

function generateInsight(
  food: FoodEntry,
  cal: number, protein: number, carbs: number, fat: number,
  style: StyleMultiplier
): string {
  const parts: string[] = [];

  const carbPct = carbs * 4 / (cal || 1) * 100;
  const fatPct = fat * 9 / (cal || 1) * 100;

  if (carbPct > 55) {
    parts.push("This meal is carb-heavy");
  }
  if (fatPct > 40) {
    parts.push(parts.length ? "and high in fat" : "This meal is high in fat");
    if (style.code === "SOURCE_RESTAURANT" || style.code === "SOURCE_OILY") {
      parts.push(`due to ${style.label.toLowerCase()} preparation`);
    }
  }
  if (protein < 10) {
    parts.push((parts.length ? ". Protein is low" : "Protein content is low") + " — consider adding eggs, paneer, dal, or chicken");
  } else if (protein > 25) {
    parts.push(parts.length ? ". Good protein content" : "Good protein content for muscle maintenance");
  }

  if (parts.length === 0) {
    parts.push("This is a balanced meal with moderate macros");
  }

  return parts.join(" ") + ".";
}

// ═══════════════════════════════════════
// SUGGESTIONS
// ═══════════════════════════════════════

function generateSuggestions(
  food: FoodEntry,
  cal: number, protein: number, carbs: number, fat: number,
  fiber: number, sugar: number, sodium: number,
  style: StyleMultiplier
): string[] {
  const suggestions: string[] = [];

  if (cal > 500) suggestions.push("Reduce portion size for fewer calories");
  if (protein < 12) suggestions.push("Add a protein source like eggs, curd, or chicken");
  if (fat > 20 && style.code !== "SOURCE_LOW_OIL") suggestions.push("Try the low-oil variant for less fat");
  if (fiber < 2) suggestions.push("Pair with a fiber-rich side like vegetables or salad");
  if (sugar > 12) suggestions.push("Opt for less sugar or a sugar-free version");
  if (style.code === "SOURCE_RESTAURANT") suggestions.push("Homemade version has ~20% fewer calories");
  if (food.tags.includes("deep-fried")) suggestions.push("Choose grilled or baked for a healthier option");

  return suggestions.slice(0, 3);
}

// ═══════════════════════════════════════
// ALTERNATIVES
// ═══════════════════════════════════════

function generateAlternatives(food: FoodEntry): Alternative[] {
  const altMap: Record<string, Alternative[]> = {
    Rice: [
      { name: "Brown Rice + Dal", calories: 280, reason: "More fiber, balanced protein" },
      { name: "Quinoa Bowl", calories: 240, reason: "Higher protein, lower carbs" },
      { name: "Curd Rice", calories: 210, reason: "Lighter, probiotic benefits" },
    ],
    Main: [
      { name: "Grilled Chicken Salad", calories: 280, reason: "High protein, low carb" },
      { name: "Wrap with veggies", calories: 320, reason: "More fiber, balanced" },
    ],
    Noodles: [
      { name: "Zucchini Noodles", calories: 120, reason: "Very low calorie, low carb" },
      { name: "Rice Noodle Soup", calories: 220, reason: "Lighter broth-based option" },
    ],
    Snack: [
      { name: "Baked version", calories: Math.round(food.calories * 0.65), reason: "Less oil absorbed" },
      { name: "Air-fried option", calories: Math.round(food.calories * 0.55), reason: "Minimal oil needed" },
    ],
    Dessert: [
      { name: "Greek Yogurt + Honey", calories: 150, reason: "Protein-rich, less sugar" },
      { name: "Fresh Fruit Bowl", calories: 80, reason: "Natural sugars, fiber" },
    ],
    Drink: [
      { name: "Black Coffee", calories: 5, reason: "Near-zero calories" },
      { name: "Green Tea", calories: 2, reason: "Antioxidants, zero sugar" },
    ],
    Breakfast: [
      { name: "Idli (steamed)", calories: 105, reason: "Low fat, easy to digest" },
      { name: "Oats Porridge", calories: 170, reason: "Fiber-rich, sustained energy" },
    ],
    Bread: [
      { name: "Whole Wheat Roti", calories: 110, reason: "No frying, more fiber" },
      { name: "Multi-grain Wrap", calories: 130, reason: "Balanced nutrients" },
    ],
    Curry: [
      { name: "Dal Soup", calories: 120, reason: "Lighter, protein-rich" },
      { name: "Steamed Vegetables", calories: 80, reason: "Very low calorie" },
    ],
    Side: [
      { name: "Steamed Vegetables", calories: 50, reason: "Minimal calories" },
    ],
    Protein: [
      { name: "Tofu Stir Fry", calories: 180, reason: "Plant-based protein" },
    ],
    Seafood: [
      { name: "Grilled Fish", calories: 150, reason: "Lean protein, omega-3" },
    ],
  };

  return altMap[food.category] || [
    { name: "Lighter homemade version", calories: Math.round(food.calories * 0.7), reason: "Less oil and seasoning" },
  ];
}

// ═══════════════════════════════════════
// INPUT-BASED CACHE KEY (for future DB caching)
// ═══════════════════════════════════════

export function generateCacheKey(
  foodCode: string,
  servingGrams: number,
  sourceCode: SourceCode,
  mealSizeSlider: number
): string {
  return `${foodCode}|${servingGrams}|${sourceCode}|${mealSizeSlider}`;
}

// Simple in-memory cache
const resultCache = new Map<string, NutritionResult>();

export function getCachedOrCalculate(
  food: FoodEntry,
  servingGrams: number,
  sourceCode: SourceCode,
  mealSizeSlider: number
): NutritionResult {
  const key = generateCacheKey(food.code, servingGrams, sourceCode, mealSizeSlider);
  
  const cached = resultCache.get(key);
  if (cached) return cached;

  const result = calculateNutrition(food, servingGrams, sourceCode, mealSizeSlider);
  resultCache.set(key, result);
  return result;
}
