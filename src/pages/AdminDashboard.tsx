import { useApp } from "@/store/AppContext";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { StarRating } from "@/components/StarRating";
import { Shield, Package, IndianRupee, AlertTriangle, Users, BarChart3, PieChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart as RPieChart, Pie } from "recharts";

export default function AdminDashboard() {
  const { state, getTotalRevenue } = useApp();
  const revenue = getTotalRevenue();
  const flaggedVendors = state.vendors.filter((v) => v.flagged);
  const totalJobs = state.jobs.vendors + state.jobs.delivery + state.jobs.kitchen + state.jobs.hygiene;

  const revenuePieData = [
    { name: "Vendor", value: revenue.vendor, color: "hsl(152, 60%, 42%)" },
    { name: "Platform (7%)", value: revenue.platform, color: "hsl(24, 95%, 53%)" },
    { name: "IRCTC (3%)", value: revenue.irctc, color: "hsl(222, 60%, 18%)" },
    { name: "Maintenance", value: revenue.maintenance, color: "hsl(45, 93%, 47%)" },
  ];

  const complaintData = state.vendors
    .filter((v) => v.complaintCount > 0)
    .sort((a, b) => b.complaintCount - a.complaintCount)
    .slice(0, 8)
    .map((v) => ({ name: v.name.split(" ")[0], complaints: v.complaintCount, flagged: v.flagged }));

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-accent" />
          <div>
            <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Real-time overview of RailBite Bharat operations</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Orders", value: state.orders.length, icon: Package, color: "text-accent" },
            { label: "Total Revenue", value: revenue.total, icon: IndianRupee, prefix: "₹", color: "text-emerald" },
            { label: "Complaints", value: state.complaints.length, icon: AlertTriangle, color: "text-destructive" },
            { label: "Flagged Vendors", value: flaggedVendors.length, icon: AlertTriangle, color: "text-warning" },
            { label: "Jobs Generated", value: totalJobs + state.orders.length, icon: Users, color: "text-navy-light" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl p-4 border border-border animate-fade-in">
              <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
              <div className="text-2xl font-display font-bold">
                <AnimatedCounter end={stat.value} prefix={stat.prefix || ""} />
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Revenue Split */}
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
                      <Pie data={revenuePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={(entry) => `${entry.name}`}>
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
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </span>
                      <span className="font-semibold">₹{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm py-12 text-center">No orders yet. Revenue data will appear here.</p>
            )}
          </div>

          {/* Complaint Chart */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-destructive" />
              <h2 className="font-display text-lg font-bold">Complaint Analytics</h2>
            </div>
            {complaintData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={complaintData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 89%)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="complaints" radius={[6, 6, 0, 0]}>
                      {complaintData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.flagged ? "hsl(0, 84%, 60%)" : "hsl(24, 95%, 53%)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm py-12 text-center">No complaints recorded yet.</p>
            )}
          </div>
        </div>

        {/* Vendor Ratings Table */}
        <div className="bg-card rounded-2xl p-6 border border-border mb-8">
          <h2 className="font-display text-lg font-bold mb-4">All Vendors</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 text-muted-foreground font-medium">Vendor</th>
                  <th className="pb-3 text-muted-foreground font-medium">Station</th>
                  <th className="pb-3 text-muted-foreground font-medium">Rating</th>
                  <th className="pb-3 text-muted-foreground font-medium">Complaints</th>
                  <th className="pb-3 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {state.vendors.map((v) => (
                  <tr key={v.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 font-medium">{v.name}</td>
                    <td className="py-3 text-muted-foreground">{v.station}</td>
                    <td className="py-3"><StarRating rating={v.hygieneRating} size={12} /></td>
                    <td className="py-3">{v.complaintCount}</td>
                    <td className="py-3">
                      {v.flagged ? (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-destructive text-destructive-foreground font-bold">Flagged</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-emerald/10 text-emerald font-medium">Active</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h2 className="font-display text-lg font-bold mb-4">Recent Orders</h2>
          {state.orders.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">No orders yet.</p>
          ) : (
            <div className="space-y-2">
              {state.orders.slice().reverse().slice(0, 10).map((o) => (
                <div key={o.id} className="flex items-center justify-between py-3 px-4 rounded-lg bg-background border border-border">
                  <div>
                    <span className="font-medium">#{o.id}</span>
                    <span className="text-muted-foreground text-xs ml-2">{o.station}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${o.status === "delivered" ? "bg-emerald/10 text-emerald" : "bg-accent/10 text-accent"}`}>
                      {o.status.replace(/_/g, " ")}
                    </span>
                    <span className="font-bold">₹{o.total}</span>
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
