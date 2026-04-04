import { motion } from "framer-motion";
import { Check, HelpCircle } from "lucide-react";
import type { AnalysisResult } from "@/types";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

interface ComponentBreakdownProps {
  result: AnalysisResult;
}

export function ComponentBreakdown({ result }: ComponentBreakdownProps) {
  if (result.components.length <= 1) return null;

  return (
    <motion.div
      className="rounded-2xl border border-border bg-card p-4 shadow-card"
      {...fadeUp}
    >
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Component Breakdown</h3>
      <div className="space-y-2">
        {result.components.map((comp, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl bg-muted/40 px-3.5 py-3"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {comp.matched ? (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-3 w-3 text-primary" />
                </div>
              ) : (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                  <HelpCircle className="h-3 w-3 text-amber-500" />
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {comp.label}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {comp.quantityLabel}
                  {comp.estimated && " · estimated"}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0 ml-3">
              <p className="text-sm font-semibold text-foreground">
                {comp.calories} <span className="text-xs font-normal text-muted-foreground">kcal</span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                P:{comp.protein}g · C:{comp.carbs}g · F:{comp.fat}g
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
