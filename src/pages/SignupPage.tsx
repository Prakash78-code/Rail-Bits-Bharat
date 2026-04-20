import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Train, Mail, Lock, User, Phone, Eye, EyeOff, Chrome } from "lucide-react";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    navigate("/set-pin");
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-saffron flex items-center justify-center mx-auto mb-4 shadow-lg animate-float">
            <Train className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold">Create Account</h1>
          <p className="text-muted-foreground mt-1">Join RailBite Bharat</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-xl">
          <form onSubmit={handleSignup} className="space-y-4">
            {[
              { key: "name", label: "Full Name", placeholder: "Your name", icon: User, type: "text" },
              { key: "email", label: "Email", placeholder: "you@example.com", icon: Mail, type: "email" },
              { key: "phone", label: "Phone (+91)", placeholder: "10-digit mobile", icon: Phone, type: "tel" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-sm font-medium mb-1 block">{f.label}</label>
                <div className="relative">
                  <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={f.type}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(ff => ({...ff, [f.key]: e.target.value}))}
                    placeholder={f.placeholder}
                    className="input-base pl-10"
                    required
                  />
                </div>
              </div>
            ))}
            <div>
              <label className="text-sm font-medium mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={e => setForm(ff => ({...ff, password: e.target.value}))}
                  placeholder="Min 8 characters"
                  className="input-base pl-10 pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading
                ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account…</span>
                : "Create Account"}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs text-muted-foreground bg-card px-2">or</div>
          </div>

          <button onClick={() => navigate("/passenger")} className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium">
            <Chrome className="h-4 w-4 text-blue-500" /> Sign up with Google
          </button>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-accent hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}