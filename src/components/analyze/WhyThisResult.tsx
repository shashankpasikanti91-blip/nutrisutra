import { motion } from "framer-motion";
import { AlertCircle, Flame, Wheat, Droplets, Candy, Zap, CheckCircle2, Leaf, Drumstick } from "lucide-react";
import type { MealDecision } from "@/types";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

const REASON_CONFIG: Record<string, { icon: typeof Flame; positive: boolean }> = {
  "High carb ratio": { icon: Wheat, positive: false },
  "High fat content": { icon: Droplets, positive: false },
  "High sugar detected": { icon: Candy, positive: false },
  "Fried cooking style": { icon: Flame, positive: false },
  "High sodium": { icon: Zap, positive: false },
  "Low protein content": { icon: Drumstick, positive: false },
  "Low fiber content": { icon: Leaf, positive: false },
  "Good protein content": { icon: Drumstick, positive: true },
  "Balanced macro profile": { icon: CheckCircle2, positive: true },
};

interface WhyThisResultProps {
  reasons: string[];
}

export function WhyThisResult({ reasons }: WhyThisResultProps) {
  if (reasons.length === 0) return null;

  return (
    <motion.div
      className="rounded-2xl border border-border bg-card p-4 shadow-card"
      {...fadeUp}
    >
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
        Why this rating
      </h4>
      <div className="space-y-1">
        {reasons.map((reason, i) => {
          const cfg = REASON_CONFIG[reason];
          const Icon = cfg?.icon || AlertCircle;
          const isPositive = cfg?.positive ?? (reason.toLowerCase().includes("good") || reason.toLowerCase().includes("balanced"));

          return (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5"
            >
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                isPositive
                  ? "bg-emerald-100 dark:bg-emerald-900/40"
                  : "bg-amber-100 dark:bg-amber-900/40"
              }`}>
                <Icon className={`h-3.5 w-3.5 ${
                  isPositive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`} />
              </div>
              <span className="text-sm font-medium text-foreground">
                {reason}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
