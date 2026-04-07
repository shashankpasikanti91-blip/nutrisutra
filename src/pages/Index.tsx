import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Camera, Search, BarChart3, Zap, Utensils, Flame, ScanBarcode, Heart,
  ChevronDown, ArrowRight, Star, Shield, Smartphone, Calculator, Droplets,
  CheckCircle, TrendingUp, BrainCircuit, Leaf,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ThaliIcon, StreetFoodIcon,
  BreakfastIcon, SamosaIcon, SweetIcon, FishIcon,
  DiabetesIcon, BPHighIcon, BPLowIcon, NightIcon,
} from "@/components/FoodIcons";
import { getRegionalCategoryCounts, getFunctionalCategoryCounts, getTotalFoodCount } from "@/lib/food-catalog";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } } };
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const popularFoods = [
  { name: "Biryani", emoji: "🍛", cal: "350 kcal", tag: "Hyderabadi", color: "from-orange-400 to-red-500" },
  { name: "Masala Dosa", emoji: "🫓", cal: "210 kcal", tag: "South Indian", color: "from-yellow-400 to-orange-500" },
  { name: "Butter Chicken", emoji: "🍗", cal: "240 kcal", tag: "North Indian", color: "from-red-400 to-rose-500" },
  { name: "Idli Sambar", emoji: "🍥", cal: "95 kcal", tag: "Breakfast", color: "from-emerald-400 to-teal-500" },
  { name: "Chole Bhature", emoji: "🧆", cal: "450 kcal", tag: "Punjabi", color: "from-amber-400 to-yellow-500" },
  { name: "Pav Bhaji", emoji: "🍞", cal: "320 kcal", tag: "Street Food", color: "from-pink-400 to-rose-500" },
];

const foodTicker = [
  "🍛 Biryani", "� Masala Dosa", "🍗 Butter Chicken", "🫕 Dal Makhani", "🧆 Samosa",
  "🍽️ Thali", "🫔 Paratha", "🍜 Ramen", "🍕 Pizza", "🍔 Burger",
  "🥗 Salad", "🍣 Sushi", "🌮 Tacos", "🍲 Curry", "🥙 Shawarma",
  "🍝 Pasta", "🦐 Prawn Fry", "🍮 Gulab Jamun", "🍨 Kheer", "🥟 Momos",
  "🫙 Idli", "🥘 Chole", "🍚 Pulao", "🥞 Uttapam", "🌯 Frankie",
  "🧁 Halwa", "🥜 Peanut Chaat", "🍳 Omelette", "🥑 Grilled Veggies", "🫖 Green Tea",
];

// Regional categories computed from actual food catalog
const regionalCategories = getRegionalCategoryCounts();
const functionalCategories = getFunctionalCategoryCounts();
const totalFoods = getTotalFoodCount();

const categoryIconMap: Record<string, React.FC<{ className?: string; size?: number }>> = {
  "Andhra/Telangana": ThaliIcon,
  "Tamil Nadu": ThaliIcon,
  "South India": ThaliIcon,
  "Punjabi/North": ThaliIcon,
  "Rajasthan": SamosaIcon,
  "Maharashtra": StreetFoodIcon,
  "Gujarat": SweetIcon,
  "West Bengal": FishIcon,
  "Odisha": ThaliIcon,
  "Bihar/Jharkhand": ThaliIcon,
  "Assam": FishIcon,
  "Breakfast": BreakfastIcon,
  "Main Course": ThaliIcon,
  "Street Food": StreetFoodIcon,
};

