import { useState } from "react";
import { useApp } from "@/store/AppContext";
import { StarRating } from "@/components/StarRating";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ChefHat, AlertTriangle, Package, Clock, IndianRupee, LogIn } from "lucide-react";
import type { Order } from "@/data/mockData";

export default function VendorDashboard() {
  const { state, updateOrderStatus } = useApp();
  const [loggedIn, setLoggedIn] = useState(false);
  const [vendorId, setVendorId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const vendor = state.vendors.find((v) => v.id === vendorId);
  const vendorOrders = state.orders.filter((o) => o.vendorId === vendorId);

  function handleLogin() {
    const v = state.vendors.find((v) => v.id === vendorId);
    if (v && password === v.password) {
      setLoggedIn(true);
      setError("");
    } else {
      setError("Invalid vendor ID or password. Try v1–v15 with password: vendor123");
    }
  }

  const statusActions: Record<string, { next: Order["status"]; label: string }> = {
    placed: { next: "preparing", label: "Start Preparing" },
    preparing: { next: "out_for_delivery", label: "Out for Delivery" },
    out_for_delivery: { next: "delivered", label: "Mark Delivered" },
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm max-w-sm w-full animate-fade-in">
          <div className="text-center mb-6">
            <ChefHat className="h-12 w-12 text-accent mx-auto mb-3" />
            <h2 className="font-display text-2xl font-bold">Vendor Login</h2>
            <p className="text-sm text-muted-foreground">Access your vendor dashboard</p>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              placeholder="Vendor ID (e.g., v1)"
              className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground focus:ring-2 focus:ring-accent outline-none transition"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground focus:ring-2 focus:ring-accent outline-none transition"
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <button onClick={handleLogin} className="w-full py-3 rounded-xl gradient-saffron text-accent-foreground font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all">
              <LogIn className="h-5 w-5" /> Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) return null;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Flagged Warning */}
        {vendor.flagged && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 mb-6 flex items-center gap-3 animate-fade-in">
            <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0" />
            <div>
              <p className="font-bold text-destructive">Vendor Flagged</p>
              <p className="text-sm text-destructive/80">Your account has been flagged due to repeated complaints. Please address quality issues.</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-card rounded-2xl p-6 border border-border mb-6 animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold">{vendor.name}</h1>
              <p className="text-sm text-muted-foreground">{vendor.station}</p>
              <StarRating rating={vendor.hygieneRating} />
            </div>
            <button onClick={() => setLoggedIn(false)} className="text-sm text-muted-foreground hover:text-foreground">Logout</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <IndianRupee className="h-5 w-5 text-emerald mx-auto mb-1" />
            <div className="text-2xl font-display font-bold"><AnimatedCounter end={vendor.earnings} prefix="₹" /></div>
            <div className="text-xs text-muted-foreground">Earnings</div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <Package className="h-5 w-5 text-accent mx-auto mb-1" />
            <div className="text-2xl font-display font-bold"><AnimatedCounter end={vendorOrders.length} /></div>
            <div className="text-xs text-muted-foreground">Orders</div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <AlertTriangle className="h-5 w-5 text-destructive mx-auto mb-1" />
            <div className="text-2xl font-display font-bold"><AnimatedCounter end={vendor.complaintCount} /></div>
            <div className="text-xs text-muted-foreground">Complaints</div>
          </div>
        </div>

        {/* Orders */}
        <h2 className="font-display text-xl font-bold mb-4">Orders</h2>
        {vendorOrders.length === 0 ? (
          <div className="bg-card rounded-xl p-8 border border-border text-center text-muted-foreground">
            <Package className="h-10 w-10 mx-auto mb-2 opacity-40" />
            No orders yet. Orders placed by passengers will appear here.
          </div>
        ) : (
          <div className="space-y-3">
            {vendorOrders.map((order) => (
              <div key={order.id} className="bg-card rounded-xl p-4 border border-border animate-fade-in">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-semibold">#{order.id}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${order.status === "delivered" ? "bg-emerald/10 text-emerald" : "bg-accent/10 text-accent"}`}>
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <span className="font-bold">₹{order.total}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  {order.items.map((i) => `${i.item.name} ×${i.qty}`).join(", ")}
                </div>
                {statusActions[order.status] && (
                  <button
                    onClick={() => updateOrderStatus(order.id, statusActions[order.status].next)}
                    className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:shadow transition-all flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    {statusActions[order.status].label}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
