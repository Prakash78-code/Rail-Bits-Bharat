import { useState } from "react";
import { useCartStore } from "../store/cartStore";
import { useNavigate } from "react-router-dom";
import {
  generateOrderId,
  generateQR,
  calculateRevenueSplit,
} from "../data/mockData";

const CheckoutPage = () => {
  const { cart } = useCartStore();
  const navigate = useNavigate(); // 🔥 NEW

  const [name, setName] = useState("");
  const [train, setTrain] = useState("");
  const [seat, setSeat] = useState("");

  const total = cart.reduce(
    (sum, c) => sum + c.item.price * c.qty,
    0
  );

  const handleOrder = () => {
    // ❗ validation
    if (!name || !train || !seat) {
      alert("Please fill all details ❗");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty ❗");
      return;
    }

    const order = {
      id: generateOrderId(),
      items: cart,
      total,
      qr: generateQR(),
      revenue: calculateRevenueSplit(total),
      name,
      train,
      seat,
      status: "placed",
    };

    // 🔥 redirect to Order Summary
    navigate("/order-summary", { state: order });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* FORM */}
      <input
        type="text"
        placeholder="Your Name"
        className="border p-2 mb-2 w-full rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
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

      {/* TOTAL */}
      <h2 className="font-bold mt-3 text-lg">
        Total: ₹{total}
      </h2>

      {/* ORDER BUTTON */}
      <button
        onClick={handleOrder}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mt-4 rounded w-full"
      >
        Place Order
      </button>
    </div>
  );
};

export default CheckoutPage;