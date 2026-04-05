import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Camera, Search, BarChart3, Zap, Utensils, Flame, ScanBarcode, Heart,
  ChevronDown, ArrowRight, Star, Shield, Smartphone, Calculator, Droplets,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  BiryaniIcon, DosaIcon, CurryIcon, ChickenIcon, ThaliIcon, StreetFoodIcon,
  BreakfastIcon, SamosaIcon, SweetIcon, FishIcon, IdliIcon,
  DiabetesIcon, BPHighIcon, BPLowIcon, NightIcon,
} from "@/components/FoodIcons";
import { getRegionalCategoryCounts, getFunctionalCategoryCounts, getTotalFoodCount } from "@/lib/food-catalog";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const popularFoods = [
  { name: "Biryani", Icon: BiryaniIcon, cal: "350 kcal", tag: "Hyderabadi" },
  { name: "Masala Dosa", Icon: DosaIcon, cal: "210 kcal", tag: "South Indian" },
  { name: "Butter Chicken", Icon: ChickenIcon, cal: "240 kcal", tag: "North Indian" },
  { name: "Idli Sambar", Icon: IdliIcon, cal: "95 kcal", tag: "Breakfast" },
  { name: "Chole Bhature", Icon: CurryIcon, cal: "450 kcal", tag: "Punjabi" },
  { name: "Pav Bhaji", Icon: StreetFoodIcon, cal: "320 kcal", tag: "Street Food" },
];

// Regional categories computed from actual food catalog (510+ items)
const regionalCategories = getRegionalCategoryCounts();
const functionalCategories = getFunctionalCategoryCounts();
const totalFoods = getTotalFoodCount();

// Map category keys to icons
const categoryIconMap: Record<string, React.FC<{ className?: string; size?: number }>> = {
  "Andhra/Telangana": BiryaniIcon,
  "Tamil Nadu": DosaIcon,
  "South India": ThaliIcon,
  "Punjabi/North": CurryIcon,
  "Rajasthan": SamosaIcon,
  "Maharashtra": StreetFoodIcon,
  "Gujarat": SweetIcon,
  "West Bengal": FishIcon,
  "Odisha": ThaliIcon,
  "Bihar/Jharkhand": CurryIcon,
  "Assam": FishIcon,
  "Breakfast": BreakfastIcon,
  "Main Course": ThaliIcon,
  "Street Food": StreetFoodIcon,
};

const features = [
  { icon: Camera, title: "Snap & Analyze", desc: "Point your camera at any meal — AI identifies it and shows full nutrition instantly", gradient: "from-emerald-400 to-teal-500" },
  { icon: ScanBarcode, title: "Barcode Scanner", desc: "Scan packaged food barcodes — pulls nutrition from 3M+ products worldwide", gradient: "from-violet-500 to-purple-600" },
  { icon: Search, title: `${totalFoods}+ Indian Foods`, desc: "Biryani, dosa, paneer tikka, vada pav — we know desi food better than anyone", gradient: "from-green-400 to-emerald-500" },
  { icon: BarChart3, title: "Full Macro Breakdown", desc: "Protein, carbs, fat, fiber, sugar, sodium — complete picture at a glance", gradient: "from-sky-400 to-blue-500" },
  { icon: Zap, title: "Smart Portions", desc: "Real serving sizes — 1 idli = 40g, 1 roti = 35g, not random guesses", gradient: "from-emerald-400 to-teal-500" },
  { icon: Heart, title: "Health Condition Alerts", desc: "Diabetes, high BP, low BP — get personalized warnings and safer food suggestions", gradient: "from-rose-400 to-red-500" },
  { icon: Flame, title: "Streak & Insights", desc: "7-day trends, calorie charts, macro splits, and daily streaks to keep you on track", gradient: "from-pink-400 to-rose-500" },
];

