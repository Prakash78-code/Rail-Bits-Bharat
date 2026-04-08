import { useLocation, Link } from "react-router-dom";

const OrderSummary = () => {
  const location = useLocation();
  const order = location.state;

  if (!order) {
    return <p>No order found</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Order Summary</h1>

      {/* Order Info */}
      <p><b>Order ID:</b> {order.id}</p>
      <p><b>Name:</b> {order.name}</p>
      <p><b>Train:</b> {order.train}</p>
      <p><b>Seat:</b> {order.seat}</p>

      {/* Items */}
      <h2 className="mt-4 font-semibold">Items:</h2>
      {order.items.map((c: any, index: number) => (
        <div key={index}>
          {c.item.name} × {c.qty} = ₹{c.item.price * c.qty}
        </div>
      ))}

      {/* Total */}
      <h2 className="mt-4 font-bold">Total: ₹{order.total}</h2>

      {/* QR */}
      <p className="mt-2">QR Code: {order.qr}</p>

      {/* Status */}
      <p className="mt-2 text-green-600 font-semibold">
        Status: Order Placed ✅
      </p>

      <Link to="/menu">
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Back to Menu
        </button>
      </Link>
    </div>
  );
};

export default OrderSummary;