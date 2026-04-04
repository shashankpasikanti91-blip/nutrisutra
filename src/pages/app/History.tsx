import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, CalendarDays, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { getRecentLogs, removeMealFromLog, type MealSlot, type DailyLog } from "@/lib/demo-store";

const slotOrder: MealSlot[] = ["breakfast", "lunch", "dinner", "snacks"];
const slotLabels: Record<MealSlot, string> = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snacks: "Snacks" };
const filterOptions = ["All", "Breakfast", "Lunch", "Dinner", "Snacks"] as const;

function formatDateLabel(dateStr: string): string {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const dt = new Date(dateStr + "T00:00:00");
  const formatted = dt.toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  if (dateStr === today) return `Today — ${formatted}`;
  if (dateStr === yesterday) return `Yesterday — ${formatted}`;
  return formatted;
}

const History = () => {
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [, setRefreshKey] = useState(0);

  const logs = useMemo(() => getRecentLogs(30), []);

  const filteredLogs = useMemo(() => {
    return logs
      .map((log) => {
        let meals = log.meals;
        if (filter !== "All") {
          const slot = filter.toLowerCase() as MealSlot;
          meals = meals.filter((m) => m.slot === slot);
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          meals = meals.filter((m) => m.foodName.toLowerCase().includes(q));
        }
        return { ...log, meals };
      })
      .filter((log) => log.meals.length > 0);
  }, [logs, filter, searchQuery]);

  const handleDelete = (mealId: string) => {
    removeMealFromLog(mealId);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl py-8">
        <Link to="/app/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Meal History</h1>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search meals..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${f === filter ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              {f}
            </button>
          ))}
        </div>

        {filteredLogs.length === 0 ? (
          <div className="mt-16 text-center">
            <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <h2 className="mt-4 text-lg font-semibold text-foreground">No meals logged yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchQuery || filter !== "All"
                ? "No meals match your search. Try clearing filters."
                : "Start analyzing and logging meals to build your history."}
            </p>
            <Link to="/analyze" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Analyze a meal →
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-8">
            {filteredLogs.map((log) => {
              const dayTotal = log.meals.reduce((s, m) => s + m.calories, 0);
              return (
                <div key={log.date}>
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-foreground">{formatDateLabel(log.date)}</h2>
                    <span className="text-sm font-semibold text-primary">{Math.round(dayTotal)} kcal</span>
                  </div>
                  <div className="mt-3 space-y-3">
                    {slotOrder.map((slot) => {
                      const slotMeals = log.meals.filter((m) => m.slot === slot);
                      if (slotMeals.length === 0) return null;
                      return (
                        <div key={slot} className="rounded-xl border border-border bg-card p-4 shadow-card">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{slotLabels[slot]}</p>
                          {slotMeals.map((meal) => (
                            <div key={meal.id} className="mt-2 flex items-center justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <span className="text-sm text-card-foreground">{meal.foodName}</span>
                                <span className="ml-2 text-xs text-muted-foreground">
                                  P{Math.round(meal.protein)}g · C{Math.round(meal.carbs)}g · F{Math.round(meal.fat)}g
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-foreground whitespace-nowrap">{Math.round(meal.calories)} kcal</span>
                                <button
                                  onClick={() => handleDelete(meal.id)}
                                  className="rounded p-1 text-muted-foreground hover:text-destructive transition-colors"
                                  title="Remove meal"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
