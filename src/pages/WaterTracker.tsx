import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Plus, Minus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDailyLog, addWater, removeWater, getSavedGoals } from "@/lib/demo-store";

const WaterTracker = () => {
  const [glasses, setGlasses] = useState(0);
  const goals = getSavedGoals();
  const target = goals.waterGoal || 8;
  const litersTarget = Math.round(target * 0.25 * 10) / 10;

  useEffect(() => {
    setGlasses(getDailyLog().waterGlasses);
  }, []);

  const handleAdd = () => {
    const log = addWater();
    setGlasses(log.waterGlasses);
  };

  const handleRemove = () => {
    const log = removeWater();
    setGlasses(log.waterGlasses);
  };

  const progress = Math.min((glasses / target) * 100, 100);
  const litersConsumed = Math.round(glasses * 0.25 * 10) / 10;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-md py-8 pb-20 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Droplets className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-3 text-2xl font-bold text-foreground">Water Tracker</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Target: {litersTarget}L ({target} glasses)
          </p>
        </motion.div>

        {/* Ring progress */}
        <motion.div
          className="relative mx-auto mt-10 h-56 w-56"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" strokeWidth="8" className="stroke-muted" />
            <motion.circle
              cx="60" cy="60" r="52" fill="none" strokeWidth="8"
              className="stroke-primary"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 52}
              animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - progress / 100) }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={glasses}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-4xl font-extrabold text-foreground"
              >
                {glasses}
              </motion.span>
            </AnimatePresence>
            <span className="text-sm text-muted-foreground">of {target} glasses</span>
            <span className="text-xs text-muted-foreground">{litersConsumed}L / {litersTarget}L</span>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full"
            onClick={handleRemove}
            disabled={glasses === 0}
          >
            <Minus className="h-5 w-5" />
          </Button>
          <Button
            variant="hero"
            size="icon"
            className="h-20 w-20 rounded-full text-lg"
            onClick={handleAdd}
          >
            <Plus className="h-8 w-8" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full opacity-40 cursor-not-allowed"
            disabled
            title="Reminders coming soon"
          >
            <Bell className="h-5 w-5" />
          </Button>
        </motion.div>

        <p className="mt-3 text-xs text-muted-foreground">Tap + to log a glass (250ml)</p>

        {/* Status message */}
        <motion.div
          className="mt-8 rounded-xl border border-border bg-card p-4 shadow-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {progress >= 100 ? (
            <p className="text-sm font-medium text-primary">You've reached your daily water goal! Great job!</p>
          ) : progress >= 50 ? (
            <p className="text-sm font-medium text-muted-foreground">
              You're halfway there! {target - glasses} more glasses to go.
            </p>
          ) : (
            <p className="text-sm font-medium text-muted-foreground">
              Stay hydrated! {target - glasses} glasses remaining today.
            </p>
          )}
        </motion.div>

        {/* Reminder placeholder */}
        <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/30 p-4">
          <Bell className="mx-auto h-5 w-5 text-muted-foreground" />
          <p className="mt-2 text-xs text-muted-foreground">
            Water reminders coming soon — set hourly nudges to stay on track.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WaterTracker;
