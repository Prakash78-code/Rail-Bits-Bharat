import { useState, useEffect } from "react";
import { useApp } from "@/store/AppContext";
import { FssaiBadge } from "@/components/FssaiBadge";
import { HygieneScore } from "@/components/HygieneScore";
import { STATIONS, COMPLAINT_REASONS, type MenuItem } from "@/data/mockData";
import { StarRating, StarInput } from "@/components/StarRating";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import {
  Search, MapPin, ShoppingCart, Clock, QrCode,
  AlertTriangle, CheckCircle2, Send, X, Navigation,
} from "lucide-react";
import type { Order } from "@/data/mockData";

export default function PassengerPortal() {
  const { state, placeOrder, submitComplaint, rateOrder } = useApp();
  const [step, setStep] = useState<"pnr" | "vendors" | "menu" | "order" | "rate">("pnr");
  const [pnr, setPnr] = useState("");
  const [selectedStation, setSelectedStation] = useState("");
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [cart, setCart] = useState<{ item: MenuItem; qty: number }[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [eta, setEta] = useState(0);

  // Rating state
  const [taste, setTaste] = useState(0);
  const [hygiene, setHygiene] = useState(0);
  const [delivery, setDelivery] = useState(0);
  const [complaintReasons, setComplaintReasons] = useState<string[]>([]);
  const [complaintText, setComplaintText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // ETA countdown
  useEffect(() => {
    if (!currentOrder || eta <= 0) return;
    const timer = setInterval(() => setEta((e) => Math.max(0, e - 1)), 1000);
    return () => clearInterval(timer);
  }, [currentOrder, eta]);

  // Sync order status from context
  useEffect(() => {
    if (!currentOrder) return;
    const updated = state.orders.find((o) => o.id === currentOrder.id);
    if (updated) setCurrentOrder(updated);
  }, [state.orders]);

  const stationVendors = state.vendors.filter((v) => v.station === selectedStation);
  const selectedVendor = state.vendors.find((v) => v.id === selectedVendorId);
  const cartTotal = cart.reduce((sum, c) => sum + c.item.price * c.qty, 0);

  function handlePnrSubmit() {
    if (pnr.length >= 5) {
      setStep("vendors");
      setSelectedStation("");
    }
  }

  function addToCart(item: MenuItem) {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing)
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c
        );
      return [...prev, { item, qty: 1 }];
    });
  }

  function removeFromCart(itemId: string) {
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));
  }

  function handlePlaceOrder() {
    if (!selectedVendor || cart.length === 0) return;
    const order = placeOrder(
      pnr,
      "Rajdhani Express",
      selectedStation,
      selectedVendorId,
      cart
    );
    setCurrentOrder(order);
    setEta(order.eta);
    setStep("order");
    setCart([]);
  }

  function handleSubmitFeedback() {
    if (!currentOrder) return;
    if (taste > 0) rateOrder(currentOrder.id, taste, hygiene, delivery);
    if (complaintReasons.length > 0) {
      submitComplaint(
        currentOrder.id,
        currentOrder.vendorId,
        complaintReasons,
        complaintText
      );
    }
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-3xl">

        {/* ── Progress Bar ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-8">
          {["PNR", "Vendors", "Menu", "Order", "Rate"].map((label, i) => {
            const steps = ["pnr", "vendors", "menu", "order", "rate"];
            const active = steps.indexOf(step) >= i;
            return (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${active ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                  {i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:inline ${active ? "text-foreground" : "text-muted-foreground"}`}>
                  {label}
                </span>
                {i < 4 && (
                  <div className={`flex-1 h-0.5 ${active ? "bg-accent" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Step 1: PNR ──────────────────────────────────────────────────── */}
        {step === "pnr" && (
          <div className="animate-fade-in bg-card rounded-2xl p-8 border border-border shadow-sm">
            <h2 className="font-display text-2xl font-bold mb-2">Enter Your PNR</h2>
            <p className="text-muted-foreground mb-6">
              Enter your PNR to find food vendors along your route.
            </p>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value)}
                  placeholder="e.g., 2847501234"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-input text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
                />
              </div>
              <button
                onClick={handlePnrSubmit}
                disabled={pnr.length < 5}
                className="px-6 py-3 rounded-xl gradient-saffron text-accent-foreground font-semibold disabled:opacity-50 hover:shadow-lg transition-all"
              >
                Search
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Try any 5+ digit number for demo
            </p>
          </div>
        )}

        {/* ── Step 2: Station & Vendor Selection ───────────────────────────── */}
        {step === "vendors" && (
          <div className="animate-fade-in space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="font-display text-xl font-bold mb-1">🚂 Rajdhani Express</h2>
              <p className="text-sm text-muted-foreground mb-4">
                PNR: {pnr} • Select a station to order from
              </p>
              <div className="grid grid-cols-3 gap-3">
                {STATIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStation(s)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      selectedStation === s
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    <MapPin className="h-4 w-4 mx-auto mb-1" />
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {selectedStation && (
              <div className="space-y-3 animate-fade-in">
                <h3 className="font-display text-lg font-semibold">
                  Vendors at {selectedStation}
                </h3>
                {stationVendors.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => { setSelectedVendorId(v.id); setStep("menu"); }}
                    className="w-full text-left p-4 bg-card rounded-xl border border-border hover:border-accent/50 transition-all group"
                  >
                    {/* Row 1: Name + Flagged + Arrow */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{v.name}</span>
                        {v.flagged && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-destructive text-destructive-foreground font-bold">
                            ⚠ Flagged
                          </span>
                        )}
                      </div>
                      <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-sm">
                        View Menu →
                      </span>
                    </div>

                    {/* Row 2: Star Rating + Complaints */}
                    <div className="flex items-center gap-3 mb-3">
                      <StarRating rating={v.hygieneRating} size={14} />
                      <span className="text-xs text-muted-foreground">
                        {v.complaintCount} complaint{v.complaintCount !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Row 3: FSSAI Badge */}
                    <div className="mb-3">
                      <FssaiBadge fssaiNumber={v.fssaiNumber} verified={v.fssaiVerified} />
                    </div>

                    {/* Row 4: Hygiene Score Bar */}
                    <HygieneScore score={v.hygieneScore} />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Menu ─────────────────────────────────────────────────── */}
        {step === "menu" && selectedVendor && (
          <div className="animate-fade-in space-y-6">
            <button
              onClick={() => setStep("vendors")}
              className="text-sm text-accent hover:underline"
            >
              ← Back to vendors
            </button>
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-display text-xl font-bold">{selectedVendor.name}</h2>
                  <StarRating rating={selectedVendor.hygieneRating} />
                </div>
                {selectedVendor.flagged && (
                  <span className="px-3 py-1 text-xs rounded-full bg-destructive text-destructive-foreground font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Flagged
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {selectedVendor.menu.map((item) => {
                  const inCart = cart.find((c) => c.item.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-3 px-4 rounded-lg bg-background border border-border"
                    >
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-xs text-muted-foreground ml-2 px-2 py-0.5 rounded bg-muted">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">₹{item.price}</span>
                        {inCart ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-accent">×{inCart.qty}</span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-destructive hover:bg-destructive/10 rounded-full p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="px-3 py-1 text-sm rounded-lg bg-accent text-accent-foreground font-medium hover:shadow transition"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {cart.length > 0 && (
              <div className="bg-card rounded-2xl p-6 border border-accent/30 animate-scale-in">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingCart className="h-5 w-5 text-accent" />
                  <h3 className="font-display font-semibold">Your Cart</h3>
                </div>
                {cart.map((c) => (
                  <div key={c.item.id} className="flex justify-between text-sm py-1">
                    <span>{c.item.name} × {c.qty}</span>
                    <span className="font-medium">₹{c.item.price * c.qty}</span>
                  </div>
                ))}
                <div className="border-t border-border mt-3 pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{cartTotal}</span>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  className="w-full mt-4 py-3 rounded-xl gradient-saffron text-accent-foreground font-bold text-lg hover:shadow-lg transition-all"
                >
                  Place Order
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Step 4: Order Placed ──────────────────────────────────────────── */}
        {step === "order" && currentOrder && (
          <div className="animate-fade-in space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border text-center">

              {/* Success */}
              <CheckCircle2 className="h-12 w-12 text-emerald mx-auto mb-3" />
              <h2 className="font-display text-2xl font-bold mb-1">Order Placed!</h2>
              <p className="text-muted-foreground mb-4">Order #{currentOrder.id}</p>

              {/* QR Code */}
              <div className="bg-background rounded-xl p-4 border border-border mb-4 inline-block">
                <QrCode className="h-16 w-16 mx-auto text-foreground mb-2" />
                <p className="font-mono text-sm font-bold">{currentOrder.qrCode}</p>
                <p className="text-xs text-muted-foreground">Show to delivery partner</p>
              </div>

              {/* ETA */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-accent" />
                <span className="text-lg font-semibold">
                  ETA: <AnimatedCounter end={eta} suffix="s" className="text-accent" />
                </span>
              </div>

              {/* Status Pills */}
              <div className="flex justify-center gap-2 mb-6 flex-wrap">
                {(["placed", "preparing", "out_for_delivery", "delivered"] as const).map((s) => (
                  <div
                    key={s}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${
                      currentOrder.status === s
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s.replace(/_/g, " ")}
                  </div>
                ))}
              </div>

              {/* ✅ TRACK LIVE BUTTON + RATE BUTTON */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">

                {/* Track Live Map Button — hamesha dikhega */}
                <a
                  href="/tracking"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-background border-2 border-accent text-accent font-semibold hover:bg-accent/10 hover:shadow-lg transition-all w-full sm:w-auto justify-center"
                >
                  <Navigation className="h-4 w-4" />
                  Track Live on Map
                </a>

                {/* Rate & Review — sirf delivered hone ke baad */}
                {(currentOrder.status === "delivered" || eta === 0) && (
                  <button
                    onClick={() => setStep("rate")}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-saffron text-accent-foreground font-semibold hover:shadow-lg transition-all w-full sm:w-auto justify-center"
                  >
                    Rate & Review
                  </button>
                )}
              </div>

              {/* Revenue Split */}
              <div className="pt-4 border-t border-border grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="font-bold text-green-600 dark:text-green-400 text-base">
                    ₹{currentOrder.revenueSplit.vendor}
                  </p>
                  <p className="text-xs text-muted-foreground">Vendor (T+1)</p>
                </div>
                <div>
                  <p className="font-bold text-accent text-base">
                    ₹{currentOrder.revenueSplit.platform}
                  </p>
                  <p className="text-xs text-muted-foreground">Platform 7%</p>
                </div>
                <div>
                  <p className="font-bold text-blue-500 text-base">
                    ₹{currentOrder.revenueSplit.irctc}
                  </p>
                  <p className="text-xs text-muted-foreground">IRCTC 3%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 5: Rating & Complaint ───────────────────────────────────── */}
        {step === "rate" && currentOrder && !submitted && (
          <div className="animate-fade-in space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="font-display text-xl font-bold mb-4">Rate Your Experience</h2>
              <div className="space-y-4">
                <StarInput value={taste} onChange={setTaste} label="⭐ Taste" />
                <StarInput value={hygiene} onChange={setHygiene} label="🧹 Hygiene" />
                <StarInput value={delivery} onChange={setDelivery} label="🚚 Delivery" />
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="font-display text-xl font-bold mb-4">🚨 File a Complaint</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {COMPLAINT_REASONS.map((r) => (
                  <button
                    key={r}
                    onClick={() =>
                      setComplaintReasons((prev) =>
                        prev.includes(r)
                          ? prev.filter((x) => x !== r)
                          : [...prev, r]
                      )
                    }
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      complaintReasons.includes(r)
                        ? "bg-destructive text-destructive-foreground border-destructive"
                        : "border-border hover:border-destructive/50"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <textarea
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
                placeholder="Additional details (optional)..."
                className="w-full p-3 rounded-xl bg-background border border-input text-foreground focus:ring-2 focus:ring-accent outline-none transition resize-none h-20"
              />
            </div>

            <button
              onClick={handleSubmitFeedback}
              disabled={taste === 0 && complaintReasons.length === 0}
              className="w-full py-3 rounded-xl gradient-saffron text-accent-foreground font-bold text-lg disabled:opacity-50 hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Send className="h-5 w-5" />
              Submit Feedback
            </button>
          </div>
        )}

        {/* ── Submitted ────────────────────────────────────────────────────── */}
        {step === "rate" && submitted && (
          <div className="animate-fade-in bg-card rounded-2xl p-8 border border-border text-center">
            <CheckCircle2 className="h-16 w-16 text-emerald mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold mb-2">Thank You!</h2>
            <p className="text-muted-foreground mb-2">Your feedback has been recorded.</p>
            {complaintReasons.length > 0 && (
              <p className="text-emerald font-semibold">💰 Refund Initiated (Simulation)</p>
            )}
            <button
              onClick={() => {
                setStep("pnr");
                setPnr("");
                setCurrentOrder(null);
                setSubmitted(false);
                setTaste(0);
                setHygiene(0);
                setDelivery(0);
                setComplaintReasons([]);
                setComplaintText("");
              }}
              className="mt-6 px-6 py-2.5 rounded-xl bg-accent text-accent-foreground font-semibold hover:shadow-lg transition-all"
            >
              New Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}