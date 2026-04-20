const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🗄️ Temporary DB (array)
let orders = [];

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// ✅ Create Order
app.post("/create-order", (req, res) => {
  try {
    const order = req.body;

    if (!order || !order.total) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    orders.push(order);

    res.json({
      success: true,
      message: "Order saved",
      order,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/orders", (req, res) => {
  res.json(orders);
});

app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});