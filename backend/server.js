const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());

/* ---------------- MONGODB ---------------- */
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error ❌", err));

/* ---------------- RAZORPAY INIT ---------------- */
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.log("❌ Razorpay ENV missing");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.json({ message: "Backend working 🚀" });
});

/* ---------------- CREATE ORDER (FIXED) ---------------- */
app.post("/api/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        error: "Amount is required",
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    // 🔥 IMPORTANT: CLEAN RESPONSE (prevents JSON crash)
    return res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });

  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to create order",
    });
  }
});

/* ---------------- VERIFY PAYMENT ---------------- */
app.post("/api/verify-payment", (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;

    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      return res.json({
        success: true,
        message: "Payment verified",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }
  } catch (error) {
    console.log("VERIFY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
});

/* ---------------- SAVE ORDER ---------------- */
let orders = [];

app.post("/api/save-order", (req, res) => {
  try {
    orders.push(req.body);

    return res.json({
      success: true,
      message: "Order saved",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Save failed",
    });
  }
});

/* ---------------- GET ORDERS ---------------- */
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT, "🚀");
});