import { useLocation, Link } from "react-router-dom";

const OrderSummary = () => {
  const location = useLocation();
  const order = location.state;

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
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        🚆 Order Summary
      </h1>

      {/* 🔹 Order Info */}
      <div className="bg-gray-100 p-3 rounded mb-3">
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
          <div key={index} className="flex justify-between">
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

      {/* 🔹 Status */}
      <p className="mt-3 text-green-600 font-semibold text-center">
        ✅ Order Placed Successfully
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