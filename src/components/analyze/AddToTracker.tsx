import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Check, Coffee, Sun, Moon, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addMealToLog, type MealSlot } from "@/lib/demo-store";
import type { AnalysisResult } from "@/types";
import type { NutritionResult } from "@/lib/nutrition-engine";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

const SLOTS: { value: MealSlot; label: string; Icon: typeof Sun }[] = [
  { value: "breakfast", label: "Breakfast", Icon: Coffee },
  { value: "lunch", label: "Lunch", Icon: Sun },
  { value: "dinner", label: "Dinner", Icon: Moon },
  { value: "snacks", label: "Snacks", Icon: Cookie },
];

interface AddToTrackerProps {
  result: AnalysisResult;
}

export function AddToTracker({ result }: AddToTrackerProps) {
  const [selectedSlot, setSelectedSlot] = useState<MealSlot>("lunch");
  const [added, setAdded] = useState(false);
  const { toast } = useToast();

  const handleAdd = () => {
    // Convert AnalysisResult totals to NutritionResult shape for the log
    const fakeResult: NutritionResult = {
      foodCode: "COMPOUND",
      foodName: result.normalizedLabel,
      cuisine: "",
      category: "",
      isVeg: true,
      sourceCode: "SOURCE_HOME",
      servingGrams: 0,
      mealSizeSlider: 50,
      calories: result.totals.calories,
      protein: result.totals.protein,
      carbs: result.totals.carbs,
      fat: result.totals.fat,
      fiber: result.totals.fiber,
      sugar: result.totals.sugar,
      sodium: result.totals.sodium,
      calorieRangeLow: 0,
      calorieRangeHigh: 0,
      confidence: "High",
      healthScore: 5,
      healthTags: [],
      aiInsight: "",
      suggestions: [],
      alternatives: [],
    };

    addMealToLog(selectedSlot, fakeResult);
    setAdded(true);
    toast({
      title: "Added to tracker!",
      description: `${result.totals.calories} kcal added to ${selectedSlot}`,
    });
  };

  return (
    <motion.div
      className="rounded-2xl border border-border bg-card p-5 shadow-card"
      {...fadeUp}
    >
      <h3 className="text-sm font-bold text-card-foreground">Add to Daily Tracker</h3>

      <div className="mt-3 flex flex-wrap gap-2">
        {SLOTS.map((slot) => (
          <button
            key={slot.value}
            onClick={() => { setSelectedSlot(slot.value); setAdded(false); }}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              selectedSlot === slot.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            <slot.Icon className="h-3 w-3" />
            {slot.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {added ? (
          <Button variant="outline" className="w-full gap-2" disabled>
            <Check className="h-4 w-4 text-primary" /> Added to {selectedSlot}
          </Button>
        ) : (
          <Button onClick={handleAdd} className="w-full gap-2">
            <Plus className="h-4 w-4" /> Add {result.totals.calories} kcal to {selectedSlot}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
