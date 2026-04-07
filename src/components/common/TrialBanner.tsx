import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTrialDaysLeft, getSession } from "@/lib/auth-store";
import { Clock, Sparkles, X } from "lucide-react";

const DISMISSED_KEY = "nutrisutra_trial_banner_dismissed";

export function TrialBanner() {
  const session = getSession();
  const [dismissed, setDismissed] = useState(false);

  const daysLeft = getTrialDaysLeft();

  // Show 7-day notification once per day (stored in localStorage)
  useEffect(() => {
    if (!session) return;
    if (daysLeft > 7 || daysLeft <= 0) return;

    const today = new Date().toISOString().split("T")[0];
    const lastShown = localStorage.getItem(DISMISSED_KEY);
    if (lastShown === today) {
      setDismissed(true);
    }
  }, [session, daysLeft]);

  if (!session) return null;
  if (daysLeft > 7) return null; // Only show when ≤7 days remaining
  if (dismissed && daysLeft > 1) return null;

  const critical = daysLeft <= 1;
  const urgent = daysLeft <= 3;

  const handleDismiss = () => {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(DISMISSED_KEY, today);
    setDismissed(true);
  };

  return (
    <div
      className={`flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium ${
        critical
          ? "bg-destructive text-destructive-foreground"
          : urgent
          ? "bg-destructive/10 border-b border-destructive/30 text-destructive"
          : "bg-amber-500/10 border-b border-amber-500/30 text-amber-700 dark:text-amber-400"
      }`}
    >
      <div className="flex items-center gap-2">
        {urgent ? <Clock className="h-4 w-4 shrink-0" /> : <Sparkles className="h-4 w-4 shrink-0" />}
        <span>
          {daysLeft === 0
            ? "⚠️ Your free trial ends TODAY — upgrade now to keep access"
            : daysLeft === 1
            ? "⚠️ 1 day left — your trial expires tomorrow!"
            : `🔔 ${daysLeft} days left in your free trial — renew before it expires`}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Link
          to="/pricing"
          className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
            critical
              ? "bg-white/20 hover:bg-white/30 text-white"
              : urgent
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : "bg-amber-500 text-white hover:bg-amber-600"
          }`}
        >
          Upgrade Now
        </Link>
        {!critical && (
          <button onClick={handleDismiss} className="rounded-full p-0.5 opacity-70 hover:opacity-100">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
