import { useState } from "react";
import { Heart, Users, MapPin, Phone, Mail, ChevronRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BENEFITS = [
  { emoji: "💰", title: "Guaranteed Income", desc: "Stable orders from thousands of railway passengers daily" },
  { emoji: "🏦", title: "Easy Credit Access", desc: "Linked to PM FME & SHG bank credit schemes" },
  { emoji: "📱", title: "Digital Payments", desc: "Direct UPI payouts within T+1 days — no middlemen" },
  { emoji: "🎓", title: "Free Training", desc: "Food safety, packaging, and digital literacy workshops" },
  { emoji: "🌟", title: "SHG Badge", desc: "Prominent SHG badge builds trust with customers" },
  { emoji: "📈", title: "AI Demand Tools", desc: "Smart forecasting helps plan production efficiently" },
];

export default function SHGPortal() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    shgName: "", district: "", state: "", nabardId: "",
    chairperson: "", members: "", cuisines: "", capacity: "",
    phone: "", email: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="bg-card rounded-2xl p-10 border border-border text-center max-w-md w-full animate-scale-in">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="font-display text-2xl font-bold mb-2">Application Received!</h2>
          <p className="text-muted-foreground mb-6">Welcome to the RailBite Bharat SHG family, <strong>{form.shgName}</strong>!</p>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 text-sm text-purple-800 dark:text-purple-300 mb-6">
            Our SHG support team will contact you at {form.phone} within 48 hours.
          </div>
          <button onClick={() => navigate("/")} className="btn-primary w-full">Back to Home</button>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="min-h-screen pt-20 pb-10 px-4">
        <div className="container mx-auto max-w-xl">
          <button onClick={() => setShowForm(false)} className="flex items-center gap-1 text-sm text-accent hover:underline mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to SHG Portal
          </button>
          <h2 className="font-display text-2xl font-bold mb-6">SHG Registration Form</h2>
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 space-y-4">
            {[
              { key: "shgName", label: "SHG Name *", placeholder: "e.g. Mahila Udyog SHG" },
              { key: "nabardId", label: "NABARD/SHG ID *", placeholder: "Your government SHG registration ID" },
              { key: "chairperson", label: "Chairperson Name *", placeholder: "Full name" },
              { key: "district", label: "District *", placeholder: "e.g. Varanasi" },
              { key: "state", label: "State *", placeholder: "e.g. Uttar Pradesh" },
              { key: "members", label: "Member Count *", placeholder: "Number of active members" },
              { key: "cuisines", label: "Speciality Cuisines *", placeholder: "e.g. North Indian, Bengali sweets" },
              { key: "capacity", label: "Monthly Production Capacity", placeholder: "e.g. 500 meals/month" },
              { key: "phone", label: "Contact Phone *", placeholder: "+91 XXXXXXXXXX" },
              { key: "email", label: "Email Address", placeholder: "shg@example.com" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-sm font-medium mb-1 block">{f.label}</label>
                <input
                  value={form[f.key as keyof typeof form]}
                  onChange={e => setForm(ff => ({...ff, [f.key]: e.target.value}))}
                  placeholder={f.placeholder}
                  className="input-base"
                  required={f.label.includes("*")}
                />
              </div>
            ))}
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-sm text-purple-800 dark:text-purple-300">
              📋 You'll receive FSSAI guidance, packaging support, and digital training after approval.
            </div>
            <button type="submit" className="btn-primary w-full py-4 text-base">
              <Heart className="h-5 w-5" /> Submit SHG Application
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-16 px-4 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl" />
        </div>
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6">
            <Heart className="h-4 w-4 text-pink-300" />
            Empowering Women Entrepreneurs Across India
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            SHG Vendor Program
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join the RailBite Bharat family as a Self Help Group vendor. Earn stable income,
            access government schemes, and bring your community's flavors to Indian Railways.
          </p>
          <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-purple-900 font-bold text-lg hover:bg-white/90 transition-all shadow-xl">
            <Heart className="h-5 w-5" /> Register Your SHG
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 bg-purple-50 dark:bg-purple-950/30">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { value: "2", label: "SHG Vendors Active" },
              { value: "524", label: "Orders Fulfilled" },
              { value: "₹2.1L", label: "Earned by SHGs" },
              { value: "18", label: "Women Empowered" },
            ].map(s => (
              <div key={s.label} className="bg-white dark:bg-purple-900/30 rounded-2xl p-4 border border-purple-200 dark:border-purple-800">
                <div className="font-display text-2xl font-bold text-purple-700 dark:text-purple-300">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-center mb-10">Why Join as SHG?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map(b => (
              <div key={b.title} className="bg-card rounded-2xl p-5 border border-border card-hover">
                <div className="text-3xl mb-3">{b.emoji}</div>
                <h3 className="font-display font-bold mb-1">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Schemes */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold mb-6">Linked Government Schemes</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { name: "PM FME Scheme", desc: "PM Formalization of Micro Food Enterprises — subsidies up to ₹10 lakh", link: "pmfme.mofpi.gov.in" },
              { name: "SHG Bank Credit", desc: "Priority lending at 7% interest for NABARD-registered SHG groups", link: "nabard.org" },
              { name: "FSSAI Basic Registration", desc: "Food safety license at just ₹100/year — we assist with the process", link: "fssai.gov.in" },
              { name: "Skill India for SHG", desc: "Free digital marketing, food packaging & hygiene training courses", link: "skillindia.gov.in" },
            ].map(s => (
              <div key={s.name} className="bg-card rounded-xl p-4 border border-border">
                <h3 className="font-semibold text-sm mb-1">{s.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{s.desc}</p>
                <a href={`https://${s.link}`} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline flex items-center gap-1">
                  {s.link} <ChevronRight className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-8 text-white text-center">
            <h2 className="font-display text-2xl font-bold mb-3">Need Help Getting Started?</h2>
            <p className="text-white/80 mb-6">Our dedicated SHG support team speaks Hindi, Tamil, Telugu, Bengali, and Marathi.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+918001234567" className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">
                <Phone className="h-4 w-4" /> 1800-123-4567 (Free)
              </a>
              <a href="mailto:shg@railbite.in" className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">
                <Mail className="h-4 w-4" /> shg@railbite.in
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
