import { create } from "zustand";
import { MenuItem } from "../data/mockData";

type CartItem = {
  item: MenuItem;
  qty: number;
};

type CartState = {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
};

export const useCartStore = create<CartState>((set) => ({
  cart: [],

  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find((c) => c.item.id === item.id);

      if (existing) {
        return {
          cart: state.cart.map((c) =>
            c.item.id === item.id
              ? { ...c, qty: c.qty + 1 }
              : c
          ),
        };
      }

      return {
        cart: [...state.cart, { item, qty: 1 }],
      };
    }),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((c) => c.item.id !== id),
    })),
}));