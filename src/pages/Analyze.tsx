import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, ArrowRight, X, Camera, Type, Loader2, ImageOff, Zap, ChevronDown, ScanBarcode, Flame, Dumbbell, Scale, Droplet, TrendingUp, TrendingDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { parseInput } from "@/lib/parser";
import { analyzeInput } from "@/lib/calculations";
import { CalorieCard, MacroRow } from "@/components/analyze/CalorieCard";
import { ComponentBreakdown } from "@/components/analyze/ComponentBreakdown";
import { AnalysisNotes } from "@/components/analyze/AnalysisNotes";
import { AddToTracker } from "@/components/analyze/AddToTracker";
import { CameraCapture } from "@/components/analyze/CameraCapture";
import { GoalSelector } from "@/components/analyze/GoalSelector";
import { DecisionCard } from "@/components/analyze/DecisionCard";
import { WhyThisResult } from "@/components/analyze/WhyThisResult";
import { computeDecision } from "@/lib/decision-engine";
import { generateImageHash } from "@/lib/image/hash";
import { getCachedImageResult, setCachedImageResult, clearExpiredImageCache } from "@/lib/image/cache";
import { analyzeImageApi } from "@/lib/api/analyze-image";
import { BarcodeScanner, type BarcodeNutrition } from "@/components/analyze/BarcodeScanner";
import { getHealthProfile, saveHealthProfile } from "@/lib/demo-store";
import type { AnalysisResult, AnalyzeSource, ImageAnalysisStatus, UserGoal, MealDecision, HealthCondition } from "@/types";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const EXAMPLES = [
  "2 idli with sambar and chutney",
  "white coffee with no sugar",
  "coffee with 8 soaked almonds and 10 sunflower seeds",
  "rice with dal and curry",
  "chicken biryani half plate",
  "burger plus fries and coke",
  "3 chapati with dal",
  "filter coffee",
  "masala dosa",
  "buttermilk",
];

const QUICK_PICKS = [
  "Idli + Sambar",
  "Masala Dosa",
  "Chicken Biryani",
  "Coffee",
  "Rice + Dal",
  "Burger + Fries",
];

