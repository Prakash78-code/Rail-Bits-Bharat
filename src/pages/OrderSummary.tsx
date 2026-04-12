import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const OrderSummary = () => {
  const location = useLocation();
  const order = location.state;

  // 🚚 Live Tracking
  const [status, setStatus] = useState("Preparing");

  useEffect(() => {
    const timer1 = setTimeout(() => setStatus("Out for Delivery 🚚"), 5000);
    const timer2 = setTimeout(() => setStatus("Delivered ✅"), 10000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!order) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-xl font-bold">No order found ❌</h1>
        <Link to="/menu">
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Go to Menu
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">

      <h1 className="text-2xl font-bold mb-4 text-center">
        🚆 Order Summary
      </h1>

      {/* 🔹 Order Info */}
      <div className="bg-gray-100 p-3 rounded mb-3 text-sm">
        <p><b>Order ID:</b> {order.id}</p>
        <p><b>Name:</b> {order.name}</p>
        <p><b>PNR:</b> {order.pnr}</p>
        <p><b>Train:</b> {order.train}</p>
        <p><b>Seat:</b> {order.seat}</p>
        <p><b>Station:</b> {order.station}</p>
      </div>

      {/* 🔹 Items */}
      <h2 className="mt-3 font-semibold text-lg">🍱 Items:</h2>
      <div className="bg-gray-50 p-3 rounded">
        {order.items.map((c: any, index: number) => (
          <div key={index} className="flex justify-between border-b py-1">
            <span>
              {c.item.name} × {c.qty}
            </span>
            <span>₹{c.item.price * c.qty}</span>
          </div>
        ))}
      </div>

      {/* 🔹 Total */}
      <h2 className="mt-4 text-lg font-bold text-right">
        Total: ₹{order.total}
      </h2>

      {/* 🚚 Live Status */}
      <div className="mt-4 text-center">
        <p className="font-semibold text-blue-600">
          Status: {status}
        </p>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              status.includes("Preparing")
                ? "w-1/3 bg-yellow-500"
                : status.includes("Delivery")
                ? "w-2/3 bg-blue-500"
                : "w-full bg-green-500"
            }`}
          />
        </div>
      </div>

      {/* 🔹 Success */}
      <p className="mt-3 text-green-600 font-semibold text-center">
        🎉 Order Placed Successfully
      </p>

      {/* 🔹 Back Button */}
      <Link to="/menu">
        <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full">
          Back to Menu
        </button>
      </Link>
    </div>
  );
};

export default OrderSummary;