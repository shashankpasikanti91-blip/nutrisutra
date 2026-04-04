import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Calculator, Droplets, Search, ClipboardList, Camera, Utensils,
  ArrowRight, Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const features = [
  {
    icon: Calculator,
    title: "Calculate My Daily Intake",
    desc: "Get your personalized calorie, protein, carbs, and fat targets based on age, weight, height, activity, and goals.",
    link: "/demo/calculator",
    cta: "Calculate Now",
    gradient: "from-primary/10 to-primary/5",
  },
  {
    icon: Search,
    title: "Analyze My Meal",
    desc: "Search any food — from idli to biryani to pizza — and get instant, deterministic nutrition analysis with adjustable portions and cooking styles.",
    link: "/analyze",
    cta: "Analyze Food",
    gradient: "from-secondary/10 to-secondary/5",
  },
  {
    icon: Droplets,
    title: "Track My Water",
    desc: "Simple tap-based water tracker with a visual progress ring. Hit your daily hydration goal one glass at a time.",
    link: "/demo/water",
    cta: "Track Water",
    gradient: "from-primary/10 to-primary/5",
  },
  {
    icon: ClipboardList,
    title: "Daily Meal Tracker",
    desc: "Log breakfast, lunch, dinner, and snacks. See your total calories consumed, macros, and remaining target — all in one view.",
    link: "/demo/tracker",
    cta: "Start Tracking",
    gradient: "from-secondary/10 to-secondary/5",
  },
];

const Demo = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <section className="py-16 lg:py-20">
      <div className="container text-center">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.p variants={fadeUp} className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            No Login Required
          </motion.p>
          <motion.h1 variants={fadeUp} className="mt-4 text-3xl font-extrabold text-foreground sm:text-4xl lg:text-5xl">
            Try NutriSutra{" "}
            <span className="text-gradient-primary">Free Demo</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Experience the full power of AI nutrition analysis. Calculate your daily intake, analyze meals, track water, and log food — all without creating an account.
          </motion.p>
        </motion.div>
      </div>
    </section>

    {/* Feature CTAs */}
    <section className="pb-20">
      <div className="container max-w-4xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid gap-6 sm:grid-cols-2"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={fadeUp}>
              <Link to={f.link} className="group block">
                <div className={`rounded-2xl border border-border bg-gradient-to-br ${f.gradient} p-6 shadow-card transition-all hover:shadow-card-lg hover:-translate-y-1`}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-card shadow-card">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-card-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {f.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick search */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-muted-foreground mb-4">Or search any food directly:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Idli", "Masala Dosa", "Biryani", "Burger", "Pizza", "Nasi Lemak", "Fried Rice", "Pasta"].map((food) => (
              <Link key={food} to={`/analyze`}>
                <span className="inline-block rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-card">
                  {food}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Demo;
