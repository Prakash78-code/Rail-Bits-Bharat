import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line, Legend,
  AreaChart, Area,
} from "recharts";
import {
  Brain, TrendingUp, MapPin, Clock, AlertTriangle,
  CheckCircle2, Zap, ChefHat, Users,
} from "lucide-react";
// 🔥 BACKEND URL
const API_URL = "https://rail-bits-bharat.onrender.com";

// ── Types ─────────────────────────────────────────────────────────────────────
interface StationDemand {
  station: string;
  predictedOrders: number;
  actualOrders: number;
  confidence: number; // 0-100
  trend: "up" | "down" | "stable";
  peakHour: string;
  topItem: string;
  vendorsNeeded: number;
  alert?: string;
}

interface HourlyDemand {
  hour: string;
  orders: number;
  predicted: number;
}

interface FoodCategoryDemand {
  category: string;
  demand: number;
  color: string;
}

// ── Mock ML Prediction Engine ─────────────────────────────────────────────────
const STATIONS = ["Lucknow", "Kanpur", "Allahabad", "Varanasi", "Patna", "Delhi"];

const BASE_DEMAND: Record<string, number> = {
  Lucknow: 320, Kanpur: 280, Allahabad: 210,
  Varanasi: 190, Patna: 240, Delhi: 480,
};

const TOP_ITEMS: Record<string, string> = {
  Lucknow: "Dal Tadka + Rice",
  Kanpur: "Chicken Biryani",
  Allahabad: "Kachori Sabzi",
  Varanasi: "Baati Chokha",
  Patna: "Litti Chokha",
  Delhi: "Butter Chicken",
};

// Simulate ML prediction with some variance
function generatePrediction(station: string, multiplier: number): StationDemand {
  const base = BASE_DEMAND[station] || 200;
  const predicted = Math.round(base * multiplier + (Math.random() - 0.5) * 40);
  const actual = Math.round(predicted * (0.85 + Math.random() * 0.3));
  const confidence = Math.round(75 + Math.random() * 20);
  const trend = multiplier > 1.1 ? "up" : multiplier < 0.9 ? "down" : "stable";

  return {
    station,
    predictedOrders: predicted,
    actualOrders: actual,
    confidence,
    trend,
    peakHour: ["12:00 PM", "1:00 PM", "7:00 PM", "8:00 PM"][Math.floor(Math.random() * 4)],
    topItem: TOP_ITEMS[station],
    vendorsNeeded: Math.ceil(predicted / 80),
    alert: predicted > 400 ? "High demand — extra vendors needed!" : undefined,
  };
}

function generateHourlyData(station: string): HourlyDemand[] {
  const base = (BASE_DEMAND[station] || 200) / 12;
  const hours = ["6AM", "8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM", "10PM"];
  const multipliers = [0.3, 0.6, 0.8, 1.8, 1.4, 0.7, 1.6, 1.9, 0.5];
  return hours.map((hour, i) => ({
    hour,
    orders: Math.round(base * multipliers[i] * (0.9 + Math.random() * 0.2)),
    predicted: Math.round(base * multipliers[i]),
  }));
}

function generateWeeklyTrend() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const base = [320, 340, 290, 380, 410, 520, 480];
  return days.map((day, i) => ({
    day,
    orders: base[i] + Math.round((Math.random() - 0.5) * 40),
    predicted: base[i],
    revenue: Math.round(base[i] * 150 * 0.07),
  }));
}

const FOOD_CATEGORIES: FoodCategoryDemand[] = [
  { category: "Veg Thali", demand: 38, color: "#22c55e" },
  { category: "Non-Veg", demand: 28, color: "#ef4444" },
  { category: "Jain Food", demand: 12, color: "#f97316" },
  { category: "Diabetic", demand: 10, color: "#3b82f6" },
  { category: "Snacks", demand: 8, color: "#a855f7" },
  { category: "Beverages", demand: 4, color: "#00c9a7" },
];

// ── Confidence Badge ──────────────────────────────────────────────────────────
function ConfidenceBadge({ value }: { value: number }) {
  const color =
    value >= 90 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    : value >= 75 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>
      {value}% confidence
    </span>
  );
}

