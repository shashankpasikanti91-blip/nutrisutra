import { motion } from "framer-motion";
import { ThumbsUp, AlertTriangle, XCircle, Lightbulb, CheckCircle2, MapPin, Heart, Moon, ShieldAlert } from "lucide-react";
import type { MealDecision, HealthAlert } from "@/types";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

const CUISINE_FLAGS: Record<string, string> = {
  "South Indian": "🇮🇳",
  "Indian": "🇮🇳",
  "Andhra": "🇮🇳",
  "Telangana": "🇮🇳",
  "North Indian": "🇮🇳",
  "Malaysian": "🇲🇾",
  "Chinese": "🇨🇳",
  "Singaporean": "🇸🇬",
  "Western": "🌍",
  "Italian": "🇮🇹",
  "American": "🇺🇸",
  "Japanese": "🇯🇵",
  "Thai": "🇹🇭",
  "Korean": "🇰🇷",
  "Mexican": "🇲🇽",
};

const VERDICT_STYLES = {
  good: {
    bg: "bg-emerald-500",
    softBg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-100 dark:border-emerald-900/40",
    icon: ThumbsUp,
    textColor: "text-emerald-700 dark:text-emerald-400",
    pillBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    label: "Good for your goal",
    emoji: "🟢",
  },
  moderate: {
    bg: "bg-amber-500",
    softBg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-100 dark:border-amber-900/40",
    icon: AlertTriangle,
    textColor: "text-amber-700 dark:text-amber-400",
    pillBg: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    label: "Okay in moderation",
    emoji: "🟡",
  },
  avoid: {
    bg: "bg-red-500",
    softBg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-100 dark:border-red-900/40",
    icon: XCircle,
    textColor: "text-red-700 dark:text-red-400",
    pillBg: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    label: "Not ideal for your goal",
    emoji: "🔴",
  },
};

interface DecisionCardProps {
  decision: MealDecision;
}

export function DecisionCard({ decision }: DecisionCardProps) {
  const style = VERDICT_STYLES[decision.verdict];
  const VerdictIcon = style.icon;
  const flag = decision.cuisine ? CUISINE_FLAGS[decision.cuisine] : null;

  return (
    <motion.div
      className={`overflow-hidden rounded-2xl border ${style.border} bg-card shadow-card-lg`}
      {...fadeUp}
    >
      {/* ── Verdict Header ── */}
      <div className={`${style.softBg} px-5 py-4`}>
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${style.bg}`}>
            <VerdictIcon className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold ${style.textColor}`}>
              {style.emoji} {style.label}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {decision.headline}
            </p>
          </div>
        </div>
      </div>

      {/* ── Meal Info ── */}
      <div className="px-5 py-4">
        <h3 className="text-lg font-bold text-foreground leading-snug">
          {decision.mealName}
        </h3>
        {decision.cuisine && (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1">
            {flag && <span className="text-xs">{flag}</span>}
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="text-[11px] font-medium text-muted-foreground">
              {decision.cuisine}
            </span>
          </div>
        )}

        {/* ── Reason Tags ── */}
        {decision.reasons.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {decision.reasons.map((reason, i) => {
              const isPositive = reason.toLowerCase().includes("good") || reason.toLowerCase().includes("balanced");
              return (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    isPositive ? style.pillBg : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  }`}
                >
                  {isPositive ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <AlertTriangle className="h-3 w-3" />
                  )}
                  {reason}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Suggestions ── */}
      {decision.suggestions.length > 0 && (
        <div className="border-t border-border px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2.5">
            Suggestions
          </p>
          <div className="space-y-2">
            {decision.suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                <span className="text-sm text-muted-foreground leading-snug">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Health Condition Alerts ── */}
      {decision.healthAlerts && decision.healthAlerts.length > 0 && (
        <div className="border-t border-border px-5 py-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2.5">
            <Heart className="h-3.5 w-3.5 text-rose-500" /> Health Alerts
          </p>
          <div className="space-y-2.5">
            {decision.healthAlerts.map((alert, i) => {
              const severityStyles = {
                info: "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800",
                warning: "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800",
                danger: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800",
              };
              const conditionLabels: Record<string, string> = {
                diabetes: "🩸 Diabetes",
                high_bp: "📈 High BP",
                low_bp: "📉 Low BP",
              };
              return (
                <div key={i} className={`rounded-xl border p-3 ${severityStyles[alert.severity]}`}>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className={`h-3.5 w-3.5 shrink-0 ${alert.severity === "danger" ? "text-red-500" : alert.severity === "warning" ? "text-amber-500" : "text-blue-500"}`} />
                    <span className="text-[11px] font-bold">{conditionLabels[alert.condition] ?? alert.condition}</span>
                  </div>
                  <p className="mt-1 text-xs text-foreground leading-relaxed">{alert.message}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">💡 {alert.suggestion}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Night Meal Warning ── */}
      {decision.nightMealWarning && (
        <div className="border-t border-border px-5 py-4">
          <div className="flex items-start gap-2.5 rounded-xl border border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950/30 p-3">
            <Moon className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
            <div>
              <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400">🌙 Night Meal Advisory</p>
              <p className="mt-1 text-xs text-foreground leading-relaxed">{decision.nightMealWarning}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
