import { motion } from "framer-motion";
import type { UserGoal } from "@/types";

const GOALS: { value: UserGoal; label: string; emoji: string; description: string; activeBg: string; activeBorder: string; activeText: string }[] = [
  {
    value: "lose", label: "Lose Weight", emoji: "🔥", description: "Calorie deficit",
    activeBg: "bg-emerald-50 dark:bg-emerald-950/40",
    activeBorder: "border-emerald-500",
    activeText: "text-emerald-700 dark:text-emerald-400",
  },
  {
    value: "gain", label: "Gain Weight", emoji: "💪", description: "Calorie surplus",
    activeBg: "bg-amber-50 dark:bg-amber-950/40",
    activeBorder: "border-amber-500",
    activeText: "text-amber-700 dark:text-amber-400",
  },
  {
    value: "maintain", label: "Maintain", emoji: "⚖️", description: "Stay balanced",
    activeBg: "bg-blue-50 dark:bg-blue-950/40",
    activeBorder: "border-blue-500",
    activeText: "text-blue-700 dark:text-blue-400",
  },
];

interface GoalSelectorProps {
  selected: UserGoal;
  onChange: (goal: UserGoal) => void;
}

export function GoalSelector({ selected, onChange }: GoalSelectorProps) {
  return (
    <div className="flex gap-2">
      {GOALS.map((goal) => {
        const active = selected === goal.value;
        return (
          <motion.button
            key={goal.value}
            whileTap={{ scale: 0.96 }}
            onClick={() => onChange(goal.value)}
            className={`flex flex-1 items-center justify-center gap-2.5 rounded-2xl border-2 px-3 py-3.5 text-center transition-all duration-200 ${
              active
                ? `${goal.activeBorder} ${goal.activeBg} shadow-sm`
                : "border-transparent bg-muted/60 hover:bg-muted"
            }`}
          >
            <span className="text-xl" role="img" aria-label={goal.label}>{goal.emoji}</span>
            <div className="text-left">
              <span className={`block text-xs font-semibold leading-tight ${active ? goal.activeText : "text-foreground"}`}>
                {goal.label}
              </span>
              <span className="block text-[10px] leading-tight text-muted-foreground">
                {goal.description}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
