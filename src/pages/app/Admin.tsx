import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users, LogIn, Camera, AlertTriangle, TrendingUp,
  Bell, ArrowLeft, RefreshCw, CheckCircle, XCircle,
  ShieldCheck, Send
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { isAdmin, getSession } from "@/lib/auth-store";
import {
  fetchAdminStats, testTelegram, getTelegramSetup,
  type AdminStats, type AdminEvent
} from "@/lib/api/admin";

const EVENT_EMOJI: Record<string, string> = {
  signup: "🎉",
  login: "🔑",
  logout: "👋",
  food_scan: "📸",
  trial_warning: "⚠️",
  trial_expired: "🚫",
  error: "❌",
};

function formatTime(ts: string) {
  const d = new Date(ts);
  return d.toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" });
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
}) => (
  <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${color}`}>
      <Icon className="h-5 w-5" />
    </div>
    <p className="mt-3 text-2xl font-extrabold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

const AdminDashboard = () => {
  const session = getSession();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [telegramResult, setTelegramResult] = useState("");
  const [chatIdInfo, setChatIdInfo] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const s = await fetchAdminStats();
      setStats(s);
    } catch (e) {
      setError("Could not load stats. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (isAdmin()) load(); }, []);

  if (!isAdmin()) return <Navigate to="/app/dashboard" replace />;

  const handleTestTelegram = async () => {
    setTelegramResult("Sending...");
    const r = await testTelegram();
    setTelegramResult(r.message);
  };

  const handleGetChatId = async () => {
    setChatIdInfo("Checking...");
    const r = await getTelegramSetup();
    setChatIdInfo(r.instruction + (r.chat_id ? ` — Chat ID: ${r.chat_id}` : ""));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-5xl py-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link to="/app/dashboard" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Logged in as: <span className="font-medium text-foreground">{session?.email}</span>
            </p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto gap-1" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            <XCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Stats grid */}
        {stats && (
          <>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard icon={Users} label="Total Signups" value={stats.total_signups} color="bg-green-500/10 text-green-600" />
              <StatCard icon={LogIn} label="Total Logins" value={stats.total_logins} color="bg-blue-500/10 text-blue-600" />
              <StatCard icon={Camera} label="Total Scans" value={stats.total_scans} color="bg-purple-500/10 text-purple-600" />
              <StatCard icon={Users} label="Unique Users" value={stats.unique_users} color="bg-amber-500/10 text-amber-600" />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <StatCard icon={TrendingUp} label="Today's Logins" value={stats.today_logins} color="bg-primary/10 text-primary" />
              <StatCard icon={Camera} label="Today's Scans" value={stats.today_scans} color="bg-secondary/10 text-secondary" />
              <StatCard icon={AlertTriangle} label="Total Errors" value={stats.total_errors} color="bg-destructive/10 text-destructive" />
            </div>

            {/* Recent Events */}
            <div className="mt-8 rounded-2xl border border-border bg-card shadow-card">
              <div className="border-b border-border px-6 py-4">
                <h2 className="font-bold text-card-foreground">Live Event Feed</h2>
                <p className="text-xs text-muted-foreground">Most recent 100 events</p>
              </div>
              <div className="divide-y divide-border max-h-[32rem] overflow-y-auto">
                {stats.recent_events.length === 0 ? (
                  <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                    No events yet. Events will appear here when users sign up, log in, or scan food.
                  </div>
                ) : (
                  stats.recent_events.map((ev: AdminEvent, i: number) => (
                    <div key={i} className="flex items-start gap-3 px-6 py-3 hover:bg-muted/30">
                      <span className="mt-0.5 text-lg leading-none">{EVENT_EMOJI[ev.type] ?? "📌"}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                            {ev.type.replace("_", " ")}
                          </span>
                          {ev.email && (
                            <span className="truncate text-xs text-muted-foreground">{ev.email}</span>
                          )}
                        </div>
                        {ev.data && Object.keys(ev.data).length > 0 && (
                          <p className="mt-0.5 text-xs text-muted-foreground truncate">
                            {Object.entries(ev.data)
                              .filter(([k]) => k !== "name" || ev.type === "signup")
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(" · ")}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[10px] text-muted-foreground">{formatTime(ev.ts)}</p>
                        {ev.ip && <p className="text-[10px] text-muted-foreground/60">{ev.ip}</p>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* Telegram Setup Card */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-card-foreground">Telegram Notifications</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Get instant alerts for signups, logins, and errors in Telegram.
          </p>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm">
              <p className="font-medium">Setup steps:</p>
              <ol className="mt-1 list-decimal pl-4 space-y-1 text-muted-foreground">
                <li>Message your Telegram bot (start a chat with it)</li>
                <li>Click <strong>Discover Chat ID</strong> below</li>
                <li>Copy the chat_id into <code className="bg-muted px-1 rounded">TELEGRAM_CHAT_ID</code> in .env</li>
                <li>Restart the backend</li>
                <li>Click <strong>Send Test</strong> to confirm</li>
              </ol>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-1" onClick={handleGetChatId}>
                <Bell className="h-4 w-4" /> Discover Chat ID
              </Button>
              <Button variant="outline" size="sm" className="gap-1" onClick={handleTestTelegram}>
                <Send className="h-4 w-4" /> Send Test Message
              </Button>
            </div>
            {chatIdInfo && (
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-4 py-2 text-sm text-blue-700 dark:text-blue-300">
                {chatIdInfo}
              </div>
            )}
            {telegramResult && (
              <div className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm ${
                telegramResult.includes("sent") || telegramResult.includes("working")
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200"
                  : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200"
              }`}>
                {telegramResult.includes("sent") || telegramResult.includes("working")
                  ? <CheckCircle className="h-4 w-4 shrink-0" />
                  : <XCircle className="h-4 w-4 shrink-0" />
                }
                {telegramResult}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
