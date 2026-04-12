import { useState } from "react";
import { useCartStore } from "../store/cartStore";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { cart } = useCartStore();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [pnr, setPnr] = useState("");
  const [train, setTrain] = useState("");
  const [seat, setSeat] = useState("");
  const [station, setStation] = useState("");

  const total = cart.reduce(
    (sum, c) => sum + c.item.price * c.qty,
    0
  );

  const handleOrder = () => {
    // ❗ validation
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

    // ✅ NO BACKEND → direct order
    const order = {
      id: Date.now(),
      items: cart,
      total,
      name,
      pnr,
      train,
      seat,
      station,
      status: "placed",
    };

    alert("Order Placed Successfully 🚆🍱");

    navigate("/order-summary", { state: order });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Train Order Details</h1>

      <input
        type="text"
        placeholder="Your Name"
        className="border p-2 mb-2 w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="PNR (10 digits)"
        className="border p-2 mb-2 w-full"
        value={pnr}
        onChange={(e) => setPnr(e.target.value)}
      />

      <input
        type="text"
        placeholder="Train Number"
        className="border p-2 mb-2 w-full"
        value={train}
        onChange={(e) => setTrain(e.target.value)}
      />

      <input
        type="text"
        placeholder="Seat Number"
        className="border p-2 mb-2 w-full"
        value={seat}
        onChange={(e) => setSeat(e.target.value)}
      />

      <select
        className="border p-2 mb-2 w-full"
        value={station}
        onChange={(e) => setStation(e.target.value)}
      >
        <option value="">Select Station</option>
        <option value="Delhi">Delhi</option>
        <option value="Kanpur">Kanpur</option>
        <option value="Prayagraj">Prayagraj</option>
        <option value="Varanasi">Varanasi</option>
      </select>

      <h2 className="font-bold mt-3">
        Total: ₹{total}
      </h2>

      <button
        onClick={handleOrder}
        className="bg-green-500 text-white px-4 py-2 mt-4 w-full"
      >
        Place Order 🚆
      </button>
    </div>
  );
};

export default CheckoutPage;