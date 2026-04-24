import { useState } from "react";
import { useApp } from "@/store/AppContext";
import {
  BarChart3, Users, ShoppingBag, TrendingUp, AlertTriangle,
  CheckCircle, XCircle, Clock, Star, Package, DollarSign,
  Download, Search, Filter, Eye, Gavel, Bell
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

const revenueData = [
  { day: "Mon", revenue: 12400, orders: 48 },
  { day: "Tue", revenue: 18200, orders: 71 },
  { day: "Wed", revenue: 15800, orders: 62 },
  { day: "Thu", revenue: 22100, orders: 86 },
  { day: "Fri", revenue: 28900, orders: 112 },
  { day: "Sat", revenue: 35400, orders: 138 },
  { day: "Sun", revenue: 31200, orders: 121 },
];

const stationData = [
  { station: "Howrah Jn.", orders: 138 },
  { station: "Mumbai Cen.", orders: 112 },
  { station: "Chennai Cen.", orders: 96 },
  { station: "Varanasi Jn.", orders: 84 },
  { station: "Lucknow", orders: 72 },
];

type Tab = "overview" | "orders" | "vendors" | "complaints" | "users";

export default function AdminDashboard() {
  const { state, flagVendor } = useApp();
  const [tab, setTab] = useState<Tab>("overview");
  const [searchQ, setSearchQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const totalRevenue = state.orders.reduce((s, o) => s + o.total, 0);
  const activeVendors = state.vendors.filter(v => v.approved && !v.flagged).length;
  const openComplaints = state.complaints.filter(c => c.status === "open").length;

  const filteredOrders = state.orders.filter(o => {
    if (filterStatus !== "all" && o.status !== filterStatus) return false;
    if (searchQ && !o.id.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "orders", label: "Orders", icon: <ShoppingBag className="h-4 w-4" /> },
    { id: "vendors", label: "Vendors", icon: <Package className="h-4 w-4" /> },
    { id: "complaints", label: "Complaints", icon: <AlertTriangle className="h-4 w-4" /> },
    { id: "users", label: "Users", icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen pt-16 bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">RailBite Bharat Operations Centre</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live
            </div>
            <button className="btn-ghost relative">
              <Bell className="h-5 w-5" />
              {openComplaints > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 gradient-saffron rounded-full text-white text-[10px] font-bold flex items-center justify-center">{openComplaints}</span>
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${tab === t.id ? "gradient-saffron text-white shadow-md" : "bg-card border border-border hover:bg-muted"}`}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: ShoppingBag, label: "Orders Today", value: state.orders.length || 48, color: "text-accent", bg: "bg-accent/10", delta: "+12%" },
                { icon: DollarSign, label: "Revenue Today", value: `₹${(totalRevenue || 28900).toLocaleString()}`, color: "text-green-500", bg: "bg-green-500/10", delta: "+8%" },
                { icon: Package, label: "Active Vendors", value: activeVendors, color: "text-blue-500", bg: "bg-blue-500/10", delta: "+2" },
                { icon: AlertTriangle, label: "Open Complaints", value: openComplaints || 3, color: "text-amber-500", bg: "bg-amber-500/10", delta: openComplaints > 5 ? "↑ High" : "Normal" },
              ].map(k => (
                <div key={k.label} className="bg-card rounded-2xl p-5 border border-border card-hover">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${k.bg} flex items-center justify-center`}>
                      <k.icon className={`h-5 w-5 ${k.color}`} />
                    </div>
                    <span className="text-xs text-green-500 font-medium">{k.delta}</span>
                  </div>
                  <div className="font-display text-2xl font-bold">{k.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{k.label}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl p-5 border border-border">
                <h3 className="font-semibold mb-4">Revenue (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
                    <Bar dataKey="revenue" fill="hsl(24 95% 53%)" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card rounded-2xl p-5 border border-border">
                <h3 className="font-semibold mb-4">Orders by Station</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stationData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="station" type="category" tick={{ fontSize: 11 }} width={90} />
                    <Tooltip />
                    <Bar dataKey="orders" fill="hsl(222 60% 40%)" radius={[0,6,6,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Orders Feed */}
            <div className="bg-card rounded-2xl p-5 border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                Live Order Feed <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </h3>
              {state.orders.slice(0, 5).map(o => (
                <div key={o.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${o.status === "delivered" ? "bg-green-500" : o.status === "preparing" ? "bg-amber-500" : "bg-blue-500"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm font-medium">{o.id}</div>
                    <div className="text-xs text-muted-foreground">{o.station} • ₹{o.total}</div>
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium status-${o.status}`}>{o.status.replace(/_/g," ")}</span>
                </div>
              ))}
              {state.orders.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-6">No orders yet — place a test order from Passenger Portal</p>
              )}
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {tab === "orders" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search order ID…" className="input-base pl-9 py-2 text-sm" />
              </div>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-base py-2 text-sm w-auto">
                <option value="all">All Status</option>
                <option value="placed">Placed</option>
                <option value="preparing">Preparing</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
              </select>
              <button className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
                <Download className="h-4 w-4" /> Export CSV
              </button>
            </div>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 font-semibold">Order ID</th>
                    <th className="text-left p-3 font-semibold hidden md:table-cell">Station</th>
                    <th className="text-left p-3 font-semibold hidden sm:table-cell">Amount</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th className="text-left p-3 font-semibold hidden lg:table-cell">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(o => (
                    <tr key={o.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono text-xs">{o.id}</td>
                      <td className="p-3 hidden md:table-cell text-muted-foreground">{o.station}</td>
                      <td className="p-3 hidden sm:table-cell font-semibold">₹{o.total}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium status-${o.status}`}>{o.status.replace(/_/g," ")}</span>
                      </td>
                      <td className="p-3 hidden lg:table-cell text-muted-foreground">{o.paymentMethod}</td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No orders found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VENDORS TAB */}
        {tab === "vendors" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-display font-semibold">Vendor Management</h2>
            <div className="space-y-3">
              {state.vendors.map(v => (
                <div key={v.id} className="bg-card rounded-2xl p-5 border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{v.name}</h3>
                        {v.isSHG && <span className="badge-shg">SHG</span>}
                        {v.flagged && <span className="px-2 py-0.5 text-xs rounded-full bg-destructive/15 text-destructive font-bold">⚠ Flagged</span>}
                      </div>
                      <p className="text-sm text-muted-foreground">{v.station} • FSSAI: {v.fssaiNumber}</p>
                    </div>
                    <button
                      onClick={() => flagVendor(v.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${v.flagged ? "bg-green-500/10 text-green-600 hover:bg-green-500/20" : "bg-destructive/10 text-destructive hover:bg-destructive/20"}`}
                    >
                      <Gavel className="h-3 w-3" />
                      {v.flagged ? "Unflag" : "Flag"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{v.hygieneRating} rating</span>
                    <span className="text-muted-foreground">{v.complaintCount} complaints</span>
                    <span className="text-muted-foreground">{v.totalOrders} orders</span>
                    <span className={v.fssaiVerified ? "text-green-600 dark:text-green-400" : "text-amber-600"}>{v.fssaiVerified ? "✓ FSSAI Verified" : "⚠ Unverified"}</span>
                  </div>
                  <div className="mt-3 w-full bg-muted rounded-full h-1.5">
                    <div className="h-1.5 rounded-full gradient-saffron" style={{ width: `${v.hygieneScore}%` }} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Hygiene Score: {v.hygieneScore}/100</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMPLAINTS TAB */}
        {tab === "complaints" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-display font-semibold">Complaint Tickets ({state.complaints.length})</h2>
            {state.complaints.length === 0 ? (
              <div className="bg-card rounded-2xl p-12 border border-border text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-muted-foreground">No complaints filed yet.</p>
              </div>
            ) : (
              state.complaints.map(c => (
                <div key={c.id} className="bg-card rounded-2xl p-5 border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-mono text-sm font-semibold">{c.id}</div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${c.priority === "high" ? "bg-destructive/15 text-destructive" : c.priority === "medium" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`}>
                        {c.priority}
                      </span>
                      <span className="status-placed px-2 py-0.5 text-xs rounded-full">{c.status}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Order: {c.orderId}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {c.reasons.map(r => <span key={r} className="px-2 py-0.5 bg-muted rounded-full text-xs">{r}</span>)}
                  </div>
                  {c.text && <p className="text-sm text-muted-foreground">{c.text}</p>}
                </div>
              ))
            )}
          </div>
        )}

        {/* USERS TAB */}
        {tab === "users" && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-card rounded-2xl p-8 border border-border text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-display font-semibold mb-2">User Management</h3>
              <p className="text-muted-foreground text-sm">Firebase Auth integration required for live user data.</p>
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  { label: "Total Users", value: "1,247" },
                  { label: "Active Today", value: "89" },
                  { label: "New This Week", value: "43" },
                ].map(s => (
                  <div key={s.label} className="bg-muted/50 rounded-xl p-3">
                    <div className="font-display font-bold text-xl">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}