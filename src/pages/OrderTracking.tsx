import { useState, useEffect, useRef } from "react";
import { useApp } from "@/store/AppContext";
import { MapPin, Clock, CheckCircle2, Package, Bike, ChefHat, QrCode, Phone } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  lat: number;
  lng: number;
}

interface TrackingStep {
  id: string;
  label: string;
  subLabel: string;
  icon: React.ElementType;
  status: "done" | "active" | "pending";
  time?: string;
}

// ── Fake station coordinates ───────────────────────────────────────────────────
const STATION_COORDS: Record<string, { lat: number; lng: number }> = {
  Lucknow:    { lat: 26.8467, lng: 80.9462 },
  Kanpur:     { lat: 26.4499, lng: 80.3319 },
  Allahabad:  { lat: 25.4358, lng: 81.8463 },
  Varanasi:   { lat: 25.3176, lng: 82.9739 },
  Patna:      { lat: 25.5941, lng: 85.1376 },
  Delhi:      { lat: 28.6139, lng: 77.2090 },
};

// ── Simulate delivery partner movement ───────────────────────────────────────
function useMovingPartner(
  orderId: string,
  station: string,
  active: boolean
): DeliveryPartner {
  const base = STATION_COORDS[station] || { lat: 26.8467, lng: 80.9462 };
  const [pos, setPos] = useState({
    lat: base.lat + (Math.random() - 0.5) * 0.008,
    lng: base.lng + (Math.random() - 0.5) * 0.008,
  });

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setPos((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.0008,
        lng: prev.lng + (Math.random() - 0.5) * 0.0008,
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [active]);

  return {
    id: `DP-${orderId}`,
    name: "Raju Delivery",
    phone: "+91 98765 43210",
    lat: pos.lat,
    lng: pos.lng,
  };
}

// ── Map Component (using OpenStreetMap iframe embed) ──────────────────────────
function LiveMap({
  station,
  partnerLat,
  partnerLng,
}: {
  station: string;
  partnerLat: number;
  partnerLng: number;
}) {
  const base = STATION_COORDS[station] || { lat: 26.8467, lng: 80.9462 };

  // OpenStreetMap embed with marker
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    base.lng - 0.01
  },${base.lat - 0.01},${base.lng + 0.01},${base.lat + 0.01}&layer=mapnik&marker=${
    partnerLat
  },${partnerLng}`;

  return (
    <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-border shadow-md">
      <iframe
        src={mapUrl}
        className="w-full h-full"
        title="Live Delivery Map"
        loading="lazy"
      />
      {/* Overlay badge */}
      <div className="absolute top-3 left-3 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow text-xs font-semibold flex items-center gap-1.5 border border-border">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Live Tracking
      </div>
      <div className="absolute bottom-3 right-3 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-xl shadow text-xs text-gray-600 dark:text-gray-300 border border-border">
        📍 {station} Station
      </div>
    </div>
  );
}

// ── ETA Countdown ─────────────────────────────────────────────────────────────
function ETACountdown({ seconds }: { seconds: number }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return (
    <span className="font-mono font-bold text-accent text-2xl">
      {mins > 0 ? `${mins}m ` : ""}
      {String(secs).padStart(2, "0")}s
    </span>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function OrderTracking() {
  const { state, updateOrderStatus } = useApp();

  // Get active/recent orders
  const activeOrders = state.orders.filter(
    (o) => o.status !== "delivered"
  );
  const recentDelivered = state.orders
    .filter((o) => o.status === "delivered")
    .slice(-3)
    .reverse();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    activeOrders[0]?.id || state.orders[state.orders.length - 1]?.id || ""
  );

  const order = state.orders.find((o) => o.id === selectedOrderId);
  const vendor = state.vendors.find((v) => v.id === order?.vendorId);

  const [eta, setEta] = useState(order?.eta || 0);
  const isOutForDelivery = order?.status === "out_for_delivery";
  const isPreparing = order?.status === "preparing";

  // Partner simulation
  const partner = useMovingPartner(
    selectedOrderId,
    order?.station || "Lucknow",
    isOutForDelivery
  );

  // ETA countdown
  useEffect(() => {
    if (!order || order.status === "delivered") return;
    setEta(order.eta || 0);
  }, [selectedOrderId]);

  useEffect(() => {
    if (!isOutForDelivery || eta <= 0) return;
    const t = setInterval(() => setEta((e) => Math.max(0, e - 1)), 1000);
    return () => clearInterval(t);
  }, [isOutForDelivery, eta]);

  // Build tracking steps
  const getSteps = (): TrackingStep[] => {
    const statusOrder = ["placed", "preparing", "out_for_delivery", "delivered"];
    const currentIdx = statusOrder.indexOf(order?.status || "placed");

    return [
      {
        id: "placed",
        label: "Order Placed",
        subLabel: "Your order has been confirmed",
        icon: Package,
        status: currentIdx > 0 ? "done" : currentIdx === 0 ? "active" : "pending",
        time: order ? new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
      },
      {
        id: "preparing",
        label: "Preparing",
        subLabel: vendor ? `${vendor.name} is cooking your food` : "Vendor is preparing",
        icon: ChefHat,
        status: currentIdx > 1 ? "done" : currentIdx === 1 ? "active" : "pending",
      },
      {
        id: "out_for_delivery",
        label: "Out for Delivery",
        subLabel: `${partner.name} is on the way`,
        icon: Bike,
        status: currentIdx > 2 ? "done" : currentIdx === 2 ? "active" : "pending",
      },
      {
        id: "delivered",
        label: "Delivered",
        subLabel: "Show QR code to delivery partner",
        icon: CheckCircle2,
        status: currentIdx === 3 ? "done" : "pending",
      },
    ];
  };

  const steps = order ? getSteps() : [];

  // ── No orders ──────────────────────────────────────────────────────────────
  if (state.orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center bg-card rounded-2xl p-10 border border-border shadow-sm max-w-sm w-full">
          <Package className="h-14 w-14 text-muted-foreground mx-auto mb-4 opacity-40" />
          <h2 className="font-display text-xl font-bold mb-2">No Active Orders</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Place an order from the Passenger Portal to track it here.
          </p>
          <a
            href="/passenger"
            className="inline-block px-5 py-2.5 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:shadow-lg transition-all"
          >
            Order Food
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-3xl">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <MapPin className="h-6 w-6 text-accent" />
            Live Order Tracking
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time delivery partner location & ETA
          </p>
        </div>

        {/* ── Order Selector ───────────────────────────────────────────────── */}
        {state.orders.length > 1 && (
          <div className="mb-5 overflow-x-auto flex gap-2 pb-1">
            {state.orders
              .slice()
              .reverse()
              .slice(0, 5)
              .map((o) => (
                <button
                  key={o.id}
                  onClick={() => setSelectedOrderId(o.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    selectedOrderId === o.id
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-card text-muted-foreground border-border hover:border-accent/50"
                  }`}
                >
                  #{o.id.slice(-6)}
                  <span
                    className={`ml-1.5 capitalize ${
                      o.status === "delivered"
                        ? "text-green-500"
                        : "text-orange-400"
                    }`}
                  >
                    · {o.status.replace(/_/g, " ")}
                  </span>
                </button>
              ))}
          </div>
        )}

        {order && (
          <>
            {/* ── Order Info Card ───────────────────────────────────────────── */}
            <div className="bg-card rounded-2xl p-5 border border-border mb-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Order ID</p>
                  <p className="font-mono font-bold text-sm">#{order.id}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : order.status === "out_for_delivery"
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      : "bg-accent/10 text-accent"
                  }`}
                >
                  {order.status.replace(/_/g, " ")}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Station</p>
                  <p className="font-semibold">📍 {order.station}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Train</p>
                  <p className="font-semibold">🚂 {order.trainName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">PNR</p>
                  <p className="font-semibold font-mono">{order.pnr}</p>
                </div>
              </div>

              {/* Items */}
              <div className="mt-3 pt-3 border-t border-border text-sm text-muted-foreground">
                {order.items.map((i) => `${i.item.name} ×${i.qty}`).join(" · ")}
                <span className="ml-2 font-bold text-foreground">₹{order.total}</span>
              </div>
            </div>

            {/* ── ETA Banner ────────────────────────────────────────────────── */}
            {order.status !== "delivered" && (
              <div className="bg-card rounded-2xl p-4 border border-accent/30 mb-5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-accent/10 rounded-xl p-2.5">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Estimated Delivery</p>
                    <ETACountdown seconds={isOutForDelivery ? eta : order.eta} />
                  </div>
                </div>
                {isOutForDelivery && eta === 0 && (
                  <span className="text-green-600 font-bold text-sm animate-pulse">
                    Arriving Now!
                  </span>
                )}
                {!isOutForDelivery && (
                  <span className="text-xs text-muted-foreground">
                    Starts when out for delivery
                  </span>
                )}
              </div>
            )}

            {/* ── Live Map ─────────────────────────────────────────────────── */}
            {(isOutForDelivery || order.status === "delivered") && (
              <div className="mb-5">
                <p className="text-sm font-semibold mb-2 text-muted-foreground">
                  {order.status === "delivered"
                    ? "✅ Delivered at your seat"
                    : "🟢 Delivery partner live location"}
                </p>
                <LiveMap
                  station={order.station}
                  partnerLat={partner.lat}
                  partnerLng={partner.lng}
                />
              </div>
            )}

            {/* If preparing — show cook animation placeholder */}
            {isPreparing && (
              <div className="mb-5 bg-card rounded-2xl p-5 border border-border flex items-center gap-4">
                <div className="bg-orange-100 dark:bg-orange-900/30 rounded-xl p-3">
                  <ChefHat className="h-8 w-8 text-orange-500" />
                </div>
                <div>
                  <p className="font-semibold">{vendor?.name} is preparing your order</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Live map will appear once delivery partner picks up your order
                  </p>
                </div>
              </div>
            )}

            {/* ── Tracking Steps ────────────────────────────────────────────── */}
            <div className="bg-card rounded-2xl p-5 border border-border mb-5 shadow-sm">
              <h3 className="font-display font-semibold mb-5">Order Progress</h3>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-border" />

                <div className="space-y-5">
                  {steps.map((step) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.id} className="flex items-start gap-4 relative">
                        {/* Icon circle */}
                        <div
                          className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 transition-all ${
                            step.status === "done"
                              ? "bg-green-500 text-white"
                              : step.status === "active"
                              ? "bg-accent text-accent-foreground animate-pulse"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-0.5">
                          <div className="flex items-center justify-between">
                            <p
                              className={`font-semibold text-sm ${
                                step.status === "pending"
                                  ? "text-muted-foreground"
                                  : "text-foreground"
                              }`}
                            >
                              {step.label}
                              {step.status === "active" && (
                                <span className="ml-2 text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                                  In Progress
                                </span>
                              )}
                              {step.status === "done" && (
                                <span className="ml-2 text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-2 py-0.5 rounded-full">
                                  Done
                                </span>
                              )}
                            </p>
                            {step.time && (
                              <span className="text-xs text-muted-foreground">
                                {step.time}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {step.subLabel}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Delivery Partner Info ──────────────────────────────────────── */}
            {(isOutForDelivery || order.status === "delivered") && (
              <div className="bg-card rounded-2xl p-5 border border-border mb-5 shadow-sm">
                <h3 className="font-display font-semibold mb-3">Delivery Partner</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-lg font-bold text-accent">
                      {partner.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{partner.name}</p>
                      <p className="text-xs text-muted-foreground">{partner.phone}</p>
                    </div>
                  </div>
                  <a
                    href={`tel:${partner.phone}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm font-semibold hover:shadow transition-all"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                </div>
              </div>
            )}

            {/* ── QR Code ──────────────────────────────────────────────────── */}
            <div className="bg-card rounded-2xl p-5 border border-border mb-5 shadow-sm">
              <h3 className="font-display font-semibold mb-3">
                QR Code — Show to Delivery Partner
              </h3>
              <div className="flex items-center gap-5">
                <div className="bg-background rounded-xl p-4 border border-border flex flex-col items-center">
                  <QrCode className="h-14 w-14 text-foreground" />
                  <p className="font-mono text-xs font-bold mt-2">{order.qrCode}</p>
                </div>
                <div className="flex-1 text-sm text-muted-foreground">
                  <p className="mb-1">
                    Show this QR code when the delivery partner arrives at your seat.
                  </p>
                  <p className="text-xs">
                    Coach scan confirms delivery — vendor gets payout confirmation
                    automatically.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Revenue Split Info ────────────────────────────────────────── */}
            <div className="bg-card rounded-2xl p-5 border border-border mb-5 shadow-sm">
              <h3 className="font-display font-semibold mb-3">Payment Breakdown</h3>
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div className="bg-background rounded-xl p-3 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Vendor Payout</p>
                  <p className="font-bold text-green-600 dark:text-green-400 text-lg">
                    ₹{order.revenueSplit.vendor}
                  </p>
                  <p className="text-xs text-muted-foreground">T+1 day</p>
                </div>
                <div className="bg-background rounded-xl p-3 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Platform Fee</p>
                  <p className="font-bold text-accent text-lg">
                    ₹{order.revenueSplit.platform}
                  </p>
                  <p className="text-xs text-muted-foreground">7%</p>
                </div>
                <div className="bg-background rounded-xl p-3 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">IRCTC Share</p>
                  <p className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                    ₹{order.revenueSplit.irctc}
                  </p>
                  <p className="text-xs text-muted-foreground">3%</p>
                </div>
              </div>
            </div>

            {/* ── Admin: Update Status (for demo) ───────────────────────────── */}
            {order.status !== "delivered" && (
              <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                <h3 className="font-display font-semibold mb-3 text-muted-foreground text-sm">
                  Demo Controls — Update Order Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { status: "placed", label: "Placed" },
                      { status: "preparing", label: "Preparing" },
                      { status: "out_for_delivery", label: "Out for Delivery" },
                      { status: "delivered", label: "Delivered" },
                    ] as const
                  ).map((s) => (
                    <button
                      key={s.status}
                      onClick={() => updateOrderStatus(order.id, s.status)}
                      disabled={order.status === s.status}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        order.status === s.status
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-background text-muted-foreground border-border hover:border-accent/50"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Delivered State ───────────────────────────────────────────── */}
            {order.status === "delivered" && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center shadow-sm">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h2 className="font-display text-xl font-bold text-green-700 dark:text-green-400 mb-1">
                  Delivered Successfully!
                </h2>
                <p className="text-sm text-green-600 dark:text-green-500 mb-4">
                  Enjoy your meal! Vendor payout initiated.
                </p>
                <a
                  href="/passenger"
                  className="inline-block px-5 py-2.5 rounded-xl bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition-all"
                >
                  Order Again
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}