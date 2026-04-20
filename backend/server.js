const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🏠 Test route
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

// 🧾 CREATE ORDER (FIXED FOR YOUR FRONTEND)
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
      success: true,        // ✅ IMPORTANT FIX
      order: savedOrder,    // ✅ frontend expects this
    });

  } catch (error) {
    console.log("ERROR:", error);

    return res.json({
      success: false,
      error: "Server error",
    });
  }
});

// 💳 FAKE PAYMENT VERIFY
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

    return res.json({
      success: false,
      message: "Verification failed",
    });
  }
});

// 👀 Orders store (optional)
let orders = [];

app.post("/save-order", (req, res) => {
  orders.push(req.body);
  res.json({ success: true });
});

app.get("/orders", (req, res) => {
  res.json(orders);
});

// 🚀 START SERVER
const PORT = 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT, "🚀");
});