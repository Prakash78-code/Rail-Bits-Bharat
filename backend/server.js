const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());

/* ---------------- MONGODB CONNECTION ---------------- */
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error ❌", err));

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

/* ---------------- AI FORECAST API ---------------- */
app.get("/forecast", (req, res) => {
  try {
    const demand = Math.floor(150 + Math.random() * 300);

    return res.json({
      success: true,
      data: {
        demand,
        station: "Delhi",
        message: "AI forecast generated successfully 🚆",
      }
    });

  } catch (error) {
    console.log("FORECAST ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Forecast error",
    });
  }
});

/* ---------------- CREATE ORDER ---------------- */
app.post("/create-order", (req, res) => {
  try {
    const orderData = req.body;

    console.log("Order received:", orderData);

    if (!orderData || !orderData.total) {
      return res.json({
        success: false,
        error: "Total is required",
      });
    }

    const savedOrder = {
      ...orderData,
      id: "order_" + Date.now(),
      status: "placed",
    };

    return res.json({
      success: true,
      order: savedOrder,
    });

  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

/* ---------------- PAYMENT VERIFY ---------------- */
app.post("/verify-payment", (req, res) => {
  try {
    const { order_id, payment_id } = req.body;

    return res.json({
      success: true,
      message: "Payment successful (FAKE)",
      order_id: order_id || "fake_order",
      payment_id: payment_id || "fake_payment",
    });

  } catch (error) {
    console.log("VERIFY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
});

/* ---------------- ORDERS STORAGE (TEMP) ---------------- */
let orders = [];

app.post("/save-order", (req, res) => {
  orders.push(req.body);
  res.json({ success: true });
});

app.get("/orders", (req, res) => {
  res.json(orders);
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT, "🚀");
});