/**
 * Session-based demo store using localStorage
 * Tracks meals and water with full multi-day history, streaks & analytics
 */

import { type NutritionResult } from "./nutrition-engine";
import type { HealthCondition, HealthProfile } from "@/types";
import { userKey, getUserProfileData } from "./auth-store";
import { calculateDailyIntake } from "./intake-calculator";
import type { ActivityLevel, Goal } from "./intake-calculator";

export type MealSlot = "breakfast" | "lunch" | "dinner" | "snacks";

export interface LoggedMeal {
  id: string;
  slot: MealSlot;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: number;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  meals: LoggedMeal[];
  waterGlasses: number;
  calorieGoal: number;
  waterGoal: number; // glasses
}

export interface DaySummary {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  waterGlasses: number;
  calorieGoal: number;
  mealCount: number;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  totalDaysLogged: number;
  goalsMetCount: number;
}

const STORAGE_KEY = "nutrisutra_demo_log";
const GOALS_KEY = "nutrisutra_demo_goals";
const HISTORY_KEY = "nutrisutra_history";
const HEALTH_KEY = "nutrisutra_health_profile";

/** Get a user-scoped storage key */
function sKey(base: string): string { return userKey(base); }

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

// ───────────────────────────────────────
// Health profile
// ───────────────────────────────────────
export function getHealthProfile(): HealthProfile {
  try {
    const raw = localStorage.getItem(sKey(HEALTH_KEY));
    if (raw) return JSON.parse(raw);
  } catch {}
  return { conditions: [] };
}

export function saveHealthProfile(profile: HealthProfile) {
  localStorage.setItem(sKey(HEALTH_KEY), JSON.stringify(profile));
}

export function toggleHealthCondition(condition: HealthCondition): HealthProfile {
  const profile = getHealthProfile();
  const idx = profile.conditions.indexOf(condition);
  if (idx >= 0) {
    profile.conditions.splice(idx, 1);
  } else {
    profile.conditions.push(condition);
  }
  saveHealthProfile(profile);
  return profile;
}

// ───────────────────────────────────────
// Multi-day history
// ───────────────────────────────────────
function getHistory(): Record<string, DailyLog> {
  try {
    const raw = localStorage.getItem(sKey(HISTORY_KEY));
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveHistory(history: Record<string, DailyLog>) {
  localStorage.setItem(sKey(HISTORY_KEY), JSON.stringify(history));
}

/** Archive a day's log into history (called automatically on day change) */
function archiveDay(log: DailyLog) {
  if (log.meals.length === 0 && log.waterGlasses === 0) return;
  const history = getHistory();
  history[log.date] = log;
  saveHistory(history);
}

export function getDailyLog(): DailyLog {
  try {
    const raw = localStorage.getItem(sKey(STORAGE_KEY));
    if (raw) {
      const log: DailyLog = JSON.parse(raw);
      if (log.date === getTodayKey()) return log;
      // Day changed — archive previous day, start fresh
      archiveDay(log);
    }
  } catch {}
  const goals = getSavedGoals();
  return { date: getTodayKey(), meals: [], waterGlasses: 0, calorieGoal: goals.calorieGoal, waterGoal: goals.waterGoal };
}

export function saveDailyLog(log: DailyLog) {
  localStorage.setItem(sKey(STORAGE_KEY), JSON.stringify(log));
  // Also mirror into history for today (keeps history always in sync)
  const history = getHistory();
  history[log.date] = log;
  saveHistory(history);
}

export function addMealToLog(slot: MealSlot, result: NutritionResult): DailyLog {
  const log = getDailyLog();
  log.meals.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    slot,
    foodName: result.foodName,
    calories: result.calories,
    protein: result.protein,
    carbs: result.carbs,
    fat: result.fat,
    timestamp: Date.now(),
  });
  saveDailyLog(log);
  return log;
}

export function removeMealFromLog(mealId: string): DailyLog {
  const log = getDailyLog();
  log.meals = log.meals.filter((m) => m.id !== mealId);
  saveDailyLog(log);
  return log;
}

export function addWater(): DailyLog {
  const log = getDailyLog();
  log.waterGlasses += 1;
  saveDailyLog(log);
  return log;
}

export function removeWater(): DailyLog {
  const log = getDailyLog();
  log.waterGlasses = Math.max(0, log.waterGlasses - 1);
  saveDailyLog(log);
  return log;
}

export function updateGoals(calorieGoal: number, waterGoal: number) {
  const log = getDailyLog();
  log.calorieGoal = calorieGoal;
  log.waterGoal = waterGoal;
  saveDailyLog(log);
  localStorage.setItem(sKey(GOALS_KEY), JSON.stringify({ calorieGoal, waterGoal }));
  return log;
}

export function getSavedGoals(): { calorieGoal: number; waterGoal: number } {
  try {
    const raw = localStorage.getItem(sKey(GOALS_KEY));
    if (raw) return JSON.parse(raw);
  } catch {}
  // No manual goal set yet — compute from user profile
  return computePersonalGoals();
}

/**
 * Compute calorie + water goal from the user's saved profile (weight, height, gender, activity, goal).
 * Falls back to 2000 kcal / 8 glasses if profile is incomplete.
 */
