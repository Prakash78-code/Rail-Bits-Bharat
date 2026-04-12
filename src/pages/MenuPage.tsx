import { useState } from "react";
import { createInitialVendors, MenuItem } from "../data/mockData";
import { useCartStore } from "../store/cartStore";

const MenuPage = () => {
  const [vendors] = useState(createInitialVendors());
  const [search, setSearch] = useState("");

  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);

  const allItems = vendors.flatMap((v) => v.menu);

  // 🔍 Search
  const filterItems = (items: MenuItem[]) => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  };

  // 🤖 Recommendation
  const getRecommendations = () => {
    if (cart.length === 0) return allItems.slice(0, 4);

    const lastItem = cart[cart.length - 1].item.name.toLowerCase();

    return allItems.filter((item) =>
      item.name.toLowerCase().includes(lastItem.split(" ")[0])
    );
  };

  const recommended = getRecommendations();

  return (
    <div className="p-4 max-w-5xl mx-auto">

      <h1 className="text-2xl font-bold mb-4 text-center">
        🍱 Rail Bites Menu
      </h1>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="🔍 Search food..."
        className="border p-2 mb-4 w-full rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 🤖 Recommended */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          🤖 Recommended for you
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {recommended
            .filter((item) =>
              item.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((item) => (
              <div
                key={item.id}
                className="border rounded-xl p-3 shadow hover:shadow-md transition"
              >
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">₹{item.price}</p>

                <button
                  onClick={() => addToCart(item)}
                  className="bg-green-500 text-white w-full mt-2 py-1 rounded"
                >
                  Add
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* 🏪 Vendors */}
      {vendors.map((vendor) => {
        const filteredMenu = filterItems(vendor.menu);

        if (filteredMenu.length === 0) return null;

        return (
          <div key={vendor.id} className="mb-6">
            
            {/* Vendor Header */}
            <h2 className="text-xl font-semibold">
              {vendor.name}
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              📍 {vendor.station}
            </p>

            {/* 🔥 SAME CARD GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {filteredMenu.map((item: MenuItem) => (
                <div
                  key={item.id}
                  className="border rounded-xl p-3 shadow hover:shadow-md transition"
                >
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">₹{item.price}</p>

                  <button
                    onClick={() => addToCart(item)}
                    className="bg-blue-500 hover:bg-blue-600 text-white w-full mt-2 py-1 rounded"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* ❌ No Result */}
      {vendors.every(
        (v) => filterItems(v.menu).length === 0
      ) && (
        <p className="text-center text-gray-500 mt-6">
          ❌ No food found
        </p>
      )}
    </div>
  );
};

export default MenuPage;