// ── Trend Icon ────────────────────────────────────────────────────────────────
function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <span className="text-green-500 font-bold text-sm">▲ Rising</span>;
  if (trend === "down") return <span className="text-red-500 font-bold text-sm">▼ Falling</span>;
  return <span className="text-yellow-500 font-bold text-sm">▬ Stable</span>;
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DemandForecast() {
  const [selectedStation, setSelectedStation] = useState("Delhi");
  const [timeFrame, setTimeFrame] = useState<"today" | "week">("today");
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<StationDemand[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyDemand[]>([]);
  const [weeklyData, setWeeklyData] = useState(generateWeeklyTrend());
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulate ML model running
  function runPrediction() {
    setIsLoading(true);
    setTimeout(() => {
      const multiplier = timeFrame === "week" ? 1.2 : 1.0;
      setPredictions(STATIONS.map((s) => generatePrediction(s, multiplier)));
      setHourlyData(generateHourlyData(selectedStation));
      setWeeklyData(generateWeeklyTrend());
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1200);
  }

  useEffect(() => { runPrediction(); }, [selectedStation, timeFrame]);

  const selectedPrediction = predictions.find((p) => p.station === selectedStation);
  const totalPredicted = predictions.reduce((s, p) => s + p.predictedOrders, 0);
  const alertStations = predictions.filter((p) => p.alert);

  return (
    <div className="min-h-screen py-8 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 dark:bg-purple-900/30 rounded-2xl p-3">
              <Brain className="h-7 w-7 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">
                AI Demand Forecasting
              </h1>
              <p className="text-sm text-muted-foreground">
                ML-powered food demand prediction · Station-wise · 2hr advance alert
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              Updated: {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            <button
              onClick={runPrediction}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 disabled:opacity-60 transition-all"
            >
              <Zap className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Running ML..." : "Re-run Model"}
            </button>
          </div>
        </div>

        {/* ── AMD ROCm Badge ────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-300 dark:border-purple-700 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
          <Zap className="h-5 w-5 text-purple-500 flex-shrink-0" />
          <p className="text-sm text-purple-700 dark:text-purple-300">
            <span className="font-bold">AMD Instinct GPU + ROCm Platform</span> —
            Demand forecasting models run on AMD-powered inference.
            Predicts food requirements 2 hours in advance per station.
          </p>
        </div>

        {/* ── Top Stats ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Predicted Orders", value: totalPredicted.toLocaleString(), icon: TrendingUp, color: "text-purple-500" },
            { label: "Stations Monitored", value: STATIONS.length.toString(), icon: MapPin, color: "text-blue-500" },
            { label: "Alert Stations", value: alertStations.length.toString(), icon: AlertTriangle, color: "text-orange-500" },
            { label: "Avg Confidence", value: `${Math.round(predictions.reduce((s, p) => s + p.confidence, 0) / Math.max(predictions.length, 1))}%`, icon: Brain, color: "text-green-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl p-4 border border-border shadow-sm">
              <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-display font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── Alert Banner ──────────────────────────────────────────────────── */}
        {alertStations.length > 0 && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-orange-700 dark:text-orange-400 text-sm">
                High Demand Alert — {alertStations.length} station(s)
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-500 mt-0.5">
                {alertStations.map((s) => s.station).join(", ")} — Extra vendors recommended 2hrs before peak
              </p>
            </div>
          </div>
        )}

        {/* ── Controls ──────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Station selector */}
          <div className="flex gap-2 overflow-x-auto pb-1 flex-wrap">
            {STATIONS.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStation(s)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all whitespace-nowrap ${
                  selectedStation === s
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-card text-muted-foreground border-border hover:border-purple-400"
                }`}
              >
                📍 {s}
              </button>
            ))}
          </div>

          {/* Time frame */}
          <div className="flex gap-2 ml-auto">
            {(["today", "week"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeFrame(t)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all capitalize ${
                  timeFrame === t
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-card text-muted-foreground border-border hover:border-blue-400"
                }`}
              >
                {t === "today" ? "Today" : "This Week"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Selected Station Card ──────────────────────────────────────────── */}
        {selectedPrediction && (
          <div className="bg-card rounded-2xl p-6 border border-purple-200 dark:border-purple-800 mb-6 shadow-sm">
            <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
              <div>
                <h2 className="font-display text-xl font-bold flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-500" />
                  {selectedPrediction.station} Station
                </h2>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <TrendIcon trend={selectedPrediction.trend} />
                  <ConfidenceBadge value={selectedPrediction.confidence} />
                </div>
              </div>
              {selectedPrediction.alert && (
                <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-3 py-1.5 rounded-xl text-xs font-bold">
                  <AlertTriangle className="h-4 w-4" />
                  {selectedPrediction.alert}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background rounded-xl p-4 border border-border text-center">
                <p className="text-xs text-muted-foreground mb-1">Predicted Orders</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {selectedPrediction.predictedOrders}
                </p>
              </div>
              <div className="bg-background rounded-xl p-4 border border-border text-center">
                <p className="text-xs text-muted-foreground mb-1">Peak Hour</p>
                <p className="text-lg font-bold flex items-center justify-center gap-1">
                  <Clock className="h-4 w-4 text-blue-500" />
                  {selectedPrediction.peakHour}
                </p>
              </div>
              <div className="bg-background rounded-xl p-4 border border-border text-center">
                <p className="text-xs text-muted-foreground mb-1">Top Dish</p>
                <p className="text-sm font-bold">
                  <ChefHat className="h-4 w-4 text-orange-500 inline mr-1" />
                  {selectedPrediction.topItem}
                </p>
              </div>
              <div className="bg-background rounded-xl p-4 border border-border text-center">
                <p className="text-xs text-muted-foreground mb-1">Vendors Needed</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  <Users className="h-4 w-4 inline mr-1" />
                  {selectedPrediction.vendorsNeeded}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Charts Row 1 ──────────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">

          {/* Hourly Demand Chart */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-blue-500" />
              <h3 className="font-display font-semibold">
                Hourly Demand — {selectedStation}
              </h3>
            </div>
            {isLoading ? (
              <div className="h-56 flex items-center justify-center text-muted-foreground text-sm">
                Running ML model...
              </div>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyData}>
                    <defs>
                      <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="predicted"
                      name="ML Predicted"
                      stroke="#a855f7"
                      fill="url(#predGrad)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="orders"
                      name="Actual"
                      stroke="#3b82f6"
                      fill="url(#actualGrad)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Food Category Demand Pie */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ChefHat className="h-5 w-5 text-orange-500" />
              <h3 className="font-display font-semibold">Food Category Demand</h3>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FOOD_CATEGORIES} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                  <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} width={75} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Bar dataKey="demand" radius={[0, 6, 6, 0]}>
                    {FOOD_CATEGORIES.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── All Stations Comparison Chart ─────────────────────────────────── */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            <h3 className="font-display font-semibold">
              All Stations — Predicted vs Actual Orders
            </h3>
          </div>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
              Running ML model...
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={predictions}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="station" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="predictedOrders" name="ML Predicted" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actualOrders" name="Actual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* ── Weekly Revenue Trend ───────────────────────────────────────────── */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <h3 className="font-display font-semibold">Weekly Revenue Trend (Platform Commission 7%)</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v, name) => [name === "revenue" ? `₹${v}` : v, name]} />
                <Legend />
                <Line type="monotone" dataKey="orders" name="Orders" stroke="#a855f7" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── All Stations Table ─────────────────────────────────────────────── */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
          <h3 className="font-display font-semibold mb-4">
            All Stations — ML Prediction Summary
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 text-muted-foreground font-medium">Station</th>
                  <th className="pb-3 text-muted-foreground font-medium">Predicted</th>
                  <th className="pb-3 text-muted-foreground font-medium">Actual</th>
                  <th className="pb-3 text-muted-foreground font-medium">Confidence</th>
                  <th className="pb-3 text-muted-foreground font-medium">Peak Hour</th>
                  <th className="pb-3 text-muted-foreground font-medium">Vendors</th>
                  <th className="pb-3 text-muted-foreground font-medium">Trend</th>
                  <th className="pb-3 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((p) => (
                  <tr
                    key={p.station}
                    className={`border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors cursor-pointer ${
                      selectedStation === p.station ? "bg-purple-50 dark:bg-purple-900/10" : ""
                    }`}
                    onClick={() => setSelectedStation(p.station)}
                  >
                    <td className="py-3 font-semibold">📍 {p.station}</td>
                    <td className="py-3 text-purple-600 dark:text-purple-400 font-bold">{p.predictedOrders}</td>
                    <td className="py-3 text-blue-600 dark:text-blue-400">{p.actualOrders}</td>
                    <td className="py-3"><ConfidenceBadge value={p.confidence} /></td>
                    <td className="py-3 text-muted-foreground">{p.peakHour}</td>
                    <td className="py-3 font-semibold">{p.vendorsNeeded}</td>
                    <td className="py-3"><TrendIcon trend={p.trend} /></td>
                    <td className="py-3">
                      {p.alert ? (
                        <span className="flex items-center gap-1 text-xs text-orange-600 font-bold">
                          <AlertTriangle className="h-3 w-3" /> Alert
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-green-600 font-bold">
                          <CheckCircle2 className="h-3 w-3" /> Normal
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}