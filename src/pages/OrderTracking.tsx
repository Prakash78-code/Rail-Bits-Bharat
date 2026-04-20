import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import type { Order } from "@/data/mockData";
import { Navigation, Phone, RefreshCw, ZoomIn, ZoomOut, X, Clock } from "lucide-react";

// Simple SVG-based map (no external dependency)
const PLATFORM_COORDS = { x: 50, y: 50 };

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

export default function OrderTracking() {
  const location = useLocation();
  const order: Order | null = location.state?.order ?? null;
  const [partnerPos, setPartnerPos] = useState({ x: 10, y: 80 });
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(order?.eta ?? 720);
  const [showCallModal, setShowCallModal] = useState(false);
  const animRef = useRef<number>();

  // Animate delivery partner towards platform
  useEffect(() => {
    let t = 0;
    const start = { x: 10, y: 80 };
    const end = { x: 50, y: 50 };
    const tick = () => {
      t = Math.min(t + 0.002, 1);
      setPartnerPos({ x: lerp(start.x, end.x, t), y: lerp(start.y, end.y, t) });
      setProgress(Math.round(t * 100));
      if (t < 1) animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  // ETA countdown
  useEffect(() => {
    if (eta <= 0) return;
    const t = setInterval(() => setEta(e => Math.max(0, e - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const etaMin = Math.floor(eta / 60);
  const etaSec = eta % 60;
  const isArrived = progress >= 95;

  return (
    <div className="min-h-screen pt-16 flex flex-col">
      {/* Map area */}
      <div className="flex-1 relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
        <svg viewBox="0 0 100 100" className="w-full h-full" style={{ minHeight: 320 }}>
          {/* Grid lines */}
          {[20,40,60,80].map(v => (
            <g key={v}>
              <line x1={v} y1="0" x2={v} y2="100" stroke="currentColor" strokeWidth="0.3" className="text-slate-300 dark:text-slate-600" />
              <line x1="0" y1={v} x2="100" y2={v} stroke="currentColor" strokeWidth="0.3" className="text-slate-300 dark:text-slate-600" />
            </g>
          ))}

          {/* Route line */}
          <line
            x1="10" y1="80" x2="50" y2="50"
            stroke="hsl(24 95% 53%)" strokeWidth="1" strokeDasharray="3,2"
            className="opacity-60"
          />

          {/* Platform/Station marker */}
          <g transform="translate(50, 50)">
            <circle r="5" fill="hsl(222 60% 18%)" className="animate-pulse" />
            <circle r="8" fill="hsl(222 60% 18% / 0.2)" />
            <text y="13" textAnchor="middle" fontSize="3" fill="currentColor" className="text-slate-600 dark:text-slate-300">
              🚉 Platform
            </text>
          </g>

          {/* Train marker */}
          <g transform="translate(65, 35)">
            <rect x="-6" y="-4" width="12" height="8" rx="2" fill="hsl(222 60% 18%)" />
            <text y="1.5" textAnchor="middle" fontSize="5">🚂</text>
            <text y="12" textAnchor="middle" fontSize="2.5" fill="currentColor" className="text-slate-500">
              Your Train
            </text>
          </g>

          {/* Vendor kitchen */}
          <g transform="translate(10, 80)">
            <circle r="4" fill="hsl(152 60% 42%)" />
            <text y="9" textAnchor="middle" fontSize="2.5" fill="currentColor" className="text-slate-500">
              🍳 Kitchen
            </text>
          </g>

          {/* Delivery partner (animated) */}
          <g transform={`translate(${partnerPos.x}, ${partnerPos.y})`}>
            <circle r="4" fill="hsl(24 95% 53%)" className="animate-pulse" />
            <text y="1.5" textAnchor="middle" fontSize="4">🏃</text>
            <text y="9" textAnchor="middle" fontSize="2.5" fill="currentColor" className="text-slate-500">
              Partner
            </text>
          </g>
        </svg>

        {/* Progress bar overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-border">
          <div className="h-full gradient-saffron transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        {/* ETA badge */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 glass rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg">
          <Clock className="h-4 w-4 text-accent" />
          {isArrived ? (
            <span className="font-bold text-green-500">🎉 Arrived at Platform!</span>
          ) : (
            <span className="font-bold">ETA: <span className="text-accent">{etaMin}:{etaSec.toString().padStart(2,"0")}</span></span>
          )}
        </div>

        {/* Map controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-muted transition-colors shadow">
            <ZoomIn className="h-4 w-4" />
          </button>
          <button className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-muted transition-colors shadow">
            <ZoomOut className="h-4 w-4" />
          </button>
          <button className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-muted transition-colors shadow">
            <Navigation className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Bottom panel */}
      <div className="bg-card border-t border-border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display font-bold">{isArrived ? "Delivered!" : "Your food is on the way"}</div>
            <div className="text-sm text-muted-foreground">Order {order?.id ?? "ORD-DEMO"}</div>
          </div>
          <button
            onClick={() => setShowCallModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 font-medium text-sm hover:bg-green-500/20 transition-colors"
          >
            <Phone className="h-4 w-4" /> Call Partner
          </button>
        </div>

        {/* Delivery partner info */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
          <div className="w-10 h-10 rounded-full gradient-saffron flex items-center justify-center text-xl">🏃</div>
          <div className="flex-1">
            <div className="font-medium text-sm">Raju Kumar</div>
            <div className="text-xs text-muted-foreground">Delivery Partner • ⭐ 4.8</div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${isArrived ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"}`}>
            {isArrived ? "Arrived" : `${progress}% there`}
          </div>
        </div>

        {/* Live update indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Live tracking • Updates every 10 seconds
          <button className="ml-auto flex items-center gap-1 hover:text-foreground transition-colors">
            <RefreshCw className="h-3 w-3" /> Refresh
          </button>
        </div>
      </div>

      {/* Call modal */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-sm animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold">Call Delivery Partner</h3>
              <button onClick={() => setShowCallModal(false)} className="p-1 rounded-lg hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🏃</div>
              <div className="font-semibold">Raju Kumar</div>
              <div className="text-muted-foreground text-sm">+91 98××××××12 (masked)</div>
            </div>
            <button className="btn-primary w-full">
              <Phone className="h-5 w-5" /> Call Now
            </button>
            <p className="text-xs text-center text-muted-foreground mt-3">Number is masked for privacy</p>
          </div>
        </div>
      )}
    </div>
  );
}