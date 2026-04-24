import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MenuItem } from "@/data/mockData";

interface CartItem {
  item: MenuItem;
  qty: number;
  vendorId: string;
}

interface CartStore {
  items: CartItem[];
  vendorId: string | null;
  stationName: string;
  addItem: (item: MenuItem, vendorId: string) => void;
  removeItem: (itemId: string) => void;
  updateQty: (itemId: string, qty: number) => void;
  clearCart: () => void;
  setStation: (name: string) => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      vendorId: null,
      stationName: "",
      addItem: (item, vendorId) =>
        set(state => {
          if (state.vendorId && state.vendorId !== vendorId) {
            // New vendor — clear cart first
            return { items: [{ item, qty: 1, vendorId }], vendorId };
          }
          const existing = state.items.find(i => i.item.id === item.id);
          if (existing) {
            return { items: state.items.map(i => i.item.id === item.id ? { ...i, qty: i.qty + 1 } : i) };
          }
          return { items: [...state.items, { item, qty: 1, vendorId }], vendorId };
        }),
      removeItem: itemId =>
        set(state => {
          const filtered = state.items.filter(i => i.item.id !== itemId);
          return { items: filtered, vendorId: filtered.length === 0 ? null : state.vendorId };
        }),
      updateQty: (itemId, qty) =>
        set(state => ({
          items: qty <= 0
            ? state.items.filter(i => i.item.id !== itemId)
            : state.items.map(i => i.item.id === itemId ? { ...i, qty } : i),
        })),
      clearCart: () => set({ items: [], vendorId: null, stationName: "" }),
      setStation: name => set({ stationName: name }),
      getTotal: () => get().items.reduce((s, i) => s + i.item.price * i.qty, 0),
    }),
    { name: "railbite-cart" }
  )
);