const faqs = [
  { q: "How accurate are the calorie estimates?", a: "NutriSutra uses a deterministic engine — same input always gives the same result. We show confidence levels, never fake exact numbers." },
  { q: "Does it support homemade vs restaurant food?", a: "Yes. Select cooking style with one tap and we adjust calories with realistic multipliers." },
  { q: "Is it free to use?", a: "Sign up free and get full access for 30 days — no credit card needed. After that, upgrade to Pro starting ₹199/month." },
  { q: "What foods does it support?", a: `${totalFoods}+ Indian dishes across Andhra, Tamil Nadu, Kerala, Karnataka, Punjab, Bengal, Maharashtra, Gujarat, Rajasthan, and more — plus global foods, restaurant chains, fruits — growing every week.` },
];

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* ─── Hero ─── */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50/50 to-background dark:from-emerald-950/20 dark:via-background dark:to-background" />
      <div className="absolute top-20 -right-20 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-900/10" />
      <div className="absolute -bottom-10 -left-20 h-60 w-60 rounded-full bg-green-200/30 blur-3xl dark:bg-green-900/10" />

      <div className="relative container max-w-5xl px-4 pt-16 pb-12">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center text-center lg:flex-row lg:text-left lg:gap-12">

          {/* Left content */}
          <div className="flex-1">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-6">
              <Utensils className="h-3.5 w-3.5" /> Made for Indian Food Lovers
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Know what's on{" "}
              <span className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent">
                your plate
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-5 text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
              Snap a photo, scan a barcode, or just type — get instant calories & macro breakdown for <strong>{totalFoods}+ Indian dishes</strong> and global foods.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link to="/signup">
                <Button className="w-full sm:w-auto h-14 px-8 text-base font-bold rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg shadow-emerald-500/25">
                  <Camera className="h-5 w-5 mr-2" />
                  Start Free — 30 Days
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-2xl border-2">
                  Try Demo
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6 flex items-center justify-center lg:justify-start gap-5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-emerald-500" /> Privacy first</span>
              <span className="flex items-center gap-1.5"><Smartphone className="h-3.5 w-3.5 text-blue-500" /> Works on mobile</span>
              <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-500" /> No credit card</span>
            </motion.div>
          </div>

          {/* Right — Food preview cards */}
          <motion.div variants={fadeUp} className="mt-10 lg:mt-0 flex-shrink-0 w-full max-w-sm">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-card-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="text-sm font-bold text-foreground">Popular in India</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {popularFoods.map((food) => (
                  <div key={food.name} className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/20 p-3 transition-transform hover:scale-[1.03]">
                    <food.Icon className="text-emerald-600 dark:text-emerald-400" size={28} />
                    <p className="mt-1.5 text-xs font-bold text-foreground leading-tight">{food.name}</p>
                    <p className="text-[10px] text-muted-foreground">{food.cal}</p>
                    <span className="mt-1 inline-block rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 text-[9px] font-semibold text-emerald-600 dark:text-emerald-300">{food.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* ─── Regional Food Categories ─── */}
    <section className="py-12 px-4 border-t border-border/50">
      <div className="container max-w-5xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-2xl font-extrabold text-foreground text-center">
            We know <span className="text-emerald-500">your food</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-2 text-sm text-muted-foreground text-center">
            {totalFoods}+ dishes across every major Indian region — and growing
          </motion.p>

          {/* Regional categories */}
          <motion.h3 variants={fadeUp} className="mt-8 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center">
            By Region
          </motion.h3>
          <motion.div variants={fadeUp} className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {regionalCategories.map((cat) => {
              const IconComponent = categoryIconMap[cat.key] || ThaliIcon;
              return (
                <div key={cat.key} className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:shadow-md hover:-translate-y-0.5">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cat.color} text-white`}>
                    <IconComponent size={20} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-foreground block truncate">{cat.label}</span>
                    <span className="text-xs text-muted-foreground">{cat.count} items</span>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Functional categories */}
          <motion.h3 variants={fadeUp} className="mt-8 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center">
            By Type
          </motion.h3>
          <motion.div variants={fadeUp} className="mt-4 grid grid-cols-3 gap-3">
            {functionalCategories.map((cat) => {
              const IconComponent = categoryIconMap[cat.key] || ThaliIcon;
              return (
                <div key={cat.key} className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 transition hover:shadow-md hover:-translate-y-0.5">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${cat.color} text-white`}>
                    <IconComponent size={20} />
                  </div>
                  <span className="text-xs font-bold text-foreground text-center">{cat.label}</span>
                  <span className="text-[10px] text-muted-foreground">{cat.count} items</span>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* ─── Health Conditions ─── */}
    <section className="py-12 px-4 bg-gradient-to-b from-rose-50/40 to-background dark:from-rose-950/10 dark:to-background">
      <div className="container max-w-3xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-2xl font-extrabold text-foreground text-center">
            Not just fitness — <span className="text-rose-500">real health care</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-2 text-sm text-muted-foreground text-center max-w-lg mx-auto">
            Millions in India manage diabetes, high BP, or low BP every day. NutriSutra gives you meal-by-meal alerts tailored to your condition.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { Icon: DiabetesIcon, title: "Diabetes", desc: "Flags high sugar & carbs. Suggests low-GI alternatives like brown rice, millets, oats.", color: "border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/30", iconColor: "text-rose-500" },
              { Icon: BPHighIcon, title: "High Blood Pressure", desc: "Warns about excess sodium & saturated fat. Suggests skipping papad, pickle, extra salt.", color: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30", iconColor: "text-amber-500" },
              { Icon: BPLowIcon, title: "Low Blood Pressure", desc: "Alerts on too-light meals. Reminds to eat regularly and stay hydrated.", color: "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30", iconColor: "text-blue-500" },
            ].map((h) => (
              <div key={h.title} className={`rounded-2xl border p-5 ${h.color}`}>
                <h.Icon className={h.iconColor} size={32} />
                <h3 className="mt-2 text-sm font-bold text-foreground">{h.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </motion.div>
          <motion.div variants={fadeUp} className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950/30 p-4 flex items-start gap-3">
            <NightIcon className="text-indigo-500 shrink-0" size={28} />
            <div>
              <h3 className="text-sm font-bold text-foreground">Night Meal Alerts</h3>
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                Eating heavy at night? We'll warn you. Light dinners aid digestion and sleep — NutriSutra nudges you to keep dinner under 400 kcal.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* ─── Features ─── */}
    <section className="py-16 px-4 bg-gradient-to-b from-background to-emerald-50/30 dark:to-emerald-950/5">
      <div className="container max-w-5xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-2xl font-extrabold text-foreground text-center">
            Everything you need to eat smarter
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient}`}>
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-foreground">{f.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* ─── How it works ─── */}
    <section className="py-16 px-4">
      <div className="container max-w-3xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-2xl font-extrabold text-foreground text-center">
            3 ways to track
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { step: "01", Icon: Camera, title: "Snap a Photo", desc: "Take a photo of your meal — AI detects the food and shows full nutrition" },
              { step: "02", Icon: ScanBarcode, title: "Scan Barcode", desc: "Scan any packaged food barcode — instant nutrition from 3M+ products" },
              { step: "03", Icon: Search, title: "Type It", desc: "Search by name — biryani, dosa, pizza — and get accurate per-serving data" },
            ].map((s) => (
              <div key={s.step} className="relative rounded-2xl border border-border bg-card p-5 text-center">
                <span className="absolute -top-3 left-4 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold text-white">{s.step}</span>
                <div className="flex justify-center">
                  <s.Icon className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-foreground">{s.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* ─── Quick Tools ─── */}
    <section className="py-8 px-4">
      <div className="container max-w-lg">
        <h2 className="text-lg font-bold text-foreground mb-4">Quick Tools</h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            { Icon: Camera, label: "Analyze", link: "/analyze" },
            { Icon: Calculator, label: "Calculator", link: "/demo/calculator" },
            { Icon: Droplets, label: "Water", link: "/demo/water" },
          ].map((tool) => (
            <Link
              key={tool.label}
              to={tool.link}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 text-center transition hover:shadow-md hover:-translate-y-0.5"
            >
              <tool.Icon className="h-6 w-6 text-emerald-500" />
              <span className="text-xs font-semibold text-foreground">{tool.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* ─── FAQ ─── */}
    <section className="py-8 px-4 pb-16">
      <div className="container max-w-lg">
        <h2 className="text-lg font-bold text-foreground mb-4">FAQ</h2>
        <div className="space-y-2">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-border bg-card px-4 py-3">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-foreground">
                {f.q}
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180 text-muted-foreground shrink-0 ml-2" />
              </summary>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>

    {/* ─── Bottom CTA ─── */}
    <section className="px-4 pb-12">
      <div className="container max-w-lg">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-8 text-center">
          <h2 className="text-2xl font-extrabold text-white">Ready to eat smarter?</h2>
          <p className="mt-2 text-sm text-white/80">
            Free for 30 days. Track every meal. Know every calorie.
          </p>
          <Link to="/signup">
            <Button className="mt-6 h-12 bg-white text-emerald-600 font-bold rounded-2xl px-8 hover:bg-white/90 shadow-lg">
              Sign Up Free <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Index;
