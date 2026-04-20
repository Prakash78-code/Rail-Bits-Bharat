import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.VITE_RAZORPAY_KEY_ID || "rzp_test_demokey",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "demosecret12345",
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// ─── In-Memory Store ──────────────────────────────────────────────────────────
const orders: Record<string, { status: string; vendorId: string; total: number; createdAt: number }> = {};
const payouts: { vendorId: string; amount: number; status: string; orderId: string }[] = [];

// ─── Haversine for geofencing ─────────────────────────────────────────────────
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health
app.get("/health", (_req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

// PNR Lookup (mock)
app.get("/api/pnr/:pnr", (req, res) => {
  const mock: Record<string, object> = {
    "2847501234": { trainName: "Mumbai Rajdhani", trainNumber: "12951", coach: "A1", seat: "32", stations: ["Bhopal Junction","Nagpur Junction","Mumbai Central"] },
    "3921847563": { trainName: "Howrah Rajdhani", trainNumber: "12301", coach: "B2", seat: "15", stations: ["Kanpur Central","Prayagraj Junction","Varanasi Junction","Howrah Junction"] },
  };
  const data = mock[req.params.pnr];
  if (!data) return res.status(404).json({ error: "PNR not found" });
  res.json(data);
});

// Payment: Create Order
app.post("/api/payments/create-order", async (req, res) => {
  const { amount, vendorId, orderId } = req.body;
  if (!amount || !vendorId || !orderId) return res.status(400).json({ error: "Missing fields" });

  try {
    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: "INR",
      receipt: orderId,
    };
    const rzpOrder = await razorpay.orders.create(options);
    orders[orderId] = { status: "created", vendorId, total: amount, createdAt: Date.now() };
    
    res.json({ 
      orderId: rzpOrder.id, 
      amount: rzpOrder.amount, 
      currency: rzpOrder.currency, 
      key: process.env.VITE_RAZORPAY_KEY_ID || "rzp_test_demokey" 
    });
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ error: "Payment creation failed" });
  }
});

// Payment: Verify Client Signature
app.post("/api/payments/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, internal_order_id } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET || "demosecret12345";
  
  const generated_signature = crypto
    .createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    // Payment is successful and verified
    if (orders[internal_order_id]) orders[internal_order_id].status = "paid";
    res.json({ success: true, message: "Payment verified successfully" });
  } else {
    res.status(400).json({ success: false, error: "Invalid signature" });
  }
});

// Payment: Razorpay Webhook (Server-to-Server)
app.post("/api/payments/webhook", (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "demowebhooksecret";
  const signature = req.headers["x-razorpay-signature"] as string;

  const generated_signature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (generated_signature === signature) {
    const event = req.body.event;
    if (event === "payment.captured") {
      const paymentEntity = req.body.payload.payment.entity;
      console.log(`Payment captured: ${paymentEntity.id} for order ${paymentEntity.order_id}`);
      // In a real DB, look up internal order by razorpay_order_id and mark as paid.
    }
    res.status(200).json({ status: "ok" });
  } else {
    res.status(400).json({ status: "invalid signature" });
  }
});

// Payment: Refund
app.post("/api/payments/refund", (req, res) => {
  const { orderId, reason } = req.body;
  const order = orders[orderId];
  if (!order) return res.status(404).json({ error: "Order not found" });
  const refundAmount = order.status === "preparing" ? Math.round(order.total * 0.5) : order.total;
  res.json({ refundId: `rfnd_${Date.now()}`, amount: refundAmount, reason });
});

// Payment History
app.get("/api/payments/history/:userId", (_req, res) => {
  res.json({ orders: Object.entries(orders).map(([id, o]) => ({ id, ...o })) });
});

// Payout: Trigger (admin/cron)
app.post("/api/payouts/trigger", (req, res) => {
  const COMMISSION_RATE = 0.08;
  let processed = 0;
  Object.entries(orders).forEach(([orderId, order]) => {
    if (order.status === "delivered") {
      const vendorAmount = Math.round(order.total * (1 - COMMISSION_RATE));
      payouts.push({ vendorId: order.vendorId, amount: vendorAmount, status: "processing", orderId });
      processed++;
    }
  });
  res.json({ processed, message: `${processed} payouts initiated` });
});

// Payout: Vendor History
app.get("/api/payouts/vendor/:vendorId", (req, res) => {
  const vendorPayouts = payouts.filter(p => p.vendorId === req.params.vendorId);
  res.json({ payouts: vendorPayouts, total: vendorPayouts.reduce((s, p) => s + p.amount, 0) });
});

// Forecast: Predict
app.post("/api/forecast/predict", (req, res) => {
  const { stationCode, dayOfWeek, timeSlot } = req.body;
  // Simulated brain.js output (replace with actual trained model in production)
  const baseOrders: Record<string, number> = { NDLS: 120, HWH: 95, MAS: 80, BCT: 110, LKO: 65 };
  const slotMultipliers: Record<string, number> = { breakfast: 0.7, lunch: 1.3, dinner: 1.1 };
  const base = baseOrders[stationCode] ?? 50;
  const multiplier = slotMultipliers[timeSlot] ?? 1;
  const isWeekend = [0, 6].includes(dayOfWeek);
  const predicted = Math.round(base * multiplier * (isWeekend ? 1.4 : 1));

  res.json({
    stationCode,
    dayOfWeek,
    timeSlot,
    predictions: [
      { category: "Biryani", predictedOrders: Math.round(predicted * 0.3), confidence: 0.87 },
      { category: "Thali", predictedOrders: Math.round(predicted * 0.2), confidence: 0.74 },
      { category: "Snacks", predictedOrders: Math.round(predicted * 0.3), confidence: 0.91 },
      { category: "Beverages", predictedOrders: Math.round(predicted * 0.5), confidence: 0.95 },
      { category: "Desserts", predictedOrders: Math.round(predicted * 0.1), confidence: 0.61 },
    ],
    totalPredicted: predicted,
    modelVersion: "1.0.0-brainjs",
  });
});

// Forecast: Accuracy
app.get("/api/forecast/accuracy", (_req, res) => {
  res.json({ accuracy: 0.82, mae: 6.4, rmse: 8.2, lastTrainedAt: new Date(Date.now() - 86400000).toISOString(), sampleSize: 1200 });
});

// Geofencing check
app.post("/api/geo/check-arrival", (req, res) => {
  const { partnerLat, partnerLng, stationLat, stationLng, orderId } = req.body;
  const distKm = haversineKm(partnerLat, partnerLng, stationLat, stationLng);
  const arrived = distKm <= 0.05; // 50m
  if (arrived && orderId) io.emit("order:arrived", { orderId });
  res.json({ distanceKm: distKm, arrived });
});

// ─── Socket.io ────────────────────────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("location:update", (data: { orderId: string; lat: number; lng: number }) => {
    io.emit(`tracking:${data.orderId}`, { lat: data.lat, lng: data.lng, timestamp: Date.now() });
  });

  socket.on("order:status", (data: { orderId: string; status: string }) => {
    io.emit(`order:${data.orderId}`, { status: data.status, timestamp: Date.now() });
  });

  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

server.listen(PORT, () => console.log(`🚂 RailBite API running on http://localhost:${PORT}`));