const features = [
  { icon: Camera, title: "AI Photo Analysis", desc: "Point your camera at any meal — AI identifies food and shows full nutrition instantly", gradient: "from-violet-500 to-purple-600", bg: "bg-violet-50 dark:bg-violet-950/20" },
  { icon: ScanBarcode, title: "Barcode Scanner", desc: "Scan packaged food — pulls nutrition from millions of products worldwide", gradient: "from-blue-500 to-cyan-500", bg: "bg-blue-50 dark:bg-blue-950/20" },
  { icon: Search, title: `${totalFoods}+ Indian Foods`, desc: "Biryani, dosa, paneer tikka, vada pav — we know desi food better than anyone", gradient: "from-emerald-400 to-teal-500", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
  { icon: BarChart3, title: "Full Macro Breakdown", desc: "Protein, carbs, fat, fiber, sugar, sodium — complete picture at a glance", gradient: "from-sky-400 to-blue-500", bg: "bg-sky-50 dark:bg-sky-950/20" },
  { icon: BrainCircuit, title: "AI Diet Guide", desc: "Evening AI analysis tells you exactly what to eat tonight to hit your goal", gradient: "from-indigo-400 to-violet-500", bg: "bg-indigo-50 dark:bg-indigo-950/20" },
  { icon: Heart, title: "Health Condition Alerts", desc: "Diabetes, high BP, low BP — personalized warnings and safer food suggestions", gradient: "from-rose-400 to-red-500", bg: "bg-rose-50 dark:bg-rose-950/20" },
  { icon: Flame, title: "Streak & Insights", desc: "7-day trends, calorie charts, macro splits, and daily streaks to keep you on track", gradient: "from-orange-400 to-amber-500", bg: "bg-orange-50 dark:bg-orange-950/20" },
  { icon: Leaf, title: "Smart Portions", desc: "Real serving sizes — 1 idli = 40g, 1 roti = 35g, not random guesses", gradient: "from-green-400 to-emerald-500", bg: "bg-green-50 dark:bg-green-950/20" },
  { icon: TrendingUp, title: "Goal Tracking", desc: "Weight loss, maintenance, or muscle gain — daily progress toward your target", gradient: "from-amber-400 to-orange-500", bg: "bg-amber-50 dark:bg-amber-950/20" },
];

const testimonials = [
  { name: "Priya S.", city: "Hyderabad", text: "Finally an app that actually knows what Gongura Chicken is! Tracks my biryani cravings without judgment 😄", stars: 5 },
  { name: "Rahul M.", city: "Chennai", text: "The AI food photo feature is mind-blowing. Scanned my home-cooked sambar rice and got perfect macros in seconds.", stars: 5 },
  { name: "Ananya K.", city: "Bengaluru", text: "As a diabetic I love the health alerts. It warns me before I eat something too high in carbs. Game changer!", stars: 5 },
];

const faqs = [
  { q: "How accurate are the calorie estimates?", a: "NutriSutra uses a deterministic engine — same input always gives the same result. We show confidence levels, never fake exact numbers." },
  { q: "Does it support homemade vs restaurant food?", a: "Yes. Select cooking style with one tap and we adjust calories with realistic multipliers." },
  { q: "Is it free to use?", a: "Sign up free and get full access for 30 days — no credit card needed. After that, upgrade to Pro starting ₹199/month." },
  { q: "What foods does it support?", a: `${totalFoods}+ Indian dishes across Andhra, Tamil Nadu, Kerala, Karnataka, Punjab, Bengal, Maharashtra, Gujarat, Rajasthan, and more — plus global foods, restaurant chains, fruits — growing every week.` },
  { q: "Can I use it without creating an account?", a: "Yes! Try the free Demo mode — explore our full food database, calorie calculator, and water tracker without signing up." },
];

const Index = () => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    <Navbar />

    {/* ─── Hero ─── */}
    <section className="relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50/40 to-background dark:from-emerald-950/20 dark:via-background dark:to-background" />
      <div className="absolute top-10 -right-32 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-900/15" />
      <div className="absolute -bottom-20 -left-32 h-80 w-80 rounded-full bg-teal-300/20 blur-3xl dark:bg-teal-900/10" />
      <div className="absolute top-40 left-1/2 h-60 w-60 rounded-full bg-green-200/15 blur-3xl dark:bg-green-900/10" />

      <div className="relative container max-w-6xl px-4 pt-16 pb-16">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center text-center lg:flex-row lg:text-left lg:gap-16 lg:items-start">

          {/* Left content */}
          <div className="flex-1 lg:pt-4">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-4 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-6">
              <Utensils className="h-3.5 w-3.5" /> India's #1 AI Food Tracker
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Know exactly what's<br />
              <span className="relative">
                <span className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent">
                  on your plate
                </span>
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Snap a photo, scan a barcode, or search by name — get instant calories & macros for <strong className="text-foreground">{totalFoods}+ Indian dishes</strong> and global foods, powered by AI.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link to="/signup">
                <Button className="w-full sm:w-auto h-14 px-8 text-base font-bold rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-xl shadow-emerald-500/30 transition-all hover:scale-[1.02] hover:shadow-emerald-500/40">
                  <Camera className="h-5 w-5 mr-2" /> Start Free — 30 Days
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-2xl border-2 hover:bg-muted/50">
                  Try Demo →
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-emerald-500" /> Privacy first</span>
              <span className="flex items-center gap-1.5"><Smartphone className="h-3.5 w-3.5 text-blue-500" /> Works on mobile</span>
              <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-500" /> No credit card</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-teal-500" /> Free 30 days</span>
            </motion.div>
          </div>

          {/* Right — App preview card */}
          <motion.div variants={fadeUp} className="mt-12 lg:mt-0 flex-shrink-0 w-full max-w-sm">
            <div className="relative rounded-3xl border border-border/60 bg-card/90 backdrop-blur-sm p-5 shadow-2xl shadow-emerald-500/10">
              {/* Status bar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-foreground">Live Analysis</span>
                </div>
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">AI Powered</span>
              </div>

              {/* Food cards grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {popularFoods.map((food) => (
                  <div key={food.name} className="group relative rounded-2xl overflow-hidden bg-muted/50 p-3.5 transition-all hover:scale-[1.04] hover:shadow-lg cursor-pointer">
                    <div className={`absolute inset-0 bg-gradient-to-br ${food.color} opacity-0 group-hover:opacity-8 transition-opacity`} />
                    <span className="text-3xl" role="img" aria-label={food.name}>{food.emoji}</span>
                    <p className="mt-1.5 text-xs font-bold text-foreground leading-tight">{food.name}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{food.cal}</p>
                    <span className="mt-1.5 inline-block rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-300">{food.tag}</span>
                  </div>
                ))}
              </div>

              {/* Bottom stat */}
              <div className="mt-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 px-4 py-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Total today</span>
                <span className="text-sm font-extrabold text-emerald-600">1,665 kcal</span>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-3 mx-auto w-fit flex items-center gap-2 rounded-2xl bg-white dark:bg-card border border-border px-4 py-2 shadow-lg"
            >
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold text-foreground">Instant results — under 3 seconds</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* ─── Scrolling food ticker ─── */}
    <div className="border-y border-border/50 bg-muted/30 py-3 overflow-hidden">
      <motion.div
        className="flex gap-6 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {[...foodTicker, ...foodTicker].map((item, i) => (
          <span key={i} className="text-sm font-medium text-muted-foreground shrink-0">{item}</span>
        ))}
      </motion.div>
    </div>

    {/* ─── Stats bar ─── */}
    <section className="py-10 px-4 border-b border-border/50">
      <div className="container max-w-4xl">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {[
            { value: `${totalFoods}+`, label: "Indian Dishes", icon: "🍛", color: "text-emerald-600" },
            { value: "30+", label: "Cuisines", icon: "🌍", color: "text-blue-600" },
            { value: "3 sec", label: "Avg Analysis", icon: "⚡", color: "text-amber-600" },
            { value: "Free", label: "30-Day Trial", icon: "🎁", color: "text-violet-600" },
          ].map((s) => (
            <motion.div key={s.label} variants={fadeUp} className="text-center rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ─── How it works ─── */}
    <section className="py-16 px-4 bg-gradient-to-b from-background to-emerald-50/40 dark:to-emerald-950/5">
      <div className="container max-w-4xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-10">
            <span className="inline-flex text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full mb-3">How It Works</span>
            <h2 className="text-3xl font-extrabold text-foreground">Track your food in <span className="text-emerald-500">3 simple ways</span></h2>
          </motion.div>
          <motion.div variants={stagger} className="grid gap-5 sm:grid-cols-3">
            {[
              { step: "01", Icon: Camera, title: "Snap a Photo", desc: "Take a photo of your meal — AI detects food and returns macros in under 3 seconds", gradient: "from-violet-500 to-purple-600", emoji: "📸" },
              { step: "02", Icon: ScanBarcode, title: "Scan a Barcode", desc: "Scan any packaged food — pulls nutrition from millions of products globally", gradient: "from-blue-500 to-cyan-500", emoji: "🔍" },
              { step: "03", Icon: Search, title: "Type & Search", desc: "Search free-text — 'masala dosa large' or 'chicken biryani' — get accurate results instantly", gradient: "from-emerald-400 to-teal-500", emoji: "✍️" },
            ].map((s) => (
              <motion.div key={s.step} variants={fadeUp} className="relative rounded-3xl border border-border bg-card p-6 text-center shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group">
                <div className={`absolute -top-3.5 left-5 rounded-xl bg-gradient-to-r ${s.gradient} px-3 py-1 text-[11px] font-bold text-white shadow-md`}>{s.step}</div>
                <div className="text-4xl mb-3 mt-2">{s.emoji}</div>
                <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} shadow-md`}>
                  <s.Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-base font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div variants={fadeUp} className="mt-8 text-center">
            <Link to="/analyze">
              <Button className="h-12 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all">
                <Camera className="h-4 w-4 mr-2" /> Try Analyzing Food Now
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* ─── Food Database ─── */}
    <section className="py-16 px-4">
      <div className="container max-w-5xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-10">
            <span className="inline-flex text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-3 py-1.5 rounded-full mb-3">Food Database</span>
            <h2 className="text-3xl font-extrabold text-foreground">We know <span className="text-emerald-500">your food</span></h2>
            <p className="mt-2 text-muted-foreground">{totalFoods}+ dishes across every Indian region — and growing every week</p>
          </motion.div>

          {/* Regional grid — modern pill style */}
          <motion.div variants={stagger} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {regionalCategories.map((cat) => {
              const IconComponent = categoryIconMap[cat.key] || ThaliIcon;
              return (
                <motion.div
                  key={cat.key}
                  variants={fadeUp}
                  className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-emerald-300 dark:hover:border-emerald-700 cursor-default"
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cat.color} text-white shadow-sm group-hover:scale-110 transition-transform`}>
                    <IconComponent size={22} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-foreground block truncate">{cat.label}</span>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{cat.count} dishes</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* By type — horizontal scroll chips */}
          <motion.div variants={fadeUp} className="mt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">By Category</p>
            <div className="flex flex-wrap gap-2">
              {functionalCategories.map((cat) => {
                const IconComponent = categoryIconMap[cat.key] || ThaliIcon;
                return (
                  <div
                    key={cat.key}
                    className={`flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-default`}
                  >
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${cat.color} text-white`}>
                      <IconComponent size={13} />
                    </div>
                    <span className="text-sm font-semibold text-foreground">{cat.label}</span>
                    <span className="text-xs text-muted-foreground">{cat.count}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* ─── Features grid ─── */}
    <section className="py-16 px-4 bg-gradient-to-b from-slate-50/60 to-background dark:from-slate-900/20 dark:to-background">
      <div className="container max-w-5xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-10">
            <span className="inline-flex text-xs font-bold uppercase tracking-widest text-violet-600 bg-violet-100 dark:bg-violet-900/30 px-3 py-1.5 rounded-full mb-3">Features</span>
            <h2 className="text-3xl font-extrabold text-foreground">Everything you need to <span className="text-emerald-500">eat smarter</span></h2>
          </motion.div>
          <motion.div variants={stagger} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp} className={`rounded-3xl border border-border/60 ${f.bg} p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.gradient} shadow-md group-hover:scale-110 transition-transform`}>
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-foreground">{f.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* ─── Health Conditions ─── */}
    <section className="py-16 px-4">
      <div className="container max-w-4xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-10">
            <span className="inline-flex text-xs font-bold uppercase tracking-widest text-rose-600 bg-rose-100 dark:bg-rose-900/30 px-3 py-1.5 rounded-full mb-3">Health Smart</span>
            <h2 className="text-3xl font-extrabold text-foreground">Not just fitness — <span className="text-rose-500">real health care</span></h2>
            <p className="mt-2 text-muted-foreground max-w-lg mx-auto">Millions in India manage diabetes, high BP, or low BP. NutriSutra gives meal-by-meal alerts for your condition.</p>
          </motion.div>

          <motion.div variants={stagger} className="grid gap-4 sm:grid-cols-3">
            {[
              { Icon: DiabetesIcon, title: "Diabetes", desc: "Flags high sugar & carbs. Suggests low-GI alternatives like brown rice, millets, oats.", gradient: "from-rose-400 to-red-500", bg: "bg-rose-50 dark:bg-rose-950/20", border: "border-rose-200 dark:border-rose-900" },
              { Icon: BPHighIcon, title: "High Blood Pressure", desc: "Warns about excess sodium & saturated fat. Suggests skipping papad, pickle, extra salt.", gradient: "from-amber-400 to-orange-500", bg: "bg-amber-50 dark:bg-amber-950/20", border: "border-amber-200 dark:border-amber-900" },
              { Icon: BPLowIcon, title: "Low Blood Pressure", desc: "Alerts on too-light meals. Reminds to eat regularly and maintain electrolyte balance.", gradient: "from-blue-400 to-sky-500", bg: "bg-blue-50 dark:bg-blue-950/20", border: "border-blue-200 dark:border-blue-900" },
            ].map((h) => (
              <motion.div key={h.title} variants={fadeUp} className={`rounded-3xl border ${h.border} ${h.bg} p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${h.gradient} shadow-md`}>
                  <h.Icon className="text-white" size={24} />
                </div>
                <h3 className="mt-3 text-sm font-bold text-foreground">{h.title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{h.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-4 rounded-3xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/20 p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 shadow-md">
              <NightIcon className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">AI Night Meal Guide</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Every evening, our AI analyses your day and suggests exactly what to eat for dinner to hit your calorie and macro goals — whether you're losing weight or building muscle.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* ─── Testimonials ─── */}
    <section className="py-16 px-4 bg-gradient-to-b from-emerald-50/40 to-background dark:from-emerald-950/10 dark:to-background">
      <div className="container max-w-4xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-10">
            <span className="inline-flex text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-3 py-1.5 rounded-full mb-3">Loved By Users</span>
            <h2 className="text-3xl font-extrabold text-foreground">What people are saying</h2>
          </motion.div>
          <motion.div variants={stagger} className="grid gap-4 sm:grid-cols-3">
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeUp} className="rounded-3xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed">"{t.text}"</p>
                <div className="mt-4 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground">{t.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* ─── Quick Tools ─── */}
    <section className="py-12 px-4">
      <div className="container max-w-4xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-foreground">Quick Tools</h2>
              <p className="text-sm text-muted-foreground">No login needed</p>
            </div>
          </motion.div>
          <motion.div variants={stagger} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { Icon: Camera, label: "AI Food Analyzer", sub: "Photo · Barcode · Search", link: "/analyze", gradient: "from-violet-500 to-purple-600" },
              { Icon: Calculator, label: "Calorie Calculator", sub: "Daily intake based on your goals", link: "/demo/calculator", gradient: "from-blue-500 to-cyan-500" },
              { Icon: Droplets, label: "Water Tracker", sub: "Stay hydrated all day", link: "/demo/water", gradient: "from-sky-400 to-blue-500" },
            ].map((tool) => (
              <motion.div key={tool.label} variants={fadeUp}>
                <Link
                  to={tool.link}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-emerald-300 dark:hover:border-emerald-700 group"
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tool.gradient} shadow-md group-hover:scale-110 transition-transform`}>
                    <tool.Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{tool.label}</p>
                    <p className="text-xs text-muted-foreground">{tool.sub}</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* ─── FAQ ─── */}
    <section className="py-12 px-4 pb-16">
      <div className="container max-w-2xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-8">
            <span className="inline-flex text-xs font-bold uppercase tracking-widest text-slate-600 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full mb-3">FAQ</span>
            <h2 className="text-2xl font-extrabold text-foreground">Common questions</h2>
          </motion.div>
          <motion.div variants={stagger} className="space-y-2">
            {faqs.map((f) => (
              <motion.details key={f.q} variants={fadeUp} className="group rounded-2xl border border-border bg-card px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-bold text-foreground list-none">
                  {f.q}
                  <ChevronDown className="h-4 w-4 transition-transform duration-300 group-open:rotate-180 text-muted-foreground shrink-0 ml-3" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">{f.a}</p>
              </motion.details>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* ─── Bottom CTA ─── */}
    <section className="px-4 pb-16">
      <div className="container max-w-2xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-10 text-center shadow-2xl shadow-emerald-500/25">
            {/* Glassmorphism blobs */}
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-teal-300/20 blur-2xl" />
            <div className="relative">
              <p className="text-sm font-bold text-white/80 mb-2">Start your journey today</p>
              <h2 className="text-3xl font-extrabold text-white">Ready to eat smarter?</h2>
              <p className="mt-2 text-sm text-white/75 max-w-sm mx-auto">
                Free for 30 days. Track every meal. Know every calorie. No credit card required.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/signup">
                  <Button className="h-12 bg-white text-emerald-700 font-bold rounded-2xl px-8 hover:bg-white/95 shadow-xl transition-all hover:scale-[1.02]">
                    Sign Up Free <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button variant="outline" className="h-12 border-white/40 text-white font-semibold rounded-2xl px-8 bg-white/10 hover:bg-white/20 transition-all">
                    Try Demo First
                  </Button>
                </Link>
              </div>
              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-white/70">
                <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> 30 days free</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> No credit card</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Cancel anytime</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Index;
