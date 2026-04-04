import { motion, AnimatePresence } from "framer-motion";
import { Flame, Drumstick, Wheat, Droplets } from "lucide-react";
import type { AnalysisResult } from "@/types";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

// ── SVG Donut Ring ──
function MacroRing({ pct, color, size = 56, stroke = 5 }: { pct: number; color: string; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(pct, 100) / 100) * circ;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        className="text-muted/30"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </svg>
  );
}

// ── Horizontal Macro Bar ──
function MacroBar({ label, value, unit, pct, color, barColor }: { label: string; value: number; unit: string; pct: number; color: string; barColor: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${color}`}>{label}</span>
        <span className="text-xs font-semibold text-foreground">{value}{unit} <span className="text-muted-foreground font-normal">({pct}%)</span></span>
      </div>
      <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

interface CalorieCardProps {
  result: AnalysisResult;
}

export function CalorieCard({ result }: CalorieCardProps) {
  const { totals, confidence } = result;

  const confidenceBadge = {
    high: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
    medium: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
    low: "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400",
  }[confidence];

  const confidenceLabel = {
    high: "High Confidence",
    medium: "Partial Match",
    low: "Estimated",
  }[confidence];

  const proteinPct = Math.round((totals.protein * 4) / (totals.calories || 1) * 100);
  const carbsPct = Math.round((totals.carbs * 4) / (totals.calories || 1) * 100);
  const fatPct = Math.round((totals.fat * 9) / (totals.calories || 1) * 100);

  return (
    <motion.div
      className="rounded-2xl border border-border bg-card p-5 shadow-card"
      {...fadeUp}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nutrition</span>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${confidenceBadge}`}>
          {confidenceLabel}
        </span>
      </div>

      {/* Calorie Hero + Macro Bars */}
      <div className="flex items-start gap-5">
        {/* Donut */}
        <div className="relative shrink-0">
          <MacroRing pct={Math.min((totals.calories / 800) * 100, 100)} color="#22C55E" size={80} stroke={6} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={totals.calories}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-xl font-bold text-foreground leading-none"
              >
                {totals.calories}
              </motion.span>
            </AnimatePresence>
            <span className="text-[10px] font-medium text-muted-foreground">kcal</span>
          </div>
        </div>

        {/* Bars */}
        <div className="flex-1 space-y-3">
          <MacroBar label="Protein" value={totals.protein} unit="g" pct={proteinPct} color="text-emerald-600 dark:text-emerald-400" barColor="bg-emerald-500" />
          <MacroBar label="Carbs" value={totals.carbs} unit="g" pct={carbsPct} color="text-amber-600 dark:text-amber-400" barColor="bg-amber-500" />
          <MacroBar label="Fat" value={totals.fat} unit="g" pct={fatPct} color="text-red-500 dark:text-red-400" barColor="bg-red-500" />
        </div>
      </div>
    </motion.div>
  );
}

interface MacroRowProps {
  result: AnalysisResult;
}

export function MacroRow({ result }: MacroRowProps) {
  const { totals } = result;

  return (
    <motion.div className="grid grid-cols-3 gap-2" {...fadeUp}>
      {[
        { label: "Fiber", value: `${totals.fiber}g`, Icon: Drumstick, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
        { label: "Sugar", value: `${totals.sugar}g`, Icon: Wheat, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30" },
        { label: "Sodium", value: `${totals.sodium}mg`, Icon: Droplets, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
      ].map((m) => (
        <div
          key={m.label}
          className={`rounded-2xl border border-border ${m.bg} p-3 text-center`}
        >
          <m.Icon className={`mx-auto h-3.5 w-3.5 ${m.color}`} />
          <p className="mt-1 text-base font-bold text-foreground">{m.value}</p>
          <p className="text-[10px] font-medium text-muted-foreground">{m.label}</p>
        </div>
      ))}
    </motion.div>
  );
}
