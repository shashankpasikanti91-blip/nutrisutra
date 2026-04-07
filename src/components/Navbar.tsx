import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ShieldCheck } from "lucide-react";
import logoIcon from "@/assets/logo-icon.png";
import { getSession, isAdmin } from "@/lib/auth-store";

const publicNavLinks = [
  { label: "Home", to: "/" },
  { label: "Analyze", to: "/analyze" },
  { label: "Demo", to: "/demo" },
  { label: "Pricing", to: "/pricing" },
];

const authNavLinks = [
  { label: "Home", to: "/" },
  { label: "Analyze", to: "/analyze" },
  { label: "Pricing", to: "/pricing" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const session = getSession();
  const adminUser = session ? isAdmin() : false;
  const navLinks = session ? authNavLinks : publicNavLinks;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoIcon} alt="NutriSutra" className="h-8 w-8" />
          <span className="text-xl font-bold text-foreground">NutriSutra</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {session ? (
            <Link to={adminUser ? "/app/admin" : "/app/dashboard"}>
              <Button size="sm" variant="outline" className="gap-1.5">
                {adminUser ? (
                  <ShieldCheck className="h-4 w-4 text-primary" />
                ) : (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                    {session.name.charAt(0).toUpperCase()}
                  </span>
                )}
                {adminUser ? "Admin Panel" : "Dashboard"}
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/demo">
                <Button variant="hero" size="sm">Try Free Demo</Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">Sign Up Free</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-background p-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium text-muted-foreground"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <Link to={adminUser ? "/app/admin" : "/app/dashboard"} onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full">
                  {adminUser ? "Admin Panel" : "Dashboard"}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/demo" onClick={() => setOpen(false)}>
                  <Button variant="hero" className="w-full">Try Free Demo</Button>
                </Link>
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full">Log in</Button>
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">Sign Up Free</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
