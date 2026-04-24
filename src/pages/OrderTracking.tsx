import { useState, useEffect } from "react";
import { useApp } from "@/store/AppContext";
import {
  MapPin,
  Clock,
  CheckCircle2,
  Package,
  Bike,
  ChefHat,
  QrCode,
  Phone,
} from "lucide-react";

import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// STATIONS
// ─────────────────────────────────────────────
const STATION_COORDS: Record<string, { lat: number; lng: number }> = {
  Lucknow: { lat: 26.8467, lng: 80.9462 },
  Kanpur: { lat: 26.4499, lng: 80.3319 },
  Allahabad: { lat: 25.4358, lng: 81.8463 },
  Varanasi: { lat: 25.3176, lng: 82.9739 },
  Patna: { lat: 25.5941, lng: 85.1376 },
  Delhi: { lat: 28.6139, lng: 77.2090 },
};

// ─────────────────────────────────────────────
// 🚀 REAL FIREBASE TRACKING HOOK
// ─────────────────────────────────────────────
function useMovingPartner(orderId: string, active: boolean): DeliveryPartner {
  const [pos, setPos] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    if (!active || !orderId) return;

    const ref = doc(db, "orders", orderId);

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();

        if (data?.location) {
          setPos({
            lat: data.location.lat,
            lng: data.location.lng,
          });
        }
      }
    });

    return () => unsub();
  }, [orderId, active]);

  return {
    id: orderId,
    name: "Raju Delivery",
    phone: "+91 98765 43210",
    lat: pos.lat,
    lng: pos.lng,
  };
}

// ─────────────────────────────────────────────
// MAP
// ─────────────────────────────────────────────
function LiveMap({
  station,
  lat,
  lng,
}: {
  station: string;
  lat: number;
  lng: number;
}) {
  const base = STATION_COORDS[station] || STATION_COORDS["Delhi"];

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    base.lng - 0.01
  },${base.lat - 0.01},${base.lng + 0.01},${base.lat + 0.01}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className="relative w-full h-64 rounded-2xl overflow-hidden border">
      <iframe src={mapUrl} className="w-full h-full" title="map" />

      <div className="absolute top-2 left-2 bg-white px-2 py-1 text-xs rounded">
        🔴 Live Tracking
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ETA
// ─────────────────────────────────────────────
function ETACountdown({ seconds }: { seconds: number }) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return (
    <span className="font-mono font-bold text-accent text-2xl">
      {m > 0 ? `${m}m ` : ""}
      {String(s).padStart(2, "0")}s
    </span>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function OrderTracking() {
  const { state, updateOrderStatus } = useApp();

  const activeOrders = state.orders.filter((o) => o.status !== "delivered");

  const [selectedOrderId, setSelectedOrderId] = useState(
    activeOrders[0]?.id || state.orders?.[0]?.id || ""
  );

  const order = state.orders.find((o) => o.id === selectedOrderId);
  const vendor = state.vendors.find((v) => v.id === order?.vendorId);

  const isOut = order?.status === "out_for_delivery";
  const isPrep = order?.status === "preparing";

  // 🚚 REAL PARTNER
  const partner = useMovingPartner(selectedOrderId, isOut);

  const [eta, setEta] = useState(order?.eta || 0);

  useEffect(() => {
    if (!order) return;
    setEta(order.eta || 0);
  }, [selectedOrderId]);

  useEffect(() => {
    if (!isOut || eta <= 0) return;

    const t = setInterval(() => {
      setEta((e) => Math.max(0, e - 1));
    }, 1000);

    return () => clearInterval(t);
  }, [isOut, eta]);

  if (!order) return <div className="p-10">No Order Found</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">

      {/* HEADER */}
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <MapPin /> Live Tracking
      </h1>

      {/* ORDER INFO */}
      <div className="mt-4 border p-4 rounded-xl">
        <p>Status: {order.status}</p>
        <p>Station: {order.station}</p>
        <p>Train: {order.trainName}</p>
        <p>PNR: {order.pnr}</p>
      </div>

      {/* ETA */}
      {order.status !== "delivered" && (
        <div className="mt-4">
          <ETACountdown seconds={eta} />
        </div>
      )}

      {/* MAP */}
      {(isOut || order.status === "delivered") && (
        <div className="mt-4">
          <LiveMap
            station={order.station}
            lat={partner.lat}
            lng={partner.lng}
          />
        </div>
      )}

      {/* STEPS */}
      <div className="mt-5 space-y-3">
        {["placed", "preparing", "out_for_delivery", "delivered"].map(
          (st) => (
            <button
              key={st}
              onClick={() => updateOrderStatus(order.id, st)}
              className="px-3 py-1 border rounded mr-2"
            >
              {st}
            </button>
          )
        )}
      </div>

      {/* DELIVERY PARTNER */}
      {isOut && (
        <div className="mt-4 border p-4 rounded-xl flex justify-between">
          <div>
            <p className="font-bold">{partner.name}</p>
            <p className="text-sm">{partner.phone}</p>
          </div>
          <a
            href={`tel:${partner.phone}`}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Call
          </a>
        </div>
      )}

      {/* PREPARING */}
      {isPrep && (
        <div className="mt-4 p-4 border rounded-xl">
          {vendor?.name} is preparing your order...
        </div>
      )}

      {/* DELIVERED */}
      {order.status === "delivered" && (
        <div className="mt-5 text-green-600 font-bold">
          Delivered Successfully ✅
        </div>
      )}

    </div>
  );
}