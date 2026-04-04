/**
 * Deterministic Daily Intake Calculator
 * Uses Mifflin-St Jeor equation for BMR
 */

export type Gender = "male" | "female";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
export type Goal = "lose" | "maintain" | "gain";

export interface IntakeInput {
  age: number;
  gender: Gender;
  weightKg: number;
  heightCm: number;
  activity: ActivityLevel;
  goal: Goal;
}

export interface IntakeResult {
  bmr: number;
  tdee: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  waterLiters: number;
  waterGlasses: number;
}

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  lose: -500,
  maintain: 0,
  gain: 400,
};

export function calculateDailyIntake(input: IntakeInput): IntakeResult {
  // Mifflin-St Jeor BMR
  const bmr =
    input.gender === "male"
      ? 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age + 5
      : 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age - 161;

  const tdee = Math.round(bmr * ACTIVITY_MULTIPLIERS[input.activity]);
  const calories = Math.max(1200, Math.round(tdee + GOAL_ADJUSTMENTS[input.goal]));

  // Macro split based on goal
  let proteinPct: number, carbsPct: number, fatPct: number;
  if (input.goal === "lose") {
    proteinPct = 0.35;
    carbsPct = 0.35;
    fatPct = 0.30;
  } else if (input.goal === "gain") {
    proteinPct = 0.30;
    carbsPct = 0.45;
    fatPct = 0.25;
  } else {
    proteinPct = 0.25;
    carbsPct = 0.50;
    fatPct = 0.25;
  }

  const protein = Math.round((calories * proteinPct) / 4);
  const carbs = Math.round((calories * carbsPct) / 4);
  const fat = Math.round((calories * fatPct) / 9);

  // Water: ~33ml per kg body weight
  const waterLiters = Math.round(input.weightKg * 0.033 * 10) / 10;
  const waterGlasses = Math.round(waterLiters / 0.25);

  return {
    bmr: Math.round(bmr),
    tdee,
    calories,
    protein,
    carbs,
    fat,
    waterLiters,
    waterGlasses,
  };
}

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentary (desk job)",
  light: "Lightly Active (1-2 days/week)",
  moderate: "Moderately Active (3-5 days/week)",
  active: "Active (6-7 days/week)",
  very_active: "Very Active (athlete/manual labor)",
};

export const GOAL_LABELS: Record<Goal, string> = {
  lose: "Lose Weight",
  maintain: "Maintain Weight",
  gain: "Gain Weight / Muscle",
};
