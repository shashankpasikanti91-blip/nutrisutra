import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import logoIcon from "@/assets/logo-icon.png";
import { loginUser, isAdmin } from "@/lib/auth-store";
import { reportLogin } from "@/lib/api/events";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await loginUser(email, password);
    setLoading(false);
    if (result.success) {
      reportLogin(email);
      // Owner goes to admin dashboard
      if (isAdmin()) {
        navigate("/app/admin");
      } else {
        navigate("/app/dashboard");
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-card-lg">
          <div className="flex flex-col items-center">
            <img src={logoIcon} alt="NutriSutra" className="h-12 w-12" />
            <h1 className="mt-4 text-2xl font-bold text-card-foreground">Welcome Back</h1>
            <p className="mt-1 text-sm text-muted-foreground">Log in to your NutriSutra account</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" required />
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
            </div>
            <Button variant="hero" className="w-full" size="lg" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
