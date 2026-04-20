import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Train, Mail, Lock, Eye, EyeOff, Smartphone, Chrome } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"email" | "phone" | "pin">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    navigate("/passenger");
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-saffron flex items-center justify-center mx-auto mb-4 shadow-lg animate-float">
            <Train className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-1">Sign in to RailBite Bharat</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-xl">
          {/* Mode tabs */}
          <div className="flex gap-1 p-1 bg-muted rounded-xl mb-6">
            {[
              { id: "email", label: "Email", icon: Mail },
              { id: "phone", label: "Phone OTP", icon: Smartphone },
              { id: "pin", label: "Quick PIN", icon: Lock },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id as typeof mode)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${mode === m.id ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <m.icon className="h-3.5 w-3.5" />
                {m.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {mode === "email" && (
              <>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-accent/50 focus-within:border-accent transition-all">
                    <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="bg-transparent border-none outline-none flex-1 w-full text-sm placeholder:text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm font-medium">Password</label>
                    <button type="button" className="text-xs text-accent hover:underline font-medium">Forgot?</button>
                  </div>
                  <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-accent/50 focus-within:border-accent transition-all">
                    <Lock className="h-5 w-5 text-muted-foreground shrink-0" />
                    <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className="bg-transparent border-none outline-none flex-1 w-full text-sm placeholder:text-muted-foreground" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="text-muted-foreground hover:text-foreground shrink-0 transition-colors">
                      {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </>
            )}
            {mode === "phone" && (
              <div>
                <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
                <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-accent/50 focus-within:border-accent transition-all">
                  <span className="text-sm font-medium text-foreground shrink-0 border-r border-border pr-3">🇮🇳 +91</span>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="10-digit mobile number" className="bg-transparent border-none outline-none flex-1 w-full text-sm placeholder:text-muted-foreground" />
                </div>
                {phone.length === 10 && (
                  <button type="button" className="btn-secondary w-full mt-4 text-sm py-3">Send OTP</button>
                )}
              </div>
            )}
            {mode === "pin" && (
              <div>
                <label className="text-sm font-medium mb-1.5 block">4-Digit Quick PIN</label>
                <div className="flex gap-3 justify-center my-6">
                  {[0,1,2,3].map(i => (
                    <input
                      key={i}
                      type="password"
                      maxLength={1}
                      value={pin[i] ?? ""}
                      onChange={e => {
                        const val = e.target.value.slice(-1);
                        const newPin = pin.split("");
                        newPin[i] = val;
                        setPin(newPin.join(""));
                        if (val && i < 3) {
                          const next = document.getElementById(`pin-${i+1}`);
                          next?.focus();
                        }
                      }}
                      id={`pin-${i}`}
                      className="w-14 h-14 text-center text-2xl font-bold rounded-xl border border-border focus:border-accent bg-card focus:ring-2 focus:ring-accent/50 outline-none transition-all"
                    />
                  ))}
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</span> : "Sign In"}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs text-muted-foreground bg-card px-2">or</div>
          </div>

          <button
            onClick={() => navigate("/passenger")}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium"
          >
            <Chrome className="h-4 w-4 text-blue-500" />
            Continue with Google
          </button>

          <p className="text-center text-sm text-muted-foreground mt-5">
            New vendor?{" "}
            <Link to="/vendor-register" className="text-accent hover:underline font-medium">Register here</Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          By signing in, you agree to our{" "}
          <span className="text-accent">Terms of Service</span> and{" "}
          <span className="text-accent">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}