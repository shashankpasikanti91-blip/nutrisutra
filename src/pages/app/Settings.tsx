import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, Droplet, TrendingUp, TrendingDown, Save, Check, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { getSession, getTrialDaysLeft, logout, getUserProfileData, saveUserProfileData, type UserProfileData } from "@/lib/auth-store";
import { getHealthProfile, saveHealthProfile, computePersonalGoals, updateGoals } from "@/lib/demo-store";
import type { HealthCondition } from "@/types";

const HEALTH_CONDITIONS: { value: HealthCondition; label: string; Icon: LucideIcon; desc: string }[] = [
  { value: "diabetes", label: "Diabetes", Icon: Droplet, desc: "Get alerts for high sugar & carbs" },
  { value: "high_bp", label: "High BP", Icon: TrendingUp, desc: "Get alerts for high sodium & fat" },
  { value: "low_bp", label: "Low BP", Icon: TrendingDown, desc: "Get reminders to eat regular meals" },
];

const selectClass = "mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground";

const Settings = () => {
  const navigate = useNavigate();
  const session = getSession();
  const daysLeft = getTrialDaysLeft();

  // Load persisted profile data
  const [profile, setProfile] = useState<UserProfileData>(() => getUserProfileData());
  const [conditions, setConditions] = useState<HealthCondition[]>(getHealthProfile().conditions);
  const [saved, setSaved] = useState(false);

  const updateField = <K extends keyof UserProfileData>(key: K, value: UserProfileData[K]) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const toggleCondition = (c: HealthCondition) => {
    const next = conditions.includes(c) ? conditions.filter((x) => x !== c) : [...conditions, c];
    setConditions(next);
    saveHealthProfile({ conditions: next });
    setSaved(false);
  };

  const handleSave = () => {
    saveUserProfileData(profile);
    saveHealthProfile({ conditions });
    // Recalculate calorie + water goal from updated profile
    const { calorieGoal, waterGoal } = computePersonalGoals();
    updateGoals(calorieGoal, waterGoal);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container max-w-2xl py-8 px-4">
      <Link to="/app/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-foreground">Settings</h1>

      {/* Profile */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-bold text-card-foreground">Profile</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={profile.name} onChange={(e) => updateField("name", e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profile.email} className="mt-1" disabled />
          </div>
          <div>
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" value={profile.age} onChange={(e) => updateField("age", Number(e.target.value) || 0)} className="mt-1" min={10} max={120} />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <select id="gender" value={profile.gender} onChange={(e) => updateField("gender", e.target.value as UserProfileData["gender"])} className={selectClass}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <Label htmlFor="height">Height (cm)</Label>
            <Input id="height" type="number" value={profile.heightCm} onChange={(e) => updateField("heightCm", Number(e.target.value) || 0)} className="mt-1" min={50} max={300} />
          </div>
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input id="weight" type="number" value={profile.weightKg} onChange={(e) => updateField("weightKg", Number(e.target.value) || 0)} className="mt-1" min={20} max={500} />
          </div>
          <div>
            <Label htmlFor="activity">Activity Level</Label>
            <select id="activity" value={profile.activity} onChange={(e) => updateField("activity", e.target.value as UserProfileData["activity"])} className={selectClass}>
              <option value="sedentary">Sedentary (desk job, no exercise)</option>
              <option value="light">Light (1–3 days/week exercise)</option>
              <option value="moderate">Moderate (3–5 days/week)</option>
              <option value="active">Active (6–7 days/week)</option>
              <option value="very_active">Very Active (athlete / physical job)</option>
            </select>
          </div>
          <div>
            <Label htmlFor="goal">Goal</Label>
            <select id="goal" value={profile.goal} onChange={(e) => updateField("goal", e.target.value as UserProfileData["goal"])} className={selectClass}>
              <option value="weight_loss">Weight Loss</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
              <option value="diabetic_friendly">Diabetic Friendly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-bold text-card-foreground">Preferences</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="diet">Diet</Label>
            <select id="diet" value={profile.diet} onChange={(e) => updateField("diet", e.target.value as UserProfileData["diet"])} className={selectClass}>
              <option value="non_veg">Non-Vegetarian</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="eggetarian">Eggetarian</option>
            </select>
          </div>
          <div>
            <Label htmlFor="cuisine">Cuisine Preference</Label>
            <select id="cuisine" value={profile.cuisine} onChange={(e) => updateField("cuisine", e.target.value as UserProfileData["cuisine"])} className={selectClass}>
              <option value="south_indian">South Indian</option>
              <option value="north_indian">North Indian</option>
              <option value="malaysian">Malaysian</option>
              <option value="chinese">Chinese</option>
              <option value="western">Western</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
          <div>
            <Label htmlFor="units">Units</Label>
            <select id="units" value={profile.units} onChange={(e) => updateField("units", e.target.value as UserProfileData["units"])} className={selectClass}>
              <option value="metric">Metric (kg, cm)</option>
              <option value="imperial">Imperial (lb, in)</option>
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
        <Button variant="hero" size="lg" onClick={handleSave} className="gap-2">
          {saved ? <><Check className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Changes</>}
        </Button>
        <Button variant="outline" size="lg" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" /> Log Out
        </Button>
      </div>

      {saved && (
        <div className="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
          Your profile has been saved successfully!
        </div>
      )}
    </div>
  </div>
  );
};

export default Settings;
