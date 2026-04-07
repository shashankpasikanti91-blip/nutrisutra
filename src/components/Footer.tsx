import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-muted/50 py-12">
    <div className="container">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">NutriSutra</h3>
          <p className="mt-2 text-sm text-muted-foreground">AI Nutrition for Real Food</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Product</h4>
          <div className="mt-3 flex flex-col gap-2">
            <Link to="/demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Free Demo</Link>
            <Link to="/demo/calculator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Daily Intake Calculator</Link>
            <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Cuisines</h4>
          <div className="mt-3 flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Indian & South Indian</span>
            <span className="text-sm text-muted-foreground">Malaysian & Singaporean</span>
            <span className="text-sm text-muted-foreground">Chinese & Western</span>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Legal</h4>
          <div className="mt-3 flex flex-col gap-2">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} NutriSutra. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
