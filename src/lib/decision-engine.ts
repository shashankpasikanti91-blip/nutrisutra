/**
 * Decision engine — pure functions, no React.
 *
 * Takes an AnalysisResult + UserGoal and returns an actionable
 * MealDecision: verdict, reasoning, and suggestions.
 */

import type { AnalysisResult, UserGoal, MealDecision, Verdict, HealthCondition, HealthAlert } from "@/types";
import { getFoodByCode } from "@/lib/food-database";

// ── Thresholds (per-meal, not daily) ──
const CALORIE_THRESHOLDS = {
  lose:     { good: 400, moderate: 600 },
  gain:     { good: 700, moderate: 450 },   // inverted — high cal is good
  maintain: { good: 550, moderate: 700 },
};

// ── Night meal config ──
const NIGHT_HOUR_START = 20; // 8 PM
const NIGHT_MAX_CAL = 400;

function isNightTime(): boolean {
  return new Date().getHours() >= NIGHT_HOUR_START;
}

function computeHealthAlerts(
  totals: AnalysisResult["totals"],
  conditions: HealthCondition[]
): HealthAlert[] {
  const alerts: HealthAlert[] = [];

  for (const condition of conditions) {
    switch (condition) {
      case "diabetes": {
        if (totals.sugar > 10) {
          alerts.push({
            condition: "diabetes",
            severity: totals.sugar > 20 ? "danger" : "warning",
            message: `High sugar (${Math.round(totals.sugar)}g) — risky for blood sugar spikes`,
            suggestion: "Choose low-GI alternatives: replace white rice with brown rice, skip sweetened drinks",
          });
        }
        if (totals.carbs > 60) {
          alerts.push({
            condition: "diabetes",
            severity: totals.carbs > 80 ? "danger" : "warning",
            message: `High carbs (${Math.round(totals.carbs)}g) — may raise blood glucose`,
            suggestion: "Reduce portion of rice/roti by half, add more dal or vegetables",
          });
        }
        if (totals.fiber < 3 && totals.calories > 200) {
          alerts.push({
            condition: "diabetes",
            severity: "info",
            message: "Low fiber — fiber slows sugar absorption",
            suggestion: "Add salad, sabzi, or a handful of nuts to slow glucose release",
          });
        }
        break;
      }
      case "high_bp": {
        if (totals.sodium > 400) {
          alerts.push({
            condition: "high_bp",
            severity: totals.sodium > 800 ? "danger" : "warning",
            message: `High sodium (${Math.round(totals.sodium)}mg) — not safe for blood pressure`,
            suggestion: "Skip papad, pickles, extra salt. Use lemon or herbs for flavour instead",
          });
        }
        if (totals.fat > 20) {
          alerts.push({
            condition: "high_bp",
            severity: "warning",
            message: "High fat content — saturated fat can worsen BP",
            suggestion: "Choose steamed, boiled or tandoor items over fried",
          });
        }
        break;
      }
      case "low_bp": {
        if (totals.sodium < 200 && totals.calories > 150) {
          alerts.push({
            condition: "low_bp",
            severity: "info",
            message: "Low sodium — people with low BP may need adequate salt intake",
            suggestion: "Small amounts of salted buttermilk or lemon water can help",
          });
        }
        if (totals.calories < 200) {
          alerts.push({
            condition: "low_bp",
            severity: "warning",
            message: "Very light meal — low BP patients should eat regular, balanced meals",
            suggestion: "Don't skip meals. Add a banana or a handful of almonds",
          });
        }
        break;
      }
    }
  }
  return alerts;
}

function computeNightWarning(totals: AnalysisResult["totals"], mealSlot?: string): string | null {
  const isDinner = mealSlot === "dinner" || isNightTime();
  if (!isDinner) return null;

  if (totals.calories > NIGHT_MAX_CAL) {
    return `Heavy dinner (${Math.round(totals.calories)} kcal). Eating lighter at night aids digestion and sleep. Try keeping dinner under ${NIGHT_MAX_CAL} kcal.`;
  }
  if (totals.fat > 25) {
    return "High-fat meals at night are harder to digest. Consider lighter options like dal-rice, khichdi, or soup.";
  }
  return null;
}

export interface DecisionOptions {
  healthConditions?: HealthCondition[];
  mealSlot?: string;
}

