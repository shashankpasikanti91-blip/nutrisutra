import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const plans = {
  india: [
    { name: "Free", price: "₹0", period: "/month", annual: null, features: ["Manual meal logging", "Limited daily searches", "Basic calorie & macros", "7-day history"], cta: "Get Started", highlight: false },
    { name: "Pro", price: "₹199", period: "/month", annual: "₹1,499/year", features: ["Unlimited meal logging", "AI image meal detection", "Smart portion estimation", "Detailed health analysis", "Weekly insights", "Goal-based recommendations", "Saved meals & favorites"], cta: "Start Pro", highlight: true },
    { name: "Family", price: "₹399", period: "/month", annual: "₹2,999/year", features: ["Up to 5 profiles", "Family meal dashboard", "Child & adult goals", "Grocery-oriented suggestions", "Meal sharing", "Everything in Pro"], cta: "Start Family", highlight: false },
  ],
  global: [
    { name: "Free", price: "$0", period: "/month", annual: null, features: ["Manual meal logging", "Limited daily searches", "Basic calorie & macros", "7-day history"], cta: "Get Started", highlight: false },
    { name: "Pro", price: "$4.99", period: "/month", annual: "$39/year", features: ["Unlimited meal logging", "AI image meal detection", "Smart portion estimation", "Detailed health analysis", "Weekly insights", "Goal-based recommendations", "Saved meals & favorites"], cta: "Start Pro", highlight: true },
    { name: "Family", price: "$9.99", period: "/month", annual: "$79/year", features: ["Up to 5 profiles", "Family meal dashboard", "Child & adult goals", "Grocery-oriented suggestions", "Meal sharing", "Everything in Pro"], cta: "Start Family", highlight: false },
  ],
};

const Pricing = () => {
  const [region, setRegion] = useState<"india" | "global">("india");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="py-20">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="text-center">
            <motion.h1 variants={fadeUp} className="text-4xl font-extrabold text-foreground sm:text-5xl">
              Simple, Honest Pricing
            </motion.h1>
            <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Start free. Upgrade when you need unlimited AI analysis, image detection, and weekly insights.
            </motion.p>

            {/* Region toggle */}
            <motion.div variants={fadeUp} className="mt-8 inline-flex rounded-lg border border-border bg-muted p-1">
              <button onClick={() => setRegion("india")} className={`rounded-md px-5 py-2 text-sm font-semibold transition-all ${region === "india" ? "bg-card text-foreground shadow-card" : "text-muted-foreground"}`}>
                India
              </button>
              <button onClick={() => setRegion("global")} className={`rounded-md px-5 py-2 text-sm font-semibold transition-all ${region === "global" ? "bg-card text-foreground shadow-card" : "text-muted-foreground"}`}>
                Global
              </button>
            </motion.div>
          </motion.div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {plans[region].map((plan) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className={`relative rounded-2xl border p-8 transition-shadow ${plan.highlight ? "border-primary bg-card shadow-card-hover scale-[1.02]" : "border-border bg-card shadow-card"}`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-gradient px-4 py-1 text-xs font-bold text-accent-foreground">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-card-foreground">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                {plan.annual && (
                  <p className="mt-1 text-sm font-medium text-primary">{plan.annual} — Save ~37%</p>
                )}
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className="mt-8 block">
                  <Button variant={plan.highlight ? "hero" : "outline"} className="w-full" size="lg">
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            Pricing can be updated by admin. Coach/Business plans coming soon.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Pricing;
