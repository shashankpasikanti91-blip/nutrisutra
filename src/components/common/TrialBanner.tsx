import { Link } from "react-router-dom";
import { getTrialDaysLeft, getSession } from "@/lib/auth-store";
import { Clock, Sparkles } from "lucide-react";

export function TrialBanner() {
  const session = getSession();
  if (!session) return null;

  const daysLeft = getTrialDaysLeft();
  if (daysLeft > 14) return null; // Only show when ≤14 days remaining

  const urgent = daysLeft <= 3;

  return (
    <div
      className={`flex items-center justify-between gap-3 px-4 py-2.5 text-sm ${
        urgent
          ? "bg-destructive/10 border-b border-destructive/20 text-destructive"
          : "bg-primary/5 border-b border-primary/10 text-primary"
      }`}
    >
      <div className="flex items-center gap-2">
        {urgent ? <Clock className="h-4 w-4 shrink-0" /> : <Sparkles className="h-4 w-4 shrink-0" />}
        <span>
          {daysLeft === 0
            ? "Your free trial ends today!"
            : daysLeft === 1
              ? "1 day left in your free trial"
              : `${daysLeft} days left in your free trial`}
        </span>
      </div>
      <Link
        to="/pricing"
        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
          urgent
            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        Upgrade
      </Link>
    </div>
  );
}