export function computeDecision(result: AnalysisResult, goal: UserGoal, options?: DecisionOptions): MealDecision {
  const { totals, components } = result;
  const reasons: string[] = [];
  const suggestions: string[] = [];

  // ── Macro percentages of calories ──
  const totalCal = totals.calories || 1;
  const proteinPct = Math.round((totals.protein * 4) / totalCal * 100);
  const carbPct = Math.round((totals.carbs * 4) / totalCal * 100);
  const fatPct = Math.round((totals.fat * 9) / totalCal * 100);

  // ── Verdict from calories ──
  const thresholds = CALORIE_THRESHOLDS[goal];
  let verdict: Verdict;

  if (goal === "gain") {
    // For weight gain: higher cal is better
    if (totals.calories >= thresholds.good) verdict = "good";
    else if (totals.calories >= thresholds.moderate) verdict = "moderate";
    else verdict = "avoid";
  } else {
    if (totals.calories <= thresholds.good) verdict = "good";
    else if (totals.calories <= thresholds.moderate) verdict = "moderate";
    else verdict = "avoid";
  }

  // ── Reasons ──
  // Protein
  if (proteinPct < 15) {
    reasons.push("Low protein content");
    suggestions.push("Add a boiled egg or dal for protein");
  } else if (proteinPct >= 25) {
    reasons.push("Good protein content");
  }

  // Carbs
  if (carbPct > 60) {
    reasons.push("High carb ratio");
    if (goal === "lose") suggestions.push("Reduce rice or bread portion by 30%");
  }

  // Fat
  if (fatPct > 40) {
    reasons.push("High fat content");
    suggestions.push("Choose steamed or grilled over fried");
  }

  // Sugar
  if (totals.sugar > 15) {
    reasons.push("High sugar detected");
    if (goal === "lose") suggestions.push("Switch to no-sugar or half-sugar version");
  }

  // Fiber
  if (totals.fiber < 2 && totals.calories > 200) {
    reasons.push("Low fiber content");
    suggestions.push("Add vegetables or a side salad");
  }

  // Sodium
  if (totals.sodium > 600) {
    reasons.push("High sodium");
  }

  // Cooking-style hints from modifiers
  const hasFried = components.some(c =>
    c.parsed.modifiers.includes("fried") || c.parsed.modifiers.includes("oily")
  );
  if (hasFried && !reasons.includes("High fat content")) {
    reasons.push("Fried cooking style");
    if (goal === "lose") suggestions.push("Opt for steamed or baked alternatives");
  }

  // Goal-specific calorie advice
  if (goal === "lose" && totals.calories > 500) {
    suggestions.push(`This meal is ${totals.calories} kcal — consider splitting into smaller portions`);
  }
  if (goal === "gain" && totals.calories < 400) {
    suggestions.push("Add ghee, nuts, or a protein shake to boost calories");
  }

  // ── Headline ──
  const headlines: Record<UserGoal, Record<Verdict, string>> = {
    lose: {
      good: "Great choice for weight loss",
      moderate: "Okay in smaller portion",
      avoid: "Not ideal for your goal",
    },
    gain: {
      good: "Solid pick for weight gain",
      moderate: "Add more to hit your target",
      avoid: "Too light for your goal",
    },
    maintain: {
      good: "Well balanced meal",
      moderate: "Watch the portion size",
      avoid: "Consider a lighter option",
    },
  };

  // ── Cuisine detection from matched food codes ──
  let cuisine: string | null = null;
  for (const comp of components) {
    if (comp.foodCode) {
      const entry = getFoodByCode(comp.foodCode);
      if (entry?.cuisine) {
        cuisine = entry.cuisine;
        break;
      }
    }
  }

  const mealName = result.normalizedLabel;

  // ── Health condition alerts ──
  const healthAlerts = computeHealthAlerts(totals, options?.healthConditions ?? []);

  // ── Night meal warning ──
  const nightMealWarning = computeNightWarning(totals, options?.mealSlot);

  // Downgrade verdict if health alerts are severe
  const hasDanger = healthAlerts.some(a => a.severity === "danger");
  if (hasDanger && verdict === "good") {
    verdict = "moderate";
  }

  return {
    verdict,
    headline: headlines[goal][verdict],
    reasons: reasons.length > 0 ? reasons : ["Balanced macro profile"],
    suggestions: suggestions.slice(0, 3), // max 3
    cuisine,
    mealName,
    healthAlerts,
    nightMealWarning,
  };
}
