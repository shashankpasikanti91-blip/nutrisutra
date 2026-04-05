import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, Droplet, TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { getSession, getTrialDaysLeft, logout } from "@/lib/auth-store";
import { getHealthProfile, saveHealthProfile } from "@/lib/demo-store";
import type { HealthCondition } from "@/types";

const HEALTH_CONDITIONS: { value: HealthCondition; label: string; Icon: LucideIcon; desc: string }[] = [
  { value: "diabetes", label: "Diabetes", Icon: Droplet, desc: "Get alerts for high sugar & carbs" },
  { value: "high_bp", label: "High BP", Icon: TrendingUp, desc: "Get alerts for high sodium & fat" },
  { value: "low_bp", label: "Low BP", Icon: TrendingDown, desc: "Get reminders to eat regular meals" },
];

const Settings = () => {
  const navigate = useNavigate();
  const session = getSession();
  const daysLeft = getTrialDaysLeft();
  const [conditions, setConditions] = useState<HealthCondition[]>(getHealthProfile().conditions);

  const toggleCondition = (c: HealthCondition) => {
    const next = conditions.includes(c) ? conditions.filter((x) => x !== c) : [...conditions, c];
    setConditions(next);
    saveHealthProfile({ conditions: next });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container max-w-2xl py-8">
      <Link to="/app/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-foreground">Settings</h1>

      {/* Profile */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-bold text-card-foreground">Profile</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><Label>Name</Label><Input defaultValue={session?.name || "User"} className="mt-1" /></div>
          <div><Label>Email</Label><Input defaultValue={session?.email || "user@example.com"} className="mt-1" disabled /></div>
          <div><Label>Age</Label><Input type="number" defaultValue="28" className="mt-1" /></div>
          <div><Label>Height (cm)</Label><Input type="number" defaultValue="170" className="mt-1" /></div>
          <div><Label>Weight (kg)</Label><Input type="number" defaultValue="72" className="mt-1" /></div>
          <div>
            <Label>Goal</Label>
            <select className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground">
              <option>Weight Loss</option>
              <option>Muscle Gain</option>
              <option>Maintenance</option>
              <option>Diabetic Friendly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-bold text-card-foreground">Preferences</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Diet</Label>
            <select className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground">
              <option>Non-Vegetarian</option>
              <option>Vegetarian</option>
              <option>Vegan</option>
              <option>Eggetarian</option>
            </select>
          </div>
          <div>
            <Label>Cuisine Preference</Label>
            <select className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground">
              <option>South Indian</option>
              <option>North Indian</option>
              <option>Malaysian</option>
              <option>Chinese</option>
              <option>Western</option>
              <option>Mixed</option>
            </select>
          </div>
          <div>
            <Label>Units</Label>
            <select className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground">
              <option>Metric (kg, cm)</option>
              <option>Imperial (lb, in)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Health Conditions */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-bold text-card-foreground">Health Conditions</h2>
        <p className="mt-1 text-xs text-muted-foreground">Select any that apply — we'll personalize alerts for your meals</p>
        <div className="mt-4 space-y-2">
          {HEALTH_CONDITIONS.map((hc) => {
            const active = conditions.includes(hc.value);
            return (
              <button
                key={hc.value}
                onClick={() => toggleCondition(hc.value)}
                className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition-all ${
                  active
                    ? "border-rose-400 bg-rose-50 dark:bg-rose-950/30"
                    : "border-border hover:border-rose-200"
                }`}
              >
                <hc.Icon className="h-6 w-6 text-rose-500" />
                <div className="flex-1">
                  <span className={`text-sm font-semibold ${active ? "text-rose-700 dark:text-rose-400" : "text-foreground"}`}>{hc.label}</span>
                  <span className="block text-[11px] text-muted-foreground">{hc.desc}</span>
                </div>
                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                  active ? "border-rose-500 bg-rose-500" : "border-border"
                }`}>
                  {active && <span className="text-white text-[10px]">✓</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subscription */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-bold text-card-foreground">Subscription</h2>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Plan</p>
            <p className="text-lg font-bold text-primary">Free Trial</p>
            <p className="text-xs text-muted-foreground">{daysLeft} day{daysLeft !== 1 ? "s" : ""} remaining</p>
          </div>
          <Link to="/pricing"><Button variant="hero" size="sm">Upgrade to Pro</Button></Link>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Button variant="hero" size="lg">Save Changes</Button>
        <Button variant="outline" size="lg" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" /> Log Out
        </Button>
      </div>
    </div>
  </div>
  );
};

export default Settings;
