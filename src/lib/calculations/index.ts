/**
 * NutriSutra Compound Calculation Engine
 *
 * Takes parsed input (multiple food items) and calculates
 * nutrition for each component deterministically.
 *
 * Uses the existing food database for lookup and applies
 * modifiers (no sugar, oily, homemade, etc.) as multipliers.
 */

import type { ParsedInput, ParsedFoodItem, ComponentResult, AnalysisResult, Modifier } from "@/types";
import { searchFood, type FoodEntry } from "@/lib/food-database";
import { generateNormalizedLabel, generateItemLabel } from "@/lib/parser";

// ═══════════════════════════════════════
// MODIFIER MULTIPLIERS
// ═══════════════════════════════════════

interface ModifierEffect {
  calMult: number;
  fatMult: number;
  carbMult: number;
  sugarMult: number;
}

const MODIFIER_EFFECTS: Partial<Record<Modifier, ModifierEffect>> = {
  no_sugar: { calMult: 0.85, fatMult: 1.0, carbMult: 0.80, sugarMult: 0.0 },
  less_sugar: { calMult: 0.92, fatMult: 1.0, carbMult: 0.90, sugarMult: 0.5 },
  extra_sugar: { calMult: 1.12, fatMult: 1.0, carbMult: 1.15, sugarMult: 1.5 },
  low_oil: { calMult: 0.85, fatMult: 0.65, carbMult: 1.0, sugarMult: 1.0 },
  oily: { calMult: 1.25, fatMult: 1.5, carbMult: 1.0, sugarMult: 1.0 },
  ghee: { calMult: 1.30, fatMult: 1.6, carbMult: 1.0, sugarMult: 1.0 },
  homemade: { calMult: 0.90, fatMult: 0.85, carbMult: 1.0, sugarMult: 1.0 },
  restaurant: { calMult: 1.25, fatMult: 1.4, carbMult: 1.0, sugarMult: 1.0 },
  fried: { calMult: 1.30, fatMult: 1.6, carbMult: 1.0, sugarMult: 1.0 },
  steamed: { calMult: 0.85, fatMult: 0.6, carbMult: 1.0, sugarMult: 1.0 },
  boiled: { calMult: 0.90, fatMult: 0.7, carbMult: 1.0, sugarMult: 1.0 },
  roasted: { calMult: 0.95, fatMult: 0.85, carbMult: 1.0, sugarMult: 1.0 },
  baked: { calMult: 0.92, fatMult: 0.8, carbMult: 1.0, sugarMult: 1.0 },
};

function applyModifiers(
  baseCal: number, baseFat: number, baseCarbs: number, baseSugar: number,
  modifiers: Modifier[]
): { cal: number; fat: number; carbs: number; sugar: number } {
  let cal = baseCal;
  let fat = baseFat;
  let carbs = baseCarbs;
  let sugar = baseSugar;

  for (const mod of modifiers) {
    const effect = MODIFIER_EFFECTS[mod];
    if (effect) {
      cal *= effect.calMult;
      fat *= effect.fatMult;
      carbs *= effect.carbMult;
      sugar *= effect.sugarMult;
    }
  }

  return {
    cal: Math.round(cal),
    fat: Math.round(fat * 10) / 10,
    carbs: Math.round(carbs * 10) / 10,
    sugar: Math.round(sugar * 10) / 10,
  };
}

// ═══════════════════════════════════════
// SERVING SIZE RESOLUTION
// ═══════════════════════════════════════

