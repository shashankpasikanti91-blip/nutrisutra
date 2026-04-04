import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft, Plus, Heart, Lightbulb, AlertTriangle, Leaf, Flame,
  TrendingDown, Shield, Zap, Search, Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { searchFood, type FoodEntry } from "@/lib/food-database";
import {
  STYLE_MULTIPLIERS, type SourceCode,
  getCachedOrCalculate, getMealSizeLabel,
  type NutritionResult,
} from "@/lib/nutrition-engine";
import { addMealToLog, type MealSlot } from "@/lib/demo-store";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const quickSearches = ["Idli", "Dosa", "Biryani", "Burger", "Pizza", "Nasi Lemak", "Fried Rice", "Pasta", "Samosa", "Chapati"];

const FoodResult = () => {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const slotParam = params.get("slot") as MealSlot | null;
  const { toast } = useToast();

  const [searchInput, setSearchInput] = useState(query);
  const [added, setAdded] = useState(false);

  // Find food from database
  const food: FoodEntry | undefined = useMemo(() => {
    if (!query) return undefined;
    const results = searchFood(query);
    return results[0];
  }, [query]);

  // State
  const [sourceCode, setSourceCode] = useState<SourceCode>("SOURCE_RESTAURANT");
  const [mealSize, setMealSize] = useState(50);
  const [selectedServing, setSelectedServing] = useState(0);

  // Calculate result deterministically
  const result: NutritionResult | null = useMemo(() => {
    if (!food) return null;
    const serving = food.servingOptions[selectedServing] ?? food.servingOptions[0];
    return getCachedOrCalculate(food, serving.grams, sourceCode, mealSize);
  }, [food, selectedServing, sourceCode, mealSize]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setParams({ q: searchInput.trim(), ...(slotParam ? { slot: slotParam } : {}) });
      setAdded(false);
      setSelectedServing(0);
      setMealSize(50);
      setSourceCode("SOURCE_RESTAURANT");
    }
  };

  const handleQuickSearch = (food: string) => {
    setSearchInput(food);
    setParams({ q: food, ...(slotParam ? { slot: slotParam } : {}) });
    setAdded(false);
    setSelectedServing(0);
    setMealSize(50);
  };

  const handleAddToLog = () => {
    if (!result) return;
    const slot = slotParam || "lunch";
    addMealToLog(slot, result);
    setAdded(true);
    toast({
      title: "Added to log!",
      description: `${result.foodName} (${result.calories} kcal) added to ${slot}`,
    });
  };

  // Search-only view (no query)
  if (!query || !food) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-2xl py-8">
          <motion.div {...fadeUp}>
            <h1 className="text-2xl font-bold text-foreground">
              {query ? "Food Not Found" : "Search Food"}
            </h1>
            {query && (
              <p className="mt-1 text-sm text-muted-foreground">
                We couldn't find "{query}" in our database yet.
              </p>
            )}
          </motion.div>

          <form onSubmit={handleSearch} className="mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search food — e.g. masala dosa, burger, nasi lemak..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-12 pl-10 text-base"
                autoFocus
              />
            </div>
          </form>

          <div className="mt-6 flex flex-wrap gap-2">
            {quickSearches.map((f) => (
              <button
                key={f}
                onClick={() => handleQuickSearch(f)}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-card"
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const confidenceColor = result!.confidence === "High"
    ? "text-primary bg-primary/10 border-primary/20"
    : result!.confidence === "Medium"
    ? "text-secondary bg-secondary/10 border-secondary/20"
    : "text-destructive bg-destructive/10 border-destructive/20";

  const healthScoreColor = result!.healthScore >= 7
    ? "text-primary"
    : result!.healthScore >= 4
    ? "text-secondary"
    : "text-destructive";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <motion.div
        className="container max-w-2xl py-6 pb-24"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        {/* Search Bar */}
        <motion.div variants={fadeUp}>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search another food..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-11 pl-10 text-sm"
              />
            </div>
          </form>
        </motion.div>

        {/* Header */}
        <motion.div className="mt-5" variants={fadeUp}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{result!.foodName}</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {result!.cuisine} · {result!.category}
                {result!.isVeg && <span className="ml-1.5 inline-block h-3 w-3 rounded-sm border border-primary bg-primary/20" />}
              </p>
            </div>
            <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${confidenceColor}`}>
              {result!.confidence} Confidence
            </span>
          </div>
        </motion.div>

        {/* Serving Options */}
        <motion.div className="mt-5 flex flex-wrap gap-2" variants={fadeUp}>
          {food.servingOptions.map((s, i) => (
            <button
              key={s.label}
              onClick={() => { setSelectedServing(i); setAdded(false); }}
              className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                selectedServing === i
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </motion.div>

        {/* Style Chips — one tap */}
        <motion.div className="mt-3 flex flex-wrap gap-2" variants={fadeUp}>
          {STYLE_MULTIPLIERS.map((s) => (
            <button
              key={s.code}
              onClick={() => { setSourceCode(s.code); setAdded(false); }}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                sourceCode === s.code
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </motion.div>

        {/* Meal Size Slider */}
        <motion.div
          className="mt-4 rounded-xl border border-border bg-card p-4 shadow-card"
          variants={fadeUp}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Meal Size</span>
            <span className="font-semibold text-foreground">
              {getMealSizeLabel(mealSize)} · {result!.servingGrams}g
            </span>
          </div>
          <Slider
            value={[mealSize]}
            onValueChange={([v]) => { setMealSize(v); setAdded(false); }}
            min={0}
            max={100}
            step={5}
            className="mt-3"
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>Light</span>
            <span>Heavy</span>
          </div>
        </motion.div>

        {/* CALORIE HERO CARD */}
        <motion.div
          className="mt-6 overflow-hidden rounded-2xl bg-hero-gradient p-6 text-primary-foreground shadow-card-lg"
          variants={fadeUp}
        >
          <div className="flex items-center gap-2 text-sm font-medium opacity-80">
            <Flame className="h-4 w-4" /> Estimated Calories
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={result!.calories}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mt-2 text-5xl font-extrabold tracking-tight"
            >
              {result!.calories}{" "}
              <span className="text-2xl font-medium opacity-80">kcal</span>
            </motion.p>
          </AnimatePresence>
          <p className="mt-2 text-sm opacity-70">
            Range: {result!.calorieRangeLow}–{result!.calorieRangeHigh} kcal
          </p>
        </motion.div>

        {/* MACROS */}
        <motion.div className="mt-5 grid grid-cols-3 gap-3" variants={fadeUp}>
          {[
            { label: "Protein", value: `${result!.protein}g`, pct: Math.round((result!.protein * 4) / (result!.calories || 1) * 100), color: "text-primary", bgColor: "bg-primary/5", borderColor: "border-primary/15" },
            { label: "Carbs", value: `${result!.carbs}g`, pct: Math.round((result!.carbs * 4) / (result!.calories || 1) * 100), color: "text-secondary", bgColor: "bg-secondary/5", borderColor: "border-secondary/15" },
            { label: "Fat", value: `${result!.fat}g`, pct: Math.round((result!.fat * 9) / (result!.calories || 1) * 100), color: "text-destructive", bgColor: "bg-destructive/5", borderColor: "border-destructive/15" },
          ].map((m) => (
            <motion.div
              key={m.label}
              className={`rounded-xl border ${m.borderColor} ${m.bgColor} p-4 text-center shadow-card`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.15 }}
            >
              <p className={`text-xs font-medium ${m.color}`}>{m.label}</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={m.value}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-2xl font-bold text-card-foreground"
                >
                  {m.value}
                </motion.p>
              </AnimatePresence>
              <p className="mt-0.5 text-xs text-muted-foreground">{m.pct}%</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Extra Nutrients */}
        <motion.div className="mt-3 grid grid-cols-3 gap-3" variants={fadeUp}>
          {[
            { label: "Fiber", value: `${result!.fiber}g` },
            { label: "Sugar", value: `${result!.sugar}g` },
            { label: "Sodium", value: `${result!.sodium}mg` },
          ].map((n) => (
            <div key={n.label} className="rounded-xl border border-border bg-card p-3 text-center shadow-card">
              <p className="text-xs text-muted-foreground">{n.label}</p>
              <p className="mt-0.5 text-lg font-bold text-card-foreground">{n.value}</p>
            </div>
          ))}
        </motion.div>

        {/* HEALTH SCORE */}
        <motion.div className="mt-5 rounded-xl border border-border bg-card p-5 shadow-card" variants={fadeUp}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className={`h-5 w-5 ${healthScoreColor}`} />
              <h3 className="font-bold text-card-foreground">Health Score</h3>
            </div>
            <span className={`text-2xl font-extrabold ${healthScoreColor}`}>
              {result!.healthScore}/10
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {result!.healthTags.map((tag) => (
              <span
                key={tag.label}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  tag.type === "positive" ? "bg-primary/10 text-primary"
                  : tag.type === "warning" ? "bg-destructive/10 text-destructive"
                  : "bg-secondary/10 text-secondary"
                }`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* AI INSIGHT */}
        <motion.div className="mt-4 rounded-xl border border-border bg-card p-5 shadow-card" variants={fadeUp}>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-secondary" />
            <h3 className="font-bold text-card-foreground">AI Insight</h3>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {result!.aiInsight}
          </p>
        </motion.div>

        {/* SUGGESTIONS */}
        {result!.suggestions.length > 0 && (
          <motion.div className="mt-4 rounded-xl border border-border bg-card p-5 shadow-card" variants={fadeUp}>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-card-foreground">Smart Suggestions</h3>
            </div>
            <ul className="mt-3 space-y-2">
              {result!.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <TrendingDown className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* ALTERNATIVES */}
        <motion.div className="mt-4 rounded-xl border border-border bg-card p-5 shadow-card" variants={fadeUp}>
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-card-foreground">Better Alternatives</h3>
          </div>
          <div className="mt-3 space-y-2.5">
            {result!.alternatives.map((alt) => (
              <div key={alt.name} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-card-foreground">{alt.name}</p>
                  <p className="text-xs text-muted-foreground">{alt.reason}</p>
                </div>
                <span className="shrink-0 text-sm font-bold text-primary">~{alt.calories} kcal</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ADD TO LOG */}
        <motion.div className="mt-8" variants={fadeUp}>
          {added ? (
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" size="lg" className="gap-2" disabled>
                <Check className="h-5 w-5 text-primary" /> Added to Log
              </Button>
              <Link to="/demo/tracker">
                <Button variant="hero" size="lg">View Tracker →</Button>
              </Link>
            </div>
          ) : (
            <Button variant="hero" size="lg" className="w-full" onClick={handleAddToLog}>
              <Plus className="mr-2 h-5 w-5" /> Add to {slotParam ? slotParam.charAt(0).toUpperCase() + slotParam.slice(1) : "Meal Log"}
            </Button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FoodResult;
