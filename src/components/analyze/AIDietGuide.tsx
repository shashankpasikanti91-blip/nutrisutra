/**
 * AI Dietary Guide
 * Generates a personalized evening meal suggestion using OpenRouter.
 * Shown on the Dashboard to help users hit their daily nutrition goals.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = import.meta.env.VITE_OPENROUTER_MODEL || "openai/gpt-4.1-mini";

interface Props {
  caloriesConsumed: number;
  calorieGoal: number;
  proteinConsumed: number;
  carbsConsumed: number;
  fatConsumed: number;
  userGoal?: string; // "weight_loss" | "maintenance" | "muscle_gain"
}

export const AIDietGuide = ({
  caloriesConsumed,
  calorieGoal,
  proteinConsumed,
  carbsConsumed,
  fatConsumed,
  userGoal = "weight_loss",
}: Props) => {
  const [guide, setGuide] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  const remaining = Math.max(0, calorieGoal - caloriesConsumed);
  const hour = new Date().getHours();
  const isEvening = hour >= 17;

  const getGuide = async () => {
    if (!OPENROUTER_API_KEY) {
      setError("AI key not configured.");
      return;
    }
    setLoading(true);
    setError("");
    setGuide("");

    const goalLabel = userGoal === "weight_loss"
      ? "losing weight"
      : userGoal === "muscle_gain"
      ? "building muscle"
      : "maintaining weight";

    const prompt = `You are a certified nutritionist giving a brief, friendly evening meal guide.

User's stats today:
- Calories consumed: ${Math.round(caloriesConsumed)} kcal / ${calorieGoal} kcal goal  
- Remaining budget: ${remaining} kcal
- Protein so far: ${Math.round(proteinConsumed)}g
- Carbs so far: ${Math.round(carbsConsumed)}g
- Fat so far: ${Math.round(fatConsumed)}g
- Goal: ${goalLabel}
- Current time: ${hour}:00

Give a SHORT dinner/evening snack guide (max 120 words). Include:
1. What to eat tonight (2-3 specific food suggestions, include Indian + one other option)
2. Portion size in simple terms (e.g., 1 small bowl, 1 roti)
3. One thing to avoid tonight
4. One encouraging line

Be practical, specific, and warm. No markdown headers. Use bullet points • for suggestions.`;

    try {
      const res = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "NutriSutra",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 220,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      const text: string = data?.choices?.[0]?.message?.content || "";
      setGuide(text.trim());
      setExpanded(true);
    } catch (e) {
      setError("Could not load guide. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">
              {isEvening ? "Tonight's Meal Guide" : "Today's Nutrition Guide"}
            </p>
            <p className="text-xs text-muted-foreground">
              {remaining > 0
                ? `${remaining} kcal remaining · AI-personalized`
                : "Goal reached today · Light options below"}
            </p>
          </div>
        </div>

        {guide ? (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-muted-foreground hover:text-foreground"
          >
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 gap-1 border-primary/30 text-xs"
            onClick={getGuide}
            disabled={loading}
          >
            {loading ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Analysing...</>
            ) : (
              <><Sparkles className="h-3.5 w-3.5" /> Get Guide</>
            )}
          </Button>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-destructive">{error}</p>
      )}

      {guide && expanded && (
        <div className="mt-4 space-y-1 text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
          {guide}
          <div className="mt-3 flex justify-end">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs text-muted-foreground gap-1"
              onClick={getGuide}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
              Refresh
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
