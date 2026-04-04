import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingDown, TrendingUp, AlertTriangle, Zap, Flame, Droplets, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import Navbar from "@/components/Navbar";
import { getDailySummaries, getWeeklyAverage, getFrequentFoods, getStreaks, getSavedGoals } from "@/lib/demo-store";

const Insights = () => {
  const summaries = useMemo(() => getDailySummaries(30), []);
  const weekAvg = useMemo(() => getWeeklyAverage(), []);
  const frequentFoods = useMemo(() => getFrequentFoods(7), []);
  const streaks = useMemo(() => getStreaks(), []);
  const goals = useMemo(() => getSavedGoals(), []);

  // Last 7 days for bar chart (oldest first)
  const last7 = useMemo(() => {
    const days = summaries.slice(0, 7).reverse();
    return days.map((d) => {
      const dt = new Date(d.date + "T00:00:00");
      return { day: dt.toLocaleDateString("en", { weekday: "short" }), cal: d.calories, goal: d.calorieGoal };
    });
  }, [summaries]);

  // Macro distribution from last 7 days
  const macroData = useMemo(() => {
    const totals = summaries.slice(0, 7).reduce(
      (acc, d) => ({ p: acc.p + d.protein, c: acc.c + d.carbs, f: acc.f + d.fat }),
      { p: 0, c: 0, f: 0 }
    );
    const total = totals.p + totals.c + totals.f || 1;
    return [
      { name: "Protein", value: Math.round((totals.p / total) * 100), grams: Math.round(totals.p / Math.max(summaries.slice(0, 7).length, 1)), color: "hsl(152, 45%, 28%)" },
      { name: "Carbs", value: Math.round((totals.c / total) * 100), grams: Math.round(totals.c / Math.max(summaries.slice(0, 7).length, 1)), color: "hsl(35, 80%, 55%)" },
      { name: "Fat", value: Math.round((totals.f / total) * 100), grams: Math.round(totals.f / Math.max(summaries.slice(0, 7).length, 1)), color: "hsl(0, 72%, 51%)" },
    ];
  }, [summaries]);

  // Water trend (last 7 days)
  const waterTrend = useMemo(() => {
    return summaries.slice(0, 7).reverse().map((d) => {
      const dt = new Date(d.date + "T00:00:00");
      return { day: dt.toLocaleDateString("en", { weekday: "short" }), glasses: d.waterGlasses };
    });
  }, [summaries]);

  const hasData = summaries.length > 0 && summaries.some((s) => s.mealCount > 0);

  // Smart suggestions
  const suggestions = useMemo(() => {
    const tips: Array<{ icon: "protein" | "calories" | "water"; title: string; text: string }> = [];
    if (weekAvg.avgProtein > 0 && weekAvg.avgProtein < 50) {
      tips.push({ icon: "protein", title: "Protein Gap", text: `Averaging ${weekAvg.avgProtein}g protein/day. Try adding eggs, paneer, dal, or sprouts.` });
    }
    if (weekAvg.avgCalories > goals.calorieGoal * 1.15) {
      tips.push({ icon: "calories", title: "Calorie Overshoot", text: `Averaging ${weekAvg.avgCalories} kcal vs ${goals.calorieGoal} goal. Consider lighter dinners.` });
    }
    if (weekAvg.avgWater > 0 && weekAvg.avgWater < goals.waterGoal * 0.7) {
      tips.push({ icon: "water", title: "Stay Hydrated", text: `Averaging ${weekAvg.avgWater} glasses/day. Goal is ${goals.waterGoal}. Set reminders!` });
    }
    return tips;
  }, [weekAvg, goals]);

  const dateRange = useMemo(() => {
    if (summaries.length < 2) return "";
    const newest = summaries[0].date;
    const oldest = summaries[Math.min(summaries.length - 1, 6)].date;
    const fmt = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("en", { month: "short", day: "numeric" });
    return `${fmt(oldest)} – ${fmt(newest)}`;
  }, [summaries]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-3xl py-8">
        <Link to="/app/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Weekly Insights</h1>
        {dateRange && <p className="text-sm text-muted-foreground">{dateRange}</p>}

        {!hasData ? (
          <div className="mt-12 text-center">
            <Flame className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <h2 className="mt-4 text-lg font-semibold text-foreground">No data yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">Start logging meals to see your weekly insights and trends here.</p>
            <Link to="/analyze" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Analyze a meal →
            </Link>
          </div>
        ) : (
          <>
            {/* Streak cards */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-4 text-center shadow-card">
                <Flame className="mx-auto h-5 w-5 text-orange-500" />
                <p className="mt-1 text-2xl font-bold text-foreground">{streaks.currentStreak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 text-center shadow-card">
                <Target className="mx-auto h-5 w-5 text-primary" />
                <p className="mt-1 text-2xl font-bold text-foreground">{streaks.goalsMetCount}</p>
                <p className="text-xs text-muted-foreground">Goals Met</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 text-center shadow-card">
                <TrendingUp className="mx-auto h-5 w-5 text-green-500" />
                <p className="mt-1 text-2xl font-bold text-foreground">{streaks.longestStreak}</p>
                <p className="text-xs text-muted-foreground">Best Streak</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 text-center shadow-card">
                <Droplets className="mx-auto h-5 w-5 text-blue-500" />
                <p className="mt-1 text-2xl font-bold text-foreground">{weekAvg.avgWater}</p>
                <p className="text-xs text-muted-foreground">Avg Water/Day</p>
              </div>
            </div>

            {/* Weekly calories chart */}
            <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="font-bold text-card-foreground">Calorie Trend</h2>
              <p className="text-xs text-muted-foreground">Daily avg: {weekAvg.avgCalories} kcal</p>
              <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={last7}>
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                    <Bar dataKey="cal" fill="hsl(152, 45%, 28%)" radius={[6, 6, 0, 0]} name="Calories" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Macro split */}
            <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="font-bold text-card-foreground">Macro Distribution</h2>
              <div className="mt-4 flex items-center gap-8">
                <div className="h-40 w-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={macroData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" stroke="none">
                        {macroData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {macroData.map((m) => (
                    <div key={m.name} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: m.color }} />
                      <span className="text-sm text-muted-foreground">
                        {m.name}: <span className="font-semibold text-card-foreground">{m.value}%</span>
                        <span className="ml-1 text-xs">({m.grams}g avg/day)</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Water trend */}
            {waterTrend.some((w) => w.glasses > 0) && (
              <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
                <h2 className="font-bold text-card-foreground">Water Intake Trend</h2>
                <div className="mt-4 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={waterTrend}>
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                      <Line type="monotone" dataKey="glasses" stroke="hsl(199, 89%, 48%)" strokeWidth={2} dot={{ r: 4 }} name="Glasses" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Frequent foods */}
            {frequentFoods.length > 0 && (
              <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-secondary" />
                  <h2 className="font-bold text-card-foreground">Most Eaten Foods</h2>
                </div>
                <div className="mt-4 space-y-3">
                  {frequentFoods.slice(0, 5).map((f) => (
                    <div key={f.name} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-card-foreground">{f.name}</p>
                        <p className="text-xs text-muted-foreground">{f.count}x this week</p>
                      </div>
                      <span className="text-sm font-bold text-foreground">{f.avgCalories} kcal avg</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Smart suggestions */}
            {suggestions.length > 0 && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {suggestions.map((s) => (
                  <div key={s.title} className="rounded-xl border border-border bg-card p-5 shadow-card">
                    {s.icon === "protein" && <TrendingDown className="h-5 w-5 text-primary" />}
                    {s.icon === "calories" && <Zap className="h-5 w-5 text-secondary" />}
                    {s.icon === "water" && <Droplets className="h-5 w-5 text-blue-500" />}
                    <h3 className="mt-2 font-bold text-card-foreground">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Insights;
