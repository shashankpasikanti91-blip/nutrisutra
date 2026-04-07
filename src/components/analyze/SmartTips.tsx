/**
 * SmartTips — Rich health analysis panel shown after every food analysis.
 * Generates intelligent, food-specific tips based on macros, health tags,
 * modifiers, and user goal.
 */
import { motion } from "framer-motion";
import {
  Lightbulb, CheckCircle2, AlertTriangle, Flame, Leaf, Droplets,
  Zap, Heart, Clock, TrendingUp, ShieldCheck, Info,
} from "lucide-react";
import type { AnalysisResult, UserGoal } from "@/types";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

interface Tip {
  icon: typeof Lightbulb;
  text: string;
  type: "good" | "warn" | "info";
}

function buildTips(result: AnalysisResult, goal: UserGoal): Tip[] {
  const tips: Tip[] = [];
  const { totals, components } = result;

  const totalCal = totals.calories;
  const hasFried = components.some(c =>
    c.parsed.modifiers.includes("fried") || c.parsed.modifiers.includes("oily")
  );
  const hasHomemade = components.some(c => c.parsed.modifiers.includes("homemade"));
  const hasGhee = components.some(c => c.parsed.modifiers.includes("ghee"));
  const hasSteamed = components.some(c => c.parsed.modifiers.includes("steamed"));
  const carbPct = totalCal > 0 ? (totals.carbs * 4) / totalCal * 100 : 0;
  const fatPct = totalCal > 0 ? (totals.fat * 9) / totalCal * 100 : 0;
  const proteinPct = totalCal > 0 ? (totals.protein * 4) / totalCal * 100 : 0;

  // ── Positive detections ──
  if (totals.protein >= 20) {
    tips.push({ icon: ShieldCheck, text: `High protein (${Math.round(totals.protein)}g) — great for muscle recovery and keeping you full longer`, type: "good" });
  } else if (totals.protein >= 12) {
    tips.push({ icon: ShieldCheck, text: `Decent protein (${Math.round(totals.protein)}g) — supports muscle maintenance`, type: "good" });
  }

  if (totals.fiber >= 5) {
    tips.push({ icon: Leaf, text: `Rich in fiber (${Math.round(totals.fiber)}g) — aids digestion and helps control blood sugar`, type: "good" });
  } else if (totals.fiber >= 3) {
    tips.push({ icon: Leaf, text: `Good fiber content (${Math.round(totals.fiber)}g) — supports gut health`, type: "good" });
  }

  if (hasSteamed && !hasFried) {
    tips.push({ icon: CheckCircle2, text: "Steamed cooking — minimal oil absorbed, preserves nutrients well", type: "good" });
  }

  if (hasHomemade) {
    tips.push({ icon: Heart, text: "Homemade — typically 15-25% fewer calories than restaurant versions, with less hidden oil", type: "good" });
  }

  if (totalCal < 300 && totalCal > 50) {
    tips.push({ icon: TrendingUp, text: `Light meal at ${Math.round(totalCal)} kcal — leaves room for balanced snacks or sides`, type: "good" });
  }

  if (totals.sodium < 200 && totalCal > 100) {
    tips.push({ icon: CheckCircle2, text: "Low sodium — heart-friendly choice, good for blood pressure management", type: "good" });
  }

  // ── Warnings ──
  if (hasFried) {
    tips.push({ icon: Flame, text: "Fried food absorbs significant oil — consider air-frying or baking to cut calories by 30-40%", type: "warn" });
  }

  if (hasGhee) {
    tips.push({ icon: Droplets, text: "Contains ghee — rich in healthy fats but calorie-dense; 1 tsp ghee = ~45 kcal", type: "info" });
  }

  if (carbPct > 65) {
    tips.push({ icon: AlertTriangle, text: `High carb ratio (${Math.round(carbPct)}% of calories) — balance with protein like dal, curd, or a boiled egg`, type: "warn" });
  }

  if (fatPct > 45) {
    tips.push({ icon: AlertTriangle, text: `Fat-heavy meal (${Math.round(fatPct)}% fat calories) — pair with vegetable sides to balance the meal`, type: "warn" });
  }

  if (totals.sugar > 20) {
    tips.push({ icon: Zap, text: `High sugar (${Math.round(totals.sugar)}g) — may cause a blood sugar spike; follow with a walk or light activity`, type: "warn" });
  } else if (totals.sugar > 10) {
    tips.push({ icon: Zap, text: `Moderate sugar (${Math.round(totals.sugar)}g) — opt for no-sugar version if available`, type: "info" });
  }

  if (totals.sodium > 800) {
    tips.push({ icon: AlertTriangle, text: `Very high sodium (${Math.round(totals.sodium)}mg) — limit salty sides today; drink extra water`, type: "warn" });
  } else if (totals.sodium > 500) {
    tips.push({ icon: Info, text: `Moderate-high sodium (${Math.round(totals.sodium)}mg) — skip pickles/papad with this meal`, type: "info" });
  }

  if (totals.protein < 8 && totalCal > 200) {
    tips.push({ icon: AlertTriangle, text: `Low protein (${Math.round(totals.protein)}g) — add curd, dal, eggs, or paneer to make this more filling and nutritious`, type: "warn" });
  }

  if (totals.fiber < 2 && totalCal > 200) {
    tips.push({ icon: Leaf, text: "Low fiber — add a small salad, sabzi, or a handful of seeds to improve gut health", type: "info" });
  }

  // ── Goal-specific tips ──
  if (goal === "lose") {
    if (totalCal > 600) {
      tips.push({ icon: Clock, text: `At ${Math.round(totalCal)} kcal this is a sizeable meal — consider splitting it or reducing portion size by 25%`, type: "warn" });
    } else if (totalCal < 250) {
      tips.push({ icon: Info, text: "Very light — make sure you're eating enough throughout the day to avoid overeating later", type: "info" });
    }
    if (proteinPct >= 25) {
      tips.push({ icon: TrendingUp, text: "High protein ratio — excellent for weight loss as protein keeps you fuller longer", type: "good" });
    }
  } else if (goal === "gain") {
    if (totalCal < 400) {
      tips.push({ icon: TrendingUp, text: `Only ${Math.round(totalCal)} kcal — add healthy calorie boosters: nuts, ghee, banana, or a protein shake`, type: "info" });
    }
    if (totals.protein >= 25) {
      tips.push({ icon: ShieldCheck, text: "Excellent protein for muscle building — eat within 30 min of workout for best results", type: "good" });
    }
  } else {
    if (totalCal >= 400 && totalCal <= 650 && proteinPct >= 15) {
      tips.push({ icon: CheckCircle2, text: "Well-balanced meal — good calorie range with adequate protein for maintenance", type: "good" });
    }
  }

  // Deduplicate and limit to 4 tips
  return tips.slice(0, 4);
}