function resolveServingGrams(
  food: FoodEntry,
  item: ParsedFoodItem
): number {
  // half plate modifier
  if (item.modifiers.includes("half_plate")) {
    const fullPlate = food.servingOptions.find(s =>
      s.label.toLowerCase().includes("plate") || s.label.toLowerCase().includes("full")
    );
    return fullPlate ? fullPlate.grams / 2 : food.defaultServingG / 2;
  }

  // full plate modifier
  if (item.modifiers.includes("full_plate")) {
    const fullPlate = food.servingOptions.find(s =>
      s.label.toLowerCase().includes("plate") || s.label.toLowerCase().includes("full")
    );
    return fullPlate ? fullPlate.grams : food.defaultServingG;
  }

  // Unit-based resolution
  if (item.unit) {
    const unitGrams = resolveUnitGrams(food, item.unit);
    if (unitGrams) return unitGrams * item.quantity;
  }

  // For items with countable names (almonds, seeds), use per-piece logic
  if (isCountableItem(food)) {
    return getPerPieceGrams(food) * item.quantity;
  }

  // Default: quantity multiplied by default serving
  if (item.quantity !== 1) {
    // If quantity > 1, assume they mean individual pieces
    const perPiece = getPerPieceGrams(food);
    if (perPiece < food.defaultServingG) {
      return perPiece * item.quantity;
    }
    return food.defaultServingG * item.quantity;
  }

  return food.defaultServingG;
}

function isCountableItem(food: FoodEntry): boolean {
  const countable = ["ALMONDS", "SUNFLOWER_SEEDS", "IDLI", "VADA", "DUMPLINGS", "SAMOSA"];
  return countable.includes(food.code) ||
    food.servingOptions.some(s => s.label.toLowerCase().includes("piece") || s.label.toLowerCase().includes("almond") || s.label.toLowerCase().includes("seed"));
}

function getPerPieceGrams(food: FoodEntry): number {
  // Find smallest serving option as "per piece"
  const sorted = [...food.servingOptions].sort((a, b) => a.grams - b.grams);
  if (sorted.length > 0) {
    const smallest = sorted[0];
    // Extract count from label like "1 piece (40g)", "5 almonds (14g)"
    const countMatch = smallest.label.match(/^(\d+)/);
    if (countMatch) {
      const count = parseInt(countMatch[1]);
      return smallest.grams / count;
    }
    return smallest.grams;
  }
  return food.defaultServingG;
}

function resolveUnitGrams(food: FoodEntry, unit: string): number | null {
  for (const opt of food.servingOptions) {
    const lower = opt.label.toLowerCase();
    if (unit === "bowl" && lower.includes("bowl")) return opt.grams;
    if (unit === "plate" && lower.includes("plate")) return opt.grams;
    if (unit === "cup" && (lower.includes("cup") || lower.includes("ml"))) return opt.grams;
    if (unit === "glass" && lower.includes("glass")) return opt.grams;
    if (unit === "slice" && lower.includes("slice")) return opt.grams;
    if (unit === "piece" && lower.includes("piece")) return opt.grams;
    if (unit === "tbsp" && lower.includes("tbsp")) return opt.grams;
    if (unit === "tsp") return 5; // ~5g per tsp
  }
  return null;
}

// ═══════════════════════════════════════
// FALLBACK ESTIMATION
// ═══════════════════════════════════════

function estimateUnknownFood(item: ParsedFoodItem): ComponentResult {
  // Rough estimate: 150 cal per serving for unknown food
  const baseCalories = 150;
  const quantity = item.quantity;

  return {
    parsed: item,
    matched: false,
    foodCode: null,
    label: generateItemLabel(item),
    quantityLabel: quantity !== 1 ? `${quantity}×` : "1 serving",
    grams: 200,
    calories: Math.round(baseCalories * quantity),
    protein: Math.round(5 * quantity * 10) / 10,
    carbs: Math.round(20 * quantity * 10) / 10,
    fat: Math.round(5 * quantity * 10) / 10,
    fiber: Math.round(2 * quantity * 10) / 10,
    sugar: Math.round(3 * quantity * 10) / 10,
    sodium: Math.round(300 * quantity),
    estimated: true,
  };
}

// ═══════════════════════════════════════
// COMPONENT CALCULATION
// ═══════════════════════════════════════

