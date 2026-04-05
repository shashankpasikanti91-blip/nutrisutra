import { motion } from "framer-motion";
import { Droplet, TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import type { HealthCondition } from "@/types";

const CONDITIONS: {
  value: HealthCondition;
  label: string;
  Icon: LucideIcon;
  description: string;
}[] = [
  { value: "diabetes", label: "Diabetes", Icon: Droplet, description: "Sugar control" },
  { value: "high_bp", label: "High BP", Icon: TrendingUp, description: "Low sodium" },
  { value: "low_bp", label: "Low BP", Icon: TrendingDown, description: "Regular meals" },
];

interface HealthConditionSelectorProps {
  selected: HealthCondition[];
  onChange: (conditions: HealthCondition[]) => void;
}

export function HealthConditionSelector({ selected, onChange }: HealthConditionSelectorProps) {
  const toggle = (condition: HealthCondition) => {
    if (selected.includes(condition)) {
      onChange(selected.filter((c) => c !== condition));
    } else {
      onChange([...selected, condition]);
    }
  };

  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground mb-2">Health conditions (optional)</p>
      <div className="flex gap-2 flex-wrap">
        {CONDITIONS.map((c) => {
          const active = selected.includes(c.value);
          return (
            <motion.button
              key={c.value}
              whileTap={{ scale: 0.96 }}
              onClick={() => toggle(c.value)}
              className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-left transition-all duration-200 ${
                active
                  ? "border-rose-400 bg-rose-50 dark:bg-rose-950/30 shadow-sm"
                  : "border-transparent bg-muted/60 hover:bg-muted"
              }`}
            >
              <c.Icon className={`h-5 w-5 ${active ? "text-rose-500" : "text-muted-foreground"}`} />
              <div>
                <span className={`block text-xs font-semibold leading-tight ${active ? "text-rose-700 dark:text-rose-400" : "text-foreground"}`}>
                  {c.label}
                </span>
                <span className="block text-[10px] leading-tight text-muted-foreground">{c.description}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
