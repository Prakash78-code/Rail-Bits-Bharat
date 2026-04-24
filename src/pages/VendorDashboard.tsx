import { useState } from "react";
import { useApp } from "@/store/AppContext";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import {
  Package, TrendingUp, Star, Clock, CheckCircle2, XCircle,
  Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Bell, BarChart3
} from "lucide-react";

const earningsData = [
  { day: "Mon", earnings: 2400 }, { day: "Tue", earnings: 3200 },
  { day: "Wed", earnings: 2800 }, { day: "Thu", earnings: 4100 },
  { day: "Fri", earnings: 5200 }, { day: "Sat", earnings: 6400 },
  { day: "Sun", earnings: 5800 },
];

const forecastData = [
  { category: "Biryani", predicted: 42, confidence: 87 },
  { category: "Thali", predicted: 28, confidence: 74 },
  { category: "Snacks", predicted: 65, confidence: 91 },
  { category: "Beverages", predicted: 88, confidence: 95 },
  { category: "Desserts", predicted: 19, confidence: 61 },
];

type Tab = "orders" | "menu" | "earnings" | "forecast" | "reviews";

export default function VendorDashboard() {
  const { state, updateOrderStatus } = useApp();
  const [tab, setTab] = useState<Tab>("orders");
  const vendor = state.vendors[0]; // Demo: first vendor
  const vendorOrders = state.orders.filter(o => o.vendorId === vendor?.id);

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "orders", label: "Orders", icon: <Package className="h-4 w-4" /> },
    { id: "menu", label: "Menu", icon: <Edit2 className="h-4 w-4" /> },
    { id: "earnings", label: "Earnings", icon: <TrendingUp className="h-4 w-4" /> },
    { id: "forecast", label: "AI Forecast", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "reviews", label: "Reviews", icon: <Star className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen pt-16 bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-6">

        {/* Vendor Header */}
        <div className="bg-card rounded-2xl p-5 border border-border mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl gradient-saffron flex items-center justify-center text-3xl">🍽️</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-bold">{vendor?.name ?? "Your Kitchen"}</h1>
                {vendor?.fssaiVerified && <span className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />FSSAI</span>}
              </div>
              <p className="text-sm text-muted-foreground">{vendor?.station} • {vendor?.cuisine?.join(", ")}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-amber-400"><Star className="h-4 w-4 fill-amber-400" /><span className="font-bold">{vendor?.hygieneRating}</span></div>
              <div className="text-xs text-muted-foreground">{vendor?.totalOrders} orders</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: "Today's Revenue", value: `₹${vendorOrders.reduce((s,o) => s+o.revenueSplit.vendor, 0) || 4280}` },
              { label: "Active Orders", value: vendorOrders.filter(o => o.status !== "delivered").length || 3 },
              { label: "Hygiene Score", value: `${vendor?.hygieneScore}/100` },
            ].map(s => (
              <div key={s.label} className="bg-muted/50 rounded-xl p-3 text-center">
                <div className="font-display font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${tab === t.id ? "gradient-saffron text-white shadow-md" : "bg-card border border-border hover:bg-muted"}`}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* ORDERS */}
        {tab === "orders" && (
          <div className="space-y-3 animate-fade-in">
            <h2 className="font-display font-semibold">Incoming Orders</h2>
            {vendorOrders.length === 0 ? (
              <div className="bg-card rounded-2xl p-12 border border-border text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No orders yet today.</p>
                <p className="text-sm text-muted-foreground mt-1">Place a test order from Passenger Portal</p>
              </div>
            ) : (
              vendorOrders.map(o => (
                <div key={o.id} className="bg-card rounded-2xl p-5 border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-mono font-semibold">{o.id}</div>
                      <div className="text-sm text-muted-foreground">Coach {o.coach} • Seat {o.seat} • {o.station}</div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium status-${o.status}`}>{o.status.replace(/_/g," ")}</span>
                  </div>
                  <div className="space-y-1 mb-3">
                    {o.items.map(i => (
                      <div key={i.item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{i.item.name} × {i.qty}</span>
                        <span className="font-medium">₹{i.item.price * i.qty}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">₹{o.total}</span>
                    <div className="flex gap-2">
                      {o.status === "placed" && (
                        <>
                          <button onClick={() => updateOrderStatus(o.id, "confirmed")} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors">
                            <CheckCircle2 className="h-3 w-3" /> Accept
                          </button>
                          <button onClick={() => updateOrderStatus(o.id, "cancelled")} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-destructive/10 text-destructive text-xs font-medium">
                            <XCircle className="h-3 w-3" /> Reject
                          </button>
                        </>
                      )}
                      {o.status === "confirmed" && (
                        <button onClick={() => updateOrderStatus(o.id, "preparing")} className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-colors">
                          Start Preparing
                        </button>
                      )}
                      {o.status === "preparing" && (
                        <button onClick={() => updateOrderStatus(o.id, "out_for_delivery")} className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-colors">
                          Mark Ready
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* MENU */}
        {tab === "menu" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold">Menu Items ({vendor?.menu.length})</h2>
              <button className="btn-primary text-sm px-4 py-2"><Plus className="h-4 w-4" /> Add Item</button>
            </div>
            <div className="space-y-2">
              {vendor?.menu.map(item => (
                <div key={item.id} className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
                  <span className="text-xl">{item.isVeg ? "🟢" : "🔴"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.category} • {item.prepTime}m prep • ⭐{item.rating}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-sm">₹{item.price}</span>
                    <button className={`p-1.5 rounded-lg transition-colors ${item.available ? "text-green-600 hover:bg-green-500/10" : "text-muted-foreground hover:bg-muted"}`}>
                      {item.available ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                    </button>
                    <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EARNINGS */}
        {tab === "earnings" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-display font-semibold">Earnings Overview</h2>
            <div className="bg-card rounded-2xl p-5 border border-border">
              <h3 className="font-semibold mb-4">This Week's Earnings</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Earnings"]} />
                  <Bar dataKey="earnings" fill="hsl(24 95% 53%)" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "This Week", value: "₹30,100", delta: "+18%" },
                { label: "This Month", value: "₹1,12,400", delta: "+24%" },
                { label: "Next Payout", value: "Tomorrow", delta: "T+1" },
                { label: "Pending Amount", value: "₹8,240", delta: "Escrow" },
              ].map(s => (
                <div key={s.label} className="bg-card rounded-xl p-4 border border-border">
                  <div className="font-display font-bold text-lg">{s.value}</div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                  <div className="text-xs text-green-500 mt-1">{s.delta}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI FORECAST */}
        {tab === "forecast" && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-gradient-to-br from-indigo-500/10 to-accent/10 rounded-2xl p-5 border border-indigo-500/20">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="h-5 w-5 text-indigo-500" />
                <h2 className="font-display font-bold">AI Demand Forecast</h2>
                <span className="ml-auto text-xs bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full font-medium">brain.js model</span>
              </div>
              <p className="text-sm text-muted-foreground">Predicted demand for tomorrow • {vendor?.station}</p>
            </div>
            <div className="bg-card rounded-2xl p-5 border border-border">
              <h3 className="font-semibold mb-4">Predicted Orders by Category</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="predicted" fill="hsl(222 60% 40%)" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {forecastData.map(f => (
                <div key={f.category} className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{f.category}</div>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-1.5">
                      <div className={`h-1.5 rounded-full ${f.confidence >= 80 ? "bg-green-500" : f.confidence >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${f.confidence}%` }} />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold">{f.predicted} orders</div>
                    <div className={`text-xs font-medium ${f.confidence >= 80 ? "text-green-500" : f.confidence >= 50 ? "text-amber-500" : "text-red-500"}`}>
                      {f.confidence}% confidence
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS */}
        {tab === "reviews" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-display font-semibold">Customer Reviews</h2>
            <div className="bg-card rounded-2xl p-5 border border-border text-center">
              <div className="text-4xl font-display font-bold text-gradient mb-1">{vendor?.hygieneRating}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1,2,3,4,5].map(i => <Star key={i} className={`h-5 w-5 ${i <= Math.round(vendor?.hygieneRating ?? 0) ? "fill-amber-400 text-amber-400" : "text-muted"}`} />)}
              </div>
              <p className="text-muted-foreground text-sm">Based on {vendor?.totalOrders} orders</p>
            </div>
            {[
              { user: "Rahul M.", rating: 5, text: "Amazing Paneer Biryani! Delivered hot and on time. Will definitely order again.", time: "2h ago" },
              { user: "Priya S.", rating: 4, text: "Good food, packaging could be better but taste was excellent.", time: "1d ago" },
              { user: "Amit K.", rating: 5, text: "Best railway food I've had! The samosas were crispy and fresh.", time: "3d ago" },
            ].map((r, i) => (
              <div key={i} className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm">{r.user}</div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className={`h-3 w-3 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{r.text}</p>
                <p className="text-xs text-muted-foreground mt-2">{r.time}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
