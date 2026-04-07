import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Camera, Plus, Flame, Drumstick, Wheat, Droplets, TrendingUp, Award, Target, ClipboardList, Settings2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getDailyLog, getDayTotals, getStreaks } from "@/lib/demo-store";
import { getSession } from "@/lib/auth-store";
import { AIDietGuide } from "@/components/analyze/AIDietGuide";

const quickChips = ["Idli", "Dosa", "Biryani", "Burger", "Pizza", "Nasi Lemak", "Fried Rice", "Salad"];
const cuisineFilters = ["All", "Indian", "Malaysian", "Chinese", "Western", "Fast Food"];

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const log = useMemo(() => getDailyLog(), []);
  const totals = useMemo(() => getDayTotals(log), [log]);
  const streaks = useMemo(() => getStreaks(), []);
  const session = useMemo(() => getSession(), []);
  const userName = session?.name?.split(" ")[0] || "there";

  const dailyCal = Math.round(totals.calories);
  const goalCal = log.calorieGoal;
  const progress = Math.round((dailyCal / goalCal) * 100);

  // Recent meals from today's log (newest first)
  const recentMeals = useMemo(() => {
    return [...log.meals].reverse().slice(0, 5);
  }, [log]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/app/food?q=${encodeURIComponent(search)}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-4xl py-8">
        {/* Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening"}, {userName}!
            </h1>
            <p className="text-sm text-muted-foreground">Track your meals and reach your goals</p>
          </div>
          <Link to="/app/settings">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {userName.charAt(0).toUpperCase()}
            </div>
          </Link>
        </div>

        {/* Streak banner */}
        {streaks.currentStreak > 0 && (
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 px-4 py-3">
            <Flame className="h-6 w-6 text-orange-500" />
            <div>
              <p className="text-sm font-bold text-foreground">{streaks.currentStreak}-day streak!</p>
              <p className="text-xs text-muted-foreground">
                {streaks.goalsMetCount} goals met · Best: {streaks.longestStreak} days
              </p>
            </div>
            {streaks.currentStreak >= 7 && <Award className="ml-auto h-5 w-5 text-yellow-500" />}
          </div>
        )}

        {/* Search */}
        <form onSubmit={handleSearch} className="mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search food — e.g. masala dosa, burger, nasi lemak..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-12 pl-10 pr-12 text-base" />
            <Link to="/analyze" className="absolute right-2 top-1/2 -translate-y-1/2">
              <Button variant="ghost" size="icon" type="button"><Camera className="h-5 w-5 text-muted-foreground" /></Button>
            </Link>
          </div>
        </form>

        {/* Quick chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {quickChips.map((c) => (
            <Link key={c} to={`/app/food?q=${encodeURIComponent(c)}`}>
              <span className="inline-block rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                {c}
              </span>
            </Link>
          ))}
          <Button variant="ghost" size="sm" className="rounded-full gap-1 text-xs"><Plus className="h-3 w-3" /> Quick Add</Button>
        </div>

        {/* Calorie Summary */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-card-foreground">Today's Summary</h2>
            <span className="text-sm text-muted-foreground">{dailyCal} / {goalCal} kcal</span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all ${progress > 100 ? "bg-destructive" : "bg-hero-gradient"}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          {/* Macros */}
          <div className="mt-6 grid grid-cols-4 gap-4">
            {[
              { label: "Calories", value: `${dailyCal}`, icon: Flame, color: "text-secondary" },
              { label: "Protein", value: `${Math.round(totals.protein)}g`, icon: Drumstick, color: "text-primary" },
              { label: "Carbs", value: `${Math.round(totals.carbs)}g`, icon: Wheat, color: "text-secondary" },
              { label: "Fat", value: `${Math.round(totals.fat)}g`, icon: Droplets, color: "text-destructive" },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <m.icon className={`mx-auto h-5 w-5 ${m.color}`} />
                <p className="mt-1 text-lg font-bold text-card-foreground">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cuisine filters */}
        <div className="mt-8 flex gap-2 overflow-x-auto">
          {cuisineFilters.map((f) => (
            <button key={f} className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${f === "All" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Recent Meals */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-foreground">Recent Meals</h2>
            <Link to="/app/history" className="text-sm font-medium text-primary hover:underline">View All</Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentMeals.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-6 text-center shadow-card">
                <p className="text-sm text-muted-foreground">No meals logged today.</p>
                <Link to="/analyze" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
                  Analyze your first meal →
                </Link>
              </div>
            ) : (
              recentMeals.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-card-lg">
                  <div>
                    <p className="font-semibold text-card-foreground">{m.foodName}</p>
                    <p className="text-xs text-muted-foreground">
                      {m.slot.charAt(0).toUpperCase() + m.slot.slice(1)} · P{Math.round(m.protein)}g C{Math.round(m.carbs)}g F{Math.round(m.fat)}g
                    </p>
                  </div>
                  <span className="font-bold text-foreground">{Math.round(m.calories)} kcal</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Dietary Guide */}
        <AIDietGuide
          caloriesConsumed={dailyCal}
          calorieGoal={goalCal}
          proteinConsumed={totals.protein}
          carbsConsumed={totals.carbs}
          fatConsumed={totals.fat}
        />

        {/* Bottom nav */}
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/app/history"><Button variant="outline" size="sm"><ClipboardList className="mr-1 h-4 w-4" /> History</Button></Link>
          <Link to="/app/insights"><Button variant="outline" size="sm"><TrendingUp className="mr-1 h-4 w-4" /> Insights</Button></Link>
          <Link to="/app/settings"><Button variant="outline" size="sm"><Settings2 className="mr-1 h-4 w-4" /> Settings</Button></Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