interface SmartTipsProps {
  result: AnalysisResult;
  goal: UserGoal;
}

export function SmartTips({ result, goal }: SmartTipsProps) {
  const tips = buildTips(result, goal);
  if (tips.length === 0) return null;

  const colorMap = {
    good: {
      bg: "bg-emerald-50 dark:bg-emerald-950/25",
      border: "border-emerald-100 dark:border-emerald-900/40",
      icon: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
      text: "text-emerald-800 dark:text-emerald-300",
    },
    warn: {
      bg: "bg-amber-50 dark:bg-amber-950/25",
      border: "border-amber-100 dark:border-amber-900/40",
      icon: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-100 dark:bg-amber-900/40",
      text: "text-amber-800 dark:text-amber-300",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-950/25",
      border: "border-blue-100 dark:border-blue-900/40",
      icon: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
      text: "text-blue-800 dark:text-blue-300",
    },
  };

  return (
    <motion.div
      className="rounded-2xl border border-border bg-card shadow-card overflow-hidden"
      {...fadeUp}
    >
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/40">
            <Lightbulb className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Smart Analysis & Tips
          </span>
        </div>
        <div className="space-y-2">
          {tips.map((tip, i) => {
            const c = colorMap[tip.type];
            const Icon = tip.icon;
            return (
              <div
                key={i}
                className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 ${c.bg} ${c.border}`}
              >
                <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${c.iconBg}`}>
                  <Icon className={`h-3.5 w-3.5 ${c.icon}`} />
                </div>
                <p className={`text-[13px] leading-snug ${c.text}`}>{tip.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