const Analyze = () => {
  // ── Goal state ──
  const [goal, setGoal] = useState<UserGoal>(() => {
    return (localStorage.getItem("nutrisutra_goal") as UserGoal) || "maintain";
  });

  // ── Shared state ──
  const [mode, setMode] = useState<AnalyzeSource | "barcode">("text");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [decision, setDecision] = useState<MealDecision | null>(null);

  // ── Health conditions state ──
  const [healthConditions, setHealthConditions] = useState<HealthCondition[]>(() => {
    return getHealthProfile().conditions;
  });

  const handleHealthToggle = useCallback((condition: HealthCondition) => {
    setHealthConditions((prev) => {
      const next = prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition];
      saveHealthProfile({ conditions: next });
      if (result) {
        setDecision(computeDecision(result, goal, { healthConditions: next }));
      }
      return next;
    });
  }, [result, goal]);
  const [hasSearched, setHasSearched] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // ── Text mode state ──
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Image mode state ──
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageStatus, setImageStatus] = useState<ImageAnalysisStatus>("idle");
  const [imageMessage, setImageMessage] = useState<string | null>(null);
  const [cachedHit, setCachedHit] = useState(false);

  // Clean expired image cache on mount
  useEffect(() => {
    clearExpiredImageCache();
  }, []);

  // Persist goal and recompute decision when goal changes
  const handleGoalChange = useCallback((newGoal: UserGoal) => {
    setGoal(newGoal);
    localStorage.setItem("nutrisutra_goal", newGoal);
    if (result) {
      setDecision(computeDecision(result, newGoal, { healthConditions }));
    }
  }, [result, healthConditions]);

  // ── Barcode handler ──
  const handleBarcodeResult = useCallback((nutrition: BarcodeNutrition) => {
    const barcodeResult: AnalysisResult = {
      input: nutrition.productName,
      normalizedLabel: `${nutrition.productName}${nutrition.brand ? ` (${nutrition.brand})` : ""}`,
      components: [{
        parsed: { raw: nutrition.productName, name: nutrition.productName, quantity: 1, unit: null, modifiers: [] },
        matched: true,
        foodCode: `BARCODE_${nutrition.barcode}`,
        label: nutrition.productName,
        quantityLabel: "1 serving (100g)",
        grams: 100,
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat,
        fiber: nutrition.fiber,
        sugar: nutrition.sugar,
        sodium: nutrition.sodium,
        estimated: false,
      }],
      totals: {
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat,
        fiber: nutrition.fiber,
        sugar: nutrition.sugar,
        sodium: nutrition.sodium,
      },
      matchedCount: 1,
      estimatedCount: 0,
      confidence: "high",
      notes: [
        `Scanned from barcode: ${nutrition.barcode}`,
        `Source: Open Food Facts database (3M+ products)`,
        nutrition.brand ? `Brand: ${nutrition.brand}` : "",
      ].filter(Boolean),
    };
    setResult(barcodeResult);
    setDecision(computeDecision(barcodeResult, goal, { healthConditions: healthConditions }));
    setHasSearched(true);
    setCachedHit(false);
    setImageMessage(null);
    scrollToResults();
  }, [goal]);

  // Auto-focus text input when switching to text mode
  useEffect(() => {
    if (mode === "text") inputRef.current?.focus();
  }, [mode]);

  const scrollToResults = () => {
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // ── Text analysis ──
  const handleAnalyze = (text?: string) => {
    const query = (text ?? input).trim();
    if (!query) return;

    setInput(query);
    const parsed = parseInput(query);
    const analysis = analyzeInput(parsed);
    setResult(analysis);
    setDecision(computeDecision(analysis, goal, { healthConditions: healthConditions }));
    setHasSearched(true);
    setCachedHit(false);
    setImageMessage(null);
    scrollToResults();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAnalyze();
  };

  const handleClear = () => {
    setInput("");
    setResult(null);
    setDecision(null);
    setHasSearched(false);
    setImageMessage(null);
    inputRef.current?.focus();
  };

  // ── Image analysis ──
  const handleFileSelect = useCallback((file: File | null) => {
    setSelectedFile(file);
    setImageStatus("idle");
    setImageMessage(null);
    // Don't clear previous text results if user was just browsing
  }, []);

  const handleImageAnalyze = useCallback(async () => {
    if (!selectedFile) return;

    try {
      // Step 1: Hash
      setImageStatus("hashing");
      setImageMessage(null);
      const hash = await generateImageHash(selectedFile);

      // Step 2: Check local cache
      const cached = getCachedImageResult(hash);
      if (cached) {
        setImageStatus("cache_hit");
        setResult(cached.analysisResult);
        setDecision(computeDecision(cached.analysisResult, goal, { healthConditions: healthConditions }));
        setHasSearched(true);
        setCachedHit(true);
        setImageMessage("Result loaded from cache — same image was analyzed before.");
        scrollToResults();
        return;
      }

      // Step 3: Call backend API
      setImageStatus("uploading");
      const apiResult = await analyzeImageApi({
        file: selectedFile,
        imageHash: hash,
      });

      // Step 4: Handle not-configured
      if (apiResult.notConfigured) {
        setImageStatus("not_configured");
        setImageMessage(
          "Image AI analysis is not configured yet. Please use text analysis for now."
        );
        return;
      }

      // Step 5: Handle error
      if (apiResult.error) {
        setImageStatus("error");
        setImageMessage(apiResult.error);
        return;
      }

      // Step 6: Process successful response
      if (apiResult.response?.success && apiResult.response.parsed_input) {
        setImageStatus("analyzing");

        // Convert AI detection into our text-based parser flow
        // so the same deterministic engine calculates the result
        const detectedItems = apiResult.response.parsed_input.food_items;
        const textRepresentation = detectedItems
          .map((item) => {
            const parts: string[] = [];
            if (item.quantity > 1) parts.push(String(item.quantity));
            parts.push(item.normalized_food_name || item.food_name);
            return parts.join(" ");
          })
          .join(" and ");

        const parsed = parseInput(textRepresentation);
        const analysis = analyzeInput(parsed);

        // Add image-source note
        analysis.notes.unshift("Detected from uploaded image via AI.");
        if (apiResult.response.parsed_input.cuisine) {
          analysis.notes.push(
            `Detected cuisine: ${apiResult.response.parsed_input.cuisine}`
          );
        }

        // Cache the result (metadata only — no raw image data)
        setCachedImageResult(
          hash,
          {
            name: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size,
          },
          analysis,
          apiResult.response.parsed_input
        );

        setResult(analysis);
        setDecision(computeDecision(analysis, goal, { healthConditions: healthConditions }));
        setHasSearched(true);
        setCachedHit(false);
        setImageStatus("done");
        scrollToResults();
      }
    } catch (err) {
      console.error("[handleImageAnalyze] Error:", err);
      setImageStatus("error");
      setImageMessage("Something went wrong. Please try again or use text analysis.");
    }
  }, [selectedFile]);

  const placeholderExample = useMemo(() => {
    return EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)];
  }, []);

  // Collapsible sections
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container max-w-lg py-4 pb-24 px-4">
        {/* ═══ Compact Header ═══ */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Scan your meal
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Snap a photo or type what you ate
            </p>
          </div>
          {/* Compact goal pills */}
          <div className="flex gap-1">
            {(["lose", "gain", "maintain"] as UserGoal[]).map((g) => (
              <button
                key={g}
                onClick={() => handleGoalChange(g)}
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition-all ${
                  goal === g
                    ? g === "lose" ? "bg-emerald-500 text-white"
                    : g === "gain" ? "bg-amber-500 text-white"
                    : "bg-blue-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {g === "lose" ? <><Flame className="inline h-3 w-3 mr-0.5" /> Lose</> : g === "gain" ? <><Dumbbell className="inline h-3 w-3 mr-0.5" /> Gain</> : <><Scale className="inline h-3 w-3 mr-0.5" /> Keep</>}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ═══ Health Condition Pills ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2.5 flex items-center gap-2 flex-wrap"
        >
          <span className="text-[10px] text-muted-foreground font-medium">Health:</span>
          {([
            { value: "diabetes" as HealthCondition, label: "Diabetes", Icon: Droplet },
            { value: "high_bp" as HealthCondition, label: "High BP", Icon: TrendingUp },
            { value: "low_bp" as HealthCondition, label: "Low BP", Icon: TrendingDown },
          ]).map((c) => (
            <button
              key={c.value}
              onClick={() => handleHealthToggle(c.value)}
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition-all inline-flex items-center gap-1 ${
                healthConditions.includes(c.value)
                  ? "bg-rose-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <c.Icon className="inline h-3 w-3" />
              {c.label}
            </button>
          ))}
        </motion.div>

        {/* ═══ Mode Toggle — 3 tabs ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex rounded-2xl bg-muted/60 p-1"
        >
          <button
            onClick={() => setMode("image")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition-all ${
              mode === "image"
                ? "bg-white dark:bg-card text-primary shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            <Camera className="h-4 w-4" />
            Snap
          </button>
          <button
            onClick={() => setMode("text")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition-all ${
              mode === "text"
                ? "bg-white dark:bg-card text-primary shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            <Type className="h-4 w-4" />
            Type
          </button>
          <button
            onClick={() => setMode("barcode")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition-all ${
              mode === "barcode"
                ? "bg-white dark:bg-card text-amber-600 shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            <ScanBarcode className="h-4 w-4" />
            Scan
          </button>
        </motion.div>

        {/* ═══ Input Area ═══ */}
        <AnimatePresence mode="wait">
          {mode === "text" ? (
            <motion.div
              key="text-mode"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-4"
            >
              {/* Search */}
              <form onSubmit={handleSubmit}>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    placeholder={`Try "${placeholderExample}"`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="h-12 pl-10 pr-10 text-sm rounded-2xl border-border shadow-sm focus:border-primary/40 transition-all"
                  />
                  {input && (
                    <button type="button" onClick={handleClear} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </form>

              {/* Quick picks — compact row */}
              {!hasSearched && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {QUICK_PICKS.map((pick) => (
                    <button
                      key={pick}
                      onClick={() => handleAnalyze(pick)}
                      className="rounded-full bg-primary/8 border border-primary/15 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/15"
                    >
                      {pick}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ) : mode === "image" ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-4 space-y-3"
            >
              {/* Live Camera */}
              <CameraCapture
                onCapture={handleFileSelect}
                disabled={imageStatus === "uploading" || imageStatus === "hashing" || imageStatus === "analyzing"}
              />

              {/* Analyze button */}
              {selectedFile && imageStatus !== "done" && imageStatus !== "cache_hit" && (
                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleImageAnalyze}
                  disabled={imageStatus === "uploading" || imageStatus === "hashing" || imageStatus === "analyzing"}
                  className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 px-4 py-4 text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-60"
                >
                  {(imageStatus === "hashing" || imageStatus === "uploading" || imageStatus === "analyzing") ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Analyze this meal
                    </>
                  )}
                </motion.button>
              )}

              {/* Status messages */}
              <AnimatePresence>
                {imageMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm ${
                      imageStatus === "error"
                        ? "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                        : imageStatus === "cache_hit"
                        ? "bg-primary/5 text-primary"
                        : "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                    }`}
                  >
                    {imageMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Fallback CTA */}
              {(imageStatus === "not_configured" || imageStatus === "error") && (
                <button
                  onClick={() => setMode("text")}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3 text-sm font-medium text-primary transition hover:bg-muted"
                >
                  <Type className="h-4 w-4" />
                  Type your meal instead
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="barcode-mode"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-4"
            >
              <BarcodeScanner onResult={handleBarcodeResult} disabled={false} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ Results ═══ */}
        <AnimatePresence mode="wait">
          {result && decision && hasSearched && (
            <motion.div
              ref={resultRef}
              key={result.input + goal}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-6 space-y-3"
            >
              {/* Hero: Verdict + Calories at a glance */}
              <DecisionCard decision={decision} />

              {/* Calories + Macros — always visible */}
              <CalorieCard result={result} />

              {/* Show more toggle */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-muted/60 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted"
              >
                {showDetails ? "Show less" : "See full breakdown"}
                <ChevronDown className={`h-4 w-4 transition-transform ${showDetails ? "rotate-180" : ""}`} />
              </button>

              {/* Collapsible detailed sections */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3 overflow-hidden"
                  >
                    {/* Extra nutrients */}
                    <MacroRow result={result} />

                    {/* Why this rating */}
                    <WhyThisResult reasons={decision.reasons} />

                    {/* Component Breakdown */}
                    <ComponentBreakdown result={result} />

                    {/* Notes */}
                    <AnalysisNotes result={result} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Add to Tracker — always visible */}
              <AddToTracker result={result} />

              {/* Tracker link */}
              <motion.div
                className="text-center pb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Link
                  to="/demo/tracker"
                  className="inline-flex items-center gap-2 rounded-2xl bg-muted px-5 py-3 text-sm font-medium text-primary transition hover:bg-muted/80"
                >
                  View Daily Tracker <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Analyze;
