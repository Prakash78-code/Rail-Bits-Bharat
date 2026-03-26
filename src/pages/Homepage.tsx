import { Link } from "react-router-dom";
import { Train, Users, ChefHat, ShieldCheck, Briefcase, ArrowRight, Utensils, BarChart3 } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { useApp } from "@/store/AppContext";

export default function Homepage() {
  const { state } = useApp();
  const totalJobs = state.jobs.vendors + state.jobs.delivery + state.jobs.kitchen + state.jobs.hygiene;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero text-primary-foreground py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, hsl(24 95% 53% / 0.3) 0%, transparent 70%), radial-gradient(circle at 80% 20%, hsl(24 95% 53% / 0.2) 0%, transparent 50%)" }} />
        <div className="container mx-auto relative z-10 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-sm mb-6 animate-fade-in">
            <Train className="h-4 w-4" />
            <span>Transforming Railway Food Foundation</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Digitizing Railway Food with{" "}
            <span className="text-gradient">Transparency & Jobs</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            A smart food network connecting passengers with verified vendors, ensuring quality, accountability, and employment generation across Indian Railways.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link
              to="/passenger"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-saffron text-accent-foreground font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse-glow"
            >
              <Utensils className="h-5 w-5" />
              Order Food Now
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground font-semibold text-lg hover:bg-primary-foreground/20 transition-all duration-300"
            >
              <BarChart3 className="h-5 w-5" />
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Jobs Counter */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold mb-2">
              🇮🇳 Pilot Jobs Generated
            </h2>
            <div className="text-5xl md:text-7xl font-display font-bold text-accent mb-6">
              <AnimatedCounter end={totalJobs + state.orders.length} />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: ChefHat, label: "Vendors", count: state.jobs.vendors, color: "text-accent" },
              { icon: Users, label: "Delivery Partners", count: state.jobs.delivery, color: "text-emerald" },
              { icon: Briefcase, label: "Kitchen Staff", count: state.jobs.kitchen, color: "text-navy-light" },
              { icon: ShieldCheck, label: "Hygiene Officers", count: state.jobs.hygiene, color: "text-warning" },
            ].map((item) => (
              <div key={item.label} className="bg-background rounded-xl p-6 text-center border border-border hover:shadow-lg transition-shadow duration-300">
                <item.icon className={`h-8 w-8 mx-auto mb-3 ${item.color}`} />
                <div className="text-3xl font-display font-bold mb-1">
                  <AnimatedCounter end={item.count} />
                </div>
                <div className="text-sm text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="font-display text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Enter PNR", desc: "Enter your train PNR to see available stations and vendors along your route." },
              { step: "02", title: "Choose & Order", desc: "Pick from verified vendors with hygiene ratings, browse menus, and place your order." },
              { step: "03", title: "Track & Rate", desc: "Get ETA, QR delivery code, and rate your experience to maintain accountability." },
            ].map((item) => (
              <div key={item.step} className="relative p-6 bg-card rounded-xl border border-border hover:border-accent/50 transition-all duration-300 group">
                <div className="text-5xl font-display font-bold text-accent/20 group-hover:text-accent/40 transition-colors mb-4">{item.step}</div>
                <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-10 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Train className="h-5 w-5 text-accent" />
            <span className="font-display font-bold">RailBite Bharat</span>
          </div>
          <p className="text-primary-foreground/60 text-sm">
            Smart Railway Food & Employment Network • Hackathon MVP 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
