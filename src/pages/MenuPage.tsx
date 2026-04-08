import { useState } from "react";
import { createInitialVendors, MenuItem } from "../data/mockData";
import { useCartStore } from "../store/cartStore";

const MenuPage = () => {
  const [vendors] = useState(createInitialVendors());
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Rail Bites Menu</h1>

      {vendors.map((vendor) => (
        <div key={vendor.id} className="border p-4 mb-4">
          <h2 className="text-xl font-semibold">{vendor.name}</h2>
          <p>{vendor.station}</p>

          {vendor.menu.map((item: MenuItem) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name} - ₹{item.price}</span>

              <button onClick={() => addToCart(item)}>
                Add
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MenuPage;