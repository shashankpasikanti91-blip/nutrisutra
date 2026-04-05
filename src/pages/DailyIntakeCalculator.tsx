import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Calculator, Flame, Drumstick, Wheat, Droplets, ArrowRight, Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  calculateDailyIntake,
  ACTIVITY_LABELS, GOAL_LABELS,
  type Gender, type ActivityLevel, type Goal, type IntakeResult,
} from "@/lib/intake-calculator";
import { updateGoals } from "@/lib/demo-store";

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };

const DailyIntakeCalculator = () => {
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState<Gender>("male");
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<Goal>("maintain");
  const [result, setResult] = useState<IntakeResult | null>(null);

  const handleCalculate = () => {
    const r = calculateDailyIntake({ age, gender, weightKg: weight, heightCm: height, activity, goal });
    setResult(r);
    updateGoals(r.calories, r.waterGlasses);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl py-8 pb-20">
        <motion.div {...fadeUp}>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Daily Intake Calculator</h1>
              <p className="text-sm text-muted-foreground">Personalized calorie & macro targets</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="mt-8 space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          {/* Gender */}
          <div>
            <label className="text-sm font-medium text-foreground">Gender</label>
            <div className="mt-2 flex gap-3">
              {(["male", "female"] as Gender[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 rounded-xl border py-3 text-sm font-medium transition-all ${
                    gender === g
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {g === "male" ? "Male" : "Female"}
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <div>
            <div className="flex justify-between">
              <label className="text-sm font-medium text-foreground">Age</label>
              <span className="text-sm font-bold text-primary">{age} years</span>
            </div>
            <Slider value={[age]} onValueChange={([v]) => setAge(v)} min={14} max={80} step={1} className="mt-3" />
          </div>

          {/* Weight */}
          <div>
            <div className="flex justify-between">
              <label className="text-sm font-medium text-foreground">Weight</label>
              <span className="text-sm font-bold text-primary">{weight} kg</span>
            </div>
            <Slider value={[weight]} onValueChange={([v]) => setWeight(v)} min={30} max={200} step={1} className="mt-3" />
          </div>

          {/* Height */}
          <div>
            <div className="flex justify-between">
              <label className="text-sm font-medium text-foreground">Height</label>
              <span className="text-sm font-bold text-primary">{height} cm</span>
            </div>
            <Slider value={[height]} onValueChange={([v]) => setHeight(v)} min={120} max={220} step={1} className="mt-3" />
          </div>

          {/* Activity */}
          <div>
            <label className="text-sm font-medium text-foreground">Activity Level</label>
            <div className="mt-2 space-y-2">
              {(Object.entries(ACTIVITY_LABELS) as [ActivityLevel, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActivity(key)}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                    activity === key
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div>
            <label className="text-sm font-medium text-foreground">Your Goal</label>
            <div className="mt-2 flex gap-3">
              {(Object.entries(GOAL_LABELS) as [Goal, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setGoal(key)}
                  className={`flex-1 rounded-xl border py-3 text-center text-sm font-medium transition-all ${
                    goal === key
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Calculate */}
          <Button variant="hero" size="lg" className="w-full" onClick={handleCalculate}>
            <Sparkles className="mr-2 h-5 w-5" /> Calculate My Daily Intake
          </Button>
        </motion.div>

        {/* Result */}
        {result && (
          <motion.div
            className="mt-8 space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Calorie Target */}
            <div className="overflow-hidden rounded-2xl bg-hero-gradient p-6 text-primary-foreground shadow-card-lg">
              <div className="flex items-center gap-2 text-sm font-medium opacity-80">
                <Flame className="h-4 w-4" /> Daily Calorie Target
              </div>
              <p className="mt-2 text-5xl font-extrabold tracking-tight">
                {result.calories} <span className="text-2xl font-medium opacity-80">kcal</span>
              </p>
              <p className="mt-2 text-sm opacity-70">
                BMR: {result.bmr} kcal · TDEE: {result.tdee} kcal
              </p>
            </div>

            {/* Macros */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Protein", value: `${result.protein}g`, icon: Drumstick, color: "text-primary", bg: "bg-primary/5", border: "border-primary/15" },
                { label: "Carbs", value: `${result.carbs}g`, icon: Wheat, color: "text-secondary", bg: "bg-secondary/5", border: "border-secondary/15" },
                { label: "Fat", value: `${result.fat}g`, icon: Droplets, color: "text-destructive", bg: "bg-destructive/5", border: "border-destructive/15" },
              ].map((m) => (
                <div key={m.label} className={`rounded-xl border ${m.border} ${m.bg} p-4 text-center shadow-card`}>
                  <m.icon className={`mx-auto h-5 w-5 ${m.color}`} />
                  <p className="mt-1 text-2xl font-bold text-card-foreground">{m.value}</p>
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>

            {/* Water */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-card-foreground">Daily Water Target</h3>
              </div>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {result.waterLiters}L <span className="text-lg font-medium text-muted-foreground">({result.waterGlasses} glasses)</span>
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/demo/tracker" className="flex-1">
                <Button variant="hero" size="lg" className="w-full">
                  <ArrowRight className="mr-2 h-4 w-4" /> Start Tracking
                </Button>
              </Link>
              <Link to="/demo/water" className="flex-1">
                <Button variant="hero-outline" size="lg" className="w-full">
                  <Droplets className="mr-2 h-4 w-4" /> Track Water
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DailyIntakeCalculator;
