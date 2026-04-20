import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "@/store/AppContext";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";
import type { Order } from "@/data/mockData";
import { CheckCircle2, Clock, Navigation, QrCode, Star, RotateCcw } from "lucide-react";

const STATUS_STEPS = ["placed","confirmed","preparing","out_for_delivery","delivered"] as const;
const STATUS_LABELS: Record<string, string> = {
  placed: "Order Placed",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};
const STATUS_EMOJIS: Record<string, string> = {
  placed: "📋", confirmed: "✅", preparing: "👨‍🍳", out_for_delivery: "🏃", delivered: "🎉",
};

export default function OrderSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, updateOrderStatus } = useApp();
  const { clearCart } = useCartStore();
  const [order, setOrder] = useState<Order | null>(location.state?.order ?? null);
  const [eta, setEta] = useState(order?.eta ?? 0);
  const [statusIdx, setStatusIdx] = useState(0);

  // Clear cart on mount
  useEffect(() => { clearCart(); }, []);

  // ETA countdown
  useEffect(() => {
    if (eta <= 0) return;
    const t = setInterval(() => setEta(e => Math.max(0, e - 1)), 1000);
    return () => clearInterval(t);
  }, [eta]);

  // Auto-advance status for demo
  useEffect(() => {
    if (!order) return;
    if (statusIdx >= STATUS_STEPS.length - 1) return;
    const delays = [3000, 8000, 15000, 25000];
    const t = setTimeout(() => {
      const next = STATUS_STEPS[statusIdx + 1];
      updateOrderStatus(order.id, next);
      setOrder(o => o ? { ...o, status: next } : o);
      setStatusIdx(i => i + 1);
    }, delays[statusIdx]);
    return () => clearTimeout(t);
  }, [statusIdx, order]);

  // Sync from context
  useEffect(() => {
    if (!order) return;
    const updated = state.orders.find(o => o.id === order.id);
    if (updated) setOrder(updated);
  }, [state.orders]);

  if (!order) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No active order found.</p>
          <button onClick={() => navigate("/passenger")} className="btn-primary">Order Food</button>
        </div>
      </div>
    );
  }

  const etaMin = Math.floor(eta / 60);
  const etaSec = eta % 60;
  const currentStatusIdx = STATUS_STEPS.indexOf(order.status as typeof STATUS_STEPS[number]);
  const isDelivered = order.status === "delivered" || eta === 0;

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-lg space-y-4">

        {/* Success header */}
        <div className="bg-card rounded-2xl p-6 border border-border text-center animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-1">Order Confirmed!</h1>
          <p className="text-muted-foreground text-sm mb-3">Order ID: <span className="font-mono font-semibold text-foreground">{order.id}</span></p>

          {/* QR Code */}
          <div className="inline-block bg-background rounded-xl p-4 border border-border mb-4">
            <QrCode className="h-16 w-16 mx-auto text-foreground mb-2" />
            <p className="font-mono text-xs font-bold tracking-wider">{order.qrCode}</p>
            <p className="text-xs text-muted-foreground">Show to delivery partner</p>
          </div>

          {/* ETA */}
          {!isDelivered && (
            <div className="flex items-center justify-center gap-2 text-xl font-bold mb-4">
              <Clock className="h-5 w-5 text-accent" />
              <span>ETA: <span className="text-accent">{etaMin}:{etaSec.toString().padStart(2, "0")}</span></span>
            </div>
          )}
          {isDelivered && (
            <div className="text-green-500 font-bold text-lg mb-4">🎉 Delivered!</div>
          )}
        </div>

        {/* Status Timeline */}
        <div className="bg-card rounded-2xl p-5 border border-border">
          <h2 className="font-semibold mb-4">Order Status</h2>
          <div className="space-y-3">
            {STATUS_STEPS.map((s, i) => {
              const active = i <= currentStatusIdx;
              const current = i === currentStatusIdx;
              return (
                <div key={s} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all ${active ? "gradient-saffron shadow-md" : "bg-muted"} ${current ? "scale-110 animate-pulse-glow" : ""}`}>
                    {STATUS_EMOJIS[s]}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${active ? "text-foreground" : "text-muted-foreground"}`}>{STATUS_LABELS[s]}</div>
                    {current && <div className="text-xs text-accent font-medium animate-pulse">● In progress</div>}
                  </div>
                  {active && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-card rounded-2xl p-5 border border-border">
          <h2 className="font-semibold mb-3">Items Ordered</h2>
          {order.items.map(ci => (
            <div key={ci.item.id} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
              <span>{ci.item.name} × {ci.qty}</span>
              <span className="font-medium">₹{ci.item.price * ci.qty}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-3 pt-2 border-t border-border">
            <span>Total Paid</span>
            <span className="text-accent">₹{order.total}</span>
          </div>
        </div>

        {/* Revenue Split */}
        <div className="bg-card rounded-2xl p-5 border border-border">
          <h2 className="font-semibold mb-3">Revenue Split</h2>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: "Vendor (T+1)", value: order.revenueSplit.vendor, color: "text-green-500" },
              { label: "Platform (8%)", value: order.revenueSplit.platform, color: "text-accent" },
              { label: "IRCTC (2%)", value: order.revenueSplit.irctc, color: "text-blue-500" },
            ].map(s => (
              <div key={s.label} className="bg-muted/50 rounded-xl p-3">
                <div className={`font-bold text-base ${s.color}`}>₹{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={() => navigate("/tracking", { state: { order } })} className="btn-outline flex-1">
            <Navigation className="h-4 w-4" /> Track Live
          </button>
          {isDelivered && !order.rated && (
            <button onClick={() => navigate("/rate", { state: { order } })} className="btn-primary flex-1">
              <Star className="h-4 w-4" /> Rate Order
            </button>
          )}
          <button onClick={() => navigate("/passenger")} className="btn-ghost">
            <RotateCcw className="h-4 w-4" /> New Order
          </button>
        </div>
      </div>
    </div>
  );
}