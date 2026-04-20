import { useState } from "react";
import { useApp } from "@/store/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import type { Order } from "@/data/mockData";
import { Star, Send, CheckCircle2, X } from "lucide-react";
import { COMPLAINT_REASONS } from "@/data/mockData";

function StarInput({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground w-28">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(i => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110"
          >
            <Star className={`h-7 w-7 transition-colors ${i <= (hover || value) ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
          </button>
        ))}
      </div>
      {value > 0 && <span className="text-sm font-medium text-accent">{["","Poor","Fair","Good","Great","Excellent"][value]}</span>}
    </div>
  );
}

export default function RateOrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { rateOrder, submitComplaint } = useApp();
  const order: Order | null = location.state?.order ?? null;

  const [taste, setTaste] = useState(0);
  const [hygiene, setHygiene] = useState(0);
  const [delivery, setDelivery] = useState(0);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!order) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No order to rate.</p>
          <button onClick={() => navigate("/passenger")} className="btn-primary">Order Food</button>
        </div>
      </div>
    );
  }

  function toggleReason(r: string) {
    setSelectedReasons(p => p.includes(r) ? p.filter(x => x !== r) : [...p, r]);
  }

  function handleSubmit() {
    if (taste > 0) rateOrder(order.id, order.vendorId, taste, hygiene, delivery);
    if (selectedReasons.length > 0) submitComplaint(order.id, order.vendorId, selectedReasons, text);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="bg-card rounded-2xl p-10 border border-border text-center max-w-md w-full animate-scale-in">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-muted-foreground mb-2">Your feedback helps improve the platform.</p>
          {selectedReasons.length > 0 && (
            <p className="text-green-600 dark:text-green-400 font-semibold mb-4">💰 Refund request noted — will be reviewed within 24h</p>
          )}
          <button onClick={() => navigate("/passenger")} className="btn-primary w-full">Order Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-lg space-y-4">
        <h1 className="font-display text-2xl font-bold">Rate Your Experience</h1>
        <p className="text-muted-foreground text-sm">Order: <span className="font-mono font-medium text-foreground">{order.id}</span></p>

        {/* Star ratings */}
        <div className="bg-card rounded-2xl p-6 border border-border space-y-5">
          <StarInput value={taste} onChange={setTaste} label="⭐ Taste" />
          <StarInput value={hygiene} onChange={setHygiene} label="🧹 Hygiene" />
          <StarInput value={delivery} onChange={setDelivery} label="🚚 Delivery" />
        </div>

        {/* Complaint */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h2 className="font-display font-semibold mb-3">🚨 Any Issues? (Optional)</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {COMPLAINT_REASONS.map(r => (
              <button
                key={r}
                onClick={() => toggleReason(r)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${selectedReasons.includes(r) ? "border-destructive bg-destructive/10 text-destructive" : "border-border hover:border-destructive/40"}`}
              >
                {r}
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Add more details (optional)…"
            className="input-base resize-none h-20"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={taste === 0 && selectedReasons.length === 0}
          className="btn-primary w-full py-4 text-base"
        >
          <Send className="h-5 w-5" /> Submit Feedback
        </button>
        <button onClick={() => navigate("/passenger")} className="btn-ghost w-full text-sm text-muted-foreground">
          Skip
        </button>
      </div>
    </div>
  );
}