function calculateComponent(item: ParsedFoodItem): ComponentResult {
  // Search for food in database
  const results = searchFood(item.name);
  const food = results[0];

  if (!food) {
    return estimateUnknownFood(item);
  }

  // Resolve grams
  const grams = resolveServingGrams(food, item);
  const portionFactor = grams / 100;

  // Base nutrition
  const baseCal = food.calories * portionFactor;
  const baseProtein = food.protein * portionFactor;
  const baseCarbs = food.carbs * portionFactor;
  const baseFat = food.fat * portionFactor;
  const baseFiber = food.fiber * portionFactor;
  const baseSugar = food.sugar * portionFactor;
  const baseSodium = food.sodium * portionFactor;

  // Apply modifiers
  const modified = applyModifiers(baseCal, baseFat, baseCarbs, baseSugar, item.modifiers);

  // Generate display labels
  const quantityParts: string[] = [];
  if (item.quantity !== 1) quantityParts.push(`${item.quantity}`);
  if (item.unit) quantityParts.push(item.unit);
  quantityParts.push(`(${Math.round(grams)}g)`);

  return {
    parsed: item,
    matched: true,
    foodCode: food.code,
    label: generateItemLabel(item),
    quantityLabel: quantityParts.join(" "),
    grams: Math.round(grams),
    calories: modified.cal,
    protein: Math.round(baseProtein * 10) / 10,
    carbs: modified.carbs,
    fat: modified.fat,
    fiber: Math.round(baseFiber * 10) / 10,
    sugar: modified.sugar,
    sodium: Math.round(baseSodium),
    estimated: false,
  };
}

// ═══════════════════════════════════════
// MAIN ANALYSIS FUNCTION
// ═══════════════════════════════════════

export function analyzeInput(parsed: ParsedInput): AnalysisResult {
  if (parsed.items.length === 0) {
    return {
      input: parsed.original,
      normalizedLabel: "",
      components: [],
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 },
      matchedCount: 0,
      estimatedCount: 0,
      confidence: "low",
      notes: ["Please enter a food item to analyze."],
    };
  }

  // Calculate each component
  const components = parsed.items.map(calculateComponent);

  // Calculate totals
  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
  };

  for (const c of components) {
    totals.calories += c.calories;
    totals.protein += c.protein;
    totals.carbs += c.carbs;
    totals.fat += c.fat;
    totals.fiber += c.fiber;
    totals.sugar += c.sugar;
    totals.sodium += c.sodium;
  }

  // Round totals
  totals.calories = Math.round(totals.calories);
  totals.protein = Math.round(totals.protein * 10) / 10;
  totals.carbs = Math.round(totals.carbs * 10) / 10;
  totals.fat = Math.round(totals.fat * 10) / 10;
  totals.fiber = Math.round(totals.fiber * 10) / 10;
  totals.sugar = Math.round(totals.sugar * 10) / 10;
  totals.sodium = Math.round(totals.sodium);

  // Counts
  const matchedCount = components.filter(c => c.matched).length;
  const estimatedCount = components.filter(c => c.estimated).length;

  // Confidence
  let confidence: AnalysisResult["confidence"] = "high";
  if (estimatedCount > 0 && matchedCount > 0) confidence = "medium";
  if (estimatedCount > matchedCount) confidence = "low";
  if (matchedCount === 0) confidence = "low";

  // Notes
  const notes: string[] = [];
  if (estimatedCount > 0 && matchedCount > 0) {
    const estimatedNames = components.filter(c => c.estimated).map(c => c.parsed.name);
    notes.push(`Some items were estimated: ${estimatedNames.join(", ")}. Values are approximate.`);
  }
  if (matchedCount === 0) {
    notes.push("None of the items were found in our database. All values are rough estimates.");
  }
  const modifiedItems = components.filter(c => c.parsed.modifiers.length > 0);
  if (modifiedItems.length > 0) {
    notes.push("Modifier adjustments (e.g., no sugar, oily) have been applied to the calculation.");
  }

  return {
    input: parsed.original,
    normalizedLabel: generateNormalizedLabel(parsed.items),
    components,
    totals,
    matchedCount,
    estimatedCount,
    confidence,
    notes,
  };
}