export function computePersonalGoals(): { calorieGoal: number; waterGoal: number } {
  try {
    const profile = getUserProfileData();
    if (profile.weightKg > 0 && profile.heightCm > 0 && profile.age > 0) {
      const goalMap: Record<string, Goal> = {
        weight_loss: "lose",
        muscle_gain: "gain",
        maintenance: "maintain",
        diabetic_friendly: "lose",
      };
      const result = calculateDailyIntake({
        age: profile.age,
        gender: profile.gender ?? "male",
        weightKg: profile.weightKg,
        heightCm: profile.heightCm,
        activity: (profile.activity ?? "light") as ActivityLevel,
        goal: goalMap[profile.goal] ?? "maintain",
      });
      return { calorieGoal: result.calories, waterGoal: result.waterGlasses };
    }
  } catch {}
  return { calorieGoal: 2000, waterGoal: 8 };
}

export function getTotalsBySlot(log: DailyLog) {
  const slots: Record<MealSlot, { calories: number; protein: number; carbs: number; fat: number; count: number }> = {
    breakfast: { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 },
    lunch: { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 },
    dinner: { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 },
    snacks: { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 },
  };

  for (const meal of log.meals) {
    const s = slots[meal.slot];
    s.calories += meal.calories;
    s.protein += meal.protein;
    s.carbs += meal.carbs;
    s.fat += meal.fat;
    s.count += 1;
  }

  return slots;
}

export function getDayTotals(log: DailyLog) {
  return log.meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

// ───────────────────────────────────────
// History & analytics API
// ───────────────────────────────────────

/** Get last N days of logs (including today), newest first */
export function getRecentLogs(days: number = 30): DailyLog[] {
  const history = getHistory();
  const today = getDailyLog();
  history[today.date] = today;

  const sorted = Object.values(history)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, days);

  return sorted;
}

/** Get daily summaries for the last N days */
export function getDailySummaries(days: number = 30): DaySummary[] {
  return getRecentLogs(days).map((log) => {
    const totals = getDayTotals(log);
    return {
      date: log.date,
      calories: Math.round(totals.calories),
      protein: Math.round(totals.protein),
      carbs: Math.round(totals.carbs),
      fat: Math.round(totals.fat),
      waterGlasses: log.waterGlasses,
      calorieGoal: log.calorieGoal,
      mealCount: log.meals.length,
    };
  });
}

/** Get weekly averages */
export function getWeeklyAverage(): { avgCalories: number; avgProtein: number; avgCarbs: number; avgFat: number; avgWater: number } {
  const summaries = getDailySummaries(7);
  if (summaries.length === 0) return { avgCalories: 0, avgProtein: 0, avgCarbs: 0, avgFat: 0, avgWater: 0 };
  const n = summaries.length;
  return {
    avgCalories: Math.round(summaries.reduce((s, d) => s + d.calories, 0) / n),
    avgProtein: Math.round(summaries.reduce((s, d) => s + d.protein, 0) / n),
    avgCarbs: Math.round(summaries.reduce((s, d) => s + d.carbs, 0) / n),
    avgFat: Math.round(summaries.reduce((s, d) => s + d.fat, 0) / n),
    avgWater: Math.round((summaries.reduce((s, d) => s + d.waterGlasses, 0) / n) * 10) / 10,
  };
}

/** Compute streaks */
export function getStreaks(): StreakInfo {
  const history = getHistory();
  const today = getDailyLog();
  history[today.date] = today;

  const dates = Object.keys(history)
    .filter((d) => {
      const log = history[d];
      return log.meals.length > 0;
    })
    .sort();

  const totalDaysLogged = dates.length;
  const goalsMetCount = dates.filter((d) => {
    const log = history[d];
    const totals = getDayTotals(log);
    return totals.calories > 0 && totals.calories <= log.calorieGoal * 1.1;
  }).length;

  if (dates.length === 0) return { currentStreak: 0, longestStreak: 0, totalDaysLogged: 0, goalsMetCount: 0 };

  // Calculate streaks by consecutive dates
  let currentStreak = 0;
  let longestStreak = 0;
  let streak = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
    } else {
      longestStreak = Math.max(longestStreak, streak);
      streak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, streak);

  // Is today (or yesterday) part of the current streak?
  const todayKey = getTodayKey();
  const yesterdayKey = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const lastLogged = dates[dates.length - 1];

  if (lastLogged === todayKey || lastLogged === yesterdayKey) {
    currentStreak = streak;
  } else {
    currentStreak = 0;
  }

  return { currentStreak, longestStreak, totalDaysLogged, goalsMetCount };
}

/** Get most-eaten foods (frequency count) */
export function getFrequentFoods(days: number = 7): Array<{ name: string; count: number; avgCalories: number }> {
  const logs = getRecentLogs(days);
  const map = new Map<string, { count: number; totalCal: number }>();

  for (const log of logs) {
    for (const meal of log.meals) {
      const key = meal.foodName.toLowerCase();
      const existing = map.get(key) || { count: 0, totalCal: 0 };
      existing.count += 1;
      existing.totalCal += meal.calories;
      map.set(key, existing);
    }
  }

  return Array.from(map.entries())
    .map(([name, data]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count: data.count,
      avgCalories: Math.round(data.totalCal / data.count),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}
