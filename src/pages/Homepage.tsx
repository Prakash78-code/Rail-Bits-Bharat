import { Link } from "react-router-dom";
import {
  Train, Users, ChefHat, ShieldCheck, Briefcase, ArrowRight,
  Utensils, BarChart3, Star, MapPin, Zap, Shield, Heart, TrendingUp,
} from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { useApp } from "@/store/AppContext";
import { useState, useEffect } from "react";

const FEATURED_VENDORS = [
  { name: "Annapurna Kitchen", station: "Varanasi Jn.", rating: 4.6, orders: 412, cuisine: "North Indian", isShg: false, emoji: "🍛" },
  { name: "Priya SHG Catering", station: "Chennai Central", rating: 4.4, orders: 331, cuisine: "South Indian", isShg: true, emoji: "🥘" },
  { name: "Bengal Kitchen", station: "Howrah Jn.", rating: 4.5, orders: 376, cuisine: "Bengali", isShg: false, emoji: "🐟" },
  { name: "Rajasthan Swad SHG", station: "Jaipur", rating: 4.7, orders: 193, cuisine: "Rajasthani", isShg: true, emoji: "🫓" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Enter PNR", desc: "Enter your 10-digit PNR to instantly fetch train details, route, and upcoming stations.", icon: "🎫" },
  { step: "02", title: "Pick & Order", desc: "Browse verified vendors at your next stop. Filter by veg, cuisine, rating, and price.", icon: "🍽️" },
  { step: "03", title: "Live Tracking", desc: "Pay securely via UPI or card. Track your order live with real-time ETA updates.", icon: "📡" },
];

const FEATURES = [
  { icon: Shield, title: "FSSAI Verified Vendors", desc: "Every vendor is certified, verified, and hygiene-rated by our quality team." },
  { icon: Zap, title: "Real-time Tracking", desc: "Live GPS delivery tracking with Socket.io — know exactly when food arrives." },
  { icon: Heart, title: "SHG Empowerment", desc: "Supporting women-led Self Help Groups across 15+ railway stations." },
  { icon: TrendingUp, title: "AI Demand Forecast", desc: "Smart ordering predictions help vendors prepare the right amount of food." },
];

export default function Homepage() {
  const { state } = useApp();
  const totalJobs = state.jobs.vendors + state.jobs.delivery + state.jobs.kitchen + state.jobs.hygiene;
  const [trainPos, setTrainPos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrainPos(p => (p > 110 ? -20 : p + 0.3));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="gradient-hero text-white pt-28 pb-20 px-4 relative overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl" />
        </div>

        {/* Animated train track */}
        <div className="absolute bottom-16 left-0 right-0 overflow-hidden pointer-events-none">
          <div className="track-line opacity-20 mb-1" />
          <div style={{ transform: `translateX(${trainPos}%)`, transition: "none" }} className="inline-block text-3xl">
            🚂
          </div>
          <div className="track-line opacity-20 mt-1" />
        </div>

        <div className="container mx-auto max-w-5xl relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-8 animate-fade-in backdrop-blur-sm">
            <Train className="h-4 w-4 text-amber-300" />
            <span>Transforming Railway Food Across India</span>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Fresh Food Delivered
            <br />
            <span className="text-gradient">To Your Seat</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Order from verified local vendors at railway stations. Real-time tracking,
            FSSAI-certified quality, and support for women-led SHG businesses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link
              to="/passenger"
              id="cta-order-food"
              className="btn-primary text-base px-8 py-4 animate-pulse-glow"
            >
              <Utensils className="h-5 w-5" />
              Order Food Now
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/vendor-register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-base hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
            >
              <ChefHat className="h-5 w-5" />
              Become a Vendor
            </Link>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 mt-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "15+", label: "Stations" },
              { value: "8", label: "Verified Vendors" },
              { value: "4.5★", label: "Avg Rating" },
              { value: "₹40–350", label: "Price Range" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-display font-bold text-amber-300">{s.value}</div>
                <div className="text-xs text-white/60 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Jobs Counter ──────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-card border-b border-border">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <TrendingUp className="h-4 w-4" />
              Live Impact Counter
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
              🇮🇳 Jobs Generated in Pilot
            </h2>
            <div className="text-6xl md:text-8xl font-display font-bold text-gradient my-6">
              <AnimatedCounter end={totalJobs + state.orders.length} />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: ChefHat, label: "Vendors", count: state.jobs.vendors, color: "text-accent", bg: "bg-accent/10" },
              { icon: Users, label: "Delivery Partners", count: state.jobs.delivery + state.orders.length, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { icon: Briefcase, label: "Kitchen Staff", count: state.jobs.kitchen, color: "text-blue-500", bg: "bg-blue-500/10" },
              { icon: ShieldCheck, label: "Hygiene Officers", count: state.jobs.hygiene, color: "text-amber-500", bg: "bg-amber-500/10" },
            ].map(item => (
              <div key={item.label} className="bg-background rounded-2xl p-6 text-center border border-border card-hover group">
                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div className="text-3xl font-display font-bold mb-1">
                  <AnimatedCounter end={item.count} />
                </div>
                <div className="text-sm text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">From PNR to plate — order fresh food delivered to your railway seat in 3 easy steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((item, i) => (
              <div
                key={item.step}
                className="relative p-6 bg-card rounded-2xl border border-border card-hover card-glow group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-6xl font-display font-bold text-accent/10 group-hover:text-accent/20 transition-colors absolute top-4 right-4">
                  {item.step}
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Vendors ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold mb-2">Featured Vendors</h2>
              <p className="text-muted-foreground">FSSAI-verified, top-rated across Indian railway stations</p>
            </div>
            <Link to="/passenger" className="btn-outline text-sm px-4 py-2 hidden sm:flex">
              View All
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_VENDORS.map(vendor => (
              <div key={vendor.name} className="bg-card rounded-2xl p-5 border border-border card-hover card-glow">
                <div className="text-4xl mb-3 animate-float">{vendor.emoji}</div>
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-display font-semibold text-sm leading-tight">{vendor.name}</h3>
                  {vendor.isShg && (
                    <span className="badge-shg text-[10px] ml-1 shrink-0">SHG</span>
                  )}
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold">{vendor.rating}</span>
                  <span className="text-xs text-muted-foreground">• {vendor.orders} orders</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{vendor.station}</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">{vendor.cuisine}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Why RailBite Bharat?</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="flex gap-4 p-6 bg-card rounded-2xl border border-border card-hover">
                <div className="w-12 h-12 rounded-xl gradient-saffron flex items-center justify-center shrink-0">
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 gradient-hero text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to order your next railway meal?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Join thousands of passengers enjoying fresh, hygienic food on their train journeys.
          </p>
          <Link to="/passenger" className="btn-primary text-lg px-10 py-4">
            <Utensils className="h-5 w-5" />
            Order Now — It's Easy
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-primary text-primary-foreground py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Train className="h-5 w-5 text-amber-300" />
                <span className="font-display font-bold text-lg">RailBite Bharat</span>
              </div>
              <p className="text-primary-foreground/60 text-sm">
                Smart Railway Food & Employment Network
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-primary-foreground/80">Quick Links</h4>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Order Food", href: "/passenger" },
                  { label: "Vendor Portal", href: "/vendor" },
                  { label: "SHG Program", href: "/shg" },
                  { label: "Admin Dashboard", href: "/admin" },
                ].map(l => (
                  <Link key={l.href} to={l.href} className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-primary-foreground/80">Legal</h4>
              <div className="flex flex-col gap-2 text-primary-foreground/60 text-sm">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>FSSAI Compliance</span>
                <span>IRCTC Guidelines</span>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/10 pt-6 text-center text-primary-foreground/40 text-sm">
            © 2026 RailBite Bharat • Made with ❤️ for Indian Railways
          </div>
        </div>
      </footer>
    </div>
  );
}
