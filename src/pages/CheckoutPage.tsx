import { useLocation, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useApp } from "@/store/AppContext";
import { useState } from "react";
import { MOCK_PNRS } from "@/data/mockData";
import { ShoppingCart, Trash2, Plus, Minus, Tag, ChevronRight, CreditCard, Smartphone } from "lucide-react";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, updateQty, removeItem, getTotal } = useCartStore();
  const { placeOrder } = useApp();
  const stateData = location.state as { stationName?: string; vendor?: { id: string; name: string; avgDeliveryTime: number }; pnrData?: typeof MOCK_PNRS[string] } | null;

  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [placing, setPlacing] = useState(false);

  const subtotal = getTotal();
  const gst = Math.round(subtotal * 0.05);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + gst - discount;

  const VALID_COUPONS = ["FIRST50", "RAILBITE10", "SHG20"];

  function applyCoupon() {
    if (VALID_COUPONS.includes(coupon.toUpperCase())) setCouponApplied(true);
    else alert("Invalid coupon code");
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  async function handlePlaceOrder() {
    if (!stateData?.vendor || items.length === 0) return;
    setPlacing(true);

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load. Please check your connection.");
      setPlacing(false);
      return;
    }

    const pnrData = stateData.pnrData ?? { trainName: "Express", trainNumber: "12000", coach: "S1", seat: "24", stations: [] };
    const tempOrderId = `ord_${Date.now()}`;

    try {
      // 1. Create order on backend
      const response = await fetch("http://localhost:4000/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          vendorId: stateData.vendor.id,
          orderId: tempOrderId
        })
      });
      const data = await response.json();

      if (!data.orderId) {
        throw new Error(data.error || "Server failed to create order");
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "RailBite Bharat",
        description: `Food order from ${stateData.vendor.name}`,
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment signature via backend
            const verifyRes = await fetch("http://localhost:4000/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                internal_order_id: tempOrderId
              })
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              const order = placeOrder(
                "2847501234",
                pnrData.trainName,
                pnrData.trainNumber,
                stateData.stationName ?? "",
                pnrData.coach,
                pnrData.seat,
                stateData.vendor!.id,
                items,
                paymentMethod
              );
              navigate("/order-summary", { state: { order, paymentId: response.razorpay_payment_id } });
            } else {
              alert("Payment verification failed: " + verifyData.error);
              setPlacing(false);
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment verification encountered an error.");
            setPlacing(false);
          }
        },
        prefill: {
          name: "Railway Passenger",
          email: "passenger@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#f97316" // Orange accent
        },
        modal: {
          ondismiss: function() {
            setPlacing(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on("payment.failed", function (response: any) {
        alert("Payment Failed: " + response.error.description);
        setPlacing(false);
      });

      rzp.open();

    } catch (error) {
      console.error(error);
      alert("Failed to initiate payment. Ensure backend is running.");
      setPlacing(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">Your cart is empty</h2>
          <button onClick={() => navigate("/passenger")} className="btn-primary mt-4">Browse Food</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-lg">
        <h1 className="font-display text-2xl font-bold mb-6">Checkout</h1>

        {/* Order Items */}
        <div className="bg-card rounded-2xl border border-border p-5 mb-4">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><ShoppingCart className="h-4 w-4 text-accent" /> Your Order</h2>
          {items.map(ci => (
            <div key={ci.item.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{ci.item.name}</div>
                <div className="text-xs text-muted-foreground">₹{ci.item.price} each</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
                  <button onClick={() => updateQty(ci.item.id, ci.qty - 1)} className="w-6 h-6 rounded-lg bg-background flex items-center justify-center"><Minus className="h-3 w-3" /></button>
                  <span className="w-5 text-center text-sm font-bold">{ci.qty}</span>
                  <button onClick={() => updateQty(ci.item.id, ci.qty + 1)} className="w-6 h-6 rounded-lg bg-background flex items-center justify-center"><Plus className="h-3 w-3" /></button>
                </div>
                <span className="font-bold text-sm w-16 text-right">₹{ci.item.price * ci.qty}</span>
                <button onClick={() => removeItem(ci.item.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>

        {/* Coupon */}
        <div className="bg-card rounded-2xl border border-border p-5 mb-4">
          <h2 className="font-semibold mb-3 flex items-center gap-2"><Tag className="h-4 w-4 text-accent" /> Promo Code</h2>
          {couponApplied ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
              ✓ 10% discount applied! (Code: {coupon.toUpperCase()})
            </div>
          ) : (
            <div className="flex gap-2">
              <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Enter coupon (e.g. FIRST50)" className="input-base flex-1" />
              <button onClick={applyCoupon} className="btn-secondary px-4 shrink-0">Apply</button>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">Try: FIRST50, RAILBITE10, SHG20</p>
        </div>

        {/* Payment Method */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><CreditCard className="h-5 w-5 text-accent" /> Payment Method</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: "UPI", label: "UPI / GPay", icon: "📱", desc: "Fast & secure" },
              { id: "Card", label: "Debit/Credit Card", icon: "💳", desc: "Visa, Mastercard, RuPay" },
              { id: "NetBanking", label: "Net Banking", icon: "🏦", desc: "All major banks" },
              { id: "Wallet", label: "Paytm Wallet", icon: "👛", desc: "Quick checkout" },
            ].map(m => {
              const isSelected = paymentMethod === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  type="button"
                  className={`relative flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-200 group ${
                    isSelected 
                      ? "border-accent bg-accent/5 shadow-sm ring-1 ring-accent" 
                      : "border-border hover:border-accent/50 hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-accent"
                  }`}
                >
                  <span className="text-2xl mt-0.5">{m.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-sm ${isSelected ? "text-accent" : "text-foreground group-hover:text-foreground"}`}>
                      {m.label}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{m.desc}</div>
                  </div>
                  {/* Selection Indicator */}
                  <div className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors mt-0.5 ${
                    isSelected ? "border-accent bg-accent text-white" : "border-muted-foreground/30 bg-background"
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bill Summary */}
        <div className="bg-card rounded-2xl border border-border p-5 mb-6">
          <h2 className="font-semibold mb-4">Bill Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">GST (5%)</span><span>₹{gst}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600 dark:text-green-400"><span>Discount (10%)</span><span>-₹{discount}</span></div>}
            <div className="flex justify-between font-bold text-base border-t border-border pt-3 mt-2">
              <span>Total</span><span className="text-accent">₹{total}</span>
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">Platform fee (8%) + GST deducted at T+1 vendor payout</div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={placing}
          className="btn-primary w-full py-4 text-base"
        >
          {placing ? (
            <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing…</span>
          ) : (
            <span className="flex items-center justify-center gap-2"><Smartphone className="h-5 w-5" />Pay ₹{total} via {paymentMethod}</span>
          )}
        </button>
        <p className="text-center text-xs text-muted-foreground mt-3">🔒 Secured by Razorpay • PCI DSS Compliant</p>
      </div>
    </div>
  );
}