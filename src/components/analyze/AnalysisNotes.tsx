import { motion } from "framer-motion";
import { Info } from "lucide-react";
import type { AnalysisResult } from "@/types";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

interface AnalysisNotesProps {
  result: AnalysisResult;
}

export function AnalysisNotes({ result }: AnalysisNotesProps) {
  if (result.notes.length === 0) return null;

  const isWarning = result.confidence === "low";

  return (
    <motion.div
      className={`rounded-xl border p-4 shadow-card ${
        isWarning
          ? "border-amber-500/20 bg-amber-500/5"
          : "border-border bg-card"
      }`}
      {...fadeUp}
    >
      <div className="flex items-start gap-2.5">
        <Info className={`mt-0.5 h-4 w-4 shrink-0 ${
          isWarning ? "text-amber-500" : "text-muted-foreground"
        }`} />
        <div className="space-y-1">
          {result.notes.map((note, i) => (
            <p
              key={i}
              className={`text-sm leading-relaxed ${
                isWarning ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground"
              }`}
            >
              {note}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
