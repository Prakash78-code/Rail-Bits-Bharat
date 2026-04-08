import { useCartStore } from "../store/cartStore";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart } = useCartStore();

  const total = cart.reduce(
    (sum, c) => sum + c.item.price * c.qty,
    0
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cart.length === 0 ? (
        <p>
          Cart is empty 😢 <Link to="/menu">Go to Menu</Link>
        </p>
      ) : (
        <>
          {cart.map((c) => (
            <div
              key={c.item.id}
              className="flex justify-between border p-3 mb-2"
            >
              <div>
                <p className="font-medium">{c.item.name}</p>
                <p>₹{c.item.price} × {c.qty}</p>
              </div>

              <button
                onClick={() => removeFromCart(c.item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}

          {/* TOTAL */}
          <h2 className="text-xl font-bold mt-4">
            Total: ₹{total}
          </h2>

          {/* CHECKOUT BUTTON */}
          <Link to="/checkout">
            <button className="bg-green-500 text-white px-4 py-2 mt-4 rounded">
              Proceed to Checkout
            </button>
          </Link>
        </>
      )}
    </div>
  );
};

export default CartPage;