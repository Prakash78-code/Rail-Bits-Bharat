import { useState } from "react";
import { useCartStore } from "../store/cartStore";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [pnr, setPnr] = useState("");
  const [train, setTrain] = useState("");
  const [seat, setSeat] = useState("");
  const [station, setStation] = useState("");

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const total = cart.reduce(
    (sum, c) => sum + c.item.price * c.qty,
    0
  );

  const applyCoupon = () => {
    if (coupon === "SAVE50") {
      setDiscount(50);
      alert("Coupon Applied ✅ ₹50 OFF");
    } else if (coupon === "SAVE10") {
      setDiscount(total * 0.1);
      alert("10% Discount Applied ✅");
    } else {
      alert("Invalid Coupon ❌");
    }
  };

  const finalTotal = total - discount;

  // 🚀 FINAL ORDER FUNCTION (FIXED)
  const handleOrder = async () => {
    try {
      if (!name || !pnr || !train || !seat || !station) {
        alert("Please fill all details ❗");
        return;
      }

      if (pnr.length !== 10) {
        alert("PNR must be 10 digits ❗");
        return;
      }

      if (cart.length === 0) {
        alert("Cart is empty ❗");
        return;
      }

      // ✅ FINAL ORDER OBJECT (SOURCE OF TRUTH)
      const finalOrder = {
        id: Date.now(),
        items: cart,
        total: finalTotal,
        name,
        pnr,
        train,
        seat,
        station,
        status: "placed",
      };

      const res = await fetch("https://rail-bits-bharat.onrender.com/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalOrder),
      });

      const data = await res.json();

      console.log("BACKEND RESPONSE:", data);

      if (data.success) {
        alert("Order Placed Successfully 🚆🍱");

        clearCart();

        // 🔥 IMPORTANT FIX (no undefined issue)
        navigate("/order-summary", {
          state: finalOrder,
        });

      } else {
        alert(data.error || "Order Failed ❌");
      }

    } catch (err) {
      console.error("❌ ERROR:", err);
      alert("Server Error ❌");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">

      <h1 className="text-2xl font-bold mb-4 text-center">
        🚆 Train Order Details
      </h1>

      <input
        type="text"
        placeholder="Your Name"
        className="border p-2 mb-2 w-full rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="PNR (10 digits)"
        className="border p-2 mb-2 w-full rounded"
        value={pnr}
        onChange={(e) => setPnr(e.target.value)}
      />

      <input
        type="text"
        placeholder="Train Number"
        className="border p-2 mb-2 w-full rounded"
        value={train}
        onChange={(e) => setTrain(e.target.value)}
      />

      <input
        type="text"
        placeholder="Seat Number"
        className="border p-2 mb-2 w-full rounded"
        value={seat}
        onChange={(e) => setSeat(e.target.value)}
      />

      <select
        className="border p-2 mb-2 w-full rounded"
        value={station}
        onChange={(e) => setStation(e.target.value)}
      >
        <option value="">Select Station</option>
        <option value="Delhi">Delhi</option>
        <option value="Kanpur">Kanpur</option>
        <option value="Prayagraj">Prayagraj</option>
        <option value="Varanasi">Varanasi</option>
      </select>

      {/* Coupon */}
      <div className="mt-3">
        <input
          type="text"
          placeholder="Coupon (SAVE50 / SAVE10)"
          className="border p-2 w-full rounded"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
        />

        <button
          onClick={applyCoupon}
          className="bg-yellow-500 text-white px-3 py-1 mt-2 w-full rounded"
        >
          Apply Coupon
        </button>
      </div>

      {/* Total */}
      <div className="mt-4">
        <p>Total: ₹{total}</p>
        <p className="text-green-600">Discount: ₹{discount}</p>
        <h2 className="font-bold text-lg">
          Final: ₹{finalTotal}
        </h2>
      </div>

      {/* Order Button */}
      <button
        onClick={handleOrder}
        className="bg-green-600 text-white px-4 py-2 mt-4 w-full rounded"
      >
        Place Order 🚆
      </button>

    </div>
  );
};

export default CheckoutPage;