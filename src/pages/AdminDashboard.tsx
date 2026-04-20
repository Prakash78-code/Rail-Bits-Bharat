import { useApp } from "@/store/AppContext";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { StarRating } from "@/components/StarRating";
import { FssaiBadge } from "@/components/FssaiBadge";
import { HygieneScore } from "@/components/HygieneScore";
import {
  Shield, Package, IndianRupee, AlertTriangle, Users,
  BarChart3, PieChart, ShieldCheck, ShieldAlert, TrendingUp,
  MapPin, Ban, CheckCircle2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
  PieChart as RPieChart, Pie,
  LineChart, Line, Legend,
} from "recharts";

export default function AdminDashboard() {
  const { state, getTotalRevenue } = useApp();
  const revenue = getTotalRevenue();

  const flaggedVendors = state.vendors.filter((v) => v.flagged);
  const verifiedVendors = state.vendors.filter((v) => v.fssaiVerified);
  const unverifiedVendors = state.vendors.filter((v) => !v.fssaiVerified);
  const totalJobs = state.jobs.vendors + state.jobs.delivery + state.jobs.kitchen + state.jobs.hygiene;

  // ── Chart Data ────────────────────────────────────────────────────────────

  const revenuePieData = [
    { name: "Vendor (90%)",   value: revenue.vendor,   color: "hsl(152, 60%, 42%)" },
    { name: "Platform (7%)",  value: revenue.platform, color: "hsl(24, 95%, 53%)" },
    { name: "IRCTC (3%)",     value: revenue.irctc,    color: "hsl(222, 60%, 18%)" },
  ];

  const complaintData = state.vendors
    .filter((v) => v.complaintCount > 0)
    .sort((a, b) => b.complaintCount - a.complaintCount)
    .slice(0, 8)
    .map((v) => ({
      name: v.name.split(" ")[0],
      complaints: v.complaintCount,
      flagged: v.flagged,
    }));

  // Hygiene Score chart — all vendors
  const hygieneChartData = state.vendors.map((v) => ({
    name: v.name.split(" ")[0],
    score: v.hygieneScore,
    fill:
      v.hygieneScore >= 85 ? "#22c55e"
      : v.hygieneScore >= 65 ? "#facc15"
      : v.hygieneScore >= 45 ? "#fb923c"
      : "#ef4444",
  }));

  // Station-wise order heatmap data
  const stationOrderData = ["Lucknow", "Kanpur", "Allahabad", "Varanasi", "Patna", "Delhi"].map(
    (station) => ({
      station,
      orders: state.orders.filter((o) => o.station === station).length,
      complaints: state.complaints.filter((c) => {
        const order = state.orders.find((o) => o.id === c.orderId);
        return order?.station === station;
      }).length,
    })
  );

  // Revenue trend (mock daily data for demo)
  const revenueTrendData = [
    { day: "Mon", revenue: 1200, orders: 8 },
    { day: "Tue", revenue: 1800, orders: 12 },
    { day: "Wed", revenue: 1500, orders: 10 },
    { day: "Thu", revenue: 2200, orders: 15 },
    { day: "Fri", revenue: 2800, orders: 19 },
    { day: "Sat", revenue: 3200, orders: 22 },
    { day: "Sun", revenue: revenue.total > 0 ? revenue.total : 2600, orders: state.orders.length > 0 ? state.orders.length : 18 },
  ];

  return (
    <div className="min-h-screen py-8 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-accent" />
          <div>
            <h1 className="font-display text-2xl font-bold">
              Government & Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time compliance, revenue & operations — RailBite Bharat
            </p>
          </div>
        </div>

        {/* ── Top Stats ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {[
            { label: "Total Orders",      value: state.orders.length,      icon: Package,       color: "text-accent" },
            { label: "Total Revenue",     value: revenue.total,            icon: IndianRupee,   color: "text-emerald", prefix: "₹" },
            { label: "IRCTC Share (3%)",  value: revenue.irctc,            icon: TrendingUp,    color: "text-blue-500", prefix: "₹" },
            { label: "Complaints",        value: state.complaints.length,  icon: AlertTriangle, color: "text-destructive" },
            { label: "Flagged Vendors",   value: flaggedVendors.length,    icon: Ban,           color: "text-orange-500" },
            { label: "FSSAI Verified",    value: verifiedVendors.length,   icon: ShieldCheck,   color: "text-green-500" },
            { label: "Jobs Generated",    value: totalJobs + state.orders.length, icon: Users,  color: "text-purple-500" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-xl p-4 border border-border animate-fade-in"
            >
              <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
              <div className="text-2xl font-display font-bold">
                <AnimatedCounter end={stat.value} prefix={stat.prefix || ""} />
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── FSSAI Compliance Summary ─────────────────────────────────────── */}
        <div className="bg-card rounded-2xl p-6 border border-border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="h-5 w-5 text-green-500" />
            <h2 className="font-display text-lg font-bold">FSSAI Compliance Overview</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
              <ShieldCheck className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                {verifiedVendors.length}
              </div>
              <div className="text-xs text-green-600 dark:text-green-500">Verified Vendors</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-center">
              <ShieldAlert className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                {unverifiedVendors.length}
              </div>
              <div className="text-xs text-yellow-600 dark:text-yellow-500">Pending Verification</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center">
              <Ban className="h-6 w-6 text-red-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                {flaggedVendors.length}
              </div>
              <div className="text-xs text-red-600 dark:text-red-500">Flagged / Blacklisted</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
              <CheckCircle2 className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {Math.round((verifiedVendors.length / Math.max(state.vendors.length, 1)) * 100)}%
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-500">Compliance Rate</div>
            </div>
          </div>
        </div>

        {/* ── Charts Row 1 ────────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">

          {/* Revenue Split Pie */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="h-5 w-5 text-accent" />
              <h2 className="font-display text-lg font-bold">Revenue Split</h2>
            </div>
            {revenue.total > 0 ? (
              <>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RPieChart>
                      <Pie
                        data={revenuePieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        label={(entry) => entry.name}
                      >
                        {revenuePieData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `₹${value}`} />
                    </RPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-2">
                  {revenuePieData.map((item) => (
                    <div key={item.name} className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        {item.name}
                      </span>
                      <span className="font-semibold">₹{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm py-12 text-center">
                No orders yet. Revenue data will appear here.
              </p>
            )}
          </div>

          {/* Complaint Bar Chart */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-destructive" />
              <h2 className="font-display text-lg font-bold">Complaint Heatmap</h2>
            </div>
            {complaintData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={complaintData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="complaints" radius={[6, 6, 0, 0]}>
                      {complaintData.map((entry, idx) => (
                        <Cell
                          key={idx}
                          fill={entry.flagged ? "#ef4444" : "#fb923c"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm py-12 text-center">
                No complaints recorded yet.
              </p>
            )}
          </div>
        </div>

        {/* ── Charts Row 2 ────────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">

          {/* Hygiene Score Chart */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-green-500" />
              <h2 className="font-display text-lg font-bold">Hygiene Scores — All Vendors</h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hygieneChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value: number) => `${value}/100`} />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {hygieneChartData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-3 text-xs">
              {[
                { color: "#22c55e", label: "Excellent (85+)" },
                { color: "#facc15", label: "Good (65-84)" },
                { color: "#fb923c", label: "Average (45-64)" },
                { color: "#ef4444", label: "Poor (<45)" },
              ].map((l) => (
                <span key={l.label} className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: l.color }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>

          {/* Station-wise Order + Complaint Heatmap */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-blue-500" />
              <h2 className="font-display text-lg font-bold">Station-wise Activity</h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stationOrderData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="station" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" name="Orders" fill="hsl(24, 95%, 53%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="complaints" name="Complaints" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Revenue Trend Line Chart */}
        <div className="bg-card rounded-2xl p-6 border border-border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-accent" />
            <h2 className="font-display text-lg font-bold">Revenue Trend (This Week)</h2>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number, name: string) => [name === "revenue" ? `₹${value}` : value, name]} />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="hsl(24, 95%, 53%)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="orders" name="Orders" stroke="hsl(152, 60%, 42%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── All Vendors Table ────────────────────────────────────────────── */}
        <div className="bg-card rounded-2xl p-6 border border-border mb-6">
          <h2 className="font-display text-lg font-bold mb-4">
            All Vendors — Full Compliance View
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 text-muted-foreground font-medium">Vendor</th>
                  <th className="pb-3 text-muted-foreground font-medium">Station</th>
                  <th className="pb-3 text-muted-foreground font-medium">FSSAI</th>
                  <th className="pb-3 text-muted-foreground font-medium">Hygiene</th>
                  <th className="pb-3 text-muted-foreground font-medium">Rating</th>
                  <th className="pb-3 text-muted-foreground font-medium">Complaints</th>
                  <th className="pb-3 text-muted-foreground font-medium">Earnings</th>
                  <th className="pb-3 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {state.vendors.map((v) => (
                  <tr key={v.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-medium">{v.name}</td>
                    <td className="py-3 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {v.station}
                      </span>
                    </td>
                    <td className="py-3">
                      <FssaiBadge
                        fssaiNumber={v.fssaiNumber}
                        verified={v.fssaiVerified}
                      />
                    </td>
                    <td className="py-3 min-w-[140px]">
                      <HygieneScore score={v.hygieneScore} />
                    </td>
                    <td className="py-3">
                      <StarRating rating={v.hygieneRating} size={12} />
                    </td>
                    <td className="py-3">
                      <span className={v.complaintCount >= 3 ? "text-destructive font-bold" : ""}>
                        {v.complaintCount}
                      </span>
                    </td>
                    <td className="py-3 font-medium">₹{v.earnings}</td>
                    <td className="py-3">
                      {v.flagged ? (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-destructive text-destructive-foreground font-bold flex items-center gap-1 w-fit">
                          <Ban className="h-3 w-3" /> Blacklisted
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-emerald/10 text-emerald font-medium flex items-center gap-1 w-fit">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Blacklisted Vendors Alert ────────────────────────────────────── */}
        {flaggedVendors.length > 0 && (
          <div className="bg-card rounded-2xl p-6 border border-destructive/30 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Ban className="h-5 w-5 text-destructive" />
              <h2 className="font-display text-lg font-bold text-destructive">
                Blacklisted Vendors ({flaggedVendors.length})
              </h2>
            </div>
            <div className="space-y-3">
              {flaggedVendors.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between p-4 bg-destructive/5 border border-destructive/20 rounded-xl"
                >
                  <div>
                    <p className="font-semibold">{v.name}</p>
                    <p className="text-xs text-muted-foreground">
                      📍 {v.station} · {v.complaintCount} complaints
                    </p>
                    <div className="mt-1">
                      <FssaiBadge fssaiNumber={v.fssaiNumber} verified={v.fssaiVerified} />
                    </div>
                  </div>
                  <div className="text-right">
                    <HygieneScore score={v.hygieneScore} />
                    <p className="text-xs text-destructive font-semibold mt-1">
                      ⚠ Action Required
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Recent Orders ────────────────────────────────────────────────── */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h2 className="font-display text-lg font-bold mb-4">
            Recent Orders (Live)
          </h2>
          {state.orders.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">
              No orders yet. Place an order from Passenger Portal to see data here.
            </p>
          ) : (
            <div className="space-y-2">
              {state.orders
                .slice()
                .reverse()
                .slice(0, 10)
                .map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between py-3 px-4 rounded-lg bg-background border border-border"
                  >
                    <div>
                      <span className="font-medium text-sm">#{o.id}</span>
                      <span className="text-muted-foreground text-xs ml-2">
                        📍 {o.station}
                      </span>
                      <span className="text-muted-foreground text-xs ml-2">
                        PNR: {o.pnr}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Revenue split mini */}
                      <span className="text-xs text-muted-foreground hidden md:block">
                        IRCTC: ₹{o.revenueSplit.irctc}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          o.status === "delivered"
                            ? "bg-emerald/10 text-emerald"
                            : "bg-accent/10 text-accent"
                        }`}
                      >
                        {o.status.replace(/_/g, " ")}
                      </span>
                      <span className="font-bold text-sm">₹{o.total}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}