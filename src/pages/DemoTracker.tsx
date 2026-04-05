import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Flame, Drumstick, Wheat, Droplets, Plus, Trash2, Search,
  Sun, Coffee, Moon, Cookie, TrendingUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  getDailyLog, removeMealFromLog, addWater, removeWater,
  getTotalsBySlot, getDayTotals, getSavedGoals,
  type MealSlot, type DailyLog,
} from "@/lib/demo-store";

const SLOT_META: Record<MealSlot, { label: string; icon: typeof Sun }> = {
  breakfast: { label: "Breakfast", icon: Coffee },
  lunch: { label: "Lunch", icon: Sun },
  dinner: { label: "Dinner", icon: Moon },
  snacks: { label: "Snacks", icon: Cookie },
};

const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

const DemoTracker = () => {
  const [log, setLog] = useState<DailyLog>(getDailyLog());
  const goals = getSavedGoals();

  useEffect(() => {
    setLog(getDailyLog());
  }, []);

  const totals = getDayTotals(log);
  const slotTotals = getTotalsBySlot(log);
  const calorieGoal = log.calorieGoal || goals.calorieGoal;
  const remaining = Math.max(0, calorieGoal - totals.calories);
  const progress = Math.min((totals.calories / calorieGoal) * 100, 100);

  const handleRemoveMeal = (id: string) => {
    setLog(removeMealFromLog(id));
  };

  const handleAddWater = () => setLog(addWater());
  const handleRemoveWater = () => setLog(removeWater());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl py-8 pb-20">
        <motion.div {...fadeUp}>
          <h1 className="text-2xl font-bold text-foreground">Today's Tracker</h1>
          <p className="text-sm text-muted-foreground">Demo mode — data stored in your browser</p>
        </motion.div>

        {/* Calorie Summary */}
        <motion.div
          className="mt-6 overflow-hidden rounded-2xl bg-hero-gradient p-6 text-primary-foreground shadow-card-lg"
          {...fadeUp}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-80">Consumed</p>
              <p className="text-4xl font-extrabold">{totals.calories} <span className="text-lg opacity-70">kcal</span></p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium opacity-80">Remaining</p>
              <p className="text-2xl font-bold">{remaining} <span className="text-sm opacity-70">kcal</span></p>
            </div>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-primary-foreground/20">
            <motion.div
              className="h-full rounded-full bg-primary-foreground/80"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="mt-2 text-xs opacity-60">Goal: {calorieGoal} kcal/day</p>
        </motion.div>

        {/* Macro Summary Row */}
        <motion.div className="mt-4 grid grid-cols-3 gap-3" {...fadeUp} transition={{ delay: 0.15 }}>
          {[
            { label: "Protein", value: `${Math.round(totals.protein)}g`, icon: Drumstick, color: "text-primary" },
            { label: "Carbs", value: `${Math.round(totals.carbs)}g`, icon: Wheat, color: "text-secondary" },
            { label: "Fat", value: `${Math.round(totals.fat)}g`, icon: Droplets, color: "text-destructive" },
          ].map((m) => (
            <div key={m.label} className="rounded-xl border border-border bg-card p-3 text-center shadow-card">
              <m.icon className={`mx-auto h-4 w-4 ${m.color}`} />
              <p className="mt-1 text-lg font-bold text-card-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Water Quick */}
        <motion.div
          className="mt-4 flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-card"
          {...fadeUp}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <Droplets className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-bold text-card-foreground">Water</p>
              <p className="text-xs text-muted-foreground">{log.waterGlasses} / {log.waterGoal || goals.waterGoal} glasses</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={handleRemoveWater} disabled={log.waterGlasses === 0}>
              <span className="text-lg">−</span>
            </Button>
            <Button variant="default" size="icon" className="h-8 w-8 rounded-full" onClick={handleAddWater}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Meal Slots */}
        <div className="mt-8 space-y-5">
          {(Object.entries(SLOT_META) as [MealSlot, typeof SLOT_META.breakfast][]).map(([slot, meta]) => {
            const slotData = slotTotals[slot];
            const slotMeals = log.meals.filter((m) => m.slot === slot);

            return (
              <motion.div key={slot} {...fadeUp} transition={{ delay: 0.25 }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <meta.icon className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-foreground">{meta.label}</h3>
                    {slotData.count > 0 && (
                      <span className="text-xs text-muted-foreground">{slotData.calories} kcal</span>
                    )}
                  </div>
                  <Link to={`/app/food?slot=${slot}`}>
                    <Button variant="outline" size="sm" className="gap-1 rounded-full">
                      <Plus className="h-3 w-3" /> Add
                    </Button>
                  </Link>
                </div>

                {slotMeals.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {slotMeals.map((meal) => (
                      <div
                        key={meal.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2.5 shadow-card"
                      >
                        <div>
                          <p className="text-sm font-medium text-card-foreground">{meal.foodName}</p>
                          <p className="text-xs text-muted-foreground">
                            P: {meal.protein}g · C: {meal.carbs}g · F: {meal.fat}g
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-foreground">{meal.calories} kcal</span>
                          <button
                            onClick={() => handleRemoveMeal(meal.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 rounded-lg border border-dashed border-border bg-muted/30 py-4 text-center">
                    <p className="text-xs text-muted-foreground">No meals logged yet</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Quick Search CTA */}
        <motion.div className="mt-10" {...fadeUp}>
          <Link to="/app/food">
            <Button variant="hero" size="lg" className="w-full">
              <Search className="mr-2 h-5 w-5" /> Search & Analyze Food
            </Button>
          </Link>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default DemoTracker;
