import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import logoIcon from "@/assets/logo-icon.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-card-lg">
          <div className="flex flex-col items-center">
            <img src={logoIcon} alt="NutriSutra" className="h-12 w-12" />
            <h1 className="mt-4 text-2xl font-bold text-card-foreground">Reset Password</h1>
            <p className="mt-1 text-sm text-muted-foreground">We'll send you a reset link</p>
          </div>

          {sent ? (
            <div className="mt-8 rounded-lg bg-primary/10 p-4 text-center text-sm text-primary">
              Check your inbox for a password reset link.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" required />
              </div>
              <Button variant="hero" className="w-full" size="lg" type="submit">Send Reset Link</Button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/login" className="font-semibold text-primary hover:underline">Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
